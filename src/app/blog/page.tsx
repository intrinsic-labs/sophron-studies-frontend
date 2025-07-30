import { fetchSanity } from '@/sanity/client';
import { allBlogPostsQuery, featuredBlogPostsQuery } from '@/sanity/queries';
import type { AllBlogPostsQueryResult, FeaturedBlogPostsQueryResult } from '@/sanity/types';
import BlogHero from '@/components/blog/BlogHero';
import BlogPageContent from '@/components/blog/BlogPageContent';

async function getBlogData() {
  const [allPosts, featuredPosts] = await Promise.all([
    fetchSanity<AllBlogPostsQueryResult>(
      allBlogPostsQuery,
      {},
      { revalidate: 180, tags: ['blog-posts'] }
    ),
    fetchSanity<FeaturedBlogPostsQueryResult>(
      featuredBlogPostsQuery,
      {},
      { revalidate: 180, tags: ['blog-posts', 'featured-posts'] }
    )
  ]);

  return { allPosts, featuredPosts };
}

export default async function BlogPage() {
  const { allPosts, featuredPosts } = await getBlogData();

  return (
    <div className="min-h-screen bg-background text-primary relative max-w-6xl mx-auto px-4 sm:px-6">
      <BlogHero />
      <BlogPageContent allPosts={allPosts} featuredPosts={featuredPosts} />
    </div>
  );
} 