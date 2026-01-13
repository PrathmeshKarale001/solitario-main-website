'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import { Section, Container } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/lib/data';

const categories = CATEGORIES.filter((cat) => cat.id !== 'all');

export default function ProductCategories() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setAllProducts(data.products || []);
      } catch (error) {
        console.error('Failed to load products:', error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts: Product[] = (() => {
    if (activeCategory === 'all') {
      return categories
        .map((cat) =>
          allProducts.find(
            (product) => product.category?.toLowerCase() === cat.slug.toLowerCase()
          )
        )
        .filter(Boolean)
        .slice(0, 4) as Product[];
    }
    return allProducts
      .filter(
        (product) => product.category?.toLowerCase() === activeCategory.toLowerCase()
      )
      .slice(0, 4);
  })();

  return (
    <Section variant="light" padding="sm" className="py-6 sm:py-8 md:py-10">
      <Container>
        {/* Compact Header for Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-3 sm:mb-6 md:mb-8 text-center"
        >
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-gotham text-bronze-gold mb-2 block">Collections</span>
          <h2 className="text-xl sm:text-2xl md:text-4xl font-playfair text-classic-green mb-2 sm:mb-4" style={{ letterSpacing: '-0.02em' }}>
            Find Your Perfect Lab Grown Diamond
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto font-montserrat hidden sm:block">
            The Finest Materials, Each Piece Radiates Luxury
          </p>
        </motion.div>

        {/* Category Pills - Horizontal Scroll on Mobile */}
        <div className="mb-4 sm:mb-8 -mx-3 px-3 sm:mx-0 sm:px-0">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:justify-center scrollbar-hide">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.slug)}
                className={`flex-shrink-0 px-3 sm:px-5 py-1.5 sm:py-2 font-gotham text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300 rounded-full touch-manipulation ${
                  activeCategory === category.slug
                    ? 'bg-bronze-gold text-white shadow-luxury-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-bronze-gold/10 hover:text-bronze-gold'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compact Product Grid - 2 columns on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mb-6 sm:mb-10">
          {filteredProducts.map((product, index) => {
            const categoryLabel =
              CATEGORIES.find((c) => c.slug === product.category)?.label || product.category;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={`/products/${product.id}`}
                  className="group block"
                >
                  {/* Compact Card */}
                  <div className="relative bg-white rounded-lg sm:rounded-xl overflow-hidden border border-gray-100 hover:border-bronze-gold/30 transition-all">
                    {/* Compact Image */}
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-2 sm:p-4 group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
                      />
                      {/* Category Badge - Smaller */}
                      <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-white/90 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                        <span className="text-[8px] sm:text-[10px] uppercase tracking-wider font-gotham text-gray-500">
                          {categoryLabel}
                        </span>
                      </div>
                    </div>
                    
                    {/* Compact Info */}
                    <div className="p-2 sm:p-3">
                      <h3 className="font-playfair text-xs sm:text-sm text-gray-900 line-clamp-1 mb-0.5 sm:mb-1">
                        {product.name}
                      </h3>
                      <p className="font-gotham text-xs sm:text-sm font-semibold text-classic-green">
                        {formatPrice(product.price, product.currency)}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Compact CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-bronze-gold text-white px-5 sm:px-8 py-2.5 sm:py-3 font-gotham text-[10px] sm:text-xs uppercase tracking-wider rounded-full hover:bg-bronze-gold/90 transition-all touch-manipulation"
          >
            View All
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
        </motion.div>
      </Container>
    </Section>
  );
}
