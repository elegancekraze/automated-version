import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* Outer rotating circle */}
        <div className="w-12 h-12 rounded-full border-4 border-gray-200"></div>
        {/* Inner rotating circle with gradient */}
        <div className="w-12 h-12 rounded-full border-4 border-transparent border-t-primary-600 animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="text-gray-600 mt-4 text-sm">Loading prompts...</p>
    </div>
  );
};

export default LoadingSpinner;
