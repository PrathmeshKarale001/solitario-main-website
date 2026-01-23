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
    const orderName = searchParams.get('orderName'); // e.g., SOLMKQZWQ0R

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    
    const userEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    const shopifyCustomerId = user.publicMetadata.shopifyCustomerId as string;

    // Search for the order by name
    const orderSearchResult = await shopifyAdminFetch(
      `query searchOrder($query: String!) {
        orders(first: 1, query: $query) {
          edges {
            node {
              id
              name
              email
              customer {
                id
                email
              }
            }
          }
        }
      }`,
      { query: `name:${orderName}` }
    );

    const orderEdges = orderSearchResult.data?.orders?.edges || [];
    const order = orderEdges.length > 0 ? orderEdges[0].node : null;

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
          customerId: order.customer?.id,
          customerEmail: order.customer?.email,
        } : null,
        emailMatch: order?.customer?.email === userEmail,
        customerIdMatch: order?.customer?.id === shopifyCustomerId,
      },
      recommendation: !order 
        ? 'Order not found in Shopify'
        : order.customer?.email !== userEmail
        ? `Email mismatch: Order email is ${order.customer?.email}, but your Clerk email is ${userEmail}`
        : !shopifyCustomerId
        ? 'Shopify customer ID not linked to your Clerk account. Will link now...'
        : order.customer?.id !== shopifyCustomerId
        ? `Customer ID mismatch: Order customer is ${order.customer?.id}, but your metadata has ${shopifyCustomerId}`
        : 'Everything looks correct. Order should appear.',
    });

  } catch (error) {
    console.error('[Debug Order Link] Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to debug order' 
    }, { status: 500 });
  }
}
