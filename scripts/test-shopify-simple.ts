/**
 * Simple test for Shopify Discount Integration
 * 
 * Usage: npx tsx scripts/test-shopify-simple.ts
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { validateShopifyDiscountCode, createShopifyDiscountCode } from '../lib/shopify';

async function testShopifyIntegration() {
  console.log('🧪 Testing Shopify Discount Integration');
  console.log('📋 Environment Variables:');
  console.log(`   SHOPIFY_STORE_DOMAIN: ${process.env.SHOPIFY_STORE_DOMAIN}`);
  console.log(`   SHOPIFY_ADMIN_ACCESS_TOKEN: ${process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ? '✅ Set' : '❌ Missing'}`);
  console.log(`   PROMO_ENABLED: ${process.env.PROMO_ENABLED}\n`);

  if (!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
    console.error('❌ SHOPIFY_ADMIN_ACCESS_TOKEN is not set in .env.local');
    return;
  }

  // Test 1: Validate a non-existent code
  console.log('🔍 Test 1: Validating non-existent discount code...');
  try {
    const result = await validateShopifyDiscountCode('NONEXISTENT_CODE');
    if (!result || !result.codeDiscount) {
      console.log('✅ Non-existent code correctly rejected\n');
    } else {
      console.log('❌ Non-existent code was accepted (unexpected)\n');
    }
  } catch (error) {
    console.log('✅ Non-existent code correctly rejected with error:', error.message, '\n');
  }

  // Test 2: Create a test discount code
  console.log('📝 Test 2: Creating test discount code...');
  const testCode = `TEST${Date.now().toString(36).toUpperCase()}`;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  try {
    const createResult = await createShopifyDiscountCode(
      'Test Discount Code',
      testCode,
      15, // 15% off
      expiresAt,
      5 // 5 uses
    );

    if (createResult.data?.discountCodeBasicCreate?.userErrors?.length > 0) {
      console.error('❌ Failed to create discount code:');
      console.error(createResult.data.discountCodeBasicCreate.userErrors);
      return;
    }

    console.log(`✅ Created discount code: ${testCode}`);
    console.log(`   - Discount: 15% off`);
    console.log(`   - Expires: ${expiresAt.toLocaleDateString()}`);
    console.log(`   - Usage limit: 5\n`);

    // Test 3: Validate the created discount code
    console.log('🔍 Test 3: Validating created discount code...');
    const validateResult = await validateShopifyDiscountCode(testCode);

    if (validateResult?.codeDiscount) {
      const { codeDiscount } = validateResult;
      console.log('✅ Discount code validated successfully:');
      console.log(`   - Title: ${codeDiscount.title}`);
      console.log(`   - Status: ${codeDiscount.status}`);
      console.log(`   - Percentage: ${codeDiscount.customerGets?.value?.percentage ? codeDiscount.customerGets.value.percentage * 100 : 0}%`);
      console.log(`   - Usage: ${codeDiscount.asyncUsageCount}/${codeDiscount.usageLimit || 'unlimited'}\n`);

      console.log('🎉 All tests completed successfully!');
      console.log(`\n💡 Test discount code created: ${testCode}`);
      console.log('   You can now test this code in your cart/checkout flow.');

    } else {
      console.error('❌ Failed to validate the created discount code');
    }

  } catch (error) {
    console.error('❌ Test failed with error:');
    console.error(error.message);
  }
}

// Run the test
testShopifyIntegration().catch(console.error);
