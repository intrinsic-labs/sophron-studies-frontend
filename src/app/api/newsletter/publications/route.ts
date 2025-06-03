import { NextRequest, NextResponse } from 'next/server';

/**
 * Utility endpoint to fetch publications associated with the API key
 * This helps during setup to get the publication ID
 */
export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.BEEHIIV_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'BEEHIIV_API_KEY environment variable not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.beehiiv.com/v2/publications', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Beehiiv API error:', response.status, errorData);
      return NextResponse.json(
        { error: 'Failed to fetch publications from Beehiiv' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      publications: data.data,
      total: data.total_results
    });

  } catch (error) {
    console.error('Error fetching publications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch publications' },
      { status: 500 }
    );
  }
} 