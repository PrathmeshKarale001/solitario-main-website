import { NextRequest, NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { shopifyAdminFetch } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orderId = params.id;

    // Fetch order details from Shopify
    const orderQuery = `
      query getOrder($id: ID!) {
        order(id: $id) {
          id
          name
          processedAt
          displayFinancialStatus
          displayFulfillmentStatus
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          subtotalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          totalShippingPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          totalTaxSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          lineItems(first: 50) {
            edges {
              node {
                title
                quantity
                variant {
                  title
                  price
                }
              }
            }
          }
          shippingAddress {
            firstName
            lastName
            address1
            address2
            city
            province
            country
            zip
            phone
          }
          customer {
            email
            firstName
            lastName
          }
        }
      }
    `;

    const result = await shopifyAdminFetch(orderQuery, { id: orderId });

    if (result.errors || !result.data?.order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = result.data.order;

    // Generate simple HTML invoice
    const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice - ${order.name}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #2d5f4f; padding-bottom: 20px; }
    .company-name { font-size: 32px; font-weight: bold; color: #2d5f4f; margin-bottom: 5px; }
    .invoice-title { font-size: 24px; color: #666; }
    .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .info-box { width: 48%; }
    .info-box h3 { color: #2d5f4f; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #2d5f4f; color: white; padding: 12px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #ddd; }
    .totals { text-align: right; }
    .totals table { width: 300px; margin-left: auto; }
    .total-row { font-weight: bold; font-size: 18px; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-name">SOLITARIO</div>
    <div class="invoice-title">INVOICE</div>
  </div>

  <div class="info-section">
    <div class="info-box">
      <h3>Bill To:</h3>
      <p>
        ${order.customer?.firstName} ${order.customer?.lastName}<br>
        ${order.shippingAddress?.address1}<br>
        ${order.shippingAddress?.address2 ? order.shippingAddress.address2 + '<br>' : ''}
        ${order.shippingAddress?.city}, ${order.shippingAddress?.province} ${order.shippingAddress?.zip}<br>
        ${order.shippingAddress?.country}<br>
        Phone: ${order.shippingAddress?.phone || 'N/A'}<br>
        Email: ${order.customer?.email}
      </p>
    </div>
    <div class="info-box">
      <h3>Invoice Details:</h3>
      <p>
        <strong>Invoice Number:</strong> ${order.name}<br>
        <strong>Date:</strong> ${new Date(order.processedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
        <strong>Payment Status:</strong> ${order.displayFinancialStatus}<br>
        <strong>Fulfillment Status:</strong> ${order.displayFulfillmentStatus}
      </p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${order.lineItems.edges.map((item: any) => `
        <tr>
          <td>${item.node.title}${item.node.variant?.title ? ` - ${item.node.variant.title}` : ''}</td>
          <td>${item.node.quantity}</td>
          <td>₹${parseFloat(item.node.variant?.price || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td>₹${(parseFloat(item.node.variant?.price || '0') * item.node.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr>
        <td>Subtotal:</td>
        <td>₹${parseFloat(order.subtotalPriceSet?.shopMoney?.amount || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
      <tr>
        <td>Shipping:</td>
        <td>₹${parseFloat(order.totalShippingPriceSet?.shopMoney?.amount || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
      <tr>
        <td>Tax:</td>
        <td>₹${parseFloat(order.totalTaxSet?.shopMoney?.amount || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
      <tr class="total-row">
        <td>Total:</td>
        <td>₹${parseFloat(order.totalPriceSet?.shopMoney?.amount || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
    </table>
  </div>

  <div class="footer">
    <p>Thank you for your purchase!</p>
    <p>For any queries, please contact us at support@thesolitario.com</p>
  </div>
</body>
</html>
    `;

    return new NextResponse(invoiceHTML, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="invoice-${order.name}.html"`,
      },
    });

  } catch (error) {
    console.error('[Invoice API] Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate invoice' 
    }, { status: 500 });
  }
}
