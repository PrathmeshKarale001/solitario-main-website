import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Razorpay Webhook Handler
// Configure webhook URL in Razorpay Dashboard: https://yourdomain.com/api/razorpay/webhook
// Webhook Secret: Add RAZORPAY_WEBHOOK_SECRET to .env.local

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

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('Webhook secret not configured');
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
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Parse webhook payload
    const payload = JSON.parse(body);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    const orderEntity = payload.payload?.order?.entity;

    console.log(`Razorpay webhook received: ${event}`);

    // Handle different webhook events
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
        console.log(`Unhandled webhook event: ${event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle successful payment capture
async function handlePaymentCaptured(payment: any) {
  console.log('Payment captured:', payment.id);
  
  // In production:
  // 1. Update order status in database
  // 2. Send confirmation email
  // 3. Trigger fulfillment process
  
  // Example: Update order status
  // await db.orders.update({
  //   where: { razorpayOrderId: payment.order_id },
  //   data: { 
  //     status: 'paid',
  //     razorpayPaymentId: payment.id,
  //     paidAt: new Date(),
  //   }
  // });
}

// Handle failed payment
async function handlePaymentFailed(payment: any) {
  console.log('Payment failed:', payment.id, payment.error_description);
  
  // In production:
  // 1. Update order status
  // 2. Send failure notification email
  // 3. Log for analytics
  
  // Example:
  // await db.orders.update({
  //   where: { razorpayOrderId: payment.order_id },
  //   data: { 
  //     status: 'failed',
  //     failureReason: payment.error_description,
  //   }
  // });
}

// Handle payment authorization (before capture)
async function handlePaymentAuthorized(payment: any) {
  console.log('Payment authorized:', payment.id);
  // Usually auto-captured, but can implement manual capture logic here
}

// Handle order paid event
async function handleOrderPaid(order: any) {
  console.log('Order paid:', order.id);
  // Additional order processing if needed
}

// Handle refund creation
async function handleRefundCreated(refund: any) {
  console.log('Refund created:', refund.id);
  
  // In production:
  // 1. Update order status to refunded
  // 2. Send refund confirmation email
  // 3. Update inventory if needed
  
  // Example:
  // await db.orders.update({
  //   where: { razorpayPaymentId: refund.payment_id },
  //   data: { 
  //     status: 'refunded',
  //     refundId: refund.id,
  //     refundedAt: new Date(),
  //   }
  // });
}
