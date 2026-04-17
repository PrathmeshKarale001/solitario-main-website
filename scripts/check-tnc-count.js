const fs = require('fs');
const path = require('path');
const https = require('https');

const LOG_FILE_JSONL = path.join(__dirname, '..', 'data', 'akshaya-tnc-logs.jsonl');
const LOG_FILE_JSON = path.join(__dirname, '..', 'data', 'akshaya-tnc-logs.json');

async function getStats() {
  const args = process.argv.slice(2);
  const remoteUrl = args.includes('--remote') ? args[args.indexOf('--remote') + 1] : null;

  if (remoteUrl) {
    console.log('\x1b[36m%s\x1b[0m', `Fetching remote stats from: ${remoteUrl}...`);
    return new Promise((resolve, reject) => {
      https.get(`${remoteUrl}/api/track/tnc`, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            if (data.success) {
              resolve({
                count: data.count,
                unique: data.unique,
                lastUpdate: data.lastUpdate,
                format: 'Remote (Live API)'
              });
            } else {
              reject(new Error(data.error || 'Failed to fetch'));
            }
          } catch (e) {
            reject(new Error('Invalid JSON response from server'));
          }
        });
      }).on('error', (e) => reject(e));
    });
  }

  // Local logic (existing)
  let data = [];
  if (fs.existsSync(LOG_FILE_JSONL)) {
    const raw = fs.readFileSync(LOG_FILE_JSONL, 'utf-8');
    const lines = raw.split('\n').filter(line => line.trim());
    data = lines.map(line => JSON.parse(line));
  } else if (fs.existsSync(LOG_FILE_JSON)) {
    data = JSON.parse(fs.readFileSync(LOG_FILE_JSON, 'utf-8'));
  }

  return {
    count: data.length,
    unique: new Set(data.map(log => log.identifier)).size,
    lastUpdate: data[data.length - 1]?.timestamp,
    format: fs.existsSync(LOG_FILE_JSONL) ? 'JSONL (Local)' : 'Legacy JSON (Local)'
  };
}

const run = async () => {
  try {
    const stats = await getStats();

    if (stats.count === 0 && !stats.format.includes('Remote')) {
      console.log('\x1b[33m%s\x1b[0m', 'No logs found yet. Start tracking to see data.');
      process.exit(0);
    }

    console.log('\n\x1b[32m%s\x1b[0m', '=== Akshaya Tritiya T&C Tracking ===');
    console.log('Total Acceptances: \x1b[1m%s\x1b[0m', stats.count);
    console.log('Unique Users:      \x1b[1m%s\x1b[0m', stats.unique);
    console.log('Last Acceptance:   \x1b[36m%s\x1b[0m', stats.lastUpdate || 'N/A');
    console.log('Data Source:       \x1b[2m%s\x1b[0m', stats.format);
    console.log('====================================\n');
    
    if (!process.argv.includes('--remote')) {
      console.log('\x1b[2mTo check production: node scripts/check-tnc-count.js --remote https://thesolitario.com\x1b[0m\n');
    }

  } catch (error) {
    console.error('\n\x1b[31m%s\x1b[0m', `Error: ${error.message}`);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\x1b[2mTip: Make sure the URL is correct and includes https://\x1b[0m');
    }
  }
};

run();
