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

    const festivalCurrentlyActive = false; // DELETED

    // Run local promotions engine (handles BUY2 automatically)
    const promoResult = await calculatePromotions({
      clerkUserId: clerkUserId || userId || undefined,
      // Local engine handles automatic promotions
      cartLines: finalCartLines,
      couponCode: couponCode || undefined,
    });

    const subtotalRupees = Math.round(promoResult.subtotal / 100);
    let discounts = promoResult.discounts.map(d => ({
      ...d,
      amount: Math.round(d.amount / 100),
    }));
    let totalRupees = Math.round(promoResult.total / 100);

    // Festival discount logic DELETED

    // Festival message logic DELETED

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
      messages: promoResult.messages,
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
