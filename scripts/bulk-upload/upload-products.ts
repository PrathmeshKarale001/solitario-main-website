/**
 * Solitario Bulk Product Upload Script
 * 
 * This script reads product data from an Excel spreadsheet and uploads
 * products with images to Shopify using the Admin API.
 * 
 * Usage:
 *   npx ts-node scripts/bulk-upload/upload-products.ts
 * 
 * Options:
 *   --dry-run    Preview what would be uploaded without making changes
 *   --limit=N    Only process first N products
 *   --start=N    Start from product N (0-indexed)
 */

import * as dotenv from 'dotenv';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';

// Load environment variables from project root .env.local
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

// Configuration
const CONFIG = {
  // Paths
  spreadsheetPath: '/Users/prathmeshkarale/Downloads/drive-download-20251206T104647Z-1-001/04-Product details/PHASE 1 PRODUCT DETAILS.xlsx',
  imagesBasePath: '/Users/prathmeshkarale/Downloads/drive-download-20251206T104647Z-1-001/04-Product details/Slot 1 Vermeil Renders OG',
  
  // Shopify credentials (from .env.local)
  shopifyDomain: process.env.SHOPIFY_STORE_DOMAIN || 'solitarioind',
  adminAccessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '',
  
  // API version
  apiVersion: '2024-01',
};

// Types
interface SpreadsheetRow {
  'Jewel Code': string;
  'Style No.': string;
  'Product Name': string;
  'Category': string;
  'Subcategory': string;
  'Gender': string;
  'Occasion Type': string;
  'Description (long)': string;
  'Description (short)': string;
  'Tag Price': number | string;
  'Colour': string;
  'Metal Type': string;
  'No. Of Diamonds': number;
  'Diamond Weight (Carats)': number;
  'Colour Stone Weight (Carats)': number;
  'Total Weight (Grams)': number;
  [key: string]: any;
}

interface ShopifyProduct {
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  tags: string[];
  variants: ShopifyVariant[];
  options: ShopifyOption[];
  images: ShopifyImage[];
  metafields: ShopifyMetafield[];
}

interface ShopifyVariant {
  price: string;
  sku: string;
  inventory_management: string;
  inventory_quantity: number;
  weight: number;
  weight_unit: string;
}

interface ShopifyOption {
  name: string;
  values: string[];
}

interface ShopifyImage {
  src?: string;
  attachment?: string;
  filename?: string;
  alt?: string;
}

interface ShopifyMetafield {
  namespace: string;
  key: string;
  value: string;
  type: string;
}

// Helper: Read Excel file
function readSpreadsheet(filePath: string): SpreadsheetRow[] {
  console.log(`📖 Reading spreadsheet: ${filePath}`);
  
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const data = XLSX.utils.sheet_to_json<SpreadsheetRow>(worksheet);
  console.log(`   Found ${data.length} products`);
  
  return data;
}

// Helper: Get images for a product by Jewel Code
function getProductImages(jewelCode: string): string[] {
  const productFolder = path.join(CONFIG.imagesBasePath, jewelCode);
  
  if (!fs.existsSync(productFolder)) {
    console.warn(`   ⚠️ No image folder found for ${jewelCode}`);
    return [];
  }
  
  const files = fs.readdirSync(productFolder);
  const imageFiles = files
    .filter(f => /\.(jpg|jpeg|webp)$/i.test(f)) // Exclude PNG - only JPG/JPEG/WEBP
    .sort() // Ensure consistent order (A, B, C...)
    .map(f => path.join(productFolder, f));
  
  return imageFiles;
}

// Helper: Convert image to base64
function imageToBase64(imagePath: string): string {
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString('base64');
}

// Helper: Parse price from spreadsheet
function parsePrice(price: number | string): string {
  if (typeof price === 'number') {
    return price.toFixed(2);
  }
  // Remove currency symbols and commas
  const cleaned = String(price).replace(/[₹$,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? '0.00' : parsed.toFixed(2);
}

// Helper: Validate and normalize category
function validateAndNormalizeCategory(category: string | undefined): string {
  if (!category || category.trim() === '') {
    console.warn('   ⚠️ Category is empty, using default: Jewelry');
    return 'Jewelry';
  }
  
  // Normalize category (capitalize first letter of each word)
  const normalized = category.trim().split(/\s+/).map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
  
  // Map common variations to standard categories
  const categoryMapping: Record<string, string> = {
    'Ring': 'Rings',
    'Necklace': 'Necklaces',
    'Earring': 'Earrings',
    'Bracelet': 'Bracelets',
    'Pendant': 'Pendants',
    'Earrings': 'Earrings',
    'Rings': 'Rings',
    'Necklaces': 'Necklaces',
    'Bracelets': 'Bracelets',
    'Pendants': 'Pendants',
    'Jewelry': 'Jewelry',
    'Jewellery': 'Jewelry',
  };
  
  return categoryMapping[normalized] || normalized;
}

// Helper: Generate category slug for URLs
function generateCategorySlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Helper: Generate tags from product data
function generateTags(row: SpreadsheetRow): string[] {
  const tags: string[] = [];
  
  // Use normalized category for tags
  const normalizedCategory = validateAndNormalizeCategory(row.Category);
  tags.push(normalizedCategory);
  
  if (row.Subcategory) tags.push(row.Subcategory);
  if (row.Gender) tags.push(row.Gender);
  if (row['Occasion Type']) {
    // Split multiple occasions
    const occasions = String(row['Occasion Type']).split(/[,&]/);
    occasions.forEach(o => tags.push(o.trim()));
  }
  if (row.Colour) tags.push(row.Colour);
  if (row['Metal Type']) tags.push(row['Metal Type']);
  
  // Add material tags
  tags.push('18K Vermeil Gold');
  if (row['No. Of Diamonds'] && Number(row['No. Of Diamonds']) > 0) {
    tags.push('Diamond');
  }
  if (row['Colour Stone Weight (Carats)'] && Number(row['Colour Stone Weight (Carats)']) > 0) {
    tags.push('Color Stone');
  }
  
  return [...new Set(tags)].filter(Boolean); // Remove duplicates and empty
}

// Helper: Build HTML description
function buildDescription(row: SpreadsheetRow): string {
  const longDesc = row['Description (long)'] || row['Description (short)'] || '';
  
  // Build specifications table
  const specs: string[] = [];
  
  if (row['Metal Type']) specs.push(`<li><strong>Metal:</strong> ${row['Metal Type']}</li>`);
  if (row.Colour) specs.push(`<li><strong>Color:</strong> ${row.Colour}</li>`);
  if (row['Total Weight (Grams)']) specs.push(`<li><strong>Weight:</strong> ${row['Total Weight (Grams)']}g</li>`);
  if (row['No. Of Diamonds']) specs.push(`<li><strong>Diamonds:</strong> ${row['No. Of Diamonds']} pcs</li>`);
  if (row['Diamond Weight (Carats)']) specs.push(`<li><strong>Diamond Weight:</strong> ${row['Diamond Weight (Carats)']} carats</li>`);
  if (row['Colour Stone Weight (Carats)']) specs.push(`<li><strong>Color Stone Weight:</strong> ${row['Colour Stone Weight (Carats)']} carats</li>`);
  
  return `
    <div class="product-description">
      <p>${longDesc}</p>
      ${specs.length > 0 ? `
        <h4>Specifications</h4>
        <ul>${specs.join('')}</ul>
      ` : ''}
    </div>
  `.trim();
}

// Transform spreadsheet row to Shopify product
function transformToShopifyProduct(row: SpreadsheetRow): ShopifyProduct & { status: string; published: boolean } {
  const jewelCode = row['Jewel Code'] || '';
  const styleNo = row['Style No.'] || '';
  const images = getProductImages(jewelCode);
  
  // Validate required fields
  const errors: string[] = [];
  
  if (!row['Product Name'] || row['Product Name'].trim() === '') {
    errors.push('Product Name is required');
  }
  
  if (!row['Style No.'] || row['Style No.'].trim() === '') {
    errors.push('Style No. is required for SKU');
  }
  
  if (!row['Jewel Code'] || row['Jewel Code'].trim() === '') {
    errors.push('Jewel Code is required for image folder');
  }
  
  if (!row['Tag Price'] || row['Tag Price'] === '') {
    errors.push('Tag Price is required');
  }
  
  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(', ')}`);
  }
  
  const normalizedCategory = validateAndNormalizeCategory(row.Category);
  
  const product: ShopifyProduct & { status: string; published: boolean } = {
    title: row['Product Name'],
    body_html: buildDescription(row),
    vendor: 'Solitario',
    product_type: normalizedCategory,
    tags: generateTags(row),
    status: 'active', // Make product active
    published: true, // Publish to all sales channels including Storefront API
    variants: [
      {
        price: parsePrice(row['Tag Price']),
        sku: styleNo, // SKU is now required and validated
        inventory_management: 'shopify',
        inventory_quantity: 10, // Default inventory
        weight: Number(row['Total Weight (Grams)']) || 0,
        weight_unit: 'g',
      }
    ],
    options: [],
    images: images.map((imgPath, index) => ({
      attachment: imageToBase64(imgPath),
      filename: path.basename(imgPath),
      alt: `${row['Product Name']} - View ${index + 1}`,
    })),
    metafields: [
      {
        namespace: 'custom',
        key: 'jewel_code',
        value: jewelCode,
        type: 'single_line_text_field',
      },
      {
        namespace: 'custom',
        key: 'style_number',
        value: styleNo,
        type: 'single_line_text_field',
      },
      {
        namespace: 'custom',
        key: 'subcategory',
        value: row.Subcategory || '',
        type: 'single_line_text_field',
      },
      {
        namespace: 'custom',
        key: 'occasion',
        value: row['Occasion Type'] || '',
        type: 'single_line_text_field',
      },
      {
        namespace: 'custom',
        key: 'gender',
        value: row.Gender || '',
        type: 'single_line_text_field',
      },
      {
        namespace: 'specifications',
        key: 'metal_type',
        value: row['Metal Type'] || '',
        type: 'single_line_text_field',
      },
      {
        namespace: 'specifications',
        key: 'metal_color',
        value: row.Colour || '',
        type: 'single_line_text_field',
      },
      {
        namespace: 'specifications',
        key: 'diamond_count',
        value: String(row['No. Of Diamonds'] || 0),
        type: 'number_integer',
      },
      {
        namespace: 'specifications',
        key: 'diamond_weight',
        value: String(row['Diamond Weight (Carats)'] || 0),
        type: 'number_decimal',
      },
      {
        namespace: 'specifications',
        key: 'color_stone_weight',
        value: String(row['Colour Stone Weight (Carats)'] || 0),
        type: 'number_decimal',
      },
    ].filter(m => m.value), // Only include metafields with values
  };
  
  return product;
}

// Publication IDs for sales channels
const PUBLICATION_IDS = {
  onlineStore: 'gid://shopify/Publication/282968293651',
  storefrontApi: 'gid://shopify/Publication/283697545491',
};

// Shopify Standard Product Taxonomy GIDs for Jewelry categories
const TAXONOMY_CATEGORY_GIDS: Record<string, string> = {
  'Rings': 'gid://shopify/TaxonomyCategory/aa-6-9',
  'Necklaces': 'gid://shopify/TaxonomyCategory/aa-6-8',
  'Earrings': 'gid://shopify/TaxonomyCategory/aa-6-6',
  'Bracelets': 'gid://shopify/TaxonomyCategory/aa-6-3',
  'Pendants': 'gid://shopify/TaxonomyCategory/aa-6-5',
  'Jewelry': 'gid://shopify/TaxonomyCategory/aa-6',
};

// Set product category using GraphQL
async function setProductCategory(productId: string, productType: string): Promise<void> {
  const categoryGid = TAXONOMY_CATEGORY_GIDS[productType] || TAXONOMY_CATEGORY_GIDS['Jewelry'];
  
  const mutation = `
    mutation productUpdate($input: ProductInput!) {
      productUpdate(input: $input) {
        userErrors { field message }
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
            id: `gid://shopify/Product/${productId}`,
            category: categoryGid,
          },
        },
      }),
    }
  );

  const result: any = await response.json();
  if (result.data?.productUpdate?.userErrors?.length > 0) {
    console.warn(`   ⚠️ Category warning: ${JSON.stringify(result.data.productUpdate.userErrors)}`);
  }
}

// Publish product to all sales channels
async function publishProductToChannels(productId: string): Promise<void> {
  const mutation = `
    mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
      publishablePublish(id: $id, input: $input) {
        userErrors { field message }
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
          id: `gid://shopify/Product/${productId}`,
          input: [
            { publicationId: PUBLICATION_IDS.onlineStore },
            { publicationId: PUBLICATION_IDS.storefrontApi },
          ],
        },
      }),
    }
  );

  const result: any = await response.json();
  if (result.data?.publishablePublish?.userErrors?.length > 0) {
    console.warn(`   ⚠️ Publication warning: ${JSON.stringify(result.data.publishablePublish.userErrors)}`);
  }
}

// Upload product to Shopify
async function uploadProduct(product: ShopifyProduct, dryRun: boolean = false): Promise<any> {
  if (dryRun) {
    console.log(`   [DRY RUN] Would create: ${product.title}`);
    console.log(`   - Price: ₹${product.variants[0].price}`);
    console.log(`   - SKU: ${product.variants[0].sku}`);
    console.log(`   - Images: ${product.images.length}`);
    console.log(`   - Tags: ${product.tags.join(', ')}`);
    return { id: 'dry-run', title: product.title };
  }
  
  const url = `https://${CONFIG.shopifyDomain}.myshopify.com/admin/api/${CONFIG.apiVersion}/products.json`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': CONFIG.adminAccessToken,
    },
    body: JSON.stringify({ product }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create product: ${response.status} - ${error}`);
  }
  
  const result = await response.json();
  const createdProduct = result.product;
  
  // Set product category using Shopify Standard Taxonomy
  await setProductCategory(createdProduct.id, createdProduct.product_type);
  
  // Publish to all sales channels (Online Store + Storefront API)
  await publishProductToChannels(createdProduct.id);
  
  return createdProduct;
}

// Main execution
async function main() {
  console.log('🚀 Solitario Bulk Product Upload\n');
  
  // Parse CLI arguments
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const limitArg = args.find(a => a.startsWith('--limit='));
  const startArg = args.find(a => a.startsWith('--start='));
  const productArg = args.find(a => a.startsWith('--product='));
  
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : undefined;
  const start = startArg ? parseInt(startArg.split('=')[1]) : 0;
  const specificProduct = productArg ? productArg.split('=')[1] : undefined;
  
  if (dryRun) {
    console.log('⚠️  DRY RUN MODE - No changes will be made\n');
  }
  
  // Validate configuration
  if (!CONFIG.adminAccessToken && !dryRun) {
    console.error('❌ SHOPIFY_ADMIN_ACCESS_TOKEN is required');
    console.log('   Set it in your .env.local file or as an environment variable');
    process.exit(1);
  }
  
  // Read spreadsheet
  const products = readSpreadsheet(CONFIG.spreadsheetPath);
  
  let productsToProcess: any[] = [];
  
  if (specificProduct) {
    // Find specific product by name or jewel code
    const found = products.filter(p => 
      p['Product Name']?.toLowerCase().includes(specificProduct.toLowerCase()) ||
      p['Jewel Code']?.toLowerCase().includes(specificProduct.toLowerCase())
    );
    
    if (found.length === 0) {
      console.error(`❌ No product found matching "${specificProduct}"`);
      process.exit(1);
    }
    
    productsToProcess = found;
    console.log(`\n📦 Found ${productsToProcess.length} product(s) matching "${specificProduct}"\n`);
  } else {
    // Apply start and limit for bulk upload
    productsToProcess = products.slice(start);
    if (limit) {
      productsToProcess = productsToProcess.slice(0, limit);
    }
    console.log(`\n📦 Processing ${productsToProcess.length} products (starting from ${start})\n`);
  }
  
  // Process each product
  const results = {
    success: 0,
    failed: 0,
    errors: [] as { product: string; error: string }[],
  };
  
  for (let i = 0; i < productsToProcess.length; i++) {
    const row = productsToProcess[i];
    const productName = row['Product Name'] || row['Jewel Code'] || `Product ${i + 1}`;
    
    console.log(`[${i + 1}/${productsToProcess.length}] Processing: ${productName}`);
    
    try {
      const shopifyProduct = transformToShopifyProduct(row);
      const result = await uploadProduct(shopifyProduct, dryRun);
      
      console.log(`   ✅ Created: ${result.title} (ID: ${result.id})`);
      results.success++;
      
      // Rate limiting: Shopify allows 2 requests/second for Admin API
      if (!dryRun) {
        await new Promise(resolve => setTimeout(resolve, 600));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`   ❌ Failed: ${errorMessage}`);
      results.failed++;
      results.errors.push({ product: productName, error: errorMessage });
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Upload Summary');
  console.log('='.repeat(50));
  console.log(`✅ Successful: ${results.success}`);
  console.log(`❌ Failed: ${results.failed}`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors:');
    results.errors.forEach(e => {
      console.log(`   - ${e.product}: ${e.error}`);
    });
  }
  
  if (dryRun) {
    console.log('\n⚠️  This was a dry run. Run without --dry-run to actually upload.');
  }
}

main().catch(console.error);
