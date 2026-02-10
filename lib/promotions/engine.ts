import { PromotionConfig } from '../db/schema';
import { CouponRepository, OrderRepository } from '../db/storage';
import { getPromotionConfig } from './config';

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface PromoEngineInput {
  clerkUserId?: string;
  cartLines: CartLine[];
  couponCode?: string;
}

export interface PromoEngineOutput {
  subtotal: number;
  discounts: Array<{
    type: 'FIRST_PURCHASE' | 'LOYALTY_COUPON' | 'BUY2';
    percent: number;
    amount: number;
    description: string;
  }>;
  giftLines: Array<{
    variant_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    is_gift: true;
  }>;
  total: number;
  messages: string[];
  appliedFlags: {
    firstPurchase: boolean;
    loyaltyCoupon: boolean;
    cartRule: 'BUY2' | null;
  };
  errors: string[];
}

export async function calculatePromotions(
  input: PromoEngineInput
): Promise<PromoEngineOutput> {
  const config = await getPromotionConfig();

  if (!config.enabled) {
    return getNoPromoResult(input.cartLines);
  }

  const subtotal = calculateSubtotal(input.cartLines);
  const totalItems = input.cartLines.reduce((sum, line) => sum + line.quantity, 0);

  const discounts: PromoEngineOutput['discounts'] = [];
  const giftLines: PromoEngineOutput['giftLines'] = [];
  const messages: string[] = [];
  const errors: string[] = [];

  let firstPurchaseApplied = false;
  let loyaltyCouponApplied = false;
  let cartRuleApplied: 'BUY2' | null = null;

  // First purchase discount only for logged-in users
  const isFirstPurchase =
    input.clerkUserId && OrderRepository.countPaidOrdersByClerkUserId(input.clerkUserId) === 0;

  // Loyalty coupons removed - only Shopify discount codes supported via API
  const validCoupon = null;

  // Apply cart-based rule (BUY 2 GET 1 FREE - lower-priced item free)
  if (totalItems >= 2) {
    cartRuleApplied = 'BUY2';
    
    const itemPrices = input.cartLines.map(line => {
      const unitPrice = parseFloat(line.merchandise.price.amount);
      return unitPrice * 100; // Convert to cents
    });
    const lowestItemPrice = Math.min(...itemPrices);
    const discountAmount = lowestItemPrice;
    const discountPercent = Math.round((discountAmount / subtotal) * 100);
    
    discounts.push({
      type: 'BUY2',
      percent: discountPercent,
      amount: discountAmount,
      description: 'Buy 2 Get 1 Free',
    });
    messages.push(`🎁 Buy 2 Get 1 Free!`);
  }

  // Apply first purchase discount (can stack with cart rules if enabled)
  if (isFirstPurchase && config.stacking_first_purchase) {
    firstPurchaseApplied = true;
    const discountAmount = Math.round((subtotal * config.first_purchase_percent) / 100);
    discounts.push({
      type: 'FIRST_PURCHASE',
      percent: config.first_purchase_percent,
      amount: discountAmount,
      description: `${config.first_purchase_percent}% off first purchase`,
    });
    messages.push(`🌟 Welcome! ${config.first_purchase_percent}% off your first order!`);
  } else if (isFirstPurchase && !cartRuleApplied && !config.stacking_first_purchase) {
    // Only apply if no cart rule and stacking is disabled
    firstPurchaseApplied = true;
    const discountAmount = Math.round((subtotal * config.first_purchase_percent) / 100);
    discounts.push({
      type: 'FIRST_PURCHASE',
      percent: config.first_purchase_percent,
      amount: discountAmount,
      description: `${config.first_purchase_percent}% off first purchase`,
    });
    messages.push(`🌟 Welcome! ${config.first_purchase_percent}% off your first order!`);
  }

  // Loyalty coupon system removed - coupons now handled via Shopify discount codes only

  const totalDiscount = discounts.reduce((sum, d) => sum + d.amount, 0);
  const total = Math.max(0, subtotal - totalDiscount);

  return {
    subtotal,
    discounts,
    giftLines,
    total,
    messages,
    appliedFlags: {
      firstPurchase: firstPurchaseApplied,
      loyaltyCoupon: loyaltyCouponApplied,
      cartRule: cartRuleApplied,
    },
    errors,
  };
}

function calculateSubtotal(cartLines: CartLine[]): number {
  return cartLines.reduce((sum, line) => {
    const price = parseFloat(line.merchandise.price.amount);
    return sum + price * line.quantity * 100;
  }, 0);
}

function getNoPromoResult(cartLines: CartLine[]): PromoEngineOutput {
  const subtotal = calculateSubtotal(cartLines);
  return {
    subtotal,
    discounts: [],
    giftLines: [],
    total: subtotal,
    messages: [],
    appliedFlags: {
      firstPurchase: false,
      loyaltyCoupon: false,
      cartRule: null,
    },
    errors: [],
  };
}

// Loyalty coupon validation removed - coupons handled via Shopify API in /api/coupons/validate endpoint

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees);
}

export function paiseToRupees(paise: number): number {
  return paise / 100;
}
