import { NextRequest, NextResponse } from 'next/server';
import { getUSPSClient, PricingRequest } from '@/lib/usps';
import { client } from '@/sanity/client';

interface ShippingRateRequest {
  destinationZipCode: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    const body: ShippingRateRequest = await request.json();
    
    if (!body.destinationZipCode || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: destinationZipCode and items' },
        { status: 400 }
      );
    }

    // Get shipping configuration from Sanity
    const shippingConfig = await client.fetch(`
      *[_type == "shippingConfig" && isActive == true][0] {
        fromAddress,
        shippingSettings,
        businessInfo
      }
    `);

    if (!shippingConfig) {
      return NextResponse.json(
        { error: 'No active shipping configuration found' },
        { status: 500 }
      );
    }

    // Get product details for weight calculation
    const productIds = body.items.map(item => item.productId);
    const products = await client.fetch(`
      *[_type == "product" && _id in $productIds] {
        _id,
        weight,
        dimensions
      }
    `, { productIds });

    // Calculate total weight and use default dimensions
    let totalWeight = 0;
    const productMap = new Map(products.map(p => [p._id, p]));
    
    for (const item of body.items) {
      const product = productMap.get(item.productId);
      const itemWeight = product?.weight || shippingConfig.shippingSettings.packageDefaults.weight;
      totalWeight += itemWeight * item.quantity;
    }

    // Use default package dimensions (can be enhanced later for multiple packages)
    const { length, width, height } = shippingConfig.shippingSettings.packageDefaults.dimensions;

    // Create pricing request
    const pricingRequest: PricingRequest = {
      originZipCode: shippingConfig.fromAddress.zipCode,
      destinationZipCode: body.destinationZipCode,
      weight: totalWeight,
      length,
      width,
      height
    };

    // Get rates from USPS
    const uspsClient = getUSPSClient();
    const uspsRates = await uspsClient.getPricing(pricingRequest);

    // Filter rates based on enabled services and apply markup
    const enabledServices = shippingConfig.shippingSettings.enabledServices
      .filter(service => service.enabled)
      .reduce((acc, service) => {
        acc[service.service] = service.markupPercentage || 0;
        return acc;
      }, {} as Record<string, number>);

    const availableRates = uspsRates
      .filter(rate => enabledServices.hasOwnProperty(rate.service))
      .map(rate => {
        const markup = enabledServices[rate.service];
        const baseRate = parseFloat(rate.rate);
        const finalRate = markup > 0 ? baseRate * (1 + markup / 100) : baseRate;
        
        return {
          ...rate,
          rate: finalRate.toFixed(2),
          originalRate: rate.rate,
          markup: markup > 0 ? `${markup}%` : undefined
        };
      });

    return NextResponse.json({
      success: true,
      data: {
        rates: availableRates,
        totalWeight,
        originZip: shippingConfig.fromAddress.zipCode,
        destinationZip: body.destinationZipCode
      }
    });

  } catch (error) {
    console.error('Shipping calculation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to calculate shipping rates',
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