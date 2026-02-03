/**
 * Google Tag Manager Conversion Tracking Utilities
 * 
 * These functions handle all GTM conversion events for the Solitario website.
 * All conversion IDs are for Google Ads account: AW-17875605995
 */

declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string | Date | object,
      config?: object
    ) => void;
    dataLayer: any[];
  }
}

/**
 * Helper function to safely call gtag with fallback to dataLayer
 * This ensures events are tracked even if gtag function isn't fully initialized
 */
function safeGtag(eventName: string, eventParams: object) {
  if (typeof window === 'undefined') return;

  // Primary method: use gtag function
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', eventParams);
    console.log('[GTM] Conversion tracked via gtag:', eventName, eventParams);
    return;
  }

  // Fallback: push directly to dataLayer
  if (typeof window.dataLayer !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'conversion',
      ...eventParams
    });
    console.log('[GTM] Conversion tracked via dataLayer:', eventName, eventParams);
    return;
  }

  console.warn('[GTM] Neither gtag nor dataLayer available for:', eventName);
}

/**
 * 1. Page View - Track when users view product pages
 * Conversion ID: AW-17875605995/LRTeCO6g9eobEOuz4MtC
 */
export function trackPageView() {
  safeGtag('page_view', {
    'send_to': 'AW-17875605995/LRTeCO6g9eobEOuz4MtC'
  });
}

/**
 * 2. Add to Cart - Track when users click "Add to Cart" or "Buy Now" buttons
 * Conversion ID: AW-17875605995/a_7uCLDI9eobEOuz4MtC
 */
export function trackAddToCart(url?: string) {
  const eventParams: any = {
    'send_to': 'AW-17875605995/a_7uCLDI9eobEOuz4MtC'
  };

  if (url) {
    eventParams['event_callback'] = () => {
      window.location.href = url;
    };
  }

  safeGtag('add_to_cart', eventParams);
  return false;
}

/**
 * 3. Begin Checkout - Track when users click "Checkout" button
 * Conversion ID: AW-17875605995/Q-DNCLqC9uobEOuz4MtC
 */
export function trackBeginCheckout(url?: string) {
  const eventParams: any = {
    'send_to': 'AW-17875605995/Q-DNCLqC9uobEOuz4MtC'
  };

  if (url) {
    eventParams['event_callback'] = () => {
      window.location.href = url;
    };
  }

  safeGtag('begin_checkout', eventParams);
  return false;
}

/**
 * 4. Payment Initiate - Track when users click "Pay Now" button
 * Conversion ID: AW-17875605995/ceIECLrhgusbEOuz4MtC
 * 
 * @param value - The total order value in INR (e.g., 10999 for ₹10,999)
 * @param url - Optional redirect URL after tracking
 */
export function trackPaymentInitiate(value: number, url?: string) {
  const eventParams: any = {
    'send_to': 'AW-17875605995/ceIECLrhgusbEOuz4MtC',
    'value': value,
    'currency': 'INR'
  };

  if (url) {
    eventParams['event_callback'] = () => {
      window.location.href = url;
    };
  }

  safeGtag('payment_initiate', eventParams);
  return false;
}

/**
 * 5. Payment Complete - Track when users land on thank you page after payment
 * Conversion ID: AW-17875605995/sViRCK3hxOkbEOuz4MtC
 * 
 * @param value - The total order value in INR (e.g., 10999 for ₹10,999)
 * @param transactionId - The order ID or payment ID
 */
export function trackPaymentComplete(value: number, transactionId: string) {
  safeGtag('payment_complete', {
    'send_to': 'AW-17875605995/sViRCK3hxOkbEOuz4MtC',
    'value': value,
    'currency': 'INR',
    'transaction_id': transactionId
  });
}
