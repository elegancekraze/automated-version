import React from 'react';

interface HeaderProps {
  onNavigate?: (page: 'home' | 'privacy' | 'terms' | 'about' | 'contact' | 'faq' | 'toolkit') => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const handleNavigation = (page: 'home' | 'privacy' | 'terms' | 'about' | 'contact' | 'faq' | 'toolkit', e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a 
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors block"
                aria-label="GPT-5 Prompts - Go to top of page"
              >
                GPT-5 Prompts
              </a>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8" role="navigation" aria-label="Main navigation">
            <button
              onClick={(e) => handleNavigation('home', e)}
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              aria-label="Home page"
            >
              Home
            </button>
            <button
              onClick={(e) => handleNavigation('about', e)}
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              aria-label="About us"
            >
              About
            </button>
            <button
              onClick={(e) => handleNavigation('toolkit', e)}
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-semibold transition-colors bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              aria-label="GPT-5 Toolkit"
            >
              🚀 Toolkit
            </button>
            <button
              onClick={(e) => handleNavigation('contact', e)}
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              aria-label="Contact page"
            >
              Contact
            </button>
            <button
              onClick={(e) => handleNavigation('faq', e)}
              className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              aria-label="FAQ page"
            >
              FAQ
            </button>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <button className="btn-secondary hidden sm:inline-flex">
              Submit Prompt
            </button>
            <button className="btn-primary">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-primary-600 p-2 rounded-md"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
