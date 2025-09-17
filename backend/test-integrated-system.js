// Test the complete integrated scraper system with updated APIs
import ScrapingDogTwitterScraper from './src/scrapers/scrapingdog-twitter.js';
import BrightDataTwitterScraper from './src/scrapers/brightdata-twitter.js';

async function testCompleteSystem() {
  console.log('🚀 Testing complete integrated scraper system...\n');
  
  const query = 'AI prompt';
  const limit = 3;
  
  // Test ScrapingDog with new X API
  console.log('1️⃣ Testing ScrapingDog X API integration...');
  try {
    const scrapingDog = new ScrapingDogTwitterScraper();
    const scrapingDogResults = await scrapingDog.searchTweets(query, limit);
    console.log(`✅ ScrapingDog returned ${scrapingDogResults.length} tweets`);
    if (scrapingDogResults.length > 0) {
      console.log('Sample tweet:', scrapingDogResults[0].text.substring(0, 100) + '...');
    }
  } catch (error) {
    console.error('❌ ScrapingDog integration error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test BrightData with Dataset API v3
  console.log('2️⃣ Testing BrightData Dataset API v3 integration...');
  try {
    const brightData = new BrightDataTwitterScraper();
    const brightDataResults = await brightData.searchTweets(query, limit);
    console.log(`✅ BrightData returned ${brightDataResults.length} tweets`);
    if (brightDataResults.length > 0) {
      console.log('Sample tweet:', brightDataResults[0].text.substring(0, 100) + '...');
    }
  } catch (error) {
    console.error('❌ BrightData integration error:', error.message);
  }
  
  console.log('\n🎯 System Integration Test Complete!');
}

testCompleteSystem().catch(console.error);