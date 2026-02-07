'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingCart, Heart, Ticket } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import { Section, Container } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/lib/data';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { isPrebookingProduct, getProductDisplayPrice, getProductButtonText } from '@/lib/prebooking';

const categories = CATEGORIES.filter((cat) => cat.id !== 'all');

export default function ProductCategories() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

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
    // Filter products by price range (10K-30K)
    const priceFilteredProducts = allProducts.filter(
      (product) => product.price >= 10000 && product.price <= 30000
    );

    if (activeCategory === 'all') {
      return categories
        .map((cat) =>
          priceFilteredProducts.find(
            (product) => product.category?.toLowerCase() === cat.slug.toLowerCase()
          )
        )
        .filter(Boolean)
        .slice(0, 4) as Product[];
    }
    return priceFilteredProducts
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
          <h2 className="text-xl sm:text-2xl md:text-4xl font-montserrat font-bold text-classic-green mb-2 sm:mb-4" style={{ letterSpacing: '-0.02em' }}>
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

        {/* Simple, Beautiful Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-10">
          {filteredProducts.map((product, index) => {
            const categoryLabel =
              CATEGORIES.find((c) => c.slug === product.category)?.label || product.category;
            const isInWishlist = wishlist.some(item => item.id === product.id);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                {/* Simple Card with Clean Design */}
                <div className="relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-classic-green/30 hover:shadow-lg transition-all duration-300">
                  {/* Image Container */}
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-white overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      />
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                        <span className="text-[10px] uppercase tracking-wider font-gotham text-gray-600">
                          {categoryLabel}
                        </span>
                      </div>
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (isInWishlist) {
                            removeFromWishlist(product.id);
                          } else {
                            addToWishlist(product);
                          }
                        }}
                        className="absolute top-3 right-3 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
                          }`}
                        />
                      </button>
                    </div>
                  </Link>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-montserrat font-bold text-sm sm:text-base text-gray-900 line-clamp-1 mb-2 group-hover:text-classic-green transition-colors min-h-[1.5rem]">
                        {product.name}
                      </h3>
                    </Link>
                    <p className={`font-gotham text-base sm:text-lg font-semibold mb-3 min-h-[1.75rem] ${isPrebookingProduct(product) ? 'text-purple-600' : 'text-classic-green'}`}>
                      {isPrebookingProduct(product) ? getProductDisplayPrice(product) : formatPrice(product.price, product.currency)}
                    </p>
                    
                    {/* Add to Cart / Prebook Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product, 1);
                      }}
                      className={`w-full flex items-center justify-center gap-2 text-white py-2.5 rounded-lg font-gotham text-xs uppercase tracking-wider transition-all active:scale-95 ${
                        isPrebookingProduct(product) 
                          ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600' 
                          : 'bg-classic-green hover:bg-classic-green/90'
                      }`}
                    >
                      {isPrebookingProduct(product) ? <Ticket className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                      {getProductButtonText(product, false)}
                    </button>
                  </div>
                </div>
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
