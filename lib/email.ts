import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  paymentId: string;
  orderDate: string;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    const itemsHtml = data.items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 12px;">` : ''}
          <strong>${item.name}</strong>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;"><strong>₹${(item.price * item.quantity).toLocaleString('en-IN')}</strong></td>
      </tr>
    `).join('');

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Solitario</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #146552 0%, #1a8066 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 600;">Thank You for Your Order!</h1>
              <p style="margin: 10px 0 0; color: #e0f2f1; font-size: 16px;">Order #${data.orderId}</p>
            </td>
          </tr>
          
          <!-- Order Details -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; color: #374151;">Dear ${data.customerName},</p>
              <p style="margin: 0 0 20px; font-size: 16px; color: #374151; line-height: 1.6;">
                We're excited to confirm that we've received your order! Your exquisite jewellery pieces will be carefully prepared and shipped to you soon.
              </p>
              
              <!-- Order Items -->
              <h2 style="margin: 30px 0 20px; font-size: 20px; color: #146552; border-bottom: 2px solid #146552; padding-bottom: 10px;">Order Items</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f3f4f6;">
                    <th style="padding: 12px; text-align: left; font-size: 14px; color: #6b7280; font-weight: 600;">Item</th>
                    <th style="padding: 12px; text-align: center; font-size: 14px; color: #6b7280; font-weight: 600;">Qty</th>
                    <th style="padding: 12px; text-align: right; font-size: 14px; color: #6b7280; font-weight: 600;">Price</th>
                    <th style="padding: 12px; text-align: right; font-size: 14px; color: #6b7280; font-weight: 600;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              
              <!-- Order Summary -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #6b7280;">Subtotal:</td>
                  <td style="padding: 8px 0; text-align: right; font-size: 15px; color: #374151;">₹${data.subtotal.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #6b7280;">Shipping:</td>
                  <td style="padding: 8px 0; text-align: right; font-size: 15px; color: #16a34a; font-weight: 600;">FREE</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #6b7280;">GST (included):</td>
                  <td style="padding: 8px 0; text-align: right; font-size: 15px; color: #374151;">₹${data.tax.toLocaleString('en-IN')}</td>
                </tr>
                <tr style="border-top: 2px solid #146552;">
                  <td style="padding: 15px 0 8px; font-size: 18px; color: #146552; font-weight: 700;">Total:</td>
                  <td style="padding: 15px 0 8px; text-align: right; font-size: 20px; color: #146552; font-weight: 700;">₹${data.total.toLocaleString('en-IN')}</td>
                </tr>
              </table>
              
              <!-- Shipping Address -->
              <h2 style="margin: 30px 0 15px; font-size: 20px; color: #146552;">Shipping Address</h2>
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #146552;">
                <p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.8;">
                  ${data.customerName}<br>
                  ${data.shippingAddress.line1}<br>
                  ${data.shippingAddress.line2 ? `${data.shippingAddress.line2}<br>` : ''}
                  ${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.pincode}<br>
                  ${data.shippingAddress.country}
                </p>
              </div>
              
              <!-- Payment Info -->
              <div style="margin-top: 30px; padding: 20px; background-color: #ecfdf5; border-radius: 8px; border: 1px solid #a7f3d0;">
                <p style="margin: 0 0 8px; font-size: 14px; color: #065f46; font-weight: 600;">✓ Payment Confirmed</p>
                <p style="margin: 0; font-size: 13px; color: #047857;">Payment ID: ${data.paymentId}</p>
              </div>
              
              <!-- What's Next -->
              <h2 style="margin: 30px 0 15px; font-size: 20px; color: #146552;">What's Next?</h2>
              <ol style="margin: 0; padding-left: 20px; color: #374151; line-height: 1.8;">
                <li style="margin-bottom: 10px;">Your order is being processed and prepared for shipment</li>
                <li style="margin-bottom: 10px;">You'll receive a shipping confirmation email with tracking details</li>
                <li style="margin-bottom: 10px;">Track your order anytime from your account dashboard</li>
                <li>Enjoy your beautiful jewellery!</li>
              </ol>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 40px 0 20px;">
                <a href="https://thesolitario.com/account/orders" style="display: inline-block; background-color: #146552; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(20, 101, 82, 0.3);">
                  View Order Details
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">Need help? Contact us at <a href="mailto:paymentdesk@thesolitario.com" style="color: #146552; text-decoration: none;">paymentdesk@thesolitario.com</a></p>
              <p style="margin: 0; font-size: 13px; color: #9ca3af;">© 2024 Solitario. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Send to customer
    await resend.emails.send({
      from: 'Solitario <orders@thesolitario.com>',
      to: data.customerEmail,
      subject: `Order Confirmation - ${data.orderId} | Solitario`,
      html: emailHtml,
    });

    // Send copy to paymentdesk
    await resend.emails.send({
      from: 'Solitario <orders@thesolitario.com>',
      to: 'paymentdesk@thesolitario.com',
      subject: `New Order Received - ${data.orderId}`,
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return { success: false, error };
  }
}

export async function sendShippingNotification(
  customerEmail: string,
  customerName: string,
  orderId: string,
  trackingNumber: string,
  carrier: string = 'Delhivery'
) {
  try {
    const trackingUrl = `https://www.delhivery.com/track/package/${trackingNumber}`;
    
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Order Has Shipped - Solitario</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #146552 0%, #1a8066 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px;">Your Order Has Shipped! 📦</h1>
              <p style="margin: 10px 0 0; color: #e0f2f1; font-size: 16px;">Order #${orderId}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; font-size: 16px; color: #374151;">Dear ${customerName},</p>
              <p style="margin: 0 0 30px; font-size: 16px; color: #374151; line-height: 1.6;">
                Great news! Your order has been shipped and is on its way to you. You can track your package using the details below.
              </p>
              
              <div style="background-color: #f0fdf4; padding: 25px; border-radius: 8px; border-left: 4px solid #16a34a; margin-bottom: 30px;">
                <p style="margin: 0 0 10px; font-size: 14px; color: #166534; font-weight: 600;">Tracking Number:</p>
                <p style="margin: 0 0 15px; font-size: 20px; color: #15803d; font-weight: 700; letter-spacing: 1px;">${trackingNumber}</p>
                <p style="margin: 0 0 5px; font-size: 14px; color: #166534; font-weight: 600;">Carrier:</p>
                <p style="margin: 0; font-size: 16px; color: #15803d;">${carrier}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${trackingUrl}" style="display: inline-block; background-color: #146552; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                  Track Your Package
                </a>
              </div>
              
              <p style="margin: 30px 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                Your package will be delivered within 3-5 business days. If you have any questions, please contact us at 
                <a href="mailto:paymentdesk@thesolitario.com" style="color: #146552;">paymentdesk@thesolitario.com</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 13px; color: #9ca3af;">© 2024 Solitario. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await resend.emails.send({
      from: 'Solitario <orders@thesolitario.com>',
      to: customerEmail,
      subject: `Your Order Has Shipped - ${orderId} | Solitario`,
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send shipping notification:', error);
    return { success: false, error };
  }
}

export async function sendDeliveryConfirmation(
  customerEmail: string,
  customerName: string,
  orderId: string
) {
  try {
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Delivered - Solitario</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px;">Order Delivered! 🎉</h1>
              <p style="margin: 10px 0 0; color: #dcfce7; font-size: 16px;">Order #${orderId}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <p style="margin: 0 0 20px; font-size: 18px; color: #374151;">Dear ${customerName},</p>
              <p style="margin: 0 0 30px; font-size: 16px; color: #374151; line-height: 1.6;">
                Your order has been successfully delivered! We hope you love your new jewellery pieces.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://thesolitario.com/account/orders" style="display: inline-block; background-color: #146552; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                  View Order
                </a>
              </div>
              
              <p style="margin: 30px 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                Thank you for choosing Solitario. We'd love to hear about your experience!
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 13px; color: #9ca3af;">© 2024 Solitario. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await resend.emails.send({
      from: 'Solitario <orders@thesolitario.com>',
      to: customerEmail,
      subject: `Order Delivered - ${orderId} | Solitario`,
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send delivery confirmation:', error);
    return { success: false, error };
  }
}
