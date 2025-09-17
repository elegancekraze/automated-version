/**
 * Debug Twitter Scraper - Test what Firecrawl actually returns
 */

import FirecrawlApp from '@mendable/firecrawl-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔧 Twitter Scraper Debug Test');
console.log('===============================');

// Initialize Firecrawl
const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// Test different Twitter URLs to see what works
const testUrls = [
  'https://x.com/search?q=ChatGPT%20prompts&src=typed_query&f=live',
  'https://twitter.com/search?q=ChatGPT%20prompts&src=typed_query&f=live',
  'https://x.com/search?q=ChatGPT&f=live',
  'https://x.com/elonmusk', // Test a simple profile page
];

async function testScraping() {
  for (const url of testUrls) {
    console.log(`\n🧪 Testing: ${url}`);
    console.log('─'.repeat(50));
    
    try {
      // First try basic scraping to see what content we get
      const result = await app.scrapeUrl(url, {
        formats: ['markdown'],
        waitFor: 5000,
        timeout: 30000
      });
      
      if (result.success) {
        console.log('✅ SUCCESS!');
        console.log(`📊 Content length: ${result.markdown?.length || 0} characters`);
        
        // Show first 500 characters of content
        if (result.markdown) {
          const preview = result.markdown.substring(0, 500);
          console.log(`📝 Content preview:\n${preview}...`);
          
          // Look for tweet-like patterns
          const tweetPatterns = [
            /(@\w+)/g,  // Usernames
            /(#\w+)/g,  // Hashtags
            /(\d+h|\d+m|\d+s)/g, // Time indicators
            /(Reply|Retweet|Like)/gi, // Twitter actions
          ];
          
          let foundPatterns = [];
          tweetPatterns.forEach((pattern, index) => {
            const matches = preview.match(pattern);
            if (matches) {
              foundPatterns.push(`Pattern ${index + 1}: ${matches.slice(0, 3).join(', ')}`);
            }
          });
          
          if (foundPatterns.length > 0) {
            console.log('🎯 Found Twitter-like patterns:');
            foundPatterns.forEach(pattern => console.log(`   ${pattern}`));
          } else {
            console.log('⚠️  No Twitter-like patterns found');
          }
        }
      } else {
        console.log('❌ FAILED');
        console.log(`Error: ${result.error}`);
      }
      
    } catch (error) {
      console.log('💥 EXCEPTION');
      console.log(`Error: ${error.message}`);
    }
    
    // Wait between requests to be respectful
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

// Test specific prompt-related searches
async function testPromptSearches() {
  console.log('\n\n🎯 Testing Prompt-Specific Searches');
  console.log('=====================================');
  
  const promptSearches = [
    'ChatGPT prompts',
    'AI prompt engineering',
    'prompt templates',
    'GPT prompts',
  ];
  
  for (const search of promptSearches) {
    const url = `https://x.com/search?q=${encodeURIComponent(search)}&f=live`;
    console.log(`\n🔍 Search: "${search}"`);
    console.log(`🔗 URL: ${url}`);
    
    try {
      const result = await app.scrapeUrl(url, {
        formats: ['markdown'],
        waitFor: 5000
      });
      
      if (result.success && result.markdown) {
        // Look for actual prompt content
        const content = result.markdown.toLowerCase();
        const promptIndicators = [
          'prompt:',
          'act as',
          'you are a',
          'pretend you are',
          'chatgpt',
          'gpt-4',
          'ai prompt',
        ];
        
        let foundPrompts = 0;
        promptIndicators.forEach(indicator => {
          const matches = content.split(indicator).length - 1;
          foundPrompts += matches;
        });
        
        console.log(`📊 Potential prompts found: ${foundPrompts}`);
        
        if (foundPrompts > 0) {
          console.log('✅ This search term looks promising!');
        } else {
          console.log('⚠️  No clear prompts found');
        }
      } else {
        console.log('❌ Search failed');
      }
      
    } catch (error) {
      console.log(`💥 Error: ${error.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// Run the tests
async function runAllTests() {
  if (!process.env.FIRECRAWL_API_KEY) {
    console.log('❌ FIRECRAWL_API_KEY not found in environment variables');
    console.log('Please add your API key to the .env file');
    return;
  }
  
  console.log('✅ Firecrawl API key found');
  console.log(`🔑 Key: ${process.env.FIRECRAWL_API_KEY.substring(0, 10)}...`);
  
  await testScraping();
  await testPromptSearches();
  
  console.log('\n\n🏁 Debug Test Complete!');
  console.log('========================');
  console.log('Next steps:');
  console.log('1. Check which URLs worked best');
  console.log('2. Look for patterns in the successful content');
  console.log('3. Adjust the scraper based on findings');
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('💥 Unhandled error:', error.message);
  process.exit(1);
});

// Run the tests
runAllTests().catch(console.error);