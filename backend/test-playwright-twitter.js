import PlaywrightTwitterScraper from './src/scrapers/playwright-twitter.js';

console.log('🎭 Testing Playwright Twitter Scraper');
console.log('====================================');

async function testPlaywrightScraper() {
  const scraper = new PlaywrightTwitterScraper();
  
  try {
    console.log('🚀 Starting Playwright Twitter scraping test...\n');
    
    // Test search functionality
    console.log('🔍 Testing search: "ChatGPT"');
    const searchTweets = await scraper.searchTweets('ChatGPT');
    
    console.log(`📊 Search Results: ${searchTweets.length} tweets found`);
    
    if (searchTweets.length > 0) {
      console.log('\n📝 Sample tweets:');
      searchTweets.slice(0, 3).forEach((tweet, i) => {
        console.log(`\n${i + 1}. ${tweet.text.substring(0, 100)}...`);
        console.log(`   Author: @${tweet.author.userName}`);
        console.log(`   ID: ${tweet.id}`);
      });
      
      // Test prompt processing
      const prompts = scraper.processTweets(searchTweets);
      console.log(`\n🎯 Prompt Extraction: ${prompts.length} prompts found`);
      
      if (prompts.length > 0) {
        console.log('\n✨ Sample prompts:');
        prompts.slice(0, 2).forEach((prompt, i) => {
          console.log(`\n${i + 1}. ${prompt.title}`);
          console.log(`   Category: ${prompt.category}`);
          console.log(`   Content: ${prompt.content.substring(0, 80)}...`);
          console.log(`   Tags: ${prompt.tags.join(', ')}`);
        });
      }
      
      console.log('\n🎉 SUCCESS! Playwright scraping is working!');
      console.log(`📊 Results Summary:`);
      console.log(`   - Total tweets found: ${searchTweets.length}`);
      console.log(`   - AI prompts extracted: ${prompts.length}`);
      console.log(`   - Success rate: ${((prompts.length / searchTweets.length) * 100).toFixed(1)}%`);
      
    } else {
      console.log('\n⚠️ No tweets found. This could mean:');
      console.log('   1. Twitter is blocking automated access');
      console.log('   2. Page structure has changed');
      console.log('   3. Search query returned no results');
      console.log('\n💡 Check the debug screenshot for more info');
    }
    
  } catch (error) {
    console.error('\n❌ Playwright test failed:', error.message);
    
    if (error.message.includes('timeout')) {
      console.log('\n💡 Timeout error - Twitter might be slow or blocking requests');
      console.log('🔄 Try running the test again or check your internet connection');
    }
    
    if (error.message.includes('browser')) {
      console.log('\n💡 Browser error - make sure Chromium is installed');
      console.log('🔧 Run: npx playwright install chromium');
    }
    
  } finally {
    // Always cleanup browser resources
    console.log('\n🧹 Cleaning up browser...');
    await scraper.cleanup();
    console.log('✅ Cleanup completed');
  }
}

// Run the test
testPlaywrightScraper();