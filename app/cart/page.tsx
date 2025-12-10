'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Trash2, Heart, Minus, Plus } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import { Section, Container } from '@/components/ui';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, total } = useCart();

  // No additional charges
  const grandTotal = total;

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <motion.div
                  key={`${item.product.id}-${item.selectedSize}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex gap-6 p-6 bg-white border border-brand-200 rounded-brand-xl hover:border-bronze-gold/30 transition-all duration-300 shadow-brand"
                >
                  {/* Product Image */}
                  <Link
                    href={`/products/${item.product.id}`}
                    className="relative w-32 h-32 flex-shrink-0 bg-gradient-to-br from-brand-50 to-white rounded-brand-lg overflow-hidden border border-brand-200 hover:border-bronze-gold/50 transition-all duration-300"
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
                        <span className="text-body-sm text-brand-600 font-montserrat mr-3">Qty:</span>
                        <div className="flex items-center border border-brand-200 rounded-brand overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-3 py-2 hover:bg-brand-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-4 py-2 text-body-sm font-gotham border-x border-brand-200 min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-3 py-2 hover:bg-brand-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
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
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-brand-50 rounded-brand-xl p-6 border border-brand-200">
                <h2 className="font-playfair text-heading-xl text-brand-800 mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-brand-600 font-montserrat">Subtotal</span>
                    <span className="font-gotham text-brand-800">
                      {formatPrice(total)}
                    </span>
                  </div>
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
                  href="/shop-checkout"
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
        </Container>
      </Section>
    </div>
  );
}
