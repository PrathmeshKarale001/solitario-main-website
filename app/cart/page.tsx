'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Trash2, Heart, Minus, Plus, Tag, Gift, Loader2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAdmin } from '@/lib/admin-context';
import { formatPrice } from '@/lib/utils';
import { Section, Container } from '@/components/ui';
import ProductRecommendations from '@/components/product/ProductRecommendations';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, total, itemCount } = useCart();
  const { appliedCoupon, setAppliedCoupon } = useAdmin();
  const [couponInput, setCouponInput] = useState(appliedCoupon || '');
  const [isValidating, setIsValidating] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [giftProduct, setGiftProduct] = useState<{ name: string; image: string; price: number } | null>(null);
  const [isGiftLoading, setIsGiftLoading] = useState(false);

  // Auto-calculate gift
  const hasGift = itemCount >= 2;

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
            <h1 className="font-playfair text-display-sm text-brand-800 mb-4">Your Cart is Empty</h1>
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
            <h1 className="font-playfair text-display-md md:text-display-lg text-brand-800 mb-2">Shopping Cart</h1>
            <p className="text-brand-600 font-montserrat text-body-md">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
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
                          className="font-playfair text-heading-md text-brand-800 hover:text-bronze-gold transition-colors mb-1 block"
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

              {/* Gift Item Display */}
              {hasGift && (
                <>
                  {isGiftLoading ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 md:gap-6 p-4 md:p-6 bg-amber-50/30 border border-amber-200/50 border-dashed rounded-xl md:rounded-brand-xl shadow-sm"
                    >
                      <div className="relative w-20 h-20 md:w-32 md:h-32 flex-shrink-0 bg-gray-100 rounded-lg md:rounded-brand-lg overflow-hidden border border-amber-100 shadow-sm animate-pulse">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-50"></div>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h3 className="font-playfair text-heading-md text-brand-800 mb-1 animate-pulse bg-gray-200 rounded w-1/2 h-6"></h3>
                        <p className="text-body-sm text-amber-600 font-montserrat mb-3">
                          Automatically added for buying 2+ items!
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">FREE</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : giftProduct ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 md:gap-6 p-4 md:p-6 bg-amber-50/30 border border-amber-200/50 border-dashed rounded-xl md:rounded-brand-xl shadow-sm"
                    >
                      <div className="relative w-20 h-20 md:w-32 md:h-32 flex-shrink-0 bg-white rounded-lg md:rounded-brand-lg overflow-hidden border border-amber-100 shadow-sm">
                        <Image
                          src={giftProduct.image}
                          alt={giftProduct.name}
                          fill
                          className="object-contain p-3"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop&q=80';
                          }}
                        />
                        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] md:text-xs px-2 py-1 font-bold uppercase tracking-wider">
                          Gift
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h3 className="font-playfair text-heading-md text-brand-800 mb-1">{giftProduct.name}</h3>
                        <p className="text-body-sm text-amber-600 font-montserrat mb-3">
                          Automatically added for buying 2+ items!
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">FREE</span>
                          <span className="text-body-md text-gray-400 line-through font-gotham">
                            {formatPrice(giftProduct.price)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-brand-xl p-6 border border-brand-200 shadow-luxury">
                <h2 className="font-playfair text-heading-xl text-brand-800 mb-6">Order Summary</h2>

                {/* Coupon Code Section */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-classic-green" />
                    <span className="font-montserrat text-xs font-bold uppercase tracking-wider text-brand-800">Promo Code</span>
                  </div>

                  {!appliedCoupon ? (
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

                <div className="space-y-3 mb-6 pt-6 border-t border-brand-100">
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
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-brand-300 mb-2">
                  <span className="font-playfair text-heading-md text-brand-800">Total</span>
                  <span className="font-gotham text-heading-xl font-bold text-classic-green">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
                <p className="text-body-sm text-brand-500 font-montserrat mb-6">(Prices include GST)</p>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="block w-full text-center bg-bronze-gold hover:bg-soft-bronze text-white px-6 py-4 font-gotham text-ui uppercase tracking-luxury rounded-brand shadow-brand hover:shadow-gold-glow transition-all duration-500 mb-3"
                >
                  Proceed to Checkout
                </Link>

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
