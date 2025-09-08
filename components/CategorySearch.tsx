import React from 'react';
import { Job } from '../types';

interface Category {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  keywords: string[];
}

interface CategorySearchProps {
    jobs: Job[];
    categories: Category[];
    getJobCountForCategory: (jobs: Job[], keywords: string[]) => number;
    selectedCategory: string | null;
    onSelectCategory: (category: string | null) => void;
}

const CategorySearch: React.FC<CategorySearchProps> = ({ jobs, categories, getJobCountForCategory, selectedCategory, onSelectCategory }) => {
  return (
    <div className="bg-transparent mb-12">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Search by Category</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Explore opportunities across different fields.</p>
        </div>
        {selectedCategory && (
            <button onClick={() => onSelectCategory(null)} className="text-sm font-semibold text-blue-600 hover:underline flex items-center whitespace-nowrap mt-1">
            All Categories
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            </button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map(category => {
          const jobCount = getJobCountForCategory(jobs, category.keywords);
          const isSelected = selectedCategory === category.name;
          return (
            <div 
                key={category.name} 
                onClick={() => onSelectCategory(category.name)}
                className={`p-4 rounded-lg text-center transition-all duration-300 cursor-pointer border ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-700 shadow-sm' : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                }`}
            >
              <div className={`w-12 h-12 rounded-lg mx-auto flex items-center justify-center mb-3 ${
                isSelected ? 'bg-blue-100 dark:bg-blue-800/50 text-blue-600' : 'bg-gray-100 dark:bg-gray-700 text-blue-600'
              }`}>
                <category.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm leading-tight">{category.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{jobCount} open positions</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySearch;