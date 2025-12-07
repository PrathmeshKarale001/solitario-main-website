'use client';

import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/lib/data';
import ProductFilters from '@/components/products/ProductFilters';
import ProductGrid from '@/components/products/ProductGrid';
import ProductListView from '@/components/products/ProductListView';
import { Section, Container, QuickLookModal } from '@/components/ui';
import SplitText from '@/components/ui/SplitText';

const PRODUCTS_PER_PAGE = 12;

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const videoRef = useRef<HTMLVideoElement>(null);
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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay was prevented, handle silently
      });
    }
  }, []);

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
      {/* Hero Section with Video Background */}
      <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden -mt-14 sm:-mt-16 lg:-mt-20 pt-14 sm:pt-16 lg:pt-20">
        {/* Video Background */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center -40%' }}
        >
          <source src="/images/general/SabrinaKissingFrameWebsite.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        
        {/* Split Text Overlay */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between w-full">
            {/* Left Text - "Discover" */}
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              animate={{ opacity: 1, x: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 text-left pr-4 md:pr-6"
              style={{ justifyContent: "flex-start", alignItems: "flex-start", display: "flex" }}
            >
              <h1 
                className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-aguila text-white leading-[1.1] tracking-tight ml-0 md:ml-[-1rem] lg:ml-[-2rem] xl:ml-[-2rem]"
                style={{ 
                  fontFamily: 'var(--font-aguila), serif',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                }}
              >
                <SplitText delay={0.2} duration={0.6} className="font-aguila">
                  Discover
                </SplitText>
              </h1>
            </motion.div>
 
            {/* Center Space - Reserved for model */}
            <div className="flex-shrink-0 w-0 md:w-16 lg:w-32 xl:w-40" />
            
            {/* Right Text - "The Sparkle" in one line */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 80 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex-1 text-right pl-4 md:pl-8 flex items-center justify-end"
            >
              <h1 
                className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-aguila text-white leading-[1.1] tracking-tight whitespace-nowrap"
                style={{ 
                  fontFamily: 'var(--font-aguila), serif',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                }}
              >
                <SplitText delay={0.6} duration={0.6} className="font-aguila">
                   The   Sparkle
                </SplitText>
              </h1>
            </motion.div>
          </div>
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


