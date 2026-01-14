// Debug Shopify Admin API to understand the real issue
require('dotenv').config({ path: '.env.local' });

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

console.log('🔧 Debugging Shopify Admin API...');
console.log('Domain:', SHOPIFY_DOMAIN);
console.log('Token:', ADMIN_TOKEN ? 'Present' : 'Missing');

const ADMIN_API_URL = `https://${SHOPIFY_DOMAIN}.myshopify.com/admin/api`;

async function testAPIVersions() {
  const versions = ['2024-01', '2024-04', '2024-07', '2024-10'];
  
  for (const version of versions) {
    try {
      console.log(`\n📡 Testing API version: ${version}`);
      
      const response = await fetch(`${ADMIN_API_URL}/${version}/shop.json`, {
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': ADMIN_TOKEN,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Version ${version} works! Shop: ${data.shop?.name}`);
        return version;
      } else {
        const errorText = await response.text();
        console.log(`❌ Version ${version} failed: ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ Version ${version} error: ${error.message}`);
    }
  }
}

async function testMetaobjectsEndpoint(version) {
  console.log(`\n🔍 Testing metaobjects endpoint with version ${version}`);
  
  try {
    // Test GET metaobjects
    const getResponse = await fetch(`${ADMIN_API_URL}/${version}/metaobject_definitions.json`, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': ADMIN_TOKEN,
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`GET Status: ${getResponse.status}`);
    
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log(`✅ GET works! Found ${data.metaobject_definitions?.length || 0} definitions`);
    } else {
      const errorText = await getResponse.text();
      console.log(`❌ GET failed: ${errorText}`);
    }
    
    // Test POST metaobject definition
    console.log('\n📝 Testing POST metaobject definition...');
    
    const testPayload = {
      metaobject_definition: {
        name: 'Test Definition',
        type: 'test_definition',
        field_definitions: [
          {
            key: 'title',
            name: 'Title',
            type: 'single_line_text_field',
            required: true
          }
        ],
        access: {
          storefront: 'PUBLIC_READ'
        }
      }
    };
    
    const postResponse = await fetch(`${ADMIN_API_URL}/${version}/metaobject_definitions.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': ADMIN_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log(`POST Status: ${postResponse.status}`);
    
    if (postResponse.ok) {
      const data = await postResponse.json();
      console.log(`✅ POST works! Created: ${data.metaobject_definition?.name}`);
    } else {
      const errorText = await postResponse.text();
      console.log(`❌ POST failed: ${errorText}`);
      
      // Try to understand the error
      if (postResponse.status === 406) {
        console.log('🔍 406 Not Acceptable - Possible issues:');
        console.log('  - Wrong field type names');
        console.log('  - Missing required fields');
        console.log('  - Invalid JSON structure');
        console.log('  - API version too old');
      }
    }
    
  } catch (error) {
    console.log(`❌ Endpoint test error: ${error.message}`);
  }
}

async function testFieldTypes() {
  console.log('\n🧪 Testing different field type formats...');
  
  const fieldTypes = [
    'single_line_text_field',
    'single_line_text',
    'text',
    'multi_line_text_field',
    'multi_line_text',
    'rich_text_field',
    'file_reference',
    'file',
    'url',
    'boolean',
    'number_integer',
    'number_integer_field',
    'date_time',
    'date',
    'date_time_field'
  ];
  
  for (const fieldType of fieldTypes) {
    console.log(`  - ${fieldType}`);
  }
}

async function main() {
  console.log('🚀 Shopify Admin API Debug');
  console.log('==========================');
  
  // Test API versions
  const workingVersion = await testAPIVersions();
  
  if (workingVersion) {
    // Test metaobjects endpoint
    await testMetaobjectsEndpoint(workingVersion);
    
    // Show field type options
    await testFieldTypes();
  } else {
    console.log('\n❌ No working API version found');
    console.log('Possible issues:');
    console.log('1. Admin token has wrong permissions');
    console.log('2. Store domain is incorrect');
    console.log('3. API access is disabled');
  }
}

main().catch(error => {
  console.error('💥 Debug failed:', error);
});
