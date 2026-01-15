import { NextRequest, NextResponse } from 'next/server';
import { validateShopifyDiscountCode } from '@/lib/shopify';
import logger from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const { couponCode, subtotal } = await req.json();

    if (!couponCode) {
      return NextResponse.json({ error: 'Coupon code required' }, { status: 400 });
    }

    const discount = await validateShopifyDiscountCode(couponCode.toUpperCase());

    if (!discount || !discount.codeDiscount) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 });
    }

    const { codeDiscount } = discount;

    // Check if discount is active
    if (codeDiscount.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'This coupon is no longer active' }, { status: 400 });
    }

    // Check expiration
    if (codeDiscount.endsAt && new Date(codeDiscount.endsAt) < new Date()) {
      return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 });
    }

    // Check usage limit
    if (codeDiscount.usageLimit && codeDiscount.asyncUsageCount >= codeDiscount.usageLimit) {
      return NextResponse.json({ error: 'This coupon has reached its usage limit' }, { status: 400 });
    }

    // Calculate discount
    const percentOff = codeDiscount.customerGets?.value?.percentage 
      ? codeDiscount.customerGets.value.percentage * 100 
      : 0;

    const discountAmount = Math.round((subtotal * percentOff) / 100);

    return NextResponse.json({
      valid: true,
      code: couponCode.toUpperCase(),
      title: codeDiscount.title,
      percentOff,
      discountAmount,
      source: 'shopify'
    });

  } catch (error) {
    logger.error('Shopify discount validation error:', error);
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
