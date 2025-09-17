/**
 * Test script for Twitter scraping API endpoints
 * 
 * Run this after starting your server to test the Twitter scraping integration.
 * Make sure to set your FIRECRAWL_API_KEY in the .env file first.
 * 
 * Usage:
 * 1. Start your server: npm start
 * 2. Run this test: node test-twitter-api.js
 */

const http = require('http');

// Configuration
const BASE_URL = 'http://localhost:3001'; // Adjust port if different
const API_BASE = `${BASE_URL}/api/scrape`;

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({
            status: res.statusCode,
            data: response
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: body
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test functions
async function testHealthCheck() {
  console.log('\n🏥 Testing health check endpoint...');
  
  try {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/scrape/health',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const response = await makeRequest(options);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return response.status === 200;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

async function testTwitterStats() {
  console.log('\n📊 Testing Twitter stats endpoint...');
  
  try {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/scrape/twitter/stats',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const response = await makeRequest(options);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return response.status === 200;
  } catch (error) {
    console.error('❌ Twitter stats failed:', error.message);
    return false;
  }
}

async function testTwitterSearch() {
  console.log('\n🔍 Testing Twitter search endpoint...');
  
  try {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/scrape/twitter/search',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify({
          query: 'ChatGPT prompts',
          options: { waitFor: 2000 }
        }))
      }
    };
    
    const requestData = {
      query: 'ChatGPT prompts',
      options: { waitFor: 2000 }
    };
    
    const response = await makeRequest(options, requestData);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return response.status === 200 && response.data.success;
  } catch (error) {
    console.error('❌ Twitter search failed:', error.message);
    return false;
  }
}

async function testTwitterHashtags() {
  console.log('\n🏷️ Testing Twitter hashtags endpoint...');
  
  try {
    const requestData = {
      hashtags: ['ChatGPT', 'PromptEngineering'],
      options: { waitFor: 2000 }
    };
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/scrape/twitter/hashtags',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(requestData))
      }
    };
    
    const response = await makeRequest(options, requestData);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return response.status === 200 && response.data.success;
  } catch (error) {
    console.error('❌ Twitter hashtags failed:', error.message);
    return false;
  }
}

async function testTwitterAuto() {
  console.log('\n🤖 Testing Twitter auto scraping endpoint...');
  
  try {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/scrape/twitter/auto',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const response = await makeRequest(options);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return response.status === 200 && response.data.success;
  } catch (error) {
    console.error('❌ Twitter auto scraping failed:', error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🧪 Starting Twitter API integration tests...');
  console.log('==================================================');
  
  const results = {
    healthCheck: false,
    twitterStats: false,
    twitterSearch: false,
    twitterHashtags: false,
    twitterAuto: false
  };
  
  // Test health check first
  results.healthCheck = await testHealthCheck();
  
  if (!results.healthCheck) {
    console.log('\n❌ Server not responding. Make sure your server is running on port 3001');
    console.log('   Start with: cd automated-version/backend && npm start');
    return;
  }
  
  // Test Twitter endpoints
  results.twitterStats = await testTwitterStats();
  
  // Only run scraping tests if user confirms
  console.log('\n⚠️  The following tests will make actual scraping requests.');
  console.log('   This will use your Firecrawl API credits.');
  console.log('   Make sure FIRECRAWL_API_KEY is set in your .env file.');
  console.log('\n   Press Ctrl+C to stop, or wait 5 seconds to continue...');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Test scraping endpoints (these use API credits)
  results.twitterSearch = await testTwitterSearch();
  results.twitterHashtags = await testTwitterHashtags();
  
  // Skip auto test for now (it scrapes a lot)
  console.log('\n⚠️  Skipping auto scraping test (use too many credits)');
  console.log('   To test manually, use: POST /api/scrape/twitter/auto');
  
  // Summary
  console.log('\n==================================================');
  console.log('🧪 Test Results Summary:');
  console.log('==================================================');
  
  Object.entries(results).forEach(([test, passed]) => {
    const icon = passed ? '✅' : '❌';
    const status = passed ? 'PASSED' : 'FAILED';
    console.log(`${icon} ${test}: ${status}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length - 1; // Exclude auto test
  
  console.log(`\n📊 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Your Twitter scraping API is ready.');
    console.log('\n📋 Available endpoints:');
    console.log('   GET  /api/scrape/health');
    console.log('   GET  /api/scrape/twitter/stats');
    console.log('   POST /api/scrape/twitter/search');
    console.log('   POST /api/scrape/twitter/hashtags');
    console.log('   POST /api/scrape/twitter/profile');
    console.log('   POST /api/scrape/twitter/auto');
  } else {
    console.log('\n❌ Some tests failed. Check the errors above.');
    console.log('\n🔧 Common issues:');
    console.log('   - Server not running: cd automated-version/backend && npm start');
    console.log('   - Missing API key: Add FIRECRAWL_API_KEY to .env file');
    console.log('   - Port mismatch: Check server is on port 3001');
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Test cancelled by user');
  process.exit(0);
});

// Run the tests
runTests().catch(error => {
  console.error('\n💥 Test suite crashed:', error.message);
  process.exit(1);
});