import TwitterAPIIO from './src/scrapers/twitter-api-io.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Debug TwitterAPI.io Response Format');
console.log('=====================================');

async function debugTwitterAPIIO() {
  if (!process.env.TWITTERAPI_IO_KEY) {
    console.log('❌ TWITTERAPI_IO_KEY not found in .env');
    return;
  }

  const scraper = new TwitterAPIIO(process.env.TWITTERAPI_IO_KEY);
  
  console.log('✅ TwitterAPI.io client initialized');
  console.log('🔍 Testing single search to see response format...\n');
  
  try {
    const tweets = await scraper.searchTweets('ChatGPT', { count: 5 });
    
    console.log('📊 Raw Response Analysis:');
    console.log('========================');
    console.log('Response type:', typeof tweets);
    console.log('Is Array:', Array.isArray(tweets));
    console.log('Length/Keys:', Array.isArray(tweets) ? `Length: ${tweets.length}` : `Keys: ${Object.keys(tweets || {})}`);
    
    if (tweets && tweets.length > 0) {
      console.log('\n📝 First Tweet Structure:');
      console.log('=========================');
      const firstTweet = tweets[0];
      console.log(JSON.stringify(firstTweet, null, 2));
      
      console.log('\n🔑 Available Keys:');
      Object.keys(firstTweet).forEach(key => {
        console.log(`  - ${key}: ${typeof firstTweet[key]}`);
      });
      
    } else {
      console.log('\n📄 Full Response:');
      console.log('=================');
      console.log(JSON.stringify(tweets, null, 2));
    }
    
    // Test processing
    console.log('\n🧪 Testing processTweets...');
    const prompts = scraper.processTweets(tweets);
    console.log(`✅ Processed: ${prompts.length} prompts from ${Array.isArray(tweets) ? tweets.length : 'unknown'} tweets`);
    
    if (prompts.length > 0) {
      console.log('\n📝 First Processed Prompt:');
      console.log('==========================');
      console.log(JSON.stringify(prompts[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    
    if (error.response) {
      console.log('\n🔍 Error Details:');
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

debugTwitterAPIIO();