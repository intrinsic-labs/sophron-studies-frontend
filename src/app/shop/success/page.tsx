'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { FiCheckCircle, FiArrowLeft } from 'react-icons/fi';

export default function SuccessPage() {
  const { clearCart } = useCart();
  const hasCleared = useRef(false);

  useEffect(() => {
    // Only clear cart once when component mounts
    if (!hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
  }, []); // Empty dependency array - only run once on mount

  const handleNavigation = () => {
    // Clear cart when user intentionally navigates away
    clearCart();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <FiCheckCircle className="mx-auto text-green-500" size={64} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. You will receive an email confirmation shortly.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/shop"
            onClick={handleNavigation}
            className="inline-flex items-center justify-center w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            <FiArrowLeft className="mr-2" size={16} />
            Continue Shopping
          </Link>
          
          <Link
            href="/"
            onClick={handleNavigation}
            className="inline-flex items-center justify-center w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 