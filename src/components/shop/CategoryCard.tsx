import React from 'react';
import Link from 'next/link';

interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  productCount: number;
}

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link 
      href={`/shop?category=${category.slug.current}#studies`}
      className="block bg-white border border-gray-200 hover:border-gray-300 transition-colors duration-200 h-full"
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">
            {category.title}
          </h3>
          {category.description && (
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
          </span>
          <span className="text-sm text-gray-400">
            →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard; 