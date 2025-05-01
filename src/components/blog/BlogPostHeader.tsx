"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BlogPost } from '@/lib/blog';

interface BlogPostHeaderProps {
  post: BlogPost;
}

const BlogPostHeader = ({ post }: BlogPostHeaderProps) => {
  return (
    <section className="relative pt-8 md:pt-12 lg:pt-16 overflow-hidden px-4 sm:px-6">
      <div className="container-custom relative z-10">
        
        <div className="max-w-4xl mx-auto md:pt-8 text-center">
          {/* Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-2 mb-6 justify-center"
          >
            {post.category && (
              <Link 
                key={post.category} 
                href={`/?category=${encodeURIComponent(post.category)}`}
                className="font-sans text-sm px-3 py-1 rounded-full border border-olive text-neutral-800 hover:bg-olive hover:text-secondary transition-colors duration-300"
              >
                {post.category}
              </Link>
            )}
          </motion.div>
          
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading1 text-5xl md:text-7xl mb-6 text-center"
          >
            {post.title}
          </motion.h1>
          
          {/* Meta info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center gap-2 md:gap-5 mb-10 justify-center"
          >
            <div className="text-md text-neutral-800 font-sans">
              {post.author.name}
            </div>
            <span className="text-neutral-400">|</span>
            <div className="text-md text-neutral-800 font-sans">
              {post.date}
            </div>
            
            <span className="text-neutral-400">|</span>
            
            <div className="text-md text-neutral-800 font-sans">
              {post.readingTime}
            </div>
          </motion.div>
          
          {/* Featured image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="rounded-xl overflow-hidden mx-auto"
          >
            {post.coverImage && (
              <div className="aspect-w-16 aspect-h-16 md:aspect-h-12 lg:aspect-h-8">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BlogPostHeader; 