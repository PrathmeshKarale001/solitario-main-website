// Test basic Shopify Storefront API
require('dotenv').config({ path: '.env.local' });

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const STOREFRONT_API_URL = `https://${SHOPIFY_DOMAIN}.myshopify.com/api/2024-01`;

// Simple query to test if API works
const SIMPLE_QUERY = `
  query {
    shop {
      name
    }
  }
`;

async function testBasicAPI() {
  console.log('🔍 Testing basic Shopify Storefront API...');
  console.log(`Store: ${SHOPIFY_DOMAIN}`);
  
  try {
    const response = await fetch(STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query: SIMPLE_QUERY }),
    });

    console.log(`📡 Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ HTTP ${response.status}: ${errorText}`);
      return;
    }

    const result = await response.json();
    console.log('✅ Basic API working!');
    console.log('📋 Shop info:', result);

    if (result.errors) {
      console.error('❌ GraphQL Errors:', result.errors);
    }

  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

testBasicAPI();
