// Test all premium scraping services
import TwitterScraper from './src/scrapers/twitter-scraper.js';
import BrightDataTwitterScraper from './src/scrapers/brightdata-twitter.js';
import ScrapingDogTwitterScraper from './src/scrapers/scrapingdog-twitter.js';
import ScrapeCreatorsTwitter from './src/scrapers/scrapecreators-twitter.js';

async function testPremiumServices() {
  console.log('🚀 Testing All Premium Twitter Scraping Services...\n');
  console.log('='.repeat(60));
  
  const testQuery = 'ChatGPT prompts';
  const limit = 3;
  
  // Test individual services
  const services = [
    { name: 'BrightData', class: BrightDataTwitterScraper },
    { name: 'ScrapingDog', class: ScrapingDogTwitterScraper },
    { name: 'ScrapeCreators', class: ScrapeCreatorsTwitter }
  ];
  
  for (const service of services) {
    console.log(`\n🔧 Testing ${service.name}...`);
    console.log('-'.repeat(40));
    
    try {
      const scraper = new service.class();
      const results = await scraper.searchTweets(testQuery, limit);
      
      console.log(`✅ ${service.name} SUCCESS: Found ${results.length} tweets`);
      
      if (results.length > 0) {
        results.forEach((tweet, index) => {
          console.log(`\n${index + 1}. ${tweet.text.substring(0, 80)}...`);
          console.log(`   👤 ${tweet.author} | ❤️ ${tweet.likes} | 📅 ${tweet.source}`);
        });
      }
      
    } catch (error) {
      console.error(`❌ ${service.name} FAILED:`, error.message);
    }
  }
  
  // Test complete unified system
  console.log('\n\n🎯 Testing Complete Unified System...');
  console.log('='.repeat(60));
  
  try {
    const mainScraper = new TwitterScraper();
    
    console.log(`\n🔍 Unified search for: "${testQuery}"`);
    const results = await mainScraper.searchTweets(testQuery, limit);
    
    console.log(`\n✅ UNIFIED SYSTEM SUCCESS: Found ${results.length} tweets`);
    console.log(`🎯 Active scraper: ${mainScraper.stats.activeScraper}`);
    console.log(`📊 Successful methods: ${mainScraper.stats.successfulMethods.join(', ')}`);
    
    if (results.length > 0) {
      console.log('\n📝 Sample Results:');
      results.forEach((tweet, index) => {
        console.log(`\n${index + 1}. ${tweet.text.substring(0, 100)}...`);
        console.log(`   👤 ${tweet.author} | ❤️ ${tweet.likes} | 🔄 ${tweet.retweets}`);
        console.log(`   📅 Source: ${tweet.source} | 📂 Category: ${tweet.promptCategory}`);
      });
    }
    
  } catch (error) {
    console.error('❌ UNIFIED SYSTEM FAILED:', error.message);
  }
  
  // Test auto-scraping
  console.log('\n\n🤖 Testing Auto-Scraping...');
  console.log('='.repeat(60));
  
  try {
    const mainScraper = new TwitterScraper();
    const autoResults = await mainScraper.autoScrapePrompts();
    
    console.log(`✅ AUTO-SCRAPE SUCCESS: Found ${autoResults.length} prompts`);
    console.log(`🎯 Active scraper: ${mainScraper.stats.activeScraper}`);
    
    // Group by category
    const categories = {};
    autoResults.forEach(prompt => {
      const cat = prompt.promptCategory || 'general';
      categories[cat] = (categories[cat] || 0) + 1;
    });
    
    console.log('\n📊 Prompts by Category:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   📂 ${category}: ${count} prompts`);
    });
    
  } catch (error) {
    console.error('❌ AUTO-SCRAPE FAILED:', error.message);
  }
  
  console.log('\n🎉 Testing Complete!');
  console.log('\n💡 Priority Order:');
  console.log('   1. 🌐 BrightData Premium (residential proxies)');
  console.log('   2. 🐕 ScrapingDog Pro (fast API)');  
  console.log('   3. 🏗️ ScrapeCreators Pro (Twitter-focused)');
  console.log('   4. 🎭 Playwright Browser (free automation)');
  console.log('   5. 🔑 TwitterAPI.io (free tier)');
  console.log('   6. 🦅 Nitter RSS (privacy frontend)');
  console.log('   7. 🐍 snscrape (Python tool)');
  console.log('   8. 🎯 Hybrid Curated (always works)');
}

testPremiumServices().catch(console.error);