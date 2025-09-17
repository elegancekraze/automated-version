// API service for handling both static data (production) and backend API (development)
import { API_BASE_URL, ENDPOINTS } from '../config/api';

const isProduction = import.meta.env.PROD;

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
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Cache for static data
let staticDataCache: Prompt[] | null = null;

// Fetch static data once and cache it
async function fetchStaticData(): Promise<Prompt[]> {
  if (staticDataCache) return staticDataCache;
  
  try {
    // Add cache-busting parameter to ensure fresh data
    const cacheBuster = Date.now();
    const response = await fetch(`/data.json?v=${cacheBuster}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Handle different data formats
    if (Array.isArray(data)) {
      // Direct array format
      staticDataCache = data;
    } else if (data.prompts && Array.isArray(data.prompts)) {
      // Object with prompts array (current format)
      staticDataCache = data.prompts;
    } else {
      // Fallback to empty array
      staticDataCache = [];
    }
    
    console.log(`✅ Loaded ${staticDataCache?.length || 0} prompts from static data`);
    return staticDataCache || [];
  } catch (error) {
    console.error('Failed to fetch static data:', error);
    return [];
  }
}

// Check if a prompt is new (added in the last 24 hours)
function isNewPrompt(prompt: Prompt): boolean {
  const scrapedDate = prompt.scraped_date;
  if (!scrapedDate) return false;
  
  const scrapedTime = new Date(scrapedDate).getTime();
  const now = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  return (now - scrapedTime) < twentyFourHours;
}

// Add new prompt indicators to results and filter out draft content
function addPromptMetadata(prompts: Prompt[]): Prompt[] {
  const seenTitles = new Set();
  const seenTexts = new Set();
  
  return prompts
    .filter(prompt => {
      // Remove Twitter prompts completely
      if (prompt.source === 'twitter' || prompt.source === 'ScrapingDog-X') {
        return false;
      }
      
      // Check for duplicates
      const title = (prompt.title || '').toLowerCase().trim();
      const text = (prompt.prompt_text || '').substring(0, 200).toLowerCase().trim();
      
      if (seenTitles.has(title) && title.length > 10) {
        console.log('Frontend: Duplicate title filtered:', title.substring(0, 50));
        return false;
      }
      
      if (seenTexts.has(text) && text.length > 50) {
        console.log('Frontend: Duplicate content filtered:', text.substring(0, 50));
        return false;
      }
      
      // Only keep substantial, high-quality prompts
      const textLength = (prompt.prompt_text || '').length;
      const titleLength = (prompt.title || '').length;
      
      const isQualityPrompt = textLength >= 100 && // At least 100 characters
                             titleLength >= 15 && // Meaningful title
                             titleLength <= 200 && // Not too long title
                             isCompleteContent(prompt); // Pass quality check
      
      if (isQualityPrompt) {
        // Add to seen sets to prevent future duplicates
        if (title.length > 10) seenTitles.add(title);
        if (text.length > 50) seenTexts.add(text);
        return true;
      }
      
      return false;
    })
    .map(prompt => ({
      ...prompt,
      isNew: isNewPrompt(prompt),
      hasCompleteContent: true // All remaining prompts are complete by definition
    }));
}

// Detect if prompt has complete content vs placeholder/partial content
function isCompleteContent(prompt: Prompt): boolean {
  if (!prompt.title || !prompt.prompt_text) return false;
  
  const title = prompt.title.toLowerCase();
  const content = prompt.prompt_text.toLowerCase();
  
  // Only flag very obvious placeholder patterns
  const placeholderPatterns = [
    /^placeholder/i,
    /^todo/i,
    /^test\s*:/i,
    /^draft\s*:/i,
    /^pending/i,
    /^example\s*:/i
  ];
  
  // Check if content is obvious placeholder
  const hasObviousPlaceholders = placeholderPatterns.some(pattern => 
    pattern.test(title) || pattern.test(content)
  );
  
  // Very lenient criteria - only flag extremely short or empty content
  const isVeryShort = prompt.prompt_text.length < 20; // Only very short content
  
  // Consider complete unless it's obviously a placeholder or extremely short
  return !hasObviousPlaceholders && !isVeryShort;
}

// Filter prompts based on criteria
function filterPrompts(prompts: Prompt[], filters: {
  category?: string;
  search?: string;
  sort?: string;
}): Prompt[] {
  let filtered = [...prompts];

  // Filter by category
  if (filters.category && filters.category !== '') {
    filtered = filtered.filter(prompt => {
      if (!prompt.category) return false; // Skip prompts without category
      
      return prompt.category.toLowerCase().replace(/[^a-z0-9]/g, '_') === filters.category ||
             prompt.category === filters.category;
    });
  }

  // Filter by search
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(prompt => 
      (prompt.title && prompt.title.toLowerCase().includes(searchTerm)) ||
      (prompt.description && prompt.description.toLowerCase().includes(searchTerm)) ||
      (prompt.prompt_text && prompt.prompt_text.toLowerCase().includes(searchTerm)) ||
      (prompt.tags && prompt.tags.some(tag => tag && tag.toLowerCase().includes(searchTerm)))
    );
  }

  // Sort prompts
  if (filters.sort) {
    switch (filters.sort) {
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'title':
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'recent':
      case 'newest':
        // Sort by created_date, scraped_date, or id (newest first)
        filtered.sort((a, b) => {
          const dateA = a.created_date || a.scraped_date || '';
          const dateB = b.created_date || b.scraped_date || '';
          if (dateA && dateB) {
            return dateB.localeCompare(dateA);
          }
          // Fallback to ID sorting (higher ID = newer)
          return (b.id || 0) > (a.id || 0) ? 1 : -1;
        });
        break;
      default:
        // Default: Show newest first, then by rating
        filtered.sort((a, b) => {
          const dateA = a.created_date || a.scraped_date || '';
          const dateB = b.created_date || b.scraped_date || '';
          if (dateA && dateB) {
            return dateB.localeCompare(dateA);
          }
          return (b.rating || 0) - (a.rating || 0);
        });
    }
  }

  return filtered;
}

// Paginate results
function paginate<T>(items: T[], page: number, limit: number): {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
} {
  const total = items.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    items: items.slice(start, end),
    pagination: {
      page,
      limit,
      total,
      pages
    }
  };
}

// Extract categories from static data
function extractCategories(prompts: Prompt[]): Record<string, any> {
  const categoryMap: Record<string, any> = {};
  const categoryCounts: Record<string, number> = {};

  // Count prompts per category
  prompts.forEach(prompt => {
    const category = prompt.category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

    // Create category objects with metadata
    const categoryMetadata: Record<string, {
      name: string;
      description: string;
      color: string;
      icon: string;
    }> = {
      'business_productivity': {
        name: 'Business & Productivity',
        description: 'Prompts for business strategy, workflows, and professional productivity',
        color: 'blue',
        icon: 'briefcase'
      },
      'programming_development': {
        name: 'Programming & Development',
        description: 'Prompts for coding, development, and technical problem solving',
        color: 'purple',
        icon: 'code'
      },
      'marketing_content': {
        name: 'Marketing & Content',
        description: 'Prompts for content creation, copywriting, and marketing strategies',
        color: 'green',
        icon: 'document-text'
      },
      'creative_design': {
        name: 'Creative & Design',
        description: 'Prompts for creative writing, design, and artistic endeavors',
        color: 'pink',
        icon: 'sparkles'
      },
      'data_analytics': {
        name: 'Data & Analytics',
        description: 'Prompts for data analysis, research, and insights',
        color: 'yellow',
        icon: 'chart-bar'
      },
      'gpt_5_specific': {
        name: 'GPT-5 Specific',
        description: 'Advanced prompts specifically designed for GPT-5 capabilities',
        color: 'indigo',
        icon: 'cpu-chip'
      }
    };
    
    Object.entries(categoryCounts).forEach(([category, count]) => {
      const key = category.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
      const defaultMetadata = {
        name: category,
        description: `High-quality prompts for ${category.toLowerCase()}`,
        color: 'gray',
        icon: 'document'
      };

      categoryMap[key] = {
        ...(categoryMetadata[key] || defaultMetadata),
        count
      };
    });

  return categoryMap;
}

// API service functions
export const apiService = {
  async fetchPrompts(params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sort?: string;
  } = {}): Promise<ApiResponse<{ prompts: Prompt[]; pagination: any }>> {
    const { page = 1, limit = 12, category = '', search = '', sort = 'newest' } = params;

    try {
      console.log('🔧 fetchPrompts called with:', { isProduction, page, limit, category, search, sort });
      
      if (isProduction) {
        console.log('📊 Using static data for production');
        // Use static data
        const allPrompts = await fetchStaticData();
        console.log(`📄 Total prompts loaded: ${allPrompts.length}`);
        console.log('📄 Sample prompt:', allPrompts[0]?.title?.substring(0, 50));
        
        if (allPrompts.length === 0) {
          console.error('⚠️ No prompts loaded from static data - checking data.json structure');
          // Try to fetch raw data to debug
          const response = await fetch('/data.json');
          const rawData = await response.json();
          console.log('Raw data structure:', {
            isArray: Array.isArray(rawData),
            hasPrompts: !!rawData.prompts,
            promptsLength: rawData.prompts?.length,
            totalPrompts: rawData.total_prompts,
            keys: Object.keys(rawData)
          });
        }
        
        const filtered = filterPrompts(allPrompts, { category, search, sort });
        console.log(`🔍 Filtered prompts: ${filtered.length}`);
        
        // Add metadata for new prompts and content quality
        const enrichedPrompts = addPromptMetadata(filtered);
        
        const result = paginate(enrichedPrompts, page, limit);
        console.log(`📃 Paginated result: ${result.items.length} items`);

        return {
          success: true,
          data: {
            prompts: result.items,
            pagination: result.pagination
          }
        };
      } else {
        console.log('🔌 Using backend API for development');
        // Use backend API
        const searchParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(category && { category }),
          ...(search && { search }),
          ...(sort && { sort })
        });

        const url = `${API_BASE_URL}${ENDPOINTS.PROMPTS}?${searchParams}`;
        console.log('📡 Fetching from:', url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        return data;
      }
    } catch (error) {
      console.error('❌ Failed to fetch prompts:', error);
      return {
        success: false,
        data: { prompts: [], pagination: { page: 1, limit: 12, total: 0, pages: 0 } },
        error: 'Failed to fetch prompts'
      };
    }
  },

  async fetchCategories(): Promise<ApiResponse<{ categories: Record<string, any> }>> {
    try {
      console.log('🏷️ fetchCategories called with isProduction:', isProduction);
      
      if (isProduction) {
        console.log('📊 Using static data for categories');
        // Extract categories from static data
        const allPrompts = await fetchStaticData();
        console.log(`📄 Total prompts for categories: ${allPrompts.length}`);
        
        const categories = extractCategories(allPrompts);
        console.log('🏷️ Extracted categories:', Object.keys(categories));

        return {
          success: true,
          data: { categories }
        };
      } else {
        console.log('🔌 Using backend API for categories');
        // Use backend API
        const url = `${API_BASE_URL}${ENDPOINTS.CATEGORIES}`;
        console.log('📡 Fetching categories from:', url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        return data;
      }
    } catch (error) {
      console.error('❌ Failed to fetch categories:', error);
      return {
        success: false,
        data: { categories: {} },
        error: 'Failed to fetch categories'
      };
    }
  },

  async fetchStats(): Promise<ApiResponse<any>> {
    try {
      if (isProduction) {
        // Calculate stats from static data
        const allPrompts = await fetchStaticData();
        const categories = extractCategories(allPrompts);
        
        const stats = {
          totalPrompts: allPrompts.length,
          totalCategories: Object.keys(categories).length,
          categoryBreakdown: Object.entries(categories).map(([, cat]) => ({
            category: cat.name,
            count: cat.count
          }))
        };

        return {
          success: true,
          data: stats
        };
      } else {
        // Use backend API
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.STATS}`);
        const data = await response.json();
        
        return data;
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      return {
        success: false,
        data: {},
        error: 'Failed to fetch stats'
      };
    }
  }
};