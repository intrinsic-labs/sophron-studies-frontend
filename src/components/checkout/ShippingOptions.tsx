'use client';

import React, { useState, useEffect } from 'react';
import { useCart, ShippingOption } from '@/lib/cart-context';
import { FiLoader, FiTruck, FiClock, FiArrowLeft } from 'react-icons/fi';

const ShippingOptions: React.FC = () => {
  const { state, setShippingOption, setShippingStep } = useCart();
  const [shippingRates, setShippingRates] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (state.shippingAddress && state.items.length > 0) {
      fetchShippingRates();
    }
  }, [state.shippingAddress, state.items]);

  const fetchShippingRates = async () => {
    if (!state.shippingAddress) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/shipping/calculate-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationZipCode: state.shippingAddress.zipCode,
          items: state.items.map(item => ({
            productId: item._id,
            quantity: item.quantity,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to calculate shipping rates');
        return;
      }

      setShippingRates(result.rates || []);
    } catch (error) {
      setError('Error calculating shipping rates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectShipping = (option: ShippingOption) => {
    setShippingOption(option);
    setShippingStep('payment');
  };

  const getServiceIcon = (service: string) => {
    switch (service.toUpperCase()) {
      case 'GROUND_ADVANTAGE':
        return <FiTruck className="text-green-600" />;
      case 'PRIORITY':
        return <FiClock className="text-blue-600" />;
      case 'PRIORITY_EXPRESS':
        return <FiClock className="text-red-600" />;
      default:
        return <FiTruck className="text-gray-600" />;
    }
  };

  const getServiceDescription = (service: string) => {
    switch (service.toUpperCase()) {
      case 'GROUND_ADVANTAGE':
        return 'Affordable delivery for everyday packages';
      case 'PRIORITY':
        return 'Fast delivery with tracking and insurance';
      case 'PRIORITY_EXPRESS':
        return 'Overnight delivery for urgent packages';
      default:
        return 'USPS shipping service';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <FiLoader className="animate-spin mx-auto mb-4" size={32} />
            <p className="text-gray-600">Calculating shipping rates...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FiClock className="text-red-600" />
            <div>
              <p className="text-red-800 font-medium">Error calculating shipping</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => setShippingStep('address')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FiArrowLeft />
            Back to Address
          </button>
          <button
            onClick={fetchShippingRates}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (shippingRates.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <FiTruck className="text-yellow-600" />
            <div>
              <p className="text-yellow-800 font-medium">No shipping options available</p>
              <p className="text-yellow-700 text-sm mt-1">
                We couldn't find shipping options for your address. Please check your address or contact support.
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setShippingStep('address')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <FiArrowLeft />
          Back to Address
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => setShippingStep('address')}
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <FiArrowLeft />
        Back to Address
      </button>

      {/* Shipping Address Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium mb-2">Shipping to:</h3>
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
      </div>

      {/* Shipping Options */}
      <div className="space-y-3">
        <h3 className="font-medium">Choose shipping method:</h3>
        
        {shippingRates.map((rate, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors cursor-pointer"
            onClick={() => handleSelectShipping(rate)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getServiceIcon(rate.service)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{rate.serviceName}</h4>
                    {rate.deliveryDays && (
                      <span className="text-sm text-gray-500">
                        ({rate.deliveryDays} {parseInt(rate.deliveryDays) === 1 ? 'day' : 'days'})
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    {getServiceDescription(rate.service)}
                  </p>
                  {rate.deliveryDate && (
                    <p className="text-gray-500 text-xs mt-1">
                      Estimated delivery: {rate.deliveryDate}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${parseFloat(rate.rate).toFixed(2)}</p>
                <p className="text-gray-500 text-sm">{rate.currency}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Option Display */}
      {state.selectedShippingOption && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <div>
              <p className="font-medium text-green-800">
                Selected: {state.selectedShippingOption.serviceName}
              </p>
              <p className="text-green-700 text-sm">
                ${parseFloat(state.selectedShippingOption.rate).toFixed(2)}
                {state.selectedShippingOption.deliveryDays && 
                  ` • ${state.selectedShippingOption.deliveryDays} ${parseInt(state.selectedShippingOption.deliveryDays) === 1 ? 'day' : 'days'}`
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingOptions; 