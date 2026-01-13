import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import logger from '@/lib/logger';
import { OrderRepository, CouponRepository } from '@/lib/db/storage';
import { getPromotionConfig } from '@/lib/promotions/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      logger.error('Razorpay webhook secret not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 503 }
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      logger.error('Invalid Razorpay webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const payload = JSON.parse(body);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    const orderEntity = payload.payload?.order?.entity;

    logger.log(`[Razorpay Webhook] Event: ${event}`);

    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(paymentEntity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(paymentEntity);
        break;
      case 'payment.authorized':
        await handlePaymentAuthorized(paymentEntity);
        break;
      case 'order.paid':
        await handleOrderPaid(orderEntity);
        break;
      case 'refund.created':
        await handleRefundCreated(payload.payload?.refund?.entity);
        break;
      default:
        logger.log(`[Razorpay Webhook] Unhandled event: ${event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Razorpay webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentCaptured(payment: any) {
  logger.log('[Payment Captured]', { orderId: payment?.order_id, paymentId: payment?.id });
  
  const order = OrderRepository.findByRazorpayOrderId(payment.order_id);
  if (!order) {
    logger.error('[Payment Captured] Order not found:', payment.order_id);
    return;
  }

  OrderRepository.updateStatus(payment.order_id, 'PAID', payment.id);

  if (order.promo_snapshot.coupon_code) {
    CouponRepository.markRedeemed(order.promo_snapshot.coupon_code);
    logger.log('[Payment Captured] Coupon redeemed:', order.promo_snapshot.coupon_code);
  }

  if (order.clerk_user_id && order.clerk_user_id !== 'guest') {
    await issueLoyaltyCoupon(order.clerk_user_id, order.id);
  }
}

async function handlePaymentFailed(payment: any) {
  logger.log('[Payment Failed]', { orderId: payment?.order_id, reason: payment?.error_description });
  
  const order = OrderRepository.findByRazorpayOrderId(payment.order_id);
  if (order) {
    OrderRepository.updateStatus(payment.order_id, 'FAILED');
  }
}

async function handlePaymentAuthorized(payment: any) {
  logger.log('[Payment Authorized]', { orderId: payment?.order_id });
}

async function handleOrderPaid(order: any) {
  logger.log('[Order Paid]', { orderId: order?.id });
}

async function handleRefundCreated(refund: any) {
  logger.log('[Refund Created]', { paymentId: refund?.payment_id, refundId: refund?.id });
}

async function issueLoyaltyCoupon(clerkUserId: string, orderId: string) {
  try {
    const config = await getPromotionConfig();
    if (!config.enabled) return;

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    if (CouponRepository.hasIssuedCouponForMonth(clerkUserId, currentMonth)) {
      logger.log('[Loyalty Coupon] Already issued for this month:', clerkUserId);
      return;
    }

    const code = CouponRepository.generateCode();
    const expiresAt = new Date(now.getTime() + config.loyalty_coupon_validity_days * 24 * 60 * 60 * 1000);

    const coupon = CouponRepository.create({
      clerk_user_id: clerkUserId,
      code,
      percent_off: config.loyalty_coupon_percent,
      status: 'ACTIVE',
      issued_month: currentMonth,
      issued_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      redeemed_at: null,
      issued_for_order_id: orderId,
    });

    logger.log('[Loyalty Coupon] Issued:', { code, clerkUserId, expiresAt });
  } catch (error) {
    logger.error('[Loyalty Coupon] Failed to issue:', error);
  }
}
