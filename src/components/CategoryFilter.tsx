import React from 'react';

interface Category {
  key: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}) => {
  const getIconComponent = (iconName: string) => {
    const icons = {
      briefcase: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
        </svg>
      ),
      megaphone: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      code: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      palette: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      ),
      'chart-bar': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      star: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    };
    
    return icons[iconName as keyof typeof icons] || icons.briefcase;
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h3>
      
      <div className="flex flex-wrap gap-3">
        {/* All Categories Button */}
        <button
          onClick={() => onCategoryChange('')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
            selectedCategory === ''
              ? 'bg-primary-600 text-white border-primary-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-primary-300 hover:bg-primary-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="font-medium">All Categories</span>
        </button>

        {/* Category Buttons */}
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => onCategoryChange(category.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
              selectedCategory === category.key
                ? 'text-white border-transparent'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
            style={{
              backgroundColor: selectedCategory === category.key ? category.color : undefined,
              borderColor: selectedCategory === category.key ? category.color : undefined
            }}
          >
            {getIconComponent(category.icon)}
            <span className="font-medium">{category.name}</span>
            {category.count > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                selectedCategory === category.key
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {category.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Selected Category Description */}
      {selectedCategory && categories.find(c => c.key === selectedCategory) && (
        <div className="mt-4 p-4 rounded-lg" style={{ 
          backgroundColor: categories.find(c => c.key === selectedCategory)?.color + '10' 
        }}>
          <p className="text-sm text-gray-700">
            {categories.find(c => c.key === selectedCategory)?.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
