import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { getRazorpayInstance, generateReceiptId } from '@/lib/razorpay';
import { getCart } from '@/lib/shopify-cart';
import { calculatePromotions, CartLine, rupeesToPaise } from '@/lib/promotions/engine';
import { OrderRepository, UserRepository } from '@/lib/db/storage';
import logger from '@/lib/logger';

const orderAttempts = new Map<string, { count: number; lastAttempt: number }>();
const RATE_LIMIT_WINDOW = 60000;
const MAX_ATTEMPTS = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = orderAttempts.get(ip);
  
  if (!record || now - record.lastAttempt > RATE_LIMIT_WINDOW) {
    orderAttempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }
  
  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }
  
  record.count++;
  record.lastAttempt = now;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

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

    if (cart.lines.edges.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
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

    if (promoResult.errors.length > 0) {
      return NextResponse.json(
        { error: promoResult.errors[0] },
        { status: 400 }
      );
    }

    const totalInRupees = promoResult.total / 100;

    if (totalInRupees < 1) {
      return NextResponse.json(
        { error: 'Order total must be at least ₹1' },
        { status: 400 }
      );
    }

    if (totalInRupees > 5000000) {
      return NextResponse.json(
        { error: 'Order total exceeds maximum limit. Please contact support for large orders.' },
        { status: 400 }
      );
    }

    const razorpay = getRazorpayInstance();
    const receiptId = generateReceiptId();

    const razorpayOrder = await razorpay.orders.create({
      amount: rupeesToPaise(totalInRupees),
      currency: 'INR',
      receipt: receiptId,
      notes: {
        cart_id: cartId,
        clerk_user_id: userId || 'guest',
        coupon_code: couponCode || '',
        items_count: cartLines.reduce((sum, line) => sum + line.quantity, 0).toString(),
      },
    });

    if (userId) {
      UserRepository.upsert(userId, null);
    }

    const order = OrderRepository.create({
      clerk_user_id: userId || 'guest',
      shopify_cart_id: cartId,
      subtotal: promoResult.subtotal,
      discount: promoResult.discounts.reduce((sum, d) => sum + d.amount, 0),
      total: promoResult.total,
      currency: 'INR',
      status: 'PENDING',
      razorpay_order_id: razorpayOrder.id,
      razorpay_payment_id: null,
      promo_snapshot: {
        applied_discounts: promoResult.discounts,
        gift_lines: promoResult.giftLines,
        coupon_code: couponCode || null,
        first_purchase_discount: promoResult.appliedFlags.firstPurchase,
        cart_rule_applied: promoResult.appliedFlags.cartRule,
        total_items: cartLines.reduce((sum, line) => sum + line.quantity, 0),
        messages: promoResult.messages,
      },
      paid_at: null,
    });

    logger.log(`[Payment Create] Order created: ${order.id}, Razorpay: ${razorpayOrder.id}`);

    return NextResponse.json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: receiptId,
      },
      pricing: {
        subtotal: promoResult.subtotal / 100,
        discount: promoResult.discounts.reduce((sum, d) => sum + d.amount, 0) / 100,
        total: totalInRupees,
        currency: 'INR',
      },
      messages: promoResult.messages,
    });
  } catch (error) {
    logger.error('Error creating payment order:', error);
    
    if (error instanceof Error && error.message.includes('API keys not configured')) {
      return NextResponse.json(
        { error: 'Payment gateway not configured. Please contact support.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 }
    );
  }
}
