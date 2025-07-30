import { Metadata } from 'next';
import { fetchSanity, urlFor } from '@/sanity/client';
import { blogPostBySlugQuery, relatedPostsQuery, allPostSlugsQuery } from '@/sanity/queries';
import type { BlogPostBySlugQueryResult, RelatedPostsQueryResult, AllPostSlugsQueryResult } from '@/sanity/types';
import BlogPostHeader from '@/components/blog/BlogPostHeader';
import BlogPostContent from '@/components/blog/BlogPostContent';
import RelatedPosts from '@/components/blog/RelatedPosts';

async function getBlogPostData(slug: string) {
  const post = await fetchSanity<BlogPostBySlugQueryResult>(
    blogPostBySlugQuery,
    { slug },
    { revalidate: 180, tags: ['blog-posts', `post-${slug}`] }
  );

  if (!post) {
    throw new Error(`Blog post with slug "${slug}" not found`);
  }

  // Transform the data to match expected format (using any for content to match legacy interface)
  const transformedPost: any = {
    id: post._id,
    slug: post.slug || '',
    title: post.title || '',
    excerpt: post.excerpt || '',
    content: post.content || [],
    coverImage: post.coverImage ? urlFor(post.coverImage).width(800).url() : '',
    author: {
      name: post.author?.name || '',
      avatar: post.author?.avatar ? urlFor(post.author.avatar).width(100).url() : ''
    },
    date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }) : '',
    readingTime: post.readingTime || '5 min read',
    category: post.category || '',
    tags: post.tags || [],
    featured: post.featured || false
  };

  return transformedPost;
}

async function getRelatedPostsData(slug: string, post: any) {
  const relatedPosts = await fetchSanity<RelatedPostsQueryResult>(
    relatedPostsQuery,
    { 
      slug,
      category: post.category,
      tags: post.tags 
    },
    { revalidate: 180, tags: ['blog-posts'] }
  );

  return (relatedPosts || []).map((p: any) => ({
    id: p._id,
    slug: p.slug || '',
    title: p.title || '',
    excerpt: p.excerpt || '',
    content: p.content || [],
    coverImage: p.coverImage ? urlFor(p.coverImage).width(400).url() : '',
    author: {
      name: p.author?.name || '',
      avatar: p.author?.avatar ? urlFor(p.author.avatar).width(100).url() : ''
    },
    date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }) : '',
    readingTime: p.readingTime || '5 min read',
    category: p.category || '',
    tags: p.tags || [],
    featured: p.featured || false
  }));
}

export async function generateStaticParams() {
  const slugs = await fetchSanity<AllPostSlugsQueryResult>(
    allPostSlugsQuery,
    {},
    { revalidate: 3600, tags: ['blog-posts'] }
  );

  return (slugs || []).map((slug) => ({
    slug: slug || ''
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostData(slug);
  
  return {
    title: `${post.title} | The Sophron Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostData(slug);
  const relatedPosts = await getRelatedPostsData(slug, post);
  
  return (
    <main className="min-h-screen">
      <BlogPostHeader post={post} />
      <BlogPostContent post={post} />
      <RelatedPosts posts={relatedPosts} />
    </main>
  );
} 