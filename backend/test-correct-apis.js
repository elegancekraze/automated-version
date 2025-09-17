// Test both ScrapingDog and BrightData with correct API formats
import axios from 'axios';

// Test ScrapingDog X/Twitter API
async function testScrapingDog() {
  console.log('🐕 Testing ScrapingDog X/Twitter API...');
  
  const api_key = '68c8028568ec896b288ad53c';
  const url = 'https://api.scrapingdog.com/x/post/';
  
  const params = {
    api_key: api_key,
    tweetId: '1683559267524136962', // Example tweet ID
    parsed: "true"
  };
  
  try {
    const response = await axios.get(url, { 
      params: params,
      timeout: 30000
    });
    
    if (response.status === 200) {
      console.log('✅ ScrapingDog Success!');
      console.log('Response data:', JSON.stringify(response.data, null, 2));
      return response.data;
    } else {
      console.log('❌ ScrapingDog failed with status:', response.status);
      return null;
    }
  } catch (error) {
    console.error('❌ ScrapingDog Error:', error.response?.data || error.message);
    return null;
  }
}

// Test BrightData Dataset API v3
async function testBrightData() {
  console.log('🌐 Testing BrightData Dataset API v3...');
  
  const api_key = '1b08dbeee41a6087bd0e8e8c8981d2d705df09def63f74e845a89ea575b3b1ed';
  const url = 'https://api.brightdata.com/datasets/v3/trigger';
  const dataset_id = 'gd_lwxkxvnf1cynvib9co';
  
  const twitterUrls = [
    {"url": "https://x.com/FabrizioRomano/status/1683559267524136962"},
    {"url": "https://x.com/FabrizioRomano/status/1552015619251634176"},
    {"url": "https://x.com/FabrizioRomano/status/1665296716721946625"},
    {"url": "https://x.com/CNN/status/1796673270344810776"}
  ];
  
  try {
    const response = await axios.post(url, twitterUrls, {
      params: {
        dataset_id: dataset_id,
        include_errors: true
      },
      headers: {
        'Authorization': `Bearer ${api_key}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    });
    
    if (response.data) {
      console.log('✅ BrightData Dataset Triggered!');
      console.log('Response data:', JSON.stringify(response.data, null, 2));
      return response.data;
    } else {
      console.log('❌ BrightData failed - no data returned');
      return null;
    }
  } catch (error) {
    console.error('❌ BrightData Error:', error.response?.data || error.message);
    return null;
  }
}

// Run both tests
async function runTests() {
  console.log('🧪 Starting API tests with correct formats...\n');
  
  const scrapingDogResult = await testScrapingDog();
  console.log('\n' + '='.repeat(50) + '\n');
  
  const brightDataResult = await testBrightData();
  
  console.log('\n🎯 Test Summary:');
  console.log('ScrapingDog:', scrapingDogResult ? '✅ Working' : '❌ Failed');
  console.log('BrightData:', brightDataResult ? '✅ Working' : '❌ Failed');
}

// Run the tests
runTests().catch(console.error);