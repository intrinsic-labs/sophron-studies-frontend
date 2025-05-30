import React from 'react';
import { client, urlFor } from '@/sanity/client';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';

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
  price: number;
  isAvailable: boolean;
}

// Query to fetch a single product by its slug
const PRODUCT_QUERY = `*[_type == "product" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
  _id,
  name,
  slug,
  images[]{..., asset->}, // Fetch image details and asset data
  description,
  price,
  isAvailable
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

export default async function ProductDetailPage({ params }: { params: Promise<SlugParams> }) {
  // Await the params before accessing properties
  const { slug } = await params;
  
  const product = await getProduct(slug);

  // If product not found or not available, show 404
  if (!product || !product.isAvailable) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 pb-8 pt-4 relative max-w-7xl">
      {/* Close button positioned top-right */}
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12">
        {/* Image Section */}
        <div>
          {/* Simple image display for now, could be a gallery later */}
          {product.images?.[0] ? (
            <div className="relative w-full aspect-[3/4] bg-transparent flex items-center justify-center">
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
            <div className="aspect-[3/4] bg-gray-200 flex items-center justify-center text-gray-500">No Image Available</div>
          )}
          {/* TODO: Add thumbnail gallery if multiple images */}
        </div>

        {/* Details Section */}
        <div className="flex flex-col justify-center">
        <Link href="/shop#studies" aria-label="Close product details and return to shop" className="text-gray-500 hover:text-gray-800 z-10 py-4">
        <p>← Back to Studies</p>
      </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-gray-800 mb-4 font-mono">${product.price.toFixed(2)} USD</p>

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