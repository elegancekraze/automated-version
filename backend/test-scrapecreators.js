// Test ScrapeCreators Twitter API
import ScrapeCreatorsTwitter from './src/scrapers/scrapecreators-twitter.js';

async function testScrapeCreators() {
  console.log('🚀 Testing ScrapeCreators Twitter API...\n');
  
  const scraper = new ScrapeCreatorsTwitter();
  
  // Display configuration
  console.log('📊 Configuration:', scraper.getStats());
  console.log();
  
  // Test different functionalities
  try {
    // Test 1: Get profile information
    console.log('🧪 Test 1: Getting OpenAI profile...');
    try {
      const profile = await scraper.getProfile('OpenAI');
      if (profile) {
        console.log('✅ Profile retrieved:', {
          name: profile.name,
          followers: profile.followers,
          verified: profile.verified
        });
      } else {
        console.log('❌ No profile data returned');
      }
    } catch (error) {
      console.log('❌ Profile test failed:', error.message);
    }
    
    console.log();
    
    // Test 2: Get user tweets
    console.log('🧪 Test 2: Getting tweets from @OpenAI...');
    try {
      const tweets = await scraper.getUserTweets('OpenAI', 5);
      console.log(`✅ Retrieved ${tweets.length} tweets`);
      
      if (tweets.length > 0) {
        tweets.slice(0, 2).forEach((tweet, index) => {
          console.log(`${index + 1}. ${tweet.text.substring(0, 80)}...`);
          console.log(`   👤 ${tweet.author} | ❤️ ${tweet.likes} | 🔄 ${tweet.retweets}`);
        });
      }
    } catch (error) {
      console.log('❌ User tweets test failed:', error.message);
    }
    
    console.log();
    
    // Test 3: Search for AI prompts
    console.log('🧪 Test 3: Searching for AI prompts...');
    try {
      const results = await scraper.searchTweets('AI prompts', 3);
      console.log(`✅ Found ${results.length} potential AI prompts`);
      
      if (results.length > 0) {
        results.forEach((tweet, index) => {
          console.log(`${index + 1}. ${tweet.text.substring(0, 100)}...`);
          console.log(`   Category: ${tweet.category || 'general'} | Confidence: ${(tweet.confidence || 0.5) * 100}%`);
        });
      }
    } catch (error) {
      console.log('❌ Search test failed:', error.message);
    }
    
    console.log();
    
    // Test 4: Auto-scrape prompts
    console.log('🧪 Test 4: Auto-scraping AI prompts...');
    try {
      const prompts = await scraper.autoScrapePrompts();
      console.log(`✅ Auto-scraped ${prompts.length} AI prompts`);
      
      if (prompts.length > 0) {
        const categories = {};
        prompts.forEach(prompt => {
          const cat = prompt.category || 'general';
          categories[cat] = (categories[cat] || 0) + 1;
        });
        
        console.log('📊 Categories found:', categories);
      }
    } catch (error) {
      console.log('❌ Auto-scrape test failed:', error.message);
    }
    
  } catch (error) {
    console.error('💥 Major test failure:', error.message);
  }
  
  console.log('\n✨ ScrapeCreators testing complete!');
  
  // Instructions for user
  if (!process.env.SCRAPECREATORS_API_KEY || process.env.SCRAPECREATORS_API_KEY === 'your_scrapecreators_api_key_here') {
    console.log('\n📝 TO GET STARTED:');
    console.log('1. Sign up at: https://app.scrapecreators.com/');
    console.log('2. Get your free API key (100 free calls)');
    console.log('3. Add it to .env: SCRAPECREATORS_API_KEY=your_actual_key');
    console.log('4. Run this test again');
  }
}

testScrapeCreators().catch(console.error);