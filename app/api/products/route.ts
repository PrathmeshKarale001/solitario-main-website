import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getCollectionProducts } from '@/lib/shopify-data';

// Cache products for 5 minutes to improve performance
export const revalidate = 300; // 5 minutes

// In-memory cache for development (bypasses Next.js cache limitations in dev mode)
let cachedProducts: { products: any[]; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const collection = searchParams.get('collection');
    const exclude = searchParams.get('exclude');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Number(limitParam) : undefined;

    // Check in-memory cache first (useful in development)
    const now = Date.now();
    if (cachedProducts && (now - cachedProducts.timestamp) < CACHE_DURATION) {
      console.log('📦 Using cached products (in-memory cache)');
      var products = [...cachedProducts.products]; // Clone to avoid mutations
    } else {
      console.log('🔄 Fetching fresh products from Shopify...');
      products = await getProducts();
      // Update cache
      cachedProducts = {
        products: products,
        timestamp: now,
      };
    }

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

    // Add cache headers for client-side caching
    return NextResponse.json(
      { products },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
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
