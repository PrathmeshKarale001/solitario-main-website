'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Trash2, Heart, Minus, Plus, Tag, Gift, Loader2, Bookmark, TruckIcon, Package, ShieldCheck, RefreshCw } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAdmin } from '@/lib/admin-context';
import { formatPrice } from '@/lib/utils';
import { Section, Container } from '@/components/ui';
import ProductRecommendations from '@/components/product/ProductRecommendations';
import { useWishlist } from '@/lib/wishlist-context';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { trackBeginCheckout } from '@/lib/gtm-conversions';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, total, itemCount, addToCart, refreshPrices, isRefreshing } = useCart();
  const { addToWishlist } = useWishlist();
  const [savedForLater, setSavedForLater] = useState<any[]>([]);
  const { userId } = useAuth();
  const router = useRouter();
  const [appliedCoupon, setAppliedCouponState] = useState<string>('');
  const [couponInput, setCouponInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [showApplied, setShowApplied] = useState(false);

  // Refresh prices on mount to ensure we have the latest from Shopify
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    refreshPrices();
    // Only run once on mount, not when refreshPrices changes to avoid infinite loop
  }, []);

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
        body: JSON.stringify({ couponCode: code, subtotal: total * 100 }),
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
        setCouponDiscount(Math.round((total * data.percentOff) / 100));
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

  // Save for Later functionality
  const saveForLater = (item: any) => {
    setSavedForLater([...savedForLater, item]);
    removeFromCart(item.product.id);
  };

  const moveToCart = (item: any) => {
    setSavedForLater(savedForLater.filter(i => i.product.id !== item.product.id));
    addToCart(item.product, item.quantity || 1, item.selectedSize);
  };

  const moveToWishlist = (item: any) => {
    addToWishlist(item.product);
    removeFromCart(item.product.id);
  };

  // Get delivery estimate (mock - would be API call in production)
  const getDeliveryEstimate = () => {
    const today = new Date();
    const deliveryDate = new Date(today.setDate(today.getDate() + 3));
    return deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // No additional charges
  const grandTotal = Math.max(0, total - couponDiscount);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <Container>
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-32 h-32 bg-brand-100 rounded-full flex items-center justify-center mb-8">
              <Heart className="w-16 h-16 text-brand-300" />
            </div>
            <h1 className="font-montserrat font-bold text-display-sm text-brand-800 mb-4">Your Cart is Empty</h1>
            <p className="text-brand-600 font-montserrat text-body-md mb-8 max-w-md">
              Discover our exquisite collection and find the perfect piece for you or your loved ones.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-3 bg-bronze-gold hover:bg-soft-bronze text-white px-8 py-4 font-gotham text-ui uppercase tracking-luxury rounded-brand shadow-brand hover:shadow-gold-glow transition-all duration-500"
            >
              Continue Shopping
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      <Section variant="light" padding="lg">
        <Container>
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-brand-600 hover:text-teal transition-colors font-montserrat mb-6"
            >
              <ChevronLeft className="w-4 h-4" />
              Continue Browsing
            </Link>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="font-montserrat font-bold text-display-md md:text-display-lg text-brand-800 mb-2">Shopping Cart</h1>
                <p className="text-brand-600 font-montserrat text-body-md">
                  {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
              <button
                onClick={() => refreshPrices()}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50"
                title="Refresh prices from Shopify"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Prices'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <motion.div
                  key={`${item.product.id}-${item.selectedSize}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex gap-3 md:gap-6 p-4 md:p-6 bg-white border border-brand-200 rounded-xl md:rounded-brand-xl hover:border-bronze-gold/30 transition-all duration-300 shadow-brand"
                >
                  {/* Product Image */}
                  <Link
                    href={`/products/${item.product.id}`}
                    className="relative w-20 h-20 md:w-32 md:h-32 flex-shrink-0 bg-gradient-to-br from-brand-50 to-white rounded-lg md:rounded-brand-lg overflow-hidden border border-brand-200 hover:border-bronze-gold/50 transition-all duration-300"
                  >
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-contain p-3"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <Link
                          href={`/products/${item.product.id}`}
                          className="font-montserrat font-bold text-heading-md text-brand-800 hover:text-bronze-gold transition-colors mb-1 block"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-body-sm text-brand-500 font-montserrat capitalize">
                          {item.product.category}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-4 text-brand-400 hover:text-error transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {item.selectedSize && (
                      <div className="mb-3">
                        <span className="text-body-sm text-brand-600 font-montserrat">Size: </span>
                        <span className="text-body-sm font-gotham text-brand-800">{item.selectedSize}</span>
                      </div>
                    )}

                    {/* Stock Status & Delivery Estimate */}
                    <div className="mb-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-xs font-medium text-green-600">In Stock</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TruckIcon className="w-3.5 h-3.5 text-brand-600" />
                        <span className="text-xs text-brand-600">Delivery by {getDeliveryEstimate()}</span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-3 mb-3">
                      <button
                        onClick={() => saveForLater(item)}
                        className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-classic-green transition-colors"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        Save for Later
                      </button>
                      <button
                        onClick={() => moveToWishlist(item)}
                        className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-classic-green transition-colors"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        Move to Wishlist
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1">
                        <span className="text-body-sm text-brand-600 font-montserrat mr-2 md:mr-3">Qty:</span>
                        <div className="flex items-center border border-brand-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 md:px-3 py-1.5 md:py-2 hover:bg-brand-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 md:px-4 py-1.5 md:py-2 text-body-sm font-gotham border-x border-brand-200 min-w-[36px] md:min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 md:px-3 py-1.5 md:py-2 hover:bg-brand-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-left sm:text-right">
                        <p className="font-gotham text-heading-md font-semibold text-classic-green">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-body-sm text-brand-500 font-montserrat">
                            {formatPrice(item.product.price)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Gift Item Display - Clean, Minimal Design */}
              {hasGift && (
                <div className="flex gap-3 md:gap-6 p-4 md:p-6 bg-white border border-brand-200 rounded-xl md:rounded-brand-xl relative transition-all duration-300">
                  {isGiftLoading ? (
                    <div className="w-20 h-20 md:w-32 md:h-32 flex-shrink-0 bg-brand-50 rounded-lg md:rounded-brand-lg border border-brand-200 animate-pulse" />
                  ) : giftProduct ? (
                    <>
                      <div className="relative w-20 h-20 md:w-32 md:h-32 flex-shrink-0 bg-brand-50 rounded-lg md:rounded-brand-lg overflow-hidden border border-brand-200">
                        <Image
                          src={giftProduct.image}
                          alt={giftProduct.name}
                          fill
                          className="object-contain p-3"
                        />
                        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] px-2 py-1 font-bold uppercase rounded-bl-xl">
                          Gift
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                          <Gift size={18} className="text-amber-500 shrink-0" />
                          <h3 className="font-montserrat font-bold text-heading-md text-brand-800">{giftProduct.name}</h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-body-sm font-gotham font-bold text-amber-600 tracking-wider uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-100">Free Gift</span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              )}

              {/* Saved for Later Section */}
              {savedForLater.length > 0 && (
                <div className="mt-8 pt-8 border-t border-brand-200">
                  <h2 className="font-montserrat font-bold text-heading-lg text-brand-800 mb-4">
                    Saved for Later ({savedForLater.length})
                  </h2>
                  <div className="space-y-4">
                    {savedForLater.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-4 p-4 bg-brand-50 border border-brand-200 rounded-lg"
                      >
                        <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-brand-800 text-sm mb-1">{item.product.name}</p>
                          <p className="text-classic-green font-semibold text-sm mb-2">
                            {formatPrice(item.product.price)}
                          </p>
                          <div className="flex gap-3">
                            <button
                              onClick={() => moveToCart(item)}
                              className="text-xs text-classic-green hover:underline font-medium"
                            >
                              Move to Cart
                            </button>
                            <button
                              onClick={() => setSavedForLater(savedForLater.filter(i => i.product.id !== item.product.id))}
                              className="text-xs text-error hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-brand-xl p-6 border border-brand-200 shadow-luxury">
                <h2 className="font-montserrat font-bold text-heading-xl text-brand-800 mb-6">Order Summary</h2>

                {/* Active Offers */}
                <div className="space-y-2 mb-6">
                  <div className="offer-banner flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-2 rounded-lg text-xs">
                    <Tag size={14} className="flex-shrink-0" />
                    <span className="font-gotham font-semibold">BUY 3+ → 30% OFF</span>
                  </div>
                  <div className="offer-banner flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-2 rounded-lg text-xs">
                    <Gift size={14} className="flex-shrink-0" />
                    <span className="font-gotham font-semibold">BUY 2 → 10% OFF + FREE GIFT</span>
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-classic-green" />
                    <span className="font-montserrat text-xs font-bold uppercase tracking-wider text-brand-800">Promo Code</span>
                  </div>

                  {!(showApplied && appliedCoupon) ? (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="ENTER CODE"
                        className="flex-1 px-4 py-2 text-xs border border-brand-200 rounded-lg focus:ring-2 focus:ring-classic-green/20 focus:border-classic-green font-montserrat uppercase"
                        disabled={isValidating}
                      />
                      <button
                        type="submit"
                        disabled={isValidating || !couponInput.trim()}
                        className="px-6 py-2 bg-classic-green text-white text-xs font-bold rounded-lg disabled:opacity-50 transition-colors"
                      >
                        {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'APPLY'}
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between bg-classic-green/5 border border-classic-green/20 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-classic-green" />
                        <span className="text-sm font-bold text-classic-green tracking-wide">{appliedCoupon}</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs font-bold text-error hover:underline uppercase"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-xs text-error mt-2 ml-1">{couponError}</p>}
                </div>

                {/* Promotion Messages */}
                {promotionPricing?.messages && promotionPricing.messages.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {promotionPricing.messages.map((message, index) => (
                      <div key={index} className="flex items-start gap-2 bg-classic-green/10 border border-classic-green/30 rounded-lg p-3">
                        <span className="text-classic-green text-sm">✨</span>
                        <p className="text-sm font-montserrat text-classic-green">{message}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-3 mb-6 pt-6 border-t border-brand-100">
                  {isPricingLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-brand-400" />
                    </div>
                  ) : promotionPricing ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-brand-600 font-montserrat">Subtotal</span>
                        <span className="font-gotham text-brand-800">
                          {formatPrice(promotionPricing.subtotal)}
                        </span>
                      </div>
                      
                      {promotionPricing.discounts.map((discount, index) => (
                        <div key={index} className="flex items-center justify-between text-classic-green">
                          <span className="font-montserrat">{discount.description}</span>
                          <span className="font-gotham font-bold">
                            -{formatPrice(discount.amount)}
                          </span>
                        </div>
                      ))}

                      <div className="flex items-center justify-between">
                        <span className="text-brand-600 font-montserrat">Shipping</span>
                        <span className="font-gotham text-classic-green">FREE</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-brand-600 font-montserrat">Subtotal</span>
                        <span className="font-gotham text-brand-800">
                          {formatPrice(total)}
                        </span>
                      </div>
                      
                      {couponDiscount > 0 && (
                        <div className="flex items-center justify-between text-success">
                          <span className="font-montserrat">Coupon Discount</span>
                          <span className="font-gotham font-bold">
                            -{formatPrice(couponDiscount)}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-brand-600 font-montserrat">Shipping</span>
                        <span className="font-gotham text-classic-green">FREE</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-brand-300 mb-2">
                  <span className="font-montserrat font-bold text-heading-md text-brand-800">Total</span>
                  <span className="font-gotham text-heading-xl font-bold text-classic-green">
                    {formatPrice(promotionPricing ? promotionPricing.total : grandTotal)}
                  </span>
                </div>
                <p className="text-body-sm text-brand-500 font-montserrat mb-6">(Prices include GST)</p>

                {/* Checkout Button */}
                <button
                  onClick={() => {
                    // Track Begin Checkout conversion FIRST
                    trackBeginCheckout();
                    // Navigate after a short delay to ensure gtag event fires
                    setTimeout(() => {
                      router.push('/checkout');
                    }, 150);
                  }}
                  className="block w-full text-center bg-bronze-gold hover:bg-soft-bronze text-white px-6 py-4 font-gotham text-ui uppercase tracking-luxury rounded-brand shadow-brand hover:shadow-gold-glow transition-all duration-500 mb-3 cursor-pointer"
                >
                  Proceed to Checkout
                </button>

                {/* Trust Signals */}
                <div className="flex items-center justify-center gap-3 mb-4 pb-4 border-b border-brand-200">
                  <div className="flex items-center gap-1.5 text-xs text-brand-600">
                    <ShieldCheck className="w-4 h-4 text-classic-green" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-brand-600">
                    <TruckIcon className="w-4 h-4 text-classic-green" />
                    <span>Free Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-brand-600">
                    <Package className="w-4 h-4 text-classic-green" />
                    <span>Easy Returns</span>
                  </div>
                </div>

                <p className="text-center text-body-sm text-brand-600 font-montserrat mb-4">
                  Enjoy complimentary delivery and returns on your order.
                </p>

                {/* Need Help */}
                <div className="pt-4 border-t border-brand-200">
                  <p className="text-ui font-gotham uppercase tracking-luxury text-brand-600 mb-3">Need Help?</p>
                  <div className="space-y-2">
                    <Link href="/shipping" className="block text-body-sm text-brand-600 hover:text-teal transition-colors font-montserrat">
                      Delivery & Returns
                    </Link>
                    <Link href="/faq" className="block text-body-sm text-brand-600 hover:text-teal transition-colors font-montserrat">
                      FAQs
                    </Link>
                    <Link href="/stores" className="block text-body-sm text-brand-600 hover:text-teal transition-colors font-montserrat">
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Recommendations */}
          <div className="mt-16">
            <ProductRecommendations 
              title="Products you may like"
              limit={6}
              maxPrice={15000}
              className="max-w-6xl mx-auto"
            />
          </div>
        </Container>
      </Section>
    </div>
  );
}
