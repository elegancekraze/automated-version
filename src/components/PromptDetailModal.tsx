import React from 'react';

interface PromptDetailModalProps {
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
    slug?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const PromptDetailModal: React.FC<PromptDetailModalProps> = ({ prompt, isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  // Update URL when modal opens
  React.useEffect(() => {
    if (isOpen && prompt?.slug) {
      // Update URL to SEO-friendly version
      const newUrl = `/prompt/${prompt.slug}`;
      window.history.pushState({}, '', newUrl);
      
      // Update page title for SEO
      document.title = `${prompt.title} - GPT-5 Prompts Directory`;
    }
  }, [isOpen, prompt?.slug, prompt?.title]);

  if (!isOpen || !prompt) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  const handleClose = () => {
    // Restore original URL and title when closing
    window.history.pushState({}, '', '/');
    document.title = 'GPT-5 Prompts Directory - Free ChatGPT Prompts';
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
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
        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24">
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
        <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{prompt.title}</h2>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(prompt.category)}`}>
                {prompt.category}
              </span>
              {prompt.difficulty && (
                <span className={`px-3 py-1 text-sm font-medium rounded border ${getDifficultyColor(prompt.difficulty)}`}>
                  {prompt.difficulty}
                </span>
              )}
              {prompt.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {renderStars(prompt.rating)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{prompt.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Description */}
          {prompt.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{prompt.description}</p>
            </div>
          )}

          {/* Prompt Text */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Prompt</h3>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  copied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <pre className="text-gray-800 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {prompt.prompt_text}
              </pre>
            </div>
          </div>

          {/* Tags */}
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Use Cases */}
          {prompt.use_cases && prompt.use_cases.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Use Cases</h3>
              <ul className="list-disc list-inside space-y-1">
                {prompt.use_cases.map((useCase, index) => (
                  <li key={index} className="text-gray-700">{useCase}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">ID:</span> {prompt.id}
              </div>
              {prompt.source && (
                <div>
                  <span className="font-medium">Source:</span> {prompt.source}
                </div>
              )}
              {prompt.created_date && (
                <div>
                  <span className="font-medium">Created:</span> {new Date(prompt.created_date).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetailModal;
