import NitterScraper from './src/scrapers/nitter-scraper.js';

console.log('🐦 Testing FREE Nitter Twitter Scraper');
console.log('======================================');

async function testNitter() {
  const scraper = new NitterScraper();
  
  console.log('🔍 Testing Nitter RSS scraping...\n');
  
  try {
    // Test user profile first (more reliable)
    console.log('👤 Testing user profile: @elonmusk');
    const userTweets = await scraper.getUserTweets('elonmusk', { count: 5 });
    
    console.log(`✅ Found ${userTweets.length} tweets from @elonmusk`);
    
    if (userTweets.length > 0) {
      console.log('\n📝 Sample tweets:');
      userTweets.slice(0, 3).forEach((tweet, i) => {
        console.log(`${i + 1}. ${tweet.text.substring(0, 100)}...`);
        console.log(`   Author: @${tweet.author.userName}`);
        console.log(`   Date: ${tweet.createdAt}`);
      });
      
      // Test prompt processing
      const prompts = scraper.processTweets(userTweets);
      console.log(`\n🎯 Extracted ${prompts.length} prompts from these tweets`);
      
      if (prompts.length > 0) {
        console.log('\n✨ Found prompts:');
        prompts.forEach(prompt => {
          console.log(`   - ${prompt.title}`);
          console.log(`     Category: ${prompt.category}`);
          console.log(`     Content: ${prompt.content.substring(0, 80)}...`);
        });
      }
    }
    
    console.log('\n' + '─'.repeat(50));
    
    // Test search functionality
    console.log('🔍 Testing search: "ChatGPT"');
    const searchTweets = await scraper.searchTweets('ChatGPT');
    
    console.log(`✅ Found ${searchTweets.length} tweets for "ChatGPT"`);
    
    if (searchTweets.length > 0) {
      console.log('\n📝 Sample search results:');
      searchTweets.slice(0, 3).forEach((tweet, i) => {
        console.log(`${i + 1}. ${tweet.text.substring(0, 80)}...`);
        console.log(`   Author: @${tweet.author.userName}`);
      });
      
      const searchPrompts = scraper.processTweets(searchTweets);
      console.log(`\n🎯 Extracted ${searchPrompts.length} prompts from search`);
    }
    
    console.log('\n🎉 SUCCESS! Nitter scraping is working!');
    console.log('📊 Summary:');
    console.log(`   - User tweets: ${userTweets.length}`);
    console.log(`   - Search tweets: ${searchTweets.length}`);
    console.log(`   - Total prompts found: ${scraper.processTweets([...userTweets, ...searchTweets]).length}`);
    
  } catch (error) {
    console.error('❌ Nitter test failed:', error.message);
    
    if (error.message.includes('No working Nitter instances')) {
      console.log('\n💡 Nitter instances might be down. This happens sometimes.');
      console.log('🔄 Try again later - Nitter instances come and go.');
    }
  }
}

testNitter();