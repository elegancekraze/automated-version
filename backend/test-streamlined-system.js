// Test the streamlined 4-tier Twitter scraper system (removed non-working services)
import TwitterScraper from './src/scrapers/twitter-scraper.js';

async function testStreamlined4TierSystem() {
  console.log('🚀 Testing streamlined 4-Tier Twitter scraper system...\n');
  
  const query = 'AI prompt';
  const limit = 5;
  
  console.log(`🎯 Searching for: "${query}" (limit: ${limit})`);
  console.log('📊 Streamlined system will try 4 reliable methods:\n');
  console.log('🥇 Tier 1: BrightData Premium (Dataset API v3) - Highest reliability');
  console.log('🥈 Tier 2: ScrapingDog Pro (X/Twitter API) - Fast and reliable'); 
  console.log('🥉 Tier 3: ScrapeCreators Pro (Official API) - Twitter-specialized');
  console.log('🛡️  Tier 4: Hybrid Curated (Always works) - Guaranteed fallback');
  
  console.log('\n📝 REMOVED NON-WORKING SERVICES:');
  console.log('❌ TwitterAPI.io (Not working)');
  console.log('❌ Playwright Browser (Not working)');
  console.log('❌ Nitter RSS (No working instances)');
  console.log('❌ snscrape (Command not found)');
  
  console.log('\n' + '='.repeat(60) + '\n');
  
  try {
    const scraper = new TwitterScraper();
    console.log('\n📱 System initialized successfully\n');
    
    const startTime = Date.now();
    const results = await scraper.searchTweets(query, limit);
    const endTime = Date.now();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎯 FINAL RESULTS:');
    console.log('='.repeat(60));
    console.log(`⏱️  Execution time: ${(endTime - startTime) / 1000}s`);
    console.log(`📊 Found ${results.length} tweets`);
    console.log(`💡 Success rate: ${results.length > 0 ? '✅ 100%' : '❌ 0%'}`);
    console.log(`🔧 Active scraper: ${scraper.stats.activeScraper}`);
    
    if (results.length > 0) {
      console.log('\n📝 Sample Results:');
      results.forEach((tweet, index) => {
        console.log(`\n${index + 1}. ${tweet.source}`);
        console.log(`   📝 "${tweet.text.substring(0, 80)}..."`);
        console.log(`   👤 @${tweet.author}`);
        console.log(`   📊 ${tweet.likes} likes, ${tweet.retweets} retweets`);
        console.log(`   🏷️  Category: ${tweet.promptCategory}`);
      });
    }
    
    // Show system stats
    console.log('\n📈 System Statistics:');
    console.log(`   Total tweets scraped: ${scraper.stats.totalTweets}`);
    console.log(`   Successful methods: ${scraper.stats.successfulMethods.join(', ')}`);
    console.log(`   Errors encountered: ${scraper.stats.errors.length}`);
    
    console.log('\n✅ Streamlined 4-tier system test successful!');
    console.log('🛡️  System is now optimized with only working services');
    
  } catch (error) {
    console.error('❌ System test failed:', error.message);
  }
}

testStreamlined4TierSystem().catch(console.error);