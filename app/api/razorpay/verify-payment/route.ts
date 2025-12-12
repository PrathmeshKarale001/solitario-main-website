import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature, PaymentVerification, CustomerDetails, CartItemForOrder } from '@/lib/razorpay';
import { createDelhiveryShipment, isDelhiveryConfigured } from '@/lib/delhivery';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderData 
    } = body as PaymentVerification & { 
      orderData: {
        items: CartItemForOrder[];
        customer: CustomerDetails;
        subtotal: number;
        shipping: number;
        tax: number;
        total: number;
        receiptId: string;
      }
    };

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification details' },
        { status: 400 }
      );
    }

    // Get secret key
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: 'Payment verification not configured' },
        { status: 503 }
      );
    }

    // Verify signature
    const body_data = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body_data)
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      console.error('Payment signature verification failed');
      return NextResponse.json(
        { error: 'Payment verification failed. Please contact support.' },
        { status: 400 }
      );
    }

    // Payment verified successfully
    // Generate order ID for internal tracking
    const orderId = `SOL${Date.now().toString(36).toUpperCase()}`;
    
    // Step 1: Create order in Shopify for inventory management
    let shopifyOrderId = null;
    let shopifyOrderName = null;
    try {
      const shopifyResult = await createShopifyOrder(orderData, razorpay_payment_id, orderId);
      shopifyOrderId = shopifyResult.id;
      shopifyOrderName = shopifyResult.name;
      console.log(`Shopify order created: ${shopifyOrderName} (${shopifyOrderId})`);
    } catch (shopifyError) {
      console.error('Failed to create Shopify order:', shopifyError);
      // Don't fail the payment - just log the error
    }

    // Step 2: Create shipment in Delhivery
    let delhiveryWaybill = null;
    if (isDelhiveryConfigured()) {
      try {
        // Prepare items with SKU for Delhivery
        const shippingItems = orderData.items.map(item => ({
          name: item.name,
          sku: item.sku || item.productId, // Use SKU if available, fallback to productId
          quantity: item.quantity,
          price: item.price,
        }));

        const delhiveryResult = await createDelhiveryShipment(
          orderId,
          orderData.customer,
          shippingItems,
          orderData.total,
          'Prepaid' // Payment already done via Razorpay
        );

        if (delhiveryResult.success && delhiveryResult.waybill) {
          delhiveryWaybill = delhiveryResult.waybill;
          console.log(`Delhivery shipment created: ${delhiveryWaybill}`);

          // Update Shopify order with tracking number
          if (shopifyOrderId) {
            try {
              await updateShopifyOrderWithTracking(shopifyOrderId, delhiveryWaybill);
            } catch (trackingError) {
              console.error('Failed to update Shopify with tracking:', trackingError);
            }
          }
        } else {
          console.error('Delhivery shipment creation failed:', delhiveryResult.error);
        }
      } catch (delhiveryError) {
        console.error('Error creating Delhivery shipment:', delhiveryError);
        // Don't fail the order - shipping can be created manually
      }
    }

    const confirmedOrder = {
      orderId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      shopifyOrderId,
      shopifyOrderName,
      delhiveryWaybill,
      items: orderData.items,
      customer: orderData.customer,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      tax: orderData.tax,
      total: orderData.total,
      status: 'paid',
      paymentMethod: 'razorpay',
      paidAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order: confirmedOrder,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Payment verification failed. Please contact support.' },
      { status: 500 }
    );
  }
}

// Helper function to create order in Shopify (for inventory/fulfillment)
async function createShopifyOrder(
  orderData: any, 
  paymentId: string, 
  internalOrderId: string
): Promise<{ id: string; name: string }> {
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  
  if (!shopifyDomain || !adminToken) {
    throw new Error('Shopify not configured');
  }

  const lineItems = orderData.items.map((item: CartItemForOrder) => ({
    variant_id: item.variantId?.replace('gid://shopify/ProductVariant/', ''),
    quantity: item.quantity,
    price: item.price.toString(),
    sku: item.sku || undefined,
    name: item.name,
  }));

  const shopifyOrder = {
    order: {
      line_items: lineItems,
      customer: {
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
      note: `Razorpay Payment ID: ${paymentId}\nInternal Order ID: ${internalOrderId}`,
      tags: 'razorpay,website,solitario',
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
    throw new Error(`Shopify order creation failed: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return { id: data.order.id, name: data.order.name };
}

// Helper function to update Shopify order with Delhivery tracking number
async function updateShopifyOrderWithTracking(
  shopifyOrderId: string, 
  waybill: string
): Promise<void> {
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  
  if (!shopifyDomain || !adminToken) {
    throw new Error('Shopify not configured');
  }

  // Add fulfillment with tracking info
  const fulfillmentData = {
    fulfillment: {
      tracking_number: waybill,
      tracking_company: 'Delhivery',
      tracking_url: `https://www.delhivery.com/track/package/${waybill}`,
      notify_customer: true,
    },
  };

  const response = await fetch(
    `https://${shopifyDomain}.myshopify.com/admin/api/2024-01/orders/${shopifyOrderId}/fulfillments.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify(fulfillmentData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Failed to add tracking to Shopify:', errorData);
    // Don't throw - this is not critical
  }
}
