const fs = require('fs');
const path = require('path');

// List of all admin page files that need dynamic rendering
const adminPages = [
  'app/admin/analytics/page.tsx',
  'app/admin/blog/page.tsx',
  'app/admin/customers/page.tsx',
  'app/admin/orders/page.tsx',
  'app/admin/products/page.tsx',
  'app/admin/settings/page.tsx',
];

const dynamicExport = "\n// Force dynamic rendering for this page\nexport const dynamic = 'force-dynamic';\n";

adminPages.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Check if already has dynamic export
  if (content.includes("export const dynamic = 'force-dynamic'")) {
    console.log(`✓ Already has dynamic export: ${filePath}`);
    return;
  }
  
  // Find the position after 'use client' and imports
  const lines = content.split('\n');
  let insertIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    // Find the last import statement or 'use client'
    if (lines[i].startsWith("'use client'") || lines[i].startsWith('"use client"')) {
      insertIndex = i + 1;
      // Skip empty lines after 'use client'
      while (insertIndex < lines.length && lines[insertIndex].trim() === '') {
        insertIndex++;
      }
      // Skip import statements
      while (insertIndex < lines.length && (lines[insertIndex].startsWith('import ') || lines[insertIndex].trim() === '')) {
        insertIndex++;
      }
      break;
    }
  }
  
  if (insertIndex === -1) {
    console.log(`⚠️  Could not find insertion point: ${filePath}`);
    return;
  }
  
  // Insert the dynamic export
  lines.splice(insertIndex, 0, dynamicExport);
  const newContent = lines.join('\n');
  
  fs.writeFileSync(fullPath, newContent, 'utf8');
  console.log(`✅ Added dynamic export to: ${filePath}`);
});

console.log('\n✨ Done!');
