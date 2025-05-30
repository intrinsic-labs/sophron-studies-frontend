import { revalidateTag, revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

// Helper function to handle revalidation logic using both tags and paths
function handleRevalidation(documentType: string) {
  const revalidatedPaths: string[] = [];
  const revalidatedTags: string[] = [];
  
  // Revalidate both tags and paths based on document type
  switch (documentType) {
    case 'homePage':
      revalidateTag('homepage');
      revalidatePath('/');
      revalidatedTags.push('homepage');
      revalidatedPaths.push('/');
      break;
    case 'aboutPage':
      revalidateTag('about');
      revalidatePath('/about');
      revalidatedTags.push('about');
      revalidatedPaths.push('/about');
      break;
    case 'post':
      revalidateTag('post');
      revalidateTag('blog');
      revalidatePath('/blog');
      revalidatePath('/');
      revalidatedTags.push('post', 'blog');
      revalidatedPaths.push('/blog', '/');
      break;
    case 'product':
      revalidateTag('product');
      revalidateTag('shop');
      revalidatePath('/shop');
      revalidatedTags.push('product', 'shop');
      revalidatedPaths.push('/shop');
      break;
    case 'upcomingReleaseSection':
      revalidateTag('upcoming');
      revalidatePath('/');
      revalidatePath('/shop');
      revalidatePath('/about');
      revalidatedTags.push('upcoming');
      revalidatedPaths.push('/', '/shop', '/about');
      break;
    case 'blogHero':
      revalidateTag('blog-hero');
      revalidatePath('/blog');
      revalidatedTags.push('blog-hero');
      revalidatedPaths.push('/blog');
      break;
    default:
      // For unknown document types, revalidate by document type
      revalidateTag(documentType);
      revalidatedTags.push(documentType);
      break;
  }
  
  return { revalidatedPaths, revalidatedTags };
}

// GET handler for easy manual testing
export async function GET(request: NextRequest) {
  try {
    console.log('GET request received at /api/revalidate');
    
    // Get parameters from URL
    const { searchParams } = request.nextUrl;
    const secret = searchParams.get('secret');
    const documentType = searchParams.get('type') || 'all';
    
    // Verify the webhook secret (optional but recommended)
    if (!process.env.SANITY_WEBHOOK_SECRET) {
      console.error('SANITY_WEBHOOK_SECRET environment variable not set');
      return NextResponse.json({ 
        message: 'Server configuration error' 
      }, { status: 500 });
    }
    
    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
      console.error('Invalid secret provided');
      return NextResponse.json({ 
        message: 'Invalid or missing secret. Add ?secret=your-secret to the URL' 
      }, { status: 401 });
    }

    const { revalidatedPaths, revalidatedTags } = handleRevalidation(documentType);
    
    console.log(`GET: Revalidated for document type: ${documentType}`);
    console.log(`GET: Revalidated paths:`, revalidatedPaths);
    console.log(`GET: Revalidated tags:`, revalidatedTags);
    
    return NextResponse.json({ 
      message: 'Revalidation triggered successfully via GET',
      documentType: documentType,
      revalidatedPaths: revalidatedPaths,
      revalidatedTags: revalidatedTags,
      usage: 'Visit: /api/revalidate?secret=YOUR_SECRET&type=homePage'
    });
  } catch (error) {
    console.error('Error in GET revalidation:', error);
    return NextResponse.json(
      { message: 'Error processing GET revalidation', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST handler for Sanity webhooks using official next-sanity parseBody
export async function POST(request: NextRequest) {
  try {
    console.log('POST request received at /api/revalidate');
    console.log('Headers:', Object.fromEntries(request.headers.entries()));
    
    // Check if secret is configured
    if (!process.env.SANITY_WEBHOOK_SECRET) {
      console.error('SANITY_WEBHOOK_SECRET environment variable not set');
      return NextResponse.json({ 
        message: 'Server configuration error - missing webhook secret' 
      }, { status: 500 });
    }

    // Use the official parseBody function from next-sanity
    const { body, isValidSignature } = await parseBody<{
      _type: string;
      slug?: string | undefined;
    }>(request, process.env.SANITY_WEBHOOK_SECRET);

    console.log('Webhook body:', body);
    console.log('Signature valid:', isValidSignature);

    // Check if signature is valid
    if (!isValidSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ 
        message: 'Invalid webhook signature' 
      }, { status: 401 });
    }

    // Check if body has required _type field
    if (!body?._type) {
      console.error('Missing _type in webhook payload', body);
      return NextResponse.json({ 
        message: 'Missing _type in payload' 
      }, { status: 400 });
    }

    // Get the document type from the webhook payload
    const documentType = body._type;
    
    const { revalidatedPaths, revalidatedTags } = handleRevalidation(documentType);

    console.log(`POST: Webhook received for document type: ${documentType}`);
    console.log(`POST: Revalidated paths:`, revalidatedPaths);
    console.log(`POST: Revalidated tags:`, revalidatedTags);
    
    return NextResponse.json({ 
      message: 'Revalidation triggered successfully via webhook',
      documentType: documentType,
      revalidatedPaths: revalidatedPaths,
      revalidatedTags: revalidatedTags,
      status: 200,
      revalidated: true,
      now: Date.now(),
      body
    });
  } catch (error) {
    console.error('Error in POST webhook revalidation:', error);
    return NextResponse.json(
      { 
        message: 'Error processing webhook',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 