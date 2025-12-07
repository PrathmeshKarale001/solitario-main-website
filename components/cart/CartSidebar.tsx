'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';

export default function CartSidebar() {
  const { items, isCartOpen, closeCart, updateQuantity, removeFromCart, total, itemCount } = useCart();

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
              <h2 className="font-didot text-heading-xl text-brand-800">Shopping Cart</h2>
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
                  <p className="font-didot text-heading-md text-brand-800 mb-2">Your cart is empty</p>
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
                            className="font-didot text-body-md text-brand-800 hover:text-bronze-gold transition-colors line-clamp-2"
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
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-brand-200 p-6 space-y-4 bg-brand-50">
                {/* Subtotal */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-brand-600 font-montserrat">Subtotal</span>
                  <span className="font-gotham text-heading-sm font-semibold text-brand-800">
                    {formatPrice(total, items[0].product.currency)}
                  </span>
                </div>

                {/* Free Delivery Notice */}
                <p className="text-body-sm text-brand-500 font-montserrat">
                  Free Standard Delivery (3 working days) - ₹0.00
                </p>

                {/* Total */}
                <div className="flex items-center justify-between pt-3 border-t border-brand-300">
                  <span className="font-didot text-heading-sm text-brand-800">Estimated Total</span>
                  <span className="font-gotham text-heading-lg font-bold text-classic-green">
                    {formatPrice(total, items[0].product.currency)}
                  </span>
                </div>

                <p className="text-body-sm text-brand-500 font-montserrat">(Prices include VAT)</p>

                {/* Actions */}
                <div className="space-y-3 pt-4">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="block w-full text-center bg-classic-green hover:bg-classic-green/90 text-white px-6 py-4 font-gotham text-ui uppercase tracking-luxury rounded-brand shadow-brand transition-all duration-500"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="block w-full text-center bg-bronze-gold hover:bg-soft-bronze text-white px-6 py-4 font-gotham text-ui uppercase tracking-luxury rounded-brand shadow-brand hover:shadow-gold-glow transition-all duration-500"
                  >
                    Checkout
                  </Link>
                </div>

                {/* Help Links */}
                <div className="pt-4 border-t border-brand-200">
                  <p className="text-ui font-gotham uppercase tracking-luxury text-brand-600 mb-3">Need Help?</p>
                  <div className="space-y-2">
                    <Link href="/delivery" className="block text-body-sm text-brand-600 hover:text-teal transition-colors font-montserrat">
                      Delivery & Returns
                    </Link>
                    <Link href="/care" className="block text-body-sm text-brand-600 hover:text-teal transition-colors font-montserrat">
                      Gemstone Care
                    </Link>
                    <Link href="/privacy" className="block text-body-sm text-brand-600 hover:text-teal transition-colors font-montserrat">
                      Privacy Policy
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

