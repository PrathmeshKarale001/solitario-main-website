/**
 * Centralized Cart Promotions Hook
 * 
 * This hook provides unified coupon validation and cart discount logic
 * across all cart interfaces (Sidebar, Cart Page, Checkout)
 */

import { useState, useCallback } from 'react';

interface CouponValidationResult {
  success: boolean;
  percentOff?: number;
  code?: string;
  source?: 'SHOPIFY' | 'LOCAL';
  error?: string;
}

interface UseCartPromotionsProps {
  totalItems: number;
  subtotal: number; // in rupees
  cartId?: string;
}

export function useCartPromotions({ totalItems, subtotal, cartId }: UseCartPromotionsProps) {
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Validate and apply a coupon code
   * 
   * Rules:
   * - Coupons CANNOT be combined with cart discounts (BUY 2 or BUY 3+)
   * - Only works when totalItems < 2
   */
  const validateCoupon = useCallback(async (code: string): Promise<CouponValidationResult> => {
    setIsValidating(true);
    setCouponError(null);

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponCode: code,
          subtotal: subtotal * 100, // Convert to cents
          cartId: cartId || (typeof window !== 'undefined' ? localStorage.getItem('shopify-cart-id') : null),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || 'Invalid coupon code';
        setCouponError(errorMsg);
        setAppliedCoupon(null);
        setCouponDiscount(0);
        return { success: false, error: errorMsg };
      }

      // Block ALL coupons from stacking with cart discounts (BUY 2 or BUY 3+)
      if (totalItems >= 2) {
        const errorMsg = "Coupons cannot be combined with cart discounts (BUY 2 or BUY 3+ offers).";
        setCouponError(errorMsg);
        setAppliedCoupon(null);
        setCouponDiscount(0);
        return { success: false, error: errorMsg };
      }

      // Apply the coupon
      setAppliedCoupon(code);
      
      if (data.percentOff) {
        const discount = Math.round((subtotal * data.percentOff) / 100);
        setCouponDiscount(discount);
      }

      return {
        success: true,
        percentOff: data.percentOff,
        code: code,
        source: data.source,
      };

    } catch (err) {
      const errorMsg = 'Failed to validate coupon. Please try again.';
      setCouponError(errorMsg);
      setAppliedCoupon(null);
      setCouponDiscount(0);
      return { success: false, error: errorMsg };
    } finally {
      setIsValidating(false);
    }
  }, [totalItems, subtotal, cartId]);

  /**
   * Remove the applied coupon
   */
  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponError(null);
  }, []);

  /**
   * Check if coupons are allowed (not blocked by cart rules)
   */
  const canApplyCoupon = totalItems < 2;

  return {
    // State
    appliedCoupon,
    couponDiscount,
    couponError,
    isValidating,
    canApplyCoupon,

    // Actions
    validateCoupon,
    removeCoupon,
    setAppliedCoupon,
  };
}
