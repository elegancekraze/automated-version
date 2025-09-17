#!/usr/bin/env node

/**
 * Quick GitHub Scraper Test
 * Simple test to verify GitHub scraper functionality
 */

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function quickTest() {
  console.log('🚀 Quick GitHub Scraper Test\n');
  
  try {
    const { default: GitHubScraper } = await import('./src/scrapers/github-scraper.js');
    const scraper = new GitHubScraper();
    
    console.log('Testing basic functionality...');
    const prompts = await scraper.scrapePrompts(5);
    
    console.log(`✅ Found ${prompts.length} prompts`);
    
    if (prompts.length > 0) {
      console.log('\nFirst prompt:');
      console.log(`Title: ${prompts[0].title}`);
      console.log(`Category: ${prompts[0].category}`);
      console.log(`Source: ${prompts[0].source}`);
      console.log('✅ GitHub scraper is working!');
    } else {
      console.log('⚠️ No prompts found (might be rate limited)');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

quickTest();