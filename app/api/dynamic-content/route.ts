import { NextRequest, NextResponse } from 'next/server';
import { 
  getHomeHeroSections, 
  getShopHeroSections
} from '@/lib/shopify-metaobjects';

export const dynamic = 'force-dynamic';

// In-memory cache for dynamic content (prevents slow Shopify API calls on every request)
let cachedContent: {
  'home-hero'?: { data: any[]; timestamp: number };
  'shop-hero'?: { data: any[]; timestamp: number };
} = {};

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type');

    if (!type) {
      return NextResponse.json({
        success: false,
        error: 'Type parameter is required. Use: home-hero or shop-hero'
      }, { status: 400 });
    }

    // Check cache first
    const now = Date.now();
    const cached = cachedContent[type as keyof typeof cachedContent];
    
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      console.log(`📦 Using cached ${type} content`);
      return NextResponse.json({ 
        success: true,
        data: cached.data 
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
        },
      });
    }

    // Fetch fresh content with timeout to prevent hanging
    console.log(`🔄 Fetching fresh ${type} content from Shopify...`);
    let content: any[] = [];

    try {
      // Add timeout wrapper to prevent 5+ minute hangs
      const fetchWithTimeout = async <T>(
        promise: Promise<T>,
        timeoutMs: number = 10000 // 10 second timeout
      ): Promise<T> => {
        return Promise.race([
          promise,
          new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeoutMs)
          )
        ]);
      };

      switch (type) {
        case 'home-hero':
          content = await fetchWithTimeout(getHomeHeroSections(), 10000);
          break;

        case 'shop-hero':
          // Shop hero is very slow, use shorter timeout
          // If it fails, return empty array (fallback images will be used in component)
          try {
            content = await fetchWithTimeout(getShopHeroSections(), 15000);
          } catch (shopHeroError) {
            console.warn('⚠️ Shop hero fetch timed out or failed, returning empty (fallback images will be used)');
            content = [];
          }
          break;

        default:
          return NextResponse.json({
            success: false,
            error: 'Invalid type parameter. Use: home-hero or shop-hero'
          }, { status: 400 });
      }
    } catch (fetchError) {
      // If fetch times out or fails, return empty array (fallback images will be used)
      console.warn(`⚠️ ${type} fetch failed or timed out, using empty array (fallback will be used):`, fetchError);
      content = [];
    }

    // Update cache
    cachedContent[type as keyof typeof cachedContent] = {
      data: content,
      timestamp: now
    };

    return NextResponse.json({ 
      success: true,
      data: content 
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });

  } catch (error) {
    console.error('❌ Dynamic content API error:', error);
    
    // Return cached data if available, even if expired
    const type = request.nextUrl.searchParams.get('type');
    if (type) {
      const cached = cachedContent[type as keyof typeof cachedContent];
      if (cached?.data) {
        console.log(`⚠️ Using stale cache for ${type} due to error`);
        return NextResponse.json({ 
          success: true,
          data: cached.data 
        });
      }
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch dynamic content'
    }, { status: 500 });
  }
}
