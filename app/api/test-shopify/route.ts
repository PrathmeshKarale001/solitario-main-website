import { NextResponse } from 'next/server';
import { shopifyStorefrontFetch, shopifyAdminFetch, GET_PRODUCTS_QUERY } from '@/lib/shopify';

export async function GET() {
  try {
    // Test Storefront API
    const storefrontResult = await shopifyStorefrontFetch(GET_PRODUCTS_QUERY, { first: 1 });
    
    // Test Admin API (if token is provided)
    let adminResult = null;
    if (process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
      adminResult = await shopifyAdminFetch(`
        query {
          shop {
            name
            email
          }
        }
      `);
    }

    return NextResponse.json({
      success: true,
      storefront: {
        connected: !!storefrontResult.data,
        error: storefrontResult.errors || null,
        productCount: storefrontResult.data?.products?.edges?.length || 0,
      },
      admin: {
        connected: !!adminResult?.data,
        error: adminResult?.errors || null,
        shopName: adminResult?.data?.shop?.name || null,
      },
      environment: {
        domain: process.env.SHOPIFY_STORE_DOMAIN ? 'SET' : 'MISSING',
        storefrontToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ? 'SET' : 'MISSING',
        adminToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ? 'SET' : 'MISSING',
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        domain: process.env.SHOPIFY_STORE_DOMAIN ? 'SET' : 'MISSING',
        storefrontToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ? 'SET' : 'MISSING',
        adminToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ? 'SET' : 'MISSING',
      },
    }, { status: 500 });
  }
}
