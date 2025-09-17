import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

console.log('🚀 Starting coding prompts scraper...');
console.log('🔑 GitHub token available:', !!process.env.GITHUB_TOKEN);

async function scrapeCodingPrompts() {
  const prompts = [];
  
  try {
    // Search for coding-specific repositories
    const queries = [
      'awesome-chatgpt-prompts coding',
      'programming prompts language:markdown', 
      'developer ai prompts',
      'coding interview prompts',
      'code review prompts'
    ];

    for (let i = 0; i < queries.length && prompts.length < 30; i++) {
      const query = queries[i];
      console.log(`🔍 Searching for: ${query}`);
      
      const searchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=3`;
      
      const response = await fetch(searchUrl, {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'CodingPromptsBot/1.0'
        }
      });

      if (!response.ok) {
        console.log(`❌ Search failed: ${response.status}`);
        continue;
      }

      const searchData = await response.json();
      console.log(`📚 Found ${searchData.total_count} repositories`);

      // Process top repositories
      for (const repo of (searchData.items || []).slice(0, 2)) {
        console.log(`📁 Processing: ${repo.full_name}`);
        
        // Wait between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get README content
        const readmeUrl = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents/README.md`;
        
        const readmeResponse = await fetch(readmeUrl, {
          headers: {
            'Authorization': `token ${process.env.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'CodingPromptsBot/1.0'
          }
        });

        if (readmeResponse.ok) {
          const readmeData = await readmeResponse.json();
          if (readmeData.content) {
            const content = Buffer.from(readmeData.content, 'base64').toString('utf-8');
            const extracted = extractCodingPromptsFromContent(content, repo.full_name);
            console.log(`✅ Extracted ${extracted.length} prompts from ${repo.full_name}`);
            prompts.push(...extracted);
          }
        }

        if (prompts.length >= 30) break;
      }
    }

    // Filter and deduplicate
    const uniquePrompts = prompts
      .filter((p, index, arr) => arr.findIndex(x => x.title === p.title) === index)
      .slice(0, 25);

    console.log(`🎯 Final result: ${uniquePrompts.length} unique coding prompts`);
    return uniquePrompts;

  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    return [];
  }
}

function extractCodingPromptsFromContent(content, source) {
  const prompts = [];
  
  // Look for coding-related prompts using multiple patterns
  const lines = content.split('\n');
  let currentTitle = '';
  let currentContent = '';
  
  for (let i = 0; i < lines.length && prompts.length < 10; i++) {
    const line = lines[i].trim();
    
    // Look for headers or numbered items
    if (line.match(/^#+\s/) || line.match(/^\d+\.\s/) || line.match(/^[-*]\s/)) {
      // Save previous prompt if it was coding-related
      if (currentTitle && isCodingRelated(currentTitle + ' ' + currentContent)) {
        const prompt = createCodingPrompt(currentTitle, currentContent, source);
        if (prompt) prompts.push(prompt);
      }
      
      // Start new prompt
      currentTitle = line.replace(/^#+\s*|\d+\.\s*|[-*]\s*/, '').trim();
      currentContent = '';
    } else if (line && !line.startsWith('#')) {
      currentContent += ' ' + line;
    }
  }
  
  // Don't forget the last prompt
  if (currentTitle && isCodingRelated(currentTitle + ' ' + currentContent)) {
    const prompt = createCodingPrompt(currentTitle, currentContent, source);
    if (prompt) prompts.push(prompt);
  }

  return prompts;
}

function isCodingRelated(text) {
  const codingKeywords = [
    'code', 'programming', 'development', 'software', 'debug', 'function',
    'algorithm', 'api', 'database', 'framework', 'testing', 'review',
    'javascript', 'python', 'java', 'react', 'typescript', 'html', 'css',
    'interview', 'coding', 'developer', 'engineer', 'architecture'
  ];
  
  const lowerText = text.toLowerCase();
  return codingKeywords.some(keyword => lowerText.includes(keyword));
}

function createCodingPrompt(title, content, source) {
  const cleanTitle = title.replace(/[#*`]/g, '').trim();
  const cleanContent = content.replace(/[#*`]/g, '').replace(/\s+/g, ' ').trim();
  
  if (cleanTitle.length < 5 || cleanTitle.length > 200) return null;
  if (cleanContent.length < 20 || cleanContent.length > 1000) return null;
  
  return {
    id: crypto.randomUUID(),
    title: cleanTitle,
    description: cleanContent,
    category: categorizeCodingPrompt(cleanTitle + ' ' + cleanContent),
    tags: extractCodingTags(cleanTitle + ' ' + cleanContent),
    source: `github:${source}`,
    featured: true, // Mark as featured for the main app
    created_at: new Date().toISOString()
  };
}

function categorizeCodingPrompt(text) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('interview') || lowerText.includes('challenge')) return 'Coding Interview';
  if (lowerText.includes('review') || lowerText.includes('audit')) return 'Code Review'; 
  if (lowerText.includes('debug') || lowerText.includes('error')) return 'Debugging';
  if (lowerText.includes('test') || lowerText.includes('unit')) return 'Testing';
  if (lowerText.includes('architecture') || lowerText.includes('design')) return 'Software Architecture';
  if (lowerText.includes('api') || lowerText.includes('endpoint')) return 'API Development';
  if (lowerText.includes('database') || lowerText.includes('sql')) return 'Database';
  if (lowerText.includes('optimize') || lowerText.includes('performance')) return 'Code Optimization';
  
  return 'Programming';
}

function extractCodingTags(text) {
  const tags = new Set();
  const lowerText = text.toLowerCase();

  const languages = ['javascript', 'python', 'java', 'typescript', 'react', 'node', 'html', 'css', 'sql'];
  const concepts = ['algorithm', 'debugging', 'testing', 'api', 'database', 'interview', 'review'];
  
  [...languages, ...concepts].forEach(tag => {
    if (lowerText.includes(tag)) tags.add(tag);
  });

  return Array.from(tags).slice(0, 4);
}

// Main execution
async function main() {
  console.log('🎯 Target: Extract 20+ coding prompts from GitHub');
  
  const codingPrompts = await scrapeCodingPrompts();
  
  if (codingPrompts.length === 0) {
    console.log('❌ No coding prompts found');
    return;
  }
  
  // Save to file
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const outputFile = path.join(dataDir, 'coding-prompts.json');
  fs.writeFileSync(outputFile, JSON.stringify(codingPrompts, null, 2));
  
  console.log(`💾 Saved ${codingPrompts.length} coding prompts to coding-prompts.json`);
  
  // Show samples
  console.log('\n📋 Sample coding prompts:');
  codingPrompts.slice(0, 5).forEach((prompt, i) => {
    console.log(`${i + 1}. [${prompt.category}] ${prompt.title}`);
  });
  
  console.log('\n✅ Coding prompts scraping completed!');
  return codingPrompts;
}

main().catch(console.error);