'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Define the filter categories
export const FILTER_CATEGORIES = [
  { id: 'all', name: 'All Products' },
  { id: 'old-testament', name: 'Old Testament' },
  { id: 'new-testament', name: 'New Testament' },
  { id: 'prayer-books', name: 'Prayer Books' },
  { id: 'topical-devotionals', name: 'Topical Devotionals' },
  { id: 'seasonal-books', name: 'Seasonal Books' },
  { id: 'tweens-teens', name: 'Sophron Tweens & Teens' },
  { id: 'kids', name: 'Sophron Kids' },
];

interface ShopFiltersProps {
  onSearch?: (searchTerm: string) => void;
  onCategoryChange?: (category: string) => void;
  currentCategory: string;
  searchTerm: string;
}

const ShopFilters: React.FC<ShopFiltersProps> = ({
  onSearch,
  onCategoryChange,
  currentCategory = 'all',
  searchTerm = '',
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [localSearchTerm, setLocalSearchTerm] = React.useState(searchTerm);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get display name of current category
  const getCurrentCategoryName = () => {
    const category = FILTER_CATEGORIES.find(cat => cat.id === currentCategory);
    return category ? category.name : 'All Products';
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };

  // Navigate with hash fragment and scroll to studies section
  const navigateWithParams = (params: URLSearchParams) => {
    // Use the studies hash fragment to maintain scroll position
    router.push(`/shop?${params.toString()}#studies`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSearch) {
      onSearch(localSearchTerm);
    } else {
      // Navigate with search params
      const params = new URLSearchParams(searchParams.toString());
      
      // Keep the current page param if it exists
      if (params.has('page')) {
        params.set('page', '1'); // Reset to page 1 when search changes
      }
      
      // Update or delete search param based on content
      if (localSearchTerm.trim() !== '') {
        params.set('search', localSearchTerm);
      } else {
        params.delete('search');
      }
      
      // Keep category param if it exists and is not 'all'
      if (currentCategory && currentCategory !== 'all') {
        params.set('category', currentCategory);
      }
      
      navigateWithParams(params);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    } else {
      // Navigate with category params
      const params = new URLSearchParams(searchParams.toString());
      
      // Reset to page 1 when category changes
      if (params.has('page')) {
        params.set('page', '1');
      }
      
      // Update or delete category param based on value
      if (categoryId !== 'all') {
        params.set('category', categoryId);
      } else {
        params.delete('category');
      }
      
      // Keep search param if it exists
      if (searchTerm && searchTerm.trim() !== '') {
        params.set('search', searchTerm);
      }
      
      navigateWithParams(params);
    }
    setDropdownOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <div className="relative" ref={dropdownRef}>
        <button 
          className="px-4 py-2 border rounded bg-white text-sm flex items-center justify-between min-w-[160px]"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {getCurrentCategoryName()}
          <span className="ml-2">▼</span>
        </button>
        
        {dropdownOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg">
            {FILTER_CATEGORIES.map((category) => (
              <button
                key={category.id}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  currentCategory === category.id ? 'bg-gray-50 font-medium' : ''
                }`}
                onClick={() => handleCategorySelect(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <form onSubmit={handleSearchSubmit} className="relative w-full md:w-auto">
        <input
          type="search"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 border rounded w-full md:w-64"
          value={localSearchTerm}
          onChange={handleSearchChange}
        />
        <button 
          type="submit" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-5 h-5"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" 
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ShopFilters; 