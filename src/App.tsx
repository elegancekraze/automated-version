import { useState, useEffect } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Hero from './components/Hero';
import PromptCard from './components/PromptCard';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import LoadingSpinner from './components/LoadingSpinner';
import Pagination from './components/Pagination';
import Footer from './components/Footer';
import PromptDetailModal from './components/PromptDetailModal';
import AdminDashboard from './components/AdminDashboard';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import GPT5PromptingToolkit from './components/GPT5PromptingToolkit';
import { apiService } from './services/apiService';

interface Prompt {
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
  featured?: boolean;
  priority?: string;
  created_at?: string;
}

interface Category {
  name: string;
  description: string;
  color: string;
  icon: string;
  count?: number;
}

interface AppState {
  prompts: Prompt[];
  categories: Record<string, Category>;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  selectedCategory: string;
  searchQuery: string;
  sortBy: string;
  totalPrompts: number;
  selectedPrompt: Prompt | null;
  showAdminDashboard: boolean;
  currentView: 'home' | 'privacy' | 'terms' | 'about' | 'contact' | 'faq' | 'toolkit';
}

function App() {
  const [state, setState] = useState<AppState>({
    prompts: [],
    categories: {},
    loading: true,
    error: null,
    currentPage: 1,
    totalPages: 1,
    selectedCategory: '',
    searchQuery: '',
    sortBy: 'newest', // Changed to show newest first by default
    totalPrompts: 0,
    selectedPrompt: null,
    showAdminDashboard: false,
    currentView: 'home'
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle browser navigation and URL routing
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const view = 
        path === '/privacy' ? 'privacy' :
        path === '/terms' ? 'terms' :
        path === '/about' ? 'about' :
        path === '/contact' ? 'contact' :
        path === '/faq' ? 'faq' :
        path === '/toolkit' ? 'toolkit' : 'home';
      setState(prev => ({ ...prev, currentView: view }));
    };

    // Set initial view based on URL
    handlePopState();
    
    // Listen for browser navigation
    window.addEventListener('popstate', handlePopState);
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch prompts when filters change
  useEffect(() => {
    fetchPrompts({
      page: state.currentPage,
      category: state.selectedCategory,
      search: state.searchQuery,
      sort: state.sortBy
    });
  }, [state.currentPage, state.selectedCategory, state.searchQuery, state.sortBy]);

  // Auto-refresh prompts every 5 minutes to show fresh curated content
  useEffect(() => {
    const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
    
    const refreshInterval = setInterval(() => {
      console.log('🔄 Checking for fresh content...');
      fetchPrompts({ silent: true }); // Silent refresh (no loading state)
    }, AUTO_REFRESH_INTERVAL);

    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [state.selectedCategory, state.searchQuery, state.sortBy]);

  // Check for URL-based page routing
  useEffect(() => {
    const handleRouting = () => {
      const path = window.location.pathname;
      
      // Check for static pages first
      if (path === '/privacy' || path === '/privacy-policy') {
        setState(prev => ({ ...prev, currentView: 'privacy' }));
        return;
      }
      if (path === '/terms' || path === '/terms-of-service') {
        setState(prev => ({ ...prev, currentView: 'terms' }));
        return;
      }
      if (path === '/about' || path === '/about-us') {
        setState(prev => ({ ...prev, currentView: 'about' }));
        return;
      }
      if (path === '/contact') {
        setState(prev => ({ ...prev, currentView: 'contact' }));
        return;
      }
      if (path === '/faq' || path === '/help') {
        setState(prev => ({ ...prev, currentView: 'faq' }));
        return;
      }
      if (path === '/toolkit' || path === '/gpt5-toolkit') {
        setState(prev => ({ ...prev, currentView: 'toolkit' }));
        return;
      }
      
      // Check for prompt URLs
      const promptMatch = path.match(/^\/prompt\/(.+)$/);
      if (promptMatch) {
        const slug = promptMatch[1];
        console.log(`🔗 Loading prompt with slug: ${slug}`);
        
        setState(prev => ({ ...prev, currentView: 'home' }));
        
        // Find prompt by slug in current prompts
        const foundPrompt = state.prompts.find(p => p.slug === slug);
        
        if (foundPrompt) {
          setState(prev => ({ ...prev, selectedPrompt: foundPrompt }));
        } else if (state.prompts.length > 0) {
          // Prompt not found in current view, try to search all data
          fetchPromptBySlug(slug);
        }
        return;
      }
      
      // Check for admin access
      const adminPath = '/admin-secret-panel-2025-gpt5';
      if (path === adminPath) {
        const lastAccess = localStorage.getItem('admin_last_access');
        const now = Date.now();
        
        if (lastAccess && (now - parseInt(lastAccess)) < 5000) {
          console.warn('Admin access rate limited');
          return;
        }
        
        localStorage.setItem('admin_last_access', now.toString());
        setState(prev => ({ ...prev, showAdminDashboard: true, currentView: 'home' }));
        window.history.replaceState({}, '', '/');
        console.log('Admin panel accessed at:', new Date().toISOString());
        return;
      }
      
      // Default to home page
      setState(prev => ({ ...prev, currentView: 'home' }));
    };

    handleRouting();
    
    // Listen for URL changes
    window.addEventListener('popstate', handleRouting);
    return () => window.removeEventListener('popstate', handleRouting);
  }, [state.prompts]);

  const fetchPromptBySlug = async (slug: string) => {
    try {
      // Try to fetch all prompts and find the one with matching slug
      const result = await apiService.fetchPrompts({ limit: 1000 }); // Get more prompts
      
      if (result.success) {
        const foundPrompt = result.data.prompts?.find((p: any) => p.slug === slug);
        
        if (foundPrompt) {
          setState(prev => ({ ...prev, selectedPrompt: foundPrompt }));
        } else {
          console.warn(`Prompt with slug "${slug}" not found`);
          // Redirect to home page
          window.history.replaceState({}, '', '/');
        }
      }
    } catch (error) {
      console.error('Failed to fetch prompt by slug:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await apiService.fetchCategories();
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          categories: result.data.categories || {}
        }));
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchPrompts = async (params?: {
    page?: number;
    category?: string;
    search?: string;
    sort?: string;
    silent?: boolean;
  }) => {
    const {
      page = state.currentPage,
      category = state.selectedCategory,
      search = state.searchQuery,
      sort = state.sortBy,
      silent = false
    } = params || {};
    
    try {
      // Only show loading state if not silent refresh
      if (!silent) {
        setState(prev => ({ ...prev, loading: true, error: null }));
      }
      
      const result = await apiService.fetchPrompts({
        page,
        limit: 12,
        category,
        search,
        sort
      });
      
      if (result.success) {
        const newPromptCount = result.data.prompts?.length || 0;
        
        setState(prev => ({
          ...prev,
          prompts: result.data.prompts || [],
          totalPages: result.data.pagination?.pages || 1,
          totalPrompts: result.data.pagination?.total || 0,
          loading: false
        }));
        
        // If silent refresh and new prompts were found, show notification
        if (silent && newPromptCount > 0 && result.data.pagination?.total > state.totalPrompts) {
          console.log(`✨ Found ${result.data.pagination.total - state.totalPrompts} new unique prompts!`);
        }
      } else {
        setState(prev => ({
          ...prev,
          error: result.error || 'Failed to fetch prompts',
          loading: false
        }));
      }
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch prompts',
        loading: false
      }));
    }
  };

  const handleCategoryChange = (category: string) => {
    setState(prev => ({
      ...prev,
      selectedCategory: category,
      currentPage: 1
    }));
  };

  const handleSearch = (query: string) => {
    setState(prev => ({
      ...prev,
      searchQuery: query,
      currentPage: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePromptClick = (prompt: Prompt) => {
    setState(prev => ({ ...prev, selectedPrompt: prompt }));
  };

  const handleCloseModal = () => {
    setState(prev => ({ ...prev, selectedPrompt: null }));
  };

  const handleCloseAdmin = () => {
    setState(prev => ({ ...prev, showAdminDashboard: false }));
    // Refresh data after admin actions
    fetchCategories();
    fetchPrompts();
  };

  // SEO meta data
  const getPageTitle = () => {
    if (state.selectedCategory && state.categories[state.selectedCategory]) {
      return `${state.categories[state.selectedCategory].name} Prompts - GPT-5 Directory`;
    }
    if (state.searchQuery) {
      return `"${state.searchQuery}" Prompts - GPT-5 Directory`;
    }
    return 'GPT-5 Prompt Directory - 70+ Curated AI Prompts';
  };

  const getPageDescription = () => {
    if (state.selectedCategory && state.categories[state.selectedCategory]) {
      const category = state.categories[state.selectedCategory];
      return `Discover ${category.count || 0} high-quality ${category.name.toLowerCase()} prompts for GPT-5 and other AI models. ${category.description}`;
    }
    if (state.searchQuery) {
      return `Search results for "${state.searchQuery}" - Find the perfect AI prompts for your needs.`;
    }
    return `Discover ${state.totalPrompts}+ high-quality, curated prompts for GPT-5 and other AI models. Browse by category, search by keyword, and copy prompts instantly.`;
  };

  const getStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": getPageTitle(),
      "description": getPageDescription(),
      "url": window.location.href,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": state.totalPrompts,
        "itemListElement": state.prompts.map((prompt, index) => ({
          "@type": "CreativeWork",
          "position": index + 1,
          "name": prompt.title,
          "description": prompt.description,
          "category": prompt.category,
          "keywords": prompt.tags?.join(', ')
        }))
      }
    };
  };

  if (state.loading && state.prompts.length === 0) {
    return (
      <HelmetProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Helmet>
            <title>Loading... - GPT-5 Prompt Directory</title>
          </Helmet>
          <Header />
          <div className="flex items-center justify-center h-screen">
            <LoadingSpinner />
          </div>
        </div>
      </HelmetProvider>
    );
  }

  if (state.error) {
    return (
      <HelmetProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Helmet>
            <title>Error - GPT-5 Prompt Directory</title>
          </Helmet>
          <Header />
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="text-red-600 text-xl mb-4">{state.error}</div>
              <button 
                onClick={() => {
                  setState(prev => ({ ...prev, error: null }));
                  fetchPrompts();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Helmet>
          <title>
            {state.currentView === 'privacy' ? 'Privacy Policy - GPT-5 Prompts Directory' :
             state.currentView === 'terms' ? 'Terms of Service - GPT-5 Prompts Directory' :
             state.currentView === 'about' ? 'About Us - GPT-5 Prompts Directory' :
             state.currentView === 'contact' ? 'Contact - GPT-5 Prompts Directory' :
             state.currentView === 'faq' ? 'FAQ - GPT-5 Prompts Directory' :
             getPageTitle()}
          </title>
          <meta name="description" content={
            state.currentView === 'privacy' ? 'Privacy Policy for GPT-5 Prompts Directory. Learn how we protect your data and privacy.' :
            state.currentView === 'terms' ? 'Terms of Service for GPT-5 Prompts Directory. Usage guidelines and legal information.' :
            state.currentView === 'about' ? 'Learn about GPT-5 Prompts Directory - our mission, team, and commitment to quality AI prompts.' :
            state.currentView === 'contact' ? 'Contact GPT-5 Prompts Directory. Get support, provide feedback, or ask questions.' :
            state.currentView === 'faq' ? 'Frequently Asked Questions about GPT-5 Prompts Directory. Find answers to common questions.' :
            getPageDescription()
          } />
          <meta name="keywords" content="GPT-5, AI prompts, ChatGPT prompts, prompt engineering, content creation, automation" />
          <link rel="canonical" href={window.location.href} />
          
          {/* Open Graph */}
          <meta property="og:title" content={getPageTitle()} />
          <meta property="og:description" content={getPageDescription()} />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:type" content="website" />
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={getPageTitle()} />
          <meta name="twitter:description" content={getPageDescription()} />
          
          {/* Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify(getStructuredData())}
          </script>
        </Helmet>

        <Header onNavigate={(page) => {
          setState(prev => ({ ...prev, currentView: page }));
          window.history.pushState({}, '', 
            page === 'home' ? '/' :
            page === 'privacy' ? '/privacy' :
            page === 'terms' ? '/terms' :
            page === 'about' ? '/about' :
            page === 'contact' ? '/contact' :
            page === 'faq' ? '/faq' :
            page === 'toolkit' ? '/toolkit' : '/'
          );
        }} />

        {/* Render different pages based on current view */}
        {state.currentView === 'privacy' && <PrivacyPolicy />}
        {state.currentView === 'terms' && <TermsOfService />}
        {state.currentView === 'about' && <AboutUs />}
        {state.currentView === 'contact' && <Contact />}
        {state.currentView === 'faq' && <FAQ />}
        {state.currentView === 'toolkit' && <GPT5PromptingToolkit />}
        
        {/* Home page content */}
        {state.currentView === 'home' && (
          <>
            <Hero 
              totalPrompts={state.totalPrompts}
              categories={Object.keys(state.categories).length}
              onSearch={handleSearch}
            />
            
            <main id="main-content" className="container mx-auto px-4 py-8" role="main">
          {/* Search and Filters */}
          <section id="browse" className="mb-8 space-y-6">
            <SearchBar 
              onChange={handleSearch}
              placeholder="Search prompts by title, description, or tags..."
              value={state.searchQuery}
            />
            
            <div id="categories">
              <CategoryFilter
                categories={Object.entries(state.categories).map(([key, category]) => ({
                  key,
                  ...category,
                  count: category.count || 0
                }))}
                selectedCategory={state.selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </section>

          {/* Results Summary */}
          <div className="mb-6">
            <div className="text-sm text-gray-600">
              Showing {state.prompts.length} of {state.totalPrompts} prompts
              {state.selectedCategory && state.categories[state.selectedCategory] && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {state.categories[state.selectedCategory].name}
                </span>
              )}
              {state.searchQuery && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  "{state.searchQuery}"
                </span>
              )}
            </div>
          </div>

          {/* Featured Coding Prompts Section */}
          {!state.searchQuery && !state.selectedCategory && (() => {
            const codingPrompts = state.prompts.filter(prompt => 
              prompt.featured === true
            ).slice(0, 6);
            
            return codingPrompts.length > 0 ? (
              <section className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <span className="text-3xl mr-3">💻</span>
                      Featured Coding Prompts
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Fresh coding prompts scraped from GitHub repositories - perfect for developers and programmers
                    </p>
                  </div>
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    New
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {codingPrompts.map((prompt) => (
                    <div 
                      key={prompt.id} 
                      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                      onClick={() => handlePromptClick(prompt)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                          {prompt.category}
                        </span>
                        <div className="flex items-center text-yellow-500 text-sm">
                          ⭐ Featured
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {prompt.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {prompt.description || prompt.prompt_text}
                      </p>
                      {prompt.tags && prompt.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {prompt.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-6">
                  <button
                    onClick={() => {
                      setState(prev => ({ ...prev, selectedCategory: 'programming' }));
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    View All Coding Prompts
                  </button>
                </div>
              </section>
            ) : null;
          })()}

          {/* Loading overlay for subsequent loads */}
          {state.loading && (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          )}

          {/* Prompts Grid */}
          <section id="prompts">
          {!state.loading && state.prompts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                {state.searchQuery || state.selectedCategory 
                  ? 'No prompts found matching your criteria.' 
                  : 'No prompts available.'}
              </div>
              {(state.searchQuery || state.selectedCategory) && (
                <button 
                  onClick={() => {
                    setState(prev => ({
                      ...prev,
                      searchQuery: '',
                      selectedCategory: '',
                      currentPage: 1
                    }));
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {state.prompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onClick={() => handlePromptClick(prompt)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {state.totalPages > 1 && (
                <Pagination
                  currentPage={state.currentPage}
                  totalPages={state.totalPages}
                  totalItems={state.totalPrompts}
                  itemsPerPage={10}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
          </section>
        </main>

        {/* About Section */}
        <section id="about" className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About GPT-5 Prompts</h2>
              <p className="text-lg text-gray-700 mb-8">
                Discover the power of advanced AI with our curated collection of 549 high-quality GPT-5 prompts. 
                From business productivity to creative design, our prompts are carefully crafted to help you unlock 
                the full potential of artificial intelligence.
              </p>
              <div className="grid md:grid-cols-3 gap-8 text-left">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">High Quality</h3>
                  <p className="text-gray-600">Every prompt is thoroughly tested and optimized for maximum effectiveness.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Diverse Categories</h3>
                  <p className="text-gray-600">Six comprehensive categories covering all aspects of AI-powered productivity.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Regular Updates</h3>
                  <p className="text-gray-600">Fresh content added regularly to keep you at the forefront of AI innovation.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
          </>
        )}

        <Footer onNavigate={(page) => {
          setState(prev => ({ ...prev, currentView: page }));
          window.history.pushState({}, '', 
            page === 'home' ? '/' :
            page === 'privacy' ? '/privacy' :
            page === 'terms' ? '/terms' :
            page === 'about' ? '/about' :
            page === 'contact' ? '/contact' :
            page === 'faq' ? '/faq' :
            page === 'toolkit' ? '/toolkit' : '/'
          );
        }} />

        {/* Hidden Admin Dashboard */}
        {state.showAdminDashboard && (
          <AdminDashboard onClose={handleCloseAdmin} />
        )}

        {/* Prompt Detail Modal */}
        {state.selectedPrompt && (
          <PromptDetailModal
            prompt={state.selectedPrompt}
            isOpen={!!state.selectedPrompt}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </HelmetProvider>
  );
}

export default App;
