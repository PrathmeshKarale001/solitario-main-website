import { shopifyStorefrontFetch } from './shopify';

// GraphQL query to fetch metaobjects
const GET_METAOBJECTS_QUERY = `
  query getMetaobjects($type: String!, $first: Int!) {
    metaobjects(type: $type, first: $first) {
      edges {
        node {
          id
          handle
          type
          fields {
            key
            value
            type
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
          updatedAt
        }
      }
    }
  }
`;

// Get metaobject by handle
const GET_METAOBJECT_BY_HANDLE_QUERY = `
  query getMetaobjectByHandle($handle: MetaobjectHandleInput!) {
    metaobject(handle: $handle) {
      id
      handle
      type
      fields {
        key
        value
        type
        reference {
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
      updatedAt
    }
  }
`;

// Types for our dynamic content
export interface DynamicImage {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface HeroSection {
  id: string;
  handle: string;
  title: string;
  subtitle: string;
  description?: string;
  backgroundImage: DynamicImage;
  ctaText?: string;
  ctaLink?: string;
  isActive: boolean;
  updatedAt: string;
}

export interface ObservatoryEvent {
  id: string;
  handle: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  bannerImage?: DynamicImage;
  ctaText?: string;
  ctaLink?: string;
  isActive: boolean;
  priority: number;
  updatedAt: string;
}

export interface DynamicBanner {
  id: string;
  handle: string;
  title: string;
  description?: string;
  image: DynamicImage;
  ctaText?: string;
  ctaLink?: string;
  isActive: boolean;
  displayOrder: number;
  scheduleType: 'always' | 'date_range' | 'alternating';
  startDate?: string;
  endDate?: string;
  updatedAt: string;
}

// Helper function to parse metaobject fields
function parseMetaobjectFields(fields: any[]): Record<string, any> {
  const parsed: Record<string, any> = {};
  
  fields.forEach(field => {
    const { key, value, type, reference } = field;
    
    switch (type) {
      case 'file_reference':
        if (reference?.image) {
          parsed[key] = {
            url: reference.image.url,
            altText: reference.image.altText,
            width: reference.image.width,
            height: reference.image.height
          };
        }
        break;
      case 'boolean':
        parsed[key] = value === 'true';
        break;
      case 'number_integer':
        parsed[key] = parseInt(value) || 0;
        break;
      case 'date':
      case 'date_time':
        parsed[key] = value;
        break;
      default:
        parsed[key] = value;
    }
  });
  
  return parsed;
}

// Fetch hero sections
export async function getHeroSections(): Promise<HeroSection[]> {
  try {
    console.log('🎯 Fetching hero sections from Shopify...');
    
    const result = await shopifyStorefrontFetch(GET_METAOBJECTS_QUERY, {
      type: 'hero_section',
      first: 10
    });

    if (result.errors || !result.data?.metaobjects?.edges) {
      console.error('❌ Failed to fetch hero sections:', result.errors);
      return [];
    }

    const heroSections = result.data.metaobjects.edges.map((edge: any) => {
      const { node } = edge;
      const fields = parseMetaobjectFields(node.fields);
      
      return {
        id: node.id,
        handle: node.handle,
        title: fields.title || '',
        subtitle: fields.subtitle || '',
        description: fields.description || '',
        backgroundImage: fields.background_image || { url: '', altText: '' },
        ctaText: fields.cta_text || '',
        ctaLink: fields.cta_link || '',
        isActive: fields.is_active || false,
        updatedAt: node.updatedAt
      };
    });

    console.log(`✅ Found ${heroSections.length} hero sections`);
    return heroSections.filter(hero => hero.isActive);
    
  } catch (error) {
    console.error('❌ Error fetching hero sections:', error);
    return [];
  }
}

// Fetch observatory events
export async function getObservatoryEvents(): Promise<ObservatoryEvent[]> {
  try {
    console.log('🔭 Fetching observatory events from Shopify...');
    
    const result = await shopifyStorefrontFetch(GET_METAOBJECTS_QUERY, {
      type: 'observatory_event',
      first: 20
    });

    if (result.errors || !result.data?.metaobjects?.edges) {
      console.error('❌ Failed to fetch observatory events:', result.errors);
      return [];
    }

    const events = result.data.metaobjects.edges.map((edge: any) => {
      const { node } = edge;
      const fields = parseMetaobjectFields(node.fields);
      
      return {
        id: node.id,
        handle: node.handle,
        title: fields.title || '',
        description: fields.description || '',
        startDate: fields.start_date || '',
        endDate: fields.end_date || '',
        bannerImage: fields.banner_image || undefined,
        ctaText: fields.cta_text || '',
        ctaLink: fields.cta_link || '',
        isActive: fields.is_active || false,
        priority: fields.priority || 0,
        updatedAt: node.updatedAt
      };
    });

    // Filter active events and sort by priority
    const activeEvents = events
      .filter(event => event.isActive)
      .sort((a, b) => b.priority - a.priority);

    console.log(`✅ Found ${activeEvents.length} active observatory events`);
    return activeEvents;
    
  } catch (error) {
    console.error('❌ Error fetching observatory events:', error);
    return [];
  }
}

// Fetch dynamic banners
export async function getDynamicBanners(): Promise<DynamicBanner[]> {
  try {
    console.log('🎨 Fetching dynamic banners from Shopify...');
    
    const result = await shopifyStorefrontFetch(GET_METAOBJECTS_QUERY, {
      type: 'dynamic_banner',
      first: 20
    });

    if (result.errors || !result.data?.metaobjects?.edges) {
      console.error('❌ Failed to fetch dynamic banners:', result.errors);
      return [];
    }

    const banners = result.data.metaobjects.edges.map((edge: any) => {
      const { node } = edge;
      const fields = parseMetaobjectFields(node.fields);
      
      return {
        id: node.id,
        handle: node.handle,
        title: fields.title || '',
        description: fields.description || '',
        image: fields.image || { url: '', altText: '' },
        ctaText: fields.cta_text || '',
        ctaLink: fields.cta_link || '',
        isActive: fields.is_active || false,
        displayOrder: fields.display_order || 0,
        scheduleType: fields.schedule_type || 'always',
        startDate: fields.start_date || '',
        endDate: fields.end_date || '',
        updatedAt: node.updatedAt
      };
    });

    // Filter active banners and sort by display order
    const activeBanners = banners
      .filter(banner => banner.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    console.log(`✅ Found ${activeBanners.length} active dynamic banners`);
    return activeBanners;
    
  } catch (error) {
    console.error('❌ Error fetching dynamic banners:', error);
    return [];
  }
}

// Get specific hero section by handle
export async function getHeroSectionByHandle(handle: string): Promise<HeroSection | null> {
  try {
    console.log(`🎯 Fetching hero section: ${handle}`);
    
    const result = await shopifyStorefrontFetch(GET_METAOBJECT_BY_HANDLE_QUERY, {
      handle: {
        type: 'hero_section',
        handle: handle
      }
    });

    if (result.errors || !result.data?.metaobject) {
      console.error(`❌ Failed to fetch hero section ${handle}:`, result.errors);
      return null;
    }

    const node = result.data.metaobject;
    const fields = parseMetaobjectFields(node.fields);
    
    const heroSection: HeroSection = {
      id: node.id,
      handle: node.handle,
      title: fields.title || '',
      subtitle: fields.subtitle || '',
      description: fields.description || '',
      backgroundImage: fields.background_image || { url: '', altText: '' },
      ctaText: fields.cta_text || '',
      ctaLink: fields.cta_link || '',
      isActive: fields.is_active || false,
      updatedAt: node.updatedAt
    };

    console.log(`✅ Found hero section: ${heroSection.title}`);
    return heroSection.isActive ? heroSection : null;
    
  } catch (error) {
    console.error(`❌ Error fetching hero section ${handle}:`, error);
    return null;
  }
}

// Get current observatory event (active and within date range)
export async function getCurrentObservatoryEvent(): Promise<ObservatoryEvent | null> {
  try {
    const events = await getObservatoryEvents();
    const now = new Date();
    
    // Find the highest priority event that's currently active
    const currentEvent = events.find(event => {
      if (!event.startDate || !event.endDate) return false;
      
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      
      return now >= startDate && now <= endDate;
    });
    
    if (currentEvent) {
      console.log(`🔭 Current observatory event: ${currentEvent.title}`);
    } else {
      console.log('🔭 No current observatory event');
    }
    
    return currentEvent || null;
    
  } catch (error) {
    console.error('❌ Error getting current observatory event:', error);
    return null;
  }
}

// Get banners for alternating display
export async function getAlternatingBanners(): Promise<DynamicBanner[]> {
  try {
    const banners = await getDynamicBanners();
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // Filter banners based on schedule type
    const availableBanners = banners.filter(banner => {
      switch (banner.scheduleType) {
        case 'always':
          return true;
        case 'date_range':
          if (!banner.startDate || !banner.endDate) return false;
          const startDate = new Date(banner.startDate);
          const endDate = new Date(banner.endDate);
          return now >= startDate && now <= endDate;
        case 'alternating':
          // Show different banners on alternating days
          return (dayOfYear + banner.displayOrder) % 2 === 0;
        default:
          return true;
      }
    });
    
    console.log(`🎨 Found ${availableBanners.length} banners for today`);
    return availableBanners;
    
  } catch (error) {
    console.error('❌ Error getting alternating banners:', error);
    return [];
  }
}
