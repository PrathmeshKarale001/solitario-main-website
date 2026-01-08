'use client';

import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/lib/data';
import { WARNER_BROS_CONFIG } from '@/lib/warner-bros-config';
import ProductFilters from '@/components/products/ProductFilters';
import ProductGrid from '@/components/products/ProductGrid';
import ProductListView from '@/components/products/ProductListView';
import { Section, Container, QuickLookModal } from '@/components/ui';

const PRODUCTS_PER_PAGE = 12;
const LOAD_MORE_THRESHOLD = 12;

function WarnerBrosPageContent() {
  const [activeBrand, setActiveBrand] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  // Load products from Shopify API - Warner Bros collection with XXXX pricing
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products?collection=warnerbros');
        const data = await response.json();
        
        // Modify products to show XXXX pricing
        const productsWithXXXX = (data.products || []).map((product: Product) => ({
          ...product,
          displayPrice: 'XXXX'
        }));
        
        setProducts(productsWithXXXX);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts: Product[] = useMemo(() => {
    let productList = [...products];

    // Category filter (case-insensitive)
    if (activeCategory !== 'all') {
      productList = productList.filter(product =>
        product.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      productList = productList.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Price range filter
    productList = productList.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Featured filter
    if (showFeaturedOnly) {
      productList = productList.filter(product => product.featured);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        productList.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        productList.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        productList.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        productList.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'featured':
      default:
        productList.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }

    return productList;
  }, [products, activeCategory, searchQuery, priceRange, showFeaturedOnly, sortBy]);

  // Update displayed products when filters change
  useEffect(() => {
    const initialLoad = Math.min(LOAD_MORE_THRESHOLD, filteredAndSortedProducts.length);
    setDisplayedProducts(filteredAndSortedProducts.slice(0, initialLoad));
    setHasMore(filteredAndSortedProducts.length > initialLoad);
  }, [filteredAndSortedProducts]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          await new Promise(resolve => setTimeout(resolve, 500));
          
          setDisplayedProducts(prev => {
            const currentLength = prev.length;
            const nextBatch = filteredAndSortedProducts.slice(
              currentLength,
              currentLength + LOAD_MORE_THRESHOLD
            );
            const newProducts = [...prev, ...nextBatch];
            
            if (newProducts.length >= filteredAndSortedProducts.length) {
              setHasMore(false);
            }
            
            return newProducts;
          });
          
          setIsLoadingMore(false);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, filteredAndSortedProducts]);

  // Calculate category counts for sidebar
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach(product => {
      const cat = product.category.toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Load more products manually
  const loadMore = () => {
    if (!hasMore || isLoadingMore) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedProducts(prev => {
        const currentLength = prev.length;
        const nextBatch = filteredAndSortedProducts.slice(
          currentLength,
          currentLength + LOAD_MORE_THRESHOLD
        );
        const newProducts = [...prev, ...nextBatch];
        
        if (newProducts.length >= filteredAndSortedProducts.length) {
          setHasMore(false);
        }
        
        return newProducts;
      });
      setIsLoadingMore(false);
    }, 500);
  };

  const handleBrandClick = (brandId: string) => {
    setActiveBrand(brandId);
    // Scroll to products section
    productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen overflow-x-hidden">
      {/* Hero Banner Section - Mobile Optimized */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={isMobile ? WARNER_BROS_CONFIG.hero.mobile : WARNER_BROS_CONFIG.hero.desktop}
            alt={WARNER_BROS_CONFIG.hero.alt}
            fill
            className="object-cover scale-105"
            priority
            quality={90}
            sizes="100vw"
            onError={(e) => {
              // Fallback to a gradient if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          {/* Cinematic gradient overlays - Balanced for visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/0 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/1 via-transparent to-black/5" />
          {/* Bottom gradient for text visibility */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          {/* Vignette effect */}
          <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.6)]" />
        </div>
        
        {/* Hero Content - Mobile Enhanced */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-16">
          <div className="max-w-7xl mx-auto">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[#C6A664] text-[10px] sm:text-xs md:text-sm font-montserrat uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-1 sm:mb-2"
            >
              Solitario x Warner Bros
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl md:text-5xl font-playfair text-white mb-2 sm:mb-3 font-bold leading-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
            >
              Collectibles
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed"
            >
              Step into iconic worlds with our exclusive collaboration
            </motion.p>
            
            {/* Mobile CTA */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => productsRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-4 sm:mt-6 md:hidden px-4 py-2 bg-gradient-to-r from-[#C6A664] to-[#b8983f] text-black rounded-full font-bold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(198,166,100,0.4)] active:scale-95 transition-transform"
            >
              Explore Collection
            </motion.button>
          </div>
        </div>
      </section>

      {/* Legends Unleashed Section - Mobile Optimized */}
      <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden border-b border-[#1f1f1f] overflow-x-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none" />
        
        {/* Warner BG - Left (30% opacity) - Constrained for mobile */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 translate-x-0 md:-translate-x-1/4 w-[30%] md:w-[35%] max-w-[120px] md:max-w-none opacity-30 pointer-events-none select-none">
            <Image 
              src="/images/warnerbroassets/warner-bg.webp" 
              alt="Warner Bros Logo" 
              width={600} 
              height={600} 
              className="object-contain"
              sizes="(max-width: 768px) 150px, 25vw"
            />
        </div>

        {/* Batman BG - Right (60% opacity) - Constrained for mobile */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-0 md:translate-x-1/4 w-[45%] md:w-[50%] max-w-[150px] md:max-w-none opacity-40 pointer-events-none select-none">
            <Image 
              src="/images/warnerbroassets/batman-character.png" 
              alt="Batman Character" 
              width={800} 
              height={800} 
              className="object-contain"
              sizes="(max-width: 768px) 200px, 40vw"
            />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
          {/* Title */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-6xl font-montserrat text-white mb-3 sm:mb-4 font-bold tracking-tight text-center px-4"
          >
            <span className="text-[#C6A664]">L</span><span className="text-white">EGENDS</span>{' '}
            <span className="text-[#C6A664]">U</span><span className="text-white">NLEASHED</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-400 text-base sm:text-lg md:text-xl font-light tracking-wide mb-8 sm:mb-12 font-montserrat px-4"
          >
            Step into iconic worlds.
          </motion.p>

          {/* Brand Selection - Mobile Touch Optimized */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8 px-4 max-w-full overflow-visible">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-500 hover:text-white transition p-3 touch-manipulation flex-shrink-0"
              aria-label="Previous brand"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
            
            <div className="flex gap-3 sm:gap-6 md:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory touch-pan-x py-4 px-2">
              {WARNER_BROS_CONFIG.brands.map((brand, index) => (
                <motion.button
                  key={brand.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBrandClick(brand.id)}
                  className={`
                    w-28 h-20 sm:w-32 sm:h-24 md:w-40 md:h-28 rounded-2xl flex items-center justify-center 
                    shadow-2xl border-2 cursor-pointer transition-all duration-300 flex-shrink-0 snap-center
                    bg-white/10 backdrop-blur-md active:bg-white/15 touch-manipulation
                    ${activeBrand === brand.id 
                      ? 'border-[#C6A664] shadow-[0_0_30px_rgba(198,166,100,0.5)] bg-white/20' 
                      : 'border-white/20 hover:border-white/40 active:border-[#C6A664]'
                    }
                  `}
                  style={{
                    backdropFilter: 'blur(12px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                  }}
                >
                  <motion.div
                    animate={{ rotate: activeBrand === brand.id ? [0, 5, -5, 0] : 0 }}
                    transition={{ duration: 0.5, repeat: activeBrand === brand.id ? Infinity : 0, repeatDelay: 3 }}
                  >
                    <Image
                      src={brand.logo}
                      alt={brand.alt}
                      width={120}
                      height={80}
                      className="object-contain max-h-12 md:max-h-20 filter drop-shadow-lg transition-all duration-300 group-hover:scale-110"
                      sizes="(max-width: 768px) 60px, 120px"
                      onError={(e) => {
                        // Fallback to text if image fails
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="font-bold text-xl text-gray-800">${brand.name}</span>`;
                        }
                      }}
                    />
                  </motion.div>
                </motion.button>
              ))}
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-500 hover:text-white transition p-3 touch-manipulation"
              aria-label="Next brand"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
          </div>
          
          {activeBrand !== 'all' && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 sm:mt-8 text-[#C6A664] text-xs sm:text-sm font-montserrat uppercase tracking-wider px-4"
            >
              Selected: {WARNER_BROS_CONFIG.brands.find(b => b.id === activeBrand)?.name} Collection
            </motion.p>
          )}
        </div>
      </section>

      {/* Sidebar + Products Section - Dark Theme */}
      <div ref={productsRef} className="bg-[#0a0a0a] pb-24 lg:pb-16 relative overflow-x-hidden">
        {/* Grunge texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]"></div>
        </div>
        
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Left Sidebar - Dark Theme Override */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 pr-2 warner-bros-filters">
                <div className="bg-[#111] rounded-xl p-6 border border-[#1f1f1f]">
                  <ProductFilters
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    priceRange={priceRange}
                    onPriceRangeChange={setPriceRange}
                    showFeaturedOnly={showFeaturedOnly}
                    onFeaturedToggle={setShowFeaturedOnly}
                    productCounts={categoryCounts}
                  />
                </div>
              </div>
            </aside>

            {/* Main Content - Products */}
            <div className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-8 mb-6">
                <div>
                  <p className="text-gray-400 font-montserrat text-sm sm:text-base">
                    Showing <span className="font-semibold text-[#C6A664]">{displayedProducts.length}</span> of {filteredAndSortedProducts.length} products
                    {filteredAndSortedProducts.length !== products.length && (
                      <span className="text-gray-500"> (filtered from {products.length})</span>
                    )}
                  </p>
                  {activeBrand !== 'all' && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Collection: <span className="font-semibold text-[#C6A664]">
                        {WARNER_BROS_CONFIG.brands.find(b => b.id === activeBrand)?.name}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-between my-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C6A664]"></div>
                </div>
              ) : filteredAndSortedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500 font-montserrat">No products match your filters.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setPriceRange([0, 500000]);
                      setShowFeaturedOnly(false);
                      setActiveCategory('all');
                      setActiveBrand('all');
                    }}
                    className="mt-4 text-[#C6A664] hover:underline font-gotham text-sm uppercase tracking-wider"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Products Display */}
                  {viewMode === 'grid' ? (
                    <ProductGrid
                      products={displayedProducts}
                      onQuickView={setSelectedProduct}
                      darkMode={true}
                    />
                  ) : (
                    <ProductListView
                      products={displayedProducts}
                      onQuickView={setSelectedProduct}
                      darkMode={true}
                    />
                  )}

                  {/* Load More Section */}
                  {hasMore && (
                    <div className="mt-8 flex flex-col items-center gap-4">
                      {isLoadingMore ? (
                        <div className="flex items-center gap-2 text-[#C6A664]">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C6A664]"></div>
                          <span className="text-sm font-montserrat">Loading more products...</span>
                        </div>
                      ) : (
                        <button
                          onClick={loadMore}
                          className="px-6 py-3 border border-[#C6A664] text-[#C6A664] rounded-lg font-gotham text-sm uppercase tracking-wider hover:bg-[#C6A664] hover:text-black transition-colors"
                        >
                          Load More Products
                        </button>
                      )}
                    </div>
                  )}
                  
                  {/* Sentinel for intersection observer */}
                  <div ref={sentinelRef} className="h-10" />
                  
                  {/* End of products message */}
                  {!hasMore && displayedProducts.length > 0 && (
                    <div className="mt-8 text-center text-gray-500 font-montserrat text-sm">
                      You've reached the end of the collection
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sticky Bar - Dark Theme */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#111] border-t border-[#1f1f1f] shadow-lg z-50 safe-area-inset-bottom">
        <div className="flex">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 text-gray-300 font-gotham text-xs uppercase tracking-wider border-r border-[#1f1f1f] active:bg-[#1a1a1a]"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
          <button
            onClick={() => setShowMobileSort(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 text-gray-300 font-gotham text-xs uppercase tracking-wider active:bg-[#1a1a1a]"
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort
          </button>
        </div>
      </div>

      {/* Mobile Filter Modal - Dark Theme */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/70 z-[60]"
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-[#111] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-[#111] border-b border-[#1f1f1f] p-4 flex items-center justify-between z-10">
                <h2 className="font-playfair text-xl text-white">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-[#1a1a1a] rounded-full text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 warner-bros-filters">
                <ProductFilters
                  activeCategory={activeCategory}
                  onCategoryChange={(cat) => {
                    setActiveCategory(cat);
                    setShowMobileFilters(false);
                  }}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  showFeaturedOnly={showFeaturedOnly}
                  onFeaturedToggle={setShowFeaturedOnly}
                  productCounts={categoryCounts}
                />
              </div>
              <div className="sticky bottom-0 bg-[#111] border-t border-[#1f1f1f] p-4">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 bg-[#C6A664] text-black rounded-lg font-gotham text-sm uppercase tracking-wider hover:bg-[#b8983f] transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sort Modal - Dark Theme */}
      <AnimatePresence>
        {showMobileSort && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/70 z-[60]"
            onClick={() => setShowMobileSort(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute left-0 right-0 bottom-0 bg-[#111] rounded-t-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[#1f1f1f] flex items-center justify-between">
                <h2 className="font-playfair text-xl text-white">Sort By</h2>
                <button
                  onClick={() => setShowMobileSort(false)}
                  className="p-2 hover:bg-[#1a1a1a] rounded-full text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-2">
                {[
                  { value: 'featured', label: 'Featured First' },
                  { value: 'price-low', label: 'Price: Low to High' },
                  { value: 'price-high', label: 'Price: High to Low' },
                  { value: 'name-asc', label: 'Name: A to Z' },
                  { value: 'name-desc', label: 'Name: Z to A' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowMobileSort(false);
                    }}
                    className={`w-full text-left py-3 px-4 rounded-lg text-sm font-montserrat transition-all ${
                      sortBy === option.value
                        ? 'bg-[#C6A664]/20 text-[#C6A664] font-medium'
                        : 'text-gray-300 hover:bg-[#1a1a1a]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="p-4 pb-8 safe-area-inset-bottom" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Look Modal */}
      <QuickLookModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />

      {/* Warner Bros theme overrides */}
      <style jsx global>{`
        /* Filter overrides */
        .warner-bros-filters h3 {
          color: #fff !important;
        }
        .warner-bros-filters span {
          color: #9ca3af !important;
        }
        
        /* General button overrides in filters */
        .warner-bros-filters button {
          transition: all 0.3s ease;
        }
        
        /* View Mode & Filter Buttons Specifics */
        .warner-bros-filters button.bg-white {
          background-color: transparent !important;
          border-color: #333 !important;
          color: #9ca3af !important;
        }
        .warner-bros-filters button.bg-white:hover {
          background-color: #1a1a1a !important;
          border-color: #C6A664 !important;
          color: #C6A664 !important;
        }
        
        /* Active State (Gold) */
        .warner-bros-filters .bg-classic-green,
        .warner-bros-filters [class*="bg-classic-green"] {
          background-color: #C6A664 !important;
          border-color: #C6A664 !important;
          color: #000 !important;
          font-weight: 600 !important;
        }
        
        /* Checkbox & Radio Styles */
        .warner-bros-filters input[type="radio"],
        .warner-bros-filters input[type="checkbox"] {
          border-color: #C6A664 !important;
          background-color: transparent !important;
        }
        .warner-bros-filters input[type="radio"]:checked,
        .warner-bros-filters input[type="checkbox"]:checked {
          background-color: #C6A664 !important;
          border-color: #C6A664 !important;
        }
        
        /* Filter Borders */
        .warner-bros-filters .border-gray-200 {
          border-color: #1f1f1f !important;
        }
        
        /* Category Active State */
        .warner-bros-filters .bg-classic-green\/10 {
          background-color: rgba(198, 166, 100, 0.15) !important;
        }
        .warner-bros-filters .text-classic-green {
          color: #C6A664 !important;
        }

        /* Product Card Dark Mode - Now handled via darkMode prop */
        
        /* Product Card Text Overrides */
        .bg-[#0a0a0a] h3.text-gray-900,
        .bg-[#0a0a0a] .text-gray-900 {
          color: #f3f4f6 !important; /* gray-100 */
        }
        .bg-[#0a0a0a] .text-gray-600 {
          color: #9ca3af !important; /* gray-400 */
        }
        .bg-[#0a0a0a] .text-gray-500 {
          color: #6b7280 !important;
        }
        .bg-[#0a0a0a] .text-gray-400 {
          color: #9ca3af !important;
        }
        
        /* View mode buttons */
        .bg-[#0a0a0a] .border-classic-green {
          border-color: #C6A664 !important;
        }
        .bg-[#0a0a0a] .bg-classic-green {
          background-color: #C6A664 !important;
          color: #000 !important;
        }
        .bg-[#0a0a0a] .text-classic-green {
          color: #C6A664 !important;
        }
        
        /* --------------------------------------------------------- */
        /* UI/UX ENHANCEMENTS & ANIMATIONS                           */
        /* --------------------------------------------------------- */
        
        @keyframes ping-gold {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        /* Flicker Circle / Pulse Effect for Add to Cart Buttons */
        .bg-[#0a0a0a] button.bg-bronze-gold {
          position: relative;
          overflow: visible !important;
        }
        .bg-[#0a0a0a] button.bg-bronze-gold::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 9999px;
          border: 1px solid #C6A664;
          opacity: 0;
          animation: ping-gold 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          pointer-events: none;
        }
        .bg-[#0a0a0a] button.bg-bronze-gold:hover::after {
          animation-duration: 1s; /* Faster pulse on hover */
        }
        
        /* Active Brand Selection Pulse */
        .bg-[#0a0a0a] button.border-\[\#C6A664\] {
          position: relative;
        }
        .bg-[#0a0a0a] button.border-\[\#C6A664\]::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 1rem; /* Match rounded-2xl roughly */
          border: 1px solid rgba(198, 166, 100, 0.3);
          animation: ping-gold 3s cubic-bezier(0, 0, 0.2, 1) infinite;
          pointer-events: none;
          z-index: -1;
        }

        /* Hero Title Glow */
        .font-playfair.text-white {
          text-shadow: 0 0 20px rgba(198, 166, 100, 0.3), 0 2px 4px rgba(0,0,0,0.5);
        }
        
        /* Image Backgrounds */
        .bg-[#0a0a0a] .bg-gray-50 {
          background-color: #161616 !important;
        }
        
        /* Product List View Specifics */
        .bg-[#0a0a0a] .bg-gradient-to-br.from-gray-50 {
          --tw-gradient-from: #161616 !important;
          --tw-gradient-via: #111 !important;
          --tw-gradient-to: #161616 !important;
        }
        
        /* Borders */
        .bg-[#0a0a0a] .border-gray-200,
        .bg-[#0a0a0a] .border-gray-100 {
          border-color: #1f1f1f !important;
        }
        
        /* Hover Effects */
        .bg-[#0a0a0a] .hover\\:bg-gray-50:hover {
          background-color: #1a1a1a !important;
        }
        .bg-[#0a0a0a] .hover\\:border-gray-300:hover {
          border-color: #C6A664 !important;
        }
      `}</style>
    </div>
  );
}

export default function WarnerBrosClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C6A664]"></div>
      </div>
    }>
      <WarnerBrosPageContent />
    </Suspense>
  );
}
