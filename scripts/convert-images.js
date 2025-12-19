#!/usr/bin/env node

/**
 * Automated Image to WebP Conversion Script
 * Converts all JPG/PNG images to WebP format for better performance
 * 
 * Usage: node scripts/convert-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Directories to process (prioritized by LCP impact)
const DIRECTORIES = [
  // CRITICAL - Hero images (LCP elements)
  { path: 'public/images', priority: 'CRITICAL', quality: 90 },
  { path: 'public/images/Hero_Mobile', priority: 'CRITICAL', quality: 90 },
  { path: 'public/images/Shop', priority: 'CRITICAL', quality: 90 },
  
  // HIGH - Above-fold content
  { path: 'public/images/Stores', priority: 'HIGH', quality: 85 },
  { path: 'public/about', priority: 'HIGH', quality: 85 },
  
  // MEDIUM - Below-fold content
  { path: 'public/carouselgrid', priority: 'MEDIUM', quality: 80 },
  { path: 'public/diamonds', priority: 'MEDIUM', quality: 85 },
  { path: 'public/images/products', priority: 'MEDIUM', quality: 80 },
  
  // LOW - Icons and small assets
  { path: 'public/category-home', priority: 'LOW', quality: 85 },
  { path: 'public/images/Awards', priority: 'LOW', quality: 85 },
];

// Statistics tracking
const stats = {
  processed: 0,
  success: 0,
  failed: 0,
  totalOriginalSize: 0,
  totalWebPSize: 0,
  errors: [],
};

/**
 * Format bytes to human-readable size
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Convert single image to WebP
 */
async function convertImage(inputPath, outputPath, quality) {
  try {
    const originalSize = fs.statSync(inputPath).size;
    
    await sharp(inputPath)
      .webp({ quality, effort: 6 })
      .toFile(outputPath);
    
    const webpSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    
    stats.totalOriginalSize += originalSize;
    stats.totalWebPSize += webpSize;
    stats.success++;
    
    console.log(`  ✓ ${path.basename(inputPath)}`);
    console.log(`    ${formatBytes(originalSize)} → ${formatBytes(webpSize)} (${savings}% reduction)`);
    
    return true;
  } catch (err) {
    stats.failed++;
    stats.errors.push({ file: inputPath, error: err.message });
    console.error(`  ✗ ${path.basename(inputPath)}: ${err.message}`);
    return false;
  }
}

/**
 * Process all images in a directory
 */
async function processDirectory(config) {
  const { path: dirPath, priority, quality } = config;
  const fullPath = path.join(process.cwd(), dirPath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠ Skipped: ${dirPath} (directory not found)`);
    return;
  }
  
  console.log(`\n[${ priority}] Processing: ${dirPath}`);
  console.log(`Quality setting: ${quality}`);
  
  const files = fs.readdirSync(fullPath);
  let dirProcessed = 0;
  
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    
    // Only process JPG and PNG files
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
      continue;
    }
    
    const inputPath = path.join(fullPath, file);
    const outputPath = path.join(fullPath, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
    
    // Skip if WebP already exists and is newer
    if (fs.existsSync(outputPath)) {
      const inputStat = fs.statSync(inputPath);
      const outputStat = fs.statSync(outputPath);
      
      if (outputStat.mtime > inputStat.mtime) {
        console.log(`  ↷ ${path.basename(file)} (WebP already up-to-date)`);
        continue;
      }
    }
    
    stats.processed++;
    dirProcessed++;
    await convertImage(inputPath, outputPath, quality);
  }
  
  if (dirProcessed === 0) {
    console.log('  No images to convert');
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🖼️  Solitario Image Optimization Tool');
  console.log('=====================================\n');
  console.log('Converting images to WebP format...\n');
  
  const startTime = Date.now();
  
  // Process directories in priority order
  for (const config of DIRECTORIES) {
    await processDirectory(config);
  }
  
  // Print summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const totalSavings = ((stats.totalOriginalSize - stats.totalWebPSize) / stats.totalOriginalSize * 100).toFixed(1);
  
  console.log('\n=====================================');
  console.log('📊 Conversion Summary');
  console.log('=====================================');
  console.log(`Total images processed: ${stats.processed}`);
  console.log(`Successful conversions: ${stats.success}`);
  console.log(`Failed conversions: ${stats.failed}`);
  console.log(`\nOriginal total size: ${formatBytes(stats.totalOriginalSize)}`);
  console.log(`WebP total size: ${formatBytes(stats.totalWebPSize)}`);
  console.log(`Total savings: ${formatBytes(stats.totalOriginalSize - stats.totalWebPSize)} (${totalSavings}%)`);
  console.log(`\nTime elapsed: ${duration}s`);
  
  if (stats.errors.length > 0) {
    console.log('\n⚠️  Errors:');
    stats.errors.forEach(err => {
      console.log(`  - ${err.file}: ${err.error}`);
    });
  }
  
  console.log('\n✅ Image optimization complete!');
  console.log('\nNext steps:');
  console.log('1. Test images in development: npm run dev');
  console.log('2. Check file sizes: ls -lh public/images/*.webp');
  console.log('3. Run Lighthouse to verify LCP improvement');
  console.log('4. Optional: Remove original files after confirming WebP works');
}

// Run the script
main().catch(err => {
  console.error('\n❌ Fatal error:', err);
  process.exit(1);
});
