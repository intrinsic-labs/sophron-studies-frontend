import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { getClientIp, isRateLimited } from '@/lib/server/rate-limit';
import { CheckoutValidationError, prepareCheckoutPayload } from '@/server/checkout/prepare-checkout';

function getStripeClient(): Stripe {
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }

  return new Stripe(stripeKey, {
    apiVersion: '2025-08-27.basil',
  });
}

const CHECKOUT_RATE_LIMIT_MAX_REQUESTS = 20;
const CHECKOUT_RATE_LIMIT_WINDOW_MS = 60_000;

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateLimitKey = `checkout:${clientIp}`;

    if (isRateLimited(rateLimitKey, CHECKOUT_RATE_LIMIT_MAX_REQUESTS, CHECKOUT_RATE_LIMIT_WINDOW_MS)) {
      return NextResponse.json(
        { error: 'Too many checkout attempts. Please try again shortly.' },
        { status: 429 }
      );
    }

    const { items } = await request.json();
    const { lineItems, metadataItems } = await prepareCheckoutPayload(items);
    const stripe = getStripeClient();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: `${baseUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/shop`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT', 'LU', 'GR', 'CY', 'MT', 'SI', 'SK', 'CZ', 'HU', 'PL', 'EE', 'LV', 'LT', 'RO', 'BG', 'HR'],
      },
      metadata: {
        order_items: JSON.stringify(metadataItems),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof CheckoutValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 
