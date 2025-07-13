// USPS OAuth Authentication Module

import { USPSConfig, USPSAuthResponse } from './types';

export class USPSAuth {
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor(private config: USPSConfig) {}

  async getValidToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Authenticate and get new token
    return await this.authenticate();
  }

  private async authenticate(): Promise<string> {
    try {
      const response = await fetch(`${this.config.baseUrl}/oauth2/v3/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: 'client_credentials'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`USPS authentication failed: ${response.status} ${errorText}`);
      }

      const data: USPSAuthResponse = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 minute early

      return this.accessToken;
    } catch (error) {
      console.error('USPS authentication error:', error);
      throw new Error('Failed to authenticate with USPS API');
    }
  }

  // Clear stored tokens (useful for testing or logout)
  clearTokens(): void {
    this.accessToken = null;
    this.tokenExpiry = null;
  }
} 