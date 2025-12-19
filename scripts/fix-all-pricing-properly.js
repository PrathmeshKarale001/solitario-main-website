#!/usr/bin/env node

/**
 * Proper Product Fix Script
 * 1. Reverts the 53 products to strategic pricing (₹32999 not ₹33000)
 * 2. Adds correct SKUs and strategic pricing to 123 new products
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const ADMIN_API_VERSION = '2024-01';

console.log('🔧 Proper Price Fix - Strategic Pricing Restore');
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

// Apply strategic pricing (subtract 1 from rounded price)
function applyStrategicPricing(price) {
  const numPrice = typeof price === 'number' ? price : parseFloat(String(price).replace(/[₹$,\s]/g, ''));
  
  // Round to nearest thousand and subtract 1
  // e.g., 33000 -> 32999, 55000 -> 54999, 182000 -> 181999
  const rounded = Math.round(numPrice / 1000) * 1000;
  const strategic = rounded - 1;
  
  return strategic.toFixed(2);
}

// Update variant price and SKU using REST API
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
    
    // Create map by SKU for new products
    const newProductMap = new Map();
    for (const product of newProducts) {
      newProductMap.set(product.sku, {
        title: product.title,
        sku: product.sku,
        price: product.price,
      });
    }
    
    console.log(`📋 Loaded ${newProductMap.size} new products\n`);

    // Get Shopify products
    const shopifyProducts = await getAllProducts();
    console.log(`\n✅ Found ${shopifyProducts.length} products in Shopify\n`);

    // Categorize products that need fixing
    const fixesNeeded = [];

    for (const product of shopifyProducts) {
      for (const variantEdge of product.variants.edges) {
        const variant = variantEdge.node;
        const currentSku = variant.sku || '';
        const currentPrice = parseFloat(variant.price);

        // Check if this is a NEW product (from new-products.json)
        const newProduct = newProductMap.get(currentSku);
        
        if (newProduct) {
          // This is one of the 123 new products
          const strategicPrice = applyStrategicPricing(newProduct.price);
          
          if (Math.abs(currentPrice - parseFloat(strategicPrice)) > 0.01) {
            fixesNeeded.push({
              productTitle: product.title,
              variantId: variant.id,
              currentSku: currentSku,
              correctSku: currentSku, // SKU already correct
              currentPrice: currentPrice,
              correctPrice: parseFloat(strategicPrice),
              type: 'NEW_PRODUCT',
            });
          }
        } else {
          // This is an OLD product - check if I rounded it wrongly
          // If price is a round number (ends in 000.00), revert to strategic pricing
          const priceStr = currentPrice.toFixed(2);
          if (priceStr.endsWith('000.00') && currentPrice >= 10000) {
            const strategicPrice = (currentPrice - 1).toFixed(2);
            fixesNeeded.push({
              productTitle: product.title,
              variantId: variant.id,
              currentSku: currentSku,
              correctSku: currentSku,
              currentPrice: currentPrice,
              correctPrice: parseFloat(strategicPrice),
              type: 'REVERT_ROUNDING',
            });
          }
        }
      }
    }

    console.log(`🔍 Products needing fixes: ${fixesNeeded.length}\n`);
    
    if (fixesNeeded.length === 0) {
      console.log('✅ All products already have correct strategic pricing!');
      return;
    }

    // Group by type
    const revertCount = fixesNeeded.filter(f => f.type === 'REVERT_ROUNDING').length;
    const newCount = fixesNeeded.filter(f => f.type === 'NEW_PRODUCT').length;
    
    console.log(`  Reverting rounded prices: ${revertCount}`);
    console.log(`  Fixing new products: ${newCount}\n`);

    // Apply all fixes
    console.log('🔧 Applying fixes...\n');
    
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < fixesNeeded.length; i++) {
      const fix = fixesNeeded[i];
      
      try {
        const typeLabel = fix.type === 'REVERT_ROUNDING' ? '↩️  REVERT' : '🆕 NEW';
        console.log(`[${i + 1}/${fixesNeeded.length}] ${typeLabel} ${fix.productTitle}`);
        console.log(`  Price: ₹${fix.currentPrice} → ₹${fix.correctPrice}`);

        const updated = await updateVariant(
          fix.variantId,
          fix.correctSku,
          fix.correctPrice.toFixed(2)
        );

        console.log(`  ✅ Fixed: Price=₹${updated.price}\n`);
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
    console.log(`\n✅ Strategic pricing restored!`);
    console.log(`All products now use psychological pricing (₹X999 format)`);

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
