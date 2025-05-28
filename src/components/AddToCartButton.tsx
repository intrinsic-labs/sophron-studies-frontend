'use client';

import React from 'react';
import { useCart } from '@/lib/cart-context';
import { urlFor } from '@/sanity/client';
import { FiShoppingCart } from 'react-icons/fi';

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
  price: number;
  isAvailable: boolean;
}

interface AddToCartButtonProps {
  product: ProductDetail;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
  const { addItem, openCart } = useCart();

  const handleAddToCart = () => {
    const cartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      slug: product.slug.current,
      image: product.images?.[0] 
        ? urlFor(product.images[0]).width(400).height(533).fit('crop').url()
        : undefined,
    };

    addItem(cartItem);
    openCart();
  };

  return (
    <button
      onClick={handleAddToCart}
      className="bg-black text-white py-3 px-6 hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 w-full md:w-auto mb-6"
    >
      <FiShoppingCart size={16} />
      Add to Cart
    </button>
  );
};

export default AddToCartButton; 