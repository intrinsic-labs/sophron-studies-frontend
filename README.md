# Sophron Studies Frontend

Sophron Studies is a content-managed website and lightweight commerce experience built with Next.js.  
Most site content (homepage sections, blog, shop data, releases, etc.) is sourced from Sanity so non-technical users can update content without code changes.

## What’s In Here

- **Public site pages:** home, about, blog, contact, shop
- **Sanity-backed content:** dynamic page sections, posts, and product data
- **Server routes:** checkout session creation, Stripe webhook handling, newsletter signup, and Sanity revalidation webhook
- **Security hardening:** server-authoritative checkout pricing, request validation, and basic rate limiting on sensitive endpoints

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **CMS:** Sanity + GROQ (`next-sanity`, `@sanity/client`)
- **Payments:** Stripe Checkout + webhook processing
- **Email:** MailerLite (newsletter), Resend (order notifications)
- **Styling:** Tailwind CSS 4

## Project Structure

- `src/app` - routes and API endpoints
- `src/components` - UI components by domain/section
- `src/sanity` - Sanity config, server client, image helpers, and queries
- `src/server` - server-only business logic modules
- `src/lib` - shared app utilities and client state

## Environment Setup

1. Copy the example env file:
   `cp .env.example .env.local`

2. Fill in real values in `.env.local`:
   - Sanity: `NEXT_PUBLIC_SANITY_*`, `SANITY_API_READ_TOKEN`, `SANITY_WEBHOOK_SECRET`
   - Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
   - Email/newsletter: `MAILERLITE_API_KEY`, `RESEND_*`
   - App URL: `NEXT_PUBLIC_BASE_URL`

## Local Development

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open `http://localhost:3000`

## Scripts

- `npm run dev` - local dev server
- `npm run build` - production build
- `npm run start` - run built app
- `npm run lint` - ESLint checks

## Webhook Notes

- Sanity content updates hit `POST /api/revalidate` (signature validated)
- Stripe events hit `POST /api/webhooks/stripe`

Make sure the corresponding webhook secrets are set in environment variables.
