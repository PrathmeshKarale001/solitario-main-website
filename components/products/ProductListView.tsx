'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';

export interface ProductListViewProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
  darkMode?: boolean;
}

export default function ProductListView({ products, onQuickView, darkMode = false }: ProductListViewProps) {
  const { addToCart } = useCart();

  const getCleanDescription = (description?: string) => {
    if (!description) return '';

    const decodeHtmlEntities = (value: string) => {
      if (typeof window === 'undefined') return value;
      const textarea = document.createElement('textarea');
      textarea.innerHTML = value;
      return textarea.value;
    };

    const decoded = decodeHtmlEntities(description);
    return decoded.replace(/<[^>]*>/g, '').split('Specifications')[0].trim();
  };

  return (
    <div className="space-y-4">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Link href={`/products/${product.id}`}>
            <div className={`group rounded-2xl overflow-hidden border hover:border-bronze-gold/30 transition-all duration-500 shadow-luxury hover:shadow-luxury-lg ${
              darkMode 
                ? 'bg-[#111] border-[#2a2a2a] hover:bg-[#161616]' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className={`relative w-full md:w-64 h-64 md:h-auto flex-shrink-0 ${
                  darkMode 
                    ? 'bg-[#111]' 
                    : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
                }`}>
                  <Image
                    src={product.image || '/images/placeholder.svg'}
                    alt={product.name}
                    fill
                    className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                  />
                  {product.featured && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-bronze-gold to-bronze-gold/80 text-white px-3 py-1 text-xs font-gotham uppercase tracking-[0.2em] rounded-full shadow-luxury-lg">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <span className={`inline-block text-[10px] uppercase tracking-[0.25em] font-gotham mb-2 ${
                          darkMode ? 'text-bronze-gold' : 'text-gray-400'
                        }`}>
                          {product.category.toUpperCase()}
                        </span>
                        <h3 className={`font-playfair text-2xl md:text-3xl group-hover:text-bronze-gold transition-colors mb-2 ${
                          darkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                          {product.name}
                        </h3>
                        <p className={`text-sm leading-relaxed font-montserrat line-clamp-2 mb-4 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {getCleanDescription(product.description) || product.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between pt-4 border-t ${
                    darkMode ? 'border-[#2a2a2a]' : 'border-gray-100'
                  }`}>
                    <div className="flex items-center gap-3">
                      {product.comparePrice ? (
                        <>
                          <p className={`font-gotham text-2xl font-semibold tracking-wide ${
                            darkMode ? 'text-[#C6A664]' : 'text-classic-green'
                          }`}>
                            {formatPrice(product.price, product.currency)}
                          </p>
                          <p className={`font-gotham text-lg line-through ${
                            darkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {formatPrice(product.comparePrice, product.currency)}
                          </p>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-gotham font-semibold rounded ${
                            darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-600'
                          }`}>
                            {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                          </span>
                        </>
                      ) : (
                        <p className={`font-gotham text-2xl font-semibold tracking-wide ${
                          darkMode ? 'text-[#C6A664]' : 'text-classic-green'
                        }`}>
                          {formatPrice(product.price, product.currency)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {onQuickView && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onQuickView(product);
                          }}
                          className="p-2.5 bg-white border border-gray-200 rounded-full hover:bg-bronze-gold hover:text-white hover:border-bronze-gold transition-all duration-300 shadow-luxury"
                          aria-label="Quick view"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product, 1);
                        }}
                        className="px-6 py-2.5 bg-bronze-gold hover:bg-bronze-gold/90 text-white rounded-full font-gotham text-xs uppercase tracking-[0.2em] transition-all shadow-luxury hover:shadow-glow flex items-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

