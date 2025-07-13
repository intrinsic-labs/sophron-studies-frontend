# Environment Variables Setup

This document outlines all the environment variables needed for the shipping integration feature.

## Required Environment Variables

Add these to your `.env.local` file in the frontend directory:

### Existing Variables
```bash
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token
```

### New Variables for Shipping Integration
```bash
# USPS API Configuration
USPS_CLIENT_ID=your_usps_client_id
USPS_CLIENT_SECRET=your_usps_client_secret
USPS_API_BASE_URL=https://apis.usps.com
USPS_TEST_BASE_URL=https://apis-tem.usps.com
USPS_ENVIRONMENT=sandbox # Change to 'production' for live

# Required for Label Creation APIs (Phase 3)
USPS_CUSTOMER_REGISTRATION_ID=your_crid  # Optional for Phase 1
USPS_MAILER_ID=your_mailer_id            # Optional for Phase 1

# Email Service Configuration (Resend)
RESEND_API_KEY=re_your_resend_api_key
FROM_EMAIL=orders@yourdomain.com

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000 # Update for production
```

## Setup Instructions

### 1. USPS API Credentials

**Phase 1 - Basic API Access (Address validation, pricing, shipping options):**
1. Create USPS Business Account via Customer Onboarding Portal (COP)
2. Log into Developer Portal at https://developers.usps.com/ 
3. Create a new App to get Consumer Key and Consumer Secret
4. Copy Client ID and Secret to your environment variables
5. Start with `USPS_ENVIRONMENT=sandbox` for testing

**Phase 2 - Label Creation (Required later for Phase 3):**
6. Get your Customer Registration ID (CRID) and Mailer ID (MID):
   - These are obtained through USPS Business Customer Gateway
   - Visit: https://gateway.usps.com/eAdmin/view/signin
   - See: https://postalpro.usps.com/mailing/mailer-id
7. Set up Enterprise Payment Account for label payments
8. Request Labels API access from USPS

### 2. Resend Email Service
1. Sign up at https://resend.com/
2. Create an API key in the dashboard
3. Set up your domain and verify DNS records
4. Update `FROM_EMAIL` to use your verified domain

### 3. Stripe Webhook (for automated label generation)
1. Add a new webhook endpoint in your Stripe dashboard
2. Point it to `https://yourdomain.com/api/webhooks/stripe`
3. Subscribe to the `checkout.session.completed` event
4. Copy the webhook signing secret

## Security Notes

- Never commit `.env.local` to version control
- Use different API keys for development and production
- Rotate API keys regularly
- Use the most restrictive permissions possible for each service

## Database Configuration (Future)

We'll need a database to store order information and tracking data. Options to consider:
- Vercel Postgres (if deploying on Vercel)
- Supabase (PostgreSQL with real-time features)
- PlanetScale (MySQL-compatible)

For now, we'll implement the basic flow and add database persistence later. 