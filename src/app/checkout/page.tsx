'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import CheckoutStep from '@/components/checkout/CheckoutStep';
import AddressForm from '@/components/checkout/AddressForm';
import ShippingOptions from '@/components/checkout/ShippingOptions';
import OrderSummary from '@/components/checkout/OrderSummary';

const CheckoutPage: React.FC = () => {
  const { state, setShippingStep } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);

  // Allow cart to load from localStorage first
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200); // Give cart context time to load from localStorage

    return () => clearTimeout(timer);
  }, []);

  // Redirect if cart is empty (only after loading is complete)
  useEffect(() => {
    if (!isLoading && state.items.length === 0) {
      router.push('/shop');
    }
  }, [isLoading, state.items.length, router]);

  // Set initial step if not set
  useEffect(() => {
    if (state.shippingStep === 'cart') {
      setShippingStep('address');
    }
  }, [state.shippingStep, setShippingStep]);

  // Show loading state while cart is loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Show empty cart message if cart is empty after loading
  if (state.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
          <button 
            onClick={() => router.push('/shop')}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <div className="flex items-center space-x-4">
            <CheckoutStep 
              step={1} 
              title="Shipping Address" 
              isActive={state.shippingStep === 'address'}
              isComplete={!!state.shippingAddress}
            />
            <div className="h-px bg-gray-300 flex-1" />
            <CheckoutStep 
              step={2} 
              title="Shipping Method" 
              isActive={state.shippingStep === 'shipping'}
              isComplete={!!state.selectedShippingOption}
            />
            <div className="h-px bg-gray-300 flex-1" />
            <CheckoutStep 
              step={3} 
              title="Payment" 
              isActive={state.shippingStep === 'payment'}
              isComplete={false}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {state.shippingStep === 'address' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
                <AddressForm />
              </div>
            )}

            {state.shippingStep === 'shipping' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Choose Shipping Method</h2>
                <ShippingOptions />
              </div>
            )}

            {state.shippingStep === 'payment' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Review Order</h2>
                <div className="space-y-6">
                  {/* Address Summary */}
                  <div className="border-b pb-4">
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    {state.shippingAddress && (
                      <div className="text-gray-600 text-sm">
                        <p>{state.shippingAddress.firstName} {state.shippingAddress.lastName}</p>
                        <p>{state.shippingAddress.streetAddress}</p>
                        {state.shippingAddress.secondaryAddress && (
                          <p>{state.shippingAddress.secondaryAddress}</p>
                        )}
                        <p>{state.shippingAddress.city}, {state.shippingAddress.state} {state.shippingAddress.zipCode}</p>
                      </div>
                    )}
                    <button 
                      onClick={() => setShippingStep('address')}
                      className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                    >
                      Edit Address
                    </button>
                  </div>

                  {/* Shipping Method Summary */}
                  <div className="border-b pb-4">
                    <h3 className="font-medium mb-2">Shipping Method</h3>
                    {state.selectedShippingOption && (
                      <div className="text-gray-600 text-sm">
                        <p>{state.selectedShippingOption.serviceName}</p>
                        <p>${state.selectedShippingOption.rate}</p>
                        {state.selectedShippingOption.deliveryDays && (
                          <p>Estimated delivery: {state.selectedShippingOption.deliveryDays} days</p>
                        )}
                      </div>
                    )}
                    <button 
                      onClick={() => setShippingStep('shipping')}
                      className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                    >
                      Change Shipping Method
                    </button>
                  </div>

                  {/* Checkout Button */}
                  <button 
                    onClick={() => {
                      // This will be implemented to call the updated Stripe checkout
                      console.log('Proceeding to payment...');
                    }}
                    className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 