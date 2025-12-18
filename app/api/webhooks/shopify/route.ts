import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import logger from '@/lib/logger';

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET || '';

// Verify Shopify webhook HMAC signature
function verifyShopifyWebhook(body: string, hmacHeader: string): boolean {
  if (!SHOPIFY_WEBHOOK_SECRET) {
    logger.warn('SHOPIFY_WEBHOOK_SECRET not set, skipping verification');
    return true; // Allow in dev if not configured
  }

  const hash = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(body, 'utf8')
    .digest('base64');

  // Timing-safe comparison
  try {
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hmacHeader));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const hmacHeader = request.headers.get('x-shopify-hmac-sha256') || '';
    const topic = request.headers.get('x-shopify-topic') || '';
    const shopDomain = request.headers.get('x-shopify-shop-domain') || '';

    // Verify HMAC signature
    if (!verifyShopifyWebhook(body, hmacHeader)) {
      logger.error('Invalid Shopify webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);

    logger.log(`[Shopify Webhook] Topic: ${topic}, Shop: ${shopDomain}`);

    // Handle different webhook topics
    switch (topic) {
      case 'orders/create':
        await handleOrderCreate(payload);
        break;
      case 'orders/paid':
        await handleOrderPaid(payload);
        break;
      case 'orders/fulfilled':
        await handleOrderFulfilled(payload);
        break;
      case 'orders/cancelled':
        await handleOrderCancelled(payload);
        break;
      case 'products/create':
        await handleProductCreate(payload);
        break;
      case 'products/update':
        await handleProductUpdate(payload);
        break;
      case 'products/delete':
        await handleProductDelete(payload);
        break;
      case 'customers/create':
        await handleCustomerCreate(payload);
        break;
      case 'customers/update':
        await handleCustomerUpdate(payload);
        break;
      case 'inventory_levels/update':
        await handleInventoryUpdate(payload);
        break;
      default:
        logger.log(`[Shopify Webhook] Unhandled topic: ${topic}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('[Shopify Webhook] Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Webhook handlers - These log in dev only via logger
async function handleOrderCreate(payload: any) {
  logger.log('[Order Created]', {
    id: payload.id,
    orderNumber: payload.order_number,
    totalPrice: payload.total_price,
    itemCount: payload.line_items?.length || 0,
  });
  // Order processing handled by Shopify-Delhivery integration
}

async function handleOrderPaid(payload: any) {
  logger.log('[Order Paid]', {
    id: payload.id,
    orderNumber: payload.order_number,
    totalPrice: payload.total_price,
  });
  // Payment confirmation handled by Razorpay verify-payment route
}

async function handleOrderFulfilled(payload: any) {
  logger.log('[Order Fulfilled]', {
    id: payload.id,
    orderNumber: payload.order_number,
    fulfillmentStatus: payload.fulfillment_status,
  });
  // Fulfillment tracking handled by Delhivery integration
}

async function handleOrderCancelled(payload: any) {
  logger.log('[Order Cancelled]', {
    id: payload.id,
    orderNumber: payload.order_number,
    cancelReason: payload.cancel_reason,
  });
  // Cancellation/refund handled via Shopify admin
}

async function handleProductCreate(payload: any) {
  logger.log('[Product Created]', {
    id: payload.id,
    title: payload.title,
    handle: payload.handle,
  });
  // Products fetched fresh from Shopify API on each request
}

async function handleProductUpdate(payload: any) {
  logger.log('[Product Updated]', {
    id: payload.id,
    title: payload.title,
    handle: payload.handle,
  });
  // Products fetched fresh from Shopify API on each request
}

async function handleProductDelete(payload: any) {
  logger.log('[Product Deleted]', { id: payload.id });
  // Products fetched fresh from Shopify API on each request
}

async function handleCustomerCreate(payload: any) {
  logger.log('[Customer Created]', {
    id: payload.id,
    email: payload.email,
  });
  // Customer data managed via Shopify
}

async function handleCustomerUpdate(payload: any) {
  logger.log('[Customer Updated]', {
    id: payload.id,
    email: payload.email,
  });
  // Customer data managed via Shopify
}

async function handleInventoryUpdate(payload: any) {
  logger.log('[Inventory Updated]', {
    inventoryItemId: payload.inventory_item_id,
    available: payload.available,
  });
  // Inventory managed via Shopify
}
