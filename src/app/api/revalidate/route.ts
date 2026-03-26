import { revalidateTag, revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

// Helper function to handle revalidation logic using both tags and paths
function handleRevalidation(documentType: string) {
  const revalidatedPaths: string[] = [];
  const revalidatedTags: string[] = [];
  const cacheLifeProfile = 'max';
  
  // Revalidate both tags and paths based on document type
  switch (documentType) {
    case 'homePage':
      revalidateTag('homepage', cacheLifeProfile);
      revalidatePath('/');
      revalidatedTags.push('homepage');
      revalidatedPaths.push('/');
      break;
    case 'aboutPage':
      revalidateTag('about', cacheLifeProfile);
      revalidatePath('/about');
      revalidatedTags.push('about');
      revalidatedPaths.push('/about');
      break;
    case 'post':
      revalidateTag('post', cacheLifeProfile);
      revalidateTag('blog', cacheLifeProfile);
      revalidatePath('/blog');
      revalidatePath('/');
      revalidatedTags.push('post', 'blog');
      revalidatedPaths.push('/blog', '/');
      break;
    case 'product':
      revalidateTag('product', cacheLifeProfile);
      revalidateTag('shop', cacheLifeProfile);
      revalidatePath('/shop');
      revalidatedTags.push('product', 'shop');
      revalidatedPaths.push('/shop');
      break;
    case 'upcomingReleaseSection':
      revalidateTag('upcoming', cacheLifeProfile);
      revalidatePath('/');
      revalidatePath('/shop');
      revalidatePath('/about');
      revalidatedTags.push('upcoming');
      revalidatedPaths.push('/', '/shop', '/about');
      break;
    case 'blogHero':
      revalidateTag('blog-hero', cacheLifeProfile);
      revalidatePath('/blog');
      revalidatedTags.push('blog-hero');
      revalidatedPaths.push('/blog');
      break;
    default:
      // For unknown document types, revalidate by document type
      revalidateTag(documentType, cacheLifeProfile);
      revalidatedTags.push(documentType);
      break;
  }
  
  return { revalidatedPaths, revalidatedTags };
}

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed. Use POST with a signed webhook payload.' },
    { status: 405 }
  );
}

// POST handler for Sanity webhooks using official next-sanity parseBody
export async function POST(request: NextRequest) {
  try {
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

    if (!isValidSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ 
        message: 'Invalid webhook signature' 
      }, { status: 401 });
    }

    if (!body?._type) {
      console.error('Missing _type in webhook payload');
      return NextResponse.json({ 
        message: 'Missing _type in payload' 
      }, { status: 400 });
    }

    const documentType = body._type;
    
    const { revalidatedPaths, revalidatedTags } = handleRevalidation(documentType);
    
    return NextResponse.json({ 
      message: 'Revalidation triggered successfully via webhook',
      documentType: documentType,
      revalidatedPaths: revalidatedPaths,
      revalidatedTags: revalidatedTags,
      status: 200,
      revalidated: true,
      now: Date.now()
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
