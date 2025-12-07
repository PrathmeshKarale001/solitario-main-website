/**
 * Test script for Freepik Seedream 4 API integration
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { generateImageWithFreepik } from '../lib/freepik';

async function main() {
  console.log('🧪 Testing Freepik Seedream 4 API Integration');
  console.log('==========================================\n');

  // Test with a simple prompt first
  const testPrompt = 'A single brilliant diamond on a dark velvet surface, studio lighting, photorealistic';
  const testFilename = 'test-diamond.jpg';

  console.log(`📸 Testing: ${testFilename}`);
  console.log(`📝 Prompt: ${testPrompt}\n`);

  const result = await generateImageWithFreepik(testPrompt, testFilename, {
    useBrandGuidelines: false, // Don't use brand guidelines for test
    aspectRatio: 'square_1_1',
    guidanceScale: 7.5,
  });

  if (result.success) {
    console.log(`\n✅ SUCCESS!`);
    console.log(`   Image saved to: ${result.imagePath}`);
    console.log(`   Task ID: ${result.taskId}`);
    console.log(`   Prompt used: ${result.prompt}`);
  } else {
    console.error(`\n❌ FAILED: ${result.error}`);
    console.error(`   Prompt: ${result.prompt}`);
  }
}

main().catch(console.error);
