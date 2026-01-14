import { NextRequest, NextResponse } from 'next/server';
import { 
  getHomeHeroSections, 
  getShopHeroSections, 
  getHeroSections, 
  getObservatoryEvents, 
  getCurrentObservatoryEvent,
  getDynamicBanners,
  getAlternatingBanners
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

      case 'hero':
        // Legacy support for old hero system
        const legacyHeroSections = await getHeroSections();
        return NextResponse.json({ 
          success: true,
          data: legacyHeroSections 
        });

      case 'observatory':
        const currentEvent = await getCurrentObservatoryEvent();
        return NextResponse.json({ 
          success: true,
          data: currentEvent 
        });

      case 'banners':
        const banners = await getAlternatingBanners();
        return NextResponse.json({ 
          success: true,
          data: banners 
        });

      case 'all':
        // Get all dynamic content for dashboard
        const [heroSections, observatoryEvents, dynamicBanners] = await Promise.all([
          getHeroSections(),
          getObservatoryEvents(),
          getDynamicBanners()
        ]);

        return NextResponse.json({
          success: true,
          data: {
            heroSections,
            observatoryEvents,
            dynamicBanners,
            currentObservatory: await getCurrentObservatoryEvent(),
            todaysBanners: await getAlternatingBanners()
          }
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter. Use: hero, observatory, banners, or all'
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
