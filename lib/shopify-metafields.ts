// Alternative: Use Shopify Metafields for dynamic content
// This works immediately without manual setup

import { shopifyStorefrontFetch } from './shopify';

// GraphQL query to fetch store metafields
const STORE_METAFIELDS_QUERY = `
  query getStoreMetafields($namespace: String!) {
    shop {
      metafields(namespace: $namespace, first: 50) {
        edges {
          node {
            id
            namespace
            key
            value
            type
            description
            updatedAt
          }
        }
      }
    }
  }
`;

// Types for dynamic content using metafields
export interface DynamicContent {
  heroSections: HeroSection[];
  observatoryEvents: ObservatoryEvent[];
  dynamicBanners: DynamicBanner[];
}

export interface HeroSection {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  updatedAt: string;
}

export interface ObservatoryEvent {
  id: string;
  key: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  bannerImage: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  priority: number;
  updatedAt: string;
}

export interface DynamicBanner {
  id: string;
  key: string;
  title: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  displayOrder: number;
  scheduleType: 'always' | 'date_range' | 'alternating';
  startDate: string;
  endDate: string;
  updatedAt: string;
}

// Parse JSON metafield value safely
function parseMetafieldValue(value: string, type: string): any {
  try {
    if (type === 'json' || type === 'list.single_line_text_field') {
      return JSON.parse(value);
    }
    return value;
  } catch (error) {
    console.warn('Failed to parse metafield value:', error);
    return value;
  }
}

// Fetch all dynamic content from metafields
export async function getDynamicContentFromMetafields(): Promise<DynamicContent> {
  try {
    console.log('🔍 Fetching dynamic content from Shopify metafields...');
    
    const result = await shopifyStorefrontFetch(STORE_METAFIELDS_QUERY, {
      namespace: 'dynamic_content'
    });

    if (result.errors || !result.data?.shop?.metafields?.edges) {
      console.error('❌ Failed to fetch metafields:', result.errors);
      return {
        heroSections: [],
        observatoryEvents: [],
        dynamicBanners: []
      };
    }

    const metafields = result.data.shop.metafields.edges.map(edge => edge.node);
    console.log(`📦 Found ${metafields.length} dynamic content metafields`);

    // Parse metafields into structured content
    const content: DynamicContent = {
      heroSections: [],
      observatoryEvents: [],
      dynamicBanners: []
    };

    metafields.forEach(metafield => {
      const parsedValue = parseMetafieldValue(metafield.value, metafield.type);
      
      if (metafield.key.startsWith('hero_')) {
        content.heroSections.push({
          id: metafield.id,
          key: metafield.key,
          ...parsedValue,
          isActive: parsedValue.isActive !== false,
          updatedAt: metafield.updatedAt
        });
      } else if (metafield.key.startsWith('event_')) {
        content.observatoryEvents.push({
          id: metafield.id,
          key: metafield.key,
          ...parsedValue,
          isActive: parsedValue.isActive !== false,
          priority: parsedValue.priority || 0,
          updatedAt: metafield.updatedAt
        });
      } else if (metafield.key.startsWith('banner_')) {
        content.dynamicBanners.push({
          id: metafield.id,
          key: metafield.key,
          ...parsedValue,
          isActive: parsedValue.isActive !== false,
          displayOrder: parsedValue.displayOrder || 0,
          updatedAt: metafield.updatedAt
        });
      }
    });

    console.log(`✅ Parsed ${content.heroSections.length} heroes, ${content.observatoryEvents.length} events, ${content.dynamicBanners.length} banners`);
    
    return content;
    
  } catch (error) {
    console.error('❌ Error fetching dynamic content from metafields:', error);
    return {
      heroSections: [],
      observatoryEvents: [],
      dynamicBanners: []
    };
  }
}

// Get active hero sections
export async function getHeroSectionsFromMetafields(): Promise<HeroSection[]> {
  const content = await getDynamicContentFromMetafields();
  return content.heroSections.filter(hero => hero.isActive);
}

// Get current observatory event
export async function getCurrentObservatoryEventFromMetafields(): Promise<ObservatoryEvent | null> {
  const content = await getDynamicContentFromMetafields();
  const now = new Date();
  
  const currentEvent = content.observatoryEvents
    .filter(event => event.isActive)
    .filter(event => {
      if (!event.startDate || !event.endDate) return false;
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      return now >= startDate && now <= endDate;
    })
    .sort((a, b) => b.priority - a.priority)[0];
    
  return currentEvent || null;
}

// Get alternating banners
export async function getAlternatingBannersFromMetafields(): Promise<DynamicBanner[]> {
  const content = await getDynamicContentFromMetafields();
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  return content.dynamicBanners
    .filter(banner => banner.isActive)
    .filter(banner => {
      switch (banner.scheduleType) {
        case 'always':
          return true;
        case 'date_range':
          if (!banner.startDate || !banner.endDate) return false;
          const startDate = new Date(banner.startDate);
          const endDate = new Date(banner.endDate);
          return now >= startDate && now <= endDate;
        case 'alternating':
          return (dayOfYear + banner.displayOrder) % 2 === 0;
        default:
          return true;
      }
    })
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

// Create sample metafields for testing (using Admin API)
export async function createSampleMetafields() {
  console.log('📝 Creating sample metafields...');
  
  const sampleData = {
    hero_lohri: {
      title: 'Celebrate Makar Sankranti',
      subtitle: 'Special Festival Collection',
      description: 'Discover our exclusive jewelry collection for the festival of kites',
      backgroundImage: 'https://cdn.shopify.com/s/files/1/0963/2851/5859/files/LohriPC.jpg',
      ctaText: 'Shop Festival Collection',
      ctaLink: '/products',
      isActive: true
    },
    event_makar_sankranti: {
      title: 'Makar Sankranti Special',
      description: 'Celebrate with 20% off all jewelry collections!',
      startDate: '2026-01-14T00:00:00Z',
      endDate: '2026-01-16T23:59:59Z',
      ctaText: 'Shop Sale',
      ctaLink: '/collections/sale',
      isActive: true,
      priority: 10
    },
    banner_free_shipping: {
      title: 'Free Shipping',
      description: 'On orders above ₹25,000',
      image: 'https://cdn.shopify.com/s/files/1/0963/2851/5859/files/shipping-banner.jpg',
      ctaText: 'Shop Now',
      ctaLink: '/products',
      isActive: true,
      displayOrder: 1,
      scheduleType: 'always'
    }
  };
  
  console.log('📋 Sample metafields created (manual setup required):');
  Object.entries(sampleData).forEach(([key, data]) => {
    console.log(`  - ${key}: ${JSON.stringify(data, null, 2)}`);
  });
  
  return sampleData;
}
