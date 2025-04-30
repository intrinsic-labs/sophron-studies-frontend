import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { client, urlFor } from '@/sanity/client'; // Use the client from the correct path
import UpcomingRelease from '@/components/UpcomingRelease'; // Import the component
import { PortableText } from '@portabletext/react'; // Needed for rendering block content
import ShopFilters, { FILTER_CATEGORIES } from '@/components/ShopFilters';
import ScrollManager from '@/components/ScrollManager';

// Define Types for fetched data
interface SanityImageReference {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string; // Assuming alt text is defined in the image field itself or in product schema
}

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
}

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  images: SanityImageReference[];
  description: any[]; // blockContent type
  price: number;
  isAvailable: boolean;
  categories?: { _id: string; title: string; slug: { current: string } }[];
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

// Fetch paginated products with filters and search
async function getPaginatedProducts(
  page: number, 
  categoryId: string = 'all', 
  searchTerm: string = ''
): Promise<PaginatedProductsResult> {
  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;
  
  // Build filter conditions
  let filterConditions = [`isAvailable == true`, `!(_id in path("drafts.**"))`];
  
  // Add category filter if not "all"
  if (categoryId !== 'all') {
    // Map from UI category IDs to Sanity category slugs
    const categorySlugMap: Record<string, string> = {
      'old-testament': 'old-testament',
      'new-testament': 'new-testament',
      'prayer-books': 'prayer-books',
      'topical-devotionals': 'topical-devotionals',
      'seasonal-books': 'seasonal-books',
      'tweens-teens': 'tweens-teens',
      'kids': 'kids',
    };
    
    const categorySlug = categorySlugMap[categoryId];
    if (categorySlug) {
      // Simplified filtering by category references
      // This approach gets all products that reference a category with the specified slug
      filterConditions.push(`"${categorySlug}" in categories[]->slug.current`);
    }
  }
  
  // Add search filter if term provided
  if (searchTerm && searchTerm.trim() !== '') {
    // Using a simple text search across name field
    // Add more fields to search as needed
    filterConditions.push(`name match "*${searchTerm}*"`);
  }
  
  // Combine all filters
  const filterString = filterConditions.join(' && ');
  
  console.log("Query filter:", filterString); // Debug: Log the filter string
  
  const PAGINATED_PRODUCTS_QUERY = `{
    "products": *[_type == "product" && ${filterString}] | order(_createdAt desc)[${start}...${end}] {
      _id,
      name,
      slug,
      images[]{..., asset->}, // Fetch image details and asset data
      price,
      categories[]->{_id, title, slug},
      _createdAt
    },
    "totalProducts": count(*[_type == "product" && ${filterString}])
  }`;

  try {
    const result = await client.fetch<PaginatedProductsResult>(PAGINATED_PRODUCTS_QUERY);
    console.log("Query result:", result); // Debug: Log the result
    return result;
  } catch (error) {
    console.error("Error fetching paginated products:", error);
    console.error("Query used:", PAGINATED_PRODUCTS_QUERY); // Log the full query on error
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

// Create a client-side wrapper component for ShopFilters
const ClientShopFilters = ({ currentCategory, searchTerm }: { currentCategory: string, searchTerm: string }) => {
  return (
    <ShopFilters
      currentCategory={currentCategory}
      searchTerm={searchTerm}
    />
  );
};

export default async function Shop({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const currentPage = typeof searchParams?.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const currentCategory = typeof searchParams?.category === 'string' ? searchParams.category : 'all';
  const searchTerm = typeof searchParams?.search === 'string' ? searchParams.search : '';
  
  if (isNaN(currentPage) || currentPage < 1) {
    // Redirect or handle invalid page number if needed
    // For now, default to page 1
  }
  const validPage = Math.max(1, currentPage);

  // Fetch upcoming release section from Sanity
  const upcomingRelease = await client.fetch<UpcomingReleaseData | null>(UPCOMING_RELEASE_QUERY);
  const { products, totalProducts } = await getPaginatedProducts(validPage, currentCategory, searchTerm);

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  return (
    <div className="space-y-16 md:space-y-24">
      {/* ScrollManager to handle hash navigation */}
      <ScrollManager />
      
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
      <section className="container mx-auto px-4 pb-16 md:max-w-6xl" id="studies">
        <h2 className="text-4xl font-heading2 text-center mb-12">STUDIES</h2>

        {/* Filters/Search Component */}
        <div className="mb-8">
          <ClientShopFilters 
            currentCategory={currentCategory}
            searchTerm={searchTerm}
          />
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12 px-8 md:px-0">
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
              href={`/shop?page=${validPage - 1}${currentCategory !== 'all' ? `&category=${currentCategory}` : ''}${searchTerm ? `&search=${searchTerm}` : ''}#studies`}
              className={`px-3 py-1 border rounded ${validPage <= 1 ? 'text-gray-400 pointer-events-none' : 'hover:bg-gray-100'}`}
              aria-disabled={validPage <= 1}
            >
              &larr;
            </Link>
            <span className="text-sm text-gray-700">
              Page {validPage} of {totalPages}
            </span>
            <Link
              href={`/shop?page=${validPage + 1}${currentCategory !== 'all' ? `&category=${currentCategory}` : ''}${searchTerm ? `&search=${searchTerm}` : ''}#studies`}
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