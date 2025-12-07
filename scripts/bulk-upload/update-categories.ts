/**
 * Update product categories using Shopify's Standard Product Taxonomy
 * 
 * Shopify Category GIDs for Jewelry:
 * - Rings: gid://shopify/TaxonomyCategory/aa-3-2-7 (Apparel & Accessories > Jewelry > Rings)
 * - Necklaces: gid://shopify/TaxonomyCategory/aa-3-2-5 (Apparel & Accessories > Jewelry > Necklaces)
 * - Earrings: gid://shopify/TaxonomyCategory/aa-3-2-3 (Apparel & Accessories > Jewelry > Earrings)
 * - Bracelets: gid://shopify/TaxonomyCategory/aa-3-2-2 (Apparel & Accessories > Jewelry > Bracelets)
 * - Pendants: gid://shopify/TaxonomyCategory/aa-3-2-6 (Apparel & Accessories > Jewelry > Pendants & Charms)
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

// Shopify Standard Product Taxonomy GIDs for Jewelry categories
// Path: Apparel & Accessories > Jewelry > [Category]
const CATEGORY_GIDS: Record<string, string> = {
  'Rings': 'gid://shopify/TaxonomyCategory/aa-6-9',
  'Necklaces': 'gid://shopify/TaxonomyCategory/aa-6-8',
  'Earrings': 'gid://shopify/TaxonomyCategory/aa-6-6',
  'Bracelets': 'gid://shopify/TaxonomyCategory/aa-6-3',
  'Pendants': 'gid://shopify/TaxonomyCategory/aa-6-5', // Charms & Pendants
  'Jewelry': 'gid://shopify/TaxonomyCategory/aa-6', // Generic Jewelry
};

interface Product {
  id: string;
  title: string;
  productType: string;
}

// Fetch all products
async function fetchAllProducts(): Promise<Product[]> {
  const products: Product[] = [];
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
              productType
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

// Update product category using GraphQL mutation
async function updateProductCategory(productId: string, categoryGid: string): Promise<boolean> {
  const mutation = `
    mutation productUpdate($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
          category {
            id
            name
          }
        }
        userErrors {
          field
          message
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
        query: mutation,
        variables: {
          input: {
            id: productId,
            category: categoryGid,
          },
        },
      }),
    }
  );

  const result: any = await response.json();
  
  if (result.errors) {
    console.error('GraphQL errors:', result.errors);
    return false;
  }

  if (result.data?.productUpdate?.userErrors?.length > 0) {
    console.error('User errors:', result.data.productUpdate.userErrors);
    return false;
  }

  return true;
}

async function main() {
  console.log('🏷️  Updating Product Categories\n');

  if (!CONFIG.adminAccessToken) {
    console.error('❌ SHOPIFY_ADMIN_ACCESS_TOKEN is required');
    process.exit(1);
  }

  // Fetch all products
  console.log('📖 Fetching all products...');
  const products = await fetchAllProducts();
  console.log(`   Found ${products.length} products\n`);

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (const product of products) {
    const productType = product.productType || '';
    const categoryGid = CATEGORY_GIDS[productType];

    if (!categoryGid) {
      console.log(`⏭️  Skipping ${product.title} - Unknown category: "${productType}"`);
      skipped++;
      continue;
    }

    console.log(`Updating: ${product.title} -> ${productType}`);
    
    const result = await updateProductCategory(product.id, categoryGid);
    if (result) {
      console.log(`   ✅ Updated`);
      success++;
    } else {
      console.log(`   ❌ Failed`);
      failed++;
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary');
  console.log('='.repeat(50));
  console.log(`✅ Updated: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏭️  Skipped: ${skipped}`);
}

main().catch(console.error);
