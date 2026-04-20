/**
 * POST /api/cart/apply-festival-offer
 *
 * Applies the Akshaya Tritiya festival offer to the Shopify cart:
 * 1. Applies the TRITIYA10 discount code via cartDiscountCodesUpdate
 * 2. Fetches the Premium Diamond variant ID from Shopify
 * 3. Adds the free diamond to the cart with a `_is_festival_gift=true` attribute
 *    (so UI can display it as a "Free Gift" without price)
 *
 * Returns the updated cart cost so checkout can read the server-authoritative total.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { shopifyStorefrontFetch, shopifyAdminFetch } from '@/lib/shopify';
import { FESTIVAL_OFFER, isFestivalOfferActive, isTritiyaCodeApplied, isGiftAlreadyInCart } from '@/lib/festival-offer';
import logger from '@/lib/logger';

// ── GraphQL: Apply discount code to cart ──────────────────────────────────────
const CART_DISCOUNT_CODES_UPDATE = `
  mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        id
        discountCodes { code applicable }
        estimatedCost {
          subtotalAmount { amount currencyCode }
          totalAmount    { amount currencyCode }
        }
      }
      userErrors { field message }
    }
  }
`;

// ── GraphQL: Get cart lines with attributes ───────────────────────────────────
const GET_CART_LINES_WITH_ATTRS = `
  query getCartLines($cartId: ID!) {
    cart(id: $cartId) {
      discountCodes { code applicable }
      lines(first: 50) {
        edges {
          node {
            id
            attributes { key value }
            merchandise {
              ... on ProductVariant { id product { id } }
            }
          }
        }
      }
      estimatedCost {
        subtotalAmount { amount currencyCode }
        totalAmount    { amount currencyCode }
      }
    }
  }
`;

// ── GraphQL: Get first variant of the diamond product (Admin API) ─────────────
const GET_PRODUCT_VARIANT = `
  query getProductVariant($id: ID!) {
    product(id: $id) {
      title
      variants(first: 1) {
        edges { node { id legacyResourceId availableForSale } }
      }
    }
  }
`;

// ── GraphQL: Add lines with attributes (Storefront API) ──────────────────────
const CART_LINES_ADD_WITH_ATTRS = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        discountCodes { code applicable }
        estimatedCost {
          subtotalAmount { amount currencyCode }
          totalAmount    { amount currencyCode }
        }
      }
      userErrors { field message }
    }
  }
`;

// ── GraphQL: Remove lines (Storefront API) ────────────────────────────────────
const CART_LINES_REMOVE = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        estimatedCost {
          subtotalAmount { amount currencyCode }
          totalAmount    { amount currencyCode }
        }
      }
      userErrors { field message }
    }
  }
`;

// ── Module-level variant ID cache (process lifetime) ─────────────────────────
let cachedVariantGid: string | null = null;

async function getGiftVariantGid(): Promise<string | null> {
  if (cachedVariantGid) return cachedVariantGid;

  try {
    const res = await shopifyAdminFetch<any>(GET_PRODUCT_VARIANT, {
      id: FESTIVAL_OFFER.giftProductGid,
    });
    const variant = res.data?.product?.variants?.edges?.[0]?.node;
    if (variant?.id) {
      cachedVariantGid = variant.id; // e.g. gid://shopify/ProductVariant/XXXXX
      return cachedVariantGid;
    }
  } catch (err) {
    logger.error('Failed to fetch diamond variant ID:', err);
  }
  return null;
}

// ── Route Handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // Cart ID lives in an httpOnly cookie — read server-side only
    const cookieStore = await cookies();
    const cartId = cookieStore.get('solitario_cart_id')?.value;

    if (!cartId) {
      return NextResponse.json(
        { error: 'No active cart found. Please add items to your cart first.' },
        { status: 400 }
      );
    }

    if (!isFestivalOfferActive()) {
      return NextResponse.json(
        { error: 'Festival offer is not currently active' },
        { status: 400 }
      );
    }

    // ── Step 1: Apply TRITIYA10 discount code ─────────────────────────────────
    const discountRes = await shopifyStorefrontFetch<any>(CART_DISCOUNT_CODES_UPDATE, {
      cartId,
      discountCodes: [FESTIVAL_OFFER.discountCode],
    });

    if (discountRes.errors?.length) {
      logger.error('cartDiscountCodesUpdate errors:', discountRes.errors);
      return NextResponse.json(
        { error: discountRes.errors[0].message },
        { status: 422 }
      );
    }

    const cartAfterDiscount = discountRes.data?.cartDiscountCodesUpdate?.cart;
    let subtotalAmount = parseFloat(cartAfterDiscount?.estimatedCost?.subtotalAmount?.amount ?? '0');
    
    // ── Step 1.5: Verify Minimum Threshold ───────────────────────────────────
    if (subtotalAmount < FESTIVAL_OFFER.minThreshold) {
      // Cleanup: Remove discount code if it was applied
      await shopifyStorefrontFetch<any>(CART_DISCOUNT_CODES_UPDATE, {
        cartId,
        discountCodes: [], // Remove all codes for safety/cleanliness
      });

      // Cleanup: Remove gift item if it exists
      const cartLinesRes = await shopifyStorefrontFetch<any>(GET_CART_LINES_WITH_ATTRS, { cartId });
      const cartLines = cartLinesRes.data?.cart?.lines?.edges?.map((e: any) => e.node) ?? [];
      const giftLineIds = cartLines
        .filter((l: any) => l.attributes?.some((a: any) => a.key === FESTIVAL_OFFER.giftAttributeKey && a.value === 'true'))
        .map((l: any) => l.id);

      if (giftLineIds.length > 0) {
        await shopifyStorefrontFetch<any>(CART_LINES_REMOVE, {
          cartId,
          lineIds: giftLineIds,
        });
      }

      return NextResponse.json(
        { 
          error: `Minimum purchase of ₹${FESTIVAL_OFFER.minThreshold.toLocaleString()} required for this offer.`,
          currentSubtotal: subtotalAmount,
          threshold: FESTIVAL_OFFER.minThreshold,
          offerRemoved: true
        },
        { status: 422 }
      );
    }

    const discountApplied = isTritiyaCodeApplied(cartAfterDiscount?.discountCodes ?? []);

    // ── Step 2: Check whether gift is already in cart ─────────────────────────
    const cartLinesRes = await shopifyStorefrontFetch<any>(GET_CART_LINES_WITH_ATTRS, { cartId });
    const currentCart = cartLinesRes.data?.cart;
    const cartLines = currentCart?.lines?.edges?.map((e: any) => e.node) ?? [];
    const giftAlreadyPresent = isGiftAlreadyInCart(cartLines);

    let finalCart = currentCart;

    // ── Step 3: Add free diamond if not present ───────────────────────────────
    if (!giftAlreadyPresent) {
      const variantGid = await getGiftVariantGid();

      if (variantGid) {
        const addRes = await shopifyStorefrontFetch<any>(CART_LINES_ADD_WITH_ATTRS, {
          cartId,
          lines: [
            {
              merchandiseId: variantGid,
              quantity: 1,
              attributes: [{ key: FESTIVAL_OFFER.giftAttributeKey, value: 'true' }],
            },
          ],
        });

        if (addRes.errors?.length) {
          logger.warn('Failed to add gift to cart:', addRes.errors);
          // Non-fatal — discount is still applied
        } else {
          finalCart = addRes.data?.cartLinesAdd?.cart ?? finalCart;
        }
      } else {
        logger.warn('Could not resolve Premium Diamond variant GID');
      }
    }

    // ── Return current Shopify-authoritative totals ────────────────────────────
    subtotalAmount = parseFloat(finalCart?.estimatedCost?.subtotalAmount?.amount ?? '0');
    const totalAmount = parseFloat(finalCart?.estimatedCost?.totalAmount?.amount ?? '0');

    return NextResponse.json({
      success: true,
      discountApplied,
      giftAdded: !giftAlreadyPresent,
      giftAlreadyPresent,
      shopifySubtotal: subtotalAmount,    // In rupees (Shopify returns rupees for INR)
      shopifyTotal: totalAmount,           // After TRITIYA10 + automatic "Free Diamond" discount
      discountAmount: Math.max(0, subtotalAmount - totalAmount),
    });
  } catch (err) {
    logger.error('POST /api/cart/apply-festival-offer error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
