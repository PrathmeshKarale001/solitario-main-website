import { NextRequest, NextResponse } from 'next/server';
import { getRazorpayInstance, generateReceiptId, rupeesToPaise, CartItemForOrder, CustomerDetails } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customer, subtotal, shipping, tax, total } = body as {
      items: CartItemForOrder[];
      customer: CustomerDetails;
      subtotal: number;
      shipping: number;
      tax: number;
      total: number;
    };

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    if (!customer || !customer.email || !customer.phone) {
      return NextResponse.json(
        { error: 'Customer details required' },
        { status: 400 }
      );
    }

    if (!total || total <= 0) {
      return NextResponse.json(
        { error: 'Invalid order total' },
        { status: 400 }
      );
    }

    // Initialize Razorpay
    const razorpay = getRazorpayInstance();
    
    // Generate receipt ID
    const receiptId = generateReceiptId();
    
    // Create order in Razorpay
    const order = await razorpay.orders.create({
      amount: rupeesToPaise(total),
      currency: 'INR',
      receipt: receiptId,
      notes: {
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        items_count: items.length.toString(),
        shipping_address: `${customer.address.line1}, ${customer.address.city}, ${customer.address.state} - ${customer.address.pincode}`,
      },
    });

    // Store order details in session/database (for verification later)
    // In production, save to database
    const orderData = {
      razorpayOrderId: order.id,
      receiptId,
      items,
      customer,
      subtotal,
      shipping,
      tax,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: receiptId,
      },
      orderData,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    
    // Check if it's a Razorpay API key error
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
