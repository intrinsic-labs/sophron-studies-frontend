'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { FiX, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';

const CartSidebar: React.FC = () => {
  const { state, removeItem, updateQuantity, closeCart, getTotalPrice, clearCart } = useCart();

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FiShoppingBag />
            Shopping Cart
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {state.items.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <FiShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={`${item._id}-${item.size || 'no-size'}`} className="flex gap-3 p-3 border rounded-lg">
                  {/* Product Image */}
                  <div className="w-16 h-20 bg-gray-100 rounded-sm overflow-hidden shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm leading-tight mb-1 truncate">
                      {item.name}
                    </h3>
                    {item.size && (
                      <p className="text-gray-500 text-xs mb-1">
                        Size: {item.size}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm font-mono">
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1, item.size)}
                        className="p-1 hover:bg-gray-100 rounded-sm transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1, item.size)}
                        className="p-1 hover:bg-gray-100 rounded-sm transition-colors"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item._id, item.size)}
                    className="p-1 hover:bg-red-100 hover:text-red-600 rounded-sm transition-colors self-start"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total:</span>
              <span className="font-mono">${getTotalPrice().toFixed(2)}</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Checkout
              </button>
              <button
                onClick={clearCart}
                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar; 