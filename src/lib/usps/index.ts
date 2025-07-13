// USPS Integration - Main export file

import { USPSConfig } from './types';
import { USPSApiClient } from './api-client';
import { USPSServices } from './services';

// Export all types for external use
export * from './types';

// Main USPS Client class that combines all functionality
export class USPSClient {
  private apiClient: USPSApiClient;
  public services: USPSServices;

  constructor(config?: Partial<USPSConfig>) {
    const fullConfig: USPSConfig = {
      clientId: process.env.USPS_CLIENT_ID!,
      clientSecret: process.env.USPS_CLIENT_SECRET!,
      customerRegistrationId: process.env.USPS_CUSTOMER_REGISTRATION_ID,
      mailerId: process.env.USPS_MAILER_ID,
      baseUrl: process.env.USPS_API_BASE_URL || 'https://apis.usps.com',
      environment: (process.env.USPS_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
      ...config
    };

    if (!fullConfig.clientId || !fullConfig.clientSecret) {
      throw new Error('USPS API credentials are required. Check your environment variables for CLIENT_ID and CLIENT_SECRET.');
    }

    this.apiClient = new USPSApiClient(fullConfig);
    this.services = new USPSServices(this.apiClient);
  }

  // Convenience methods that delegate to services
  async validateAddress(address: import('./types').AddressValidationRequest) {
    return this.services.validateAddress(address);
  }

  async getShippingRates(request: import('./types').PricingRequest) {
    return this.services.getShippingRates(request);
  }

  async createLabel(request: import('./types').LabelRequest) {
    return this.services.createLabel(request);
  }

  async trackPackage(trackingNumber: string) {
    return this.services.trackPackage(trackingNumber);
  }

  // Utility methods
  canCreateLabels(): boolean {
    return this.apiClient.canCreateLabels();
  }

  clearAuth(): void {
    this.apiClient.clearAuth();
  }
}

// Create and export a default instance
let defaultClient: USPSClient | null = null;

export function getUSPSClient(): USPSClient {
  if (!defaultClient) {
    defaultClient = new USPSClient();
  }
  return defaultClient;
}

// For convenience, also export the default client directly
export const uspsClient = getUSPSClient; 