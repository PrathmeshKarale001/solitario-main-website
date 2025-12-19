#!/usr/bin/env node

/**
 * Fix 123 New Products with Strategic Pricing
 * Applies psychological pricing (subtract 1 from round numbers)
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const ADMIN_API_VERSION = '2024-01';

console.log('🔧 Fix 123 New Products - Apply Strategic Pricing');
console.log('==================================================\n');

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
async function updateVariant(variantId, price) {
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
    
    // Create map by SKU with strategic pricing
    const priceMap = new Map();
    for (const product of newProducts) {
      // Apply strategic pricing: subtract 1 from price
      // 21000 → 20999, 11000 → 10999, etc.
      const strategicPrice = (product.price - 1).toFixed(2);
      priceMap.set(product.sku, {
        title: product.title,
        originalPrice: product.price,
        strategicPrice: strategicPrice,
      });
    }
    
    console.log(`📋 Loaded ${priceMap.size} new products with strategic pricing\n`);

    // Get Shopify products
    const shopifyProducts = await getAllProducts();
    console.log(`\n✅ Found ${shopifyProducts.length} products in Shopify\n`);

    // Find new products that need pricing fixed
    const fixesNeeded = [];
    let foundCount = 0;

    for (const product of shopifyProducts) {
      for (const variantEdge of product.variants.edges) {
        const variant = variantEdge.node;
        const productData = priceMap.get(variant.sku);

        if (productData) {
          foundCount++;
          const currentPrice = parseFloat(variant.price);
          const targetPrice = parseFloat(productData.strategicPrice);

          // Check if price needs updating
          if (Math.abs(currentPrice - targetPrice) > 0.01) {
            fixesNeeded.push({
              productTitle: product.title,
              variantId: variant.id,
              sku: variant.sku,
              currentPrice: currentPrice,
              targetPrice: targetPrice,
              originalPrice: productData.originalPrice,
            });
          }
        }
      }
    }

    console.log(`🔍 Found ${foundCount} new products in Shopify`);
    console.log(`🔧 Products needing price updates: ${fixesNeeded.length}\n`);

    if (fixesNeeded.length === 0) {
      console.log('✅ All new products already have strategic pricing!');
      return;
    }

    // Apply fixes
    console.log('💰 Applying strategic pricing...\n');
    
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < fixesNeeded.length; i++) {
      const fix = fixesNeeded[i];
      
      try {
        console.log(`[${i + 1}/${fixesNeeded.length}] ${fix.productTitle}`);
        console.log(`  SKU: ${fix.sku}`);
        console.log(`  Price: ₹${fix.currentPrice} → ₹${fix.targetPrice} (was ₹${fix.originalPrice})`);

        const updated = await updateVariant(
          fix.variantId,
          fix.targetPrice.toFixed(2)
        );

        console.log(`  ✅ Updated to: ₹${updated.price}\n`);
        successCount++;

        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`  ❌ Failed: ${error.message}\n`);
        failCount++;
      }
    }

    console.log('==================================================');
    console.log('📊 FINAL SUMMARY');
    console.log('==================================================');
    console.log(`✅ Successfully updated: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`\n✅ Strategic pricing applied to all new products!`);
    console.log(`Format: ₹20999, ₹10999, ₹33999 (psychological pricing)`);

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
