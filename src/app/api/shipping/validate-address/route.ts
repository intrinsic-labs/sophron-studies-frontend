import { NextRequest, NextResponse } from 'next/server';
import { getUSPSClient, AddressValidationRequest } from '@/lib/usps';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { streetAddress, city, state, zipCode, secondaryAddress } = body;
    
    if (!streetAddress || !city || !state || !zipCode) {
      return NextResponse.json(
        { error: 'Missing required address fields' },
        { status: 400 }
      );
    }

    // Create address validation request
    const addressRequest: AddressValidationRequest = {
      streetAddress,
      secondaryAddress,
      city,
      state: state.toUpperCase(),
      zipCode
    };

    // Validate address with USPS
    const uspsClient = getUSPSClient();
    const validationResult = await uspsClient.validateAddress(addressRequest);

    return NextResponse.json({
      success: true,
      data: validationResult
    });

  } catch (error) {
    console.error('Address validation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to validate address',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
} 