#!/usr/bin/env node

/**
 * Monitor automation progress
 */

import fs from 'fs/promises';
import https from 'https';

async function checkCurrentData() {
  try {
    const data = JSON.parse(await fs.readFile('./public/data.json', 'utf8'));
    return {
      total: data.total_prompts || data.length || 0,
      generated_at: data.generated_at,
      latest: data.prompts?.[0]?.title?.substring(0, 60) || 'N/A'
    };
  } catch (error) {
    return { total: 0, generated_at: 'Unknown', latest: 'None' };
  }
}

async function checkGitHubStatus() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.github.com',
      path: '/repos/elegancekraze/automated-version/actions/runs?per_page=1',
      method: 'GET',
      headers: {
        'User-Agent': 'AutomationMonitor/1.0',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const runs = JSON.parse(data);
          if (runs.workflow_runs && runs.workflow_runs[0]) {
            const latest = runs.workflow_runs[0];
            resolve({
              status: latest.status,
              conclusion: latest.conclusion,
              created_at: latest.created_at
            });
          } else {
            resolve({ status: 'unknown', conclusion: null, created_at: null });
          }
        } catch (e) {
          resolve({ status: 'error', conclusion: null, created_at: null });
        }
      });
    });

    req.on('error', () => resolve({ status: 'error', conclusion: null, created_at: null }));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ status: 'timeout', conclusion: null, created_at: null });
    });
    req.end();
  });
}

async function monitor() {
  console.log('🔍 Automation Monitor Started');
  console.log('============================');
  
  const initialData = await checkCurrentData();
  console.log(`📊 Initial state: ${initialData.total} prompts`);
  console.log(`📅 Last generated: ${initialData.generated_at}`);
  console.log(`📝 Latest: ${initialData.latest}`);
  console.log('');
  
  console.log('⏳ Monitoring for changes...');
  console.log('💡 Trigger the workflow manually in GitHub Actions');
  console.log('🌐 URL: https://github.com/elegancekraze/automated-version/actions');
  console.log('');
  
  let checkCount = 0;
  const maxChecks = 30; // 15 minutes max
  
  const interval = setInterval(async () => {
    checkCount++;
    
    const currentData = await checkCurrentData();
    const githubStatus = await checkGitHubStatus();
    
    const changed = currentData.total !== initialData.total || 
                   currentData.generated_at !== initialData.generated_at;
    
    console.log(`📊 Check ${checkCount}: ${currentData.total} prompts | GitHub: ${githubStatus.status} | ${new Date().toLocaleTimeString()}`);
    
    if (changed) {
      console.log('');
      console.log('🎉 AUTOMATION SUCCESS DETECTED!');
      console.log(`📈 Prompts: ${initialData.total} → ${currentData.total} (+${currentData.total - initialData.total})`);
      console.log(`🕒 New timestamp: ${currentData.generated_at}`);
      console.log(`📝 New latest: ${currentData.latest}`);
      
      clearInterval(interval);
      return;
    }
    
    if (githubStatus.conclusion === 'success') {
      console.log('✅ GitHub Actions completed successfully!');
    } else if (githubStatus.conclusion === 'failure') {
      console.log('❌ GitHub Actions failed - check the logs');
      clearInterval(interval);
      return;
    }
    
    if (checkCount >= maxChecks) {
      console.log('⏰ Monitor timeout - check GitHub Actions manually');
      clearInterval(interval);
    }
  }, 30000); // Check every 30 seconds
}

monitor().catch(console.error);