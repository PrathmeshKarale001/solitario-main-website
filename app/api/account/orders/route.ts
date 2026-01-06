import { NextRequest, NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { shopifyAdminFetch } from '@/lib/shopify';

const CUSTOMER_ORDERS_QUERY = `
  query getCustomerOrders($customerId: ID!, $first: Int!) {
    customer(id: $customerId) {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            fulfillmentStatus
            financialStatus
            totalPriceV2 {
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
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
            shippingAddress {
              firstName
              lastName
              address1
              city
              province
              country
              zip
            }
          }
        }
      }
    }
  }
`;

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    
    // Get Shopify customer ID from metadata
    const shopifyCustomerId = user.publicMetadata.shopifyCustomerId as string;
    
    if (!shopifyCustomerId) {
      return NextResponse.json({ 
        orders: [],
        message: 'No Shopify customer linked. Add an address to sync with Shopify.' 
      });
    }

    // Fetch orders from Shopify Admin API
    const result = await shopifyAdminFetch(CUSTOMER_ORDERS_QUERY, {
      customerId: shopifyCustomerId,
      first: 20,
    });

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    const orders = result.data?.customer?.orders?.edges || [];
    
    console.log(`[Orders API] Fetched ${orders.length} orders for user ${userId}`);

    return NextResponse.json({
      orders: orders.map((edge: any) => ({
        id: edge.node.id,
        name: edge.node.name,
        orderNumber: edge.node.orderNumber,
        date: edge.node.processedAt,
        status: {
          payment: edge.node.financialStatus,
          fulfillment: edge.node.fulfillmentStatus,
        },
        total: {
          amount: edge.node.totalPriceV2.amount,
          currency: edge.node.totalPriceV2.currencyCode,
        },
        items: edge.node.lineItems.edges.map((item: any) => ({
          title: item.node.title,
          quantity: item.node.quantity,
          variant: item.node.variant.title,
          price: {
            amount: item.node.variant.priceV2.amount,
            currency: item.node.variant.priceV2.currencyCode,
          },
          image: item.node.variant.image?.url,
        })),
        shippingAddress: edge.node.shippingAddress,
      })),
    });

  } catch (error) {
    console.error('[Orders API] Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch orders' 
    }, { status: 500 });
  }
}
