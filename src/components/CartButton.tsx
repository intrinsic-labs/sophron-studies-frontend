'use client';

import React from 'react';
import { useCart } from '@/lib/cart-context';
import { FiShoppingBag } from 'react-icons/fi';

const CartButton: React.FC = () => {
  const { toggleCart, getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      aria-label="Shopping cart"
    >
      <FiShoppingBag size={20} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
};

export default CartButton; 