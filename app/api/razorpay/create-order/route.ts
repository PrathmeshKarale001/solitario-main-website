import { NextRequest, NextResponse } from 'next/server';
import { getRazorpayInstance, generateReceiptId, rupeesToPaise, CartItemForOrder, CustomerDetails } from '@/lib/razorpay';
import logger from '@/lib/logger';

// Rate limiting: Simple in-memory store (use Redis in production for multi-instance)
const orderAttempts = new Map<string, { count: number; lastAttempt: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_ATTEMPTS = 5; // Max 5 orders per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = orderAttempts.get(ip);
  
  if (!record || now - record.lastAttempt > RATE_LIMIT_WINDOW) {
    orderAttempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }
  
  if (record.count >= MAX_ATTEMPTS) {
    return false;
  }
  
  record.count++;
  record.lastAttempt = now;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

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

    // Validate minimum order amount (Razorpay minimum is ₹1)
    if (total < 1) {
      return NextResponse.json(
        { error: 'Order total must be at least ₹1' },
        { status: 400 }
      );
    }

    // Validate maximum order amount (₹50 lakhs for safety)
    if (total > 5000000) {
      return NextResponse.json(
        { error: 'Order total exceeds maximum limit. Please contact support for large orders.' },
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
    logger.error('Error creating Razorpay order:', error);
    
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
