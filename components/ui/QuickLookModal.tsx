'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';

export interface QuickLookModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function QuickLookModal({ isOpen, onClose, product }: QuickLookModalProps) {
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
      // Optional: Show a success message or animation
    }
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-luxury hover:scale-110"
              aria-label="Close quick look"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Product Image Section */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
                <Image
                  src={product.image || '/images/placeholder.svg'}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                  priority
                />
                
                {/* Featured Badge */}
                {product.featured && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-bronze-gold to-bronze-gold/80 text-white px-4 py-1.5 text-xs font-gotham uppercase tracking-[0.2em] rounded-full shadow-luxury-lg border border-white/20 backdrop-blur-sm">
                    Featured
                  </div>
                )}

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-bronze-gold rounded-full shadow-glow animate-pulse" />
                <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-bronze-gold/60 rounded-full shadow-glow animate-pulse" style={{ animationDelay: '0.2s' }} />
              </div>

              {/* Product Info Section */}
              <div className="p-6 md:p-8 flex flex-col justify-between bg-white">
                <div className="space-y-4">
                  {/* Category */}
                  <span className="inline-block text-xs uppercase tracking-[0.25em] font-gotham text-gray-400">
                    {product.category.toUpperCase()}
                  </span>

                  {/* Product Name */}
                  <h2 className="font-playfair text-3xl md:text-4xl text-gray-900 leading-tight" style={{ letterSpacing: '-0.01em' }}>
                    {product.name}
                  </h2>

                  {/* Description - Strip HTML tags */}
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed font-montserrat">
                    {product.description?.replace(/<[^>]*>/g, '').split('Specifications')[0].trim() || product.description}
                  </p>

                  {/* Price */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 flex-wrap">
                      {product.comparePrice ? (
                        <>
                          <p className="font-gotham text-2xl md:text-3xl font-semibold text-classic-green tracking-wide">
                            {formatPrice(product.price, product.currency)}
                          </p>
                          <p className="font-gotham text-lg text-gray-400 line-through">
                            {formatPrice(product.comparePrice, product.currency)}
                          </p>
                          <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-600 text-xs font-gotham font-semibold rounded">
                            {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                          </span>
                        </>
                      ) : (
                        <p className="font-gotham text-2xl md:text-3xl font-semibold text-classic-green tracking-wide">
                          {formatPrice(product.price, product.currency)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-bronze-gold rounded-full flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-montserrat">Lab-grown diamonds</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-bronze-gold rounded-full flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-montserrat">IGI Certified</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-bronze-gold rounded-full flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-montserrat">Vermeil gold</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-bronze-gold rounded-full flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-montserrat">Lifetime Exchange</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 space-y-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-bronze-gold hover:bg-bronze-gold/90 text-white px-6 py-3.5 rounded-lg font-gotham text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-luxury hover:shadow-glow flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  
                  <Link
                    href={`/products/${product.id}`}
                    onClick={onClose}
                    className="block w-full border-2 border-gray-300 hover:border-bronze-gold text-gray-700 hover:text-bronze-gold px-6 py-3.5 rounded-lg font-gotham text-sm uppercase tracking-[0.2em] transition-all duration-300 text-center"
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

