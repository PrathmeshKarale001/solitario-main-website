import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import logger from '@/lib/logger';

// Razorpay Webhook Handler
// Configure webhook URL in Razorpay Dashboard: https://yourdomain.com/api/razorpay/webhook

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

// Payment captured - order already processed via verify-payment route
async function handlePaymentCaptured(payment: any) {
  logger.log('[Payment Captured]', { orderId: payment?.order_id, paymentId: payment?.id });
}

// Payment failed - customer will see error on checkout page
async function handlePaymentFailed(payment: any) {
  logger.log('[Payment Failed]', { orderId: payment?.order_id, reason: payment?.error_description });
}

// Payment authorized - auto-captured in our flow
async function handlePaymentAuthorized(payment: any) {
  logger.log('[Payment Authorized]', { orderId: payment?.order_id });
}

// Order paid - confirmation already sent via verify-payment route
async function handleOrderPaid(order: any) {
  logger.log('[Order Paid]', { orderId: order?.id });
}

// Refund created - handled via Razorpay dashboard
async function handleRefundCreated(refund: any) {
  logger.log('[Refund Created]', { paymentId: refund?.payment_id, refundId: refund?.id });
}
