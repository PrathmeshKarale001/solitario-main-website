import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createDelhiveryShipment, isDelhiveryConfigured } from '@/lib/delhivery';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderItem {
  name: string;
  sku?: string;
  productId?: string;
  variant: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderData {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      line2: string;
      city: string;
      state: string;
      pincode: string;
    };
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  grandTotal: number;
  paymentMethod: string;
  orderDate: string;
}

function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SOL-${timestamp}-${random}`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function generateEmailHTML(order: OrderData, orderId: string): string {
  const itemsHTML = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong>
          ${item.variant ? `<br><span style="color: #666; font-size: 12px;">${item.variant}</span>` : ''}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order - ${orderId}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #146552 0%, #0d4a3a 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🛍️ New Order Received</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Order ID: <strong>${orderId}</strong></p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <!-- Customer Details -->
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #146552; margin: 0 0 15px; font-size: 18px;">👤 Customer Details</h2>
          <table style="width: 100%; font-size: 14px;">
            <tr>
              <td style="padding: 5px 0; color: #666;">Name:</td>
              <td style="padding: 5px 0;"><strong>${order.customer.name}</strong></td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #666;">Email:</td>
              <td style="padding: 5px 0;"><a href="mailto:${order.customer.email}">${order.customer.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #666;">Phone:</td>
              <td style="padding: 5px 0;"><a href="tel:${order.customer.phone}">${order.customer.phone}</a></td>
            </tr>
          </table>
        </div>

        <!-- Shipping Address -->
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #146552; margin: 0 0 15px; font-size: 18px;">📍 Shipping Address</h2>
          <p style="margin: 0; font-size: 14px;">
            ${order.customer.address.line1}<br>
            ${order.customer.address.line2 ? `${order.customer.address.line2}<br>` : ''}
            ${order.customer.address.city}, ${order.customer.address.state}<br>
            <strong>PIN: ${order.customer.address.pincode}</strong>
          </p>
        </div>

        <!-- Order Items -->
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #146552; margin: 0 0 15px; font-size: 18px;">📦 Order Items</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 12px; text-align: left;">Product</th>
                <th style="padding: 12px; text-align: center;">Qty</th>
                <th style="padding: 12px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
        </div>

        <!-- Order Summary -->
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #146552; margin: 0 0 15px; font-size: 18px;">💰 Order Summary</h2>
          <table style="width: 100%; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0;">Subtotal:</td>
              <td style="padding: 8px 0; text-align: right;">${formatCurrency(order.subtotal)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">Shipping:</td>
              <td style="padding: 8px 0; text-align: right;">${order.shipping === 0 ? '<span style="color: #146552;">FREE</span>' : formatCurrency(order.shipping)}</td>
            </tr>
            <tr style="border-top: 2px solid #146552;">
              <td style="padding: 12px 0; font-size: 18px;"><strong>Grand Total:</strong></td>
              <td style="padding: 12px 0; text-align: right; font-size: 18px; color: #146552;"><strong>${formatCurrency(order.grandTotal)}</strong></td>
            </tr>
          </table>
        </div>

        <!-- Payment Method -->
        <div style="background: ${order.paymentMethod.includes('COD') || order.paymentMethod.includes('Cash') ? '#fff3cd' : '#d4edda'}; padding: 20px; border-radius: 8px; text-align: center;">
          <h2 style="margin: 0 0 10px; font-size: 16px;">💳 Payment Method</h2>
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: ${order.paymentMethod.includes('COD') || order.paymentMethod.includes('Cash') ? '#856404' : '#155724'};">
            ${order.paymentMethod}
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px; margin: 0;">
            Order placed on: ${new Date(order.orderDate).toLocaleString('en-IN', { 
              dateStyle: 'full', 
              timeStyle: 'short',
              timeZone: 'Asia/Kolkata'
            })}
          </p>
          <p style="color: #666; font-size: 12px; margin: 10px 0 0;">
            This order was placed via <strong>shop.thesolitario.com</strong>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderData = await request.json();
    const orderId = generateOrderId();

    // Validate required fields
    if (!orderData.customer?.name || !orderData.customer?.email || !orderData.customer?.phone) {
      return NextResponse.json(
        { error: 'Missing required customer information' },
        { status: 400 }
      );
    }

    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { error: 'No items in order' },
        { status: 400 }
      );
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Solitario Orders <orders@thesolitario.com>',
      to: ['paymentdesk@thesolitario.com'],
      replyTo: orderData.customer.email,
      subject: `🛍️ New Order ${orderId} - ${orderData.customer.name} - ${formatCurrency(orderData.grandTotal)}`,
      html: generateEmailHTML(orderData, orderId),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send order notification' },
        { status: 500 }
      );
    }

    // Also send confirmation to customer
    await resend.emails.send({
      from: 'Solitario Diamonds <orders@thesolitario.com>',
      to: [orderData.customer.email],
      subject: `Order Confirmation - ${orderId} | Solitario Diamonds`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #146552 0%, #0d4a3a 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Your Order!</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Dear ${orderData.customer.name.split(' ')[0]},</p>
            
            <p>We have received your order and our team will contact you shortly to confirm the details.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="margin: 0 0 10px; color: #666;">Your Order Reference:</p>
              <p style="margin: 0; font-size: 24px; font-weight: bold; color: #146552;">${orderId}</p>
            </div>
            
            <p><strong>Order Total:</strong> ${formatCurrency(orderData.grandTotal)}</p>
            <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
            
            <p>If you have any questions, please don't hesitate to contact us:</p>
            <ul>
              <li>Phone: <a href="tel:+917887883444">+91 788 788 3444</a></li>
              <li>Email: <a href="mailto:paymentdesk@thesolitario.com">paymentdesk@thesolitario.com</a></li>
            </ul>
            
            <p style="margin-top: 30px;">With love,<br><strong>Team Solitario</strong></p>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order submitted successfully',
    });
  } catch (error: any) {
    console.error('Order submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit order' },
      { status: 500 }
    );
  }
}
