import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { getCart } from '@/lib/shopify-cart';
import { calculatePromotions, CartLine } from '@/lib/promotions/engine';
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

    const promoResult = await calculatePromotions({
      clerkUserId: clerkUserId || userId || undefined,
      cartLines: finalCartLines,
      couponCode: couponCode || undefined,
    });

    // promoResult values are in cents (subtotal, amount, total)
    return NextResponse.json({
      success: true,
      pricing: {
        subtotal: Math.round(promoResult.subtotal / 100),
        discounts: promoResult.discounts.map(d => ({
          ...d,
          amount: Math.round(d.amount / 100),
        })),
        total: Math.round(promoResult.total / 100),
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
