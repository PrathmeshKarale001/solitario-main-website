/**
 * Festival Offer Configuration & Utilities
 * Akshaya Tritiya 2026: Flat 10% off + Free Premium Diamond
 *
 * This module is the single source of truth for the festival offer.
 * The discount (TRITIYA10) is applied via Shopify's cartDiscountCodesUpdate mutation,
 * so the total lives in Shopify — not React state — and survives page refresh.
 */

// ---------- Config ----------
export const FESTIVAL_OFFER = {
  /** Shopify discount code for 10% off the akshaya-tritiya-2026 collection */
  discountCode: 'TRITIYA10',

  /** The 10% applies to all items in the akshaya-tritiya-2026 collection */
  discountPercent: 10,

  /** Product numeric ID in Shopify (from Admin URL) */
  giftProductId: '10264124457235',

  /** GID format — Shopify Storefront API expects this */
  giftProductGid: 'gid://shopify/Product/10264124457235',

  /** Cart line attribute key used to identify the gift item in UI */
  giftAttributeKey: '_is_festival_gift',

  /** Human-readable gift product name */
  giftProductName: 'Premium Diamond',

  /** Festival active window */
  startDate: new Date('2026-04-29T00:00:00+05:30'),
  endDate: new Date('2026-04-30T23:59:59+05:30'),

  /** Display label for UI banners */
  label: 'Akshaya Tritiya Offer',
  tagline: '🪷 10% Off + Free Premium Diamond on every order',
} as const;

// ---------- Helpers ----------

/**
 * Returns true if the Akshaya Tritiya offer is currently active.
 * Defaults to true during the festival window; you can override for testing.
 */
export function isFestivalOfferActive(overrideNow?: Date): boolean {
  const now = overrideNow ?? new Date();
  return now >= FESTIVAL_OFFER.startDate && now <= FESTIVAL_OFFER.endDate;
}

/**
 * Returns true if the given discount codes array already has TRITIYA10 applied and applicable.
 */
export function isTritiyaCodeApplied(
  discountCodes: Array<{ code: string; applicable: boolean }>
): boolean {
  return discountCodes.some(
    (d) =>
      d.code.toUpperCase() === FESTIVAL_OFFER.discountCode &&
      d.applicable
  );
}

/**
 * Returns true if the given cart lines already contain the free gift item.
 */
export function isGiftAlreadyInCart(
  lines: Array<{ attributes?: Array<{ key: string; value: string }> }>
): boolean {
  return lines.some((line) =>
    line.attributes?.some(
      (a) => a.key === FESTIVAL_OFFER.giftAttributeKey && a.value === 'true'
    )
  );
}
