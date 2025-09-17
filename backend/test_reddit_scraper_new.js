import RedditScraper from './src/scrapers/reddit-scraper.js';
import fs from 'fs';

console.log('🧪 Testing Reddit scraper with new configuration...');

const scraper = new RedditScraper();

console.log('📋 Configured subreddits:', scraper.subreddits);
console.log('🔍 Search terms:', scraper.searchTerms);

// Test authentication
async function testScraper() {
  try {
    console.log('\n🔐 Testing authentication...');
    const authResult = await scraper.authenticate();
    
    if (authResult) {
      console.log('✅ Authentication successful');
      
      console.log('\n🚀 Testing quick scrape from r/ChatGPT...');
      const testPrompts = await scraper.quickScrapeTest(5);
      
      if (testPrompts && testPrompts.length > 0) {
        console.log(`✅ Successfully scraped ${testPrompts.length} prompts`);
        console.log('\n📝 Sample results:');
        testPrompts.slice(0, 2).forEach((prompt, index) => {
          console.log(`\n${index + 1}. ${prompt.title}`);
          console.log(`   Content: ${prompt.content?.substring(0, 100)}...`);
          console.log(`   Score: ${prompt.score}, Comments: ${prompt.comments}`);
        });
        
        // Save test results
        fs.writeFileSync('test_scrape_results.json', JSON.stringify(testPrompts, null, 2));
        console.log('\n💾 Test results saved to test_scrape_results.json');
        
      } else {
        console.log('⚠️ No prompts found in test scrape');
      }
      
    } else {
      console.log('❌ Authentication failed');
      console.log('Please check your Reddit API credentials in .env file');
      console.log('Required: REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USER_AGENT');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testScraper();