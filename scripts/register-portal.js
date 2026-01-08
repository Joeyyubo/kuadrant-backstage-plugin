#!/usr/bin/env node

/**
 * Script to register portal locations in Backstage catalog
 * 
 * Usage:
 *   node register-portal.js <repo-url>
 *   node register-portal.js https://github.com/owner/repo
 * 
 * Or with multiple repos:
 *   node register-portal.js https://github.com/owner/repo1 https://github.com/owner/repo2
 */

const http = require('http');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:7008';

function registerLocation(repoUrl) {
  return new Promise((resolve, reject) => {
    // Convert repo URL to catalog-info.yaml URL
    let catalogUrl;
    
    if (repoUrl.includes('github.com')) {
      // Remove trailing slash and .git if present
      repoUrl = repoUrl.replace(/\/$/, '').replace(/\.git$/, '');
      
      // Extract owner and repo
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (match) {
        const [, owner, repo] = match;
        catalogUrl = `https://github.com/${owner}/${repo}/blob/main/catalog-info.yaml`;
      } else {
        reject(new Error(`Invalid GitHub URL format: ${repoUrl}`));
        return;
      }
    } else {
      reject(new Error(`Unsupported URL format. Only GitHub URLs are supported: ${repoUrl}`));
      return;
    }

    const url = new URL(`${BACKEND_URL}/api/catalog/locations`);
    
    const postData = JSON.stringify({
      type: 'url',
      target: catalogUrl,
    });

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 201) {
          console.log(`✅ Successfully registered: ${catalogUrl}`);
          resolve({ success: true, url: catalogUrl });
        } else if (res.statusCode === 409) {
          console.log(`⚠️  Already registered: ${catalogUrl}`);
          resolve({ success: true, alreadyExists: true, url: catalogUrl });
        } else {
          console.error(`❌ Failed to register: ${catalogUrl}`);
          console.error(`   HTTP ${res.statusCode}: ${data}`);
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Request error: ${error.message}`);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Main execution
const repoUrls = process.argv.slice(2);

if (repoUrls.length === 0) {
  console.log('Usage: node register-portal.js <repo-url-1> [repo-url-2] ...');
  console.log('');
  console.log('Examples:');
  console.log('  node register-portal.js https://github.com/myorg/myportal');
  console.log('  node register-portal.js https://github.com/myorg/portal1 https://github.com/myorg/portal2');
  console.log('');
  console.log('Environment variables:');
  console.log('  BACKEND_URL - Backstage backend URL (default: http://localhost:7008)');
  process.exit(1);
}

(async () => {
  console.log(`Registering ${repoUrls.length} portal(s)...\n`);
  
  for (const repoUrl of repoUrls) {
    try {
      await registerLocation(repoUrl);
    } catch (error) {
      console.error(`Error registering ${repoUrl}:`, error.message);
    }
    console.log('');
  }
  
  console.log('Done! Check the catalog at http://localhost:3001/catalog');
})().catch(console.error);

