import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

function getStripeClient(): Stripe {
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }

  return new Stripe(stripeKey, {
    apiVersion: '2025-08-27.basil',
  });
}

export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    try {
      // Get full session details with line items
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items', 'line_items.data.price.product']
      });

      // Send notification email
      await sendOrderNotification(fullSession);
      
    } catch (error) {
      console.error('Error processing webhook:', error);
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

async function sendOrderNotification(session: Stripe.Checkout.Session) {
  const customerEmail = session.customer_details?.email;
  const customerName = session.customer_details?.name;
  const totalAmount = session.amount_total! / 100;

  const shippingAddress = (session as any).shipping_details?.address;
  
  const orderDate = new Date(session.created * 1000); // Convert Unix timestamp to Date
  
  // Build simple line items list
  const items = session.line_items?.data?.map(item => {
    const product = item.price?.product as Stripe.Product;
    const unitPrice = (item.price?.unit_amount || 0) / 100;
    return `${product.name} (Qty: ${item.quantity}) - $${unitPrice.toFixed(2)}`;
  }).join('\n') || 'No items found';

  // Get last 8 characters of session ID
  const shortOrderId = session.id.slice(-8);

  const emailText = `
New Order Received!

Order ID: ${session.id}
Order Date: ${orderDate.toLocaleDateString()} ${orderDate.toLocaleTimeString()}
Total: $${totalAmount.toFixed(2)}
Customer: ${customerName || 'N/A'} (${customerEmail || 'N/A'})

${shippingAddress ? `Shipping Address:
${shippingAddress.line1}
${shippingAddress.line2 ? shippingAddress.line2 + '\n' : ''}${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postal_code}
${shippingAddress.country}

` : ''}Items:
${items}
  `;

  try {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const toEmail = process.env.RESEND_TO_EMAIL;

    if (!apiKey || !fromEmail || !toEmail) {
      console.error('Missing RESEND_API_KEY, RESEND_FROM_EMAIL, or RESEND_TO_EMAIL. Skipping order notification email.');
      return;
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `New order ending in ${shortOrderId}`,
      text: emailText,
    });
  } catch (error) {
    console.error('Failed to send order notification:', error);
  }
}
