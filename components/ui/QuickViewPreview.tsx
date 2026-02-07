'use client';

import { useEffect, useRef, useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Product } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Eye, X, Ticket } from 'lucide-react';
import Link from 'next/link';
import { isPrebookingProduct, getProductDisplayPrice, getCartItemPrice, getProductButtonText, isProductButtonEnabled } from '@/lib/prebooking';

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
  const [showFullDescription, setShowFullDescription] = useState(false);
  
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

  // Reset description state when product changes
  useEffect(() => {
    setShowFullDescription(false);
  }, [product?.id]);

  // Track Quick View with GTM and Meta Pixel
  useEffect(() => {
    if (isVisible && product) {
      const trackingPrice = getCartItemPrice(product);
      
      // Google Tag Manager tracking
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'view_item',
          ecommerce: {
            items: [{
              item_id: product.id,
              item_name: product.name,
              item_category: product.category,
              price: trackingPrice,
              currency: product.currency || 'INR',
            }]
          },
          event_category: 'Quick View',
          event_label: product.name,
        });
      }

      // Meta Pixel tracking
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'ViewContent', {
          content_ids: [product.id],
          content_name: product.name,
          content_category: product.category,
          content_type: 'product',
          value: trackingPrice,
          currency: product.currency || 'INR',
        });
      }
    }
  }, [isVisible, product]);

  if (!isVisible) return null;

  // Check if prebooking product
  const isPrebook = isPrebookingProduct(product);
  const displayPrice = isPrebook ? getProductDisplayPrice(product) : formatPrice(product.price, product.currency);
  const buttonEnabled = isProductButtonEnabled(product);
  const buttonText = getProductButtonText(product, false);

  // Description handling - strip HTML and truncate
  const rawDescription = product.description?.replace(/<[^>]*>/g, '').split('Specifications')[0].trim() || '';
  const maxLength = 80;
  const shouldTruncate = rawDescription.length > maxLength;
  const truncatedDescription = shouldTruncate && !showFullDescription 
    ? rawDescription.slice(0, maxLength).trim() + '...' 
    : rawDescription;

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
            {isPrebook && (
              <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white px-3 py-1 text-[10px] font-gotham uppercase tracking-[0.15em] rounded-full shadow-lg flex items-center gap-1">
                <Ticket className="w-3 h-3" />
                Prebook
              </div>
            )}
            {!isPrebook && product.featured && (
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
              <h3 className="font-montserrat font-bold text-xl text-gray-900 mt-1 leading-tight" style={{ letterSpacing: '-0.01em' }}>
                {product.name}
              </h3>
              <div className="mt-2">
                <p className="text-xs text-gray-600 leading-relaxed font-montserrat">
                  {truncatedDescription}
                  {shouldTruncate && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-bronze-gold hover:text-bronze-gold/80 font-medium ml-1 transition-colors"
                    >
                      {showFullDescription ? 'Show less' : 'View more'}
                    </button>
                  )}
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              {isPrebook ? (
                <p className="font-gotham text-lg font-semibold text-purple-600 tracking-wide">
                  {displayPrice}
                </p>
              ) : (
                <p className="font-gotham text-xl font-semibold text-classic-green tracking-wide">
                  {displayPrice}
                </p>
              )}
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
                    const trackingPrice = getCartItemPrice(product);
                    // Track Add to Cart event
                    if (typeof window !== 'undefined' && (window as any).dataLayer) {
                      (window as any).dataLayer.push({
                        event: 'add_to_cart',
                        ecommerce: {
                          items: [{
                            item_id: product.id,
                            item_name: product.name,
                            item_category: product.category,
                            price: trackingPrice,
                            currency: product.currency || 'INR',
                            quantity: 1,
                          }]
                        },
                        event_category: isPrebook ? 'Quick View Prebook' : 'Quick View Add to Cart',
                        event_label: product.name,
                      });
                    }
                    if (typeof window !== 'undefined' && (window as any).fbq) {
                      (window as any).fbq('track', 'AddToCart', {
                        content_ids: [product.id],
                        content_name: product.name,
                        content_type: 'product',
                        value: trackingPrice,
                        currency: product.currency || 'INR',
                      });
                    }
                    onAddToCart(product);
                    onClose();
                  }}
                  disabled={!buttonEnabled}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 font-gotham text-xs uppercase tracking-[0.1em] ${
                    isPrebook
                      ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg'
                      : buttonEnabled
                        ? 'bg-bronze-gold hover:bg-bronze-gold/90 text-white shadow-luxury hover:shadow-glow'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isPrebook ? <Ticket className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                  {buttonText}
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
