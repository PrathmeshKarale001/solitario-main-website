import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getCollectionProducts } from '@/lib/shopify-data';

// Mark as dynamic route to prevent static optimization attempts (which cause slowness)
export const dynamic = 'force-dynamic';

// Cache products for 5 minutes to improve performance
export const revalidate = 300; // 5 minutes

// In-memory cache for development (bypasses Next.js cache limitations in dev mode)
let cachedProducts: { products: any[]; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(req: NextRequest) {
  try {
    // Use req.nextUrl.searchParams instead of req.url to avoid dynamic server usage
    const category = req.nextUrl.searchParams.get('category');
    const collection = req.nextUrl.searchParams.get('collection');
    const exclude = req.nextUrl.searchParams.get('exclude');
    const limitParam = req.nextUrl.searchParams.get('limit');
    const limit = limitParam ? Number(limitParam) : undefined;

    // Check in-memory cache first (useful in development)
    const now = Date.now();
    if (cachedProducts && (now - cachedProducts.timestamp) < CACHE_DURATION) {
      console.log('📦 Using cached products (in-memory cache)');
      var products = [...cachedProducts.products]; // Clone to avoid mutations
    } else {
      console.log('🔄 Fetching fresh products from Shopify...');
      
      // Add timeout to prevent 5+ minute hangs
      try {
        const fetchWithTimeout = async <T>(
          promise: Promise<T>,
          timeoutMs: number = 30000 // 30 second timeout
        ): Promise<T> => {
          return Promise.race([
            promise,
            new Promise<T>((_, reject) =>
              setTimeout(() => reject(new Error('Products fetch timeout after 30s')), timeoutMs)
            )
          ]);
        };

        products = await fetchWithTimeout(getProducts(), 30000);
        
        // Update cache
        cachedProducts = {
          products: products,
          timestamp: now,
        };
      } catch (error) {
        console.error('❌ Products fetch failed or timed out:', error);
        
        // Return cached products if available (even if expired)
        if (cachedProducts?.products) {
          console.log('⚠️ Using stale cached products due to fetch failure');
          products = [...cachedProducts.products];
        } else {
          // No cache available, return empty array
          console.error('❌ No cached products available, returning empty array');
          return NextResponse.json(
            { products: [], error: 'Failed to fetch products. Please try again.' },
            { status: 500 }
          );
        }
      }
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
