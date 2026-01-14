// Test Shopify connection directly
require('dotenv').config({ path: '.env.local' });

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!SHOPIFY_DOMAIN || !STOREFRONT_TOKEN) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const STOREFRONT_API_URL = `https://${SHOPIFY_DOMAIN}.myshopify.com/api/2024-01`;

// Test query for home_hero
const TEST_QUERY = `
  query testHomeHero($first: Int!) {
    metaobjects(type: "home_hero", first: $first) {
      edges {
        node {
          id
          handle
          type
          fields {
            key
            value
            type
          }
          updatedAt
        }
      }
    }
  }
`;

async function testConnection() {
  console.log('🔍 Testing Shopify connection...');
  console.log(`Store: ${SHOPIFY_DOMAIN}`);
  console.log(`API: ${STOREFRONT_API_URL}`);
  
  try {
    const response = await fetch(STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query: TEST_QUERY,
        variables: { first: 10 }
      }),
    });

    console.log(`📡 Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ HTTP ${response.status}: ${errorText}`);
      return;
    }

    const result = await response.json();
    console.log('📋 Response:', JSON.stringify(result, null, 2));

    if (result.errors) {
      console.error('❌ GraphQL Errors:', result.errors);
    } else {
      const metaobjects = result.data?.metaobjects?.edges || [];
      console.log(`✅ Found ${metaobjects.length} home hero metaobjects`);
      
      if (metaobjects.length === 0) {
        console.log('⚠️  No home_hero metaobjects found');
        console.log('💡 This means:');
        console.log('   1. The home_hero metaobject definition has not been created in Shopify Admin');
        console.log('   2. Or no entries have been added to the home_hero metaobject');
        console.log('   3. Or the metaobject type name is incorrect');
      } else {
        console.log('✅ Home hero metaobjects found:');
        metaobjects.forEach((edge, index) => {
          const node = edge.node;
          console.log(`   ${index + 1}. ${node.handle} (${node.type})`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

testConnection();
