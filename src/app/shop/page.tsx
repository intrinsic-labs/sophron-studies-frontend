import React from 'react';
import Link from 'next/link';
import { fetchSanity, urlFor } from '@/sanity/client'; // Use fetchSanity instead of client
import UpcomingRelease from '@/components/sections/UpcomingRelease'; // Import the component
import { PortableText } from '@portabletext/react'; // Needed for rendering block content
import ShopFilters from '@/components/shop/ShopFilters';
import ScrollManager from '@/components/scaffold/ScrollManager';
import ProductCard from '@/components/shop/ProductCard'; // We'll create this component
import CategoryCard from '@/components/shop/CategoryCard';
import { homePageUpcomingReleasesQuery } from '@/sanity/queries/upcomingrelease.queries';

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
  price?: number; // Optional for external products
  externalUrl?: string; // For external products
  isAvailable: boolean;
  categories?: { _id: string; title: string; slug: { current: string } }[];
  sizes?: string[];
  _createdAt: string; // For ordering
}

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  productCount: number;
}

interface PaginatedProductsResult {
  products: Product[];
  totalProducts: number;
}

const PRODUCTS_PER_PAGE = 6;

// Fetch all categories with product counts, ordered alphabetically, excluding empty categories
const CATEGORIES_QUERY = `*[_type == "category"] {
  _id,
  title,
  slug,
  description,
  "productCount": count(*[_type == "product" && isAvailable == true && !(_id in path("drafts.**")) && references(^._id)])
} | order(title asc)`;

// Fetch categories from Sanity
async function getCategories(): Promise<Category[]> {
  try {
    const categories = await fetchSanity<Category[]>(CATEGORIES_QUERY, {}, { revalidate: 300, tags: ['categories'] }); // 5 minutes
    // Handle null response and filter out categories with zero products
    if (!categories || !Array.isArray(categories)) {
      console.warn("Categories query returned null or non-array:", categories);
      return [];
    }
    return categories.filter(category => category.productCount > 0);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

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
      'merchandise': 'merchandise',
      'journals': 'journals',
      'topical': 'topical',
      'childrens-books': 'childrens-books',
      'devotionals': 'devotionals',
      'psalms-and-proverbs': 'psalms-and-proverbs',
      'leader-guide': 'leader-guide',
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
      externalUrl,
      categories[]->{_id, title, slug},
      sizes,
      _createdAt
    },
    "totalProducts": count(*[_type == "product" && ${filterString}])
  }`;

  try {
    const result = await fetchSanity<PaginatedProductsResult>(PAGINATED_PRODUCTS_QUERY, {}, { revalidate: 120, tags: ['products'] }); // 2 minutes for products
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
  const currentCategory = categoryParam || '';
  const searchTerm = searchParam || '';
  
  // Validate page number
  const validPage = isNaN(currentPage) || currentPage < 1 ? 1 : currentPage;

  // Determine if we should show categories or products
  const showCategories = !currentCategory && !searchTerm;

  // Fetch upcoming release sections from Sanity using the same structure as homepage
  const upcomingReleases = await fetchSanity<any>(
    homePageUpcomingReleasesQuery, 
    {}, 
    { 
      revalidate: 300, 
      tags: ['homepage', 'upcomingrelease'] 
    }
  );
  
  // Fetch categories or products based on the view
  const categories = showCategories ? await getCategories() : [];
  const { products, totalProducts } = showCategories ? { products: [], totalProducts: 0 } : await getPaginatedProducts(validPage, currentCategory || 'all', searchTerm);

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  return (
    <div className="space-y-16 md:space-y-24">
      {/* ScrollManager to handle hash navigation */}
      <ScrollManager />
      
      {/* Section 1: Upcoming Releases */}
      {/* New Release Section */}
      {upcomingReleases?.showNewRelease && upcomingReleases?.newRelease && (
        <UpcomingRelease
          status={upcomingReleases.newRelease.status || 'newRelease'}
          backgroundTheme={upcomingReleases.newRelease.backgroundTheme || 'dark'}
          titlePart1={upcomingReleases.newRelease.titlePart1 || ''}
          titlePart2={upcomingReleases.newRelease.titlePart2 || ''}
          text={<PortableText value={upcomingReleases.newRelease.text || []} />}
          imageUrl1={upcomingReleases.newRelease.image1?.asset ? urlFor(upcomingReleases.newRelease.image1.asset).width(400).url() : ''}
          imageUrl2={upcomingReleases.newRelease.image2?.asset ? urlFor(upcomingReleases.newRelease.image2.asset).width(400).url() : ''}
          imageAlt={upcomingReleases.newRelease.image1?.alt || 'New release images'}
          buttonText={upcomingReleases.newRelease.buttonText || ''}
          buttonLink={upcomingReleases.newRelease.buttonLink || ''}
        />
      )}

      {/* Coming Soon Section */}
      {upcomingReleases?.showComingSoon && upcomingReleases?.comingSoon && (
        <div className={upcomingReleases?.showNewRelease && upcomingReleases?.newRelease ? "-mt-16 md:-mt-24" : ""}>
          <UpcomingRelease
            status={upcomingReleases.comingSoon.status || 'comingSoon'}
            backgroundTheme={upcomingReleases.comingSoon.backgroundTheme || 'dark'}
            titlePart1={upcomingReleases.comingSoon.titlePart1 || ''}
            titlePart2={upcomingReleases.comingSoon.titlePart2 || ''}
            text={<PortableText value={upcomingReleases.comingSoon.text || []} />}
            imageUrl1={upcomingReleases.comingSoon.image1?.asset ? urlFor(upcomingReleases.comingSoon.image1.asset).width(400).url() : ''}
            imageUrl2={upcomingReleases.comingSoon.image2?.asset ? urlFor(upcomingReleases.comingSoon.image2.asset).width(400).url() : ''}
            imageAlt={upcomingReleases.comingSoon.image1?.alt || 'Coming soon images'}
            buttonText={upcomingReleases.comingSoon.buttonText || ''}
            buttonLink={upcomingReleases.comingSoon.buttonLink || ''}
          />
        </div>
      )}

      {/* Section 2: Studies */}
      <section className="container mx-auto px-4 pb-16 md:max-w-6xl" id="studies">
        <h2 className="text-4xl font-heading2 text-center mb-12">STUDIES</h2>

        {showCategories ? (
          /* Category Grid View */
          <>
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12 px-8 md:px-0">
                {categories.map((category) => (
                  <CategoryCard key={category._id} category={category} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No categories available.</p>
            )}
          </>
        ) : (
          /* Product Grid View */
          <>
            {/* Breadcrumb Navigation */}
            <div className="mb-8">
              <Link href="/shop#studies" className="text-gray-500 hover:text-gray-800">
                <p>← Back to Categories</p>
              </Link>
            </div>

            {/* Filters/Search Component */}
            <div className="mb-8">
              <ClientShopFilters 
                currentCategory={currentCategory || 'all'}
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
                  href={`/shop?page=${validPage - 1}${currentCategory ? `&category=${currentCategory}` : ''}${searchTerm ? `&search=${searchTerm}` : ''}#studies`}
                  className={`px-3 py-1 border rounded-sm ${validPage <= 1 ? 'text-gray-400 pointer-events-none' : 'hover:bg-gray-100'}`}
                  aria-disabled={validPage <= 1}
                >
                  &larr;
                </Link>
                <span className="text-sm text-gray-700">
                  Page {validPage} of {totalPages}
                </span>
                <Link
                  href={`/shop?page=${validPage + 1}${currentCategory ? `&category=${currentCategory}` : ''}${searchTerm ? `&search=${searchTerm}` : ''}#studies`}
                  className={`px-3 py-1 border rounded-sm ${validPage >= totalPages ? 'text-gray-400 pointer-events-none' : 'hover:bg-gray-100'}`}
                  aria-disabled={validPage >= totalPages}
                >
                  &rarr;
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
} 