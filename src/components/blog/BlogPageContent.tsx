'use client';

import { motion } from 'framer-motion';
import { urlFor } from '@/sanity/client';
import BlogPosts from './BlogPosts';
import FeaturedPost from './FeaturedPost';
import type { AllBlogPostsQueryResult, FeaturedBlogPostsQueryResult } from '@/sanity/types';

// Legacy BlogPost interface for components that haven't been updated yet
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: any[];
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readingTime: string;
  category: string;
  tags: string[];
  featured?: boolean;
}

interface BlogPageContentProps {
  allPosts: AllBlogPostsQueryResult;
  featuredPosts: FeaturedBlogPostsQueryResult;
}

// Helper function to transform Sanity data to legacy format
function transformSanityToBlogPost(post: any): BlogPost {
  return {
    id: post._id,
    slug: post.slug || '',
    title: post.title || '',
    excerpt: post.excerpt || '',
    content: post.content || [],
    coverImage: post.coverImage ? urlFor(post.coverImage).width(400).url() : '',
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
}

export default function BlogPageContent({ allPosts, featuredPosts }: BlogPageContentProps) {
  // Transform Sanity data to legacy format
  const transformedAllPosts = (allPosts || []).map(transformSanityToBlogPost);
  const transformedFeaturedPosts = (featuredPosts || []).map(transformSanityToBlogPost);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <FeaturedPost posts={transformedFeaturedPosts} />
      <BlogPosts posts={transformedAllPosts} />
    </motion.main>
  );
} 