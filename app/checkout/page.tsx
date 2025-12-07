'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Lock, CreditCard, Truck } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import { Container } from '@/components/ui';

export default function CheckoutPage() {
  const { items, total } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <Container>
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <h1 className="font-didot text-display-sm text-brand-800 mb-4">No Items in Cart</h1>
            <p className="text-brand-600 font-montserrat text-body-md mb-8">
              Please add items to your cart before proceeding to checkout.
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
    <div className="min-h-screen bg-brand-50 pt-24">
      <Container className="py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-brand-600 hover:text-teal transition-colors font-montserrat mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="font-didot text-display-md md:text-display-lg text-brand-800">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-brand-xl p-6 md:p-8 shadow-brand border border-brand-200">
              <h2 className="font-didot text-heading-xl text-brand-800 mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-body-sm font-gotham text-brand-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 border border-brand-200 rounded-brand focus:outline-none focus:ring-2 focus:ring-bronze-gold/30 focus:border-bronze-gold font-montserrat text-brand-800 placeholder:text-brand-400 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body-sm font-gotham text-brand-700 mb-2">First Name</label>
                    <input
                      type="text"
                      placeholder="John"
                      className="w-full px-4 py-3 border border-brand-200 rounded-brand focus:outline-none focus:ring-2 focus:ring-bronze-gold/30 focus:border-bronze-gold font-montserrat text-brand-800 placeholder:text-brand-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-body-sm font-gotham text-brand-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="w-full px-4 py-3 border border-brand-200 rounded-brand focus:outline-none focus:ring-2 focus:ring-bronze-gold/30 focus:border-bronze-gold font-montserrat text-brand-800 placeholder:text-brand-400 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-body-sm font-gotham text-brand-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border border-brand-200 rounded-brand focus:outline-none focus:ring-2 focus:ring-bronze-gold/30 focus:border-bronze-gold font-montserrat text-brand-800 placeholder:text-brand-400 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-brand-xl p-6 md:p-8 shadow-brand border border-brand-200">
              <h2 className="font-didot text-heading-xl text-brand-800 mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-body-sm font-gotham text-brand-700 mb-2">Address Line 1</label>
                  <input
                    type="text"
                    placeholder="Street address"
                    className="w-full px-4 py-3 border border-brand-200 rounded-brand focus:outline-none focus:ring-2 focus:ring-bronze-gold/30 focus:border-bronze-gold font-montserrat text-brand-800 placeholder:text-brand-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-body-sm font-gotham text-brand-700 mb-2">Address Line 2</label>
                  <input
                    type="text"
                    placeholder="Apartment, suite, etc. (optional)"
                    className="w-full px-4 py-3 border border-brand-200 rounded-brand focus:outline-none focus:ring-2 focus:ring-bronze-gold/30 focus:border-bronze-gold font-montserrat text-brand-800 placeholder:text-brand-400 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-body-sm font-gotham text-brand-700 mb-2">City</label>
                    <input
                      type="text"
                      placeholder="Mumbai"
                      className="w-full px-4 py-3 border border-brand-200 rounded-brand focus:outline-none focus:ring-2 focus:ring-bronze-gold/30 focus:border-bronze-gold font-montserrat text-brand-800 placeholder:text-brand-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-body-sm font-gotham text-brand-700 mb-2">State</label>
                    <input
                      type="text"
                      placeholder="Maharashtra"
                      className="w-full px-4 py-3 border border-brand-200 rounded-brand focus:outline-none focus:ring-2 focus:ring-bronze-gold/30 focus:border-bronze-gold font-montserrat text-brand-800 placeholder:text-brand-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-body-sm font-gotham text-brand-700 mb-2">PIN Code</label>
                    <input
                      type="text"
                      placeholder="400001"
                      className="w-full px-4 py-3 border border-brand-200 rounded-brand focus:outline-none focus:ring-2 focus:ring-bronze-gold/30 focus:border-bronze-gold font-montserrat text-brand-800 placeholder:text-brand-400 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-brand-xl p-6 md:p-8 shadow-brand border border-brand-200">
              <h2 className="font-didot text-heading-xl text-brand-800 mb-6">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                  { id: 'upi', label: 'UPI Payment', icon: Lock },
                  { id: 'cod', label: 'Cash on Delivery', icon: Truck },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`w-full flex items-center gap-4 p-4 border-2 rounded-brand transition-all duration-300 ${
                      paymentMethod === method.id
                        ? 'border-bronze-gold bg-bronze-gold/5'
                        : 'border-brand-200 hover:border-bronze-gold/50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === method.id
                        ? 'border-bronze-gold'
                        : 'border-brand-300'
                    }`}>
                      {paymentMethod === method.id && (
                        <div className="w-3 h-3 bg-bronze-gold rounded-full" />
                      )}
                    </div>
                    <method.icon className="w-5 h-5 text-brand-600" />
                    <span className="font-montserrat text-brand-800">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-brand-xl p-6 border border-brand-200 shadow-brand">
              <h2 className="font-didot text-heading-xl text-brand-800 mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gradient-to-br from-brand-50 to-white rounded-brand overflow-hidden border border-brand-200">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-didot text-body-sm text-brand-800 line-clamp-2 mb-1">
                        {item.product.name}
                      </p>
                      <p className="text-body-sm text-brand-500 font-montserrat">Qty: {item.quantity}</p>
                      {item.selectedSize && (
                        <p className="text-body-sm text-brand-500 font-montserrat">Size: {item.selectedSize}</p>
                      )}
                      <p className="font-gotham text-body-sm font-semibold text-classic-green mt-1">
                        {formatPrice(item.product.price * item.quantity, item.product.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-3 pt-4 border-t border-brand-200 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-brand-600 font-montserrat">Subtotal</span>
                  <span className="font-gotham text-brand-800">
                    {formatPrice(total, items[0].product.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-brand-600 font-montserrat text-body-sm">
                    Delivery
                  </span>
                  <span className="font-gotham text-brand-800">Free</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-brand-300 mb-2">
                <span className="font-didot text-heading-md text-brand-800">Total</span>
                <span className="font-gotham text-heading-xl font-bold text-classic-green">
                  {formatPrice(total, items[0].product.currency)}
                </span>
              </div>
              <p className="text-body-sm text-brand-500 font-montserrat mb-6">(Prices include VAT)</p>

              {/* Place Order Button */}
              <button
                onClick={() => alert('Order placed successfully!')}
                className="w-full bg-bronze-gold hover:bg-soft-bronze text-white px-6 py-4 font-gotham text-ui uppercase tracking-luxury rounded-brand shadow-brand hover:shadow-gold-glow transition-all duration-500"
              >
                Place Order
              </button>

              {/* Secure Notice */}
              <div className="flex items-center justify-center gap-2 mt-4 text-brand-600">
                <Lock className="w-4 h-4" />
                <span className="text-body-sm font-montserrat">Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

