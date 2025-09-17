#!/usr/bin/env node

/**
 * Automated Daily Scraping Script for GitHub Actions
 * Scrapes prompts from Reddit and Twitter, updates data.json
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for Node.js compatibility issues
global.File = global.File || class File {};

// Load environment variables if dotenv is available
try {
  await import('dotenv').then(dotenv => dotenv.config());
} catch (e) {
  console.log('📝 dotenv not available, using system environment variables');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  dataFile: path.join(__dirname, '../public/data.json'),
  maxPrompts: 5000,
  sources: {
    reddit: process.env.SCRAPE_REDDIT !== 'false',
    twitter: false // Disabled - Twitter prompts are low quality
  }
};

// Utility functions
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60);
}

function deduplicatePrompts(prompts) {
  const seenTitles = new Set();
  const seenTexts = new Set();
  const seenSlugs = new Set();
  
  return prompts.filter(prompt => {
    // Create multiple deduplication keys
    const title = (prompt.title || '').toLowerCase().trim();
    const text = (prompt.prompt_text || '').substring(0, 200).toLowerCase().trim();
    const slug = prompt.slug || generateSlug(prompt.title || '');
    
    // Check for duplicates using multiple criteria
    if (seenTitles.has(title) && title.length > 10) {
      console.log(`🔍 Duplicate title removed: ${title.substring(0, 50)}...`);
      return false;
    }
    
    if (seenTexts.has(text) && text.length > 50) {
      console.log(`🔍 Duplicate content removed: ${text.substring(0, 50)}...`);
      return false;
    }
    
    if (seenSlugs.has(slug) && slug.length > 5) {
      console.log(`🔍 Duplicate slug removed: ${slug}`);
      return false;
    }
    
    // Add to seen sets
    if (title.length > 10) seenTitles.add(title);
    if (text.length > 50) seenTexts.add(text);
    if (slug.length > 5) seenSlugs.add(slug);
    
    return true;
  });
}

async function loadExistingData() {
  try {
    const content = await fs.readFile(CONFIG.dataFile, 'utf8');
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : (data.prompts || []);
  } catch (error) {
    console.log('📝 No existing data file found, starting fresh');
    return [];
  }
}

async function scrapeReddit() {
  console.log('🔴 Starting Reddit scraping (high-quality prompts only)...');
  try {
    const { default: RedditScraper } = await import('./src/scrapers/reddit-scraper.js');
    const scraper = new RedditScraper();
    
    // Test authentication
    const authSuccess = await scraper.authenticate();
    if (!authSuccess) {
      console.log('⚠️ Reddit authentication failed, skipping Reddit');
      return [];
    }
    
    const prompts = await scraper.scrapeAll();
    
    // Filter for only high-quality, substantial prompts
    const qualityPrompts = prompts.filter(prompt => {
      const textLength = (prompt.prompt_text || '').length;
      const titleLength = (prompt.title || '').length;
      
      // Only keep prompts that are substantial (200+ characters) and well-formed
      return textLength >= 200 && 
             titleLength >= 20 && 
             titleLength <= 200 &&
             !prompt.title.toLowerCase().includes('test') &&
             !prompt.title.toLowerCase().includes('example') &&
             !prompt.prompt_text.toLowerCase().includes('placeholder');
    });
    
    console.log(`✅ Reddit: Found ${prompts.length} prompts, kept ${qualityPrompts.length} high-quality ones`);
    return qualityPrompts;
    
  } catch (error) {
    console.error('❌ Reddit scraping error:', error.message);
    return [];
  }
}

async function updateDataFile(newPrompts, existingPrompts) {
  console.log('💾 Updating data file...');
  
  // Remove Twitter prompts from existing data
  const cleanedExistingPrompts = existingPrompts.filter(prompt => 
    prompt.source !== 'twitter' && prompt.source !== 'ScrapingDog-X'
  );
  console.log(`🗑️ Removed ${existingPrompts.length - cleanedExistingPrompts.length} Twitter prompts from existing data`);
  
  // Only keep substantial prompts from existing data
  const qualityExistingPrompts = cleanedExistingPrompts.filter(prompt => {
    const textLength = (prompt.prompt_text || '').length;
    return textLength >= 100; // Keep existing prompts that are at least 100 chars
  });
  console.log(`📏 Kept ${qualityExistingPrompts.length} quality existing prompts`);
  
  // Combine and deduplicate
  const allPrompts = [...qualityExistingPrompts, ...newPrompts];
  const uniquePrompts = deduplicatePrompts(allPrompts);
  
  // Sort by date (newest first)
  uniquePrompts.sort((a, b) => {
    const dateA = new Date(a.created_date || a.date || '1970-01-01');
    const dateB = new Date(b.created_date || b.date || '1970-01-01');
    return dateB - dateA;
  });
  
  // Limit total prompts
  const finalPrompts = uniquePrompts.slice(0, CONFIG.maxPrompts);
  
  // Create final data structure
  const finalData = {
    generated_at: new Date().toISOString(),
    total_prompts: finalPrompts.length,
    sources: ['reddit', 'twitter', 'manual'],
    last_update: new Date().toISOString().split('T')[0],
    prompts: finalPrompts
  };
  
  // Write to file
  await fs.writeFile(CONFIG.dataFile, JSON.stringify(finalData, null, 2));
  
  console.log(`✅ Data file updated: ${finalPrompts.length} total prompts`);
  return finalData;
}

async function generateSummary(beforeCount, afterCount, newPrompts) {
  const summary = {
    timestamp: new Date().toISOString(),
    prompts_before: beforeCount,
    prompts_after: afterCount,
    new_prompts_added: afterCount - beforeCount,
    sources_scraped: Object.entries(CONFIG.sources)
      .filter(([, enabled]) => enabled)
      .map(([source]) => source),
    success: true
  };
  
  console.log('\n📊 SCRAPING SUMMARY:');
  console.log(`- Before: ${beforeCount} prompts`);
  console.log(`- After: ${afterCount} prompts`);
  console.log(`- New prompts: ${summary.new_prompts_added}`);
  console.log(`- Sources: ${summary.sources_scraped.join(', ')}`);
  
  // Save summary for GitHub Actions
  if (process.env.GITHUB_ACTIONS) {
    await fs.writeFile(path.join(__dirname, 'scraping-summary.json'), JSON.stringify(summary, null, 2));
  }
  
  return summary;
}

// Main execution
async function main() {
  console.log('🚀 Starting automated prompt scraping...');
  console.log(`📅 Date: ${new Date().toISOString()}`);
  console.log(`🎯 Sources: ${Object.entries(CONFIG.sources).filter(([,v]) => v).map(([k]) => k).join(', ')}`);
  console.log('');
  
  try {
    // Load existing data
    const existingPrompts = await loadExistingData();
    const beforeCount = existingPrompts.length;
    console.log(`📚 Loaded ${beforeCount} existing prompts`);
    
    // Scrape from enabled sources (Reddit only - high quality)
    const newPrompts = [];
    
    if (CONFIG.sources.reddit) {
      const redditPrompts = await scrapeReddit();
      newPrompts.push(...redditPrompts);
    }
    
    console.log(`\n🔍 Total new high-quality prompts found: ${newPrompts.length}`);
    
    // Update data file
    const finalData = await updateDataFile(newPrompts, existingPrompts);
    const afterCount = finalData.total_prompts;
    
    // Generate summary
    await generateSummary(beforeCount, afterCount, newPrompts);
    
    console.log('\n🎉 Automated scraping completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('💥 Fatal error in scraping process:', error);
    
    // Save error summary for GitHub Actions
    if (process.env.GITHUB_ACTIONS) {
      const errorSummary = {
        timestamp: new Date().toISOString(),
        success: false,
        error: error.message,
        stack: error.stack
      };
      await fs.writeFile(path.join(__dirname, 'scraping-summary.json'), JSON.stringify(errorSummary, null, 2));
    }
    
    process.exit(1);
  }
}

// Execute if called directly
if (process.argv[1] === __filename) {
  main();
}

export default main;