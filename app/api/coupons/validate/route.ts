import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { CouponRepository } from '@/lib/db/storage';
import { validateShopifyDiscountCode } from '@/lib/shopify';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    const body = await request.json();
    const { couponCode, subtotal, cartId } = body;

    if (!couponCode) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    const code = couponCode.toUpperCase();

    // 1. Try Shopify Admin API first (for discount codes created in Shopify)
    try {
      const shopifyDiscount = await validateShopifyDiscountCode(code);
      
      if (shopifyDiscount?.codeDiscount) {
        const { codeDiscount } = shopifyDiscount;
        
        // Check if discount is active
        if (codeDiscount.status === 'ACTIVE') {
          // Check expiration
          if (!codeDiscount.endsAt || new Date(codeDiscount.endsAt) > new Date()) {
            // Check usage limit
            if (!codeDiscount.usageLimit || codeDiscount.asyncUsageCount < codeDiscount.usageLimit) {
              const percentOff = codeDiscount.customerGets?.value?.percentage 
                ? codeDiscount.customerGets.value.percentage * 100 
                : 0;

              return NextResponse.json({
                success: true,
                percentOff,
                code,
                expiresAt: codeDiscount.endsAt,
                source: 'SHOPIFY'
              });
            }
          }
        }
      }
    } catch (shopifyError) {
      logger.warn('Shopify discount lookup failed, trying local:', shopifyError);
    }

    // Local loyalty coupon system removed - only Shopify discounts supported

    // 3. Try Shopify cart-based validation if cartId is provided
    if (cartId) {
      const { validateShopifyDiscount } = await import('@/lib/shopify');
      const shopifyResult = await validateShopifyDiscount(cartId, code);
      if (shopifyResult.valid) {
        // Calculate effective percentage if possible
        let effectivePercent = 0;
        const cart = shopifyResult.cart;
        if (cart?.estimatedCost?.totalAmount && cart?.estimatedCost?.subtotalAmount) {
          const subtotalAmt = parseFloat(cart.estimatedCost.subtotalAmount.amount);
          const total = parseFloat(cart.estimatedCost.totalAmount.amount);
          if (subtotalAmt > 0) {
            effectivePercent = Math.round(((subtotalAmt - total) / subtotalAmt) * 100);
          }
        }

        return NextResponse.json({
          success: true,
          percentOff: effectivePercent > 0 ? effectivePercent : undefined,
          code: code,
          source: 'SHOPIFY',
          shopifyCart: shopifyResult.cart
        });
      }
    }

    return NextResponse.json(
      { error: 'Invalid or inapplicable coupon code' },
      { status: 404 }
    );
  } catch (error) {
    logger.error('Error validating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
