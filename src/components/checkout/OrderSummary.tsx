import React from 'react';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';

const OrderSummary: React.FC = () => {
  const { state, getTotalPrice, getTotalWithShipping } = useCart();

  const subtotal = getTotalPrice();
  const shippingCost = state.selectedShippingOption ? parseFloat(state.selectedShippingOption.rate) : 0;
  const total = getTotalWithShipping();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
      <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
      
      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {state.items.map((item) => (
          <div key={item._id} className="flex gap-3">
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
              <p className="text-gray-600 text-sm">
                Qty: {item.quantity}
              </p>
              <p className="text-gray-900 text-sm font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Cost Breakdown */}
      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {state.selectedShippingOption ? (
              <>
                ${shippingCost.toFixed(2)}
                <span className="text-xs text-gray-500 block">
                  {state.selectedShippingOption.serviceName}
                </span>
              </>
            ) : (
              <span className="text-gray-400">Calculated at next step</span>
            )}
          </span>
        </div>

        {/* Tax Note */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-400">Calculated at checkout</span>
        </div>

        {/* Total */}
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          {!state.selectedShippingOption && (
            <p className="text-xs text-gray-500 mt-1">
              + shipping (calculated at next step)
            </p>
          )}
        </div>
      </div>

      {/* Shipping Address Summary */}
      {state.shippingAddress && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-medium text-sm mb-2">Shipping Address</h3>
          <div className="text-gray-600 text-xs">
            <p>{state.shippingAddress.firstName} {state.shippingAddress.lastName}</p>
            <p>{state.shippingAddress.streetAddress}</p>
            {state.shippingAddress.secondaryAddress && (
              <p>{state.shippingAddress.secondaryAddress}</p>
            )}
            <p>{state.shippingAddress.city}, {state.shippingAddress.state} {state.shippingAddress.zipCode}</p>
          </div>
        </div>
      )}

      {/* Secure Checkout Notice */}
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Secure checkout powered by Stripe</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary; 