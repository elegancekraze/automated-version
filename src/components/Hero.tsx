import React from 'react';

interface HeroProps {
  totalPrompts: number;
  categories: number;
  onSearch: (query: string) => void;
}

const Hero: React.FC<HeroProps> = ({ totalPrompts, categories, onSearch }) => {
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <section className="bg-gradient-to-br from-primary-50 to-indigo-100 py-20" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Hero Title */}
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-gradient">549 GPT-5 Prompts</span>
            <br />
            Ready to Use
          </h2>
          
          {/* Hero Subtitle */}
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Discover the most comprehensive collection of unique, high-quality GPT-5 prompts 
            curated from expert communities and latest AI research. Updated regularly with fresh content.
          </p>

          {/* Live Update Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              Fresh Content - Updated regularly with new prompts
            </div>
          </div>

          {/* Hero Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search prompts... (e.g., 'business strategy', 'content writing')"
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 btn-primary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{totalPrompts}+</div>
              <div className="text-sm text-gray-600">Prompts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{categories}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">Daily</div>
              <div className="text-sm text-gray-600">Updates</div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Always Fresh</h3>
              <p className="text-gray-600 text-sm">
                Continuously curated unique prompts from AI experts and research communities
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Assured</h3>
              <p className="text-gray-600 text-sm">
                AI-powered quality scoring and manual curation ensure only the best prompts
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Categorized</h3>
              <p className="text-gray-600 text-sm">
                Organized by use case with difficulty levels and detailed metadata
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
