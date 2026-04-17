const fs = require('fs');
const path = require('path');

const LOG_FILE_JSONL = path.join(__dirname, '..', 'data', 'akshaya-tnc-logs.jsonl');
const LOG_FILE_JSON = path.join(__dirname, '..', 'data', 'akshaya-tnc-logs.json');

try {
  let data = [];

  // Read new JSONL format
  if (fs.existsSync(LOG_FILE_JSONL)) {
    const raw = fs.readFileSync(LOG_FILE_JSONL, 'utf-8');
    const lines = raw.split('\n').filter(line => line.trim());
    data = lines.map(line => JSON.parse(line));
  } 
  // Fallback to old JSON format for legacy data
  else if (fs.existsSync(LOG_FILE_JSON)) {
    data = JSON.parse(fs.readFileSync(LOG_FILE_JSON, 'utf-8'));
  }

  if (data.length === 0) {
    console.log('\x1b[33m%s\x1b[0m', 'No logs found yet. Start tracking to see data.');
    process.exit(0);
  }

  const count = data.length;
  const uniqueUsers = new Set(data.map(log => log.identifier)).size;

  console.log('\n\x1b[32m%s\x1b[0m', '=== Akshaya Tritiya T&C Tracking ===');
  console.log('Total Acceptances: \x1b[1m%s\x1b[0m', count);
  console.log('Unique Users:      \x1b[1m%s\x1b[0m', uniqueUsers);
  console.log('Last Acceptance:   \x1b[36m%s\x1b[0m', data[count - 1]?.timestamp || 'N/A');
  console.log('Format:           \x1b[2m%s\x1b[0m', fs.existsSync(LOG_FILE_JSONL) ? 'JSONL (Safe)' : 'Legacy JSON');
  console.log('====================================\n');

} catch (error) {
  console.error('Error reading logs:', error.message);
}
