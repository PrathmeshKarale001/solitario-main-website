import { PromotionConfig, DEFAULT_PROMO_CONFIG } from '../db/schema';
import { shopifyAdminFetch } from '../shopify';

const METAOBJECT_QUERY = `
  query getPromotionConfig {
    metaobjects(type: "promotion_config", first: 1) {
      edges {
        node {
          id
          fields {
            key
            value
          }
        }
      }
    }
  }
`;

export async function getPromotionConfig(): Promise<PromotionConfig> {
  const envConfig = getEnvConfig();
  if (envConfig) {
    return envConfig;
  }

  try {
    const result = await shopifyAdminFetch<{
      metaobjects: {
        edges: Array<{
          node: {
            id: string;
            fields: Array<{ key: string; value: string }>;
          };
        }>;
      };
    }>(METAOBJECT_QUERY);

    if (result.data?.metaobjects?.edges?.[0]) {
      const fields = result.data.metaobjects.edges[0].node.fields;
      return parseMetaobjectFields(fields);
    }
  } catch (error) {
    console.warn('[Promo Config] Failed to fetch from Shopify, using defaults:', error);
  }

  return DEFAULT_PROMO_CONFIG;
}

function getEnvConfig(): PromotionConfig | null {
  const enabled = process.env.PROMO_ENABLED;
  if (enabled === undefined) return null;

  return {
    enabled: enabled === 'true',
    first_purchase_percent: parseInt(process.env.PROMO_FIRST_PURCHASE_PERCENT || '20'),
    loyalty_coupon_percent: parseInt(process.env.PROMO_LOYALTY_PERCENT || '10'),
    loyalty_coupon_validity_days: parseInt(process.env.PROMO_LOYALTY_VALIDITY_DAYS || '30'),
    buy2_percent: parseInt(process.env.PROMO_BUY2_PERCENT || '10'),
    buy3_percent: parseInt(process.env.PROMO_BUY3_PERCENT || '30'),
    gift_variant_id: process.env.PROMO_GIFT_VARIANT_ID || '',
    gift_product_name: process.env.PROMO_GIFT_PRODUCT_NAME || '10-cent Diamond Gift',
    stacking_first_purchase: process.env.PROMO_STACKING_FIRST_PURCHASE === 'true',
  };
}

function parseMetaobjectFields(fields: Array<{ key: string; value: string }>): PromotionConfig {
  const fieldMap = fields.reduce((acc, field) => {
    acc[field.key] = field.value;
    return acc;
  }, {} as Record<string, string>);

  return {
    enabled: fieldMap.enabled === 'true',
    first_purchase_percent: parseInt(fieldMap.first_purchase_percent || '20'),
    loyalty_coupon_percent: parseInt(fieldMap.loyalty_coupon_percent || '10'),
    loyalty_coupon_validity_days: parseInt(fieldMap.loyalty_coupon_validity_days || '30'),
    buy2_percent: parseInt(fieldMap.buy2_percent || '10'),
    buy3_percent: parseInt(fieldMap.buy3_percent || '30'),
    gift_variant_id: fieldMap.gift_variant_id || '',
    gift_product_name: fieldMap.gift_product_name || '10-cent Diamond Gift',
    stacking_first_purchase: fieldMap.stacking_first_purchase === 'true',
  };
}
