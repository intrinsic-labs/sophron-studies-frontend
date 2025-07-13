// USPS API Client - HTTP request handling

import { USPSConfig } from './types';
import { USPSAuth } from './auth';

export class USPSApiClient {
  private auth: USPSAuth;

  constructor(private config: USPSConfig) {
    this.auth = new USPSAuth(config);
  }

  async makeRequest<T>(endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any): Promise<T> {
    const token = await this.auth.getValidToken();
    
    const url = `${this.config.baseUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    };

    // Only add Content-Type and body for POST requests
    if (method === 'POST') {
      options.headers = {
        ...options.headers,
        'Content-Type': 'application/json'
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`USPS API error: ${response.status} ${errorText}`);
        throw new Error(`USPS API request failed: ${response.status} ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('USPS API request error:', error);
      throw error;
    }
  }

  // Helper method to check if we have required credentials for label operations
  canCreateLabels(): boolean {
    return !!(this.config.customerRegistrationId && this.config.mailerId);
  }

  // Clear authentication tokens
  clearAuth(): void {
    this.auth.clearTokens();
  }
} 