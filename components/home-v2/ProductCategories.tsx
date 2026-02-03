'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import { formatPrice } from '@/lib';
import { PRODUCTS, Product } from '@/lib/data';

const categories = CATEGORIES.filter((cat) => cat.id !== 'all');

export default function ProductCategories() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const filteredProducts: Product[] =
    activeCategory === 'all'
      ? categories
          .map((cat) =>
            PRODUCTS.find(
              (product) => product.category.toLowerCase() === cat.slug.toLowerCase()
            )
          )
          .filter(Boolean)
          .slice(0, 4) as Product[]
      : PRODUCTS.filter(
          (product) => product.category.toLowerCase() === activeCategory.toLowerCase()
        ).slice(0, 4);

  return (
    <section className="bg-white relative pt-20 pb-24">
      {/* Seamless Transition Gradient from Dark to Light */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-900 to-white pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <span className="text-xs font-gotham text-bronze-gold uppercase tracking-[0.2em] mb-3 block">
              New Arrivals
            </span>
            <h2 className="text-3xl md:text-5xl font-montserrat font-bold text-gray-900" style={{ letterSpacing: '-0.02em' }}>
              Trending Now
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
          >
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.slug)}
                className={`flex-shrink-0 px-6 py-2.5 font-gotham text-[11px] uppercase tracking-wider rounded-full border transition-all duration-300 ${
                  activeCategory === category.slug
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-transparent text-gray-500 border-gray-200 hover:border-gray-900 hover:text-gray-900'
                }`}
              >
                {category.label}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product, index) => {
            const categoryLabel = CATEGORIES.find((c) => c.slug === product.category)?.label || product.category;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/products/${product.id}`} className="group block">
                  <div className="relative bg-gray-50 rounded-2xl overflow-hidden mb-4">
                    <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out"
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
                      />
                      
                      {/* Floating Actions */}
                      <div className="absolute top-4 right-4 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-900 hover:text-bronze-gold transition-colors">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Tag */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-gotham uppercase tracking-wider text-gray-600">
                          {categoryLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-montserrat font-bold text-lg text-gray-900 group-hover:text-bronze-gold transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="font-gotham text-sm text-gray-500">
                        {formatPrice(product.price, product.currency)}
                      </p>
                      <span className="text-xs font-gotham uppercase tracking-wider text-gray-400 group-hover:text-gray-900 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100">
                        Shop <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white font-gotham text-xs uppercase tracking-[0.2em] rounded-lg hover:bg-gray-800 transition-colors"
          >
            View All Collections
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
