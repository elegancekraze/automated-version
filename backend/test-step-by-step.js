#!/usr/bin/env node

/**
 * Step-by-Step Environment and API Testing Script
 * Tests each component individually before attempting full automation
 */

// Fix for Node.js compatibility issues
global.File = global.File || class File {};

// Load environment variables if dotenv is available
try {
  await import('dotenv').then(dotenv => dotenv.config());
} catch (e) {
  console.log('📝 Using system environment variables (dotenv not available)');
}

class StepByStepTester {
  constructor() {
    this.testResults = {
      environment: {},
      authentication: {},
      scraping: {}
    };
  }

  // Test 1: Environment Variables
  async testEnvironmentVariables() {
    console.log('\n🔍 STEP 1: Testing Environment Variables');
    console.log('=====================================');
    
    const requiredVars = [
      { name: 'REDDIT_CLIENT_ID', required: true },
      { name: 'REDDIT_CLIENT_SECRET', required: true },
      { name: 'BRIGHTDATA_API_KEY', required: true },
      { name: 'SCRAPINGDOG_API_KEY', required: true },
      { name: 'SCRAPECREATORS_API_KEY', required: true }
    ];

    let passed = 0;
    let total = requiredVars.length;

    for (const variable of requiredVars) {
      const value = process.env[variable.name];
      const isSet = value && value.trim() !== '' && value !== 'undefined';
      
      if (isSet) {
        console.log(`✅ ${variable.name}: SET (${value.length} chars)`);
        this.testResults.environment[variable.name] = { status: 'PASS', length: value.length };
        passed++;
      } else {
        console.log(`❌ ${variable.name}: NOT SET`);
        this.testResults.environment[variable.name] = { status: 'FAIL', error: 'Not set' };
      }
    }

    const success = passed === total;
    console.log(`\n📊 Environment Test Result: ${passed}/${total} variables set`);
    console.log(success ? '✅ ENVIRONMENT: PASS' : '❌ ENVIRONMENT: FAIL');
    
    return success;
  }

  // Test 2: Reddit Authentication
  async testRedditAuthentication() {
    console.log('\n🔍 STEP 2: Testing Reddit Authentication');
    console.log('=====================================');
    
    try {
      const { default: RedditScraper } = await import('./src/scrapers/reddit-scraper.js');
      const scraper = new RedditScraper();
      
      console.log('📡 Attempting Reddit authentication...');
      const authSuccess = await scraper.authenticate();
      
      if (authSuccess) {
        console.log('✅ REDDIT AUTH: PASS - Successfully authenticated');
        this.testResults.authentication.reddit = { status: 'PASS' };
        return true;
      } else {
        console.log('❌ REDDIT AUTH: FAIL - Authentication failed');
        this.testResults.authentication.reddit = { status: 'FAIL', error: 'Authentication failed' };
        return false;
      }
    } catch (error) {
      console.log(`❌ REDDIT AUTH: ERROR - ${error.message}`);
      this.testResults.authentication.reddit = { status: 'ERROR', error: error.message };
      return false;
    }
  }

  // Test 3: Individual Twitter Scraper Tiers
  async testTwitterScrapers() {
    console.log('\n🔍 STEP 3: Testing Twitter Scrapers (Individual Tiers)');
    console.log('====================================================');

    const scrapers = [
      { name: 'BrightData', file: './src/scrapers/brightdata-twitter.js', envVar: 'BRIGHTDATA_API_KEY' },
      { name: 'ScrapingDog', file: './src/scrapers/scrapingdog-twitter.js', envVar: 'SCRAPINGDOG_API_KEY' },
      { name: 'ScrapeCreators', file: './src/scrapers/scrapecreators-twitter.js', envVar: 'SCRAPECREATORS_API_KEY' }
    ];

    let workingScrapers = 0;

    for (const scraperInfo of scrapers) {
      console.log(`\n🐦 Testing ${scraperInfo.name}...`);
      
      // Check if API key is available
      if (!process.env[scraperInfo.envVar]) {
        console.log(`⚠️ ${scraperInfo.name}: API key not set (${scraperInfo.envVar})`);
        this.testResults.scraping[scraperInfo.name] = { status: 'SKIP', error: 'API key not set' };
        continue;
      }

      try {
        const { default: ScraperClass } = await import(scraperInfo.file);
        const scraper = new ScraperClass();
        
        // Test with a simple search
        console.log(`📡 Testing ${scraperInfo.name} with simple search...`);
        const results = await scraper.searchTweets('GPT-5 prompts', { count: 2, timeout: 10000 });
        
        if (results && results.length > 0) {
          console.log(`✅ ${scraperInfo.name}: WORKING - Found ${results.length} results`);
          this.testResults.scraping[scraperInfo.name] = { status: 'PASS', results: results.length };
          workingScrapers++;
        } else {
          console.log(`⚠️ ${scraperInfo.name}: NO RESULTS - API working but no data returned`);
          this.testResults.scraping[scraperInfo.name] = { status: 'PARTIAL', results: 0 };
        }
      } catch (error) {
        console.log(`❌ ${scraperInfo.name}: ERROR - ${error.message}`);
        this.testResults.scraping[scraperInfo.name] = { status: 'FAIL', error: error.message };
      }
    }

    const success = workingScrapers > 0;
    console.log(`\n📊 Twitter Scrapers Result: ${workingScrapers}/${scrapers.length} working`);
    console.log(success ? '✅ TWITTER SCRAPERS: PASS (At least one working)' : '❌ TWITTER SCRAPERS: FAIL');
    
    return success;
  }

  // Test 4: Small Scale Reddit Scraping
  async testRedditScraping() {
    console.log('\n🔍 STEP 4: Testing Reddit Scraping (Small Scale)');
    console.log('===============================================');

    try {
      const { default: RedditScraper } = await import('./src/scrapers/reddit-scraper.js');
      const scraper = new RedditScraper();
      
      console.log('📡 Testing Reddit prompt scraping (limit: 5 prompts)...');
      const prompts = await scraper.scrapePrompts('ChatGPT', { limit: 5, timeFilter: 'day' });
      
      if (prompts && prompts.length > 0) {
        console.log(`✅ REDDIT SCRAPING: PASS - Found ${prompts.length} prompts`);
        console.log(`📋 Sample prompt: "${prompts[0]?.title?.substring(0, 60)}..."`);
        this.testResults.scraping.reddit = { status: 'PASS', results: prompts.length };
        return true;
      } else {
        console.log('⚠️ REDDIT SCRAPING: NO RESULTS - API working but no prompts found');
        this.testResults.scraping.reddit = { status: 'PARTIAL', results: 0 };
        return false;
      }
    } catch (error) {
      console.log(`❌ REDDIT SCRAPING: ERROR - ${error.message}`);
      this.testResults.scraping.reddit = { status: 'FAIL', error: error.message };
      return false;
    }
  }

  // Generate comprehensive test report
  generateReport() {
    console.log('\n📊 COMPREHENSIVE TEST REPORT');
    console.log('============================');
    
    const envResults = Object.values(this.testResults.environment);
    const envPassed = envResults.filter(r => r.status === 'PASS').length;
    const envTotal = envResults.length;
    
    const authResults = Object.values(this.testResults.authentication);
    const authPassed = authResults.filter(r => r.status === 'PASS').length;
    const authTotal = authResults.length;
    
    const scrapingResults = Object.values(this.testResults.scraping);
    const scrapingPassed = scrapingResults.filter(r => r.status === 'PASS').length;
    const scrapingTotal = scrapingResults.length;
    
    console.log(`🔍 Environment Variables: ${envPassed}/${envTotal} passed`);
    console.log(`🔐 Authentication: ${authPassed}/${authTotal} passed`);
    console.log(`🌐 Scraping APIs: ${scrapingPassed}/${scrapingTotal} working`);
    
    const overallScore = envPassed + authPassed + scrapingPassed;
    const maxScore = envTotal + authTotal + scrapingTotal;
    
    console.log(`\n🎯 OVERALL SCORE: ${overallScore}/${maxScore}`);
    
    if (overallScore >= maxScore * 0.8) {
      console.log('✅ SYSTEM STATUS: READY FOR AUTOMATION');
      return true;
    } else if (overallScore >= maxScore * 0.5) {
      console.log('⚠️ SYSTEM STATUS: PARTIAL - Some issues need attention');
      return false;
    } else {
      console.log('❌ SYSTEM STATUS: NOT READY - Critical issues need fixing');
      return false;
    }
  }

  // Main test runner
  async runAllTests() {
    console.log('🚀 Starting Step-by-Step System Testing');
    console.log('======================================');
    
    const envPass = await this.testEnvironmentVariables();
    if (!envPass) {
      console.log('\n❌ Environment variables failed. Cannot proceed with API tests.');
      return this.generateReport();
    }
    
    await this.testRedditAuthentication();
    await this.testTwitterScrapers(); 
    await this.testRedditScraping();
    
    return this.generateReport();
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new StepByStepTester();
  const success = await tester.runAllTests();
  process.exit(success ? 0 : 1);
}

export default StepByStepTester;