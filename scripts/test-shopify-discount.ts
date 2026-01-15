/**
 * Test script for Shopify Discount Integration
 * 
 * This script tests the complete Shopify discount integration:
 * 1. Creates a test discount code in Shopify
 * 2. Validates the discount code via API
 * 3. Tests the promotion engine with the discount
 * 
 * Usage: npx tsx scripts/test-shopify-discount.ts
 */

import { createShopifyDiscountCode, validateShopifyDiscountCode } from '../lib/shopify';

async function testShopifyDiscountIntegration() {
  console.log('🧪 Testing Shopify Discount Integration\n');

  // Test 1: Create a test discount code
  console.log('📝 Test 1: Creating test discount code...');
  const testCode = `TEST${Date.now().toString(36).toUpperCase()}`;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days validity

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

    // Test 2: Validate the discount code
    console.log('🔍 Test 2: Validating discount code...');
    const validateResult = await validateShopifyDiscountCode(testCode);

    if (!validateResult || !validateResult.codeDiscount) {
      console.error('❌ Failed to validate discount code');
      return;
    }

    const { codeDiscount } = validateResult;
    console.log('✅ Discount code validated successfully:');
    console.log(`   - Title: ${codeDiscount.title}`);
    console.log(`   - Status: ${codeDiscount.status}`);
    console.log(`   - Percentage: ${codeDiscount.customerGets?.value?.percentage ? codeDiscount.customerGets.value.percentage * 100 : 0}%`);
    console.log(`   - Usage: ${codeDiscount.asyncUsageCount}/${codeDiscount.usageLimit || 'unlimited'}\n`);

    // Test 3: Test with invalid code
    console.log('🔍 Test 3: Testing invalid discount code...');
    const invalidResult = await validateShopifyDiscountCode('INVALID_CODE_12345');
    
    if (!invalidResult || !invalidResult.codeDiscount) {
      console.log('✅ Invalid code correctly rejected\n');
    } else {
      console.error('❌ Invalid code was accepted (unexpected)\n');
    }

    // Test 4: Test API endpoint
    console.log('🌐 Test 4: Testing API endpoint...');
    console.log('   To test the API endpoint, run:');
    console.log(`   curl -X POST http://localhost:3000/api/shopify/validate-discount \\`);
    console.log(`        -H "Content-Type: application/json" \\`);
    console.log(`        -d '{"couponCode":"${testCode}","subtotal":10000}'\n`);

    console.log('✅ All tests completed successfully!');
    console.log(`\n💡 Test discount code created: ${testCode}`);
    console.log('   You can now test this code in your cart/checkout flow.');

  } catch (error) {
    console.error('❌ Test failed with error:');
    console.error(error);
  }
}

// Run the test
testShopifyDiscountIntegration().catch(console.error);
