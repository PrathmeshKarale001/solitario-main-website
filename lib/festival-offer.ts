/**
 * Festival Offer Configuration & Utilities
 * Akshaya Tritiya 2026: Flat 10% off + Free Premium Diamond
 *
 * This module is the single source of truth for the festival offer.
 * The discount (TRITIYA10) is applied via Shopify's cartDiscountCodesUpdate mutation,
 * so the total lives in Shopify — not React state — and survives page refresh.
 */

// ---------- Config ----------
/** Akshaya Tritiya 2026 Promotion - DELETED */
export const FESTIVAL_OFFER = {
  discountCode: '',
  discountPercent: 0,
  giftProductId: '',
  giftProductGid: '',
  giftAttributeKey: '',
  giftProductName: '',
  startDate: new Date('2000-01-01'),
  endDate: new Date('2000-01-01'),
  minThreshold: Infinity,
  label: '',
  tagline: '',
} as const;

// ---------- Helpers ----------

/**
 * Returns true if the Akshaya Tritiya offer is currently active.
 * Defaults to true during the festival window; you can override for testing.
 */
export function isFestivalOfferActive(overrideNow?: Date): boolean {
  return false; // DELETED
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
