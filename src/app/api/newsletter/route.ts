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
    const apiKey = process.env.BEEHIIV_API_KEY;
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

    if (!apiKey || !publicationId) {
      console.error('Missing Beehiiv configuration. Check BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID in environment variables.');
      return NextResponse.json(
        { error: 'Newsletter service configuration error' },
        { status: 500 }
      );
    }

    // Prepare custom fields array
    const allCustomFields = [];
    
    // Add source as custom field if provided
    if (source) {
      allCustomFields.push({ name: 'Source', value: source });
    }
    
    // Add signup date as custom field if provided
    if (signupDate) {
      allCustomFields.push({ name: 'Signup Date', value: signupDate });
    }
    
    // Add any additional custom fields
    if (customFields && Array.isArray(customFields)) {
      allCustomFields.push(...customFields);
    }

    // Prepare the subscription data
    const subscriptionData = {
      email,
      reactivate_existing: false, // Don't reactivate unsubscribed users
      send_welcome_email: true, // Send welcome email
      utm_source: source || 'website',
      utm_medium: 'newsletter_signup',
      utm_campaign: 'sophron_website',
      referring_site: request.headers.get('referer') || 'direct',
      ...(allCustomFields.length > 0 && { custom_fields: allCustomFields })
    };

    // Make request to Beehiiv API
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Beehiiv API error:', response.status, responseData);
      
      // Handle specific Beehiiv errors
      if (response.status === 400 && responseData.message?.includes('already exists')) {
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to subscribe to newsletter' },
        { status: response.status }
      );
    }

    console.log('Successfully subscribed to Beehiiv:', responseData);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      data: {
        id: responseData.data.id,
        email: responseData.data.email,
        status: responseData.data.status
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