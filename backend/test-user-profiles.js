import TwitterAPIIO from './src/scrapers/twitter-api-io.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('👤 Test Twitter User Profiles');
console.log('==============================');

async function testUserProfiles() {
  const scraper = new TwitterAPIIO(process.env.TWITTERAPI_IO_KEY);
  
  // Test with popular AI/prompt accounts
  const testUsers = [
    'OpenAI',
    'sama',  // Sam Altman
    'AndrewBolis', // From our earlier debug - he shares AI content
    'elonmusk'  // Popular account that should have tweets
  ];
  
  for (const username of testUsers) {
    console.log(`\n👤 Testing user: @${username}`);
    console.log('─'.repeat(40));
    
    try {
      const tweets = await scraper.getUserTweets(username, { count: 10 });
      console.log(`✅ Found ${tweets.length} tweets from @${username}`);
      
      if (tweets.length > 0) {
        console.log('📝 Recent tweets:');
        tweets.slice(0, 3).forEach((tweet, i) => {
          const text = tweet.text || '';
          console.log(`   ${i + 1}. ${text.substring(0, 80)}${text.length > 80 ? '...' : ''}`);
        });
        
        // Test prompt processing
        const prompts = scraper.processTweets(tweets);
        console.log(`🎯 Extracted ${prompts.length} prompts from these tweets`);
        
        if (prompts.length > 0) {
          console.log('✨ Found AI prompts:');
          prompts.forEach(prompt => {
            console.log(`   - ${prompt.title}`);
            console.log(`     Category: ${prompt.category}`);
          });
        }
      }
      
      // Rate limiting - wait 6 seconds for free tier
      console.log('⏰ Waiting for rate limit...');
      await new Promise(resolve => setTimeout(resolve, 7000));
      
    } catch (error) {
      console.log(`❌ Failed for @${username}: ${error.message}`);
      
      if (error.message.includes('Too Many Requests')) {
        console.log('⏰ Rate limited, waiting longer...');
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }
  }
  
  console.log('\n🏁 User profile test complete!');
}

testUserProfiles();