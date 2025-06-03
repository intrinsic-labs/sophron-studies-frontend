import React from 'react';
import Link from 'next/link';
import { client, urlFor } from '@/sanity/client'; // Use the client from the correct path
import UpcomingRelease from '@/components/sections/UpcomingRelease'; // Import the component
import { PortableText } from '@portabletext/react'; // Needed for rendering block content
import ShopFilters from '@/components/shop/ShopFilters';
import ScrollManager from '@/components/scaffold/ScrollManager';
import ProductCard from '@/components/shop/ProductCard'; // We'll create this component

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
  const filterConditions = [`isAvailable == true`, `!(_id in path("drafts.**"))`];
  
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
  
  // console.log("Query filter:", filterString); // Debug: Log the filter string
  
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
    const result = await client.fetch<PaginatedProductsResult>(PAGINATED_PRODUCTS_QUERY, {}, { next: { revalidate: 120 } }); // 2 minutes for products
    // console.log("Query result:", result); // Debug: Log the result
    return result;
  } catch (error) {
    console.error("Error fetching paginated products:", error);
    console.error("Query used:", PAGINATED_PRODUCTS_QUERY); // Log the full query on error
    return { products: [], totalProducts: 0 };
  }
}

// Create a client-side wrapper component for ShopFilters
const ClientShopFilters = ({ currentCategory, searchTerm }: { currentCategory: string, searchTerm: string }) => {
  return (
    <ShopFilters
      currentCategory={currentCategory}
      searchTerm={searchTerm}
    />
  );
};

interface SearchParamsType {
  page?: string;
  category?: string;
  search?: string;
}

export default async function Shop({ 
  searchParams 
}: { 
  searchParams: Promise<SearchParamsType>
}) {
  // Await the searchParams promise to get the actual values
  const resolvedParams = await searchParams;
  
  // Now safely extract values from resolvedParams
  const pageParam = resolvedParams.page;
  const categoryParam = resolvedParams.category;
  const searchParam = resolvedParams.search;
  
  // Convert to appropriate types
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const currentCategory = categoryParam || 'all';
  const searchTerm = searchParam || '';
  
  // Validate page number
  const validPage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

  // Fetch upcoming release section from Sanity
  const upcomingRelease = await client.fetch<UpcomingReleaseData | null>(UPCOMING_RELEASE_QUERY, {}, { next: { revalidate: 300 } }); // 5 minutes
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
              className={`px-3 py-1 border rounded-sm ${validPage <= 1 ? 'text-gray-400 pointer-events-none' : 'hover:bg-gray-100'}`}
              aria-disabled={validPage <= 1}
            >
              &larr;
            </Link>
            <span className="text-sm text-gray-700">
              Page {validPage} of {totalPages}
            </span>
            <Link
              href={`/shop?page=${validPage + 1}${currentCategory !== 'all' ? `&category=${currentCategory}` : ''}${searchTerm ? `&search=${searchTerm}` : ''}#studies`}
              className={`px-3 py-1 border rounded-sm ${validPage >= totalPages ? 'text-gray-400 pointer-events-none' : 'hover:bg-gray-100'}`}
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