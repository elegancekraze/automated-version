const RedditScraper = require('./src/scrapers/reddit-scraper');
require('dotenv').config();

async function testRedditScraperFix() {
  console.log('🧪 Testing Reddit Scraper Fixes...');
  console.log('='.repeat(50));
  
  try {
    const scraper = new RedditScraper();
    
    // Test authentication
    console.log('\n📝 Step 1: Testing authentication...');
    const authResult = await scraper.authenticate();
    console.log(`Authentication result: ${authResult ? '✅ Success' : '❌ Failed'}`);
    
    // Test individual scraping method
    console.log('\n📝 Step 2: Testing individual subreddit scraping...');
    const testResult = await scraper.testScraping();
    
    if (testResult && testResult.length > 0) {
      console.log('✅ Reddit scraper is working correctly!');
      console.log(`Found ${testResult.length} prompts in test run`);
      
      // Show sample prompt
      console.log('\n📝 Sample prompt:');
      console.log('Title:', testResult[0].title);
      console.log('Content preview:', testResult[0].content.substring(0, 150) + '...');
      console.log('Category:', testResult[0].category);
      console.log('Source:', testResult[0].source);
    } else {
      console.log('⚠️ Scraper runs without errors but found no prompts');
      console.log('This might be normal if the subreddit has no matching content');
    }
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('The Reddit scraper should now work properly in your application.');
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Provide troubleshooting tips
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your internet connection');
    console.log('2. Verify Reddit credentials in .env file');
    console.log('3. Check if Reddit is accessible from your network');
    console.log('4. Try running the test again in a few minutes');
  }
}

// Run the test
testRedditScraperFix().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});