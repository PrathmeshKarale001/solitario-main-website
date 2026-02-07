'use client';

import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { Product } from '@/lib/data';
import ProductFilters from '@/components/products/ProductFilters';
import ProductGrid from '@/components/products/ProductGrid';
import ProductListView from '@/components/products/ProductListView';
import { Section, Container, QuickLookModal } from '@/components/ui';
import { DCBannerSlider } from '@/components/home';
import DynamicShopHero from '@/components/products/DynamicShopHero';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
const PRODUCTS_PER_PAGE = 12;
const LOAD_MORE_THRESHOLD = 12;

// Hero images - Desktop versions (new Shop images first, then existing last)
const HERO_IMAGES_DESKTOP = [
    // { src: '/images/banners/dc/dc7.jpg', pos: 'object-center' },
  { src: '/images/home-hero/newhero/2nd.png', pos: 'object-center' },
  { src: '/images/Shop/shop1desk.jpeg', pos: 'object-[50%_0%]' },
  { src: '/images/Shop/2.webp', pos: 'object-[50%_20%]' },
  { src: '/images/Shop/3.webp', pos: 'object-[50%_25%]' },
];

// Hero images - Mobile versions
const HERO_IMAGES_MOBILE = [
  // { src: '/images/banners/dc/dc7.jpg', pos: 'object-center' },
  { src: '/images/home-hero/newhero/2ndMobile.png', pos: 'object-center' },
  { src: '/images/Shop/shop1mobile.jpeg', pos: 'object-[50%_20%]' },
  { src: '/images/Shop/ShopMobile2.webp', pos: 'object-[50%_20%]' },
];

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('category');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const imageIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all');
  const [sortBy, setSortBy] = useState('relevance');
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

  // Mount check to prevent SSR issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load products using React Query for automatic caching and deduplication
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('🔄 Starting products fetch...');
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        console.error('❌ Failed to fetch products:', response.status);
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      if (!data.products || !Array.isArray(data.products)) {
        console.error('❌ Invalid products data:', data);
        throw new Error('Invalid products data');
      }
      
      console.log(`✅ Loaded ${data.products.length} products`);
      return data.products;
    },
    enabled: mounted, // Only fetch when mounted
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    gcTime: 30 * 60 * 1000, // 30 minutes - cache time
  });

  // Update local state when React Query data changes
  useEffect(() => {
    if (productsData) {
      setProducts(productsData);
      setLoading(false);
    } else if (isLoadingProducts) {
      setLoading(true);
    }
  }, [productsData, isLoadingProducts]);

  // Get current hero images based on viewport
  const heroImages = isMobile ? HERO_IMAGES_MOBILE : HERO_IMAGES_DESKTOP;

  // Filter and sort products
  const filteredAndSortedProducts: Product[] = useMemo(() => {
    let productList = [...products];

    // ALWAYS filter out gift products (SKU: GIFT) - they should never appear in listings
    productList = productList.filter(product => product.sku !== 'GIFT');

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
      case 'relevance':
        // Price-tiered shuffling: 0-15K, 15K-25K, 25K-35K, etc. with consistent shuffle using product ID as seed
        const priceRanges = [
          { min: 0, max: 15000 },
          { min: 15000, max: 25000 },
          { min: 25000, max: 35000 },
          { min: 35000, max: 50000 },
          { min: 50000, max: 75000 },
          { min: 75000, max: 100000 },
          { min: 100000, max: Infinity }
        ];
        
        const sortedByRanges: Product[] = [];
        
        priceRanges.forEach(range => {
          const rangeProducts = productList.filter(product => 
            product.price >= range.min && product.price < range.max
          );
          // Consistent shuffle using product ID hash - same order for all users
          const shuffledRangeProducts = rangeProducts.sort((a, b) => {
            const hashA = a.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const hashB = b.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            return hashA - hashB;
          });
          sortedByRanges.push(...shuffledRangeProducts);
        });
        
        productList = sortedByRanges;
        break;
      case 'price-low':
        // Simple ascending price sort
        productList.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        // Simple descending price sort
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
        // Featured products first, then regular products
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
          // Simulate loading delay for better UX
          await new Promise(resolve => setTimeout(resolve, 500));
          
          setDisplayedProducts(prev => {
            const currentLength = prev.length;
            const nextBatch = filteredAndSortedProducts.slice(
              currentLength,
              currentLength + LOAD_MORE_THRESHOLD
            );
            const newProducts = [...prev, ...nextBatch];
            
            // Check if there are more products to load
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

  // Detect mobile viewport - only after mount
  useEffect(() => {
    if (!mounted) return;
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mounted]);

  // Start cycling images - only after mount
  useEffect(() => {
    if (!mounted) return;
    const images = isMobile ? HERO_IMAGES_MOBILE : HERO_IMAGES_DESKTOP;
    imageIntervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 6000);

    return () => {
      if (imageIntervalRef.current) clearInterval(imageIntervalRef.current);
    };
  }, [isMobile, mounted]);

  // Reset index when viewport changes
  useEffect(() => {
    if (!mounted) return;
    setCurrentImageIndex(0);
  }, [isMobile, mounted]);


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

  // Show simple loading screen until mounted (prevents SSR render issues)
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-classic-green"></div>
          <p className="text-gray-600 font-montserrat">Loading shop...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Dynamic Shop Hero */}
      <DynamicShopHero />

      {/* DC COLLECTION SLIDER - FULL WIDTH */}
      {process.env.NEXT_PUBLIC_FEATURE_DC_BANNERS_ENABLED === 'true' && <DCBannerSlider />}

      {/* Christmas Sale Banner - HIDDEN */}
      {/* <section className="bg-white py-4">
        <div className="relative overflow-hidden w-full h-[130px] sm:h-[180px] lg:h-[230px] flex items-center justify-center">
          <img
            src="/images/christmas-offer.jpg"
            alt="Christmas Sale - Special Offers"
            className="w-full h-full object-contain cursor-pointer"
            onClick={() => router.push('/christmas-sale')}
          />
        </div>
      </section> */}

      {/* Sidebar + Products Section */}
      <Section variant="light" padding="sm" className="bg-gradient-to-b from-white via-ivory-pearl/30 to-white pb-16 lg:pb-12">
        <Container>
          <div className="flex gap-8">
            {/* Left Sidebar - Desktop Only, Fixed Position */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 max-h-[calc(100vh-140px)] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
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
            <div
              ref={productsRef}
              className="flex-1 min-w-0"
            >
              {/* Results Header */}
              {!loading && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                  <div>
                    <p className="text-gray-600 font-montserrat text-sm sm:text-base">
                      Showing <span className="font-semibold text-classic-green">{displayedProducts.length}</span> of {filteredAndSortedProducts.length} products
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
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-24">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-classic-green"></div>
                    <p className="text-gray-600 font-montserrat">Loading products...</p>
                  </div>
                </div>
              )}

              {/* No Products Message */}
              {!loading && filteredAndSortedProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500 font-montserrat">No products match your filters.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setPriceRange([0, 500000]);
                      setShowFeaturedOnly(false);
                      setActiveCategory('all');
                    }}
                    className="mt-4 text-bronze-gold hover:underline font-gotham text-sm uppercase tracking-wider"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Products Display - Using displayed products for infinite scroll */}
              {!loading && viewMode === 'grid' ? (
                <ProductGrid
                  products={displayedProducts}
                  onQuickView={setSelectedProduct}
                />
              ) : !loading ? (
                <ProductListView
                  products={displayedProducts}
                  onQuickView={setSelectedProduct}
                />
              ) : null}

              {/* Load More Section */}
              {hasMore && (
                <div className="mt-8 flex flex-col items-center gap-4">
                  {isLoadingMore ? (
                    <div className="flex items-center gap-2 text-classic-green">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-classic-green"></div>
                      <span className="text-sm font-montserrat">Loading more products...</span>
                    </div>
                  ) : (
                    <button
                      onClick={loadMore}
                      className="px-6 py-3 border border-classic-green text-classic-green rounded-lg font-gotham text-sm uppercase tracking-wider hover:bg-classic-green hover:text-white transition-colors"
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
            </div>
          </div>
        </Container>
      </Section>

      {/* Mobile Bottom Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-inset-bottom">
        <div className="flex">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 text-gray-700 font-gotham text-xs uppercase tracking-wider border-r border-gray-200 active:bg-gray-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
          <button
            onClick={() => setShowMobileSort(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 text-gray-700 font-gotham text-xs uppercase tracking-wider active:bg-gray-50"
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort
          </button>
        </div>
      </div>

      {/* Mobile Filter Modal */}
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
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
                <h2 className="font-montserrat font-bold text-xl text-gray-900">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
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
                  className="w-full py-3 bg-classic-green text-white rounded-lg font-gotham text-sm uppercase tracking-wider"
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
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-montserrat font-bold text-xl text-gray-900">Sort By</h2>
                <button
                  onClick={() => setShowMobileSort(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
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
                        ? 'bg-classic-green/10 text-classic-green font-medium'
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}




