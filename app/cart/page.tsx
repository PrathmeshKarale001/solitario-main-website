'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Trash2, Heart, Minus, Plus } from 'lucide-react';
import { useShopifyCart } from '@/lib/shopify-cart-context';
import { shopifyLineToCartItem } from '@/lib/shopify-cart-context';
import { formatPrice } from '@/lib/utils';
import { Section, Container } from '@/components/ui';
import { useIsShopSubdomain } from '@/lib/use-shop-subdomain';

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeFromCart, total, checkoutUrl } = useShopifyCart();
  const isShopSubdomain = useIsShopSubdomain();

  if (!cart || cart.lines.edges.length === 0) {
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
              {cart.lines.edges.length} {cart.lines.edges.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.lines.edges.map((edge) => {
                const line = edge.node;
                const cartItem = shopifyLineToCartItem(line);
                return (
                  <motion.div
                    key={line.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex gap-6 p-6 bg-white border border-brand-200 rounded-brand-xl hover:border-bronze-gold/30 transition-all duration-300 shadow-brand"
                  >
                    {/* Product Image */}
                    <Link
                      href={`/products/${cartItem.product.id}`}
                      className="relative w-32 h-32 flex-shrink-0 bg-gradient-to-br from-brand-50 to-white rounded-brand-lg overflow-hidden border border-brand-200 hover:border-bronze-gold/50 transition-all duration-300"
                    >
                      <Image
                        src={cartItem.product.image}
                        alt={cartItem.product.name}
                        fill
                        className="object-contain p-3"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <Link
                            href={`/products/${cartItem.product.id}`}
                            className="font-playfair text-heading-md text-brand-800 hover:text-bronze-gold transition-colors mb-1 block"
                          >
                            {cartItem.product.name}
                          </Link>
                          <p className="text-body-sm text-brand-500 font-montserrat capitalize">
                            {cartItem.product.category}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(line.id)}
                          className="ml-4 text-brand-400 hover:text-error transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {cartItem.selectedSize && (
                        <div className="mb-3">
                          <span className="text-body-sm text-brand-600 font-montserrat">Ring Size: </span>
                          <span className="text-body-sm font-gotham text-brand-800">{cartItem.selectedSize}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1">
                          <span className="text-body-sm text-brand-600 font-montserrat mr-3">Qty:</span>
                          <div className="flex items-center border border-brand-200 rounded-brand overflow-hidden">
                            <button
                              onClick={() => updateQuantity(line.id, line.quantity - 1)}
                              className="px-3 py-2 hover:bg-brand-100 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-4 py-2 text-body-sm font-gotham border-x border-brand-200 min-w-[40px] text-center">
                              {line.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(line.id, line.quantity + 1)}
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
                            {formatPrice(parseFloat(line.cost.totalAmount.amount), line.cost.totalAmount.currencyCode)}
                          </p>
                          {line.quantity > 1 && (
                            <p className="text-body-sm text-brand-500 font-montserrat">
                              {formatPrice(parseFloat(line.cost.amountPerQuantity.amount), line.cost.amountPerQuantity.currencyCode)} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-brand-50 rounded-brand-xl p-6 border border-brand-200">
                <h2 className="font-playfair text-heading-xl text-brand-800 mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-brand-600 font-montserrat">Subtotal</span>
                    <span className="font-gotham text-brand-800">
                      {formatPrice(parseFloat(cart.estimatedCost.subtotalAmount.amount), cart.estimatedCost.subtotalAmount.currencyCode)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-brand-600 font-montserrat">
                      Free Standard Delivery
                      <br />
                      <span className="text-body-sm">(3 working days)</span>
                    </span>
                    <span className="font-gotham text-brand-800">
                      {formatPrice(parseFloat(cart.estimatedCost.totalTaxAmount.amount), cart.estimatedCost.totalTaxAmount.currencyCode)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-brand-300 mb-2">
                  <span className="font-playfair text-heading-md text-brand-800">Total</span>
                  <span className="font-gotham text-heading-xl font-bold text-classic-green">
                    {formatPrice(parseFloat(cart.estimatedCost.totalAmount.amount), cart.estimatedCost.totalAmount.currencyCode)}
                  </span>
                </div>
                <p className="text-body-sm text-brand-500 font-montserrat mb-6">(Prices include VAT)</p>

                {/* Checkout Button */}
                {isShopSubdomain ? (
                  <Link
                    href="/shop-checkout"
                    className="block w-full text-center bg-bronze-gold hover:bg-soft-bronze text-white px-6 py-4 font-gotham text-ui uppercase tracking-luxury rounded-brand shadow-brand hover:shadow-gold-glow transition-all duration-500 mb-3"
                  >
                    Proceed to Checkout
                  </Link>
                ) : checkoutUrl ? (
                  <Link
                    href={checkoutUrl}
                    className="block w-full text-center bg-bronze-gold hover:bg-soft-bronze text-white px-6 py-4 font-gotham text-ui uppercase tracking-luxury rounded-brand shadow-brand hover:shadow-gold-glow transition-all duration-500 mb-3"
                  >
                    Checkout
                  </Link>
                ) : (
                  <button
                    disabled
                    className="block w-full text-center bg-brand-200 text-brand-500 px-6 py-4 font-gotham text-ui uppercase tracking-luxury rounded-brand mb-3 cursor-not-allowed"
                  >
                    Loading Checkout...
                  </button>
                )}

                <p className="text-center text-body-sm text-brand-600 font-montserrat mb-4">
                  Enjoy complimentary delivery and returns on your order.
                </p>

                {/* Need Help */}
                <div className="pt-4 border-t border-brand-200">
                  <p className="text-ui font-gotham uppercase tracking-luxury text-brand-600 mb-3">Need Help?</p>
                  <div className="space-y-2">
                    <Link href="/delivery" className="block text-body-sm text-brand-600 hover:text-teal transition-colors font-montserrat">
                      Delivery & Returns
                    </Link>
                    <Link href="/care" className="block text-body-sm text-brand-600 hover:text-teal transition-colors font-montserrat">
                      Gemstone Care
                    </Link>
                    <Link href="/contact" className="block text-body-sm text-brand-600 hover:text-teal transition-colors font-montserrat">
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

