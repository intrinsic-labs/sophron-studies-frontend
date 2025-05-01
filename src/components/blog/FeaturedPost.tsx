"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BlogPost } from '@/lib/blog';

const FeaturedPost = () => {
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedPost = async () => {
      try {
        const response = await fetch('/api/blog?action=getFeaturedPosts');
        if (!response.ok) {
          throw new Error('Failed to fetch featured post');
        }
        
        const posts = await response.json();
        setFeaturedPost(posts[0] || null);
      } catch (error) {
        console.error('Error loading featured post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedPost();
  }, []);

  if (isLoading) {
    return (
      <section className="py-8 md:px-4 md:py-16 bg-background/30">
        <div className="container-custom">
          <div className="h-96 animate-pulse bg-neutral-800/50 rounded-xl"></div>
        </div>
      </section>
    );
  }

  if (!featuredPost) {
    return null;
  }

  return (
    <section className="py-8 md:px-4 md:py-16 bg-background/30">
      <div className="container-custom">
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <span className="inline-block text-primary text-md font-medium">FEATURED PAPER</span>
        </motion.div> */}

        <Link href={`/blog/${featuredPost.slug}`} className="block group">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative rounded-xl overflow-hidden"
          >
            {/* Image */}
            <div className="relative aspect-[3/4.5] md:aspect-[16/9] lg:aspect-[21/9] w-full overflow-hidden">
              {featuredPost.coverImage && (
                <img 
                  src={featuredPost.coverImage} 
                  alt={featuredPost.title} 
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                />
              )}
              
              {/* Gradient overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-primary to-transparent z-10 pointer-events-none"
              />
              
              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-12 z-20">
                <div className="max-w-3xl">
                  <div className="flex items-center space-x-1 mb-3 text-sm font-sans text-neutral-800/60 group-hover:text-orange transition-colors duration-300">
                    <span>Featured Post</span>
                    <span className="text-neutral-800/40">|</span>
                    <span>{featuredPost.readingTime}</span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-heading1 font-bold text-secondary mb-4">
                    {featuredPost.title}
                  </h2>
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedPost; 