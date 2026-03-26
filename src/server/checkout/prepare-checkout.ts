import type Stripe from 'stripe';

import { client } from '@/sanity/server-client';

export class CheckoutValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CheckoutValidationError';
  }
}

interface NormalizedCheckoutItem {
  productId: string;
  quantity: number;
  size?: string;
}

interface CheckoutProduct {
  _id: string;
  name?: string;
  slug?: { current?: string };
  price?: number;
  externalUrl?: string;
  isAvailable?: boolean;
  sizes?: string[];
  primaryImage?: string;
}

interface PreparedCheckoutPayload {
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
  metadataItems: Array<{
    product_id: string;
    quantity: number;
    price: number;
    size: string;
  }>;
}

const CHECKOUT_PRODUCTS_QUERY = `*[_type == "product" && _id in $productIds] {
  _id,
  name,
  slug,
  price,
  externalUrl,
  isAvailable,
  sizes,
  "primaryImage": images[0].asset->url
}`;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeQuantity(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    return undefined;
  }

  if (value < 1 || value > 20) {
    return undefined;
  }

  return value;
}

function parseIncomingItems(rawItems: unknown): NormalizedCheckoutItem[] {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new CheckoutValidationError('No valid checkout items were provided.');
  }

  if (rawItems.length > 50) {
    throw new CheckoutValidationError('Too many items in checkout request.');
  }

  const aggregated = new Map<string, NormalizedCheckoutItem>();

  for (const rawItem of rawItems) {
    if (!isObject(rawItem)) {
      throw new CheckoutValidationError('Invalid checkout item format.');
    }

    const productId = normalizeString(rawItem._id);
    const quantity = normalizeQuantity(rawItem.quantity);
    const size = normalizeString(rawItem.size);

    if (!productId || !quantity) {
      throw new CheckoutValidationError('Checkout items must include a product id and quantity.');
    }

    const key = `${productId}::${size ?? ''}`;
    const existing = aggregated.get(key);

    if (existing) {
      const nextQuantity = existing.quantity + quantity;
      if (nextQuantity > 20) {
        throw new CheckoutValidationError('Requested quantity exceeds allowed maximum.');
      }

      existing.quantity = nextQuantity;
      aggregated.set(key, existing);
      continue;
    }

    aggregated.set(key, {
      productId,
      quantity,
      size,
    });
  }

  return Array.from(aggregated.values());
}

function assertProductAvailability(product: CheckoutProduct, item: NormalizedCheckoutItem): asserts product is CheckoutProduct & { name: string; price: number } {
  if (!product.isAvailable) {
    throw new CheckoutValidationError(`Product ${item.productId} is not available.`);
  }

  if (product.externalUrl) {
    throw new CheckoutValidationError(`Product ${item.productId} must be purchased externally.`);
  }

  if (typeof product.name !== 'string' || product.name.trim().length === 0) {
    throw new CheckoutValidationError(`Product ${item.productId} is missing a valid name.`);
  }

  if (typeof product.price !== 'number' || !Number.isFinite(product.price) || product.price <= 0) {
    throw new CheckoutValidationError(`Product ${item.productId} has an invalid price.`);
  }
}

function assertSizeCompatibility(product: CheckoutProduct, item: NormalizedCheckoutItem): void {
  const availableSizes = (product.sizes || []).filter((size): size is string => typeof size === 'string' && size.trim().length > 0);

  if (availableSizes.length === 0) {
    if (item.size) {
      throw new CheckoutValidationError(`Unexpected size provided for product ${item.productId}.`);
    }
    return;
  }

  if (!item.size) {
    throw new CheckoutValidationError(`Size is required for product ${item.productId}.`);
  }

  if (!availableSizes.includes(item.size)) {
    throw new CheckoutValidationError(`Invalid size selected for product ${item.productId}.`);
  }
}

export async function prepareCheckoutPayload(rawItems: unknown): Promise<PreparedCheckoutPayload> {
  const normalizedItems = parseIncomingItems(rawItems);
  const productIds = Array.from(new Set(normalizedItems.map((item) => item.productId)));

  const products = await client.fetch<CheckoutProduct[]>(CHECKOUT_PRODUCTS_QUERY, { productIds });
  const productMap = new Map(products.map((product) => [product._id, product]));

  if (productMap.size !== productIds.length) {
    throw new CheckoutValidationError('One or more products are invalid or unavailable.');
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const metadataItems: Array<{ product_id: string; quantity: number; price: number; size: string }> = [];

  for (const item of normalizedItems) {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new CheckoutValidationError(`Product ${item.productId} could not be found.`);
    }

    assertProductAvailability(product, item);
    assertSizeCompatibility(product, item);

    const productName = item.size ? `${product.name} - Size ${item.size}` : product.name;

    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: productName,
          images: product.primaryImage ? [product.primaryImage] : [],
          metadata: {
            product_id: product._id,
            slug: product.slug?.current || '',
            size: item.size || '',
          },
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: item.quantity,
    });

    metadataItems.push({
      product_id: product._id,
      quantity: item.quantity,
      price: product.price,
      size: item.size || '',
    });
  }

  return {
    lineItems,
    metadataItems,
  };
}
