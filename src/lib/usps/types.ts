// USPS API Types and Interfaces

export interface USPSConfig {
  clientId: string;
  clientSecret: string;
  customerRegistrationId?: string; // Optional for basic APIs
  mailerId?: string; // Optional for basic APIs
  baseUrl: string;
  environment: 'sandbox' | 'production';
}

export interface USPSAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface AddressValidationRequest {
  streetAddress: string;
  secondaryAddress?: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface AddressValidationResponse {
  address: {
    streetAddress: string;
    secondaryAddress?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  isValid: boolean;
  suggestions?: AddressValidationRequest[];
}

export interface ShippingRate {
  service: string;
  serviceName: string;
  rate: string;
  currency: string;
  deliveryDays?: string;
  deliveryDate?: string;
}

export interface PricingRequest {
  originZipCode: string;
  destinationZipCode: string;
  weight: number; // in pounds
  length: number; // in inches
  width: number;
  height: number;
  mailClass?: string;
}

export interface LabelRequest {
  fromAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    streetAddress: string;
    secondaryAddress?: string;
    city: string;
    state: string;
    zipCode: string;
    phone?: string;
  };
  toAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    streetAddress: string;
    secondaryAddress?: string;
    city: string;
    state: string;
    zipCode: string;
    phone?: string;
  };
  packageDetails: {
    weight: number;
    length: number;
    width: number;
    height: number;
  };
  serviceType: string;
  processingCategory?: string;
  rateIndicator?: string;
}

export interface LabelResponse {
  labelImage: string; // Base64 encoded label
  trackingNumber: string;
  postage: string;
  deliveryDate?: string;
}

// Service type constants
export const USPSServiceTypes = {
  GROUND_ADVANTAGE: 'GROUND_ADVANTAGE',
  PRIORITY: 'PRIORITY',
  PRIORITY_EXPRESS: 'PRIORITY_EXPRESS'
} as const;

export type USPSServiceType = typeof USPSServiceTypes[keyof typeof USPSServiceTypes]; 