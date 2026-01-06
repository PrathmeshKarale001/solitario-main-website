'use client';

import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown, X, Gift, Sparkles, Clock } from 'lucide-react';
import { Product } from '@/lib/data';
import { filterChristmasProducts } from '@/lib/christmas-products';
import ProductFilters from '@/components/products/ProductFilters';
import ProductGrid from '@/components/products/ProductGrid';
import ProductListView from '@/components/products/ProductListView';
import { Section, Container, QuickLookModal } from '@/components/ui';
import ChristmasCountdown from '@/components/ui/ChristmasCountdown';
import Snowflakes from '@/components/ui/Snowflakes';
import Image from 'next/image';
import Link from 'next/link';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

const PRODUCTS_PER_PAGE = 12;
const LOAD_MORE_THRESHOLD = 12;

// Christmas-themed hero images
const CHRISTMAS_HERO_IMAGES = [
  { src: '/images/Christmas Offer.jpg', pos: 'object-center' },
];

function ChristmasSalePageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const imageIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Load initial products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        const data = await response.json();
        // Filter products specifically for Christmas using only real Shopify collections
        const allProducts = data.products || [];
        const christmasProducts = filterChristmasProducts(allProducts);
        setProducts(christmasProducts);
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

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  // Calculate category counts for sidebar
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach(product => {
      const cat = product.category.toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Load more products manually (fallback)
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

  return (
    <div>
      {/* Christmas Snowflakes Animation */}
      <Snowflakes />
      
      {/* Christmas Hero Section */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-800 via-red-900 to-green-900">
        {/* Subtle animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full opacity-20"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              animate={{
                y: [0, -50, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-yellow-300" />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold mb-4">
              Christmas Sale
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl font-montserrat mb-6 text-red-200">
              Magical Deals for a Sparkling Holiday
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Gift className="w-5 h-5" />
                <span className="font-gotham text-sm uppercase tracking-wider">Special Offers</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Clock className="w-5 h-5" />
                <span className="font-gotham text-sm uppercase tracking-wider">Limited Time</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Breadcrumb */}
      <Section variant="light" padding="sm">
        <Container>
          <nav className="flex items-center gap-2 text-sm font-montserrat text-gray-600">
            <Link href="/" className="hover:text-classic-green transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-red-600 font-medium">Christmas Sale</span>
          </nav>
        </Container>
      </Section>

      {/* Christmas Countdown Timer
      <Section variant="light" padding="sm">
        <Container>
          <div className="flex justify-center">
            <ChristmasCountdown />
          </div>
        </Container>
      </Section> */}

      {/* Sidebar + Products Section */}
      <Section variant="light" padding="lg" className="bg-gradient-to-b from-white via-red-50/30 to-white pb-24 lg:pb-16">
        <Container>
          <div className="flex gap-8">
            {/* Left Sidebar - Desktop Only */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
                <div className="mb-6 p-4 bg-gradient-to-br from-red-50 to-green-50 rounded-lg border border-red-100">
                  <h3 className="font-playfair text-lg text-red-800 mb-2">🎄 Christmas Special</h3>
                  <p className="text-sm text-gray-600">Find the perfect gift for your loved ones this holiday season!</p>
                </div>
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
            </aside>

            {/* Main Content - Products */}
            <div ref={productsRef} className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                <div>
                  <p className="text-gray-600 font-montserrat text-sm sm:text-base">
                    Showing <span className="font-semibold text-red-600">{displayedProducts.length}</span> of {filteredAndSortedProducts.length} Christmas deals
                    {filteredAndSortedProducts.length !== products.length && (
                      <span className="text-gray-400"> (filtered from {products.length})</span>
                    )}
                  </p>
                  {searchQuery && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Results for "<span className="font-semibold">{searchQuery}</span>"
                    </p>
                  )}
                </div>
              </div>
              
              {filteredAndSortedProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500 font-montserrat">No Christmas deals match your filters.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setPriceRange([0, 500000]);
                      setShowFeaturedOnly(false);
                      setActiveCategory('all');
                    }}
                    className="mt-4 text-red-600 hover:underline font-gotham text-sm uppercase tracking-wider"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Products Display */}
              {viewMode === 'grid' ? (
                <ProductGrid
                  products={displayedProducts}
                  onQuickView={setSelectedProduct}
                />
              ) : (
                <ProductListView
                  products={displayedProducts}
                  onQuickView={setSelectedProduct}
                />
              )}

              {/* Load More Section */}
              {hasMore && (
                <div className="mt-8 flex flex-col items-center gap-4">
                  {isLoadingMore ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                      <span className="text-sm font-montserrat">Loading more deals...</span>
                    </div>
                  ) : (
                    <button
                      onClick={loadMore}
                      className="px-6 py-3 border border-red-600 text-red-600 rounded-lg font-gotham text-sm uppercase tracking-wider hover:bg-red-600 hover:text-white transition-colors"
                    >
                      Load More Deals
                    </button>
                  )}
                </div>
              )}
              
              {/* Sentinel for intersection observer */}
              <div ref={sentinelRef} className="h-10" />
              
              {/* End of products message */}
              {!hasMore && displayedProducts.length > 0 && (
                <div className="mt-8 text-center text-gray-500 font-montserrat text-sm">
                  You've seen all our Christmas deals! 🎅
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Mobile Bottom Sticky Bar with Christmas Theme */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-red-600 to-green-600 border-t border-red-700 shadow-lg z-50 safe-area-inset-bottom">
        <div className="flex">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 text-white font-gotham text-xs uppercase tracking-wider border-r border-red-400 active:bg-red-700"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
          <button
            onClick={() => setShowMobileSort(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 text-white font-gotham text-xs uppercase tracking-wider active:bg-red-700"
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort
          </button>
        </div>
      </div>

      {/* Mobile Filter Modal with Christmas Theme */}
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
              <div className="sticky top-0 bg-gradient-to-r from-red-600 to-green-600 border-b border-red-200 p-4 flex items-center justify-between z-10">
                <h2 className="font-playfair text-xl text-white">Christmas Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="p-4">
                <div className="mb-4 p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-800 font-medium">🎁 Find the perfect Christmas gift!</p>
                </div>
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
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-green-600 text-white rounded-lg font-gotham text-sm uppercase tracking-wider"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sort Modal */}
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
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-red-600 to-green-600">
                <h2 className="font-playfair text-xl text-white">Sort By</h2>
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
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowMobileSort(false);
                    }}
                    className={`w-full text-left py-3 px-4 rounded-lg text-sm font-montserrat transition-all ${
                      sortBy === option.value
                        ? 'bg-red-100 text-red-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
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
    </div>
  );
}

export default function ChristmasSalePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Christmas Deals...</div>}>
      <ChristmasSalePageContent />
    </Suspense>
  );
}
