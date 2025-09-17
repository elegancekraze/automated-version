import TwitterScraper from './src/scrapers/twitter-scraper.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🎯 Simple Twitter Prompt Test');
console.log('=============================');

async function simpleTest() {
  const scraper = new TwitterScraper();
  
  console.log('🔍 Testing single search with better query...');
  
  try {
    // Test with a very specific, popular query that should return results
    const prompts = await scraper.scrapeSearch('ChatGPT prompts guide', { count: 10 });
    
    console.log(`✅ SUCCESS! Found ${prompts.length} prompts`);
    
    if (prompts.length > 0) {
      console.log('\n📝 Found prompts:');
      prompts.forEach((prompt, i) => {
        console.log(`\n${i + 1}. ${prompt.title}`);
        console.log(`   Content: ${prompt.content.substring(0, 100)}...`);
        console.log(`   Author: @${prompt.source.author}`);
        console.log(`   Category: ${prompt.category}`);
      });
    } else {
      console.log('\n💡 No prompts found. Let me try different queries...');
      
      const testQueries = [
        'AI prompts',
        'prompt engineering',
        'ChatGPT tips',
        'GPT prompts'
      ];
      
      for (const query of testQueries) {
        console.log(`\n🔍 Trying: "${query}"`);
        try {
          const testPrompts = await scraper.scrapeSearch(query, { count: 5 });
          console.log(`   Result: ${testPrompts.length} prompts`);
          
          if (testPrompts.length > 0) {
            console.log(`   ✅ SUCCESS with "${query}"!`);
            testPrompts.slice(0, 2).forEach(p => {
              console.log(`      - ${p.title}`);
            });
            break;
          }
          
          // Wait for rate limiting
          await new Promise(resolve => setTimeout(resolve, 6000));
          
        } catch (error) {
          console.log(`   ❌ Failed: ${error.message}`);
          if (error.message.includes('Too Many Requests')) {
            console.log('   ⏰ Hit rate limit, waiting...');
            await new Promise(resolve => setTimeout(resolve, 10000));
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('Too Many Requests')) {
      console.log('\n💡 Rate limit hit. Free tier allows 1 request per 5 seconds.');
      console.log('🔄 Wait 5+ seconds between requests for free tier.');
    }
  }
}

simpleTest();