'use client';

import React, { useState } from 'react';
import { useCart, ShippingAddress } from '@/lib/cart-context';
import { FiLoader, FiAlertCircle, FiCheck } from 'react-icons/fi';

const AddressForm: React.FC = () => {
  const { setShippingAddress, setShippingStep, state } = useCart();
  const [formData, setFormData] = useState<ShippingAddress>({
    firstName: state.shippingAddress?.firstName || '',
    lastName: state.shippingAddress?.lastName || '',
    company: state.shippingAddress?.company || '',
    streetAddress: state.shippingAddress?.streetAddress || '',
    secondaryAddress: state.shippingAddress?.secondaryAddress || '',
    city: state.shippingAddress?.city || '',
    state: state.shippingAddress?.state || '',
    zipCode: state.shippingAddress?.zipCode || '',
    phone: state.shippingAddress?.phone || '',
  });

  const [validationState, setValidationState] = useState<{
    isValidating: boolean;
    isValid: boolean | null;
    message: string;
    suggestions?: ShippingAddress[];
  }>({
    isValidating: false,
    isValid: null,
    message: '',
  });

  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  // US states for validation
  const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation when user edits address
    if (['streetAddress', 'city', 'state', 'zipCode'].includes(field)) {
      setValidationState(prev => ({ ...prev, isValid: null, message: '' }));
    }

    // Clear field-specific errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!US_STATES.includes(formData.state.toUpperCase())) newErrors.state = 'Please enter a valid US state abbreviation';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) newErrors.zipCode = 'Please enter a valid ZIP code';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAddress = async () => {
    console.log("Validating address");
    if (!validateForm()) return;

    setValidationState({ isValidating: true, isValid: null, message: '' });
    console.log("Sending request");
    try {
      const response = await fetch('/api/shipping/validate-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          streetAddress: formData.streetAddress,
          secondaryAddress: formData.secondaryAddress,
          city: formData.city,
          state: formData.state.toUpperCase(),
          zipCode: formData.zipCode,
        }),
      });

      console.log("Waiting for response");

      const result = await response.json();

      console.log("Response received");

      if (!response.ok) {
        setValidationState({
          isValidating: false,
          isValid: false,
          message: result.error || 'Failed to validate address',
        });
        return;
      }

      if (result.data.isValid) {
        setValidationState({
          isValidating: false,
          isValid: true,
          message: 'Address validated successfully',
        });
        
        // Update form data with corrected address
        setFormData(prev => ({
          ...prev,
          streetAddress: result.data.address.streetAddress,
          secondaryAddress: result.data.address.secondaryAddress || prev.secondaryAddress,
          city: result.data.address.city,
          state: result.data.address.state,
          zipCode: result.data.address.zipCode,
        }));
      } else {
        setValidationState({
          isValidating: false,
          isValid: false,
          message: 'Address could not be validated. Please check your address.',
          suggestions: result.data.suggestions,
        });
      }
    } catch (error) {
      setValidationState({
        isValidating: false,
        isValid: false,
        message: 'Error validating address. Please try again.',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // If address hasn't been validated yet, validate first
    if (validationState.isValid === null) {
      await validateAddress();
      return;
    }

    // If validation failed, don't proceed
    if (validationState.isValid === false) {
      return;
    }

    // Save address and proceed to shipping step
    setShippingAddress(formData);
    setShippingStep('shipping');
  };

  const applySuggestion = (suggestion: ShippingAddress) => {
    setFormData(prev => ({
      ...prev,
      streetAddress: suggestion.streetAddress,
      secondaryAddress: suggestion.secondaryAddress || prev.secondaryAddress,
      city: suggestion.city,
      state: suggestion.state,
      zipCode: suggestion.zipCode,
    }));
    setValidationState(prev => ({ ...prev, suggestions: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Company */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company (Optional)
        </label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => handleInputChange('company', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street Address *
        </label>
        <input
          type="text"
          value={formData.streetAddress}
          onChange={(e) => handleInputChange('streetAddress', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
            errors.streetAddress ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.streetAddress && (
          <p className="text-red-500 text-xs mt-1">{errors.streetAddress}</p>
        )}
      </div>

      {/* Secondary Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Apartment, Suite, etc. (Optional)
        </label>
        <input
          type="text"
          value={formData.secondaryAddress}
          onChange={(e) => handleInputChange('secondaryAddress', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      {/* City, State, ZIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State *
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value.toUpperCase())}
            placeholder="CA"
            maxLength={2}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
              errors.state ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.state && (
            <p className="text-red-500 text-xs mt-1">{errors.state}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code *
          </label>
          <input
            type="text"
            value={formData.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            placeholder="12345"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
              errors.zipCode ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.zipCode && (
            <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
          )}
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number (Optional)
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      {/* Validation Status */}
      {validationState.message && (
        <div className={`p-4 rounded-lg flex items-start gap-3 ${
          validationState.isValid 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {validationState.isValid ? (
            <FiCheck className="text-green-600 mt-0.5" />
          ) : (
            <FiAlertCircle className="text-red-600 mt-0.5" />
          )}
          <div className="flex-1">
            <p className={`text-sm ${validationState.isValid ? 'text-green-800' : 'text-red-800'}`}>
              {validationState.message}
            </p>
          </div>
        </div>
      )}

      {/* Address Suggestions */}
      {validationState.suggestions && validationState.suggestions.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Did you mean:</h4>
          <div className="space-y-2">
            {validationState.suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => applySuggestion(suggestion)}
                className="w-full text-left p-3 bg-white border border-yellow-300 rounded hover:bg-yellow-50 transition-colors"
              >
                <div className="text-sm">
                  <p>{suggestion.streetAddress}</p>
                  <p>{suggestion.city}, {suggestion.state} {suggestion.zipCode}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={validateAddress}
          disabled={validationState.isValidating}
          className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {validationState.isValidating ? (
            <>
              <FiLoader className="animate-spin" />
              Validating...
            </>
          ) : (
            'Validate Address'
          )}
        </button>

        <button
          type="submit"
          disabled={validationState.isValidating}
          className="flex-1 bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
        >
          Continue to Shipping
        </button>
      </div>
    </form>
  );
};

export default AddressForm; 