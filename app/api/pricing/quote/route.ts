import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { getCart } from '@/lib/shopify-cart';
import { calculatePromotions, CartLine } from '@/lib/promotions/engine';
import { isFestivalOfferActive, FESTIVAL_OFFER } from '@/lib/festival-offer';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    const body = await request.json();
    const { cartId, cartLines, couponCode, clerkUserId } = body;

    let finalCartLines: CartLine[] = [];

    // Option 1: Use provided cartLines directly
    if (cartLines && Array.isArray(cartLines)) {
      finalCartLines = cartLines;
    }
    // Option 2: Fetch from Shopify cart using cartId (fallback)
    else if (cartId) {
      const cart = await getCart(cartId);
      if (!cart) {
        return NextResponse.json(
          { error: 'Cart not found' },
          { status: 404 }
        );
      }

      finalCartLines = cart.lines.edges.map(edge => ({
        id: edge.node.id,
        quantity: edge.node.quantity,
        merchandise: {
          id: edge.node.merchandise.id,
          title: edge.node.merchandise.title,
          price: {
            amount: edge.node.cost.amountPerQuantity.amount,
            currencyCode: edge.node.cost.amountPerQuantity.currencyCode,
          },
        },
      }));
    } else {
      return NextResponse.json(
        { error: 'Either cartLines or cartId is required' },
        { status: 400 }
      );
    }

    // Check if the TRITIYA10 festival coupon is being applied
    const isTritiyaCoupon = couponCode && couponCode.toUpperCase() === FESTIVAL_OFFER.discountCode;
    const festivalCurrentlyActive = isFestivalOfferActive();

    // Run local promotions engine (handles BUY2 automatically)
    const promoResult = await calculatePromotions({
      clerkUserId: clerkUserId || userId || undefined,
      // Don't pass TRITIYA10 to local engine — it's a Shopify-native coupon handled below
      cartLines: finalCartLines,
      couponCode: isTritiyaCoupon ? undefined : couponCode || undefined,
    });

    const subtotalRupees = Math.round(promoResult.subtotal / 100);
    let discounts = promoResult.discounts.map(d => ({
      ...d,
      amount: Math.round(d.amount / 100),
    }));
    let totalRupees = Math.round(promoResult.total / 100);

    // Apply TRITIYA10 festival discount on top (non-stacking with BUY2)
    if (isTritiyaCoupon && festivalCurrentlyActive) {
      const hasBuy2 = promoResult.appliedFlags.cartRule === 'BUY2';
      if (!hasBuy2) {
        // 10% off the subtotal
        const festivalDiscountAmt = Math.round(subtotalRupees * FESTIVAL_OFFER.discountPercent / 100);
        discounts = [
          ...discounts,
          {
            type: 'LOYALTY_COUPON' as const,
            percent: FESTIVAL_OFFER.discountPercent,
            amount: festivalDiscountAmt,
            description: `${FESTIVAL_OFFER.label} – ${FESTIVAL_OFFER.discountPercent}% Off`,
          },
        ];
        totalRupees = Math.max(0, totalRupees - festivalDiscountAmt);
      }
    }

    // messages: add festival message if active and TRITIYA10 used
    const messages = [...promoResult.messages];
    if (isTritiyaCoupon && festivalCurrentlyActive) {
      messages.push(`🪷 ${FESTIVAL_OFFER.label}: ${FESTIVAL_OFFER.discountPercent}% off + Free Premium Diamond!`);
    }

    // promoResult values are in cents (subtotal, amount, total)
    return NextResponse.json({
      success: true,
      pricing: {
        subtotal: subtotalRupees,
        discounts,
        total: totalRupees,
        currency: 'INR',
      },
      giftLines: promoResult.giftLines,
      messages,
      errors: promoResult.errors,
      appliedFlags: promoResult.appliedFlags,
    });
  } catch (error) {
    logger.error('Error calculating pricing quote:', error);
    return NextResponse.json(
      { error: 'Failed to calculate pricing' },
      { status: 500 }
    );
  }
}
