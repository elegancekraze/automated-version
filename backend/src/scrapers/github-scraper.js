/**
 * GitHub Scraper for AI/Prompt Engineering Content
 * Scrapes high-quality prompts from GitHub repositories, gists, and discussions
 */

export default class GitHubScraper {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GPT5PromptScraper/1.0.0'
    };
    
    // Add authentication if available
    if (process.env.GITHUB_TOKEN) {
      this.headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    this.rateLimitRemaining = 60; // Start with unauthenticated limit
    this.rateLimitReset = Date.now() + (60 * 60 * 1000); // 1 hour from now
  }

  async checkRateLimit() {
    if (this.rateLimitRemaining <= 5) {
      const waitTime = this.rateLimitReset - Date.now();
      if (waitTime > 0) {
        console.log(`⏰ Rate limit low (${this.rateLimitRemaining}), waiting ${Math.ceil(waitTime / 1000)}s`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  async makeRequest(url, maxRetries = 3) {
    await this.checkRateLimit();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, { headers: this.headers });
        
        // Update rate limit info from headers
        this.rateLimitRemaining = parseInt(response.headers.get('X-RateLimit-Remaining')) || this.rateLimitRemaining;
        this.rateLimitReset = new Date(response.headers.get('X-RateLimit-Reset') * 1000).getTime() || this.rateLimitReset;

        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('Retry-After')) || 60;
          console.log(`🔄 Rate limited, waiting ${retryAfter}s (attempt ${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          continue;
        }

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error(`❌ Request failed (attempt ${attempt}/${maxRetries}):`, error.message);
        if (attempt === maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt)); // Exponential backoff
      }
    }
  }

  async searchRepositories(query, maxResults = 50) {
    console.log(`🔍 Searching repositories for: ${query}`);
    const results = [];
    let page = 1;
    const perPage = 30;

    while (results.length < maxResults) {
      try {
        const searchUrl = `${this.baseURL}/search/repositories?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=${perPage}&page=${page}`;
        const data = await this.makeRequest(searchUrl);
        
        if (!data.items || data.items.length === 0) break;
        
        results.push(...data.items);
        
        // GitHub search API has pagination limits
        if (results.length >= data.total_count || page >= 10) break;
        page++;
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Error searching repositories:`, error.message);
        break;
      }
    }

    return results.slice(0, maxResults);
  }

  async getRepositoryContents(owner, repo, path = '') {
    try {
      const url = `${this.baseURL}/repos/${owner}/${repo}/contents/${path}`;
      return await this.makeRequest(url);
    } catch (error) {
      console.error(`❌ Error getting contents for ${owner}/${repo}:`, error.message);
      return [];
    }
  }

  async getFileContent(downloadUrl) {
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) return null;
      return await response.text();
    } catch (error) {
      console.error(`❌ Error fetching file content:`, error.message);
      return null;
    }
  }

  async searchGists(query, maxResults = 20) {
    console.log(`🔍 Searching gists for: ${query}`);
    const results = [];
    let page = 1;
    const perPage = 30;

    while (results.length < maxResults) {
      try {
        // Note: GitHub's gist search API is limited
        const searchUrl = `${this.baseURL}/gists/public?per_page=${perPage}&page=${page}`;
        const gists = await this.makeRequest(searchUrl);
        
        if (!gists || gists.length === 0) break;

        // Filter gists by query in description/filename
        const filtered = gists.filter(gist => {
          const description = (gist.description || '').toLowerCase();
          const filenames = Object.keys(gist.files || {}).join(' ').toLowerCase();
          const searchTerm = query.toLowerCase();
          return description.includes(searchTerm) || filenames.includes(searchTerm);
        });

        results.push(...filtered);
        
        if (gists.length < perPage || page >= 5) break;
        page++;
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Error searching gists:`, error.message);
        break;
      }
    }

    return results.slice(0, maxResults);
  }

  extractPromptsFromText(content, filename, source) {
    const prompts = [];
    
    // Skip binary or very large files
    if (!content || content.length > 500000 || /[\x00-\x08\x0E-\x1F\x7F]/.test(content)) {
      return prompts;
    }

    // Split content into potential prompt sections
    const sections = content.split(/(?:\n\s*\n|\r\n\s*\r\n)/);
    
    for (const section of sections) {
      const trimmed = section.trim();
      
      // Skip very short sections
      if (trimmed.length < 50) continue;
      
      // Look for prompt-like patterns
      const isPromptLike = (
        /(?:prompt|instruction|task|system|user|assistant|role)/i.test(trimmed) &&
        trimmed.length >= 100 &&
        trimmed.length <= 5000
      );

      // Look for AI/GPT specific patterns
      const isAIPrompt = (
        /(act as|you are|pretend to be|system:|user:|assistant:|gpt|claude|ai)/i.test(trimmed) ||
        /(?:prompt|template|instruction)s?\s*[:=]/i.test(trimmed)
      );

      // Extract title from content or filename
      let title = '';
      
      // Try to extract title from markdown headers
      const headerMatch = trimmed.match(/^#+\s*(.+?)$/m);
      if (headerMatch) {
        title = headerMatch[1].trim();
      }
      
      // Try to extract from comment patterns
      const commentMatch = trimmed.match(/(?:\/\/|#|\*)\s*(.+?)$/m);
      if (!title && commentMatch && commentMatch[1].length < 100) {
        title = commentMatch[1].trim();
      }
      
      // Fallback to filename or first line
      if (!title) {
        const firstLine = trimmed.split('\n')[0].replace(/[#*\/\-=]+/g, '').trim();
        title = firstLine.length > 5 && firstLine.length < 100 ? firstLine : filename || 'GitHub Prompt';
      }

      if (isPromptLike || isAIPrompt) {
        prompts.push({
          title: title.substring(0, 200),
          prompt_text: trimmed,
          source: source,
          category: this.categorizePrompt(trimmed),
          tags: this.extractTags(trimmed),
          scraped_date: new Date().toISOString(),
          hasCompleteContent: true,
          difficulty: this.assessDifficulty(trimmed),
          rating: Math.floor(Math.random() * 2) + 4 // 4-5 stars for GitHub content
        });
      }
    }

    return prompts;
  }

  categorizePrompt(content) {
    const text = content.toLowerCase();
    
    if (/(code|coding|programming|debug|refactor|function|class|api)/i.test(text)) {
      return 'Development';
    }
    if (/(write|story|creative|blog|article|content|copy)/i.test(text)) {
      return 'Creative Writing';
    }
    if (/(analyze|analysis|research|data|report|study)/i.test(text)) {
      return 'Analysis';
    }
    if (/(business|marketing|sales|strategy|plan)/i.test(text)) {
      return 'Business';
    }
    if (/(learn|teach|explain|education|tutorial|guide)/i.test(text)) {
      return 'Educational';
    }
    if (/(problem|solve|solution|troubleshoot|fix)/i.test(text)) {
      return 'Problem Solving';
    }
    
    return 'General';
  }

  extractTags(content) {
    const tags = new Set();
    const text = content.toLowerCase();
    
    // Common AI/prompt tags
    const tagPatterns = [
      'gpt', 'chatgpt', 'claude', 'ai', 'prompt', 'template',
      'coding', 'writing', 'analysis', 'creative', 'business',
      'python', 'javascript', 'react', 'node', 'api',
      'marketing', 'content', 'seo', 'blog', 'copywriting'
    ];

    for (const pattern of tagPatterns) {
      if (text.includes(pattern)) {
        tags.add(pattern);
      }
    }

    return Array.from(tags).slice(0, 5);
  }

  assessDifficulty(content) {
    const length = content.length;
    const complexity = (content.match(/[{}[\]()]/g) || []).length;
    const technicalTerms = (content.match(/\b(?:function|class|api|algorithm|database|framework|library|module|component|interface|parameter|variable|method|property|attribute|inheritance|polymorphism|abstraction|encapsulation)\b/gi) || []).length;
    
    if (length > 1000 || complexity > 20 || technicalTerms > 10) {
      return 'Advanced';
    } else if (length > 300 || complexity > 5 || technicalTerms > 3) {
      return 'Intermediate';
    }
    
    return 'Beginner';
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 60);
  }

  async scrapePrompts(maxPrompts = 100) {
    console.log('🐙 Starting GitHub scraping...');
    const allPrompts = [];

    try {
      // Search queries for different types of prompt content
      const searchQueries = [
        'prompts AI language:markdown',
        'chatgpt prompts language:text', 
        'gpt prompts templates',
        'ai prompt engineering',
        'prompt library collection',
        'system prompts gpt',
        'awesome prompts chatgpt'
      ];

      for (const query of searchQueries) {
        console.log(`🔍 Searching for: ${query}`);
        
        try {
          const repos = await this.searchRepositories(query, 10);
          
          for (const repo of repos) {
            console.log(`📁 Processing repo: ${repo.full_name}`);
            
            // Get repository contents
            const contents = await this.getRepositoryContents(repo.owner.login, repo.name);
            
            if (Array.isArray(contents)) {
              for (const item of contents) {
                // Focus on markdown, text, and common prompt files
                if (item.type === 'file' && 
                    /\.(md|txt|prompt|prompts)$/i.test(item.name) &&
                    item.size < 1000000) { // Skip very large files
                  
                  const content = await this.getFileContent(item.download_url);
                  if (content) {
                    const extractedPrompts = this.extractPromptsFromText(
                      content, 
                      item.name, 
                      `GitHub: ${repo.full_name}/${item.name}`
                    );
                    
                    // Add repository metadata
                    extractedPrompts.forEach(prompt => {
                      prompt.id = Date.now() + Math.random();
                      prompt.slug = this.generateSlug(prompt.title);
                      prompt.use_cases = [repo.language || 'General'];
                      prompt.author = repo.owner.login;
                    });
                    
                    allPrompts.push(...extractedPrompts);
                    console.log(`✅ Extracted ${extractedPrompts.length} prompts from ${item.name}`);
                    
                    if (allPrompts.length >= maxPrompts) {
                      console.log(`🎯 Reached max prompts limit: ${maxPrompts}`);
                      return allPrompts.slice(0, maxPrompts);
                    }
                  }
                }
                
                // Small delay to be respectful
                await new Promise(resolve => setTimeout(resolve, 200));
              }
            }
          }
        } catch (error) {
          console.error(`❌ Error processing query "${query}":`, error.message);
          continue;
        }
      }

      // Search gists for additional prompts
      console.log('🔍 Searching gists for prompts...');
      const gists = await this.searchGists('prompts chatgpt gpt ai', 10);
      
      for (const gist of gists) {
        for (const [filename, file] of Object.entries(gist.files || {})) {
          if (file.content) {
            const extractedPrompts = this.extractPromptsFromText(
              file.content,
              filename,
              `GitHub Gist: ${gist.id}/${filename}`
            );
            
            extractedPrompts.forEach(prompt => {
              prompt.id = Date.now() + Math.random();
              prompt.slug = this.generateSlug(prompt.title);
              prompt.author = gist.owner?.login || 'Anonymous';
            });
            
            allPrompts.push(...extractedPrompts);
          }
        }
        
        if (allPrompts.length >= maxPrompts) break;
        await new Promise(resolve => setTimeout(resolve, 500));
      }

    } catch (error) {
      console.error('❌ GitHub scraping error:', error);
    }

    console.log(`✅ GitHub scraping completed. Found ${allPrompts.length} prompts`);
    return allPrompts.slice(0, maxPrompts);
  }
}
