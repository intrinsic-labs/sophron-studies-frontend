'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { type SanityDocument } from "next-sanity";
import BlogHero from './BlogHero';
import BlogPosts from './BlogPosts';
import FeaturedPost from './FeaturedPost';
import Image from 'next/image';
import { urlForImage } from '../../sanity/image';

interface BlogPageContentProps {
  posts: SanityDocument[];
}

export default function BlogPageContent({ posts }: BlogPageContentProps) {

  return (
    <motion.main
      className="min-h-screen bg-background text-primary relative max-w-6xl mx-auto" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <BlogHero />
      <FeaturedPost />
      <BlogPosts />
    </motion.main>
  );
} 