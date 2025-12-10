'use client';

import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/lib/data';
import ProductFilters from '@/components/products/ProductFilters';
import ProductGrid from '@/components/products/ProductGrid';
import ProductListView from '@/components/products/ProductListView';
import { Section, Container, QuickLookModal } from '@/components/ui';
import Image from 'next/image';

const PRODUCTS_PER_PAGE = 12;

// Hero images - Desktop versions
const HERO_IMAGES_DESKTOP = [
  // '/images/home-hero/Great Places to Work Creatives Sept 2025-10 Solitario Website.jpg',
  '/images/home-hero/Dagaduseth Web Banner 4-03.jpg',
  '/images/home-hero/Web_Banner_YouTube-01.jpg',
  '/images/home-hero/Dagaduseth Web Banner-02.jpg',
  '/images/home-hero/WedforDesktop_Bling better-1920X1070.png',
];

// Hero images - Mobile versions
const HERO_IMAGES_MOBILE = [
  '/images/home-hero/Great Places to Work Creatives Sept 2025-11 Solitario Mobile Website.jpg',
  '/images/home-hero/Web_Banner_Mobile-01.jpg',
  '/images/home-hero/WedforMobile_Bling better-480x530.png',
];

function ProductsPageContent() {
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
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products on mount via API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get current hero images based on viewport
  const heroImages = isMobile ? HERO_IMAGES_MOBILE : HERO_IMAGES_DESKTOP;

  // Start cycling images
  useEffect(() => {
    const images = isMobile ? HERO_IMAGES_MOBILE : HERO_IMAGES_DESKTOP;
    imageIntervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 6000);

    return () => {
      if (imageIntervalRef.current) clearInterval(imageIntervalRef.current);
    };
  }, [isMobile]);

  // Reset index when viewport changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [isMobile]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
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

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredAndSortedProducts, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, priceRange, showFeaturedOnly, sortBy]);

  // Scroll to products section when page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div>
      {/* Hero Section with Image Carousel */}
      <section className="relative min-h-[80vh] md:min-h-[91vh] flex items-end justify-center overflow-hidden -mt-14 sm:-mt-16 lg:-mt-20">
        {/* Image Background with Crossfade */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            {heroImages.map((imageSrc, index) => (
              index === currentImageIndex % heroImages.length && (
                <motion.div
                  key={`${isMobile ? 'mobile' : 'desktop'}-${index}`}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={imageSrc}
                    alt={`Products hero ${index + 1}`}
                    fill
                    className="object-cover object-center"
                    priority={index === 0}
                    quality={index === 0 ? 85 : 75}
                    sizes="100vw"
                  />
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-[1]" style={{ height: '20%', bottom: 0, top: 'auto' }} />
        {/* Image Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentImageIndex % heroImages.length
                  ? 'w-8 bg-classic-green'
                  : 'w-2 bg-classic-green/30 hover:bg-classic-green/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Filters & Products Section - Merged */}
      <Section variant="light" padding="lg" className="bg-gradient-to-b from-white via-ivory-pearl/30 to-white">
        <Container>
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
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
            />
          </motion.div>

          {/* Products */}
          <motion.div
            ref={productsRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="scroll-mt-20"
          >
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
              <div>
                <p className="text-gray-600 font-montserrat text-sm sm:text-base">
                  Showing <span className="font-semibold text-classic-green">{paginatedProducts.length}</span> of {filteredAndSortedProducts.length} products
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
              {totalPages > 1 && (
                <p className="text-xs sm:text-sm text-gray-500 font-montserrat">
                  Page {currentPage} of {totalPages}
                </p>
              )}
            </div>
            
            {filteredAndSortedProducts.length === 0 && (
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

            {/* Products Display - Using paginated products */}
            {viewMode === 'grid' ? (
              <ProductGrid
                products={paginatedProducts}
                onQuickView={setSelectedProduct}
              />
            ) : (
              <ProductListView
                products={paginatedProducts}
                onQuickView={setSelectedProduct}
              />
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Mobile: Simple prev/next */}
                <div className="flex items-center gap-2 sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-4 py-2.5 rounded-lg bg-classic-green text-white disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>
                  <span className="px-4 py-2 text-sm font-montserrat text-gray-600">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-4 py-2.5 rounded-lg bg-classic-green text-white disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Desktop: Full pagination */}
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:border-classic-green hover:text-classic-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {getPageNumbers().map((page, idx) => (
                    typeof page === 'number' ? (
                      <button
                        key={idx}
                        onClick={() => handlePageChange(page)}
                        className={`min-w-[40px] h-10 rounded-lg font-montserrat text-sm transition-colors ${
                          currentPage === page
                            ? 'bg-classic-green text-white'
                            : 'border border-gray-200 hover:border-classic-green hover:text-classic-green'
                        }`}
                      >
                        {page}
                      </button>
                    ) : (
                      <span key={idx} className="px-2 text-gray-400">...</span>
                    )
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:border-classic-green hover:text-classic-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </Container>
      </Section>

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


