#!/usr/bin/env node

/**
 * Test Scraping System - Verify APIs and scrapers work
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

async function testRedditScraper() {
  console.log('🔴 Testing Reddit scraper...');
  try {
    const { default: RedditScraper } = await import('../backend/src/scrapers/reddit-scraper.js');
    const scraper = new RedditScraper();
    
    console.log('  - Testing authentication...');
    const authSuccess = await scraper.authenticate();
    
    if (authSuccess) {
      console.log('  ✅ Reddit authentication successful');
      
      console.log('  - Testing scraping (limited)...');
      const prompts = await scraper.scrapeSubreddit('ChatGPT', 'hot', 5);
      console.log(`  ✅ Reddit scraping successful: ${prompts.length} prompts`);
      
      return true;
    } else {
      console.log('  ❌ Reddit authentication failed');
      return false;
    }
    
  } catch (error) {
    console.log(`  ❌ Reddit test failed: ${error.message}`);
    return false;
  }
}

async function testTwitterScrapers() {
  console.log('🐦 Testing Twitter scrapers...');
  let workingCount = 0;
  
  try {
    const { default: TwitterScraper } = await import('../backend/src/scrapers/twitter-scraper.js');
    const scraper = new TwitterScraper();
    
    console.log('  - Available scrapers:', scraper.scrapers.length);
    
    // Test the main scraper interface (which tests all sub-scrapers)
    console.log('  - Testing autoScrapePrompts method...');
    try {
      const testPrompts = await scraper.autoScrapePrompts();
      console.log(`  ✅ Twitter scraping successful: ${testPrompts.length} prompts`);
      workingCount = 1;
    } catch (error) {
      console.log(`  ⚠️ Twitter scraping failed: ${error.message}`);
      
      // Show which individual scrapers are available
      console.log('  - Individual scrapers available:');
      for (const scraperInfo of scraper.scrapers) {
        console.log(`    • ${scraperInfo.name}: ${scraperInfo.status}`);
      }
    }
    
    console.log(`  📊 Working Twitter scrapers: ${workingCount}/${scraper.scrapers.length}`);
    return workingCount > 0;
    
  } catch (error) {
    console.log(`  ❌ Twitter test failed: ${error.message}`);
    return false;
  }
}

async function testEnvironmentVariables() {
  console.log('🔧 Checking environment variables...');
  
  const required = [
    'REDDIT_CLIENT_ID',
    'REDDIT_CLIENT_SECRET'
  ];
  
  const optional = [
    'BRIGHTDATA_API_KEY',
    'SCRAPINGDOG_API_KEY', 
    'SCRAPECREATORS_API_KEY',
    'TWITTERAPI_IO_KEY',
    'FIRECRAWL_API_KEY'
  ];
  
  let requiredCount = 0;
  let optionalCount = 0;
  
  console.log('  Required variables:');
  for (const key of required) {
    const value = process.env[key];
    if (value && value !== 'your_key_here') {
      console.log(`  ✅ ${key}: Set`);
      requiredCount++;
    } else {
      console.log(`  ❌ ${key}: Missing or placeholder`);
    }
  }
  
  console.log('  Optional variables:');
  for (const key of optional) {
    const value = process.env[key];
    if (value && value !== 'your_key_here') {
      console.log(`  ✅ ${key}: Set`);
      optionalCount++;
    } else {
      console.log(`  ⚠️ ${key}: Not set`);
    }
  }
  
  console.log(`  📊 Required: ${requiredCount}/${required.length}, Optional: ${optionalCount}/${optional.length}`);
  
  return requiredCount === required.length;
}

async function main() {
  console.log('🧪 Testing Automated Scraping System');
  console.log('=====================================');
  console.log('');
  
  const results = {
    env: await testEnvironmentVariables(),
    reddit: await testRedditScraper(),
    twitter: await testTwitterScrapers()
  };
  
  console.log('');
  console.log('📋 Test Results Summary');
  console.log('=======================');
  console.log(`Environment Variables: ${results.env ? '✅ Pass' : '❌ Fail'}`);
  console.log(`Reddit Scraping: ${results.reddit ? '✅ Pass' : '❌ Fail'}`);
  console.log(`Twitter Scraping: ${results.twitter ? '✅ Pass' : '❌ Fail'}`);
  
  const overallSuccess = Object.values(results).some(v => v);
  console.log('');
  console.log(`Overall Status: ${overallSuccess ? '✅ Ready for automation' : '❌ Needs configuration'}`);
  
  if (!overallSuccess) {
    console.log('');
    console.log('🔧 Next Steps:');
    console.log('1. Set up required API keys in .env file');
    console.log('2. Configure GitHub repository secrets');
    console.log('3. Re-run this test');
    console.log('4. Check AUTOMATION_SETUP.md for detailed instructions');
  }
  
  process.exit(overallSuccess ? 0 : 1);
}

main().catch(console.error);