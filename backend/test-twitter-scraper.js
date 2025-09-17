import TwitterScraper from './src/scrapers/twitter-scraper.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testTwitterScraper() {
  console.log('🧪 Testing Firecrawl Twitter Scraper');
  console.log('=====================================');
  
  // Check if API key is configured
  if (!process.env.FIRECRAWL_API_KEY) {
    console.error('❌ FIRECRAWL_API_KEY not found in environment variables');
    console.log('Please set your Firecrawl API key in .env file:');
    console.log('FIRECRAWL_API_KEY=your_api_key_here');
    console.log('\nGet your free API key at: https://www.firecrawl.dev/signin');
    process.exit(1);
  }
  
  const scraper = new TwitterScraper();
  
  try {
    // Test 1: Search for ChatGPT prompts
    console.log('\n🔍 Test 1: Searching for ChatGPT prompts...');
    const searchResults = await scraper.scrapeSearch('ChatGPT prompts', { 
      waitFor: 5000 
    });
    
    console.log(`✅ Found ${searchResults.length} tweets from search`);
    if (searchResults.length > 0) {
      console.log('Sample tweet:', {
        title: searchResults[0].title,
        content: searchResults[0].content.substring(0, 100) + '...',
        author: searchResults[0].author,
        category: searchResults[0].category
      });
    }
    
    // Test 2: Scrape hashtags
    console.log('\n🏷️ Test 2: Scraping hashtags...');
    const hashtagResults = await scraper.scrapeHashtags(['ChatGPT', 'PromptEngineering'], {
      waitFor: 3000
    });
    
    console.log(`✅ Found ${hashtagResults.length} tweets from hashtags`);
    
    // Test 3: Get trending topics (if available)
    console.log('\n📈 Test 3: Getting trending topics...');
    const trends = await scraper.getTrendingTopics();
    
    console.log(`✅ Found ${trends.length} trending topics`);
    if (trends.length > 0) {
      console.log('Sample trends:', trends.slice(0, 3).map(t => t.topic));
    }
    
    // Test 4: Scrape specific profile (if working)
    console.log('\n👤 Test 4: Scraping OpenAI profile...');
    try {
      const profileResults = await scraper.scrapeProfile('OpenAI', { 
        waitFor: 5000 
      });
      
      console.log(`✅ Profile data:`, {
        profile: profileResults.profile,
        tweetsFound: profileResults.tweets.length
      });
      
    } catch (error) {
      console.log('⚠️ Profile scraping not working (expected for X.com):', error.message);
    }
    
    console.log('\n🎉 Twitter scraper testing completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Search results: ${searchResults.length} tweets`);
    console.log(`- Hashtag results: ${hashtagResults.length} tweets`);
    console.log(`- Trending topics: ${trends.length} topics`);
    
    // Show total unique tweets found
    const allTweets = [...searchResults, ...hashtagResults];
    const uniqueTweets = scraper.deduplicateTweets(allTweets);
    console.log(`- Total unique tweets: ${uniqueTweets.length}`);
    
    // Show categories distribution
    const categories = {};
    uniqueTweets.forEach(tweet => {
      categories[tweet.category] = (categories[tweet.category] || 0) + 1;
    });
    console.log('- Categories found:', categories);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('401') || error.message.includes('unauthorized')) {
      console.log('\n💡 Possible solutions:');
      console.log('- Check if your Firecrawl API key is correct');
      console.log('- Make sure your API key has sufficient credits');
      console.log('- Try a different search query');
    }
    
    if (error.message.includes('429') || error.message.includes('rate limit')) {
      console.log('\n💡 Rate limit reached:');
      console.log('- Wait a few minutes before trying again');
      console.log('- Consider upgrading your Firecrawl plan for higher limits');
    }
    
    process.exit(1);
  }
}

// Environment setup info
console.log('🌍 Environment Setup Instructions:');
console.log('==================================');
console.log('1. Get a free Firecrawl API key at: https://www.firecrawl.dev/signin');
console.log('2. Create a .env file in the backend directory');
console.log('3. Add your API key: FIRECRAWL_API_KEY=your_key_here');
console.log('4. Free plan includes 500 credits (500 pages)');
console.log('5. Each Twitter page scrape uses 1 credit');

// Run the test
testTwitterScraper();