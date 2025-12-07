/**
 * Publish existing products to Storefront API
 * 
 * This script publishes all existing products to the Online Store sales channel
 * so they appear in the Storefront API.
 * 
 * Usage:
 *   npx ts-node publish-products.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import fetch from 'node-fetch';

// Load environment variables from project root .env.local
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const CONFIG = {
  shopifyDomain: process.env.SHOPIFY_STORE_DOMAIN || 'solitarioind',
  adminAccessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '',
  apiVersion: '2024-01',
};

interface ShopifyProductNode {
  id: string;
  title: string;
  status: string;
  publishedAt: string | null;
}

// Fetch all products from Admin API
async function fetchAllProducts(): Promise<ShopifyProductNode[]> {
  const products: ShopifyProductNode[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const query = `
      query getProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          edges {
            node {
              id
              title
              status
              publishedAt
            }
            cursor
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `;

    const response = await fetch(
      `https://${CONFIG.shopifyDomain}.myshopify.com/admin/api/${CONFIG.apiVersion}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': CONFIG.adminAccessToken,
        },
        body: JSON.stringify({
          query,
          variables: { first: 50, after: cursor },
        }),
      }
    );

    const result: any = await response.json();
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      break;
    }

    const edges = result.data?.products?.edges || [];
    for (const edge of edges) {
      products.push(edge.node);
      cursor = edge.cursor;
    }

    hasNextPage = result.data?.products?.pageInfo?.hasNextPage || false;
  }

  return products;
}

// Publish a product using REST API
async function publishProduct(productId: string): Promise<boolean> {
  // Extract numeric ID from GID
  const numericId = productId.replace('gid://shopify/Product/', '');
  
  const url = `https://${CONFIG.shopifyDomain}.myshopify.com/admin/api/${CONFIG.apiVersion}/products/${numericId}.json`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': CONFIG.adminAccessToken,
    },
    body: JSON.stringify({
      product: {
        id: numericId,
        status: 'active',
        published: true,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Failed to publish product ${numericId}: ${error}`);
    return false;
  }

  return true;
}

async function main() {
  console.log('🚀 Publishing Products to Storefront API\n');

  if (!CONFIG.adminAccessToken) {
    console.error('❌ SHOPIFY_ADMIN_ACCESS_TOKEN is required');
    process.exit(1);
  }

  // Fetch all products
  console.log('📖 Fetching all products...');
  const products = await fetchAllProducts();
  console.log(`   Found ${products.length} products\n`);

  // Find unpublished products
  const unpublished = products.filter(p => !p.publishedAt || p.status !== 'ACTIVE');
  console.log(`📦 ${unpublished.length} products need publishing\n`);

  if (unpublished.length === 0) {
    console.log('✅ All products are already published!');
    return;
  }

  let success = 0;
  let failed = 0;

  for (const product of unpublished) {
    console.log(`Publishing: ${product.title}`);
    
    const result = await publishProduct(product.id);
    if (result) {
      console.log(`   ✅ Published`);
      success++;
    } else {
      console.log(`   ❌ Failed`);
      failed++;
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary');
  console.log('='.repeat(50));
  console.log(`✅ Published: ${success}`);
  console.log(`❌ Failed: ${failed}`);
}

main().catch(console.error);
