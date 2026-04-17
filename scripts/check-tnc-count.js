const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '..', 'data', 'akshaya-tnc-logs.json');

try {
  if (!fs.existsSync(LOG_FILE)) {
    console.log('\x1b[33m%s\x1b[0m', 'No logs found yet. Start tracking to see data.');
    process.exit(0);
  }

  const data = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
  const count = data.length;
  const uniqueUsers = new Set(data.map(log => log.identifier)).size;

  console.log('\n\x1b[32m%s\x1b[0m', '=== Akshaya Tritiya T&C Tracking ===');
  console.log('Total Acceptances: \x1b[1m%s\x1b[0m', count);
  console.log('Unique Users:      \x1b[1m%s\x1b[0m', uniqueUsers);
  console.log('Last Acceptance:   \x1b[36m%s\x1b[0m', data[count - 1]?.timestamp || 'N/A');
  console.log('====================================\n');

} catch (error) {
  console.error('Error reading logs:', error.message);
}
