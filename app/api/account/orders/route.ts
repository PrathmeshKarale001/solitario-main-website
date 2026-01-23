import { NextRequest, NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { shopifyAdminFetch } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

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
    
    // Get user's email
    const userEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    
    if (!userEmail) {
      return NextResponse.json({ 
        orders: [],
        message: 'No email address found' 
      });
    }

    // Get Shopify customer ID from metadata
    const shopifyCustomerId = user.publicMetadata.shopifyCustomerId as string;
    
    let orders = [];
    
    if (shopifyCustomerId) {
      // Fetch orders using customer ID (preferred method)
      const result = await shopifyAdminFetch(CUSTOMER_ORDERS_QUERY, {
        customerId: shopifyCustomerId,
        first: 20,
      });

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      orders = result.data?.customer?.orders?.edges || [];
      console.log(`[Orders API] Fetched ${orders.length} orders by customer ID for user ${userId}`);
    } else {
      // Fallback: Search for customer by email and fetch their orders
      console.log(`[Orders API] No Shopify customer ID found, searching by email: ${userEmail}`);
      
      const customerSearchResult = await shopifyAdminFetch(
        `query searchCustomer($query: String!) {
          customers(first: 1, query: $query) {
            edges {
              node {
                id
                email
                orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
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
          }
        }`,
        { query: `email:${userEmail}` }
      );

      if (customerSearchResult.errors) {
        throw new Error(customerSearchResult.errors[0].message);
      }

      const customerEdges = customerSearchResult.data?.customers?.edges || [];
      
      if (customerEdges.length > 0) {
        const foundCustomerId = customerEdges[0].node.id;
        orders = customerEdges[0].node.orders?.edges || [];
        
        console.log(`[Orders API] Found customer by email, fetched ${orders.length} orders`);
        
        // Update user metadata with the found Shopify customer ID for future requests
        try {
          await clerk.users.updateUserMetadata(userId, {
            publicMetadata: {
              shopifyCustomerId: foundCustomerId,
            },
          });
          console.log(`[Orders API] Linked Shopify customer ${foundCustomerId} to Clerk user ${userId}`);
        } catch (linkError) {
          console.error('[Orders API] Failed to link customer:', linkError);
        }
      } else {
        console.log(`[Orders API] No Shopify customer found for email: ${userEmail}`);
        return NextResponse.json({ 
          orders: [],
          message: 'No orders found. Your orders will appear here after your first purchase.' 
        });
      }
    }

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
