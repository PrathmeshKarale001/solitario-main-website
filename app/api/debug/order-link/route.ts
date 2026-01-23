import { NextRequest, NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { shopifyAdminFetch } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderName = searchParams.get('orderName'); // e.g., SOLMKQZWQ0R or #1030
    const orderNumber = searchParams.get('orderNumber'); // e.g., 1030

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    
    const userEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    const shopifyCustomerId = user.publicMetadata.shopifyCustomerId as string;

    // Search for the order by name or number
    const searchQuery = orderNumber ? `name:#${orderNumber}` : orderName?.startsWith('#') ? `name:${orderName}` : `name:#${orderName}`;
    
    const orderSearchResult = await shopifyAdminFetch(
      `query searchOrder($query: String!) {
        orders(first: 5, query: $query) {
          edges {
            node {
              id
              name
              email
              note
              customer {
                id
                email
                firstName
                lastName
              }
              createdAt
              financialStatus
              fulfillmentStatus
            }
          }
        }
      }`,
      { query: searchQuery }
    );

    const orderEdges = orderSearchResult.data?.orders?.edges || [];
    const order = orderEdges.length > 0 ? orderEdges[0].node : null;

    // Also search for customer by email to see if they exist
    let customerByEmail = null;
    if (userEmail) {
      const customerSearchResult = await shopifyAdminFetch(
        `query searchCustomer($query: String!) {
          customers(first: 1, query: $query) {
            edges {
              node {
                id
                email
                firstName
                lastName
                ordersCount
              }
            }
          }
        }`,
        { query: `email:${userEmail}` }
      );
      const customerEdges = customerSearchResult.data?.customers?.edges || [];
      customerByEmail = customerEdges.length > 0 ? customerEdges[0].node : null;
    }

    return NextResponse.json({
      debug: {
        clerkUserId: userId,
        clerkEmail: userEmail,
        shopifyCustomerIdInMetadata: shopifyCustomerId,
        orderFound: !!order,
        order: order ? {
          id: order.id,
          name: order.name,
          email: order.email,
          note: order.note,
          customerId: order.customer?.id,
          customerEmail: order.customer?.email,
          customerName: `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim(),
          createdAt: order.createdAt,
          financialStatus: order.financialStatus,
          fulfillmentStatus: order.fulfillmentStatus,
        } : null,
        searchQuery,
        customerByEmail: customerByEmail ? {
          id: customerByEmail.id,
          email: customerByEmail.email,
          name: `${customerByEmail.firstName || ''} ${customerByEmail.lastName || ''}`.trim(),
          ordersCount: customerByEmail.ordersCount,
        } : null,
        emailMatch: order?.customer?.email === userEmail,
        customerIdMatch: order?.customer?.id === shopifyCustomerId,
      },
      recommendation: !order 
        ? 'Order not found in Shopify. Check if order was created successfully.'
        : !order.customer
        ? 'Order exists but has no customer linked. This is the problem!'
        : order.customer?.email !== userEmail
        ? `Email mismatch: Order email is ${order.customer?.email}, but your Clerk email is ${userEmail}`
        : !shopifyCustomerId
        ? 'Shopify customer ID not linked to your Clerk account. Need to link it.'
        : order.customer?.id !== shopifyCustomerId
        ? `Customer ID mismatch: Order customer is ${order.customer?.id}, but your metadata has ${shopifyCustomerId}. Need to update metadata.`
        : 'Everything looks correct. Order should appear in your list.',
    });

  } catch (error) {
    console.error('[Debug Order Link] Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to debug order' 
    }, { status: 500 });
  }
}
