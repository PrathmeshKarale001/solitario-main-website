import * as fs from 'node:fs';
import * as path from 'node:path';

// Puter.ai API endpoints (reverse-engineered from their JavaScript SDK)
const PUTER_API_BASE = 'https://api.puter.com';
const PUTER_AI_ENDPOINT = `${PUTER_API_BASE}/v1/ai/txt2img`;

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
}

// Generate image using Puter.ai's API (free, unlimited Nano Banana Pro)
export async function generateImageWithPuter(
  prompt: string,
  outputFilename: string,
  options?: {
    useBrandGuidelines?: boolean;
    outputDir?: string;
    model?: 'gemini-2.5-flash-image-preview' | 'gemini-3-pro-image' | 'gpt-image-1' | 'dall-e-3';
    quality?: 'high' | 'medium' | 'low' | 'hd' | 'standard';
  }
): Promise<GeneratedImage> {
  const {
    useBrandGuidelines = true,
    outputDir = 'public/ai-generated',
    model = 'gemini-2.5-flash-image-preview', // Nano Banana Pro
    quality = 'high',
  } = options || {};

  const finalPrompt = useBrandGuidelines ? buildBrandPrompt(prompt) : prompt;
  
  try {
    console.log(`🎨 Generating image with Puter.ai: ${outputFilename}`);
    console.log(`📝 Model: ${model}, Quality: ${quality}`);
    console.log(`📝 Prompt: ${finalPrompt.substring(0, 100)}...`);

    // Prepare request body
    const requestBody = {
      prompt: finalPrompt,
      model,
      quality,
      testMode: false,
    };

    // Make request to Puter.ai API
    const response = await fetch(PUTER_AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Solitario-Website/1.0',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    // Get image data (response should be a data URL)
    const imageData = await response.text();
    
    if (!imageData.startsWith('data:image/')) {
      throw new Error('Invalid response: not an image data URL');
    }

    // Extract base64 data
    const base64Data = imageData.split(',')[1];
    if (!base64Data) {
      throw new Error('Could not extract image data from response');
    }

    // Ensure output directory exists
    const fullOutputDir = path.join(process.cwd(), outputDir);
    if (!fs.existsSync(fullOutputDir)) {
      fs.mkdirSync(fullOutputDir, { recursive: true });
    }

    // Save image
    const outputPath = path.join(fullOutputDir, outputFilename);
    fs.writeFileSync(outputPath, Buffer.from(base64Data, 'base64'));
    
    console.log(`✅ Image saved: ${outputPath}`);
    
    return {
      success: true,
      imagePath: `/${outputDir}/${outputFilename}`,
      prompt: finalPrompt,
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
export async function generateImagesWithPuter(
  prompts: Array<{ prompt: string; filename: string }>,
  options?: Parameters<typeof generateImageWithPuter>[2]
): Promise<GeneratedImage[]> {
  const results: GeneratedImage[] = [];
  
  for (const { prompt, filename } of prompts) {
    const result = await generateImageWithPuter(prompt, filename, options);
    results.push(result);
    
    // Rate limiting - wait 1 second between requests (Puter.ai is generous but let's be polite)
    await new Promise(resolve => setTimeout(resolve, 1000));
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
