import RedditScraper from './src/scrapers/reddit-scraper.js';
import fs from 'fs';
import path from 'path';

async function updatePromptsFromReddit() {
  console.log('=== REDDIT PROMPTS UPDATE ===');
  console.log(`Current date: ${new Date().toISOString().split('T')[0]}`);
  console.log('');
  
  const scraper = new RedditScraper();
  
  try {
    // Authenticate
    console.log('🔐 Authenticating with Reddit API...');
    const authSuccess = await scraper.authenticate();
    
    if (!authSuccess) {
      console.log('❌ Authentication failed, cannot update prompts');
      return;
    }
    
    console.log('✅ Authentication successful');
    console.log('');
    
    // Read current data
    const dataPath = path.join(process.cwd(), '../public/data.json');
    console.log('📖 Reading current data from:', dataPath);
    
    let currentData = [];
    try {
      const fileContent = fs.readFileSync(dataPath, 'utf8');
      currentData = JSON.parse(fileContent);
      console.log(`📊 Current data contains ${currentData.length} prompts`);
    } catch (error) {
      console.log('⚠️ Could not read current data file:', error.message);
    }
    
    // Get the latest creation date from existing data
    const latestDate = currentData
      .map(p => p.created_date)
      .filter(date => date)
      .sort()
      .reverse()[0] || '2025-09-11';
    
    console.log(`📅 Latest prompt date in current data: ${latestDate}`);
    console.log('');
    
    // Scrape for new prompts
    console.log('🚀 Scraping Reddit for new prompts...');
    const newPrompts = [];
    
    // Test with a few subreddits first
    const subredditsToTest = ['ChatGPT', 'PromptEngineering', 'ArtificialInteligence'];
    
    for (const subreddit of subredditsToTest) {
      console.log(`📡 Scraping r/${subreddit}...`);
      
      try {
        const subredditPrompts = await scraper.scrapeSubreddit(subreddit, 'hot', 'week');
        
        // Filter for recent prompts only
        const recentPrompts = subredditPrompts.filter(prompt => {
          const promptDate = prompt.created_at ? prompt.created_at.toISOString().split('T')[0] : null;
          return promptDate && promptDate > latestDate;
        });
        
        console.log(`✅ Found ${recentPrompts.length} new prompts in r/${subreddit}`);
        newPrompts.push(...recentPrompts);
        
        // Add delay between subreddits
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (error) {
        console.error(`❌ Error scraping r/${subreddit}:`, error.message);
      }
    }
    
    console.log('');
    console.log('=== SCRAPING RESULTS ===');
    console.log(`Total new prompts found: ${newPrompts.length}`);
    
    if (newPrompts.length > 0) {
      console.log('');
      console.log('📝 New prompts preview:');
      newPrompts.slice(0, 5).forEach((prompt, index) => {
        console.log(`${index + 1}. ${prompt.title}`);
        console.log(`   Source: ${prompt.source} (r/${prompt.subreddit})`);
        console.log(`   Score: ${prompt.score} | Author: ${prompt.author}`);
        console.log(`   Created: ${prompt.created_at}`);
        console.log('');
      });
      
      // Convert new prompts to the format used in data.json
      const formattedNewPrompts = newPrompts.map((prompt, index) => {
        const nextId = currentData.length > 0 ? Math.max(...currentData.map(p => p.id || 0)) + index + 1 : index + 1;
        
        return {
          id: nextId,
          title: prompt.title,
          description: `Scraped from Reddit r/${prompt.subreddit}`,
          prompt_text: prompt.prompt,
          category: prompt.category || "General",
          tags: [
            ...(prompt.subreddit ? [prompt.subreddit] : []),
            "prompt"
          ],
          difficulty: "Intermediate", 
          rating: Math.min(5, Math.max(1, (prompt.score || 0) / 10 + 3)),
          use_cases: [prompt.category || "General"],
          source: `Reddit - r/${prompt.subreddit}`,
          created_date: new Date().toISOString().split('T')[0]
        };
      });
      
      console.log('=== UPDATE STATUS ===');
      console.log(`✅ Found ${formattedNewPrompts.length} new prompts to add`);
      console.log('📊 Current data size:', currentData.length, 'prompts');
      console.log('📊 New data size would be:', currentData.length + formattedNewPrompts.length, 'prompts');
      
      // Show what would be added
      console.log('');
      console.log('🆕 Prompts that would be added:');
      formattedNewPrompts.forEach((prompt, index) => {
        console.log(`${index + 1}. ${prompt.title} (Category: ${prompt.category})`);
      });
      
    } else {
      console.log('ℹ️ No new prompts found since last update');
      console.log('✅ Reddit API is working but no fresh content available');
    }
    
  } catch (error) {
    console.error('❌ Update failed:', error.message);
    console.error(error.stack);
  }
}

updatePromptsFromReddit();