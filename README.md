# Sophron Studies Frontend

## Environment Setup

1. Copy the example env file:

```bash
cp .env.example .env.local
```

2. Fill in real values in `.env.local` for:
- Sanity (`NEXT_PUBLIC_SANITY_*`, `SANITY_API_READ_TOKEN`, `SANITY_WEBHOOK_SECRET`)
- Stripe (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`)
- Email/newsletter (`MAILERLITE_API_KEY`, `RESEND_*`)
- App URL (`NEXT_PUBLIC_BASE_URL`)

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.
