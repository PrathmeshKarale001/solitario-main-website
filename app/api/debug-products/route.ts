import { NextResponse } from 'next/server';
import { shopifyStorefrontFetch, shopifyAdminFetch } from '@/lib/shopify';

export async function GET() {
  try {
    // Test via Storefront API
    const storefrontResult = await shopifyStorefrontFetch(`
      query {
        products(first: 10) {
          edges {
            node {
              id
              title
              handle
              availableForSale
            }
          }
        }
      }
    `);

    // Test via Admin API
    const adminResult = await shopifyAdminFetch(`
      query {
        products(first: 10) {
          edges {
            node {
              id
              title
              handle
              status
              publishedAt
            }
          }
        }
      }
    `);

    return NextResponse.json({
      storefront: {
        products: storefrontResult.data?.products?.edges || [],
        errors: storefrontResult.errors,
      },
      admin: {
        products: adminResult.data?.products?.edges || [],
        errors: adminResult.errors,
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
