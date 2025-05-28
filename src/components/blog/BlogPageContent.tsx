'use client';

import { motion } from 'framer-motion';
import BlogHero from './BlogHero';
import BlogPosts from './BlogPosts';
import FeaturedPost from './FeaturedPost';
import { BlogPost } from '@/lib/blog'; // Import the BlogPost type

// Define the props interface
interface BlogPageContentProps {
  allPosts: BlogPost[];
  featuredPosts: BlogPost[];
}

export default function BlogPageContent({ allPosts, featuredPosts }: BlogPageContentProps) {
  return (
    <motion.main
      className="min-h-screen bg-background text-primary relative max-w-6xl mx-auto px-4 sm:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <BlogHero />
      <FeaturedPost posts={featuredPosts} />
      <BlogPosts posts={allPosts} />
    </motion.main>
  );
} 