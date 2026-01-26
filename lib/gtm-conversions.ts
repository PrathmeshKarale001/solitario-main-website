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
 * 1. Page View - Track when users view product pages
 * Conversion ID: AW-17875605995/LRTeCO6g9eobEOuz4MtC
 */
export function trackPageView() {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-17875605995/LRTeCO6g9eobEOuz4MtC'
    });
  }
}

/**
 * 2. Add to Cart - Track when users click "Add to Cart" or "Buy Now" buttons
 * Conversion ID: AW-17875605995/a_7uCLDI9eobEOuz4MtC
 */
export function trackAddToCart(url?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    const callback = () => {
      if (typeof url !== 'undefined' && url) {
        window.location.href = url;
      }
    };

    window.gtag('event', 'conversion', {
      'send_to': 'AW-17875605995/a_7uCLDI9eobEOuz4MtC',
      'event_callback': callback
    });
  }
  
  return false;
}

/**
 * 3. Begin Checkout - Track when users click "Checkout" button
 * Conversion ID: AW-17875605995/Q-DNCLqC9uobEOuz4MtC
 */
export function trackBeginCheckout(url?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    const callback = () => {
      if (typeof url !== 'undefined' && url) {
        window.location.href = url;
      }
    };

    window.gtag('event', 'conversion', {
      'send_to': 'AW-17875605995/Q-DNCLqC9uobEOuz4MtC',
      'event_callback': callback
    });
  }
  
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
  if (typeof window !== 'undefined' && window.gtag) {
    const callback = () => {
      if (typeof url !== 'undefined' && url) {
        window.location.href = url;
      }
    };

    window.gtag('event', 'conversion', {
      'send_to': 'AW-17875605995/ceIECLrhgusbEOuz4MtC',
      'value': value,
      'currency': 'INR',
      'event_callback': callback
    });
  }
  
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
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-17875605995/sViRCK3hxOkbEOuz4MtC',
      'value': value,
      'currency': 'INR',
      'transaction_id': transactionId
    });
  }
}
