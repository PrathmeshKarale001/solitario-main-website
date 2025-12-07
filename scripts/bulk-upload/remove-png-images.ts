/**
 * Remove PNG images from existing Shopify products
 * Keeps only JPG/JPEG images
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const CONFIG = {
  shopifyDomain: process.env.SHOPIFY_STORE_DOMAIN || 'solitarioind',
  adminAccessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '',
  apiVersion: '2024-01',
};

interface ProductImage {
  id: number;
  src: string;
}

interface Product {
  id: number;
  title: string;
  images: ProductImage[];
}

// Fetch all products with images
async function fetchAllProducts(): Promise<Product[]> {
  const response = await fetch(
    `https://${CONFIG.shopifyDomain}.myshopify.com/admin/api/${CONFIG.apiVersion}/products.json?limit=250`,
    {
      headers: {
        'X-Shopify-Access-Token': CONFIG.adminAccessToken,
      },
    }
  );

  const result: any = await response.json();
  return result.products || [];
}

// Delete a specific image from a product
async function deleteImage(productId: number, imageId: number): Promise<boolean> {
  const response = await fetch(
    `https://${CONFIG.shopifyDomain}.myshopify.com/admin/api/${CONFIG.apiVersion}/products/${productId}/images/${imageId}.json`,
    {
      method: 'DELETE',
      headers: {
        'X-Shopify-Access-Token': CONFIG.adminAccessToken,
      },
    }
  );

  return response.ok;
}

async function main() {
  console.log('🧹 Removing PNG Images from Shopify Products\n');

  if (!CONFIG.adminAccessToken) {
    console.error('❌ SHOPIFY_ADMIN_ACCESS_TOKEN is required');
    process.exit(1);
  }

  // Fetch all products
  console.log('📖 Fetching all products...');
  const products = await fetchAllProducts();
  console.log(`   Found ${products.length} products\n`);

  let totalRemoved = 0;
  let totalKept = 0;

  for (const product of products) {
    const pngImages = product.images.filter(img => img.src.toLowerCase().includes('.png'));
    const otherImages = product.images.filter(img => !img.src.toLowerCase().includes('.png'));

    if (pngImages.length === 0) {
      console.log(`✓ ${product.title}: No PNG images`);
      totalKept += product.images.length;
      continue;
    }

    console.log(`\n🔍 ${product.title}:`);
    console.log(`   Total images: ${product.images.length}`);
    console.log(`   PNG images to remove: ${pngImages.length}`);
    console.log(`   Other images to keep: ${otherImages.length}`);

    // Delete PNG images
    for (const img of pngImages) {
      console.log(`   🗑️  Deleting: ${path.basename(img.src)}`);
      const success = await deleteImage(product.id, img.id);
      if (success) {
        totalRemoved++;
        console.log(`      ✅ Deleted`);
      } else {
        console.log(`      ❌ Failed to delete`);
      }
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    totalKept += otherImages.length;
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary');
  console.log('='.repeat(50));
  console.log(`🗑️  PNG images removed: ${totalRemoved}`);
  console.log(`✅ Images kept: ${totalKept}`);
}

main().catch(console.error);
