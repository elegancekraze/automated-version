#!/usr/bin/env node

/**
 * Debug script to check environment variables in GitHub Actions
 */

console.log('🔍 DEBUGGING ENVIRONMENT VARIABLES');
console.log('==================================');

const requiredVars = [
  'REDDIT_CLIENT_ID',
  'REDDIT_CLIENT_SECRET', 
  'BRIGHTDATA_API_KEY',
  'SCRAPINGDOG_API_KEY',
  'SCRAPECREATORS_API_KEY'
];

const optionalVars = [
  'TWITTERAPI_IO_KEY',
  'FIRECRAWL_API_KEY'
];

console.log('📋 Checking required variables:');
let setCount = 0;
for (const varName of requiredVars) {
  const value = process.env[varName];
  const isSet = value && value.trim() !== '' && value !== 'undefined';
  if (isSet) {
    console.log(`✅ ${varName}: ${value.substring(0, 8)}...${value.substring(value.length - 4)} (${value.length} chars)`);
    setCount++;
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
}

console.log('\n📋 Checking optional variables:');
for (const varName of optionalVars) {
  const value = process.env[varName];
  const isSet = value && value.trim() !== '' && value !== 'undefined';
  if (isSet) {
    console.log(`✅ ${varName}: SET`);
  } else {
    console.log(`⚠️ ${varName}: NOT SET`);
  }
}

console.log('\n📊 Summary:');
console.log(`Set: ${setCount}/${requiredVars.length}`);

if (setCount === 0) {
  console.log('\n💡 ISSUE: No environment variables are set!');
  console.log('This means GitHub Secrets are not configured properly.');
  console.log('Check: GitHub repo → Settings → Secrets and variables → Actions');
} else if (setCount < requiredVars.length) {
  console.log('\n⚠️  PARTIAL: Some environment variables missing');
} else {
  console.log('\n✅ ALL GOOD: All required variables are set');
}