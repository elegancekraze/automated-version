#!/usr/bin/env node

/**
 * Twitter Scrapers Test (Individual)
 * Tests each Twitter scraper tier separately
 */

// Load environment variables if dotenv is available
try {
  await import('dotenv').then(dotenv => dotenv.config());
} catch (e) {
  console.log('📝 Using system environment variables');
}

console.log('🔍 TWITTER SCRAPERS TEST');
console.log('========================');

const scrapers = [
  { 
    name: 'BrightData', 
    file: './src/scrapers/brightdata-twitter.js', 
    envVar: 'BRIGHTDATA_API_KEY',
    tier: 'Tier 1 (Premium)' 
  },
  { 
    name: 'ScrapingDog', 
    file: './src/scrapers/scrapingdog-twitter.js', 
    envVar: 'SCRAPINGDOG_API_KEY',
    tier: 'Tier 2 (General)' 
  },
  { 
    name: 'ScrapeCreators', 
    file: './src/scrapers/scrapecreators-twitter.js', 
    envVar: 'SCRAPECREATORS_API_KEY',
    tier: 'Tier 3 (Twitter-focused)' 
  }
];

let workingCount = 0;
let totalTests = 0;

for (const scraperInfo of scrapers) {
  totalTests++;
  console.log(`\n🐦 Testing ${scraperInfo.name} (${scraperInfo.tier})`);
  console.log(`${'='.repeat(50)}`);
  
  // Check API key
  const apiKey = process.env[scraperInfo.envVar];
  if (!apiKey) {
    console.log(`❌ SKIP: API key not found (${scraperInfo.envVar})`);
    continue;
  }
  
  console.log(`✅ API key found: ${apiKey.substring(0, 6)}... (${apiKey.length} chars)`);
  
  try {
    console.log(`📡 Loading ${scraperInfo.name} scraper...`);
    const { default: ScraperClass } = await import(scraperInfo.file);
    const scraper = new ScraperClass();
    
    console.log(`🔍 Testing with simple search (limit: 3, timeout: 15s)...`);
    const startTime = Date.now();
    
    // Test with a simple, likely-to-succeed search
    const results = await Promise.race([
      scraper.searchTweets('ChatGPT OR GPT OR AI', { count: 3 }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout after 15s')), 15000))
    ]);
    
    const duration = (Date.now() - startTime) / 1000;
    
    if (results && Array.isArray(results) && results.length > 0) {
      console.log(`✅ SUCCESS: Found ${results.length} results in ${duration.toFixed(1)}s`);
      console.log(`📋 Sample: "${results[0]?.text?.substring(0, 60)}..."`);
      workingCount++;
    } else {
      console.log(`⚠️ NO RESULTS: API responded but returned no data (${duration.toFixed(1)}s)`);
    }
    
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
    if (error.message.includes('timeout') || error.message.includes('Timeout')) {
      console.log(`💡 This scraper might be slow or blocked`);
    } else if (error.message.includes('401') || error.message.includes('403')) {
      console.log(`💡 Check if your API key is valid for ${scraperInfo.name}`);
    } else if (error.message.includes('429')) {
      console.log(`💡 Rate limit reached for ${scraperInfo.name}`);
    }
  }
}

console.log(`\n📊 TWITTER SCRAPERS SUMMARY`);
console.log(`===========================`);
console.log(`Working scrapers: ${workingCount}/${totalTests}`);

if (workingCount === 0) {
  console.log(`❌ FAIL: No Twitter scrapers are working`);
  console.log(`💡 Check your API keys and network connection`);
  process.exit(1);
} else if (workingCount >= 2) {
  console.log(`✅ EXCELLENT: Multiple scrapers working (redundancy achieved)`);
  process.exit(0);
} else {
  console.log(`⚠️ PARTIAL: Only one scraper working (limited redundancy)`);
  process.exit(0);
}