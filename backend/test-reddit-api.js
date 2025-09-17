import RedditScraper from './src/scrapers/reddit-scraper.js';

async function testRedditAPI() {
  const scraper = new RedditScraper();
  
  console.log('=== REDDIT API TEST ===');
  console.log('Testing Reddit authentication and scraping...');
  console.log('');
  
  try {
    // Test authentication
    const authSuccess = await scraper.authenticate();
    console.log('Authentication:', authSuccess ? '✅ SUCCESS' : '❌ FAILED');
    
    if (!authSuccess) {
      console.log('❌ Cannot proceed without authentication');
      return;
    }
    
    // Test connection
    console.log('\nTesting API connection...');
    const connectionSuccess = await scraper.testConnection();
    console.log('Connection test:', connectionSuccess ? '✅ SUCCESS' : '❌ FAILED');
    
    if (!connectionSuccess) {
      console.log('❌ Cannot proceed without working connection');
      return;
    }
    
    // Quick scrape test
    console.log('\nTesting scraping functionality...');
    const prompts = await scraper.quickScrapeTest(5);
    
    console.log('\n=== RESULTS ===');
    console.log('Total new prompts found:', prompts.length);
    
    if (prompts.length > 0) {
      console.log('\n📝 Latest prompts from Reddit:');
      prompts.forEach((prompt, index) => {
        console.log(`${index + 1}. ${prompt.title}`);
        console.log(`   Score: ${prompt.score} | Comments: ${prompt.comments}`);
        console.log(`   Category: ${prompt.category}`);
        console.log(`   URL: ${prompt.url}`);
        console.log('');
      });
      
      console.log('✅ Reddit API is working and finding new prompts!');
    } else {
      console.log('⚠️ No new prompts found, but API is working');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testRedditAPI();