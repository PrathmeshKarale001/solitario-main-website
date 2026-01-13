export interface User {
  id: string;
  clerk_user_id: string;
  shopify_customer_id: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  clerk_user_id: string;
  shopify_cart_id: string | null;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED';
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  promo_snapshot: PromoSnapshot;
  created_at: string;
  paid_at: string | null;
}

export interface PromoSnapshot {
  applied_discounts: AppliedDiscount[];
  gift_lines: GiftLine[];
  coupon_code: string | null;
  first_purchase_discount: boolean;
  cart_rule_applied: 'BUY2' | 'BUY3' | null;
  total_items: number;
  messages: string[];
}

export interface AppliedDiscount {
  type: 'FIRST_PURCHASE' | 'LOYALTY_COUPON' | 'BUY2' | 'BUY3';
  percent: number;
  amount: number;
  description: string;
}

export interface GiftLine {
  variant_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  is_gift: true;
}

export interface Coupon {
  id: string;
  clerk_user_id: string;
  code: string;
  percent_off: number;
  status: 'ACTIVE' | 'REDEEMED' | 'EXPIRED';
  issued_month: string;
  issued_at: string;
  expires_at: string;
  redeemed_at: string | null;
  issued_for_order_id: string;
}

export interface PromotionConfig {
  enabled: boolean;
  first_purchase_percent: number;
  loyalty_coupon_percent: number;
  loyalty_coupon_validity_days: number;
  buy2_percent: number;
  buy3_percent: number;
  gift_variant_id: string;
  gift_product_name: string;
  stacking_first_purchase: boolean;
}

export const DEFAULT_PROMO_CONFIG: PromotionConfig = {
  enabled: true,
  first_purchase_percent: 20,
  loyalty_coupon_percent: 10,
  loyalty_coupon_validity_days: 30,
  buy2_percent: 10,
  buy3_percent: 30,
  gift_variant_id: '',
  gift_product_name: '10-cent Diamond Gift',
  stacking_first_purchase: false,
};
