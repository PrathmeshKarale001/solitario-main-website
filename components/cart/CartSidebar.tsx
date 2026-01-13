'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Minus, Plus, Trash2, Tag, Gift, Loader2, ChevronRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAdmin } from '@/lib/admin-context';
import { formatPrice } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function CartSidebar() {
  const { items, isCartOpen, closeCart, updateQuantity, removeFromCart, total, itemCount } = useCart();
  const { appliedCoupon, setAppliedCoupon } = useAdmin();
  const [couponInput, setCouponInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const [giftProduct, setGiftProduct] = useState<{ name: string; image: string; price: number } | null>(null);
  const [isGiftLoading, setIsGiftLoading] = useState(false);

  // Auto-calculate gift and coupon discounts
  const hasGift = itemCount >= 2;

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

  useEffect(() => {
    if (appliedCoupon) {
      validateCoupon(appliedCoupon);
    }
  }, [total, appliedCoupon]);

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
        setAppliedCoupon(code);
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
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponDiscount(0);
    setCouponError(null);
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

                  {/* Gift Item Display */}
                  {hasGift && (
                    <>
                      {isGiftLoading ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="relative flex gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-300/40 shadow-sm overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-200/20 rounded-full blur-2xl"></div>
                          <div className="relative w-16 h-16 flex-shrink-0 bg-white/80 rounded-lg overflow-hidden border border-amber-200 animate-pulse">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-50"></div>
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center relative z-10">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                            <span className="inline-flex items-center gap-1 text-[10px] bg-amber-400 text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wide w-fit shadow-sm">
                              <Gift className="w-3 h-3" />
                              FREE GIFT
                            </span>
                          </div>
                        </motion.div>
                      ) : giftProduct ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="relative flex gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-300/40 shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
                        >
                          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-200/20 rounded-full blur-2xl group-hover:bg-amber-300/30 transition-colors"></div>
                          <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-lg overflow-hidden border-2 border-amber-200 shadow-sm">
                             <Image
                              src={giftProduct.image}
                              alt={giftProduct.name}
                              fill
                              className="object-contain p-1.5 group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=200&fit=crop&q=80';
                              }}
                            />
                            <div className="absolute -top-1 -right-1 bg-gradient-to-br from-amber-500 to-orange-500 text-white text-[8px] px-1.5 py-0.5 font-bold uppercase tracking-tight rounded-full shadow-md">
                              Gift
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center relative z-10">
                            <h4 className="font-playfair text-sm font-semibold text-gray-800 mb-1 line-clamp-1">{giftProduct.name}</h4>
                            <div className="flex items-center gap-2">
                               <span className="inline-flex items-center gap-1 text-[10px] bg-gradient-to-r from-amber-400 to-orange-400 text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wide shadow-sm">
                                  <Gift className="w-3 h-3" />
                                  FREE
                               </span>
                               <span className="text-xs text-gray-500 line-through">
                                  {formatPrice(giftProduct.price, '₹')}
                               </span>
                            </div>
                          </div>
                        </motion.div>
                      ) : null}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-brand-200 p-6 space-y-4 bg-gradient-to-b from-white to-gray-50/30">
                {/* Promo Code Section - Enhanced Design */}
                <div className="relative">
                  {!appliedCoupon ? (
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
                  ) : (
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
                  )}
                </div>
                {couponError && <p className="text-[10px] text-error px-1 font-medium">{couponError}</p>}

                {/* Totals Section - Clean Grid */}
                <div className="space-y-2 py-2">
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

