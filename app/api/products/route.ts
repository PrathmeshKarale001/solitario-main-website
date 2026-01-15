import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getCollectionProducts } from '@/lib/shopify-data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const collection = searchParams.get('collection');
    const exclude = searchParams.get('exclude');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Number(limitParam) : undefined;

    let products = await getProducts();

    // ALWAYS filter out gift products (SKU: GIFT) - they should never appear in listings
    products = products.filter((p) => p.sku !== 'GIFT');

    // If collection is specified, filter products by collection handle
    if (collection) {
      products = products.filter((product) => 
        product.collections?.some((col) => col.handle === collection)
      );
    }

    if (category) {
      products = products.filter((p) => p.category === category);
    }

    if (exclude) {
      products = products.filter((p) => p.id !== exclude);
    }

    if (typeof limit === 'number' && Number.isFinite(limit) && limit > 0) {
      products = products.slice(0, limit);
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        products: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
