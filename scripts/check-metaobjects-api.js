// Check what's actually available in the Shopify Admin API
require('dotenv').config({ path: '.env.local' });

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

const ADMIN_API_URL = `https://${SHOPIFY_DOMAIN}.myshopify.com/admin/api`;

async function checkAPIEndpoints() {
  const versions = ['2024-01', '2024-04', '2024-07', '2024-10', '2025-01'];
  
  for (const version of versions) {
    console.log(`\n🔍 Testing API version: ${version}`);
    const url = `${ADMIN_API_URL}/${version}`;
    
    try {
      // Test basic shop access
      const shopResponse = await fetch(`${url}/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': ADMIN_TOKEN,
          'Content-Type': 'application/json',
        },
      });
      
      if (shopResponse.ok) {
        console.log(`✅ Shop API works for ${version}`);
        
        // Test various metaobject endpoints
        const endpoints = [
          '/metaobject_definitions.json',
          '/metaobject_definitions',
          '/metaobjects.json',
          '/metaobjects',
          '/custom_objects.json',
          '/custom_objects',
          '/metafields.json',
          '/metafields'
        ];
        
        for (const endpoint of endpoints) {
          try {
            const response = await fetch(`${url}${endpoint}`, {
              headers: {
                'X-Shopify-Access-Token': ADMIN_TOKEN,
                'Content-Type': 'application/json',
              },
            });
            
            if (response.ok) {
              const data = await response.json();
              console.log(`✅ ${endpoint} - Available: ${JSON.stringify(Object.keys(data))}`);
            } else if (response.status !== 404) {
              const text = await response.text();
              console.log(`⚠️  ${endpoint} - Status ${response.status}: ${text.substring(0, 100)}`);
            }
          } catch (error) {
            console.log(`❌ ${endpoint} - Error: ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.log(`❌ Version ${version} failed: ${error.message}`);
    }
  }
}

async function checkMetafieldsAPI() {
  console.log('\n🔍 Testing Metafields API (alternative approach)...');
  
  try {
    const response = await fetch(`${ADMIN_API_URL}/2024-01/metafields.json`, {
      headers: {
        'X-Shopify-Access-Token': ADMIN_TOKEN,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Metafields API works! Found ${data.metafields?.length || 0} metafields`);
      
      // Check if we can use metafields as alternative
      console.log('📝 Metafields can be used as alternative to metaobjects:');
      console.log('  - Store metafields for global content');
      console.log('  - Product metafields for product-specific content');
      console.log('  - Collection metafields for category content');
      
    } else {
      console.log('❌ Metafields API not available');
    }
  } catch (error) {
    console.log('❌ Metafields error:', error.message);
  }
}

async function checkGraphQLAdmin() {
  console.log('\n🔍 Testing GraphQL Admin API...');
  
  const query = `
    query {
      metaobjectDefinitions(first: 10) {
        edges {
          node {
            id
            name
            type
            fieldDefinitions(first: 5) {
              edges {
                node {
                  key
                  name
                  type
                }
              }
            }
          }
        }
      }
    }
  `;
  
  try {
    const response = await fetch(`${ADMIN_API_URL}/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': ADMIN_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.data?.metaobjectDefinitions) {
        console.log(`✅ GraphQL Admin API works! Found ${data.data.metaobjectDefinitions.edges.length} definitions`);
        
        data.data.metaobjectDefinitions.edges.forEach(edge => {
          console.log(`  - ${edge.node.name} (${edge.node.type})`);
        });
      } else {
        console.log('⚠️  GraphQL returned no metaobjects');
      }
    } else {
      const text = await response.text();
      console.log(`❌ GraphQL Admin API failed: ${response.status} - ${text.substring(0, 200)}`);
    }
  } catch (error) {
    console.log('❌ GraphQL error:', error.message);
  }
}

async function main() {
  console.log('🔍 Shopify Admin API Investigation');
  console.log('==================================');
  
  await checkAPIEndpoints();
  await checkMetafieldsAPI();
  await checkGraphQLAdmin();
  
  console.log('\n📋 Summary:');
  console.log('If REST API metaobjects are not available, we can:');
  console.log('1. Use GraphQL Admin API (if available)');
  console.log('2. Use Metafields as alternative');
  console.log('3. Use manual Shopify Admin setup');
}

main().catch(error => {
  console.error('💥 Investigation failed:', error);
});
