import { NextRequest, NextResponse } from 'next/server';
import { shopifyStorefrontFetch, GET_PRODUCT_BY_ID_QUERY } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

// The Shopify Product ID for the 10 Cent Diamond Gift
const GIFT_PRODUCT_ID = 'gid://shopify/Product/10264124457235';

export async function GET() {
  // Check if Shopify is configured
  if (!process.env.SHOPIFY_STORE_DOMAIN || !process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    console.error('Shopify API not configured for gift product');
    return NextResponse.json({
      name: '10 Cent Diamond Gift',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&q=80',
      price: 5000,
      fallback: true
    });
  }

  try {
    // Fetch the gift product using its exact Shopify ID
    const result = await shopifyStorefrontFetch<{
      node: {
        title: string;
        images: { edges: Array<{ node: { url: string } }> };
      };
    }>(GET_PRODUCT_BY_ID_QUERY, { id: GIFT_PRODUCT_ID });

    if (result.errors || !result.data?.node) {
      console.error('Gift product not found with ID:', GIFT_PRODUCT_ID, result.errors);
      // Return fallback product data if Shopify fetch fails
      return NextResponse.json({
        name: '10 Cent Diamond Gift',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&q=80',
        price: 5000,
        fallback: true
      });
    }

    // Return the product data with image
    const product = result.data.node;
    return NextResponse.json({
      name: product.title,
      image: product.images.edges[0]?.node?.url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&q=80',
      price: 5000,
      fallback: false
    });
  } catch (error) {
    console.error('Error fetching gift product:', error);
    // Always return a fallback to ensure the gift displays
    return NextResponse.json({
      name: '10 Cent Diamond Gift',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&q=80',
      price: 5000,
      fallback: true
    });
  }
}
