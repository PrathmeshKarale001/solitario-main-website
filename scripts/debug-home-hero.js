// Debug script to check Home Hero metaobject setup

require('dotenv').config({ path: '.env.local' });

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!SHOPIFY_DOMAIN || !STOREFRONT_TOKEN) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const STOREFRONT_API_URL = `https://${SHOPIFY_DOMAIN}.myshopify.com/api/2024-01`;

// GraphQL query to check if home_hero metaobject exists
const CHECK_HOME_HERO_QUERY = `
  query checkHomeHero($first: Int!) {
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

async function makeShopifyRequest(query, variables) {
  const response = await fetch(STOREFRONT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ HTTP ${response.status}: ${errorText}`);
    throw new Error(`Shopify API error: ${response.status}`);
  }

  return await response.json();
}

async function debugHomeHero() {
  console.log('🔍 Debugging Home Hero Metaobject');
  console.log('=====================================');
  console.log(`Store: ${SHOPIFY_DOMAIN}`);
  console.log(`Storefront API: ${STOREFRONT_API_URL}`);

  try {
    console.log('\n📋 Checking if home_hero metaobject exists...');
    
    const result = await makeShopifyRequest(CHECK_HOME_HERO_QUERY, { first: 10 });
    
    if (result.errors) {
      console.error('❌ GraphQL Errors:', result.errors);
      return;
    }

    const metaobjects = result.data?.metaobjects?.edges || [];
    
    console.log(`📊 Found ${metaobjects.length} home hero metaobjects`);
    
    if (metaobjects.length === 0) {
      console.log('\n⚠️  No home hero metaobjects found');
      console.log('💡 This means:');
      console.log('   1. The home_hero metaobject definition has not been created in Shopify Admin');
      console.log('   2. Or no entries have been added to the home_hero metaobject');
      console.log('\n📝 To fix this:');
      console.log('   1. Go to Shopify Admin → Apps → Metaobjects');
      console.log('   2. Create "Home Hero" metaobject definition with type "home_hero"');
      console.log('   3. Add at least one entry with "Is Active" checked');
      console.log('   4. Wait 1-2 minutes for Shopify to update');
      console.log('   5. Test again');
    } else {
      console.log('\n✅ Home hero metaobjects found:');
      metaobjects.forEach((edge, index) => {
        const node = edge.node;
        console.log(`\n📄 ${index + 1}. ${node.handle}`);
        console.log(`   ID: ${node.id}`);
        console.log(`   Updated: ${node.updatedAt}`);
        
        const fields = {};
        node.fields.forEach(field => {
          fields[field.key] = field.value;
        });
        
        console.log(`   Fields:`, fields);
        console.log(`   Is Active: ${fields.is_active}`);
      });
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

// Run debug
debugHomeHero();
