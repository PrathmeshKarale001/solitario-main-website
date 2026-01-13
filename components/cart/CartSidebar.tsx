'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Minus, Plus, Trash2, Tag, Gift, Loader2 } from 'lucide-react';
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
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-4 p-4 bg-amber-50/50 rounded-xl border border-amber-200/50 border-dashed"
                        >
                          <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-amber-100 shadow-sm animate-pulse">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-50"></div>
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="font-playfair text-sm font-semibold text-brand-800 animate-pulse bg-gray-200 rounded w-3/4 h-4"></h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold uppercase">FREE</span>
                            </div>
                          </div>
                        </motion.div>
                      ) : giftProduct ? (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-4 p-4 bg-amber-50/50 rounded-xl border border-amber-200/50 border-dashed"
                        >
                          <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-amber-100 shadow-sm">
                             <Image
                              src={giftProduct.image}
                              alt={giftProduct.name}
                              fill
                              className="object-contain p-1"
                              onError={(e) => {
                                // Fallback if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200&h=200&fit=crop&q=80';
                              }}
                            />
                            <div className="absolute top-0 right-0 bg-amber-500 text-white text-[8px] px-1.5 py-0.5 font-bold uppercase tracking-tighter">
                              Gift
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="font-playfair text-sm font-semibold text-brand-800">{giftProduct.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                               <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold uppercase">FREE</span>
                               <span className="text-xs text-gray-400 line-through">
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
              <div className="border-t border-brand-200 p-6 space-y-4 bg-white">
                {/* Promo Code Section - Slimmer Design */}
                <div className="border border-brand-100 rounded-xl overflow-hidden shadow-sm">
                  {!appliedCoupon ? (
                    <form onSubmit={handleApplyCoupon} className="flex h-10">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="PROMO CODE"
                        className="flex-1 px-4 text-xs font-montserrat uppercase focus:outline-none bg-gray-50/50"
                        disabled={isValidating}
                      />
                      <button
                        type="submit"
                        disabled={isValidating || !couponInput.trim()}
                        className="px-6 bg-classic-green text-white text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-classic-green/90 disabled:opacity-50"
                      >
                        {isValidating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'APPLY'}
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between bg-classic-green/5 px-4 py-2.5">
                      <div className="flex items-center gap-2">
                         <Tag className="w-3 h-3 text-classic-green" />
                         <span className="text-xs font-bold text-classic-green tracking-wide">{appliedCoupon}</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-[10px] font-bold text-error/70 hover:text-error uppercase tracking-tighter"
                      >
                        Remove
                      </button>
                    </div>
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

