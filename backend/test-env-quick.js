#!/usr/bin/env node

/**
 * Quick Environment Variable Test
 * Simple script to test if environment variables are properly loaded
 */

console.log('🔍 QUICK ENVIRONMENT TEST');
console.log('========================');

const requiredVars = [
  'REDDIT_CLIENT_ID',
  'REDDIT_CLIENT_SECRET', 
  'BRIGHTDATA_API_KEY',
  'SCRAPINGDOG_API_KEY',
  'SCRAPECREATORS_API_KEY'
];

console.log('📋 Checking variables:');
let setCount = 0;

for (const varName of requiredVars) {
  const value = process.env[varName];
  const isSet = value && value.trim() !== '' && value !== 'undefined';
  
  if (isSet) {
    // Show first 4 and last 4 characters for security
    const masked = value.length > 8 ? 
      `${value.substring(0, 4)}...${value.substring(value.length - 4)}` : 
      '****';
    console.log(`✅ ${varName}: ${masked} (${value.length} chars)`);
    setCount++;
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
}

console.log(`\n📊 Result: ${setCount}/${requiredVars.length} variables set`);

if (setCount === requiredVars.length) {
  console.log('✅ ALL GOOD: Ready for API testing');
  process.exit(0);
} else {
  console.log('❌ ISSUES FOUND: Fix environment variables first');
  process.exit(1);
}