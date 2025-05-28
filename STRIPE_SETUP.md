# Stripe Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Base URL for redirects (use your actual domain in production)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Getting Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create an account or log in
3. Navigate to **Developers** > **API keys**
4. Copy your **Publishable key** and **Secret key** (use test keys for development)
5. Add them to your `.env.local` file

## Testing the Integration

1. Start your development server: `npm run dev`
2. Navigate to `/shop`
3. Add items to your cart using the "Add to Cart" buttons
4. Click the cart icon in the navbar to view your cart
5. Click "Checkout" to test the Stripe integration
6. Use Stripe's test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - Use any future expiry date and any 3-digit CVC

## Features Implemented

- ✅ Cart functionality with localStorage persistence
- ✅ Add/remove items from cart
- ✅ Quantity management
- ✅ Cart sidebar with item management
- ✅ Stripe Checkout integration
- ✅ Success page after payment
- ✅ Responsive cart button in navbar
- ✅ Dynamic line items based on Sanity product data

## Next Steps (Optional)

- Set up Stripe webhooks for order fulfillment
- Add inventory management in Sanity
- Implement order history
- Add email confirmations
- Set up production environment variables 