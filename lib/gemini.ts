import { GoogleGenAI } from '@google/genai';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Get API key - will be validated at runtime
function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return new GoogleGenAI({ apiKey });
}

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
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  resolution?: '1024' | '2048' | '4096';
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

// Generate image using Imagen 4 (latest) or Gemini with image generation
export async function generateImage(
  prompt: string,
  outputFilename: string,
  options?: {
    useBrandGuidelines?: boolean;
    outputDir?: string;
    model?: 'imagen-4.0-generate-001' | 'gemini-2.0-flash-exp-image-generation' | 'gemini-2.5-flash-image';
  }
): Promise<GeneratedImage> {
  const {
    useBrandGuidelines = true,
    outputDir = 'public/ai-generated',
    model = 'gemini-2.5-flash-image', // Gemini 2.5 Flash Image (stable version)
  } = options || {};

  const finalPrompt = useBrandGuidelines ? buildBrandPrompt(prompt) : prompt;
  
  try {
    console.log(`🎨 Generating image: ${outputFilename}`);
    console.log(`📝 Prompt: ${finalPrompt.substring(0, 100)}...`);

    const ai = getClient();
    
    // Ensure output directory exists
    const fullOutputDir = path.join(process.cwd(), outputDir);
    if (!fs.existsSync(fullOutputDir)) {
      fs.mkdirSync(fullOutputDir, { recursive: true });
    }

    // Use Imagen API for image generation
    if (model.startsWith('imagen')) {
      const response = await ai.models.generateImages({
        model,
        prompt: finalPrompt,
        config: {
          numberOfImages: 1,
        },
      });

      // Process Imagen response
      if (response.generatedImages && response.generatedImages.length > 0) {
        const imageBytes = response.generatedImages[0].image?.imageBytes;
        if (imageBytes) {
          const buffer = Buffer.from(imageBytes, 'base64');
          const outputPath = path.join(fullOutputDir, outputFilename);
          fs.writeFileSync(outputPath, buffer);
          
          console.log(`✅ Image saved: ${outputPath}`);
          
          return {
            success: true,
            imagePath: `/${outputDir}/${outputFilename}`,
            prompt: finalPrompt,
          };
        }
      }
    } else {
      // Use Gemini generateContent for models that support it
      const response = await ai.models.generateContent({
        model,
        contents: finalPrompt,
        config: {
          responseModalities: ['image', 'text'],
        },
      });

      // Process Gemini response
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData as string, 'base64');
          const outputPath = path.join(fullOutputDir, outputFilename);
          fs.writeFileSync(outputPath, buffer);
          
          console.log(`✅ Image saved: ${outputPath}`);
          
          return {
            success: true,
            imagePath: `/${outputDir}/${outputFilename}`,
            prompt: finalPrompt,
          };
        }
      }
    }

    return {
      success: false,
      error: 'No image data in response',
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
export async function generateImages(
  prompts: Array<{ prompt: string; filename: string }>,
  options?: Parameters<typeof generateImage>[2]
): Promise<GeneratedImage[]> {
  const results: GeneratedImage[] = [];
  
  for (const { prompt, filename } of prompts) {
    const result = await generateImage(prompt, filename, options);
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
