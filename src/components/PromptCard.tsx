import React, { useState } from 'react';

// Helper function to format dates
const formatDate = (dateString?: string) => {
  if (!dateString) return 'Unknown';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Unknown';
    
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  } catch {
    return 'Unknown';
  }
};

interface PromptCardProps {
  prompt: {
    id: string | number;
    title: string;
    description?: string;
    prompt_text: string;
    category: string;
    tags?: string[];
    difficulty?: string;
    rating?: number;
    use_cases?: string[];
    source?: string;
    created_date?: string;
    scraped_date?: string;
    slug?: string;
    author?: string;
    isNew?: boolean;
    hasCompleteContent?: boolean;
  };
  onClick?: () => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onClick }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when copying
    try {
      await navigator.clipboard.writeText(prompt.prompt_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Business & Productivity': 'bg-blue-100 text-blue-800',
      'Content & Marketing': 'bg-green-100 text-green-800',
      'Development & Technical': 'bg-purple-100 text-purple-800',
      'Creative & Design': 'bg-pink-100 text-pink-800',
      'Analysis & Research': 'bg-yellow-100 text-yellow-800',
      'Official OpenAI': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'beginner': 'bg-green-50 text-green-700 border-green-200',
      'intermediate': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'advanced': 'bg-orange-50 text-orange-700 border-orange-200',
      'expert': 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[difficulty?.toLowerCase() as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200';
  };
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24">
          <defs>
            <clipPath id="halfStar">
              <rect x="0" y="0" width="12" height="24" />
            </clipPath>
          </defs>
          <path className="fill-current" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          <path className="fill-gray-300" clipPath="url(#halfStar)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }

    return stars;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

    return (
      <div 
        className="prompt-card group cursor-pointer transition-all duration-200 hover:shadow-lg" 
        onClick={handleCardClick}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                {prompt.title}
              </h3>
              {prompt.isNew && (
                <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-500 text-white animate-pulse">
                  NEW
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(prompt.category)}`}>
                {prompt.category}
              </span>
              {prompt.difficulty && (
                <span className={`px-2 py-1 text-xs font-medium rounded border ${getDifficultyColor(prompt.difficulty)}`}>
                  {prompt.difficulty}
                </span>
              )}
            </div>
          </div>        <button
          onClick={handleCopy}
          className={`ml-2 p-2 rounded-lg transition-all duration-200 ${
            copied 
              ? 'bg-green-100 text-green-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Copy prompt"
        >
          {copied ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>

      {/* Description */}
      {prompt.description && (
        <div className="mb-3">
          <p className="text-gray-600 text-sm leading-relaxed">
            {truncateText(prompt.description, 120)}
          </p>
        </div>
      )}

      {/* Prompt Preview */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-gray-700 text-sm leading-relaxed font-mono">
          {truncateText(prompt.prompt_text, 100)}
        </p>
      </div>

      {/* Tags */}
      {prompt.tags && prompt.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {prompt.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                {tag}
              </span>
            ))}
            {prompt.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                +{prompt.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Use Cases */}
      {prompt.use_cases && prompt.use_cases.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-500 mb-1">Use Cases:</h4>
          <div className="text-xs text-gray-600">
            {prompt.use_cases.slice(0, 2).join(', ')}
            {prompt.use_cases.length > 2 && '...'}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          {/* Rating */}
          {prompt.rating && (
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {renderStars(prompt.rating)}
              </div>
              <span className="text-xs font-medium">{prompt.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Date and Author */}
          <div className="flex items-center gap-2 text-xs">
            {prompt.scraped_date && (
              <span>Added: {formatDate(prompt.scraped_date)}</span>
            )}
            {prompt.author && (
              <span>• by {prompt.author}</span>
            )}
          </div>

          {/* ID for reference */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">ID: {prompt.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
