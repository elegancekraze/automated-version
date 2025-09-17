import TwitterScraper from './src/scrapers/twitter-scraper.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🐦 Testing FREE Twitter Scrapers');
console.log('=================================');

async function testFreeTwitterScrapers() {
  const scraper = new TwitterScraper();
  
  console.log('\n📊 Available scraping methods:');
  const stats = scraper.getStats();
  stats.availableScrapers.forEach(s => {
    console.log(`   - ${s.name} (priority ${s.priority})`);
  });

  // Test all scrapers
  console.log('\n🧪 Testing all scrapers...');
  const testResults = await scraper.testScrapers();
  
  // Find working scrapers
  const workingScrapers = Object.entries(testResults)
    .filter(([name, result]) => result.status === 'success')
    .map(([name]) => name);
  
  console.log(`\n✅ Working scrapers: ${workingScrapers.length > 0 ? workingScrapers.join(', ') : 'None'}`);
  
  if (workingScrapers.length === 0) {
    console.log('\n🚨 No scrapers working! Let me show setup instructions...');
    await scraper.setupTwitterAPIIO();
    
    console.log('\n📝 Alternative FREE options:');
    console.log('1. snscrape (Python): pip install snscrape');
    console.log('2. TwitterAPI.io: 100k free credits');
    console.log('3. Direct browser scraping with Playwright');
    
    return;
  }
  
  // Try auto scraping with working methods
  console.log('\n🤖 Testing auto scraping...');
  try {
    const prompts = await scraper.autoScrapePrompts();
    
    console.log(`\n🎯 SUCCESS! Found ${prompts.length} prompts`);
    
    if (prompts.length > 0) {
      console.log('\n📝 Sample prompts:');
      prompts.slice(0, 3).forEach((prompt, i) => {
        console.log(`\n${i + 1}. ${prompt.title}`);
        console.log(`   Category: ${prompt.category}`);
        console.log(`   Author: @${prompt.source.author}`);
        console.log(`   Content: ${prompt.content.substring(0, 100)}...`);
        console.log(`   Tags: ${prompt.tags.join(', ')}`);
      });
    }
    
    console.log('\n📊 Final stats:');
    const finalStats = scraper.getStats();
    console.log(`   - Total tweets: ${finalStats.totalTweets}`);
    console.log(`   - Total prompts: ${finalStats.totalPrompts}`);
    console.log(`   - Active scraper: ${finalStats.activeScraper}`);
    console.log(`   - Successful methods: ${finalStats.successfulMethods.join(', ')}`);
    
  } catch (error) {
    console.error('\n❌ Auto scraping failed:', error.message);
    
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check internet connection');
    console.log('2. Verify API keys in .env file');
    console.log('3. Install Python and snscrape: pip install snscrape');
    console.log('4. Try TwitterAPI.io for 100k free credits');
  }
}

// Main execution
async function main() {
  try {
    await testFreeTwitterScrapers();
    console.log('\n🏁 Test completed!');
  } catch (error) {
    console.error('\n💥 Test failed:', error);
    console.log('\n🆘 Need help? Check these free options:');
    console.log('1. TwitterAPI.io: https://twitterapi.io (100k free credits)');
    console.log('2. snscrape: pip install snscrape (completely free)');
    console.log('3. Nitter instances: privacy-focused Twitter frontend');
  }
}

main();