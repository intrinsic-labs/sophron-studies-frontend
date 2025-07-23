'use client';

import React from 'react';
import { useCart } from '@/lib/cart-context';
import { urlFor } from '@/sanity/client';
import { FiShoppingCart, FiExternalLink } from 'react-icons/fi';

interface SanityImageReference {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

interface ProductDetail {
  _id: string;
  name: string;
  slug: { current: string };
  images: SanityImageReference[];
  description: any[];
  price?: number; // Optional for external products
  externalUrl?: string; // For external products
  isAvailable: boolean;
  sizes?: string[];
}

interface AddToCartButtonProps {
  product: ProductDetail;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
  const { addItem, openCart } = useCart();
  const [selectedSize, setSelectedSize] = React.useState<string>('');

  const isExternalProduct = !!product.externalUrl;

  const handleAddToCart = () => {
    // If product has sizes, require size selection
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    const cartItem = {
      _id: product._id,
      name: product.name,
      price: product.price!,
      slug: product.slug.current,
      image: product.images?.[0] 
        ? urlFor(product.images[0]).width(400).height(533).fit('crop').url()
        : undefined,
      size: selectedSize || undefined,
    };

    addItem(cartItem);
    openCart();
  };

  const handleVisitWebsite = () => {
    if (product.externalUrl) {
      window.open(product.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-4">
      {/* Size Selection - only show for non-external products */}
      {!isExternalProduct && product.sizes && product.sizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Size</label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-black"
          >
            <option value="">Select a size</option>
            {product.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      {isExternalProduct ? (
        <button
          onClick={handleVisitWebsite}
          className="bg-black text-white py-3 px-6 hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 w-full md:w-auto mb-6"
        >
          <FiExternalLink size={16} />
          Visit Website
        </button>
      ) : (
        <button
          onClick={handleAddToCart}
          className="bg-black text-white py-3 px-6 hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 w-full md:w-auto mb-6"
        >
          <FiShoppingCart size={16} />
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default AddToCartButton; 