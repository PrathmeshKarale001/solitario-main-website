#!/usr/bin/env node

/**
 * Bulk Product Upload Script for Shopify
 * 
 * Usage:
 *   node scripts/upload-products-to-shopify.js [--start=0] [--batch=5] [--dry-run]
 * 
 * Options:
 *   --start=N    Start from product index N (default: 0)
 *   --batch=N    Upload N products per batch (default: 5)
 *   --dry-run    Don't actually upload, just show what would be uploaded
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const ADMIN_API_VERSION = '2024-01';

if (!SHOPIFY_DOMAIN || !ADMIN_TOKEN) {
  console.error('❌ Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN in .env.local');
  process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
let startIndex = 0;
let batchSize = 5;
let dryRun = false;

for (const arg of args) {
  if (arg.startsWith('--start=')) {
    startIndex = parseInt(arg.split('=')[1], 10);
  } else if (arg.startsWith('--batch=')) {
    batchSize = parseInt(arg.split('=')[1], 10);
  } else if (arg === '--dry-run') {
    dryRun = true;
  }
}

// GraphQL helper
async function shopifyAdminFetch(query, variables = {}) {
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

// GraphQL Mutations
const CREATE_STAGED_UPLOAD_MUTATION = `
  mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets {
        url
        resourceUrl
        parameters {
          name
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CREATE_PRODUCT_MUTATION = `
  mutation productCreate($input: ProductInput!, $media: [CreateMediaInput!]) {
    productCreate(input: $input, media: $media) {
      product {
        id
        title
        handle
        status
        variants(first: 1) {
          edges {
            node {
              id
              price
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_VARIANT_MUTATION = `
  mutation productVariantUpdate($input: ProductVariantInput!) {
    productVariantUpdate(input: $input) {
      productVariant {
        id
        price
        sku
        inventoryItem {
          id
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const PUBLISH_PRODUCT_MUTATION = `
  mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      publishable {
        availablePublicationsCount {
          count
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const GET_PUBLICATIONS_QUERY = `
  query {
    publications(first: 10) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

// Set inventory level for a variant
const INVENTORY_ACTIVATE_MUTATION = `
  mutation inventoryActivate($inventoryItemId: ID!, $locationId: ID!, $available: Int) {
    inventoryActivate(inventoryItemId: $inventoryItemId, locationId: $locationId, available: $available) {
      inventoryLevel {
        id
        available
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Get locations for inventory
const GET_LOCATIONS_QUERY = `
  query {
    locations(first: 5) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

// Set product category using Shopify Standard Taxonomy
const UPDATE_PRODUCT_CATEGORY_MUTATION = `
  mutation productUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
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

// Shopify Standard Product Taxonomy GIDs for Jewelry categories
const TAXONOMY_CATEGORY_GIDS = {
  'Rings': 'gid://shopify/TaxonomyCategory/aa-6-9',
  'rings': 'gid://shopify/TaxonomyCategory/aa-6-9',
  'Necklaces': 'gid://shopify/TaxonomyCategory/aa-6-8',
  'necklaces': 'gid://shopify/TaxonomyCategory/aa-6-8',
  'Earrings': 'gid://shopify/TaxonomyCategory/aa-6-6',
  'earrings': 'gid://shopify/TaxonomyCategory/aa-6-6',
  'Bracelets': 'gid://shopify/TaxonomyCategory/aa-6-3',
  'bracelets': 'gid://shopify/TaxonomyCategory/aa-6-3',
  'Pendants': 'gid://shopify/TaxonomyCategory/aa-6-5',
  'pendants': 'gid://shopify/TaxonomyCategory/aa-6-5',
  'Jewelry': 'gid://shopify/TaxonomyCategory/aa-6',
};

// Upload image to Shopify using FILE_CREATE mutation (simpler approach)
const FILE_CREATE_MUTATION = `
  mutation fileCreate($files: [FileCreateInput!]!) {
    fileCreate(files: $files) {
      files {
        id
        alt
        createdAt
        ... on MediaImage {
          image {
            url
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Create staged upload and upload file
async function uploadImageToShopify(imagePath) {
  try {
    const fileName = path.basename(imagePath);
    const fileBuffer = fs.readFileSync(imagePath);
    const fileSize = fileBuffer.length;
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

    // Step 1: Create staged upload with PUT method (simpler)
    const stagedResult = await shopifyAdminFetch(CREATE_STAGED_UPLOAD_MUTATION, {
      input: [{
        filename: fileName,
        mimeType: mimeType,
        resource: 'IMAGE',
        fileSize: fileSize.toString(),
        httpMethod: 'PUT',
      }],
    });

    if (stagedResult.errors || stagedResult.data?.stagedUploadsCreate?.userErrors?.length > 0) {
      console.error('  ⚠️ Staged upload error:', stagedResult.errors || stagedResult.data?.stagedUploadsCreate?.userErrors);
      return null;
    }

    const target = stagedResult.data?.stagedUploadsCreate?.stagedTargets?.[0];
    if (!target) {
      console.error('  ⚠️ No staged target returned');
      return null;
    }

    // Step 2: Upload file using PUT request (much simpler)
    const uploadResponse = await fetch(target.url, {
      method: 'PUT',
      body: fileBuffer,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': fileSize.toString(),
      },
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('  ⚠️ Upload failed:', uploadResponse.status, errorText.substring(0, 100));
      return null;
    }

    return target.resourceUrl;
  } catch (error) {
    console.error('  ⚠️ Image upload error:', error.message);
    return null;
  }
}

// Set product category
async function setProductCategory(productId, productType) {
  const categoryGid = TAXONOMY_CATEGORY_GIDS[productType] || TAXONOMY_CATEGORY_GIDS['Jewelry'];
  
  const result = await shopifyAdminFetch(UPDATE_PRODUCT_CATEGORY_MUTATION, {
    input: {
      id: productId,
      category: categoryGid,
    },
  });

  if (result.data?.productUpdate?.userErrors?.length > 0) {
    console.log(`  ⚠️ Category warning: ${JSON.stringify(result.data.productUpdate.userErrors)}`);
  }
}

// Set inventory for a variant
async function setInventory(inventoryItemId, locationId, quantity = 10) {
  const result = await shopifyAdminFetch(INVENTORY_ACTIVATE_MUTATION, {
    inventoryItemId,
    locationId,
    available: quantity,
  });

  if (result.data?.inventoryActivate?.userErrors?.length > 0) {
    console.log(`  ⚠️ Inventory warning: ${JSON.stringify(result.data.inventoryActivate.userErrors)}`);
  }
}

// Create a single product
async function createProduct(product, publications, locationId) {
  try {
    console.log(`\n📦 Creating: ${product.title} (${product.sku})`);
    
    // Upload images
    const mediaInputs = [];
    console.log(`  📷 Uploading ${product.images.length} images...`);
    
    for (let i = 0; i < Math.min(product.images.length, 4); i++) {
      const imagePath = product.images[i];
      if (!fs.existsSync(imagePath)) {
        console.log(`  ⚠️ Image not found: ${imagePath}`);
        continue;
      }
      
      const resourceUrl = await uploadImageToShopify(imagePath);
      if (resourceUrl) {
        mediaInputs.push({
          originalSource: resourceUrl,
          mediaContentType: 'IMAGE',
          alt: product.title,
        });
        console.log(`  ✅ Uploaded image ${i + 1}`);
      }
      
      // Small delay between image uploads
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Create product with proper category
    console.log(`  🏗️ Creating product in Shopify...`);
    const productResult = await shopifyAdminFetch(CREATE_PRODUCT_MUTATION, {
      input: {
        title: product.title,
        descriptionHtml: product.descriptionHtml,
        vendor: 'Solitario',
        productType: product.productType,
        tags: product.tags.filter(t => t),
        status: 'ACTIVE',
      },
      media: mediaInputs.length > 0 ? mediaInputs : undefined,
    });

    if (productResult.errors || productResult.data?.productCreate?.userErrors?.length > 0) {
      const errors = productResult.errors || productResult.data?.productCreate?.userErrors;
      console.error(`  ❌ Product creation failed:`, JSON.stringify(errors));
      return { success: false, error: JSON.stringify(errors) };
    }

    const productId = productResult.data?.productCreate?.product?.id;
    const variantId = productResult.data?.productCreate?.product?.variants?.edges?.[0]?.node?.id;
    const handle = productResult.data?.productCreate?.product?.handle;

    console.log(`  ✅ Product created: ${handle}`);

    // Update variant with price, SKU, and inventory management
    if (variantId) {
      console.log(`  💰 Setting price: ₹${product.price} & SKU: ${product.sku}`);
      
      // Add delay to ensure product is fully created
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const variantResult = await shopifyAdminFetch(UPDATE_VARIANT_MUTATION, {
        input: {
          id: variantId,
          price: product.price.toString(),
          sku: product.sku,
          inventoryManagement: 'SHOPIFY',
        },
      });
      
      // Check for errors in variant update
      if (variantResult.errors || variantResult.data?.productVariantUpdate?.userErrors?.length > 0) {
        const errors = variantResult.errors || variantResult.data?.productVariantUpdate?.userErrors;
        console.error(`  ❌ Variant update failed:`, JSON.stringify(errors));
        console.error(`  ⚠️ Price may not be set correctly for ${product.sku}`);
      } else {
        const updatedPrice = variantResult.data?.productVariantUpdate?.productVariant?.price;
        console.log(`  ✅ Price confirmed: ₹${updatedPrice}`);
      }
      
      // Get inventory item ID and set inventory
      if (locationId) {
        // Need to get inventory item ID from variant
        const inventoryItemId = variantResult.data?.productVariantUpdate?.productVariant?.inventoryItem?.id;
        if (inventoryItemId) {
          console.log(`  📦 Setting inventory: 10 units`);
          await setInventory(inventoryItemId, locationId, 10);
        }
      }
    }

    // Set product category using Shopify Standard Taxonomy
    if (productId) {
      console.log(`  🏷️ Setting category: ${product.productType}`);
      await setProductCategory(productId, product.productType);
    }

    // Publish to sales channels
    if (publications.length > 0 && productId) {
      console.log(`  🌐 Publishing to ${publications.length} channels...`);
      await shopifyAdminFetch(PUBLISH_PRODUCT_MUTATION, {
        id: productId,
        input: publications.map(pubId => ({ publicationId: pubId })),
      });
    }

    console.log(`  ✅ Done: ${product.title}`);
    return { success: true, productId, handle };
  } catch (error) {
    console.error(`  ❌ Error:`, error.message);
    return { success: false, error: error.message };
  }
}

// Main function
async function main() {
  console.log('🚀 Shopify Bulk Product Upload');
  console.log('================================');
  console.log(`Store: ${SHOPIFY_DOMAIN}`);
  console.log(`Start Index: ${startIndex}`);
  console.log(`Batch Size: ${batchSize}`);
  console.log(`Dry Run: ${dryRun}`);
  console.log('');

  // Load products
  const productsPath = path.join(__dirname, 'new-products.json');
  if (!fs.existsSync(productsPath)) {
    console.error('❌ Products file not found:', productsPath);
    console.error('Run the Python script first to generate new-products.json');
    process.exit(1);
  }

  const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
  console.log(`📋 Total products in file: ${products.length}`);

  // Get batch
  const batch = products.slice(startIndex, startIndex + batchSize);
  console.log(`📦 Processing batch: ${startIndex} to ${startIndex + batch.length - 1}`);
  console.log('');

  if (dryRun) {
    console.log('🔍 DRY RUN - Products that would be uploaded:');
    for (const product of batch) {
      console.log(`  - ${product.sku}: ${product.title} (₹${product.price}) - ${product.images.length} images`);
    }
    console.log('');
    console.log('Run without --dry-run to actually upload.');
    return;
  }

  // Get publications
  console.log('📡 Fetching sales channels...');
  const pubResult = await shopifyAdminFetch(GET_PUBLICATIONS_QUERY);
  const publications = (pubResult.data?.publications?.edges || [])
    .map(pub => pub.node.id);
  console.log(`  Found ${publications.length} channels`);

  // Get locations for inventory
  console.log('📍 Fetching inventory locations...');
  const locResult = await shopifyAdminFetch(GET_LOCATIONS_QUERY);
  const locations = locResult.data?.locations?.edges || [];
  const locationId = locations[0]?.node?.id || null;
  console.log(`  Found ${locations.length} location(s)${locationId ? ': ' + locations[0]?.node?.name : ''}`);

  // Process batch
  const results = [];
  for (const product of batch) {
    const result = await createProduct(product, publications, locationId);
    results.push({ sku: product.sku, title: product.title, ...result });
    
    // Delay between products to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  console.log('\n================================');
  console.log('📊 SUMMARY');
  console.log('================================');
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  
  if (failCount > 0) {
    console.log('\nFailed products:');
    for (const r of results.filter(r => !r.success)) {
      console.log(`  - ${r.sku}: ${r.title} - ${r.error}`);
    }
  }

  const nextIndex = startIndex + batchSize;
  if (nextIndex < products.length) {
    console.log(`\n📌 Next batch: node scripts/upload-products-to-shopify.js --start=${nextIndex} --batch=${batchSize}`);
  } else {
    console.log('\n🎉 All products processed!');
  }
}

main().catch(console.error);
