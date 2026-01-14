import { NextRequest, NextResponse } from 'next/server';
import { 
  getHomeHeroSections, 
  getShopHeroSections
} from '@/lib/shopify-metaobjects';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'home-hero':
        // Get all home heroes
        const homeHeroSections = await getHomeHeroSections();
        return NextResponse.json({ 
          success: true,
          data: homeHeroSections 
        });

      case 'shop-hero':
        // Get all shop heroes
        const shopHeroSections = await getShopHeroSections();
        return NextResponse.json({ 
          success: true,
          data: shopHeroSections 
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter. Use: home-hero or shop-hero'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Dynamic content API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch dynamic content'
    }, { status: 500 });
  }
}
