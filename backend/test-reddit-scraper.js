const RedditScraper = require('./src/scrapers/reddit-scraper');

async function testRedditScraper() {
  console.log('🚀 Starting Reddit Scraper Test...\n');
  
  const scraper = new RedditScraper();
  
  // Test connection
  console.log('='.repeat(50));
  console.log('Testing Reddit API Connection');
  console.log('='.repeat(50));
  
  const connectionSuccess = await scraper.testConnection();
  
  if (connectionSuccess) {
    console.log('\n' + '='.repeat(50));
    console.log('Running Quick Scrape Test');
    console.log('='.repeat(50));
    
    // Run quick scrape test
    const prompts = await scraper.quickScrapeTest(10);
    
    console.log(`\n📊 Test Results:`);
    console.log(`- Total prompts found: ${prompts.length}`);
    
    if (prompts.length > 0) {
      // Group by category
      const categories = {};
      prompts.forEach(prompt => {
        if (!categories[prompt.category]) {
          categories[prompt.category] = [];
        }
        categories[prompt.category].push(prompt);
      });
      
      console.log('\n📈 Prompts by category:');
      Object.keys(categories).forEach(category => {
        console.log(`  - ${category}: ${categories[category].length} prompts`);
      });
      
      // Show top prompts by score
      const topPrompts = prompts
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
      
      console.log('\n🔥 Top 3 prompts by score:');
      topPrompts.forEach((prompt, index) => {
        console.log(`${index + 1}. ${prompt.title}`);
        console.log(`   Score: ${prompt.score} | Comments: ${prompt.comments}`);
        console.log(`   Category: ${prompt.category}`);
        console.log(`   URL: ${prompt.url}`);
        console.log('');
      });
    }
    
    console.log('\n✅ Reddit scraper test completed successfully!');
    
    // Test full scrape (limited)
    console.log('\n' + '='.repeat(50));
    console.log('Testing Limited Subreddit Scrape');
    console.log('='.repeat(50));
    
    try {
      const subredditPrompts = await scraper.scrapeSubreddit('ChatGPT', 'hot', 'week');
      console.log(`📝 Found ${subredditPrompts.length} prompts from r/ChatGPT`);
      
      if (subredditPrompts.length > 0) {
        console.log('\n📋 Sample scraped prompts:');
        subredditPrompts.slice(0, 3).forEach((prompt, index) => {
          console.log(`${index + 1}. ${prompt.title}`);
          console.log(`   Category: ${prompt.category}`);
          console.log(`   Difficulty: ${prompt.difficulty}`);
          console.log(`   Source: ${prompt.source}`);
          console.log('');
        });
      }
    } catch (error) {
      console.error('❌ Subreddit scrape test failed:', error.message);
    }
    
  } else {
    console.log('\n❌ Reddit scraper test failed. Please check your credentials in the .env file.');
    console.log('\nRequired environment variables:');
    console.log('- REDDIT_CLIENT_ID');
    console.log('- REDDIT_CLIENT_SECRET');
    console.log('- REDDIT_USER_AGENT');
  }
}

if (require.main === module) {
  testRedditScraper().catch(console.error);
}

module.exports = testRedditScraper;
