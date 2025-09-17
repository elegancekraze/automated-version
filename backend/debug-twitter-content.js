import FirecrawlApp from '@mendable/firecrawl-js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🐦 Testing Twitter Scraping with Firecrawl');
console.log('==========================================');

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

async function testTwitterUrls() {
  const testUrls = [
    'https://x.com/search?q=ChatGPT%20prompts&f=live',
    'https://x.com/search?q=ChatGPT&f=live', 
    'https://x.com/OpenAI', // Simple profile
    'https://x.com/elonmusk' // Another profile
  ];
  
  for (const url of testUrls) {
    console.log(`\n🧪 Testing: ${url}`);
    console.log('─'.repeat(50));
    
    try {
      const result = await app.scrape(url, {
        formats: ['markdown'],
        waitFor: 5000
      });
      
      console.log('✅ SUCCESS!');
      console.log(`📊 Content length: ${result.markdown?.length || 0} characters`);
      
      if (result.markdown) {
        // Look for Twitter-specific patterns
        const content = result.markdown;
        
        // Check if we're getting blocked or redirected
        if (content.includes('login') || content.includes('sign in') || content.includes('Log in')) {
          console.log('⚠️  Page requires login - Twitter is blocking anonymous access');
        } else if (content.includes('Rate limited') || content.includes('rate limit')) {
          console.log('⚠️  Rate limited by Twitter');
        } else if (content.length < 500) {
          console.log('⚠️  Very short content - might be blocked or empty');
          console.log(`Content: ${content}`);
        } else {
          console.log('✅ Got substantial content');
          
          // Look for tweet-like patterns
          const patterns = {
            'usernames': (content.match(/@\w+/g) || []).length,
            'hashtags': (content.match(/#\w+/g) || []).length,
            'time_indicators': (content.match(/\d+[hms]|\d+ hours?|\d+ minutes?/g) || []).length,
            'twitter_actions': (content.match(/reply|retweet|like|share/gi) || []).length,
            'prompt_indicators': (content.match(/prompt|act as|you are|chatgpt|gpt-4/gi) || []).length
          };
          
          console.log('🔍 Content analysis:');
          Object.entries(patterns).forEach(([pattern, count]) => {
            console.log(`   ${pattern}: ${count}`);
          });
          
          // Show a sample of the content
          console.log('\n📝 Content sample (first 300 chars):');
          console.log(content.substring(0, 300) + '...');
        }
      }
      
    } catch (error) {
      console.log('❌ FAILED');
      console.log(`Error: ${error.message}`);
    }
    
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

// Test with extraction
async function testTwitterExtraction() {
  console.log('\n\n🔬 Testing Twitter Content Extraction');
  console.log('=====================================');
  
  const url = 'https://x.com/search?q=ChatGPT&f=live';
  
  try {
    const result = await app.scrape(url, {
      formats: ['markdown', 'extract'],
      waitFor: 5000,
      extract: {
        schema: {
          tweets: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                author: { type: 'string' },
                content: { type: 'string' },
                engagement: { type: 'object' }
              }
            }
          }
        }
      }
    });
    
    console.log('✅ Extraction completed');
    console.log('Result keys:', Object.keys(result));
    
    if (result.extract) {
      console.log('📊 Extracted data:', JSON.stringify(result.extract, null, 2));
    } else {
      console.log('⚠️  No extracted data found');
    }
    
  } catch (error) {
    console.log('❌ Extraction failed');
    console.log(`Error: ${error.message}`);
  }
}

async function runTests() {
  if (!process.env.FIRECRAWL_API_KEY) {
    console.log('❌ FIRECRAWL_API_KEY not found');
    return;
  }
  
  console.log('✅ API Key found');
  
  await testTwitterUrls();
  await testTwitterExtraction();
  
  console.log('\n\n🏁 Twitter Debug Test Complete!');
  console.log('================================');
  console.log('Analysis:');
  console.log('- If you see login prompts: Twitter blocks anonymous scraping');
  console.log('- If content is very short: Twitter may be rate limiting');
  console.log('- If patterns found: The scraping structure is working');
  console.log('- Solution: May need to use alternative sources or different approach');
}

runTests().catch(console.error);