'use client';

import { useEffect, useRef, useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Product } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Eye, X } from 'lucide-react';
import Link from 'next/link';

export interface QuickViewPreviewProps {
  product: Product;
  isVisible: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
  onFullView?: (product: Product) => void;
  position?: { x: number; y: number };
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const QuickViewPreview = forwardRef<HTMLDivElement, QuickViewPreviewProps>(({
  product,
  isVisible,
  onClose,
  onAddToCart,
  onFullView,
  position,
  onMouseEnter,
  onMouseLeave,
}, ref) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position || { x: 0, y: 0 });
  
  // Combine refs
  useEffect(() => {
    if (typeof ref === 'function') {
      ref(previewRef.current);
    } else if (ref) {
      ref.current = previewRef.current;
    }
  }, [ref]);

  useEffect(() => {
    if (isVisible && previewRef.current && position) {
      const rect = previewRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let x = position.x;
      let y = position.y;

      // Adjust horizontal position if preview goes off-screen
      if (x + rect.width > viewportWidth) {
        x = viewportWidth - rect.width - 20;
      }
      if (x < 20) {
        x = 20;
      }

      // Adjust vertical position if preview goes off-screen
      if (y + rect.height > viewportHeight) {
        y = viewportHeight - rect.height - 20;
      }
      if (y < 20) {
        y = 20;
      }

      setAdjustedPosition({ x, y });
    }
  }, [isVisible, position]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={previewRef}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed z-50 w-80 bg-white rounded-lg shadow-2xl border border-gray-200/50 overflow-hidden"
          style={{
            left: `${adjustedPosition.x}px`,
            top: `${adjustedPosition.y}px`,
            pointerEvents: 'auto',
          }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-gray-100 transition-colors shadow-sm"
            aria-label="Close preview"
          >
            <X className="w-3.5 h-3.5 text-gray-600" />
          </button>

          {/* Product Image */}
          <div className="relative aspect-square bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
            <Image
              src={product.image || '/images/placeholder.svg'}
              alt={product.name}
              fill
              className="object-contain p-6"
            />
            {product.featured && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-bronze-gold to-bronze-gold/80 text-white px-3 py-1 text-[10px] font-gotham uppercase tracking-[0.2em] rounded-full shadow-lg">
                Featured
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-5 space-y-3 bg-white">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-gotham text-gray-400">
                {product.category.toUpperCase()}
              </span>
              <h3 className="font-playfair text-xl text-gray-900 mt-1 leading-tight" style={{ letterSpacing: '-0.01em' }}>
                {product.name}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-montserrat mt-2 line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <p className="font-gotham text-xl font-semibold text-classic-green tracking-wide">
                {formatPrice(product.price, product.currency)}
              </p>
            </div>

            {/* Quick Features */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-1.5 h-1.5 bg-bronze-gold rounded-full" />
                <span className="font-montserrat">Lab-grown diamonds</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-1.5 h-1.5 bg-bronze-gold rounded-full" />
                <span className="font-montserrat">IGI Certified</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3">
              {onFullView && (
                <Link
                  href={`/products/${product.id}`}
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-bronze-gold text-bronze-gold rounded-full hover:bg-bronze-gold hover:text-white transition-all duration-300 font-gotham text-xs uppercase tracking-[0.1em]"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Link>
              )}
              {onAddToCart && (
                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-bronze-gold hover:bg-bronze-gold/90 text-white rounded-full transition-all duration-300 font-gotham text-xs uppercase tracking-[0.1em] shadow-luxury hover:shadow-glow"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

QuickViewPreview.displayName = 'QuickViewPreview';

export default QuickViewPreview;

