#!/usr/bin/env node

/**
 * Convert IMG_0061.JPG (Ricky founder) to WebP with target size 800KB–1MB.
 * Uses sharp (installed in project). Run: node scripts/convert-ricky-founder-webp.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const MIN_BYTES = 800 * 1024;  // 800 KB
const MAX_BYTES = 1024 * 1024; // 1 MB
const inputPath = path.join(process.cwd(), 'public/about/IMG_0061.JPG');
const outputPath = path.join(process.cwd(), 'public/about/IMG_0061.webp');

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB';
}

async function convertWithQuality(quality) {
  await sharp(inputPath)
    .webp({ quality, effort: 6 })
    .toFile(outputPath);
  return fs.statSync(outputPath).size;
}

async function main() {
  if (!fs.existsSync(inputPath)) {
    console.error('Input not found:', inputPath);
    process.exit(1);
  }

  let low = 1, high = 100;
  let lastSize = 0;

  // Binary search for quality that gives size in [800KB, 1MB]
  while (low <= high) {
    const quality = Math.round((low + high) / 2);
    const size = await convertWithQuality(quality);

    if (size >= MIN_BYTES && size <= MAX_BYTES) {
      console.log('Ricky founder image converted to WebP.');
      console.log('  File: public/about/IMG_0061.webp');
      console.log('  Size: ' + formatBytes(size) + ' (target 800 KB – 1 MB)');
      console.log('  Quality: ' + quality);
      return;
    }

    if (size < MIN_BYTES) {
      low = quality + 1; // need larger file → higher quality
    } else {
      high = quality - 1; // need smaller file → lower quality
    }
    lastSize = size;
  }

  // If no exact hit, use quality that got closest within range or just under 1MB
  const finalQuality = Math.min(high + 1, 100);
  const finalSize = await convertWithQuality(finalQuality);
  console.log('Ricky founder image converted to WebP.');
  console.log('  File: public/about/IMG_0061.webp');
  console.log('  Size: ' + formatBytes(finalSize));
  console.log('  Quality: ' + finalQuality);
  if (finalSize >= MIN_BYTES && finalSize <= MAX_BYTES) {
    console.log('  Within target 800 KB – 1 MB.');
  } else {
    console.log('  (Target was 800 KB – 1 MB; adjust quality in script if needed.)');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
