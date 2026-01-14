import { NextRequest, NextResponse } from 'next/server';
import { 
  getHeroSections, 
  getHeroSectionByHandle, 
  getObservatoryEvents, 
  getCurrentObservatoryEvent,
  getDynamicBanners,
  getAlternatingBanners
} from '@/lib/shopify-metaobjects';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const handle = searchParams.get('handle');

    console.log('🎨 Dynamic content API called:', { type, handle });

    switch (type) {
      case 'hero':
        if (handle) {
          const heroSection = await getHeroSectionByHandle(handle);
          return NextResponse.json({ 
            success: true,
            data: heroSection 
          });
        } else {
          const heroSections = await getHeroSections();
          return NextResponse.json({ 
            success: true,
            data: heroSections 
          });
        }

      case 'observatory':
        if (handle === 'current') {
          const currentEvent = await getCurrentObservatoryEvent();
          return NextResponse.json({ 
            success: true,
            data: currentEvent 
          });
        } else {
          const events = await getObservatoryEvents();
          return NextResponse.json({ 
            success: true,
            data: events 
          });
        }

      case 'banners':
        if (handle === 'alternating') {
          const banners = await getAlternatingBanners();
          return NextResponse.json({ 
            success: true,
            data: banners 
          });
        } else {
          const banners = await getDynamicBanners();
          return NextResponse.json({ 
            success: true,
            data: banners 
          });
        }

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
