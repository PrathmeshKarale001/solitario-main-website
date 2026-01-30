'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Minus, Plus, Trash2, Tag, Gift, Loader2, ChevronRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAdmin } from '@/lib/admin-context';
import { formatPrice } from '@/lib/utils';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@clerk/nextjs';
import { CartErrorBoundary } from '@/components/ui/ErrorBoundary';

function CartSidebarContent() {
  const { items, isCartOpen, closeCart, updateQuantity, removeFromCart, total, itemCount } = useCart();
  const { userId } = useAuth();
  const [appliedCoupon, setAppliedCouponState] = useState<string>('');
  const [couponInput, setCouponInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [showApplied, setShowApplied] = useState(false);

  // Load coupon from localStorage on mount
  useEffect(() => {
    const savedCoupon = localStorage.getItem('applied_coupon');
    if (savedCoupon) {
      setAppliedCouponState(savedCoupon);
      setShowApplied(true);
      setCouponInput(savedCoupon);
    }
  }, []);

  // Helper to set coupon with localStorage persistence
  const setAppliedCoupon = (code: string) => {
    setAppliedCouponState(code);
    if (code) {
      localStorage.setItem('applied_coupon', code);
    } else {
      localStorage.removeItem('applied_coupon');
    }
  };

  const [giftProduct, setGiftProduct] = useState<{ name: string; image: string; price: number } | null>(null);
  const [isGiftLoading, setIsGiftLoading] = useState(false);
  
  // Promotion pricing state
  const [promotionPricing, setPromotionPricing] = useState<{
    subtotal: number;
    discounts: Array<{ type: string; percent: number; amount: number; description: string }>;
    total: number;
    messages: string[];
  } | null>(null);
  const [isPricingLoading, setIsPricingLoading] = useState(false);

  // Auto-calculate gift - only for exactly 2 items, not 3+
  const hasGift = itemCount === 2;

  // Fetch gift product details from Shopify if not already fetched
  useEffect(() => {
    async function fetchGift() {
      if (hasGift && !giftProduct) {
        setIsGiftLoading(true);
        try {
          // Fetch the gift product from our dedicated API endpoint
          const response = await fetch('/api/products/gift');
          if (response.ok) {
            const data = await response.json();
            setGiftProduct({
              name: data.name,
              image: data.image,
              price: 5000
            });
          } else {
            // Fallback to a high-quality static image if API fetch fails
            setGiftProduct({
              name: '10 Cent Diamond Gift',
              image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&q=80', 
              price: 5000
            });
          }
        } catch (err) {
          setGiftProduct({
            name: '10 Cent Diamond Gift',
            image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&q=80',
            price: 5000
          });
        } finally {
          setIsGiftLoading(false);
        }
      }
    }
    fetchGift();
  }, [hasGift, giftProduct]);

  // Fetch promotion pricing
  const fetchPromotionPricing = async () => {
    if (items.length === 0) {
      setPromotionPricing(null);
      return;
    }

    // Prevent duplicate calls
    if (isPricingLoading) return;

    setIsPricingLoading(true);
    try {
      const response = await fetch('/api/pricing/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartLines: items.map(item => ({
            merchandise: {
              price: {
                amount: item.product.price.toString(),
                currencyCode: item.product.currency || 'INR'
              }
            },
            quantity: item.quantity
          })),
          clerkUserId: userId,
          couponCode: appliedCoupon || undefined,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setPromotionPricing(data.pricing);
      } else {
        console.error('Failed to fetch pricing:', data.error);
        setPromotionPricing(null);
      }
    } catch (error) {
      console.error('Error fetching pricing:', error);
      setPromotionPricing(null);
    } finally {
      setIsPricingLoading(false);
    }
  };

  // Create stable items signature to prevent infinite loops
  const itemsSignature = useMemo(() => {
    return JSON.stringify(items.map(item => ({
      id: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    })));
  }, [items]);

  useEffect(() => {
    // Debounce to prevent rapid calls
    const timeoutId = setTimeout(() => {
      fetchPromotionPricing();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [itemsSignature, appliedCoupon, userId]);



  const validateCoupon = async (code: string) => {
    setIsValidating(true);
    setCouponError(null);
    
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          couponCode: code, 
          subtotal: total * 100,
          cartId: localStorage.getItem('shopify-cart-id')
        }),
      });
      const data = await response.json();
      
      if (response.ok) {
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        
        // Block ALL coupons from stacking with cart discounts (BUY 2 or BUY 3+)
        if (totalItems >= 2) {
          setCouponError("Coupons cannot be combined with cart discounts (BUY 2 or BUY 3+ offers).");
          setAppliedCoupon(null);
          setCouponDiscount(0);
          setIsValidating(false);
          return;
        }
        
        // Set coupon as applied
        setAppliedCoupon(code);
        setShowApplied(true);
        
        if (data.percentOff) {
          const discount = Math.round((total * data.percentOff) / 100);
          setCouponDiscount(discount);
        }
        
        // Refresh pricing with the applied coupon
        await fetchPromotionPricing();
      } else {
        setCouponError(data.error || 'Invalid coupon');
        setAppliedCoupon(null);
        setCouponDiscount(0);
      }
    } catch (err) {
      setCouponError('Failed to validate coupon');
    } finally {
      setIsValidating(false);
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      validateCoupon(couponInput.trim().toUpperCase());
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon('');
    setShowApplied(false);
    setCouponInput('');
    setCouponDiscount(0);
    setCouponError(null);
    localStorage.removeItem('applied_coupon');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-classic-green/50 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-luxury-lg z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-brand-200">
              <h2 className="font-playfair text-heading-xl text-brand-800">Shopping Cart</h2>
              <button
                onClick={closeCart}
                className="w-10 h-10 rounded-full bg-brand-100 hover:bg-brand-200 flex items-center justify-center transition-all duration-300"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-brand-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <ShoppingBag className="w-20 h-20 text-brand-300 mb-4" />
                  <p className="font-playfair text-heading-md text-brand-800 mb-2">Your cart is empty</p>
                  <p className="text-brand-600 font-montserrat text-body-md mb-6">
                    To speed up the checkout process, sign in now.
                  </p>
                  <Link
                    href="/products"
                    onClick={closeCart}
                    className="inline-flex items-center gap-2 bg-bronze-gold hover:bg-soft-bronze text-white px-6 py-3 font-gotham text-ui uppercase tracking-luxury rounded-brand shadow-brand hover:shadow-gold-glow transition-all duration-500"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-4 pb-6 border-b border-brand-200 last:border-0">
                      {/* Product Image */}
                      <Link
                        href={`/products/${item.product.id}`}
                        onClick={closeCart}
                        className="relative w-24 h-24 flex-shrink-0 bg-gradient-to-br from-brand-50 to-white rounded-brand overflow-hidden border border-brand-200"
                      >
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-contain p-2"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <Link
                            href={`/products/${item.product.id}`}
                            onClick={closeCart}
                            className="font-playfair text-body-md text-brand-800 hover:text-bronze-gold transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="ml-2 text-brand-400 hover:text-error transition-colors flex-shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.selectedSize && (
                          <p className="text-body-sm text-brand-500 font-montserrat mb-2">
                            Size: {item.selectedSize}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-brand-200 rounded-brand overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="px-2 py-1 hover:bg-brand-100 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 py-1 text-body-sm font-gotham border-x border-brand-200">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 py-1 hover:bg-brand-100 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <p className="font-gotham text-body-md font-semibold text-classic-green">
                            {formatPrice(item.product.price * item.quantity, item.product.currency)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Gift Item Display - Clean, Minimal Design */}
                  {hasGift && (
                    <div className="flex gap-4 pb-6 border-b border-brand-200 last:border-0 relative">
                      {isGiftLoading ? (
                        <div className="w-24 h-24 flex-shrink-0 bg-brand-50 rounded-brand border border-brand-200 animate-pulse" />
                      ) : giftProduct ? (
                        <>
                          <div className="relative w-24 h-24 flex-shrink-0 bg-brand-50 rounded-brand overflow-hidden border border-brand-200">
                            <Image
                              src={giftProduct.image}
                              alt={giftProduct.name}
                              fill
                              className="object-contain p-2"
                            />
                            <div className="absolute top-0 right-0 bg-amber-500 text-white text-[8px] px-1.5 py-0.5 font-bold uppercase rounded-bl-lg">
                              Gift
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-1">
                              <Gift size={14} className="text-amber-500" />
                              <h4 className="font-playfair text-body-md text-brand-800">{giftProduct.name}</h4>
                            </div>
                            <span className="text-[10px] font-gotham font-bold text-amber-600 tracking-wider uppercase bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 w-fit">Free Gift</span>
                          </div>
                        </>
                      ) : null}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-brand-200 p-6 space-y-4 bg-gradient-to-b from-white to-gray-50/30">
                {/* Active Offers */}
                <div className="space-y-1.5">
                  <div className="offer-banner flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-1.5 rounded-lg text-[11px]">
                    <Tag size={12} className="flex-shrink-0" />
                    <span className="font-gotham font-semibold">BUY 3+ → 30% OFF</span>
                  </div>
                  <div className="offer-banner flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-lg text-[11px]">
                    <Gift size={12} className="flex-shrink-0" />
                    <span className="font-gotham font-semibold">BUY 2 → 10% OFF + FREE GIFT</span>
                  </div>
                </div>

                {/* Promo Code Section - Enhanced Design */}
                <div className="relative">
                  {showApplied && appliedCoupon ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-classic-green/10 to-emerald-50 border-2 border-classic-green/30 rounded-xl shadow-sm"
                    >
                      <div className="flex items-center gap-2.5">
                         <div className="p-1.5 bg-classic-green/20 rounded-lg">
                           <Tag className="w-3.5 h-3.5 text-classic-green" />
                         </div>
                         <div>
                           <p className="text-[10px] text-gray-600 uppercase tracking-wide font-medium">Promo Applied</p>
                           <p className="text-sm font-bold text-classic-green tracking-wide">{appliedCoupon}</p>
                         </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Remove
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="relative">
                      <div className="flex items-center gap-2 p-3 border-2 border-brand-200 rounded-xl bg-white shadow-sm hover:border-classic-green/40 focus-within:border-classic-green focus-within:ring-2 focus-within:ring-classic-green/20 transition-all">
                        <Tag className="w-4 h-4 text-brand-400 flex-shrink-0" />
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Enter promo code"
                          className="flex-1 text-sm font-montserrat uppercase focus:outline-none bg-transparent placeholder:text-gray-400 placeholder:normal-case"
                          disabled={isValidating}
                        />
                        <button
                          type="submit"
                          disabled={isValidating || !couponInput.trim()}
                          className="px-4 py-1.5 bg-classic-green text-white text-xs font-bold uppercase tracking-wide rounded-lg transition-all hover:bg-classic-green/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                        >
                          {isValidating ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <span>Apply</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                      {couponError && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-red-500 mt-1.5 ml-1"
                        >
                          {couponError}
                        </motion.p>
                      )}
                    </form>
                  )}
                </div>

                {/* Promotion Messages */}
                {promotionPricing?.messages && promotionPricing.messages.length > 0 && (
                  <div className="space-y-1.5 mb-3">
                    {promotionPricing.messages.map((message, index) => (
                      <div key={index} className="text-xs text-classic-green font-montserrat bg-classic-green/5 px-2 py-1 rounded">
                        {message}
                      </div>
                    ))}
                  </div>
                )}

                {/* Totals Section - Clean Grid */}
                <div className="space-y-2 py-2">
                  {isPricingLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                    </div>
                  ) : promotionPricing ? (
                    <>
                      <div className="flex items-center justify-between text-xs font-montserrat text-brand-600">
                        <span>Subtotal</span>
                        <span>{formatPrice(promotionPricing.subtotal, items[0].product.currency)}</span>
                      </div>
                      
                      {promotionPricing.discounts.map((discount, index) => (
                        <div key={index} className="flex items-center justify-between text-xs font-bold text-classic-green">
                          <span>{discount.description}</span>
                          <span>-{formatPrice(discount.amount, items[0].product.currency)}</span>
                        </div>
                      ))}

                      <div className="flex items-center justify-between pt-3 border-t border-brand-100">
                        <span className="font-playfair text-lg text-brand-800">Total</span>
                        <span className="font-gotham text-xl font-bold text-classic-green">
                          {formatPrice(promotionPricing.total, items[0].product.currency)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-xs font-montserrat text-brand-600">
                        <span>Subtotal</span>
                        <span>{formatPrice(total, items[0].product.currency)}</span>
                      </div>
                      
                      {couponDiscount > 0 && (
                        <div className="flex items-center justify-between text-xs font-bold text-success">
                          <span>Discount</span>
                          <span>-{formatPrice(couponDiscount, items[0].product.currency)}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-brand-100">
                        <span className="font-playfair text-lg text-brand-800">Total</span>
                        <span className="font-gotham text-xl font-bold text-classic-green">
                          {formatPrice(Math.max(0, total - couponDiscount), items[0].product.currency)}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Minimalist Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="flex items-center justify-center py-3 border border-brand-200 text-brand-600 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-brand-50 transition-colors"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="flex items-center justify-center py-3 bg-bronze-gold text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-soft-bronze shadow-lg shadow-bronze-gold/20 transition-all"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function CartSidebar() {
  return (
    <CartErrorBoundary>
      <CartSidebarContent />
    </CartErrorBoundary>
  );
}
