/**
 * Script to generate AI images for Solitario website pages
 * Usage: npx ts-node scripts/generate-images.ts [page] [image]
 * 
 * Examples:
 *   npx ts-node scripts/generate-images.ts                    # Generate all images
 *   npx ts-node scripts/generate-images.ts labGrownDiamonds   # Generate all lab page images
 *   npx ts-node scripts/generate-images.ts labGrownDiamonds hero  # Generate specific image
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { generateImage, PAGE_IMAGE_PROMPTS, type ImagePromptKey } from '../lib/gemini';

async function main() {
  const args = process.argv.slice(2);
  const pageName = args[0] as ImagePromptKey | undefined;
  const imageName = args[1];

  console.log('🎨 Solitario AI Image Generator');
  console.log('================================\n');

  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    process.exit(1);
  }

  // If specific page and image provided
  if (pageName && imageName) {
    const pagePrompts = PAGE_IMAGE_PROMPTS[pageName];
    if (!pagePrompts) {
      console.error(`❌ Unknown page: ${pageName}`);
      console.log('Available pages:', Object.keys(PAGE_IMAGE_PROMPTS).join(', '));
      process.exit(1);
    }

    const imagePrompt = (pagePrompts as Record<string, { prompt: string; filename: string }>)[imageName];
    if (!imagePrompt) {
      console.error(`❌ Unknown image: ${imageName}`);
      console.log('Available images for', pageName + ':', Object.keys(pagePrompts).join(', '));
      process.exit(1);
    }

    console.log(`📸 Generating: ${pageName}/${imageName}`);
    const result = await generateImage(imagePrompt.prompt, imagePrompt.filename);
    
    if (result.success) {
      console.log(`\n✅ Success! Image saved to: ${result.imagePath}`);
    } else {
      console.error(`\n❌ Failed: ${result.error}`);
    }
    return;
  }

  // If only page provided, generate all images for that page
  if (pageName) {
    const pagePrompts = PAGE_IMAGE_PROMPTS[pageName];
    if (!pagePrompts) {
      console.error(`❌ Unknown page: ${pageName}`);
      console.log('Available pages:', Object.keys(PAGE_IMAGE_PROMPTS).join(', '));
      process.exit(1);
    }

    console.log(`📸 Generating all images for: ${pageName}\n`);
    
    for (const [name, imagePrompt] of Object.entries(pagePrompts)) {
      console.log(`\n--- ${name} ---`);
      const result = await generateImage(
        (imagePrompt as { prompt: string; filename: string }).prompt,
        (imagePrompt as { prompt: string; filename: string }).filename
      );
      
      if (result.success) {
        console.log(`✅ Saved: ${result.imagePath}`);
      } else {
        console.error(`❌ Failed: ${result.error}`);
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    return;
  }

  // Generate all images for all pages
  console.log('📸 Generating ALL images for ALL pages\n');
  console.log('This may take a while...\n');

  for (const [page, prompts] of Object.entries(PAGE_IMAGE_PROMPTS)) {
    console.log(`\n========== ${page} ==========\n`);
    
    for (const [name, imagePrompt] of Object.entries(prompts)) {
      console.log(`--- ${name} ---`);
      const result = await generateImage(
        (imagePrompt as { prompt: string; filename: string }).prompt,
        (imagePrompt as { prompt: string; filename: string }).filename
      );
      
      if (result.success) {
        console.log(`✅ Saved: ${result.imagePath}`);
      } else {
        console.error(`❌ Failed: ${result.error}`);
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('\n================================');
  console.log('🎉 Image generation complete!');
}

main().catch(console.error);
