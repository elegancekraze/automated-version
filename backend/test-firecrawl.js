import FirecrawlApp from '@mendable/firecrawl-js';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing Firecrawl API...');

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

// Test simple URL
async function testFirecrawl() {
  try {
    console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(app)));
    
    // Try the correct API format
    const testUrl = 'https://example.com';
    
    console.log('Testing scrape method...');
    const result = await app.scrape(testUrl, {
      formats: ['markdown']
    });
    console.log('✅ Scrape successful!');
    console.log('Result keys:', Object.keys(result));
    console.log('Success:', result.success);
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testFirecrawl();