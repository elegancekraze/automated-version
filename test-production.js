// Test script to check if the production build works correctly
console.log('🧪 Testing production API service...');

// Test if data.json is accessible
fetch('/data.json')
  .then(response => {
    console.log('✅ data.json response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('✅ data.json loaded successfully');
    console.log('📊 Number of prompts:', data.length);
    console.log('📝 First prompt:', data[0]);
    
    // Test categories extraction
    const categories = {};
    data.forEach(prompt => {
      const category = prompt.category;
      categories[category] = (categories[category] || 0) + 1;
    });
    
    console.log('🏷️ Categories found:', Object.keys(categories));
    console.log('📈 Category counts:', categories);
  })
  .catch(error => {
    console.error('❌ Error loading data.json:', error);
  });

// Test environment detection
console.log('🔧 Environment check:');
console.log('- import.meta.env.PROD:', window.import?.meta?.env?.PROD || 'undefined');
console.log('- import.meta.env.DEV:', window.import?.meta?.env?.DEV || 'undefined');
console.log('- import.meta.env.MODE:', window.import?.meta?.env?.MODE || 'undefined');