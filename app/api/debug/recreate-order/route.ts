import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, orderData } = body;

    if (!orderId || !orderData) {
      return NextResponse.json({ 
        error: 'Missing orderId or orderData' 
      }, { status: 400 });
    }

    // Create order in Shopify
    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    
    if (!shopifyDomain || !adminToken) {
      return NextResponse.json({ 
        error: 'Shopify not configured' 
      }, { status: 500 });
    }

    const lineItems = orderData.items.map((item: any) => ({
      variant_id: item.variantId?.replace('gid://shopify/ProductVariant/', ''),
      quantity: item.quantity,
      price: item.price.toString(),
      sku: item.sku || undefined,
      name: item.name,
    }));

    // Search for customer
    let customerId = null;
    try {
      const customerResponse = await fetch(
        `https://${shopifyDomain}.myshopify.com/admin/api/2024-01/customers/search.json?query=email:${orderData.customer.email}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': adminToken,
          },
        }
      );
      
      if (customerResponse.ok) {
        const customerData = await customerResponse.json();
        if (customerData.customers && customerData.customers.length > 0) {
          customerId = customerData.customers[0].id;
        }
      }
    } catch (error) {
      console.error('Failed to search for customer:', error);
    }

    const shopifyOrder = {
      order: {
        line_items: lineItems,
        customer: customerId ? { id: customerId } : {
          first_name: orderData.customer.name.split(' ')[0],
          last_name: orderData.customer.name.split(' ').slice(1).join(' ') || '',
          email: orderData.customer.email,
          phone: orderData.customer.phone,
        },
        shipping_address: {
          first_name: orderData.customer.name.split(' ')[0],
          last_name: orderData.customer.name.split(' ').slice(1).join(' ') || '',
          address1: orderData.customer.address.line1,
          address2: orderData.customer.address.line2 || '',
          city: orderData.customer.address.city,
          province: orderData.customer.address.state,
          zip: orderData.customer.address.pincode,
          country: 'India',
          phone: orderData.customer.phone,
        },
        financial_status: 'paid',
        note: `Manual Recreation - Original Order ID: ${orderId}\nRazorpay Payment ID: ${orderData.paymentId || 'N/A'}`,
        tags: 'razorpay,website,solitario,manual-recreation',
        transactions: [
          {
            kind: 'sale',
            status: 'success',
            amount: orderData.total.toString(),
            gateway: 'razorpay',
          },
        ],
      },
    };

    const response = await fetch(
      `https://${shopifyDomain}.myshopify.com/admin/api/2024-01/orders.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminToken,
        },
        body: JSON.stringify(shopifyOrder),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ 
        error: 'Shopify order creation failed',
        details: errorData 
      }, { status: 500 });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Order created in Shopify successfully',
      shopifyOrder: {
        id: data.order.id,
        name: data.order.name,
        customerId: data.order.customer?.id,
      },
    });

  } catch (error) {
    console.error('[Recreate Order] Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to recreate order' 
    }, { status: 500 });
  }
}
