import * as fs from 'node:fs';
import * as path from 'node:path';

// Freepik API endpoints
const FREEPIK_API_BASE = 'https://api.freepik.com';
const FREEPIK_GENERATE_ENDPOINT = `${FREEPIK_API_BASE}/v1/ai/text-to-image/seedream-v4`;
const FREEPIK_STATUS_ENDPOINT = `${FREEPIK_API_BASE}/v1/ai/text-to-image/seedream-v4`;

// Brand guidelines for consistent image generation
export const SOLITARIO_BRAND = {
  colors: {
    classicGreen: '#146552',
    bronzeGold: '#ac884b',
    softBronze: '#c39275',
    ivoryPearl: '#f8eee7',
    teal: '#107571',
  },
  style: 'minimalist luxury, high-end jewelry aesthetic, clean and elegant',
  lighting: 'soft warm lighting, professional studio lighting, golden hour ambiance',
  mood: 'sophisticated, premium, timeless elegance, refined luxury',
  keywords: ['lab-grown diamonds', 'sustainable luxury', 'modern elegance', 'ethical jewelry'],
};

// Build brand-consistent prompt
export function buildBrandPrompt(basePrompt: string, options?: {
  includeColors?: boolean;
  includeStyle?: boolean;
}): string {
  const { includeColors = true, includeStyle = true } = options || {};
  
  let prompt = basePrompt;
  
  if (includeColors) {
    prompt += `. Color palette: luxurious gold (${SOLITARIO_BRAND.colors.bronzeGold}), deep teal (${SOLITARIO_BRAND.colors.classicGreen}), soft ivory (${SOLITARIO_BRAND.colors.ivoryPearl})`;
  }
  
  if (includeStyle) {
    prompt += `. Style: ${SOLITARIO_BRAND.style}. Lighting: ${SOLITARIO_BRAND.lighting}. Mood: ${SOLITARIO_BRAND.mood}`;
  }
  
  prompt += '. High quality, photorealistic, 8k resolution, professional photography';
  
  return prompt;
}

// Image generation result type
export interface GeneratedImage {
  success: boolean;
  imagePath?: string;
  error?: string;
  prompt: string;
  taskId?: string;
}

// Get Freepik API key
function getFreepikApiKey() {
  const apiKey = process.env.FREEPIK_API_KEY;
  if (!apiKey) {
    throw new Error('FREEPIK_API_KEY environment variable is not set');
  }
  return apiKey;
}

// Poll task status until completion
async function pollTaskStatus(taskId: string, maxWaitTimeMs: number = 300000): Promise<{ status: string; imageUrl?: string }> {
  const startTime = Date.now();
  const apiKey = getFreepikApiKey();
  
  while (Date.now() - startTime < maxWaitTimeMs) {
    try {
      const response = await fetch(`${FREEPIK_STATUS_ENDPOINT}/${taskId}`, {
        method: 'GET',
        headers: {
          'x-freepik-api-key': apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }

      const result = await response.json();
      
      // Check if status is nested under data field
      const status = result.data?.status || result.status;
      const generated = result.data?.generated || result.generated;
      
      if (status === 'COMPLETED' && generated && generated.length > 0) {
        return {
          status: 'COMPLETED',
          imageUrl: generated[0],
        };
      }
      
      if (status === 'FAILED') {
        throw new Error('Image generation failed on Freepik side');
      }
      
      if (status === 'COMPLETED') {
        throw new Error('Task completed but no image URL returned');
      }
      
      // Still in progress, wait and retry
      console.log(`⏳ Task ${taskId} status: ${status} (checking again in 5s...)`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      console.error(`❌ Error checking task status:`, error);
      throw error;
    }
  }
  
  throw new Error(`Task ${taskId} did not complete within ${maxWaitTimeMs / 1000} seconds`);
}

// Download image from URL and save to file
async function downloadImage(imageUrl: string, outputPath: string): Promise<void> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }
  
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
}

// Generate image using Freepik's Seedream 4 API
export async function generateImageWithFreepik(
  prompt: string,
  outputFilename: string,
  options?: {
    useBrandGuidelines?: boolean;
    outputDir?: string;
    aspectRatio?: 'square_1_1' | 'widescreen_16_9' | 'social_story_9_16' | 'portrait_2_3' | 'traditional_3_4' | 'standard_3_2' | 'classic_4_3';
    guidanceScale?: number; // 0-20
    seed?: number; // 0-2147483647
  }
): Promise<GeneratedImage> {
  const {
    useBrandGuidelines = true,
    outputDir = 'public/ai-generated',
    aspectRatio = 'widescreen_16_9',
    guidanceScale = 7.5,
    seed = Math.floor(Math.random() * 2147483647),
  } = options || {};

  const finalPrompt = useBrandGuidelines ? buildBrandPrompt(prompt) : prompt;
  
  try {
    console.log(`🎨 Generating image with Freepik Seedream 4: ${outputFilename}`);
    console.log(`📝 Aspect Ratio: ${aspectRatio}, Guidance Scale: ${guidanceScale}`);
    console.log(`📝 Prompt: ${finalPrompt.substring(0, 100)}...`);

    const apiKey = getFreepikApiKey();

    // Step 1: Submit generation request
    const generateResponse = await fetch(FREEPIK_GENERATE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-freepik-api-key': apiKey,
      },
      body: JSON.stringify({
        prompt: finalPrompt,
        aspect_ratio: aspectRatio,
        guidance_scale: guidanceScale,
        seed,
      }),
    });

    if (!generateResponse.ok) {
      const errorText = await generateResponse.text();
      throw new Error(`API Error: ${generateResponse.status} - ${errorText}`);
    }

    const generateResult = await generateResponse.json();
    const taskId = generateResult.data?.task_id || generateResult.task_id;
    
    if (!taskId) {
      throw new Error('No task ID returned from Freepik API');
    }

    console.log(`✅ Generation started. Task ID: ${taskId}`);

    // Step 2: Poll for completion
    const { status, imageUrl } = await pollTaskStatus(taskId);
    
    if (!imageUrl) {
      throw new Error('No image URL received after task completion');
    }

    console.log(`✅ Image generated. Downloading from: ${imageUrl}`);

    // Step 3: Download and save image
    const fullOutputDir = path.join(process.cwd(), outputDir);
    if (!fs.existsSync(fullOutputDir)) {
      fs.mkdirSync(fullOutputDir, { recursive: true });
    }

    const outputPath = path.join(fullOutputDir, outputFilename);
    await downloadImage(imageUrl, outputPath);
    
    console.log(`✅ Image saved: ${outputPath}`);
    
    return {
      success: true,
      imagePath: `/${outputDir}/${outputFilename}`,
      prompt: finalPrompt,
      taskId,
    };
  } catch (error) {
    console.error(`❌ Error generating image:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      prompt: finalPrompt,
    };
  }
}

// Batch generate images from prompts
export async function generateImagesWithFreepik(
  prompts: Array<{ prompt: string; filename: string }>,
  options?: Parameters<typeof generateImageWithFreepik>[2]
): Promise<GeneratedImage[]> {
  const results: GeneratedImage[] = [];
  
  for (const { prompt, filename } of prompts) {
    const result = await generateImageWithFreepik(prompt, filename, options);
    results.push(result);
    
    // Rate limiting - wait 2 seconds between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return results;
}

// Pre-defined prompts for Solitario pages
export const PAGE_IMAGE_PROMPTS = {
  labGrownDiamonds: {
    hero: {
      prompt: 'A stunning high-tech laboratory environment where lab-grown diamonds are created, featuring glowing plasma reactors with golden light, pristine white surfaces, and a single brilliant diamond floating in the center, futuristic yet elegant',
      filename: 'lab-hero.jpg',
    },
    process: {
      prompt: 'Close-up of the CVD (Chemical Vapor Deposition) process creating a diamond, showing layers of carbon atoms crystallizing into a perfect diamond structure, scientific yet beautiful, warm golden lighting',
      filename: 'lab-process.jpg',
    },
    comparison: {
      prompt: 'Side by side comparison of a rough lab-grown diamond and a polished brilliant cut diamond on a luxurious dark velvet surface, soft studio lighting highlighting the brilliance',
      filename: 'lab-comparison.jpg',
    },
    sustainability: {
      prompt: 'Abstract representation of sustainability and eco-friendly luxury, featuring green leaves intertwined with golden geometric diamond shapes, clean minimal background',
      filename: 'lab-sustainability.jpg',
    },
  },
  aboutFounders: {
    hero: {
      prompt: 'Elegant luxury jewelry workshop interior with warm ambient lighting, polished wooden workbenches, precision tools, and soft golden light streaming through windows, professional yet inviting atmosphere',
      filename: 'founders-hero.jpg',
    },
    vision: {
      prompt: 'Abstract artistic representation of vision and innovation in jewelry, featuring flowing golden ribbons forming diamond shapes against a deep teal gradient background, modern and sophisticated',
      filename: 'founders-vision.jpg',
    },
    craftsmanship: {
      prompt: 'Close-up of expert hands carefully setting a brilliant diamond into a gold ring, shallow depth of field, warm professional lighting, showcasing precision and artistry',
      filename: 'founders-craftsmanship.jpg',
    },
  },
  gallery: {
    lifestyle1: {
      prompt: 'Elegant woman in soft ivory dress wearing a delicate gold necklace with diamond pendant, soft natural lighting, luxury lifestyle photography, warm tones',
      filename: 'gallery-lifestyle-1.jpg',
    },
    lifestyle2: {
      prompt: 'Close-up of hands with elegant diamond rings, soft focus background of luxury interior, warm golden hour lighting, sophisticated and timeless',
      filename: 'gallery-lifestyle-2.jpg',
    },
    abstract: {
      prompt: 'Abstract luxury background with soft golden bokeh lights and subtle diamond sparkles, perfect for overlay, elegant and minimal',
      filename: 'gallery-abstract.jpg',
    },
  },
};

// Export types for use in components
export type ImagePromptKey = keyof typeof PAGE_IMAGE_PROMPTS;
export type PageImagePrompts = typeof PAGE_IMAGE_PROMPTS;
