'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  images: SanityImageReference[];
  description?: any[];
  price: number;
  isAvailable: boolean;
  categories?: { _id: string; title: string; slug: { current: string } }[];
  sizes?: string[];
  _createdAt: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, openCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    
    // If product has sizes, redirect to product page for size selection
    if (product.sizes && product.sizes.length > 0) {
      window.location.href = `/shop/${product.slug.current}`;
      return;
    }
    
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
    openCart(); // Open cart sidebar after adding item
  };

  return (
    <div className="group border transition-shadow duration-300 group-hover:shadow-lg h-full flex flex-col">
      <Link href={`/shop/${product.slug.current}`} className="flex-1 flex flex-col">
        <div className="p-4 text-center flex-1 flex flex-col">
          <div className="relative w-full aspect-3/4 bg-gray-100 mb-4 overflow-hidden">
            {product.images?.[0] ? (
              <Image
                src={urlFor(product.images[0]).width(400).height(533).fit('crop').url()}
                alt={product.images[0].alt || product.name}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-lg mb-1">{product.name}</h3>
            <p className="text-gray-700 font-semibold font-mono mb-3">
              ${product.price.toFixed(2)} USD
            </p>
          </div>
        </div>
      </Link>
      
      {/* Add to Cart Button - Integrated into the card */}
      <div className="p-4 pt-0 mt-auto">
        <button
          onClick={handleAddToCart}
          className="w-full bg-black text-white py-2 px-4 hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <FiShoppingCart size={16} />
          {product.sizes && product.sizes.length > 0 ? 'Select Size' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 