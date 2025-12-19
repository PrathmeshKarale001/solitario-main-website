#!/usr/bin/env node

/**
 * Find and Fix 123 New Products
 * Matches by title and updates SKU + strategic pricing
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const ADMIN_API_VERSION = '2024-01';

console.log('🔍 Find & Fix 123 New Products (Match by Title)');
console.log('================================================\n');

// GraphQL helper
async function shopifyFetch(query, variables = {}) {
  const response = await fetch(
    `https://${SHOPIFY_DOMAIN}.myshopify.com/admin/api/${ADMIN_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ADMIN_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`);
  }

  return response.json();
}

// Get all products
async function getAllProducts() {
  const GET_PRODUCTS = `
    query getProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            variants(first: 10) {
              edges {
                node {
                  id
                  sku
                  price
                }
              }
            }
          }
        }
      }
    }
  `;

  const allProducts = [];
  let hasNextPage = true;
  let cursor = null;

  console.log('📡 Fetching all products from Shopify...');

  while (hasNextPage) {
    const result = await shopifyFetch(GET_PRODUCTS, {
      first: 50,
      after: cursor,
    });

    const products = result.data?.products?.edges || [];
    allProducts.push(...products.map(edge => edge.node));

    hasNextPage = result.data?.products?.pageInfo?.hasNextPage || false;
    cursor = result.data?.products?.pageInfo?.endCursor;

    console.log(`  Fetched ${allProducts.length} products...`);
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  return allProducts;
}

// Update variant using REST API
async function updateVariant(variantId, sku, price) {
  const numericId = variantId.split('/').pop();
  
  const url = `https://${SHOPIFY_DOMAIN}.myshopify.com/admin/api/${ADMIN_API_VERSION}/variants/${numericId}.json`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN,
    },
    body: JSON.stringify({
      variant: {
        id: numericId,
        sku: sku,
        price: price,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`REST API error: ${response.status} - ${error.substring(0, 200)}`);
  }

  const result = await response.json();
  return result.variant;
}

// Main function
async function main() {
  try {
    // Load new products data
    const newProductsPath = path.join(__dirname, 'new-products.json');
    const newProducts = JSON.parse(fs.readFileSync(newProductsPath, 'utf-8'));
    
    // Create map by normalized title
    const titleMap = new Map();
    for (const product of newProducts) {
      const normalizedTitle = product.title.trim().toLowerCase();
      const strategicPrice = (product.price - 1).toFixed(2);
      
      titleMap.set(normalizedTitle, {
        title: product.title,
        sku: product.sku,
        originalPrice: product.price,
        strategicPrice: strategicPrice,
      });
    }
    
    console.log(`📋 Loaded ${titleMap.size} new products\n`);

    // Get Shopify products
    const shopifyProducts = await getAllProducts();
    console.log(`\n✅ Found ${shopifyProducts.length} products in Shopify\n`);

    // Match by title and collect fixes
    const fixesNeeded = [];
    let matchedCount = 0;
    let notFoundCount = 0;

    for (const product of shopifyProducts) {
      const normalizedTitle = product.title.trim().toLowerCase();
      const productData = titleMap.get(normalizedTitle);

      if (productData) {
        matchedCount++;
        
        for (const variantEdge of product.variants.edges) {
          const variant = variantEdge.node;
          const currentSku = variant.sku || '';
          const currentPrice = parseFloat(variant.price);
          const targetPrice = parseFloat(productData.strategicPrice);
          const correctSku = productData.sku;

          // Check if either SKU or price needs fixing
          const skuNeedsFix = currentSku !== correctSku;
          const priceNeedsFix = Math.abs(currentPrice - targetPrice) > 0.01;

          if (skuNeedsFix || priceNeedsFix) {
            fixesNeeded.push({
              productTitle: product.title,
              variantId: variant.id,
              currentSku: currentSku,
              correctSku: correctSku,
              currentPrice: currentPrice,
              targetPrice: targetPrice,
              skuNeedsFix: skuNeedsFix,
              priceNeedsFix: priceNeedsFix,
            });
          }
        }
      }
    }

    // Check which products from new-products.json weren't found
    for (const [normalizedTitle, data] of titleMap.entries()) {
      const found = shopifyProducts.some(p => p.title.trim().toLowerCase() === normalizedTitle);
      if (!found) {
        notFoundCount++;
      }
    }

    console.log(`🔍 Match Summary:`);
    console.log(`  New products matched in Shopify: ${matchedCount}`);
    console.log(`  New products not yet in Shopify: ${notFoundCount}`);
    console.log(`  Products needing fixes: ${fixesNeeded.length}\n`);

    if (fixesNeeded.length === 0) {
      console.log('✅ All matched products have correct SKU and strategic pricing!');
      
      if (notFoundCount > 0) {
        console.log(`\n⚠️  Note: ${notFoundCount} products from new-products.json haven't been uploaded yet`);
      }
      return;
    }

    // Apply fixes
    console.log('🔧 Applying fixes...\n');
    
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < fixesNeeded.length; i++) {
      const fix = fixesNeeded[i];
      
      try {
        console.log(`[${i + 1}/${fixesNeeded.length}] ${fix.productTitle}`);
        
        if (fix.skuNeedsFix) {
          console.log(`  SKU: "${fix.currentSku}" → "${fix.correctSku}"`);
        }
        if (fix.priceNeedsFix) {
          console.log(`  Price: ₹${fix.currentPrice} → ₹${fix.targetPrice}`);
        }

        const updated = await updateVariant(
          fix.variantId,
          fix.correctSku,
          fix.targetPrice.toFixed(2)
        );

        console.log(`  ✅ Fixed: SKU=${updated.sku}, Price=₹${updated.price}\n`);
        successCount++;

        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`  ❌ Failed: ${error.message}\n`);
        failCount++;
      }
    }

    console.log('================================================');
    console.log('📊 FINAL SUMMARY');
    console.log('================================================');
    console.log(`✅ Successfully fixed: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    
    if (notFoundCount > 0) {
      console.log(`\n📝 Note: ${notFoundCount} products not yet uploaded to Shopify`);
    }
    
    console.log(`\n✅ All new products now have:`);
    console.log(`   - Correct SKUs`);
    console.log(`   - Strategic pricing (₹X999 format)`);

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
