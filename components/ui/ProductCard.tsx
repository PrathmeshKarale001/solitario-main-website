'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Heart, Flame, Sparkles, Clock } from 'lucide-react';
import { Product } from '@/lib/data';
import { formatPrice, cn } from '@/lib/utils';
import { useWishlist } from '@/lib/wishlist-context';

export interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  darkMode?: boolean;
}

export default function ProductCard({ product, onQuickView, onAddToCart, darkMode = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    setIsInWishlist(wishlist.some(item => item.id === product.id));
  }, [wishlist, product.id]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Link href={`/products/${product.id}`} className="block group">
      <motion.div
        className={cn(
          "relative rounded-lg sm:rounded-xl overflow-hidden cursor-pointer border hover:border-bronze-gold/30",
          darkMode 
            ? "bg-[#111] border-[#2a2a2a] hover:bg-[#161616]" 
            : "bg-white border-gray-100"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        {/* Compact Image Container */}
        <div className={cn(
          "relative aspect-square overflow-hidden",
          darkMode ? "bg-[#111]" : "bg-gray-50"
        )}>
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

          {/* Product Badges - Industry Standard */}
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10 flex flex-col gap-1">
            {/* Bestseller Badge */}
            {product.featured && (
              <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[8px] sm:text-[10px] font-gotham uppercase tracking-wider rounded-full shadow-sm">
                <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Bestseller
              </span>
            )}
            {/* New Arrival Badge - Show for products created in last 30 days */}
            {(product as any).createdAt && new Date((product as any).createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && !product.featured && (
              <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[8px] sm:text-[10px] font-gotham uppercase tracking-wider rounded-full shadow-sm">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                New
              </span>
            )}
            {/* Limited Stock Badge */}
            {product.inStock && (product as any).quantity && (product as any).quantity <= 5 && (product as any).quantity > 0 && (
              <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[8px] sm:text-[10px] font-gotham uppercase tracking-wider rounded-full shadow-sm">
                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Only {(product as any).quantity} left
              </span>
            )}
          </div>

          {/* Wishlist Heart Icon */}
          <motion.button
            onClick={handleWishlistToggle}
            className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 p-1.5 sm:p-2 bg-white/90 hover:bg-white rounded-full shadow-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart
              className={cn(
                "w-3 h-3 sm:w-4 sm:h-4 transition-colors",
                isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
              )}
            />
          </motion.button>

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
          <span className={cn(
            "hidden sm:block text-[8px] uppercase tracking-wider font-gotham mb-1",
            darkMode ? "text-bronze-gold" : "text-bronze-gold/70"
          )}>
            {product.category}
          </span>

          {/* Product Name */}
          <h3 className={cn(
            "font-playfair text-xs sm:text-sm line-clamp-1 mb-0.5 sm:mb-1 group-hover:text-bronze-gold transition-colors",
            darkMode ? "text-gray-100" : "text-gray-900"
          )}>
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            {(product as any).displayPrice ? (
              <p className={cn(
                "font-gotham text-xs sm:text-sm font-semibold",
                darkMode ? "text-[#C6A664]" : "text-classic-green"
              )}>
                {(product as any).displayPrice}
              </p>
            ) : product.comparePrice ? (
              <>
                <p className={cn(
                  "font-gotham text-xs sm:text-sm font-semibold",
                  darkMode ? "text-[#C6A664]" : "text-classic-green"
                )}>
                  {formatPrice(product.price, product.currency)}
                </p>
                <p className={cn(
                  "font-gotham text-[10px] sm:text-xs line-through",
                  darkMode ? "text-gray-500" : "text-gray-400"
                )}>
                  {formatPrice(product.comparePrice, product.currency)}
                </p>
                <span className={cn(
                  "inline-flex items-center px-1.5 py-0.5 text-[8px] sm:text-[9px] font-gotham font-semibold rounded",
                  darkMode ? "bg-red-900/50 text-red-400" : "bg-red-100 text-red-600"
                )}>
                  {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                </span>
              </>
            ) : (
              <p className={cn(
                "font-gotham text-xs sm:text-sm font-semibold",
                darkMode ? "text-[#C6A664]" : "text-classic-green"
              )}>
                {formatPrice(product.price, product.currency)}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}


