import React from 'react';
import { client, urlFor } from '@/sanity/client';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { notFound } from 'next/navigation'; // Import notFound
import Link from 'next/link'; // Import Link for the close button

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
    const product = await client.fetch<ProductDetail | null>(PRODUCT_QUERY, { slug });
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

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  // If product not found or not available, show 404
  if (!product || !product.isAvailable) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 relative max-w-7xl">
      {/* Close button positioned top-right */}
      <Link href="/shop" aria-label="Close product details and return to shop" className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10 border border-gray-500 rounded-full p-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Section */}
        <div>
          {/* Simple image display for now, could be a gallery later */}
          {product.images?.[0] ? (
            <div className="relative w-full aspect-[3/4] bg-transparent overflow-hidden flex items-center justify-center">
              <Image
                src={urlFor(product.images[0]).fit('max').url()}
                alt={product.images[0].alt || product.name}
                width={500}
                height={1066}
                objectFit="contain"
                priority // Prioritize loading the main product image
                sizes="(max-width: 768px) 100vw, 50vw"
                className="shadow-md rounded-xl"
              />
            </div>
          ) : (
            <div className="aspect-[3/4] bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">No Image Available</div>
          )}
          {/* TODO: Add thumbnail gallery if multiple images */}
        </div>

        {/* Details Section */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-gray-800 mb-4 font-mono">${product.price.toFixed(2)} USD</p>

          {/* Buy Now Button (Placeholder for Stripe integration) */}
          <button
            className="btn-primary w-full md:w-auto mb-6" // Use your primary button style
          >
            Buy Now
          </button>
          {/* TODO: Add Stripe checkout logic here */}

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
// export async function generateMetadata({ params }: { params: { slug: string } }) {
//   const product = await getProduct(params.slug);
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