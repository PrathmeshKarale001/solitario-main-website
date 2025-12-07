import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET || '';

// Verify Shopify webhook HMAC signature
function verifyShopifyWebhook(body: string, hmacHeader: string): boolean {
  if (!SHOPIFY_WEBHOOK_SECRET) {
    console.warn('SHOPIFY_WEBHOOK_SECRET not set, skipping verification');
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
      console.error('Invalid Shopify webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);

    console.log(`[Shopify Webhook] Topic: ${topic}, Shop: ${shopDomain}`);

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
        console.log(`[Shopify Webhook] Unhandled topic: ${topic}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Shopify Webhook] Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Webhook handlers
async function handleOrderCreate(payload: any) {
  console.log('[Order Created]', {
    id: payload.id,
    orderNumber: payload.order_number,
    email: payload.email,
    totalPrice: payload.total_price,
    currency: payload.currency,
    itemCount: payload.line_items?.length || 0,
  });

  // TODO: Emit analytics event, send to warehouse, trigger notifications
  // Example: await emitEvent('order_created', payload);
}

async function handleOrderPaid(payload: any) {
  console.log('[Order Paid]', {
    id: payload.id,
    orderNumber: payload.order_number,
    email: payload.email,
    totalPrice: payload.total_price,
  });

  // TODO: Update order status in sidecar DB, trigger fulfillment workflow
}

async function handleOrderFulfilled(payload: any) {
  console.log('[Order Fulfilled]', {
    id: payload.id,
    orderNumber: payload.order_number,
    fulfillmentStatus: payload.fulfillment_status,
  });

  // TODO: Send shipping notification, update analytics
}

async function handleOrderCancelled(payload: any) {
  console.log('[Order Cancelled]', {
    id: payload.id,
    orderNumber: payload.order_number,
    cancelReason: payload.cancel_reason,
  });

  // TODO: Process refund, update inventory, notify customer
}

async function handleProductCreate(payload: any) {
  console.log('[Product Created]', {
    id: payload.id,
    title: payload.title,
    handle: payload.handle,
    status: payload.status,
  });

  // TODO: Revalidate ISR cache, update search index
  // Example: await revalidatePath('/products');
}

async function handleProductUpdate(payload: any) {
  console.log('[Product Updated]', {
    id: payload.id,
    title: payload.title,
    handle: payload.handle,
    status: payload.status,
  });

  // TODO: Revalidate ISR cache, update search index
  // Example: await revalidatePath(`/products/${payload.handle}`);
}

async function handleProductDelete(payload: any) {
  console.log('[Product Deleted]', {
    id: payload.id,
  });

  // TODO: Remove from search index, handle redirects
}

async function handleCustomerCreate(payload: any) {
  console.log('[Customer Created]', {
    id: payload.id,
    email: payload.email,
    firstName: payload.first_name,
    lastName: payload.last_name,
  });

  // TODO: Emit analytics event, sync to CRM
}

async function handleCustomerUpdate(payload: any) {
  console.log('[Customer Updated]', {
    id: payload.id,
    email: payload.email,
  });

  // TODO: Sync to CRM, update sidecar DB
}

async function handleInventoryUpdate(payload: any) {
  console.log('[Inventory Updated]', {
    inventoryItemId: payload.inventory_item_id,
    locationId: payload.location_id,
    available: payload.available,
  });

  // TODO: Update product availability, trigger back-in-stock notifications
}
