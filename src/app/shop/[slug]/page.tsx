import React from 'react';
import { client, urlFor } from '@/sanity/client';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AddToCartButton from '@/components/shop/AddToCartButton';

// Define Types (can potentially be shared in a types file later)
interface SanityImageReference {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

interface ProductDetail {
  _id: string;
  name: string;
  slug: { current: string };
  images: SanityImageReference[];
  description: any[]; // blockContent type
  price?: number; // Optional for external products
  externalUrl?: string; // For external products
  isAvailable: boolean;
  sizes?: string[];
}

// Query to fetch a single product by its slug
const PRODUCT_QUERY = `*[_type == "product" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
  _id,
  name,
  slug,
  images[]{..., asset->}, // Fetch image details and asset data
  description,
  price,
  externalUrl,
  isAvailable,
  sizes
}`;

// Function to fetch product data
async function getProduct(slug: string): Promise<ProductDetail | null> {
  try {
    const product = await client.fetch<ProductDetail | null>(PRODUCT_QUERY, { slug }, { next: { revalidate: 120 } });
    return product;
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    return null;
  }
}

// Optional: Generate static paths for better performance
// export async function generateStaticParams() {
//   const products = await client.fetch<Array<{ slug: { current: string }}>>(`*[_type == "product" && defined(slug.current)]{ "slug": slug.current }`);
//   return products.map((product) => ({
//     slug: product.slug.current,
//   }));
// }

interface SlugParams {
  slug: string;
}

interface SearchParamsType {
  from_category?: string;
  from_page?: string;
  from_search?: string;
}

export default async function ProductDetailPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<SlugParams>;
  searchParams: Promise<SearchParamsType>;
}) {
  // Await the params before accessing properties
  const { slug } = await params;
  const referrerParams = await searchParams;
  
  const product = await getProduct(slug);

  // If product not found or not available, show 404
  if (!product || !product.isAvailable) {
    notFound();
  }

  // Create back link based on referrer information
  const createBackLink = () => {
    const { from_category, from_page, from_search } = referrerParams;
    
    // If we have referrer info, reconstruct the shop URL
    if (from_category || from_search) {
      const params = new URLSearchParams();
      
      if (from_category) params.set('category', from_category);
      if (from_page) params.set('page', from_page);
      if (from_search) params.set('search', from_search);
      
      const queryString = params.toString();
      return `/shop${queryString ? `?${queryString}` : ''}#studies`;
    }
    
    // Default fallback to categories view
    return '/shop#studies';
  };

  const getBackButtonText = () => {
    const { from_category, from_search } = referrerParams;
    
    if (from_search) {
      return `← Back to Search Results`;
    } else if (from_category) {
      // Convert category slug to display name
      const categoryDisplayNames: Record<string, string> = {
        'old-testament': 'Old Testament',
        'new-testament': 'New Testament',
        'prayer-books': 'Prayer Books',
        'topical-devotionals': 'Topical Devotionals',
        'seasonal-books': 'Seasonal Books',
        'tweens-teens': 'Tweens & Teens',
        'kids': 'Kids',
        'merchandise': 'Merchandise',
        'journals': 'Journals',
        'topical': 'Topical',
        'childrens-books': 'Children\'s Books',
        'devotionals': 'Devotionals',
        'psalms-and-proverbs': 'Psalms & Proverbs',
        'leader-guide': 'Leader Guide',
      };
      
      const displayName = categoryDisplayNames[from_category] || from_category;
      return `← Back to ${displayName}`;
    }
    
    return '← Back to Studies';
  };

  return (
    <div className="container mx-auto px-4 pb-8 pt-4 relative max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12">
        {/* Image Section */}
        <div>
          {/* Simple image display for now, could be a gallery later */}
          {product.images?.[0] ? (
            <div className="relative w-full aspect-3/4 bg-transparent flex items-center justify-center">
              <Image
                src={urlFor(product.images[0]).fit('max').url()}
                alt={product.images[0].alt || product.name}
                width={500}
                height={800}
                objectFit="contain"
                priority // Prioritize loading the main product image
                sizes="(max-width: 768px) 100vw, 50vw"
                className="shadow-md"
              />
            </div>
          ) : (
            <div className="aspect-3/4 bg-gray-200 flex items-center justify-center text-gray-500">No Image Available</div>
          )}
          {/* TODO: Add thumbnail gallery if multiple images */}
        </div>

        {/* Details Section */}
        <div className="flex flex-col justify-center">
          <Link 
            href={createBackLink()} 
            aria-label="Return to previous shop view" 
            className="text-gray-500 hover:text-gray-800 z-10 py-4"
          >
            <p>{getBackButtonText()}</p>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
          {product.externalUrl ? (
            <p className="text-xl text-gray-700 mb-4">Visit external website to check price</p>
          ) : (
            <p className="text-2xl text-gray-800 mb-4 font-mono">${product.price?.toFixed(2)} USD</p>
          )}

          {/* Add to Cart Button */}
          <AddToCartButton product={product} />

          <div className="prose prose-lg max-w-none">
             {/* Use PortableText to render the description */}
            <PortableText value={product.description} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Optional: Metadata generation
// export async function generateMetadata({ params }: { params: Promise<SlugParams> }) {
//   const { slug } = await params;
//   const product = await getProduct(slug);
//   if (!product) {
//     return { title: 'Product Not Found' };
//   }
//   return {
//     title: `${product.name} - Sophron Studies`,
//     description: `Details about the study: ${product.name}`, // Simple description, can be improved
//     // openGraph: {
//     //   images: product.images?.[0] ? [urlFor(product.images[0]).url()] : [],
//     // },
//   };
// } 