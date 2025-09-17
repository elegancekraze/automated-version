import RedditScraper from './src/scrapers/reddit-scraper.js';
import fs from 'fs';
import path from 'path';

// Utility function to generate SEO-friendly slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 60); // Limit length for SEO
}

// Enhanced duplicate detection
function findDuplicates(newPrompts, existingPrompts) {
  const existingTexts = new Set();
  const existingTitles = new Set();
  const existingSlugs = new Set();
  
  // Build sets of existing content for comparison
  existingPrompts.forEach(prompt => {
    if (prompt.prompt_text) {
      existingTexts.add(prompt.prompt_text.substring(0, 200).toLowerCase());
    }
    if (prompt.title) {
      existingTitles.add(prompt.title.toLowerCase());
    }
    if (prompt.slug) {
      existingSlugs.add(prompt.slug);
    }
  });
  
  return newPrompts.filter(newPrompt => {
    const textKey = newPrompt.prompt_text?.substring(0, 200).toLowerCase() || '';
    const titleKey = newPrompt.title?.toLowerCase() || '';
    
    // Check for duplicates
    const isDuplicate = existingTexts.has(textKey) || existingTitles.has(titleKey);
    
    return !isDuplicate;
  });
}

// Generate unique slug (handle conflicts)
function generateUniqueSlug(title, existingSlugs) {
  let baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  existingSlugs.add(slug);
  return slug;
}

async function updatePromptsDatabase() {
  console.log('🚀 SMART PROMPTS DATABASE UPDATE');
  console.log('=====================================');
  console.log(`📅 Date: ${new Date().toISOString().split('T')[0]}`);
  console.log('🎯 Goal: Add new prompts, preserve all existing, no duplicates');
  console.log('');
  
  const scraper = new RedditScraper();
  
  try {
    // 1. Authenticate with Reddit
    console.log('🔐 Authenticating with Reddit API...');
    const authSuccess = await scraper.authenticate();
    
    if (!authSuccess) {
      throw new Error('Reddit authentication failed');
    }
    console.log('✅ Reddit authentication successful');
    
    // 2. Load existing data
    const dataPath = path.join(process.cwd(), '../public/data.json');
    console.log('📖 Loading existing database...');
    
    let existingData = [];
    try {
      const fileContent = fs.readFileSync(dataPath, 'utf8');
      existingData = JSON.parse(fileContent);
      console.log(`📊 Current database: ${existingData.length} prompts`);
    } catch (error) {
      console.log('⚠️ No existing database found, creating new one');
    }
    
    // 3. Create sets for existing slugs
    const existingSlugs = new Set(existingData.map(p => p.slug).filter(Boolean));
    
    // 4. Add slugs to existing prompts that don't have them
    console.log('🔧 Adding SEO URLs to existing prompts...');
    let updatedExisting = 0;
    existingData.forEach(prompt => {
      if (!prompt.slug) {
        prompt.slug = generateUniqueSlug(prompt.title, existingSlugs);
        updatedExisting++;
      }
    });
    
    if (updatedExisting > 0) {
      console.log(`✅ Added SEO URLs to ${updatedExisting} existing prompts`);
    }
    
    // 5. Scrape new prompts
    console.log('🕷️ Scraping new prompts from Reddit...');
    const newScrapedPrompts = [];
    
    // Scrape from multiple subreddits
    const subreddits = ['ChatGPT', 'PromptEngineering', 'ArtificialInteligence', 'OpenAI'];
    
    for (const subreddit of subreddits) {
      console.log(`📡 Scraping r/${subreddit}...`);
      
      try {
        const subredditPrompts = await scraper.scrapeSubreddit(subreddit, 'hot', 'week');
        newScrapedPrompts.push(...subredditPrompts);
        console.log(`✅ Found ${subredditPrompts.length} prompts in r/${subreddit}`);
        
        // Respectful delay
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (error) {
        console.error(`❌ Error scraping r/${subreddit}:`, error.message);
      }
    }
    
    console.log(`📊 Total scraped prompts: ${newScrapedPrompts.length}`);
    
    // 6. Filter out duplicates
    console.log('🔍 Checking for duplicates...');
    const uniqueNewPrompts = findDuplicates(newScrapedPrompts, existingData);
    console.log(`✅ Found ${uniqueNewPrompts.length} truly new prompts (${newScrapedPrompts.length - uniqueNewPrompts.length} duplicates filtered out)`);
    
    if (uniqueNewPrompts.length === 0) {
      console.log('ℹ️ No new unique prompts found. Database is up to date!');
      
      // Still save existing data with updated slugs if any were added
      if (updatedExisting > 0) {
        fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2));
        console.log('💾 Saved SEO URL updates to database');
      }
      
      return;
    }
    
    // 7. Format new prompts
    console.log('🎨 Formatting new prompts...');
    const nextId = existingData.length > 0 ? Math.max(...existingData.map(p => p.id || 0)) + 1 : 1;
    
    const formattedNewPrompts = uniqueNewPrompts.map((prompt, index) => {
      const slug = generateUniqueSlug(prompt.title, existingSlugs);
      
      return {
        id: nextId + index,
        title: prompt.title,
        slug: slug,
        description: `Scraped from Reddit r/${prompt.subreddit}`,
        prompt_text: prompt.prompt,
        category: prompt.category || "General",
        tags: [
          ...(prompt.subreddit ? [prompt.subreddit.toLowerCase()] : []),
          "prompt",
          ...(prompt.tags || [])
        ].filter((tag, i, arr) => arr.indexOf(tag) === i), // Remove duplicates
        difficulty: "Intermediate", 
        rating: Math.min(5, Math.max(1, Math.round((prompt.score || 0) / 10 + 3.2))),
        use_cases: [prompt.category || "General"],
        source: `Reddit - r/${prompt.subreddit}`,
        source_url: prompt.source_url || '',
        author: prompt.author || '',
        reddit_score: prompt.score || 0,
        created_date: new Date().toISOString().split('T')[0],
        scraped_date: new Date().toISOString()
      };
    });
    
    // 8. Merge with existing data (preserve ALL existing prompts)
    const finalData = [...existingData, ...formattedNewPrompts];
    
    // 9. Sort by creation date (newest first)
    finalData.sort((a, b) => {
      const dateA = new Date(a.created_date || '2025-01-01');
      const dateB = new Date(b.created_date || '2025-01-01');
      return dateB.getTime() - dateA.getTime();
    });
    
    // 10. Save updated database
    console.log('💾 Saving updated database...');
    fs.writeFileSync(dataPath, JSON.stringify(finalData, null, 2));
    
    // 11. Create sitemap with individual prompt URLs
    console.log('🗺️ Generating sitemap with prompt URLs...');
    const sitemapPath = path.join(process.cwd(), '../public/sitemap.xml');
    const baseUrl = 'https://ischatgptfree.netlify.app';
    
    const sitemapEntries = finalData.map(prompt => `
  <url>
    <loc>${baseUrl}/prompt/${prompt.slug}</loc>
    <lastmod>${prompt.created_date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>${sitemapEntries}
</urlset>`;
    
    fs.writeFileSync(sitemapPath, sitemap);
    
    // 12. Final report
    console.log('');
    console.log('🎉 DATABASE UPDATE COMPLETE!');
    console.log('============================');
    console.log(`📊 Total prompts in database: ${finalData.length}`);
    console.log(`🆕 New prompts added: ${formattedNewPrompts.length}`);
    console.log(`🔗 SEO URLs updated: ${updatedExisting}`);
    console.log(`🗺️ Sitemap entries: ${finalData.length + 1}`);
    console.log('');
    
    if (formattedNewPrompts.length > 0) {
      console.log('📝 New prompts added:');
      formattedNewPrompts.slice(0, 5).forEach((prompt, index) => {
        console.log(`${index + 1}. ${prompt.title}`);
        console.log(`   URL: ${baseUrl}/prompt/${prompt.slug}`);
        console.log(`   Category: ${prompt.category}`);
        console.log(`   Source: ${prompt.source}`);
        console.log('');
      });
      
      if (formattedNewPrompts.length > 5) {
        console.log(`   ... and ${formattedNewPrompts.length - 5} more prompts`);
      }
    }
    
    console.log('✅ All prompts preserved, no deletions made');
    console.log('✅ All prompts have unique SEO-friendly URLs');
    console.log('✅ Duplicates filtered out automatically');
    console.log('✅ Sitemap updated for better SEO');
    
  } catch (error) {
    console.error('❌ Update failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

updatePromptsDatabase();