const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../public/images/warnerbroassets');
const outputDir = sourceDir; // Overwrite in place

// Define compression settings for each image
const imageConfigs = [
  {
    input: 'dc.png',
    output: 'dc-logo.webp',
    quality: 95, // Target ~500KB-1MB from 7.4MB
    format: 'webp'
  },
  {
    input: 'wbbannerweb.jpg',
    output: 'hero-banner-desktop.jpg',
    copy: true // Just copy without compression
  },
  {
    input: 'wbbannermobile.jpg',
    output: 'hero-banner-mobile.jpg',
    copy: true // Just copy without compression
  },
  {
    input: 'tomjerry.png',
    output: 'tom-jerry-logo.webp',
    quality: 90, // High quality for small image
    format: 'webp'
  },
  {
    input: 'wb-bg.png',
    output: 'warner-bg.webp',
    quality: 90, // High quality for small image
    format: 'webp'
  }
];

async function optimizeImages() {
  console.log('Starting Warner Bros image optimization...\n');

  for (const config of imageConfigs) {
    const inputPath = path.join(sourceDir, config.input);
    const outputPath = path.join(outputDir, config.output);

    try {
      // Check if input exists
      if (!fs.existsSync(inputPath)) {
        console.log(`⚠️  Skipping ${config.input} - file not found`);
        continue;
      }

      console.log(`Processing ${config.input} -> ${config.output}...`);

      // Get original size
      const originalStats = fs.statSync(inputPath);
      const originalSizeKB = (originalStats.size / 1024).toFixed(2);

      // Process image
      if (config.copy) {
        // Just copy the file
        fs.copyFileSync(inputPath, outputPath);
      } else {
        const transformer = sharp(inputPath);

        if (config.format === 'webp') {
          transformer.webp({ quality: config.quality });
        } else if (config.format === 'jpeg') {
          transformer.jpeg({ quality: config.quality });
        }

        await transformer.toFile(outputPath);
      }

      // Get new size
      const newStats = fs.statSync(outputPath);
      const newSizeKB = (newStats.size / 1024).toFixed(2);
      const compressionRatio = config.copy ? '0.0' : ((1 - newStats.size / originalStats.size) * 100).toFixed(1);
      const action = config.copy ? 'copied' : 'reduced';

      console.log(`✅ ${config.input}: ${originalSizeKB}KB → ${newSizeKB}KB (${compressionRatio}% ${action})\n`);
    } catch (error) {
      console.error(`❌ Error processing ${config.input}:`, error.message);
    }
  }

  console.log('Image optimization complete!');
  console.log('\nDon\'t forget to update warner-bros-config.ts with the new filenames!');
}

// Run the optimization
optimizeImages().catch(console.error);
