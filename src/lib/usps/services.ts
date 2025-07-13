// USPS API Services - Specific API operations

import { USPSApiClient } from './api-client';
import {
  AddressValidationRequest,
  AddressValidationResponse,
  PricingRequest,
  ShippingRate,
  LabelRequest,
  LabelResponse
} from './types';

export class USPSServices {
  constructor(private apiClient: USPSApiClient) {}

  async validateAddress(address: AddressValidationRequest): Promise<AddressValidationResponse> {
    try {
      // Build query parameters for GET request
      const params = new URLSearchParams({
        streetAddress: address.streetAddress,
        city: address.city,
        state: address.state,
        ZIPCode: address.zipCode
      });

      // Add optional secondary address if provided
      if (address.secondaryAddress) {
        params.append('secondaryAddress', address.secondaryAddress);
      }

      const response = await this.apiClient.makeRequest<any>(`/addresses/v3/address?${params.toString()}`);

      // Transform USPS response to our format
      // USPS considers an address valid if it returns address data and matches
      const isValid = !!(response.address && response.matches && response.matches.length > 0);
      
      // console.log('USPS Address Validation Response:', response);
      console.log('Address validation result - isValid:', isValid);
      
      return {
        address: {
          streetAddress: response.address?.streetAddress || address.streetAddress,
          secondaryAddress: response.address?.secondaryAddress || address.secondaryAddress,
          city: response.address?.city || address.city,
          state: response.address?.state || address.state,
          zipCode: response.address?.ZIPCode || address.zipCode
        },
        isValid,
        suggestions: [] // USPS v3 doesn't provide suggestions in the same format
      };
    } catch (error) {
      console.error('Address validation error:', error);
      // Return as invalid but with original address
      return {
        address,
        isValid: false
      };
    }
  }

  async getShippingRates(request: PricingRequest): Promise<ShippingRate[]> {
    try {
      const response = await this.apiClient.makeRequest<any>('/prices/v3/base-rates/search', 'POST', {
        originZIPCode: request.originZipCode,
        destinationZIPCode: request.destinationZipCode,
        weight: request.weight,
        length: request.length,
        width: request.width,
        height: request.height,
        mailClass: request.mailClass || 'GROUND_ADVANTAGE',
        processingCategory: 'MACHINABLE',
        rateIndicator: 'SP',
        priceType: 'COMMERCIAL',
        mailingDate: new Date().toISOString().split('T')[0] // Today's date
      });

      // Transform USPS response to our format
      return response.rates?.map((rate: any) => ({
        service: rate.mailClass || rate.service || 'GROUND_ADVANTAGE',
        serviceName: rate.description || rate.serviceName || rate.mailClass || 'USPS Ground Advantage',
        rate: (rate.price || rate.totalPrice || '0.00').toString(),
        currency: 'USD',
        deliveryDays: rate.deliveryDays?.toString(),
        deliveryDate: rate.deliveryDate
      })) || [];
    } catch (error) {
      console.error('Pricing error:', error);
      throw new Error('Failed to get shipping rates from USPS');
    }
  }

  async createLabel(request: LabelRequest): Promise<LabelResponse> {
    // Check if we have the required credentials for label creation
    if (!this.apiClient.canCreateLabels()) {
      throw new Error('Label creation requires CRID and MID. Please set USPS_CUSTOMER_REGISTRATION_ID and USPS_MAILER_ID environment variables.');
    }

    try {
      const response = await this.apiClient.makeRequest<any>('/labels/v3/label', 'POST', {
        fromAddress: request.fromAddress,
        toAddress: request.toAddress,
        packageDescription: {
          weight: request.packageDetails.weight,
          length: request.packageDetails.length,
          width: request.packageDetails.width,
          height: request.packageDetails.height,
          mailClass: request.serviceType,
          processingCategory: request.processingCategory || 'MACHINABLE',
          rateIndicator: request.rateIndicator || 'SP'
        },
        imageInfo: {
          imageType: 'PDF',
          labelType: '4X6LABEL'
        }
      });

      return {
        labelImage: response.labelImage || response.label,
        trackingNumber: response.trackingNumber,
        postage: response.postage?.toString() || '0.00',
        deliveryDate: response.deliveryDate
      };
    } catch (error) {
      console.error('Label creation error:', error);
      throw new Error('Failed to create shipping label');
    }
  }

  async trackPackage(trackingNumber: string): Promise<any> {
    try {
      const response = await this.apiClient.makeRequest<any>(`/tracking/v3/tracking/${trackingNumber}`);
      return response;
    } catch (error) {
      console.error('Tracking error:', error);
      throw new Error('Failed to get tracking information');
    }
  }
} 