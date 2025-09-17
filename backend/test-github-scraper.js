#!/usr/bin/env node

/**
 * Quick test for GitHub scraper functionality
 * Tests the GitHub scraper to ensure it can fetch prompts successfully
 */

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
try {
  const { config } = await import('dotenv');
  config({ path: path.join(__dirname, '.env') });
} catch (e) {
  console.log('📝 dotenv not available, using system environment');
}

async function testGitHubScraper() {
  console.log('🐙 Testing GitHub Scraper...\n');
  
  try {
    // Import the GitHub scraper
    const { default: GitHubScraper } = await import('./src/scrapers/github-scraper.js');
    const scraper = new GitHubScraper();
    
    console.log('✅ GitHub scraper imported successfully');
    
    // Test authentication status
    console.log('🔑 Authentication status:');
    if (process.env.GITHUB_TOKEN) {
      console.log('   ✅ GitHub token found in environment');
    } else {
      console.log('   ⚠️  No GitHub token - using unauthenticated requests (60/hour limit)');
    }
    
    // Test rate limit checking
    console.log('\n⏱️  Testing rate limit handling...');
    await scraper.checkRateLimit();
    console.log(`   Current rate limit: ${scraper.rateLimitRemaining} requests remaining`);
    
    // Test repository search
    console.log('\n🔍 Testing repository search...');
    const repos = await scraper.searchRepositories('prompts AI language:markdown', 3);
    console.log(`   Found ${repos.length} repositories`);
    
    if (repos.length > 0) {
      console.log('   Sample repositories:');
      repos.slice(0, 3).forEach(repo => {
        console.log(`   - ${repo.full_name} (⭐ ${repo.stargazers_count})`);
      });
    }
    
    // Test gist search  
    console.log('\n📝 Testing gist search...');
    const gists = await scraper.searchGists('prompts chatgpt', 2);
    console.log(`   Found ${gists.length} relevant gists`);
    
    if (gists.length > 0) {
      console.log('   Sample gists:');
      gists.slice(0, 2).forEach(gist => {
        console.log(`   - ${gist.id}: ${gist.description || 'No description'}`);
      });
    }
    
    // Test prompt extraction (limited to avoid rate limits)
    console.log('\n🎯 Testing prompt extraction (limited test)...');
    const prompts = await scraper.scrapePrompts(10); // Only 10 for testing
    
    console.log(`   Extracted ${prompts.length} prompts`);
    
    if (prompts.length > 0) {
      console.log('   Sample prompts:');
      prompts.slice(0, 3).forEach((prompt, i) => {
        console.log(`   ${i + 1}. ${prompt.title}`);
        console.log(`      Category: ${prompt.category}`);
        console.log(`      Difficulty: ${prompt.difficulty}`);
        console.log(`      Source: ${prompt.source}`);
        console.log(`      Length: ${prompt.prompt_text.length} characters`);
        console.log(`      Tags: ${prompt.tags.join(', ')}`);
        console.log('');
      });
    }
    
    // Test quality filters
    const qualityPrompts = prompts.filter(prompt => {
      return prompt.prompt_text &&
             prompt.title &&
             prompt.prompt_text.length >= 50 &&
             prompt.prompt_text.length <= 3000 &&
             !prompt.prompt_text.toLowerCase().includes('lorem ipsum') &&
             !prompt.prompt_text.toLowerCase().includes('placeholder');
    });
    
    console.log(`\n✅ Quality check: ${qualityPrompts.length}/${prompts.length} prompts passed quality filters`);
    
    // Summary
    console.log('\n📊 TEST SUMMARY:');
    console.log(`✅ Scraper initialized: Yes`);
    console.log(`✅ API requests working: Yes`);
    console.log(`✅ Repository search: ${repos.length > 0 ? 'Yes' : 'Limited'}`);
    console.log(`✅ Gist search: ${gists.length > 0 ? 'Yes' : 'Limited'}`);
    console.log(`✅ Prompt extraction: ${prompts.length > 0 ? 'Yes' : 'No'}`);
    console.log(`✅ Quality filtering: ${qualityPrompts.length > 0 ? 'Yes' : 'No prompts to filter'}`);
    
    if (prompts.length > 0) {
      console.log('\n🎉 GitHub scraper is working correctly!');
      
      if (!process.env.GITHUB_TOKEN) {
        console.log('\n💡 TIP: Add a GITHUB_TOKEN to your .env file for higher rate limits');
        console.log('   Get one at: https://github.com/settings/tokens');
        console.log('   No special permissions needed for public repositories');
      }
    } else {
      console.log('\n⚠️  No prompts found - this could be due to:');
      console.log('   - Rate limiting (try again later)');
      console.log('   - Network issues');
      console.log('   - Changes to GitHub API or repository structures');
    }
    
  } catch (error) {
    console.error('\n❌ GitHub scraper test failed:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
    
    if (error.message.includes('rate limit')) {
      console.log('\n💡 This might be a rate limit issue. Try again later or add a GITHUB_TOKEN.');
    }
  }
}

// Run the test
testGitHubScraper().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});