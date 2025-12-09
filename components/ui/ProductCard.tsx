'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, ArrowRight } from 'lucide-react';
import { Product } from '@/lib/data';
import { formatPrice, cn } from '@/lib/utils';

export interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/products/${product.id}`} className="block group">
      <motion.div
        className="relative bg-white rounded-lg sm:rounded-xl overflow-hidden cursor-pointer border border-gray-100 hover:border-bronze-gold/30"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        {/* Compact Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {/* Main Image */}
          <motion.div
            className="absolute inset-0"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={product.image || '/images/placeholder.svg'}
              alt={product.name}
              fill
              className="object-contain p-2 sm:p-4"
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 25vw"
            />
          </motion.div>

          {/* Featured Badge - Compact */}
          {product.featured && (
            <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10">
              <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-bronze-gold text-white text-[8px] sm:text-[10px] font-gotham uppercase tracking-wider rounded-full">
                Featured
              </span>
            </div>
          )}

          {/* Quick View Button - Desktop only */}
          <motion.div
            className="absolute inset-0 hidden sm:flex items-center justify-center z-10 bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {onQuickView && (
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView(product);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white/95 text-classic-green rounded-full font-gotham text-xs uppercase tracking-wider"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="w-4 h-4" />
                Quick View
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Compact Product Info */}
        <div className="p-2 sm:p-3">
          {/* Category - Hidden on mobile for space */}
          <span className="hidden sm:block text-[8px] uppercase tracking-wider font-gotham text-bronze-gold/70 mb-1">
            {product.category}
          </span>

          {/* Product Name */}
          <h3 className="font-playfair text-xs sm:text-sm text-gray-900 line-clamp-1 mb-0.5 sm:mb-1 group-hover:text-bronze-gold transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <p className="font-gotham text-xs sm:text-sm font-semibold text-classic-green">
            {formatPrice(product.price, product.currency)}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}


