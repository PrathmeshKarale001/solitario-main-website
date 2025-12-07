import { NextResponse } from 'next/server';
import { shopifyStorefrontFetch, GET_PRODUCTS_QUERY } from '@/lib/shopify';

export async function GET() {
  try {
    const result = await shopifyStorefrontFetch(GET_PRODUCTS_QUERY, { first: 10 });
    
    // Extract just the relevant data for debugging
    const debugData = result.data?.products?.edges?.map((edge: any) => ({
      title: edge.node.title,
      handle: edge.node.handle,
      tags: edge.node.tags,
      collections: edge.node.collections?.edges?.map((c: any) => ({
        title: c.node.title,
        handle: c.node.handle,
      })) || [],
    })) || [];

    return NextResponse.json({ 
      success: true,
      products: debugData,
      raw: result.data?.products?.edges?.[0]?.node // First product raw data
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
