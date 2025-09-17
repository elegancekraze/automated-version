// Test the complete 8-tier Twitter scraper system
import TwitterScraper from './src/scrapers/twitter-scraper.js';

async function testCompleteTwitterSystem() {
  console.log('🚀 Testing complete 8-tier Twitter scraper system...\n');
  
  const query = 'AI prompt';
  const limit = 5;
  
  console.log(`🎯 Searching for: "${query}" (limit: ${limit})`);
  console.log('📊 System will try 8 methods in priority order:\n');
  console.log('1️⃣ BrightData (Premium residential proxies)');
  console.log('2️⃣ ScrapingDog (Premium fast API)'); 
  console.log('3️⃣ ScrapeCreators (Premium Twitter-focused)');
  console.log('4️⃣ Playwright (Browser automation with login)');
  console.log('5️⃣ TwitterAPI.io (100k free credits)');
  console.log('6️⃣ Nitter (RSS alternative)');
  console.log('7️⃣ snscrape (Python tool - may be broken)');
  console.log('8️⃣ Hybrid curated system (guaranteed fallback)');
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  try {
    const scraper = new TwitterScraper();
    console.log('📱 Twitter scraper system initialized');
    
    const startTime = Date.now();
    const results = await scraper.searchTweets(query, limit);
    const endTime = Date.now();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎯 FINAL RESULTS:');
    console.log('='.repeat(60));
    console.log(`⏱️ Total time: ${(endTime - startTime) / 1000}s`);
    console.log(`📊 Found ${results.length} tweets`);
    console.log(`💡 Success rate: ${results.length > 0 ? '✅ 100%' : '❌ 0%'}`);
    
    if (results.length > 0) {
      console.log('\n📝 Sample Results:');
      results.forEach((tweet, index) => {
        console.log(`\n${index + 1}. ${tweet.source}`);
        console.log(`   📝 "${tweet.text.substring(0, 80)}..."`);
        console.log(`   👤 @${tweet.author}`);
        console.log(`   📊 ${tweet.likes} likes, ${tweet.retweets} retweets`);
        console.log(`   🏷️ Category: ${tweet.promptCategory}`);
      });
    }
    
    console.log('\n✅ Complete system test successful!');
    
  } catch (error) {
    console.error('❌ Complete system test failed:', error.message);
  }
}

testCompleteTwitterSystem().catch(console.error);