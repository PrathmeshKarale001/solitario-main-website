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
            processedAt
            displayFulfillmentStatus
            displayFinancialStatus
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id
                    title
                    price
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
    
    console.log(`[Orders API] User ${userId} has shopifyCustomerId:`, shopifyCustomerId);
    
    let orders = [];
    let customerIdWorked = false;
    
    if (shopifyCustomerId) {
      // Fetch orders using customer ID (preferred method)
      console.log(`[Orders API] Fetching orders for customer ID: ${shopifyCustomerId}`);
      
      const result = await shopifyAdminFetch(CUSTOMER_ORDERS_QUERY, {
        customerId: shopifyCustomerId,
        first: 20,
      });

      console.log(`[Orders API] Shopify response:`, JSON.stringify(result, null, 2));

      if (result.errors) {
        console.error(`[Orders API] Shopify GraphQL errors:`, result.errors);
        // Don't throw, fall back to email search instead
      } else if (!result.data?.customer) {
        console.error(`[Orders API] No customer found for ID: ${shopifyCustomerId}`);
        // Customer ID might be invalid, fall back to email search
        console.log(`[Orders API] Falling back to email search for: ${userEmail}`);
      } else {
        orders = result.data?.customer?.orders?.edges || [];
        customerIdWorked = true;
        console.log(`[Orders API] Fetched ${orders.length} orders by customer ID for user ${userId}`);
      }
    }
    
    // If no orders found with customer ID or no customer ID exists, search by email
    if (!customerIdWorked) {
      // Fallback: Search for customer by email and fetch their orders
      console.log(`[Orders API] Searching by email: ${userEmail}`);
      
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
                      processedAt
                      displayFulfillmentStatus
                      displayFinancialStatus
                      totalPriceSet {
                        shopMoney {
                          amount
                          currencyCode
                        }
                      }
                      lineItems(first: 10) {
                        edges {
                          node {
                            title
                            quantity
                            variant {
                              id
                              title
                              price
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
        console.error('[Orders API] Email search errors:', customerSearchResult.errors);
        return NextResponse.json({ 
          orders: [],
          message: 'Failed to fetch orders. Please try again later.' 
        });
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

    // Map Shopify fulfillment status to frontend status
    const mapStatus = (fulfillmentStatus: string): 'processing' | 'shipped' | 'delivered' | 'cancelled' => {
      const status = fulfillmentStatus?.toUpperCase() || 'UNFULFILLED';
      if (status === 'FULFILLED') return 'delivered';
      if (status === 'PARTIALLY_FULFILLED' || status === 'IN_TRANSIT') return 'shipped';
      if (status === 'RESTOCKED' || status === 'CANCELLED') return 'cancelled';
      return 'processing';
    };

    return NextResponse.json({
      orders: orders.map((edge: any) => ({
        id: edge.node.id,
        name: edge.node.name,
        orderNumber: edge.node.name.replace('#', ''),
        date: edge.node.processedAt,
        status: mapStatus(edge.node.displayFulfillmentStatus),
        total: parseFloat(edge.node.totalPriceSet?.shopMoney?.amount || '0'),
        items: edge.node.lineItems.edges.map((item: any) => ({
          id: item.node.variant?.id || item.node.title,
          name: item.node.title,
          quantity: item.node.quantity,
          price: parseFloat(item.node.variant?.price || '0'),
          image: item.node.variant?.image?.url || '',
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
