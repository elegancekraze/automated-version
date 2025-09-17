import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 Environment check:');
console.log('GITHUB_TOKEN exists:', !!process.env.GITHUB_TOKEN);
console.log('GITHUB_TOKEN length:', process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.length : 0);

// Test basic functionality
async function test() {
  try {
    console.log('🚀 Starting test...');
    
    const response = await fetch('https://api.github.com/search/repositories?q=coding+prompts&per_page=1', {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'CodingPromptsBot/1.0'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Rate limit remaining:', response.headers.get('X-RateLimit-Remaining'));
    
    if (response.ok) {
      const data = await response.json();
      console.log('Found repositories:', data.total_count);
      console.log('First repo:', data.items?.[0]?.full_name);
      console.log('✅ GitHub API is working!');
    } else {
      console.log('❌ GitHub API error:', response.statusText);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

test();