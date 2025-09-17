#!/usr/bin/env node

/**
 * Reddit Authentication Test
 * Tests ONLY Reddit API credentials - no scraping
 */

// Load environment variables if dotenv is available
try {
  await import('dotenv').then(dotenv => dotenv.config());
} catch (e) {
  console.log('📝 Using system environment variables');
}

console.log('🔍 REDDIT AUTHENTICATION TEST');
console.log('=============================');

// Check environment variables first
const clientId = process.env.REDDIT_CLIENT_ID;
const clientSecret = process.env.REDDIT_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.log('❌ FAIL: Reddit credentials not found in environment');
  console.log(`REDDIT_CLIENT_ID: ${clientId ? 'SET' : 'NOT SET'}`);
  console.log(`REDDIT_CLIENT_SECRET: ${clientSecret ? 'SET' : 'NOT SET'}`);
  process.exit(1);
}

console.log('✅ Credentials found in environment');
console.log(`📋 Client ID: ${clientId.substring(0, 6)}... (${clientId.length} chars)`);

try {
  console.log('📡 Testing Reddit API authentication...');
  
  // Import and test Reddit scraper
  const { default: RedditScraper } = await import('./src/scrapers/reddit-scraper.js');
  const scraper = new RedditScraper();
  
  console.log('🔑 Attempting authentication...');
  const authSuccess = await scraper.authenticate();
  
  if (authSuccess) {
    console.log('✅ SUCCESS: Reddit authentication passed!');
    console.log('🚀 Ready for Reddit scraping');
    process.exit(0);
  } else {
    console.log('❌ FAIL: Reddit authentication failed');
    console.log('💡 Check if your Reddit app credentials are correct');
    process.exit(1);
  }

} catch (error) {
  console.log(`❌ ERROR: ${error.message}`);
  console.log('💡 This might be a network issue or invalid credentials');
  process.exit(1);
}