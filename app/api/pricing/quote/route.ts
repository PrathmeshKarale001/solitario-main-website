import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { getCart } from '@/lib/shopify-cart';
import { calculatePromotions, CartLine } from '@/lib/promotions/engine';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    const body = await request.json();
    const { cartId, couponCode } = body;

    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      );
    }

    const cart = await getCart(cartId);
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    const cartLines: CartLine[] = cart.lines.edges.map(edge => ({
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

    const promoResult = await calculatePromotions({
      clerkUserId: userId || undefined,
      cartLines,
      couponCode: couponCode || undefined,
    });

    return NextResponse.json({
      success: true,
      pricing: {
        subtotal: promoResult.subtotal / 100,
        discounts: promoResult.discounts.map(d => ({
          ...d,
          amount: d.amount / 100,
        })),
        total: promoResult.total / 100,
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
