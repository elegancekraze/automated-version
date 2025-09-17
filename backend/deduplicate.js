const fs = require('fs');
const path = require('path');

// Read the original file
const originalFile = path.join(__dirname, '..', 'data', 'gpt5_prompts_full_backup.json');
const outputFile = path.join(__dirname, '..', 'data', 'gpt5_prompts_full.json');

try {
  const data = JSON.parse(fs.readFileSync(originalFile, 'utf8'));
  console.log(`Original count: ${data.length}`);
  
  // Remove duplicates based on title
  const unique = [];
  const seen = new Set();
  let idCounter = 1;
  
  for (const item of data) {
    if (!seen.has(item.title)) {
      // Update the ID to be sequential
      item.id = idCounter;
      unique.push(item);
      seen.add(item.title);
      idCounter++;
    }
  }
  
  console.log(`Unique count: ${unique.length}`);
  console.log(`Removed ${data.length - unique.length} duplicates`);
  
  // Write the deduplicated data
  fs.writeFileSync(outputFile, JSON.stringify(unique, null, 2), 'utf8');
  console.log('✅ Deduplicated file saved successfully!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
