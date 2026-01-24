import { NextRequest, NextResponse } from 'next/server';
import { shopifyAdminFetch } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log(`[Debug Customer] Searching for customer with email: ${email}`);

    // Search for customer by email
    const customerSearchResult = await shopifyAdminFetch(
      `query searchCustomer($query: String!) {
        customers(first: 1, query: $query) {
          edges {
            node {
              id
              email
              firstName
              lastName
              createdAt
              ordersCount
              orders(first: 50, sortKey: PROCESSED_AT, reverse: true) {
                edges {
                  node {
                    id
                    name
                    orderNumber
                    processedAt
                    financialStatus
                    fulfillmentStatus
                    totalPriceV2 {
                      amount
                      currencyCode
                    }
                    customer {
                      id
                      email
                    }
                  }
                }
              }
            }
          }
        }
      }`,
      { query: `email:${email}` }
    );

    console.log('[Debug Customer] Shopify response:', JSON.stringify(customerSearchResult, null, 2));

    if (customerSearchResult.errors) {
      return NextResponse.json({
        success: false,
        error: 'Shopify API error',
        details: customerSearchResult.errors,
      });
    }

    const customerEdges = customerSearchResult.data?.customers?.edges || [];

    if (customerEdges.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No customer found with this email in Shopify',
        email,
      });
    }

    const customer = customerEdges[0].node;
    const orders = customer.orders?.edges || [];

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        createdAt: customer.createdAt,
        ordersCount: customer.ordersCount,
      },
      orders: orders.map((edge: any) => ({
        id: edge.node.id,
        name: edge.node.name,
        orderNumber: edge.node.orderNumber,
        processedAt: edge.node.processedAt,
        financialStatus: edge.node.financialStatus,
        fulfillmentStatus: edge.node.fulfillmentStatus,
        total: edge.node.totalPriceV2,
        customerEmail: edge.node.customer?.email,
      })),
      totalOrders: orders.length,
    });

  } catch (error) {
    console.error('[Debug Customer] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
