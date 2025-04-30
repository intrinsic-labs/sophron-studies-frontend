import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { client, urlFor } from '@/sanity/client'; // Use the client from the correct path
import UpcomingRelease from '@/components/UpcomingRelease'; // Import the component
import { PortableText } from '@portabletext/react'; // Needed for rendering block content

// Define Types for fetched data
interface SanityImageReference {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string; // Assuming alt text is defined in the image field itself or in product schema
}

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  images: SanityImageReference[];
  description: any[]; // blockContent type
  price: number;
  isAvailable: boolean;
  _createdAt: string; // For ordering
}

interface UpcomingReleaseData {
  _id: string;
  titlePart1: string;
  titlePart2: string;
  text: any[];
  buttonText: string;
  buttonLink: string;
  image1: { asset: any; alt: string };
  image2: { asset: any; alt: string };
}

interface PaginatedProductsResult {
  products: Product[];
  totalProducts: number;
}

const PRODUCTS_PER_PAGE = 6;

// Fetch the most recently created upcomingReleaseSection
const UPCOMING_RELEASE_QUERY = `*[_type == "upcomingReleaseSection"] | order(_createdAt desc)[0] {
  _id,
  titlePart1,
  titlePart2,
  text,
  buttonText,
  buttonLink,
  image1 {asset->, alt},
  image2 {asset->, alt}
}`;

// Fetch paginated available products and the total count
async function getPaginatedProducts(page: number): Promise<PaginatedProductsResult> {
  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;

  const PAGINATED_PRODUCTS_QUERY = `{
    "products": *[_type == "product" && isAvailable == true && !(_id in path("drafts.**"))] | order(_createdAt desc)[${start}...${end}] {
      _id,
      name,
      slug,
      images[]{..., asset->}, // Fetch image details and asset data
      price,
      _createdAt
    },
    "totalProducts": count(*[_type == "product" && isAvailable == true && !(_id in path("drafts.**"))])
  }`;

  try {
    const result = await client.fetch<PaginatedProductsResult>(PAGINATED_PRODUCTS_QUERY);
    return result;
  } catch (error) {
    console.error("Error fetching paginated products:", error);
    return { products: [], totalProducts: 0 };
  }
}

// Basic Product Card using fetched data
const ProductCard = ({ product }: { product: Product }) => (
  <Link href={`/shop/${product.slug.current}`} className="group">
    <div className="border p-4 text-center transition-shadow duration-300 group-hover:shadow-lg">
      <div className="relative w-full aspect-[3/4] bg-gray-100 mb-4 overflow-hidden"> {/* Aspect ratio based on mockup */}
        {product.images?.[0] ? (
          <Image
            // Use urlFor to get the image URL
            src={urlFor(product.images[0]).width(400).height(533).fit('crop').url()}
            alt={product.images[0].alt || product.name} // Use alt text if available, otherwise product name
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">No Image</div>
        )}
      </div>
      <h3 className="text-lg mb-1">{product.name}</h3>
      <p className="text-gray-700 font-semibold font-mono">${product.price.toFixed(2)} USD</p>
    </div>
  </Link>
);


export default async function Shop({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const currentPage = typeof searchParams?.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  if (isNaN(currentPage) || currentPage < 1) {
    // Redirect or handle invalid page number if needed
    // For now, default to page 1
  }
  const validPage = Math.max(1, currentPage);

  // Fetch upcoming release section from Sanity
  const upcomingRelease = await client.fetch<UpcomingReleaseData | null>(UPCOMING_RELEASE_QUERY);
  const { products, totalProducts } = await getPaginatedProducts(validPage);

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Section 1: Upcoming Release */}
      {upcomingRelease ? (
        <UpcomingRelease
          titlePart1={upcomingRelease.titlePart1}
          titlePart2={upcomingRelease.titlePart2}
          text={<PortableText value={upcomingRelease.text} />}
          imageUrl1={upcomingRelease.image1?.asset ? urlFor(upcomingRelease.image1.asset).width(400).url() : ''}
          imageUrl2={upcomingRelease.image2?.asset ? urlFor(upcomingRelease.image2.asset).width(400).url() : ''}
          imageAlt={upcomingRelease.image1?.alt || 'Upcoming release images'}
          buttonText={upcomingRelease.buttonText}
          buttonLink={upcomingRelease.buttonLink}
        />
      ) : (
        <section className="py-16 bg-gray-100 text-center">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Release</h2>
          <p>Coming Soon!</p>
        </section>
      )}

      {/* Section 2: Studies (Product Grid) */}
      <section className="container mx-auto px-4 py-16 md:max-w-6xl">
        <h2 className="text-4xl font-serif text-center mb-12">Studies</h2>

        {/* Filters/Search Placeholder */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex space-x-2">
            {/* Placeholder filter dropdowns - match mockup */}
            <button className="px-4 py-2 border rounded bg-white text-sm">All Products ▼</button>
            <button className="px-4 py-2 border rounded bg-white text-sm">Leaders Only ▼</button>
          </div>
          <div className="relative w-full md:w-auto">
            <input type="search" placeholder="Search..." className="pl-10 pr-4 py-2 border rounded w-full md:w-64" />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        ) : (
            <p className="text-center text-gray-500">No products found.</p>
        )}


        {/* Pagination */}
        {totalProducts > PRODUCTS_PER_PAGE && (
          <div className="flex justify-center items-center mt-12 space-x-4">
            <Link
              href={`/shop?page=${validPage - 1}`}
              className={`px-3 py-1 border rounded ${validPage <= 1 ? 'text-gray-400 pointer-events-none' : 'hover:bg-gray-100'}`}
              aria-disabled={validPage <= 1}
            >
              &larr;
            </Link>
            <span className="text-sm text-gray-700">
              Page {validPage} of {totalPages}
            </span>
            <Link
              href={`/shop?page=${validPage + 1}`}
              className={`px-3 py-1 border rounded ${validPage >= totalPages ? 'text-gray-400 pointer-events-none' : 'hover:bg-gray-100'}`}
              aria-disabled={validPage >= totalPages}
            >
              &rarr;
            </Link>
          </div>
        )}
      </section>
    </div>
  );
} 