import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, source, signupDate, customFields } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Check for required environment variables
    const apiKey = process.env.MAILERLITE_API_KEY;

    if (!apiKey) {
      console.error('Missing MailerLite configuration. Check MAILERLITE_API_KEY in environment variables.');
      return NextResponse.json(
        { error: 'Newsletter service configuration error' },
        { status: 500 }
      );
    }

    // Prepare the subscriber data for MailerLite
    const subscriberData: any = {
      email,
      status: 'active', // Set subscriber as active
      fields: {}, // MailerLite uses fields object instead of custom_fields array
    };

    // Add source as a field if provided
    if (source) {
      subscriberData.fields.source = source;
    }

    // Add signup date as a field if provided
    if (signupDate) {
      subscriberData.fields.signup_date = signupDate;
    }

    // Add any additional custom fields
    if (customFields && Array.isArray(customFields)) {
      customFields.forEach(field => {
        if (field.name && field.value) {
          subscriberData.fields[field.name.toLowerCase().replace(/\s+/g, '_')] = field.value;
        }
      });
    }

    // Add IP address if available
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIp || null;
    
    if (ipAddress) {
      subscriberData.ip_address = ipAddress;
    }

    // Add subscription timestamp
    subscriberData.subscribed_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Make request to MailerLite API
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(subscriberData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('MailerLite API error:', response.status, responseData);
      
      // Handle specific MailerLite errors
      if (response.status === 422) {
        // Validation errors
        if (responseData.errors?.email) {
          return NextResponse.json(
            { error: 'Please enter a valid email address' },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { error: 'Invalid subscription data provided' },
          { status: 400 }
        );
      }
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Newsletter service authentication error' },
          { status: 500 }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to subscribe to newsletter' },
        { status: response.status }
      );
    }

    console.log('Successfully subscribed to MailerLite:', responseData);

    // Handle both creation (201) and update (200) responses
    const isNewSubscriber = response.status === 201;
    const subscriber = responseData.data;

    return NextResponse.json({
      success: true,
      message: isNewSubscriber 
        ? 'Successfully subscribed to newsletter!' 
        : 'Email updated in newsletter!',
      data: {
        id: subscriber.id,
        email: subscriber.email,
        status: subscriber.status,
        isNew: isNewSubscriber
      }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process newsletter subscription' },
      { status: 500 }
    );
  }
} 