import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔄 Creating proper data file with featured coding prompts at top...');

try {
  // Load files
  const mainDataPath = path.join(__dirname, 'data', 'prompts.json');
  const codingPromptsPath = path.join(__dirname, 'data', 'coding-prompts.json');
  const publicDataPath = path.join(__dirname, '..', 'public', 'data.json');

  const mainData = JSON.parse(fs.readFileSync(mainDataPath, 'utf8'));
  const codingPrompts = JSON.parse(fs.readFileSync(codingPromptsPath, 'utf8'));
  
  console.log(`📚 Main data: ${mainData.length} prompts`);
  console.log(`💻 Coding prompts: ${codingPrompts.length} prompts`);
  
  // Filter out old coding/programming prompts from main data
  const filteredMainData = mainData.filter(prompt => 
    !prompt.category?.toLowerCase().includes('programming') &&
    !prompt.category?.toLowerCase().includes('coding') &&
    !prompt.category?.toLowerCase().includes('software') &&
    !prompt.source?.includes('github:')
  );
  
  console.log(`🧹 Filtered main data: ${filteredMainData.length} prompts (removed duplicates)`);
  
  // Create final data: featured coding prompts first, then other prompts
  const finalData = [...codingPrompts, ...filteredMainData.slice(0, 100)]; // Limit to prevent huge file
  
  // Save to public folder
  fs.writeFileSync(publicDataPath, JSON.stringify(finalData, null, 2));
  
  console.log(`✅ Created final data file: ${finalData.length} total prompts`);
  console.log(`🎯 Featured coding prompts: ${codingPrompts.length} (at the top)`);
  console.log(`📊 Regular prompts: ${filteredMainData.slice(0, 100).length}`);
  
  // Show sample featured prompt
  const firstFeatured = finalData.find(p => p.featured);
  if (firstFeatured) {
    console.log(`\n✨ Sample featured prompt: "${firstFeatured.title}" (${firstFeatured.category})`);
  }

} catch (error) {
  console.error('❌ Error:', error.message);
}

console.log('✅ Data creation completed!');