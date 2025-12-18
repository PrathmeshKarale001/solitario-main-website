import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentSignature, PaymentVerification, CustomerDetails, CartItemForOrder } from '@/lib/razorpay';
import crypto from 'crypto';
import logger from '@/lib/logger';

// Track verified payments to prevent replay attacks
const verifiedPayments = new Set<string>();
const PAYMENT_CACHE_TTL = 3600000; // 1 hour

// Cleanup old entries periodically
setInterval(() => {
  verifiedPayments.clear();
}, PAYMENT_CACHE_TTL);

// Delhivery integration is now handled via Shopify-Delhivery sync
// Orders created in Shopify will automatically appear in Delhivery ONE as "Pending AWB"
// Management can then approve and generate AWB from Delhivery dashboard

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

    // Prevent replay attacks - check if payment was already verified
    const paymentKey = `${razorpay_order_id}:${razorpay_payment_id}`;
    if (verifiedPayments.has(paymentKey)) {
      return NextResponse.json(
        { error: 'Payment already processed' },
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
      logger.error('Payment signature verification failed');
      return NextResponse.json(
        { error: 'Payment verification failed. Please contact support.' },
        { status: 400 }
      );
    }

    // Payment verified successfully - mark as processed to prevent replay
    verifiedPayments.add(paymentKey);
    
    // Generate order ID for internal tracking
    const orderId = `SOL${Date.now().toString(36).toUpperCase()}`;
    
    // Step 1: Create order in Shopify for inventory management
    let shopifyOrderId = null;
    let shopifyOrderName = null;
    try {
      const shopifyResult = await createShopifyOrder(orderData, razorpay_payment_id, orderId);
      shopifyOrderId = shopifyResult.id;
      shopifyOrderName = shopifyResult.name;
    } catch (shopifyError) {
      logger.error('Failed to create Shopify order:', shopifyError);
      // Don't fail the payment - just log the error
    }

    // Step 2: Delhivery shipping is handled via Shopify-Delhivery integration
    // Orders created in Shopify will automatically sync to Delhivery ONE as "Pending AWB"
    // Management can then review and approve orders, generating AWB when ready

    const confirmedOrder = {
      orderId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      shopifyOrderId,
      shopifyOrderName,
      delhiveryStatus: 'pending_sync', // Will sync to Delhivery via Shopify integration
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
    logger.error('Error verifying payment:', error);
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

// Note: Delhivery tracking is now handled via Shopify-Delhivery integration
// When Delhivery generates AWB, it will automatically update Shopify with tracking info
