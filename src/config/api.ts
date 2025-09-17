// Configuration for Netlify deployment - using static data
const isProduction = import.meta.env.PROD;

export const API_BASE_URL = isProduction 
  ? '' // Use relative URLs for production (Netlify)
  : 'http://localhost:3001'; // Local development server

// Debug: Let's see what's actually being used
console.log('🔧 API Configuration:');
console.log('- Environment:', isProduction ? 'Production' : 'Development');
console.log('- VITE_API_URL from env:', import.meta.env.VITE_API_URL);
console.log('- Final API_BASE_URL:', API_BASE_URL);

export const ENDPOINTS = {
  PROMPTS: isProduction ? '/data.json' : '/api/prompts', // Use static data in production
  CATEGORIES: isProduction ? '/data.json' : '/api/categories', // Categories will be derived from data
  STATS: isProduction ? '/data.json' : '/api/stats' // Stats will be calculated from data
};

export const DEFAULT_PAGINATION = {
  limit: 12,
  page: 1
};

export const SORT_OPTIONS = [
  { value: 'rating', label: 'Best Rated' },
  { value: 'usage', label: 'Most Used' },
  { value: 'recent', label: 'Most Recent' },
  { value: 'quality', label: 'Highest Quality' }
];
