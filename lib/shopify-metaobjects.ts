import { shopifyStorefrontFetch } from './shopify';

// GraphQL query to fetch metaobjects by type
const GET_METAOBJECTS_BY_TYPE_QUERY = `
  query getMetaobjectsByType($type: MetaobjectType!, $first: Int!) {
    metaobjects(type: $type, first: $first, reverse: true) {
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


// GraphQL query to fetch metaobjects by type
const GET_METAOBJECTS_QUERY = `
  query getMetaobjectsByType($type: MetaobjectType!, $first: Int!) {
    metaobjects(type: $type, first: $first, reverse: true) {
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

// GraphQL query to fetch home heroes
const GET_HOME_HEROES_QUERY = `
  query getHomeHeroes($first: Int!) {
    metaobjects(type: "home_hero", first: $first, reverse: true) {
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
              ... on Video {
                sources {
                  url
                  mimeType
                  format
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

// GraphQL query to fetch shop heroes
const GET_SHOP_HEROES_QUERY = `
  query getShopHeroes($first: Int!) {
    metaobjects(type: "shop_hero", first: $first, reverse: true) {
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
              ... on Video {
                sources {
                  url
                  mimeType
                  format
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

// Types for our dynamic content
export interface DynamicImage {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface HomeHeroSection {
  id: string;
  handle: string;
  title?: string;
  subtitle?: string;
  description?: string;
  backgroundImage: DynamicImage;
  backgroundVideo?: string;
  mobileBackgroundImage?: DynamicImage;
  mobileBackgroundVideo?: string;
  mediaType: 'image' | 'video';
  ctaText?: string;
  ctaLink?: string;
  isActive: boolean;
  displayOrder?: number;
  updatedAt: string;
}

export interface ShopHeroSection {
  id: string;
  handle: string;
  title?: string;
  subtitle?: string;
  description?: string;
  backgroundImage: DynamicImage;
  backgroundVideo?: string;
  mobileBackgroundImage?: DynamicImage;
  mobileBackgroundVideo?: string;
  mediaType: 'image' | 'video';
  ctaText?: string;
  ctaLink?: string;
  isActive: boolean;
  displayOrder?: number;
  updatedAt: string;
}

// These interfaces are currently not being used and can be removed
// If needed later, they can be restored from git history

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
        } else if (reference?.sources) {
          // Video reference
          const mp4Source = reference.sources.find((s: any) => s.format === 'mp4' || s.mimeType === 'video/mp4');
          parsed[key] = mp4Source ? mp4Source.url : reference.sources[0]?.url;
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

// Removed unused functions: getHeroSections, getObservatoryEvents, getDynamicBanners,
// getCurrentObservatoryEvent, getAlternatingBanners
// These can be restored from git history if needed later

// Get Home Hero sections
export async function getHomeHeroSections(): Promise<HomeHeroSection[]> {
  try {
    const result = await shopifyStorefrontFetch(GET_HOME_HEROES_QUERY, {
      first: 10
    });

    if (result.errors || !result.data?.metaobjects?.edges) {
      console.error('❌ Failed to fetch home hero sections:', result.errors);
      return [];
    }

    const homeHeroes = result.data.metaobjects.edges
      .map(edge => {
        const node = edge.node;
        const fields = parseMetaobjectFields(node.fields);
        
        return {
          id: node.id,
          handle: node.handle,
          title: fields['title'],
          subtitle: fields['subtitle'],
          description: fields['description'],
          backgroundImage: fields['background_image'] || { url: '', altText: '' },
          backgroundVideo: fields['background_video'],
          mobileBackgroundImage: fields['mobile_background_image'],
          mobileBackgroundVideo: fields['mobile_background_video'],
          mediaType: fields['media_type']?.toLowerCase() || 'image',
          ctaText: fields['cta_text'],
          ctaLink: fields['cta_link'],
          isActive: fields['is_active'] || false,
          displayOrder: fields['display_order'] || 0,
          updatedAt: node.updatedAt
        };
      })
      .filter(hero => hero.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    return homeHeroes;
    
  } catch (error) {
    console.error('❌ Error fetching home hero sections:', error);
    return [];
  }
}

// Get Shop Hero sections
export async function getShopHeroSections(): Promise<ShopHeroSection[]> {
  try {
    
    const result = await shopifyStorefrontFetch(GET_SHOP_HEROES_QUERY, {
      first: 10
    });

    if (result.errors || !result.data?.metaobjects?.edges) {
      console.error('❌ Failed to fetch shop hero sections:', result.errors);
      return [];
    }

    const shopHeroes = result.data.metaobjects.edges
      .map(edge => {
        const node = edge.node;
        const fields = parseMetaobjectFields(node.fields);
        
        return {
          id: node.id,
          handle: node.handle,
          title: fields['title'],
          subtitle: fields['subtitle'],
          description: fields['description'],
          backgroundImage: fields['background_image'] || { url: '', altText: '' },
          backgroundVideo: fields['background_video'],
          mobileBackgroundImage: fields['mobile_background_image'],
          mobileBackgroundVideo: fields['mobile_background_video'],
          mediaType: fields['media_type']?.toLowerCase() || 'image',
          ctaText: fields['cta_text'],
          ctaLink: fields['cta_link'],
          isActive: fields['is_active'] || false,
          displayOrder: fields['display_order'] || 0,
          updatedAt: node.updatedAt
        };
      })
      .filter(hero => hero.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    return shopHeroes;
    
  } catch (error) {
    console.error('❌ Error fetching shop hero sections:', error);
    return [];
  }
}
