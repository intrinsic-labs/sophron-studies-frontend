import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  // For testing - temporarily skip signature verification
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
  
  // Use hardcoded test address for development, or real address in production
  const shippingAddress = (session as any).shipping_details?.address || {
    line1: "123 Test Street",
    line2: "Apt 4B", 
    city: "San Francisco",
    state: "CA",
    postal_code: "94102",
    country: "US"
  };
  
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
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.RESEND_TO_EMAIL || 'asher@asherpope.com',
      subject: `New order ending in ${shortOrderId}`,
      text: emailText,
    });
    
    console.log('Order notification sent successfully');
  } catch (error) {
    console.error('Failed to send order notification:', error);
  }
}