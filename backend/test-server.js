const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const RedditScraper = require('./src/scrapers/reddit-scraper');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

// Load prompts from JSON file
let allPrompts = [];
let redditScraper = null;

// Initialize scraper
async function initializeScraper() {
  try {
    redditScraper = new RedditScraper();
    console.log('🔧 Reddit scraper initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Reddit scraper:', error.message);
  }
}

async function loadPrompts() {
  try {
    const promptsPath = path.join(__dirname, '..', 'data', 'gpt5_prompts_full.json');
    const promptsData = fs.readFileSync(promptsPath, 'utf8');
    allPrompts = JSON.parse(promptsData);
    console.log(`Successfully loaded ${allPrompts.length} prompts from database`);
  } catch (error) {
    console.error('Error loading prompts:', error);
    allPrompts = [];
  }
}

// Initialize data and scraper
loadPrompts();
initializeScraper();

// Define category mappings based on the data
const categoryMappings = {
  'Business & Productivity': {
    name: 'Business & Productivity',
    description: 'Prompts for business strategy, workflows, and professional productivity',
    color: 'blue',
    icon: 'briefcase'
  },
  'Content & Marketing': {
    name: 'Content & Marketing',
    description: 'Prompts for content creation, copywriting, and marketing strategies',
    color: 'green',
    icon: 'document-text'
  },
  'Development & Technical': {
    name: 'Development & Technical',
    description: 'Prompts for programming, development, and technical problem solving',
    color: 'purple',
    icon: 'code'
  },
  'Creative & Design': {
    name: 'Creative & Design',
    description: 'Prompts for creative writing, design, and artistic endeavors',
    color: 'pink',
    icon: 'sparkles'
  },
  'Analysis & Research': {
    name: 'Analysis & Research',
    description: 'Prompts for data analysis, research, and critical thinking',
    color: 'yellow',
    icon: 'chart-bar'
  },
  'Official OpenAI': {
    name: 'Official OpenAI',
    description: 'Official prompts and examples from OpenAI',
    color: 'indigo',
    icon: 'cpu-chip'
  }
};

// Helper function to search prompts
function searchPrompts(query, prompts) {
  if (!query || query.trim() === '') {
    return prompts;
  }

  const searchTerm = query.toLowerCase().trim();
  
  return prompts.filter(prompt => {
    // Search in title, description, tags, and prompt_text
    const searchableText = [
      prompt.title || '',
      prompt.description || '',
      prompt.prompt_text || '',
      (prompt.tags || []).join(' '),
      (prompt.use_cases || []).join(' ')
    ].join(' ').toLowerCase();
    
    return searchableText.includes(searchTerm);
  });
}

// Routes
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'GPT-5 Prompts API is working',
    timestamp: new Date(),
    totalPrompts: allPrompts.length
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    promptsLoaded: allPrompts.length
  });
});

// Get all categories
app.get('/api/categories', (req, res) => {
  try {
    // Get unique categories from the data
    const categories = [...new Set(allPrompts.map(p => p.category))];
    const categoryData = {};
    
    categories.forEach(cat => {
      if (categoryMappings[cat]) {
        categoryData[cat.toLowerCase().replace(/[^a-z0-9]/g, '_')] = {
          ...categoryMappings[cat],
          count: allPrompts.filter(p => p.category === cat).length
        };
      }
    });

    res.json({
      success: true,
      data: {
        categories: categoryData
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

// Get prompts with filtering, searching, and pagination
app.get('/api/prompts', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const category = req.query.category;
    const search = req.query.search;
    
    let filtered = [...allPrompts];
    
    // Filter by category
    if (category && category !== 'all') {
      // Convert category key back to full name
      const categoryName = Object.keys(categoryMappings).find(name => 
        name.toLowerCase().replace(/[^a-z0-9]/g, '_') === category
      );
      
      if (categoryName) {
        filtered = filtered.filter(p => p.category === categoryName);
      } else {
        // Fallback: try direct match
        filtered = filtered.filter(p => p.category === category);
      }
    }
    
    // Search functionality
    if (search) {
      filtered = searchPrompts(search, filtered);
    }
    
    // Pagination
    const start = (page - 1) * limit;
    const end = Math.min(start + limit, filtered.length);
    const paginatedPrompts = filtered.slice(start, end);
    
    res.json({
      success: true,
      data: paginatedPrompts,
      pagination: {
        total: filtered.length,
        page,
        limit,
        pages: Math.ceil(filtered.length / limit),
        hasMore: end < filtered.length
      }
    });
  } catch (error) {
    console.error('Error fetching prompts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch prompts'
    });
  }
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
  try {
    // Calculate category breakdown
    const categoryCount = {};
    allPrompts.forEach(prompt => {
      const category = prompt.category || 'Uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    const categoryBreakdown = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
    
    const stats = {
      totalPrompts: allPrompts.length,
      totalCategories: Object.keys(categoryCount).length,
      categoryBreakdown
    };
    
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a single prompt by ID
app.get('/api/prompts/:id', (req, res) => {
  try {
    const promptId = req.params.id;
    const prompt = allPrompts.find(p => p.id === promptId || p.id === parseInt(promptId));
    
    if (!prompt) {
      return res.status(404).json({
        success: false,
        error: 'Prompt not found'
      });
    }
    
    res.json({
      success: true,
      data: prompt
    });
  } catch (error) {
    console.error('Error fetching prompt:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch prompt'
    });
  }
});

// Get random prompts
app.get('/api/prompts/random/:count', (req, res) => {
  try {
    const count = Math.min(parseInt(req.params.count) || 5, 20);
    const shuffled = [...allPrompts].sort(() => 0.5 - Math.random());
    const randomPrompts = shuffled.slice(0, count);
    
    res.json({
      success: true,
      data: randomPrompts
    });
  } catch (error) {
    console.error('Error fetching random prompts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch random prompts'
    });
  }
});

// Get stats
app.get('/api/stats', (req, res) => {
  try {
    const categories = [...new Set(allPrompts.map(p => p.category))];
    const categoryStats = categories.map(cat => ({
      category: cat,
      count: allPrompts.filter(p => p.category === cat).length
    }));

    res.json({
      success: true,
      data: {
        totalPrompts: allPrompts.length,
        totalCategories: categories.length,
        categoryBreakdown: categoryStats
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stats'
    });
  }
});

// Scraping endpoints
app.post('/api/scrape/reddit', async (req, res) => {
  try {
    if (!redditScraper) {
      return res.status(500).json({
        success: false,
        error: 'Reddit scraper not initialized'
      });
    }

    console.log('🚀 Starting Reddit scraping...');
    const { subreddit = 'ChatGPT', limit = 10 } = req.body;
    
    // Authenticate if needed
    await redditScraper.authenticate();
    
    // Quick scrape test
    const newPrompts = await redditScraper.quickScrapeTest(limit);
    
    console.log(`📝 Scraped ${newPrompts.length} new prompts from Reddit`);
    
    // Convert Reddit format to our format
    const formattedPrompts = newPrompts.map((prompt, index) => ({
      id: allPrompts.length + index + 1,
      title: prompt.title,
      description: `Scraped from Reddit r/${prompt.subreddit}`,
      prompt_text: prompt.content,
      category: prompt.category,
      tags: extractTags(prompt.content),
      difficulty: 'Intermediate',
      rating: Math.min(5, Math.max(1, prompt.score / 10 + 3)),
      use_cases: [prompt.category],
      source: `Reddit - r/${prompt.subreddit}`,
      created_date: new Date().toISOString().split('T')[0]
    }));

    // Add to current prompts
    allPrompts.push(...formattedPrompts);

    // Save to file
    await savePrompts();

    res.json({
      success: true,
      data: {
        newPrompts: formattedPrompts.length,
        totalPrompts: allPrompts.length,
        prompts: formattedPrompts
      }
    });
  } catch (error) {
    console.error('Error scraping Reddit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to scrape Reddit: ' + error.message
    });
  }
});

app.post('/api/scrape/full', async (req, res) => {
  try {
    if (!redditScraper) {
      return res.status(500).json({
        success: false,
        error: 'Reddit scraper not initialized'
      });
    }

    console.log('🚀 Starting full Reddit scraping across multiple subreddits...');
    
    // Authenticate
    await redditScraper.authenticate();
    
    // Full scrape (this might take a while)
    const newPrompts = await redditScraper.scrapeAll();
    
    console.log(`📝 Scraped ${newPrompts.length} new prompts from all subreddits`);
    
    // Convert and add to database
    const formattedPrompts = newPrompts.map((prompt, index) => ({
      id: allPrompts.length + index + 1,
      title: prompt.title,
      description: prompt.description || `Scraped from Reddit`,
      prompt_text: prompt.prompt,
      category: prompt.category,
      tags: prompt.tags || [],
      difficulty: prompt.difficulty,
      rating: prompt.rating || 3.5,
      use_cases: prompt.use_cases || [prompt.category],
      source: prompt.source,
      created_date: new Date().toISOString().split('T')[0]
    }));

    // Add to current prompts
    allPrompts.push(...formattedPrompts);

    // Save to file
    await savePrompts();

    res.json({
      success: true,
      data: {
        newPrompts: formattedPrompts.length,
        totalPrompts: allPrompts.length,
        message: 'Full scraping completed successfully'
      }
    });
  } catch (error) {
    console.error('Error in full scraping:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete full scraping: ' + error.message
    });
  }
});

// Helper functions
function extractTags(text) {
  const words = text.toLowerCase().split(/\s+/);
  const commonTags = ['prompt', 'chatgpt', 'ai', 'gpt', 'automation', 'business', 'creative', 'coding', 'analysis'];
  return words.filter(word => commonTags.includes(word) && word.length > 2).slice(0, 5);
}

async function savePrompts() {
  try {
    const promptsPath = path.join(__dirname, '..', 'data', 'gpt5_prompts_full.json');
    fs.writeFileSync(promptsPath, JSON.stringify(allPrompts, null, 2), 'utf8');
    console.log(`💾 Saved ${allPrompts.length} prompts to database`);
  } catch (error) {
    console.error('Error saving prompts:', error);
    throw error;
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 GPT-5 Prompts Server running on http://localhost:${PORT}`);
  console.log(`📊 Loaded ${allPrompts.length} prompts from database`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 API test: http://localhost:${PORT}/api/test`);
  console.log(`📂 Categories: http://localhost:${PORT}/api/categories`);
  console.log(`💡 Prompts: http://localhost:${PORT}/api/prompts`);
});
