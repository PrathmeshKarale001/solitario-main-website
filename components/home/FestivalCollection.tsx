'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingCart, Heart, Ticket, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import { Section, Container } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/lib/data';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { isPrebookingProduct, getProductDisplayPrice, getProductButtonText } from '@/lib/prebooking';
import { trackMetaAddToCart, trackMetaAddToWishlist } from '@/components/analytics/MetaPixel';
import { getActiveFestival } from '@/lib/festival-config';

export default function FestivalCollection() {
  const [festival] = useState(() => getActiveFestival());
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // Slider state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!festival) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const allProducts: Product[] = data.products || [];

        // Filter products belonging to this festival's Shopify collection — show ALL
        const festivalProducts = allProducts.filter((product: any) =>
          product.collections?.some(
            (col: any) => col.handle === festival.collectionHandle
          )
        );

        setProducts(festivalProducts);
      } catch (error) {
        console.error('Failed to load festival products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [festival]);

  // Update scroll state
  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate active page based on scroll position
    const cardWidth = container.querySelector('[data-slide-card]')?.clientWidth || 240;
    const gap = 16;
    const visibleCards = Math.floor(clientWidth / (cardWidth + gap));
    const currentPage = Math.round(scrollLeft / (clientWidth * 0.8));
    const pages = Math.max(1, Math.ceil(products.length / Math.max(visibleCards, 1)));

    setActiveIndex(Math.min(currentPage, pages - 1));
    setTotalPages(pages);
  }, [products.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    updateScrollState();
    container.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      container.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, products]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  const scrollToPage = useCallback((page: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    container.scrollTo({
      left: scrollAmount * page,
      behavior: 'smooth',
    });
  }, []);

  // Don't render if no active festival or no products loaded
  if (!festival) return null;
  if (!loading && products.length === 0) return null;

  return (
    <Section variant="light" padding="sm" className="py-6 sm:py-8 md:py-10">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-3 sm:mb-6 md:mb-8 text-center"
        >
          <h2
            className="text-2xl sm:text-3xl md:text-5xl font-montserrat font-bold text-classic-green mb-2 sm:mb-3 flex items-center justify-center gap-2"
            style={{ letterSpacing: '-0.02em' }}
          >
            {festival.emoji && <span className="text-2xl sm:text-3xl md:text-4xl">{festival.emoji}</span>}
            {festival.tagline}
            {festival.emoji && <span className="text-2xl sm:text-3xl md:text-4xl">{festival.emoji}</span>}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 font-montserrat font-medium mb-1 sm:mb-2">
            {festival.heading}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto font-montserrat hidden sm:block">
            {festival.subtitle}
          </p>
        </motion.div>

        {/* Slider Container */}
        <div className="relative group/slider">
          {/* Navigation Arrows */}
          {!loading && products.length > 2 && (
            <>
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 -translate-x-1/2 ${
                  canScrollLeft
                    ? 'opacity-0 group-hover/slider:opacity-100 hover:bg-classic-green hover:text-white hover:border-classic-green cursor-pointer'
                    : 'opacity-0 cursor-default'
                }`}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 translate-x-1/2 ${
                  canScrollRight
                    ? 'opacity-0 group-hover/slider:opacity-100 hover:bg-classic-green hover:text-white hover:border-classic-green cursor-pointer'
                    : 'opacity-0 cursor-default'
                }`}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Scrollable Track */}
          {loading ? (
            <div className="flex gap-4 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse flex-shrink-0 w-[180px] sm:w-[220px] md:w-[240px]">
                  <div className="bg-gray-200 rounded-xl aspect-square mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {products.map((product, index) => {
                const isInWishlist = wishlist.some(item => item.id === product.id);

                return (
                  <motion.div
                    key={product.id}
                    data-slide-card
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                    className="flex-shrink-0 w-[170px] sm:w-[210px] md:w-[240px] snap-start group"
                  >
                    {/* Card */}
                    <div className="relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-classic-green/30 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                      {/* Image */}
                      <Link href={`/products/${product.id}`} className="block">
                        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-white overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain p-4 sm:p-6 group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 170px, (max-width: 1024px) 210px, 240px"
                          />

                          {/* Festival Badge */}
                          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-bronze-gold px-2 sm:px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-white" />
                            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-gotham text-white">
                              {festival.tagline.split(' ').slice(0, 2).join(' ')}
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
                                trackMetaAddToWishlist({
                                  content_ids: [product.id],
                                  content_name: product.name,
                                  value: product.price,
                                  currency: product.currency || 'INR',
                                });
                              }
                            }}
                            className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                            aria-label={isInWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                          >
                            <Heart
                              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                            />
                          </button>
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="p-3 sm:p-4 flex flex-col flex-1">
                        <Link href={`/products/${product.id}`}>
                          <h3 className="font-montserrat font-bold text-xs sm:text-sm text-gray-900 line-clamp-1 mb-1.5 sm:mb-2 group-hover:text-classic-green transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <p className={`font-gotham text-sm sm:text-base font-semibold mb-2 sm:mb-3 ${isPrebookingProduct(product) ? 'text-purple-600' : 'text-classic-green'}`}>
                          {isPrebookingProduct(product) ? getProductDisplayPrice(product) : formatPrice(product.price, product.currency)}
                        </p>

                        {/* Add to Cart */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product, 1);
                            trackMetaAddToCart({
                              content_ids: [product.id],
                              content_name: product.name,
                              content_type: 'product',
                              value: product.price,
                              currency: product.currency || 'INR',
                            });
                          }}
                          className={`mt-auto w-full flex items-center justify-center gap-1.5 sm:gap-2 text-white py-2 sm:py-2.5 rounded-lg font-gotham text-[10px] sm:text-xs uppercase tracking-wider transition-all active:scale-95 ${isPrebookingProduct(product)
                            ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600'
                            : 'bg-classic-green hover:bg-classic-green/90'
                            }`}
                        >
                          {isPrebookingProduct(product) ? <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                          {getProductButtonText(product, false)}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Dots Indicator */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToPage(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? 'w-6 h-2 bg-classic-green'
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mt-6 sm:mt-8"
        >
          <Link
            href={festival.ctaLink}
            className="inline-flex items-center gap-2 bg-bronze-gold text-white px-5 sm:px-8 py-2.5 sm:py-3 font-gotham text-[10px] sm:text-xs uppercase tracking-wider rounded-full hover:bg-bronze-gold/90 transition-all touch-manipulation"
          >
            {festival.ctaText}
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
        </motion.div>
      </Container>
    </Section>
  );
}
