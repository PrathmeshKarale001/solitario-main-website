// Setup Separate Metaobjects for Home and Shop Heroes
// Creates Home_Hero and Shop_Hero metaobject definitions

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

// Metaobject definitions for separate heroes
const METAOBJECT_DEFINITIONS = [
  {
    name: 'Home Hero',
    type: 'home_hero',
    description: 'Hero sections for the home page',
    fields: [
      { key: 'title', name: 'Title', type: 'single_line_text_field', required: false },
      { key: 'subtitle', name: 'Subtitle', type: 'single_line_text_field', required: false },
      { key: 'description', name: 'Description', type: 'multi_line_text_field', required: false },
      { key: 'background_image', name: 'Background Image', type: 'file_reference', required: true },
      { key: 'background_video', name: 'Background Video', type: 'file_reference', required: false },
      { key: 'media_type', name: 'Media Type', type: 'single_line_text_field', required: false },
      { key: 'cta_text', name: 'CTA Text', type: 'single_line_text_field', required: false },
      { key: 'cta_link', name: 'CTA Link', type: 'url', required: false },
      { key: 'is_active', name: 'Is Active', type: 'boolean', required: true },
      { key: 'display_order', name: 'Display Order', type: 'number_integer', required: false }
    ]
  },
  {
    name: 'Shop Hero',
    type: 'shop_hero', 
    description: 'Hero sections for the shop/products page',
    fields: [
      { key: 'title', name: 'Title', type: 'single_line_text_field', required: false },
      { key: 'subtitle', name: 'Subtitle', type: 'single_line_text_field', required: false },
      { key: 'description', name: 'Description', type: 'multi_line_text_field', required: false },
      { key: 'background_image', name: 'Background Image', type: 'file_reference', required: true },
      { key: 'background_video', name: 'Background Video', type: 'file_reference', required: false },
      { key: 'media_type', name: 'Media Type', type: 'single_line_text_field', required: false },
      { key: 'cta_text', name: 'CTA Text', type: 'single_line_text_field', required: false },
      { key: 'cta_link', name: 'CTA Link', type: 'url', required: false },
      { key: 'is_active', name: 'Is Active', type: 'boolean', required: true },
      { key: 'display_order', name: 'Display Order', type: 'number_integer', required: false }
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

async function createMetaobjectDefinition(definition) {
  try {
    console.log(`\n🏗️  Creating metaobject definition: ${definition.name}`);
    
    // Convert field definitions to correct format
    const fieldDefinitions = definition.fields.map(field => ({
      key: field.key,
      name: field.name,
      type: field.type,
      required: field.required,
      ...(field.type === 'single_line_text_field' && field.key === 'media_type' ? {
        validations: [
          {
            name: 'choices',
            value: JSON.stringify(['image', 'video'])
          }
        ]
      } : {})
    }));
    
    const payload = {
      metaobject_definition: {
        name: definition.name,
        type: definition.type,
        description: definition.description,
        field_definitions: fieldDefinitions,
        access: {
          storefront: 'PUBLIC_READ'
        }
      }
    };
    
    const response = await makeShopifyRequest('/metaobject_definitions.json', 'POST', payload);
    
    if (response.metaobject_definition) {
      console.log(`✅ Created: ${response.metaobject_definition.name} (${response.metaobject_definition.type})`);
      return response.metaobject_definition;
    } else {
      console.error('❌ Unexpected response format:', response);
      return null;
    }
    
  } catch (error) {
    console.error(`❌ Error creating ${definition.name}:`, error.message);
    return null;
  }
}

async function createSampleContent() {
  console.log('\n📝 Creating sample content for separate heroes...');
  
  // Sample Home Hero
  try {
    const homeHeroPayload = {
      metaobject: {
        type: 'home_hero',
        handle: 'home-hero-welcome',
        fields: [
          { key: 'title', value: 'Welcome to Solitario' },
          { key: 'subtitle', value: 'Ethical Lab-Grown Diamonds' },
          { key: 'description', value: 'Discover our collection of sustainable luxury jewelry' },
          { key: 'cta_text', value: 'Explore Collection' },
          { key: 'cta_link', value: '/products' },
          { key: 'media_type', value: 'image' },
          { key: 'is_active', value: 'true' },
          { key: 'display_order', value: '1' }
        ]
      }
    };
    
    await makeShopifyRequest('/metaobjects.json', 'POST', homeHeroPayload);
    console.log('✅ Sample Home Hero created');
    
  } catch (error) {
    console.log('⚠️  Home Hero creation failed (may already exist):', error.message);
  }
  
  // Sample Shop Hero
  try {
    const shopHeroPayload = {
      metaobject: {
        type: 'shop_hero',
        handle: 'shop-hero-collection',
        fields: [
          { key: 'title', value: 'Shop Our Collection' },
          { key: 'subtitle', value: 'Find Your Perfect Piece' },
          { key: 'description', value: 'Browse our curated selection of lab-grown diamond jewelry' },
          { key: 'cta_text', value: 'View All Products' },
          { key: 'cta_link', value: '#products' },
          { key: 'media_type', value: 'image' },
          { key: 'is_active', value: 'true' },
          { key: 'display_order', value: '1' }
        ]
      }
    };
    
    await makeShopifyRequest('/metaobjects.json', 'POST', shopHeroPayload);
    console.log('✅ Sample Shop Hero created');
    
  } catch (error) {
    console.log('⚠️  Shop Hero creation failed (may already exist):', error.message);
  }
}

async function main() {
  console.log('🚀 Setting up Separate Hero Metaobjects');
  console.log('=====================================');
  console.log(`Store: ${SHOPIFY_DOMAIN}`);
  console.log(`Admin API: ${ADMIN_API_URL}`);
  
  // Create metaobject definitions
  for (const definition of METAOBJECT_DEFINITIONS) {
    await createMetaobjectDefinition(definition);
  }
  
  // Create sample content
  await createSampleContent();
  
  console.log('\n🎉 Setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Check Shopify Admin → Apps → Metaobjects');
  console.log('2. Find "Home Hero" and "Shop Hero" definitions');
  console.log('3. Add your content to each metaobject type');
  console.log('4. Upload images and set CTAs');
  console.log('5. Test the website');
}

// Run the setup
main().catch(error => {
  console.error('💥 Setup failed:', error);
  process.exit(1);
});
