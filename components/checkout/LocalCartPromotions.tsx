'use client';

import { useState, useEffect } from 'react';
import { Tag, Gift, Sparkles, Loader2 } from 'lucide-react';

import { useAdmin } from '@/lib/admin-context';

interface LocalCartPromotionsProps {
  totalItems: number;
  subtotal: number;
  onDiscountApplied?: (discount: number, messages: string[]) => void;
}

export function LocalCartPromotions({ totalItems, subtotal, onDiscountApplied }: LocalCartPromotionsProps) {
  const { appliedCoupon, setAppliedCoupon } = useAdmin();
  const [couponCode, setCouponCode] = useState(appliedCoupon || '');
  const [isLoading, setIsLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [showGift, setShowGift] = useState(false);

  // Sync from global state if it changes externally
  useEffect(() => {
    if (appliedCoupon) {
      setCouponCode(appliedCoupon);
      handleApplyCoupon(appliedCoupon);
    }
  }, [appliedCoupon]);

  // Calculate automatic promotions based on cart
  useEffect(() => {
    calculateAutomaticPromotions();
  }, [totalItems, subtotal]);

  const calculateAutomaticPromotions = async () => {
    setMessages([]);
    setShowGift(false);
    let calculatedDiscount = 0;
    const newMessages: string[] = [];

    // Buy 3+ items: 30% off
    if (totalItems >= 3) {
      calculatedDiscount = Math.round(subtotal * 0.30);
      newMessages.push('🎉 30% discount applied for buying 3+ items!');
    }
    // Buy 2 items: 10% off + gift
    else if (totalItems === 2) {
      calculatedDiscount = Math.round(subtotal * 0.10);
      newMessages.push('🎁 10% discount applied for buying 2 items!');
      newMessages.push('✨ Free 10 Cent Diamond Gift will be added to your order!');
      setShowGift(true);
    }

    setDiscount(calculatedDiscount);
    setMessages(newMessages);

    if (onDiscountApplied) {
      onDiscountApplied(calculatedDiscount, newMessages);
    }
  };

  const handleApplyCoupon = async (codeOverride?: string) => {
    const codeToApply = codeOverride || couponCode;
    if (!codeToApply.trim()) return;
    
    setIsLoading(true);
    setErrors([]);

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponCode: codeToApply.trim().toUpperCase(),
          subtotal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors([data.error || 'Invalid coupon code']);
        if (!codeOverride) setAppliedCoupon(null);
        return;
      }

      if (totalItems >= 2) {
        setErrors(["This coupon can't be combined with other offers."]);
        if (!codeOverride) setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon(codeToApply.trim().toUpperCase());
      const couponDiscount = Math.round(subtotal * (data.percentOff / 100));
      setDiscount(couponDiscount);
      setMessages([`✨ ${data.percentOff}% loyalty discount applied!`]);

      if (onDiscountApplied) {
        onDiscountApplied(couponDiscount, [`${data.percentOff}% loyalty discount applied`]);
      }
    } catch (error) {
      console.error('Failed to validate coupon:', error);
      setErrors(['Failed to validate coupon. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setErrors([]);
    calculateAutomaticPromotions();
  };

  return (
    <div className="space-y-4">
      {/* Coupon Input */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-classic-green" />
          <h3 className="font-medium text-sm text-gray-900">Have a Promo Code?</h3>
        </div>
        
        {!appliedCoupon ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green"
              disabled={isLoading || totalItems >= 2}
            />
            <button
              onClick={() => handleApplyCoupon()}
              disabled={isLoading || !couponCode.trim() || totalItems >= 2}
              className="px-4 py-2 bg-classic-green hover:bg-classic-green/90 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-classic-green/30">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-classic-green" />
              <span className="text-sm font-medium text-gray-900">{appliedCoupon}</span>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-xs text-gray-600 hover:text-red-600 transition-colors"
            >
              Remove
            </button>
          </div>
        )}

        {totalItems >= 2 && !appliedCoupon && (
          <p className="text-xs text-gray-500 mt-2">
            Coupons cannot be combined with cart discounts
          </p>
        )}
      </div>

      {/* Messages */}
      {messages.length > 0 && (
        <div className="space-y-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-3"
            >
              <Sparkles className="w-4 h-4 text-classic-green flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">{message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div
              key={index}
              className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3"
            >
              <span className="text-sm text-red-700">{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Gift Notice */}
      {showGift && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Gift className="w-5 h-5 text-amber-600" />
            <h4 className="font-medium text-amber-900">Free Gift Included!</h4>
          </div>
          <p className="text-sm text-amber-800">
            10 Cent Diamond will be added to your order
          </p>
        </div>
      )}

      {/* Discount Summary */}
      {discount > 0 && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <span className="text-sm text-gray-600">Promotion Discount</span>
          <span className="text-sm font-bold text-green-600">
            -₹{(discount / 100).toLocaleString('en-IN')}
          </span>
        </div>
      )}
    </div>
  );
}
