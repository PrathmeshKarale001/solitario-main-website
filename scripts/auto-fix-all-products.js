#!/usr/bin/env node

/**
 * Automatic Product Fix Script
 * Fixes SKU and pricing for all products by matching titles
 * Runs automatically without user intervention
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const ADMIN_API_VERSION = '2024-01';

// Path to Excel spreadsheet with correct data
const EXCEL_PATH = '/Users/prathmeshkarale/Downloads/drive-download-20251206T104647Z-1-001/04-Product details/PHASE 1 PRODUCT DETAILS.xlsx';

console.log('🔧 Auto-Fix All Products Script');
console.log('================================\n');

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

// Read Excel data
function readExcelData() {
  console.log('\n📖 Reading Excel spreadsheet...');
  
  if (!fs.existsSync(EXCEL_PATH)) {
    throw new Error(`Excel file not found: ${EXCEL_PATH}`);
  }

  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  console.log(`  Found ${data.length} products in Excel\n`);

  // Create map by product name (title)
  const productMap = new Map();
  
  for (const row of data) {
    const title = row['Product Name'];
    const styleNo = row['Style No.'];
    const tagPrice = row['Tag Price'];
    
    if (title && styleNo && tagPrice) {
      // Normalize title for matching
      const normalizedTitle = title.trim().toLowerCase();
      productMap.set(normalizedTitle, {
        title: title,
        sku: styleNo,
        price: parsePrice(tagPrice),
        jewelCode: row['Jewel Code'],
      });
    }
  }

  return productMap;
}

// Parse price
function parsePrice(price) {
  if (typeof price === 'number') {
    return price.toFixed(2);
  }
  const cleaned = String(price).replace(/[₹$,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? '0.00' : parsed.toFixed(2);
}

// Update variant SKU and price using REST API
async function updateVariant(variantId, sku, price) {
  // Extract numeric ID from GraphQL GID
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
    // Read Excel data
    const excelData = readExcelData();

    // Get Shopify products
    const shopifyProducts = await getAllProducts();
    console.log(`\n✅ Found ${shopifyProducts.length} products in Shopify\n`);

    // Match and fix products
    console.log('🔍 Matching products and applying fixes...\n');
    
    const fixes = [];
    let matched = 0;
    let unmatched = 0;

    for (const product of shopifyProducts) {
      const normalizedTitle = product.title.trim().toLowerCase();
      const excelProduct = excelData.get(normalizedTitle);

      if (!excelProduct) {
        unmatched++;
        continue;
      }

      matched++;

      for (const variantEdge of product.variants.edges) {
        const variant = variantEdge.node;
        const currentSku = variant.sku || '';
        const currentPrice = parseFloat(variant.price);
        const correctSku = excelProduct.sku;
        const correctPrice = parseFloat(excelProduct.price);

        // Check if fix needed
        const skuNeedsFix = currentSku !== correctSku;
        const priceNeedsFix = Math.abs(currentPrice - correctPrice) > 0.01;

        if (skuNeedsFix || priceNeedsFix) {
          fixes.push({
            productTitle: product.title,
            variantId: variant.id,
            currentSku: currentSku,
            correctSku: correctSku,
            currentPrice: currentPrice,
            correctPrice: correctPrice,
            skuNeedsFix: skuNeedsFix,
            priceNeedsFix: priceNeedsFix,
          });
        }
      }
    }

    console.log(`📊 Match Summary:`);
    console.log(`  Matched: ${matched}`);
    console.log(`  Unmatched: ${unmatched}`);
    console.log(`  Need fixes: ${fixes.length}\n`);

    if (fixes.length === 0) {
      console.log('✅ All products are correct!');
      return;
    }

    // Apply fixes automatically
    console.log(`🔧 Applying ${fixes.length} fixes automatically...\n`);
    
    const results = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < fixes.length; i++) {
      const fix = fixes[i];
      
      try {
        console.log(`[${i + 1}/${fixes.length}] ${fix.productTitle}`);
        
        if (fix.skuNeedsFix) {
          console.log(`  SKU: "${fix.currentSku}" → "${fix.correctSku}"`);
        }
        if (fix.priceNeedsFix) {
          console.log(`  Price: ₹${fix.currentPrice} → ₹${fix.correctPrice}`);
        }

        const updated = await updateVariant(
          fix.variantId,
          fix.correctSku,
          fix.correctPrice.toFixed(2)
        );

        console.log(`  ✅ Fixed: SKU=${updated.sku}, Price=₹${updated.price}\n`);
        successCount++;

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`  ❌ Failed: ${error.message}\n`);
        failCount++;
        results.push({ ...fix, error: error.message });
      }
    }

    // Final summary
    console.log('================================');
    console.log('📊 FINAL SUMMARY');
    console.log('================================');
    console.log(`✅ Successfully fixed: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);

    if (failCount > 0) {
      console.log('\n❌ Failed fixes:');
      for (const r of results.filter(r => r.error)) {
        console.log(`  - ${r.productTitle}: ${r.error}`);
      }
    }

    console.log('\n✅ Auto-fix complete!');

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
