// Shopify Metaobjects Setup Script
// This script helps you create the metaobject definitions in Shopify Admin

require('dotenv').config({ path: '.env.local' });

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!SHOPIFY_DOMAIN || !ADMIN_TOKEN) {
  console.error('❌ Missing required environment variables:');
  console.error('- SHOPIFY_STORE_DOMAIN');
  console.error('- SHOPIFY_ADMIN_ACCESS_TOKEN');
  process.exit(1);
}

const ADMIN_API_URL = `https://${SHOPIFY_DOMAIN}.myshopify.com/admin/api/2024-01`;

// Metaobject definitions
const METAOBJECT_DEFINITIONS = [
  {
    name: 'Hero Section',
    type: 'hero_section',
    fields: [
      { key: 'title', name: 'Title', type: 'single_line_text_field', required: true },
      { key: 'subtitle', name: 'Subtitle', type: 'single_line_text_field', required: false },
      { key: 'description', name: 'Description', type: 'multi_line_text_field', required: false },
      { key: 'background_image', name: 'Background Image', type: 'file_reference', required: true },
      { key: 'cta_text', name: 'CTA Text', type: 'single_line_text_field', required: false },
      { key: 'cta_link', name: 'CTA Link', type: 'url', required: false },
      { key: 'is_active', name: 'Is Active', type: 'boolean', required: true }
    ]
  },
  {
    name: 'Observatory Event',
    type: 'observatory_event',
    fields: [
      { key: 'title', name: 'Title', type: 'single_line_text_field', required: true },
      { key: 'description', name: 'Description', type: 'multi_line_text_field', required: true },
      { key: 'start_date', name: 'Start Date', type: 'date_time', required: true },
      { key: 'end_date', name: 'End Date', type: 'date_time', required: true },
      { key: 'banner_image', name: 'Banner Image', type: 'file_reference', required: false },
      { key: 'cta_text', name: 'CTA Text', type: 'single_line_text_field', required: false },
      { key: 'cta_link', name: 'CTA Link', type: 'url', required: false },
      { key: 'is_active', name: 'Is Active', type: 'boolean', required: true },
      { key: 'priority', name: 'Priority', type: 'number_integer', required: true }
    ]
  },
  {
    name: 'Dynamic Banner',
    type: 'dynamic_banner',
    fields: [
      { key: 'title', name: 'Title', type: 'single_line_text_field', required: true },
      { key: 'description', name: 'Description', type: 'multi_line_text_field', required: false },
      { key: 'image', name: 'Image', type: 'file_reference', required: true },
      { key: 'cta_text', name: 'CTA Text', type: 'single_line_text_field', required: false },
      { key: 'cta_link', name: 'CTA Link', type: 'url', required: false },
      { key: 'is_active', name: 'Is Active', type: 'boolean', required: true },
      { key: 'display_order', name: 'Display Order', type: 'number_integer', required: true },
      { key: 'schedule_type', name: 'Schedule Type', type: 'single_line_text_field', required: true },
      { key: 'start_date', name: 'Start Date', type: 'date_time', required: false },
      { key: 'end_date', name: 'End Date', type: 'date_time', required: false }
    ]
  }
];

async function makeShopifyRequest(endpoint, method = 'GET', body = null) {
  const url = `${ADMIN_API_URL}${endpoint}`;
  
  const options = {
    method,
    headers: {
      'X-Shopify-Access-Token': ADMIN_TOKEN,
      'Content-Type': 'application/json',
    },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  console.log(`📡 ${method} ${url}`);
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ HTTP ${response.status}: ${errorText}`);
    throw new Error(`Shopify API error: ${response.status}`);
  }
  
  return await response.json();
}

async function checkExistingDefinitions() {
  try {
    console.log('🔍 Checking existing metaobject definitions...');
    const response = await makeShopifyRequest('/metaobject_definitions.json');
    
    const existing = response.metaobject_definitions || [];
    console.log(`📋 Found ${existing.length} existing definitions:`);
    
    existing.forEach(def => {
      console.log(`  - ${def.name} (${def.type})`);
    });
    
    return existing;
  } catch (error) {
    console.error('❌ Error checking existing definitions:', error.message);
    return [];
  }
}

async function createMetaobjectDefinition(definition) {
  try {
    console.log(`\n🏗️  Creating metaobject definition: ${definition.name}`);
    
    const fieldDefinitions = definition.fields.map(field => ({
      key: field.key,
      name: field.name,
      type: field.type,
      required: field.required,
      ...(field.type === 'single_line_text_field' && field.key === 'schedule_type' ? {
        validations: [
          {
            name: 'choices',
            value: JSON.stringify(['always', 'date_range', 'alternating'])
          }
        ]
      } : {})
    }));
    
    const payload = {
      metaobject_definition: {
        name: definition.name,
        type: definition.type,
        field_definitions: fieldDefinitions,
        access: {
          storefront: 'PUBLIC_READ'
        }
      }
    };
    
    const response = await makeShopifyRequest('/metaobject_definitions.json', 'POST', payload);
    
    if (response.metaobject_definition) {
      console.log(`✅ Created: ${response.metaobject_definition.name}`);
      return response.metaobject_definition;
    } else {
      console.error('❌ Unexpected response format');
      return null;
    }
    
  } catch (error) {
    console.error(`❌ Error creating ${definition.name}:`, error.message);
    return null;
  }
}

async function createSampleContent() {
  console.log('\n📝 Creating sample content...');
  
  // Sample Hero Section
  try {
    const heroPayload = {
      metaobject: {
        type: 'hero_section',
        handle: 'home-hero-1',
        fields: [
          { key: 'title', value: 'Discover Lab-Grown Diamonds' },
          { key: 'subtitle', value: 'Ethical Beauty, Exceptional Quality' },
          { key: 'description', value: 'Explore our collection of certified lab-grown diamonds crafted with precision and care.' },
          { key: 'cta_text', value: 'Shop Collection' },
          { key: 'cta_link', value: '/products' },
          { key: 'is_active', value: 'true' }
        ]
      }
    };
    
    console.log('🎯 Creating sample hero section...');
    await makeShopifyRequest('/metaobjects.json', 'POST', heroPayload);
    console.log('✅ Sample hero section created');
    
  } catch (error) {
    console.log('⚠️  Hero section creation failed (may already exist):', error.message);
  }
  
  // Sample Observatory Event
  try {
    const observatoryPayload = {
      metaobject: {
        type: 'observatory_event',
        handle: 'makar-sankranti-2026',
        fields: [
          { key: 'title', value: 'Makar Sankranti Special' },
          { key: 'description', value: 'Celebrate the festival of kites with 20% off on all jewelry collections!' },
          { key: 'start_date', value: '2026-01-14T00:00:00Z' },
          { key: 'end_date', value: '2026-01-16T23:59:59Z' },
          { key: 'cta_text', value: 'Shop Sale' },
          { key: 'cta_link', value: '/collections/sale' },
          { key: 'is_active', value: 'true' },
          { key: 'priority', value: '10' }
        ]
      }
    };
    
    console.log('🔭 Creating sample observatory event...');
    await makeShopifyRequest('/metaobjects.json', 'POST', observatoryPayload);
    console.log('✅ Sample observatory event created');
    
  } catch (error) {
    console.log('⚠️  Observatory event creation failed (may already exist):', error.message);
  }
  
  // Sample Dynamic Banner
  try {
    const bannerPayload = {
      metaobject: {
        type: 'dynamic_banner',
        handle: 'free-shipping-banner',
        fields: [
          { key: 'title', value: 'Free Shipping' },
          { key: 'description', value: 'On orders above ₹25,000' },
          { key: 'cta_text', value: 'Shop Now' },
          { key: 'cta_link', value: '/products' },
          { key: 'is_active', value: 'true' },
          { key: 'display_order', value: '1' },
          { key: 'schedule_type', value: 'always' }
        ]
      }
    };
    
    console.log('🎨 Creating sample dynamic banner...');
    await makeShopifyRequest('/metaobjects.json', 'POST', bannerPayload);
    console.log('✅ Sample dynamic banner created');
    
  } catch (error) {
    console.log('⚠️  Dynamic banner creation failed (may already exist):', error.message);
  }
}

async function main() {
  console.log('🚀 Shopify Metaobjects Setup');
  console.log('================================');
  console.log(`Store: ${SHOPIFY_DOMAIN}`);
  console.log(`Admin API: ${ADMIN_API_URL}`);
  
  // Check existing definitions
  const existing = await checkExistingDefinitions();
  const existingTypes = existing.map(def => def.type);
  
  // Create missing definitions
  for (const definition of METAOBJECT_DEFINITIONS) {
    if (existingTypes.includes(definition.type)) {
      console.log(`⏭️  Skipping ${definition.name} (already exists)`);
    } else {
      await createMetaobjectDefinition(definition);
    }
  }
  
  // Create sample content
  await createSampleContent();
  
  console.log('\n🎉 Setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Go to Shopify Admin → Content → Metaobjects');
  console.log('2. Upload images to your hero sections and banners');
  console.log('3. Update your website code to use DynamicHero component');
  console.log('4. Test the API endpoints');
}

// Run the setup
main().catch(error => {
  console.error('💥 Setup failed:', error);
  process.exit(1);
});
