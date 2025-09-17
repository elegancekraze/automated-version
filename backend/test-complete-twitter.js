// Test complete Twitter scraping system
import TwitterScraper from './src/scrapers/twitter-scraper.js';

async function testCompleteScraping() {
  console.log('🚀 Testing Complete Twitter Scraping System...\n');
  
  const scraper = new TwitterScraper();
  
  // Test with different queries to validate system
  const testQueries = [
    'AI prompts',
    'ChatGPT',
    'creative writing', 
    'coding'
  ];
  
  for (const query of testQueries) {
    console.log(`\n📝 Testing query: "${query}"`);
    console.log('-'.repeat(50));
    
    try {
      const results = await scraper.searchTweets(query, 3);
      
      console.log(`✅ Found ${results.length} prompts for "${query}"`);
      
      if (results.length > 0) {
        results.forEach((tweet, index) => {
          console.log(`\n${index + 1}. ${tweet.text.substring(0, 100)}...`);
          console.log(`   👤 ${tweet.author || 'Anonymous'} | ❤️ ${tweet.likes || 0} | 🔄 ${tweet.retweets || 0}`);
        });
      }
      
    } catch (error) {
      console.error(`❌ Error with query "${query}":`, error.message);
    }
  }
  
  console.log('\n✨ Testing Complete!');
}

testCompleteScraping().catch(console.error);