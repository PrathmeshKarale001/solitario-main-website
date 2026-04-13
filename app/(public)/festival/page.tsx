'use client';

import { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShoppingCart,
  Heart,
  Ticket,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronRight,
  X,
  Home,
} from 'lucide-react';
import { Section, Container, QuickLookModal } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/lib/data';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { isPrebookingProduct, getProductDisplayPrice, getProductButtonText } from '@/lib/prebooking';
import { trackMetaAddToCart, trackMetaAddToWishlist } from '@/components/analytics/MetaPixel';
import { getActiveFestival, FestivalConfig } from '@/lib/festival-config';
import ProductFilters from '@/components/products/ProductFilters';

const LOAD_MORE_THRESHOLD = 12;


function FestivalHero({ festival }: { festival: FestivalConfig }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const hasImage = !!festival.heroImage;

  return (
    <section className="relative w-full overflow-hidden bg-[#1a1a1a]">
      <div className="relative w-full aspect-[4/5] md:aspect-[16/7] max-h-[85vh] md:max-h-[700px]">
        <div className="absolute inset-0">
          {hasImage ? (
            <Image
              src={festival.heroImage!}
              alt={festival.tagline}
              fill
              className="object-cover object-center"
              priority
              quality={90}
              sizes="100vw"
            />
          ) : (
            /* Fallback gradient when no image configured */
            <div className="w-full h-full bg-gradient-to-br from-classic-green via-[#0d4a3a] to-[#0a3528]" />
          )}
          {/* Gradient overlay — bottom-heavy like earrings hero */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>

        {/* Dramatic top-left tagline (like "DRAMATIC. DELICATE. DIVINE.") */}
        {festival.heroTagline && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute top-8 left-8 md:top-12 md:left-12 z-10"
          >
            <p className="text-white/50 font-gotham text-xs md:text-sm uppercase tracking-[0.3em]">
              {festival.heroTagline}
            </p>
          </motion.div>
        )}

        {/* Bottom-center text — same position as category page */}
        <div className="absolute inset-0 z-10 flex items-end justify-center pb-12 md:pb-16">
          <div className="text-center px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-white/70 text-sm mb-4 font-montserrat">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white">{festival.tagline}</span>
            </nav>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-white mb-4"
            >
              {festival.heading}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white/80 font-montserrat text-sm md:text-base max-w-xl mx-auto"
            >
              {festival.subtitle}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main page content ─────────────────────────────────────────────────────
function FestivalPageContent() {
  const festival = useMemo(() => getActiveFestival(), []);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Filter state
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // Load products from the active festival collection
  useEffect(() => {
    if (!festival) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const all: Product[] = data.products || [];
        const filtered = all.filter((p: any) =>
          p.collections?.some((c: any) => c.handle === festival.collectionHandle)
        );
        setProducts(filtered);
      } catch (err) {
        console.error('Failed to load festival products:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [festival]);

  // Apply filters + sort
  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (showFeaturedOnly) list = list.filter((p) => p.featured);
    switch (sortBy) {
      case 'price-low': list.sort((a, b) => a.price - b.price); break;
      case 'price-high': list.sort((a, b) => b.price - a.price); break;
      case 'name-asc': list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': list.sort((a, b) => b.name.localeCompare(a.name)); break;
      default:
        list.sort((a, b) => (a.featured && !b.featured ? -1 : !a.featured && b.featured ? 1 : 0));
    }
    return list;
  }, [products, activeCategory, searchQuery, priceRange, showFeaturedOnly, sortBy]);

  // Populate displayedProducts when filters change
  useEffect(() => {
    const initial = Math.min(LOAD_MORE_THRESHOLD, filteredProducts.length);
    setDisplayedProducts(filteredProducts.slice(0, initial));
    setHasMore(filteredProducts.length > initial);
  }, [filteredProducts]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          await new Promise((r) => setTimeout(r, 400));
          setDisplayedProducts((prev) => {
            const next = filteredProducts.slice(prev.length, prev.length + LOAD_MORE_THRESHOLD);
            const merged = [...prev, ...next];
            if (merged.length >= filteredProducts.length) setHasMore(false);
            return merged;
          });
          setIsLoadingMore(false);
        }
      },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, filteredProducts]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach((p) => {
      const cat = p.category.toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  // ── No active festival fallback ────────────────────────────────────────
  if (!festival) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-ivory-pearl to-white text-center px-6 py-24">
        <div className="text-6xl mb-6">✨</div>
        <h1 className="text-3xl font-montserrat font-bold text-classic-green mb-4">
          No Festival Collection Active
        </h1>
        <p className="text-gray-500 font-montserrat max-w-md mb-8">
          Our next festival collection is coming soon. Check back around the next auspicious occasion!
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-classic-green text-white px-8 py-3 rounded-full font-gotham text-xs uppercase tracking-wider hover:bg-classic-green/90 transition-all"
        >
          Shop All Jewellery <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <FestivalHero festival={festival} />

      {/* Breadcrumb */}
      <Section variant="light" padding="sm">
        <Container>
          <nav className="flex items-center gap-2 text-sm font-montserrat text-gray-500">
            <Link href="/" className="hover:text-classic-green transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-classic-green font-medium">{festival.tagline}</span>
          </nav>
        </Container>
      </Section>

      {/* Main content: sidebar + grid */}
      <Section variant="light" padding="lg" className="pb-28 lg:pb-16">
        <Container>
          <div className="flex gap-8">
            {/* Sidebar — desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
                {/* Festival info card */}
                <div className="mb-6 p-5 bg-gradient-to-br from-classic-green/5 to-bronze-gold/10 rounded-xl border border-classic-green/20">
                  <div className="text-3xl mb-2">{festival.emoji}</div>
                  <h3 className="font-montserrat font-bold text-base text-classic-green mb-1">
                    {festival.tagline}
                  </h3>
                  <p className="text-xs text-gray-500 font-montserrat leading-relaxed">
                    {festival.subtitle}
                  </p>
                </div>
                <ProductFilters
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  viewMode={viewMode}
                  onViewModeChange={() => {}}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  showFeaturedOnly={showFeaturedOnly}
                  onFeaturedToggle={setShowFeaturedOnly}
                  productCounts={categoryCounts}
                />
              </div>
            </aside>

            {/* Product grid */}
            <div className="flex-1 min-w-0">
              {/* Results header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600 font-montserrat text-sm">
                  Showing{' '}
                  <span className="font-semibold text-classic-green">{displayedProducts.length}</span>{' '}
                  of {filteredProducts.length} pieces
                  {filteredProducts.length !== products.length && (
                    <span className="text-gray-400"> (filtered from {products.length})</span>
                  )}
                </p>
              </div>

              {/* Loading skeletons */}
              {loading && (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 rounded-xl aspect-square mb-3" />
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!loading && filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-lg text-gray-400 font-montserrat mb-4">
                    No products match your filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setPriceRange([0, 500000]);
                      setShowFeaturedOnly(false);
                      setActiveCategory('all');
                    }}
                    className="text-classic-green hover:underline font-gotham text-sm uppercase tracking-wider"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Product cards */}
              {!loading && (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {displayedProducts.map((product, index) => {
                    const isInWishlist = wishlist.some((w) => w.id === product.id);
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: (index % 8) * 0.05 }}
                        className="group"
                      >
                        <div className="relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-classic-green/30 hover:shadow-lg transition-all duration-300">
                          {/* Image */}
                          <Link href={`/products/${product.id}`} className="block">
                            <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-white overflow-hidden">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              />

                              {/* Festival badge */}
                              <div className="absolute top-3 left-3 bg-bronze-gold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-white" />
                                <span className="text-[10px] uppercase tracking-wider font-gotham text-white">
                                  {festival.tagline.split(' ').slice(0, 2).join(' ')}
                                </span>
                              </div>

                              {/* Wishlist */}
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
                                className="absolute top-3 right-3 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                                aria-label={isInWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                              >
                                <Heart
                                  className={`w-4 h-4 transition-colors ${
                                    isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
                                  }`}
                                />
                              </button>
                            </div>
                          </Link>

                          {/* Info */}
                          <div className="p-4">
                            <Link href={`/products/${product.id}`}>
                              <h3 className="font-montserrat font-bold text-sm sm:text-base text-gray-900 line-clamp-1 mb-2 group-hover:text-classic-green transition-colors min-h-[1.5rem]">
                                {product.name}
                              </h3>
                            </Link>
                            <p
                              className={`font-gotham text-base sm:text-lg font-semibold mb-3 min-h-[1.75rem] ${
                                isPrebookingProduct(product) ? 'text-purple-600' : 'text-classic-green'
                              }`}
                            >
                              {isPrebookingProduct(product)
                                ? getProductDisplayPrice(product)
                                : formatPrice(product.price, product.currency)}
                            </p>

                            <button
                              onClick={() => {
                                addToCart(product, 1);
                                trackMetaAddToCart({
                                  content_ids: [product.id],
                                  content_name: product.name,
                                  content_type: 'product',
                                  value: product.price,
                                  currency: product.currency || 'INR',
                                });
                              }}
                              className={`w-full flex items-center justify-center gap-2 text-white py-2.5 rounded-lg font-gotham text-xs uppercase tracking-wider transition-all active:scale-95 ${
                                isPrebookingProduct(product)
                                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600'
                                  : 'bg-classic-green hover:bg-classic-green/90'
                              }`}
                            >
                              {isPrebookingProduct(product) ? (
                                <Ticket className="w-4 h-4" />
                              ) : (
                                <ShoppingCart className="w-4 h-4" />
                              )}
                              {getProductButtonText(product, false)}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Infinite scroll sentinel */}
              <div ref={sentinelRef} className="h-10 mt-4" />

              {/* Loading more indicator */}
              {isLoadingMore && (
                <div className="flex justify-center items-center gap-2 py-8 text-classic-green">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-classic-green" />
                  <span className="text-sm font-montserrat">Loading more pieces…</span>
                </div>
              )}

              {/* End of collection */}
              {!hasMore && displayedProducts.length > 0 && !loading && (
                <div className="mt-10 text-center">
                  <p className="text-gray-400 font-montserrat text-sm mb-4">
                    {festival.emoji} You've seen our entire {festival.tagline} collection
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 border border-classic-green text-classic-green px-6 py-2.5 rounded-full font-gotham text-xs uppercase tracking-wider hover:bg-classic-green hover:text-white transition-all"
                  >
                    Shop All Jewellery <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-classic-green border-t border-classic-green/80 shadow-lg z-50">
        <div className="flex">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 text-white font-gotham text-xs uppercase tracking-wider border-r border-white/20 active:bg-classic-green/80"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
          <button
            onClick={() => setShowMobileSort(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 text-white font-gotham text-xs uppercase tracking-wider active:bg-classic-green/80"
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort
          </button>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-classic-green border-b border-classic-green/80 p-4 flex items-center justify-between z-10">
                <div>
                  <p className="text-ivory-pearl/70 font-gotham text-[10px] uppercase tracking-widest mb-0.5">
                    {festival.tagline}
                  </p>
                  <h2 className="font-montserrat font-bold text-lg text-white">Filters</h2>
                </div>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="p-4">
                <ProductFilters
                  activeCategory={activeCategory}
                  onCategoryChange={(cat) => {
                    setActiveCategory(cat);
                    setShowMobileFilters(false);
                  }}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  viewMode={viewMode}
                  onViewModeChange={() => {}}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  showFeaturedOnly={showFeaturedOnly}
                  onFeaturedToggle={setShowFeaturedOnly}
                  productCounts={categoryCounts}
                />
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 bg-classic-green text-white rounded-lg font-gotham text-sm uppercase tracking-wider"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sort sheet */}
      <AnimatePresence>
        {showMobileSort && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setShowMobileSort(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-classic-green">
                <h2 className="font-montserrat font-bold text-xl text-white">Sort By</h2>
                <button
                  onClick={() => setShowMobileSort(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="p-4 space-y-2">
                {[
                  { value: 'featured', label: 'Featured First' },
                  { value: 'price-low', label: 'Price: Low to High' },
                  { value: 'price-high', label: 'Price: High to Low' },
                  { value: 'name-asc', label: 'Name: A to Z' },
                  { value: 'name-desc', label: 'Name: Z to A' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value);
                      setShowMobileSort(false);
                    }}
                    className={`w-full text-left py-3 px-4 rounded-lg text-sm font-montserrat transition-all ${
                      sortBy === opt.value
                        ? 'bg-classic-green/10 text-classic-green font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {opt.value === sortBy && <span className="mr-2">✓</span>}
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="h-8" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick look modal */}
      <QuickLookModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </div>
  );
}

export default function FestivalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-classic-green mx-auto mb-4" />
            <p className="text-gray-500 font-montserrat text-sm">Loading collection…</p>
          </div>
        </div>
      }
    >
      <FestivalPageContent />
    </Suspense>
  );
}
