import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { shopifyStorefrontFetch } from '@/lib/shopify';

const CUSTOMER_ORDERS_QUERY = `
  query getCustomerOrders($customerAccessToken: String!, $first: Int!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            fulfillmentStatus
            financialStatus
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id
                    price {
                      amount
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const shopifyAccessToken = (session.user as any).shopifyAccessToken;
    
    if (!shopifyAccessToken) {
      // User logged in via Google but doesn't have Shopify token
      // Return empty orders - they haven't made purchases yet
      return NextResponse.json({ orders: [] });
    }

    const result = await shopifyStorefrontFetch<{
      customer: {
        orders: {
          edges: Array<{
            node: {
              id: string;
              orderNumber: number;
              processedAt: string;
              fulfillmentStatus: string;
              financialStatus: string;
              totalPrice: { amount: string; currencyCode: string };
              lineItems: {
                edges: Array<{
                  node: {
                    title: string;
                    quantity: number;
                    variant: {
                      id: string;
                      price: { amount: string };
                      image: { url: string; altText: string } | null;
                    } | null;
                  };
                }>;
              };
            };
          }>;
        };
      } | null;
    }>(CUSTOMER_ORDERS_QUERY, {
      customerAccessToken: shopifyAccessToken,
      first: 20,
    });

    if (!result.data?.customer?.orders) {
      return NextResponse.json({ orders: [] });
    }

    // Transform Shopify orders to our format
    const orders = result.data.customer.orders.edges.map(({ node }) => {
      // Map fulfillment status to our status
      let status: 'processing' | 'shipped' | 'delivered' | 'cancelled' = 'processing';
      if (node.fulfillmentStatus === 'FULFILLED') {
        status = 'delivered';
      } else if (node.fulfillmentStatus === 'IN_PROGRESS' || node.fulfillmentStatus === 'PARTIALLY_FULFILLED') {
        status = 'shipped';
      } else if (node.financialStatus === 'REFUNDED' || node.financialStatus === 'VOIDED') {
        status = 'cancelled';
      }

      return {
        id: node.id,
        orderNumber: `SOL-${node.orderNumber}`,
        date: node.processedAt,
        status,
        total: parseFloat(node.totalPrice.amount),
        items: node.lineItems.edges.map(({ node: item }) => ({
          id: item.variant?.id || '',
          name: item.title,
          image: item.variant?.image?.url || '/images/placeholder.png',
          price: parseFloat(item.variant?.price?.amount || '0'),
          quantity: item.quantity,
        })),
      };
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
