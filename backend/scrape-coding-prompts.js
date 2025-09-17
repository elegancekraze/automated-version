/**
 * Specialized GitHub Scraper for Coding Prompts
 * Targets programming, development, and coding-related AI prompts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

class CodingPromptsGitHubScraper {
  constructor() {
    this.apiKey = process.env.GITHUB_TOKEN;
    this.baseURL = 'https://api.github.com';
    this.rateLimitDelay = 1000; // 1 second between requests
    this.maxPrompts = 50; // Target more than 20
    this.prompts = [];
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async makeRequest(url) {
    try {
      console.log(`🔍 Fetching: ${url}`);
      const response = await fetch(url, {
        headers: {
          'Authorization': `token ${this.apiKey}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'CodingPromptsBot/1.0'
        }
      });

      if (!response.ok) {
        console.log(`❌ Request failed: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      const remaining = response.headers.get('X-RateLimit-Remaining');
      console.log(`✅ Success. Rate limit remaining: ${remaining}`);
      
      return data;
    } catch (error) {
      console.error(`❌ Request error: ${error.message}`);
      return null;
    }
  }

  // Search for coding-specific repositories
  getCodingSearchQueries() {
    return [
      'coding prompts language:markdown',
      'programming chatgpt prompts',
      'developer ai prompts language:text',
      'code review prompts',
      'software engineering prompts',
      'programming interview prompts',
      'coding assistant prompts',
      'development workflow prompts',
      'debugging prompts ai',
      'code generation prompts'
    ];
  }

  async searchRepositories(query) {
    const url = `${this.baseURL}/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=10`;
    return await this.makeRequest(url);
  }

  async getFileContent(owner, repo, path) {
    const url = `${this.baseURL}/repos/${owner}/${repo}/contents/${path}`;
    const response = await this.makeRequest(url);
    
    if (response && response.content) {
      return Buffer.from(response.content, 'base64').toString('utf-8');
    }
    return null;
  }

  extractCodingPrompts(content, repoName) {
    const prompts = [];
    
    // Patterns for extracting coding prompts
    const patterns = [
      // Markdown headers followed by content
      /#{1,3}\s*([^#\n]+)\n([^#]+?)(?=\n#{1,3}|$)/g,
      // Code blocks with descriptions
      /```[\w]*\n([^`]+)\n```\s*([^\n]+)/g,
      // Numbered lists
      /^\d+\.\s*([^\n]+)\n([^0-9\n][^\n]*(?:\n[^\n]+)*?)(?=\n\d+\.|$)/gm,
      // Bullet points
      /^[-*]\s*([^\n]+)\n([^-*\n][^\n]*(?:\n[^\n]+)*?)(?=\n[-*]|$)/gm
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null && prompts.length < 10) {
        const title = match[1]?.trim();
        const description = match[2]?.trim();
        
        if (this.isCodingRelated(title + ' ' + description)) {
          const prompt = this.createPrompt(title, description, repoName);
          if (prompt) {
            prompts.push(prompt);
          }
        }
      }
    });

    return prompts;
  }

  isCodingRelated(text) {
    const codingKeywords = [
      'code', 'programming', 'development', 'software', 'debug', 'function',
      'algorithm', 'api', 'database', 'framework', 'library', 'testing',
      'review', 'refactor', 'optimize', 'architecture', 'design pattern',
      'javascript', 'python', 'java', 'react', 'node', 'typescript',
      'html', 'css', 'sql', 'git', 'docker', 'aws', 'deployment',
      'backend', 'frontend', 'fullstack', 'web development', 'mobile',
      'interview', 'coding challenge', 'leetcode', 'data structure',
      'variable', 'class', 'method', 'syntax', 'compiler', 'interpreter'
    ];

    const lowerText = text.toLowerCase();
    return codingKeywords.some(keyword => lowerText.includes(keyword));
  }

  createPrompt(title, description, source) {
    // Clean up and validate
    if (!title || title.length < 5 || title.length > 200) return null;
    if (!description || description.length < 20 || description.length > 2000) return null;

    // Remove markdown formatting
    const cleanTitle = title.replace(/[#*`]/g, '').trim();
    const cleanDescription = description.replace(/[#*`]/g, '').replace(/\n+/g, ' ').trim();

    return {
      id: crypto.randomUUID(),
      title: cleanTitle,
      description: cleanDescription,
      category: this.categorizeCodingPrompt(cleanTitle + ' ' + cleanDescription),
      tags: this.extractCodingTags(cleanTitle + ' ' + cleanDescription),
      source: `github:${source}`,
      quality_score: this.calculateQualityScore(cleanTitle, cleanDescription),
      created_at: new Date().toISOString()
    };
  }

  categorizeCodingPrompt(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('review') || lowerText.includes('audit')) return 'Code Review';
    if (lowerText.includes('debug') || lowerText.includes('error') || lowerText.includes('bug')) return 'Debugging';
    if (lowerText.includes('test') || lowerText.includes('unit') || lowerText.includes('integration')) return 'Testing';
    if (lowerText.includes('architecture') || lowerText.includes('design') || lowerText.includes('pattern')) return 'Architecture';
    if (lowerText.includes('interview') || lowerText.includes('challenge') || lowerText.includes('leetcode')) return 'Interview';
    if (lowerText.includes('optimize') || lowerText.includes('performance') || lowerText.includes('refactor')) return 'Optimization';
    if (lowerText.includes('document') || lowerText.includes('comment') || lowerText.includes('readme')) return 'Documentation';
    if (lowerText.includes('api') || lowerText.includes('endpoint') || lowerText.includes('service')) return 'API Development';
    if (lowerText.includes('database') || lowerText.includes('sql') || lowerText.includes('query')) return 'Database';
    if (lowerText.includes('deploy') || lowerText.includes('ci/cd') || lowerText.includes('docker')) return 'DevOps';
    
    return 'Development';
  }

  extractCodingTags(text) {
    const tags = new Set();
    const lowerText = text.toLowerCase();

    // Programming languages
    const languages = ['javascript', 'python', 'java', 'typescript', 'react', 'node', 'html', 'css', 'sql'];
    languages.forEach(lang => {
      if (lowerText.includes(lang)) tags.add(lang);
    });

    // Common coding concepts
    const concepts = ['algorithm', 'debugging', 'testing', 'architecture', 'api', 'database', 'optimization'];
    concepts.forEach(concept => {
      if (lowerText.includes(concept)) tags.add(concept);
    });

    return Array.from(tags).slice(0, 5);
  }

  calculateQualityScore(title, description) {
    let score = 50;
    
    // Length bonuses
    if (description.length > 100) score += 10;
    if (description.length > 200) score += 10;
    
    // Coding-specific bonuses
    if (title.includes('How to') || title.includes('Guide')) score += 15;
    if (description.includes('example') || description.includes('template')) score += 10;
    if (description.includes('best practice')) score += 15;
    
    return Math.min(score, 100);
  }

  async scrapeRepository(repo) {
    console.log(`📁 Processing repo: ${repo.full_name}`);
    
    const files = ['README.md', 'README.txt', 'prompts.md', 'PROMPTS.md', 'coding-prompts.md'];
    
    for (const fileName of files) {
      await this.sleep(this.rateLimitDelay);
      
      const content = await this.getFileContent(repo.owner.login, repo.name, fileName);
      if (content) {
        const extracted = this.extractCodingPrompts(content, repo.full_name);
        console.log(`✅ Extracted ${extracted.length} coding prompts from ${fileName}`);
        this.prompts.push(...extracted);
        
        if (this.prompts.length >= this.maxPrompts) {
          console.log(`🎯 Reached target of ${this.maxPrompts} coding prompts`);
          return;
        }
      }
    }
  }

  async scrapeAll() {
    console.log('🚀 Starting specialized coding prompts scraping...');
    console.log(`🎯 Target: At least 20 high-quality coding prompts`);

    const queries = this.getCodingSearchQueries();
    
    for (const query of queries) {
      if (this.prompts.length >= this.maxPrompts) break;
      
      console.log(`🔍 Searching for: ${query}`);
      await this.sleep(this.rateLimitDelay);
      
      const searchResults = await this.searchRepositories(query);
      if (!searchResults || !searchResults.items) continue;

      for (const repo of searchResults.items.slice(0, 3)) { // Top 3 repos per query
        if (this.prompts.length >= this.maxPrompts) break;
        await this.scrapeRepository(repo);
      }
    }

    // Filter for quality and uniqueness
    const highQualityPrompts = this.prompts
      .filter(p => p.quality_score >= 70)
      .filter((p, index, arr) => arr.findIndex(x => x.title === p.title) === index)
      .slice(0, this.maxPrompts);

    console.log(`✅ Coding Scraper: Found ${this.prompts.length} prompts, kept ${highQualityPrompts.length} high-quality ones`);
    return highQualityPrompts;
  }
}

// Main execution
async function main() {
  try {
    const scraper = new CodingPromptsGitHubScraper();
    const codingPrompts = await scraper.scrapeAll();

    // Save to file
    const outputFile = path.join(__dirname, 'data', 'coding-prompts.json');
    fs.writeFileSync(outputFile, JSON.stringify(codingPrompts, null, 2));
    
    console.log(`💾 Saved ${codingPrompts.length} coding prompts to coding-prompts.json`);
    
    // Show sample
    console.log('\n📋 Sample coding prompts:');
    codingPrompts.slice(0, 5).forEach((prompt, i) => {
      console.log(`${i + 1}. [${prompt.category}] ${prompt.title}`);
    });

    return codingPrompts;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return [];
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default CodingPromptsGitHubScraper;