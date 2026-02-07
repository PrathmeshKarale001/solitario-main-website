/**
 * Unified Analytics Tracking
 * 
 * This module provides a single interface to track events across multiple platforms:
 * - Google Analytics
 * - Meta Pixel (Facebook)
 * - Google Ads Conversions
 * 
 * Usage: Import and call these functions instead of calling each platform separately
 */

import {
  trackAddToCart as trackGAAddToCart,
  trackViewItem as trackGAViewItem,
  trackSearch as trackGASearch,
  trackWishlistAdd as trackGAWishlistAdd,
} from '@/components/analytics/GoogleAnalytics';

import {
  trackMetaAddToCart,
  trackMetaViewContent,
  trackMetaSearch,
  trackMetaAddToWishlist,
  trackMetaInitiateCheckout,
  trackMetaPurchase,
  trackMetaAddPaymentInfo,
  trackMetaLead,
  trackMetaCompleteRegistration,
} from '@/components/analytics/MetaPixel';

// Types
export interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
  variant?: string;
  quantity?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

// =============================================
// UNIFIED TRACKING FUNCTIONS
// =============================================

/**
 * Track product view across all platforms
 */
export const trackProductView = (product: Product) => {
  // Google Analytics
  trackGAViewItem(
    product.id,
    product.name,
    product.price,
    'INR'
  );

  // Meta Pixel
  trackMetaViewContent({
    content_name: product.name,
    content_category: product.category || 'product',
    content_ids: [product.id],
    content_type: 'product',
    value: product.price,
    currency: 'INR',
  });

  console.log('[Analytics] Product View:', product.name);
};

/**
 * Track add to cart across all platforms
 */
export const trackAddToCart = (product: Product) => {
  // Google Analytics
  trackGAAddToCart(
    product.id,
    product.name,
    product.price,
    'INR'
  );

  // Meta Pixel
  trackMetaAddToCart({
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.price,
    currency: 'INR',
  });

  console.log('[Analytics] Add to Cart:', product.name);
};

/**
 * Track search across all platforms
 */
export const trackSearch = (searchTerm: string, category?: string) => {
  // Google Analytics
  trackGASearch(searchTerm);

  // Meta Pixel
  trackMetaSearch({
    search_string: searchTerm,
    content_category: category,
  });

  console.log('[Analytics] Search:', searchTerm);
};

/**
 * Track add to wishlist across all platforms
 */
export const trackAddToWishlist = (product: Product) => {
  // Google Analytics
  trackGAWishlistAdd(product.id, product.name);

  // Meta Pixel
  trackMetaAddToWishlist({
    content_ids: [product.id],
    content_name: product.name,
    value: product.price,
    currency: 'INR',
  });

  console.log('[Analytics] Add to Wishlist:', product.name);
};

/**
 * Track checkout initiation across all platforms
 */
export const trackCheckoutInitiation = (items: CartItem[], total: number) => {
  // Meta Pixel
  trackMetaInitiateCheckout({
    content_ids: items.map(item => item.id),
    contents: items.map(item => ({
      id: item.id,
      quantity: item.quantity,
    })),
    value: total,
    currency: 'INR',
    num_items: items.reduce((sum, item) => sum + item.quantity, 0),
  });

  // Google Ads - using gtag if available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'begin_checkout', {
      currency: 'INR',
      value: total,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  }

  console.log('[Analytics] Checkout Initiated:', { items: items.length, total });
};

/**
 * Track payment info addition across all platforms
 */
export const trackPaymentInfo = (items: CartItem[], total: number) => {
  // Meta Pixel
  trackMetaAddPaymentInfo({
    content_ids: items.map(item => item.id),
    value: total,
    currency: 'INR',
  });

  // Google Ads
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'add_payment_info', {
      currency: 'INR',
      value: total,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  }

  console.log('[Analytics] Payment Info Added:', total);
};

/**
 * Track purchase across all platforms
 */
export const trackPurchase = (
  orderId: string,
  items: CartItem[],
  total: number,
  tax?: number,
  shipping?: number
) => {
  // Meta Pixel
  trackMetaPurchase({
    content_ids: items.map(item => item.id),
    contents: items.map(item => ({
      id: item.id,
      quantity: item.quantity,
      item_price: item.price,
    })),
    value: total,
    currency: 'INR',
    num_items: items.reduce((sum, item) => sum + item.quantity, 0),
  });

  // Google Ads Conversion
  if (typeof window !== 'undefined' && (window as any).gtag) {
    // Purchase event
    (window as any).gtag('event', 'purchase', {
      transaction_id: orderId,
      value: total,
      tax: tax || 0,
      shipping: shipping || 0,
      currency: 'INR',
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });

    // Google Ads Conversion Tracking
    (window as any).gtag('event', 'conversion', {
      send_to: 'AW-17875605995/YourConversionLabel', // Replace with actual conversion label
      value: total,
      currency: 'INR',
      transaction_id: orderId,
    });
  }

  console.log('[Analytics] Purchase:', { orderId, total, items: items.length });
};

/**
 * Track lead generation (form submission, etc.)
 */
export const trackLead = (leadType?: string, value?: number) => {
  // Meta Pixel
  trackMetaLead({
    content_name: leadType || 'contact_form',
    value,
    currency: 'INR',
  });

  // Google Ads
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'generate_lead', {
      currency: 'INR',
      value: value || 0,
    });
  }

  console.log('[Analytics] Lead Generated:', leadType);
};

/**
 * Track user registration
 */
export const trackRegistration = (method?: string) => {
  // Meta Pixel
  trackMetaCompleteRegistration({
    content_name: method || 'email',
    status: 'completed',
  });

  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'sign_up', {
      method: method || 'email',
    });
  }

  console.log('[Analytics] Registration:', method);
};

/**
 * Track custom event across all platforms
 */
export const trackCustomEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, parameters);
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('trackCustom', eventName, parameters);
  }

  console.log('[Analytics] Custom Event:', eventName, parameters);
};

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Check if analytics are enabled
 */
export const isAnalyticsEnabled = (): boolean => {
  const hasGA = !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const hasMeta = !!process.env.NEXT_PUBLIC_META_PIXEL_ID;
  return hasGA || hasMeta;
};

/**
 * Get analytics status
 */
export const getAnalyticsStatus = () => {
  return {
    googleAnalytics: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    metaPixel: !!process.env.NEXT_PUBLIC_META_PIXEL_ID,
    googleAds: true, // Always enabled via hardcoded ID
  };
};
