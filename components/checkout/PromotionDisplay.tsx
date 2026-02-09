'use client';

import { useState, useEffect } from 'react';
import { Loader2, Tag, Gift, Sparkles } from 'lucide-react';

interface Discount {
  type: 'FIRST_PURCHASE' | 'LOYALTY_COUPON' | 'BUY2';
  percent: number;
  amount: number;
  description: string;
}

interface GiftLine {
  variant_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  is_gift: true;
}

interface PromotionDisplayProps {
  cartId: string;
  onPricingUpdate?: (pricing: {
    subtotal: number;
    discount: number;
    total: number;
  }) => void;
}

export function PromotionDisplay({ cartId, onPricingUpdate }: PromotionDisplayProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pricing, setPricing] = useState<{
    subtotal: number;
    discounts: Discount[];
    total: number;
    currency: string;
  } | null>(null);
  const [giftLines, setGiftLines] = useState<GiftLine[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const fetchPricing = async (coupon?: string) => {
    setIsLoading(true);
    setErrors([]);
    
    try {
      const response = await fetch('/api/pricing/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId,
          couponCode: coupon || appliedCoupon,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors([data.error || 'Failed to calculate pricing']);
        return;
      }

      setPricing(data.pricing);
      setGiftLines(data.giftLines || []);
      setMessages(data.messages || []);
      setErrors(data.errors || []);

      if (onPricingUpdate) {
        const totalDiscount = data.pricing.discounts.reduce(
          (sum: number, d: Discount) => sum + d.amount,
          0
        );
        onPricingUpdate({
          subtotal: data.pricing.subtotal,
          discount: totalDiscount,
          total: data.pricing.total,
        });
      }
    } catch (error) {
      console.error('Failed to fetch pricing:', error);
      setErrors(['Failed to calculate pricing. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (cartId) {
      fetchPricing();
    }
  }, [cartId]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setAppliedCoupon(couponCode.trim().toUpperCase());
    await fetchPricing(couponCode.trim().toUpperCase());
  };

  const handleRemoveCoupon = async () => {
    setCouponCode('');
    setAppliedCoupon(null);
    await fetchPricing('');
  };

  if (!pricing) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-bronze-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Coupon Input */}
      <div className="bg-brand-50 rounded-brand-lg p-4 border border-brand-200">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-bronze-gold" />
          <h3 className="font-gotham text-ui uppercase tracking-luxury text-brand-800">
            Promo Code
          </h3>
        </div>
        
        {!appliedCoupon ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 px-4 py-2 border border-brand-300 rounded-brand focus:outline-none focus:ring-2 focus:ring-bronze-gold font-montserrat text-body-md"
              disabled={isLoading}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={isLoading || !couponCode.trim()}
              className="px-6 py-2 bg-bronze-gold hover:bg-soft-bronze text-white font-gotham text-ui uppercase tracking-luxury rounded-brand disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-white rounded-brand p-3 border border-bronze-gold/30">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-bronze-gold" />
              <span className="font-gotham text-body-md text-brand-800">{appliedCoupon}</span>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-body-sm text-brand-600 hover:text-error transition-colors font-montserrat"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      {messages.length > 0 && (
        <div className="space-y-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className="flex items-start gap-2 bg-classic-green/10 border border-classic-green/30 rounded-brand-lg p-3"
            >
              <Sparkles className="w-4 h-4 text-classic-green flex-shrink-0 mt-0.5" />
              <p className="text-body-sm font-montserrat text-classic-green">{message}</p>
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
              className="flex items-start gap-2 bg-error/10 border border-error/30 rounded-brand-lg p-3"
            >
              <span className="text-error text-body-sm font-montserrat">{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Gift Lines */}
      {giftLines.length > 0 && (
        <div className="bg-gradient-to-br from-bronze-gold/10 to-soft-bronze/10 border border-bronze-gold/30 rounded-brand-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-bronze-gold" />
            <h4 className="font-montserrat font-bold text-heading-sm text-brand-800">Free Gift Included!</h4>
          </div>
          {giftLines.map((gift, index) => (
            <p key={index} className="text-body-sm font-montserrat text-brand-600">
              {gift.product_name} × {gift.quantity}
            </p>
          ))}
        </div>
      )}

      {/* Active Discounts - Highlighted */}
      {pricing.discounts.length > 0 && (
        <div className="bg-gradient-to-br from-classic-green/10 to-classic-green/5 border border-classic-green/30 rounded-brand-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-classic-green" />
            <h4 className="font-montserrat font-bold text-heading-sm text-brand-800">Active Offers</h4>
          </div>
          <div className="space-y-2">
            {pricing.discounts.map((discount, index) => (
              <div key={index} className="flex items-center justify-between bg-white/60 rounded-lg p-2">
                <div className="flex-1">
                  <p className="text-body-sm font-gotham text-brand-800 font-semibold">
                    {discount.type === 'FIRST_PURCHASE' && '🌟 First Purchase'}
                    {discount.type === 'LOYALTY_COUPON' && '💎 Loyalty Coupon'}
                    {discount.type === 'BUY2' && '🎁 Buy 2 Items'}
                  </p>
                  <p className="text-xs text-brand-600 font-montserrat">
                    {discount.description}
                  </p>
                </div>
                <span className="font-gotham text-body-md font-bold text-classic-green">
                  -{discount.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Summary */}
      <div className="space-y-2 pt-4 border-t border-brand-200">
        <div className="flex items-center justify-between">
          <span className="text-brand-600 font-montserrat">Subtotal</span>
          <span className="font-gotham text-brand-800">
            ₹{pricing.subtotal.toLocaleString('en-IN')}
          </span>
        </div>

        {pricing.discounts.map((discount, index) => (
          <div key={index} className="flex items-center justify-between text-classic-green">
            <span className="text-body-sm font-montserrat">
              {discount.description}
            </span>
            <span className="font-gotham text-body-md">
              -₹{discount.amount.toLocaleString('en-IN')}
            </span>
          </div>
        ))}

        <div className="flex items-center justify-between pt-3 border-t border-brand-300">
          <span className="font-montserrat font-bold text-heading-md text-brand-800">Total</span>
          <span className="font-gotham text-heading-xl font-bold text-classic-green">
            ₹{pricing.total.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}
