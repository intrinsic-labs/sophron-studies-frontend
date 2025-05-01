"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BlogPost } from '@/lib/blog';
import BlogSearch from './BlogSearch';

const BlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/blog?action=getPosts');
        if (!response.ok) {
          throw new Error('Failed to fetch blog data');
        }
        
        const data = await response.json();
        
        // Check if data is an array or has posts property
        const postsData = Array.isArray(data) ? data : (Array.isArray(data.posts) ? data.posts : []);
        
        // Fetch categories and tags separately if needed
        let categoriesData: string[] = [];
        let tagsData: string[] = [];
        
        try {
          const categoriesResponse = await fetch('/api/blog?action=getCategories');
          if (categoriesResponse.ok) {
            const categoriesResult = await categoriesResponse.json();
            categoriesData = Array.isArray(categoriesResult) ? categoriesResult : [];
          }
          
          const tagsResponse = await fetch('/api/blog?action=getTags');
          if (tagsResponse.ok) {
            const tagsResult = await tagsResponse.json();
            tagsData = Array.isArray(tagsResult) ? tagsResult : [];
          }
        } catch (error) {
          console.error('Error loading categories or tags:', error);
        }
        
        setPosts(postsData);
        setFilteredPosts(postsData);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error('Error loading blog data:', error);
        // Initialize with empty arrays in case of error
        setPosts([]);
        setFilteredPosts([]);
        setCategories([]);
        setTags([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Filter posts based on active category, tag, and search query
    let filtered = [...posts];
    
    if (activeCategory) {
      filtered = filtered.filter(post => post.category === activeCategory);
    }
    
    if (activeTag) {
      filtered = filtered.filter(post => post.tags && post.tags.includes(activeTag));
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    setFilteredPosts(filtered);
  }, [posts, activeCategory, activeTag, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const handleTagClick = (tag: string) => {
    setActiveTag(activeTag === tag ? null : tag);
  };

  const handleClearFilters = () => {
    setActiveCategory(null);
    setActiveTag(null);
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <section className="py-8 md:py-16 bg-background md:px-6">
        <div className="container-custom">
          <div className="space-y-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-24 animate-pulse bg-neutral-800/50 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-16 bg-background md:px-6">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-heading2 mb-6 md:mb-0"
          >
            Posts
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="flex-grow md:flex-grow-0">
              <BlogSearch onSearch={handleSearch} searchQuery={searchQuery} />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg hover:bg-olive/50 ${showFilters ? 'bg-olive' : ''} text-neutral-800 transition-colors duration-300 flex items-center space-x-2 whitespace-nowrap hover:text-orange`}
            >
              {/* <span>{'Filters'}</span> */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </motion.div>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 md:mb-12 overflow-hidden"
          >
            <div className="p-6 rounded-xl bg-olive/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-primary font-sans mb-4 md:mb-0">Filter Articles</h3>
                
                {(activeCategory || activeTag || searchQuery) && (
                  <button 
                    onClick={handleClearFilters}
                    className="text-sm text-neutral-800 transition-all bg-transparent hover:bg-olive rounded-full px-3 py-1 duration-300"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Categories */}
                <div>
                  <h4 className="text-sm font-light text-neutral-800 mb-3">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={`text-xs px-3 py-1 rounded-full transition-colors duration-300 ${
                          activeCategory === category 
                            ? 'bg-olive text-neutral-800 border border-olive' 
                            : 'bg-transparent border border-olive text-neutral-800 hover:bg-olive hover:text-secondary'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Tags */}
                <div>
                  <h4 className="text-sm font-light text-neutral-800 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={`text-xs px-3 py-1 rounded-full transition-colors duration-300 ${
                          activeTag === tag 
                            ? 'bg-olive text-neutral-800 border border-olive' 
                            : 'bg-transparent border border-olive text-neutral-800 hover:bg-olive hover:text-secondary'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Results info */}
        {(activeCategory || activeTag || searchQuery) && filteredPosts && (
          <div className="mb-6 md:mb-8 text-sm text-neutral-800">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'}
            {activeCategory && <span> in <span className="text-primary">{activeCategory}</span></span>}
            {activeTag && <span> with tag <span className="text-primary">{activeTag}</span></span>}
            {searchQuery && <span> for <span className="text-primary">"{searchQuery}"</span></span>}
          </div>
        )}
        
        {/* Blog posts list */}
        {filteredPosts && filteredPosts.length > 0 ? (
          <div className="space-y-6">
            {filteredPosts.map((post, index) => (
              <BlogPostItem key={post.id} post={post} index={index} totalCount={filteredPosts.length} />
            ))}
            <div className="h-16 flex-shrink-0"></div>
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-4">No articles found</h3>
            <p className="text-primary/70 mb-6">Try adjusting your filters or search query</p>
            <button 
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors duration-300"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

interface BlogPostItemProps {
  post: BlogPost;
  index: number;
  totalCount: number;
}

const BlogPostItem = ({ post, index, totalCount }: BlogPostItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 * index }}
    >
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="hover:border-primary/30 transition-colors duration-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            
            <div className="flex-1 space-y-4">

              <div className="flex items-center space-x-2 text-left text-neutral-600 group-hover:text-primary transition-colors duration-300">
                <span className="text-sm">{post.date}</span>
                <span className="text-xs">|</span>
                <span className="text-sm">{post.readingTime}</span>
              </div>

              <h3 className="text-2xl font-heading2 mb-2 group-hover:text-orange transition-colors duration-300">
                {post.title}
              </h3>
              
              {/* Category for mobile only */}
              <div className="flex flex-wrap gap-2 mb-3 md:hidden">
                <span 
                  key={index} 
                  className="text-xs px-3 py-1 rounded-full border border-neutral-500 text-neutral-800 group-hover:border-orange transition-colors duration-300"
                >
                  {post.category}
                </span>
              </div>
            </div>
            
            {/* Category for desktop only - right aligned */}
            <div className="hidden md:block">
              <span 
                className="text-sm font-light px-4 py-1.5 rounded-full border border-neutral-500 text-neutral-800 group-hover:border-orange transition-colors duration-300"
              >
                {post.category}
              </span>
            </div>
          </div>

          {/* Add a divider line between posts, but not after the last post */}
          {index !== totalCount - 1 && (
            <div className="border-b border-neutral-800/50 pb-6 hover:border-primary/30 transition-colors duration-300"></div>
          )}

        </div>
      </Link>
    </motion.div>
  );
};

export default BlogPosts; 