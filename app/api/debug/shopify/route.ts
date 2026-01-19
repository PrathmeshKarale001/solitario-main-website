import { NextRequest, NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { shopifyAdminFetch } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

// Get all customers query
const GET_CUSTOMERS_QUERY = `
  query getCustomers($first: Int!) {
    customers(first: $first) {
      edges {
        node {
          id
          email
          firstName
          lastName
          addresses(first: 10) {
            edges {
              node {
                id
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

    console.log('[Debug Shopify] Checking Shopify sync status');

    // Get user data from Clerk
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    
    const debugInfo = {
      clerkUser: {
        id: userId,
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      shopifyMetadata: {
        customerId: user.publicMetadata.shopifyCustomerId,
        addressIds: user.publicMetadata.shopifyAddressIds,
        hasAccessToken: !!user.privateMetadata.shopifyAccessToken,
      },
    };

    // Check if user has Shopify customer
    if (!debugInfo.shopifyMetadata.customerId) {
      return NextResponse.json({
        ...debugInfo,
        message: 'User not synced with Shopify yet',
        shopifyCustomers: [],
      });
    }

    // Fetch all Shopify customers to find this user
    const result = await shopifyAdminFetch(GET_CUSTOMERS_QUERY, {
      first: 50,
    });

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    const customers = result.data?.customers?.edges || [];
    const userCustomer = customers.find(
      (edge: any) => edge.node.email === debugInfo.clerkUser.email
    );

    return NextResponse.json({
      ...debugInfo,
      shopifyCustomer: userCustomer?.node || null,
      totalShopifyCustomers: customers.length,
      allCustomers: customers.map((edge: any) => ({
        id: edge.node.id,
        email: edge.node.email,
        name: `${edge.node.firstName} ${edge.node.lastName}`,
        addressCount: edge.node.addresses?.edges?.length || 0,
      })),
    });

  } catch (error) {
    console.error('[Debug Shopify] Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
