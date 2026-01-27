import { NextRequest, NextResponse } from 'next/server';
import { fetchShopifyProductByHandle } from '@/lib/shopify-data';

export const dynamic = 'force-dynamic';

/**
 * Fetch multiple products by their handles (IDs)
 * Used to refresh prices for cart and wishlist items
 */
export async function POST(req: NextRequest) {
  try {
    const { handles } = await req.json();

    if (!handles || !Array.isArray(handles) || handles.length === 0) {
      return NextResponse.json(
        { products: [], error: 'No handles provided' },
        { status: 400 }
      );
    }

    // Limit to prevent abuse
    if (handles.length > 50) {
      return NextResponse.json(
        { products: [], error: 'Too many handles. Maximum 50 allowed.' },
        { status: 400 }
      );
    }

    // Fetch all products in parallel
    const productPromises = handles.map((handle: string) =>
      fetchShopifyProductByHandle(handle)
    );

    const results = await Promise.all(productPromises);

    // Filter out nulls (products that weren't found)
    const products = results.filter((p) => p !== null);

    return NextResponse.json({
      products,
      found: products.length,
      requested: handles.length,
    });
  } catch (error) {
    console.error('Error fetching products by handles:', error);
    return NextResponse.json(
      {
        products: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
