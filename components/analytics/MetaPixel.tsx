'use client';

import Script from 'next/script';

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// Declare fbq function globally
declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export default function MetaPixel() {
  if (!META_PIXEL_ID) {
    return null;
  }

  return (
    <>
      {/* Meta Pixel Base Code — loads right after hydration so fbq is available for all events */}
      <Script
        id="meta-pixel-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />

      {/* Noscript fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

// =============================================
// META PIXEL EVENT TRACKING HELPERS
// =============================================

/**
 * Safely call fbq — queues the call if fbq hasn't loaded yet.
 * The base pixel code creates a queue automatically, but this
 * guards against the case where the Script tag hasn't executed at all.
 */
const safeFbq = (...args: any[]) => {
  if (typeof window === 'undefined') return;

  // If fbq exists (script loaded or queue created), call it directly
  if (window.fbq) {
    window.fbq(...args);
    return;
  }

  // If fbq doesn't exist yet, set up the queue manually
  // (mirrors what the base pixel code does)
  const n: any = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];
  window.fbq = n;
  window._fbq = n;

  // Now call with the queued args — they'll fire once fbevents.js loads
  window.fbq(...args);
};

/**
 * Track a standard Meta Pixel event
 */
export const trackMetaEvent = (eventName: string, parameters?: Record<string, any>) => {
  safeFbq('track', eventName, parameters);
};

/**
 * Track standard events with trackSingle (pixel-specific)
 */
export const trackMetaStandardEvent = (eventName: string, parameters?: Record<string, any>) => {
  safeFbq('trackSingle', META_PIXEL_ID, eventName, parameters);
};

// =============================================
// E-COMMERCE TRACKING EVENTS
// =============================================

/**
 * Track when a user views content
 */
export const trackMetaViewContent = (params: {
  content_name: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
}) => {
  trackMetaEvent('ViewContent', {
    currency: params.currency || 'INR',
    ...params,
  });
};

/**
 * Track when a product is added to cart
 */
export const trackMetaAddToCart = (params: {
  content_ids: string[];
  content_name: string;
  content_type: string;
  value: number;
  currency?: string;
}) => {
  trackMetaEvent('AddToCart', {
    currency: params.currency || 'INR',
    ...params,
  });
};

/**
 * Track when checkout is initiated
 */
export const trackMetaInitiateCheckout = (params: {
  content_ids: string[];
  contents: Array<{ id: string; quantity: number }>;
  value: number;
  currency?: string;
  num_items: number;
}) => {
  trackMetaEvent('InitiateCheckout', {
    currency: params.currency || 'INR',
    ...params,
  });
};

/**
 * Track when a purchase is completed
 */
export const trackMetaPurchase = (params: {
  content_ids: string[];
  contents: Array<{ id: string; quantity: number; item_price: number }>;
  value: number;
  currency?: string;
  num_items: number;
}) => {
  trackMetaEvent('Purchase', {
    currency: params.currency || 'INR',
    ...params,
  });
};

/**
 * Track when a user adds an item to wishlist
 */
export const trackMetaAddToWishlist = (params: {
  content_ids: string[];
  content_name: string;
  value?: number;
  currency?: string;
}) => {
  trackMetaEvent('AddToWishlist', {
    currency: params.currency || 'INR',
    ...params,
  });
};

/**
 * Track when a user searches
 */
export const trackMetaSearch = (params: {
  search_string: string;
  content_category?: string;
}) => {
  trackMetaEvent('Search', params);
};

/**
 * Track when payment info is added
 */
export const trackMetaAddPaymentInfo = (params: {
  content_ids: string[];
  value: number;
  currency?: string;
}) => {
  trackMetaEvent('AddPaymentInfo', {
    currency: params.currency || 'INR',
    ...params,
  });
};

/**
 * Track when a lead is generated
 */
export const trackMetaLead = (params?: {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}) => {
  trackMetaEvent('Lead', {
    currency: params?.currency || 'INR',
    ...params,
  });
};

/**
 * Track when a user completes registration
 */
export const trackMetaCompleteRegistration = (params?: {
  content_name?: string;
  value?: number;
  currency?: string;
  status?: string;
}) => {
  trackMetaEvent('CompleteRegistration', {
    currency: params?.currency || 'INR',
    ...params,
  });
};

/**
 * Track when a user finds a location (store locator)
 */
export const trackMetaFindLocation = (params?: {
  content_name?: string;
  content_category?: string;
  search_string?: string;
  latitude?: number;
  longitude?: number;
}) => {
  trackMetaEvent('FindLocation', params);
};

/**
 * Track custom contact events
 */
export const trackMetaContact = () => {
  trackMetaEvent('Contact');
};

/**
 * Track subscribe events (newsletter, paid subscription)
 */
export const trackMetaSubscribe = (params?: {
  value?: number;
  currency?: string;
  predicted_ltv?: number;
}) => {
  trackMetaEvent('Subscribe', {
    currency: params?.currency || 'INR',
    ...params,
  });
};

// =============================================
// ADVANCED TRACKING
// =============================================

/**
 * Track custom conversions
 */
export const trackMetaCustomEvent = (eventName: string, params?: Record<string, any>) => {
  trackMetaEvent(eventName, params);
};

/**
 * Set user data for advanced matching (GDPR compliant)
 */
export const setMetaUserData = (userData: {
  em?: string; // email (hashed)
  ph?: string; // phone (hashed)
  fn?: string; // first name (hashed)
  ln?: string; // last name (hashed)
  ct?: string; // city (hashed)
  st?: string; // state (hashed)
  zp?: string; // zip code (hashed)
  country?: string; // country code (hashed)
}) => {
  safeFbq('setUserProperties', META_PIXEL_ID, userData);
};
