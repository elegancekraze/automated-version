import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔄 Merging coding prompts with main data...');

// Read existing data
const mainDataPath = path.join(__dirname, 'data', 'prompts.json');
const codingPromptsPath = path.join(__dirname, 'data', 'coding-prompts.json');
const publicDataPath = path.join(__dirname, '..', 'public', 'data.json');

try {
  // Load files
  const mainData = JSON.parse(fs.readFileSync(mainDataPath, 'utf8'));
  const codingPrompts = JSON.parse(fs.readFileSync(codingPromptsPath, 'utf8'));
  
  console.log(`📚 Current main data: ${mainData.length} prompts`);
  console.log(`💻 Coding prompts to add: ${codingPrompts.length} prompts`);
  
  // Mark coding prompts as featured and ensure they have unique IDs
  const featuredCodingPrompts = codingPrompts.map(prompt => ({
    ...prompt,
    featured: true,
    priority: 'high' // Give coding prompts high priority in the app
  }));
  
  // Remove any existing coding prompts to avoid duplicates
  const filteredMainData = mainData.filter(prompt => 
    !prompt.category?.includes('Coding') && 
    !prompt.category?.includes('Programming') &&
    !prompt.source?.includes('github')
  );
  
  // Merge data - put coding prompts first
  const mergedData = [...featuredCodingPrompts, ...filteredMainData];
  
  // Save to both locations
  fs.writeFileSync(mainDataPath, JSON.stringify(mergedData, null, 2));
  fs.writeFileSync(publicDataPath, JSON.stringify(mergedData, null, 2));
  
  console.log(`✅ Successfully merged data: ${mergedData.length} total prompts`);
  console.log(`🚀 ${featuredCodingPrompts.length} coding prompts are now featured at the top`);
  
  // Show coding prompt categories
  const codingCategories = [...new Set(featuredCodingPrompts.map(p => p.category))];
  console.log('📋 Coding prompt categories:', codingCategories.join(', '));
  
} catch (error) {
  console.error('❌ Error merging data:', error.message);
}

console.log('✅ Data merge completed!');