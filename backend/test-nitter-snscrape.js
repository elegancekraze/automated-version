// Test Nitter RSS and snscrape functionality
import NitterScraper from './src/scrapers/nitter-scraper.js';
import SnscrapeTwitter from './src/scrapers/snscrape-twitter.js';

async function testNitterRSS() {
  console.log('📡 Testing Nitter RSS scraper...');
  
  try {
    const nitter = new NitterScraper();
    const results = await nitter.searchTweets('AI prompt', 3);
    
    console.log(`✅ Nitter found ${results.length} tweets`);
    if (results.length > 0) {
      console.log('Sample:', results[0].text.substring(0, 100) + '...');
    }
    return true;
    
  } catch (error) {
    console.error('❌ Nitter failed:', error.message);
    return false;
  }
}

async function testSnscrape() {
  console.log('🐍 Testing snscrape...');
  
  try {
    const snscrape = new SnscrapeTwitter();
    const results = await snscrape.searchTweets('AI prompt', 3);
    
    console.log(`✅ snscrape found ${results.length} tweets`);
    if (results.length > 0) {
      console.log('Sample:', results[0].text.substring(0, 100) + '...');
    }
    return true;
    
  } catch (error) {
    console.error('❌ snscrape failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing Nitter RSS and snscrape...\n');
  
  const nitterWorks = await testNitterRSS();
  console.log('\n' + '='.repeat(50) + '\n');
  
  const snscrapeWorks = await testSnscrape();
  
  console.log('\n🎯 Test Results:');
  console.log('Nitter RSS:', nitterWorks ? '✅ Working' : '❌ Not Working');
  console.log('snscrape:', snscrapeWorks ? '✅ Working' : '❌ Not Working');
  
  return { nitterWorks, snscrapeWorks };
}

runTests().catch(console.error);