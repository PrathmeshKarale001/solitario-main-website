import { NextRequest, NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderNumber } = body; // e.g., 1030

    if (!orderNumber) {
      return NextResponse.json({ error: 'Missing orderNumber' }, { status: 400 });
    }

    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    
    if (!shopifyDomain || !adminToken) {
      return NextResponse.json({ error: 'Shopify not configured' }, { status: 500 });
    }

    // Fetch order by number using REST API
    const orderResponse = await fetch(
      `https://${shopifyDomain}.myshopify.com/admin/api/2024-01/orders.json?name=%23${orderNumber}&status=any`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminToken,
        },
      }
    );

    if (!orderResponse.ok) {
      return NextResponse.json({ 
        error: 'Failed to fetch order from Shopify',
        status: orderResponse.status 
      }, { status: 500 });
    }

    const orderData = await orderResponse.json();
    
    if (!orderData.orders || orderData.orders.length === 0) {
      return NextResponse.json({ 
        error: `Order #${orderNumber} not found in Shopify` 
      }, { status: 404 });
    }

    const order = orderData.orders[0];
    const customerId = order.customer?.id;

    if (!customerId) {
      return NextResponse.json({ 
        error: 'Order has no customer linked',
        order: {
          id: order.id,
          name: order.name,
          email: order.email,
        }
      }, { status: 400 });
    }

    // Update Clerk user metadata with correct Shopify customer ID
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        shopifyCustomerId: `gid://shopify/Customer/${customerId}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Shopify customer ID updated in Clerk metadata',
      order: {
        id: order.id,
        name: order.name,
        orderNumber: order.order_number,
        email: order.email,
        customerId: customerId,
        customerEmail: order.customer.email,
        customerName: `${order.customer.first_name} ${order.customer.last_name}`,
      },
      updated: {
        clerkUserId: userId,
        newShopifyCustomerId: `gid://shopify/Customer/${customerId}`,
      },
    });

  } catch (error) {
    console.error('[Fix Order Link] Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fix order link' 
    }, { status: 500 });
  }
}
