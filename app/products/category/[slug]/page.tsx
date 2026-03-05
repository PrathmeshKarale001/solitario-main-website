'use client';

import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { Product } from '@/lib/data';
import ProductFilters from '@/components/products/ProductFilters';
import ProductGrid from '@/components/products/ProductGrid';
import ProductListView from '@/components/products/ProductListView';
import { Section, Container, QuickLookModal } from '@/components/ui';
import Image from 'next/image';
import Link from 'next/link';

const PRODUCTS_PER_PAGE = 12;

// Category configuration with hero images and metadata
const CATEGORY_CONFIG: Record<string, {
  title: string;
  description: string;
  heroDesktop: string;
  heroMobile: string;
  heroPosition: string;
}> = {
  rings: {
    title: 'Rings',
    description: 'Discover our stunning collection of lab-grown diamond rings, from elegant solitaires to intricate designs.',
    heroDesktop: '/images/category-page-banner/Banner - Rings.jpg.jpeg',
    heroMobile: '/images/category-page-banner/Banner - Rings.jpg.jpeg',
    heroPosition: 'object-[50%_30%]',
  },
  earrings: {
    title: 'Earrings',
    description: 'Elevate your style with our exquisite lab-grown diamond earrings, crafted for modern elegance.',
    heroDesktop: '/images/category-page-banner/Banner- Earrings.jpg.jpeg',
    heroMobile: '/images/category-page-banner/Banner- Earrings.jpg.jpeg',
    heroPosition: 'object-[50%_20%]',
  },
  pendants: {
    title: 'Pendants',
    description: 'Adorn yourself with our beautiful lab-grown diamond pendants, perfect for every occasion.',
    heroDesktop: '/images/category-page-banner/Banner - Necklace.jpg.jpeg',
    heroMobile: '/images/category-page-banner/Banner - Necklace.jpg.jpeg',
    heroPosition: 'object-[50%_25%]',
  },
  necklaces: {
    title: 'Necklaces',
    description: 'Explore our collection of stunning lab-grown diamond necklaces, designed to captivate.',
    heroDesktop: '/images/category-page-banner/Banner - Necklace.jpg.jpeg',
    heroMobile: '/images/category-page-banner/Banner - Necklace.jpg.jpeg',
    heroPosition: 'object-[50%_20%]',
  },
  bracelets: {
    title: 'Bracelets',
    description: 'Complete your look with our elegant lab-grown diamond bracelets, crafted with precision.',
    heroDesktop: '/images/category-page-banner/Banner - Bracelet.jpg.jpeg',
    heroMobile: '/images/category-page-banner/Banner - Bracelet.jpg.jpeg',
    heroPosition: 'object-[50%_30%]',
  },
};

function CategoryPageContent() {
  const params = useParams();
  const slug = params?.slug as string;
  const categoryConfig = CATEGORY_CONFIG[slug] || {
    title: slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Products',
    description: 'Explore our collection of lab-grown diamond jewelry.',
    heroDesktop: '/images/Shop/Banner1 1.webp',
    heroMobile: '/images/Shop/ShopMobile.webp',
    heroPosition: 'object-center',
  };

  const [isMobile, setIsMobile] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);

  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);

  // Fetch products for this category
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        const data = await response.json();
        // Filter by category
        const categoryProducts = (data.products || []).filter(
          (p: Product) => p.category.toLowerCase() === slug?.toLowerCase()
        );
        setProducts(categoryProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      loadProducts();
    }
  }, [slug]);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let productList = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      productList = productList.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
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
        // Custom price range sorting: 0-15K, 15K-25K, 25K-35K, etc. with shuffled products within ranges
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
          // Shuffle products within each range
          const shuffledRangeProducts = rangeProducts.sort(() => Math.random() - 0.5);
          sortedByRanges.push(...shuffledRangeProducts);
        });

        productList = sortedByRanges;
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
  }, [products, searchQuery, priceRange, showFeaturedOnly, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredAndSortedProducts, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priceRange, showFeaturedOnly, sortBy]);

  // Scroll to products section when page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const heroImage = isMobile ? categoryConfig.heroMobile : categoryConfig.heroDesktop;

  return (
    <div>
      {/* Hero Section - matches home hero container sizing */}
      <section className="relative w-full overflow-hidden bg-[#1a1a1a]">
        <div className="relative w-full aspect-[4/5] md:aspect-[16/7] max-h-[85vh] md:max-h-[700px]">
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt={categoryConfig.title}
              fill
              className={`object-cover ${categoryConfig.heroPosition}`}
              priority={true}
              quality={90}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="absolute inset-0 z-10 flex items-end justify-center pb-12 md:pb-16">
            <div className="text-center px-4">
              {/* Breadcrumb */}
              <nav className="flex items-center justify-center gap-2 text-white/70 text-sm mb-4">
                <Link href="/products" className="hover:text-white transition-colors">
                  Shop
                </Link>
                <span>/</span>
                <span className="text-white">{categoryConfig.title}</span>
              </nav>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-white mb-4"
              >
                {categoryConfig.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-white/80 font-montserrat text-sm md:text-base max-w-xl mx-auto"
              >
                {categoryConfig.description}
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <Section variant="light" padding="lg" className="bg-gradient-to-b from-white via-ivory-pearl/30 to-white pb-24 lg:pb-16">
        <Container>
          <div className="flex gap-8">
            {/* Left Sidebar - Desktop Only */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 max-h-[calc(100vh-140px)] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                <ProductFilters
                  activeCategory={slug}
                  onCategoryChange={() => { }}
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
                  productCounts={{ [slug]: products.length }}
                />
              </div>
            </aside>

            {/* Main Content */}
            <div ref={productsRef} className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                <div>
                  <p className="text-gray-600 font-montserrat text-sm sm:text-base">
                    Showing <span className="font-semibold text-classic-green">{paginatedProducts.length}</span> of {filteredAndSortedProducts.length} {categoryConfig.title.toLowerCase()}
                  </p>
                </div>
                {totalPages > 1 && (
                  <p className="text-xs sm:text-sm text-gray-500 font-montserrat">
                    Page {currentPage} of {totalPages}
                  </p>
                )}
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-2 border-classic-green border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-gray-500 font-montserrat">Loading products...</p>
                </div>
              ) : filteredAndSortedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500 font-montserrat">No {categoryConfig.title.toLowerCase()} match your filters.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setPriceRange([0, 500000]);
                      setShowFeaturedOnly(false);
                    }}
                    className="mt-4 text-bronze-gold hover:underline font-gotham text-sm uppercase tracking-wider"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <ProductGrid products={paginatedProducts} onQuickView={setSelectedProduct} />
              ) : (
                <ProductListView products={paginatedProducts} onQuickView={setSelectedProduct} />
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:border-classic-green hover:text-classic-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="px-4 py-2 text-sm font-montserrat text-gray-600">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:border-classic-green hover:text-classic-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
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
                <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <ProductFilters
                  activeCategory={slug}
                  onCategoryChange={() => { }}
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
                  productCounts={{ [slug]: products.length }}
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
                <button onClick={() => setShowMobileSort(false)} className="p-2 hover:bg-gray-100 rounded-full">
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
                    className={`w-full text-left py-3 px-4 rounded-lg text-sm font-montserrat transition-all ${sortBy === option.value
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

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-classic-green border-t-transparent rounded-full" />
      </div>
    }>
      <CategoryPageContent />
    </Suspense>
  );
}
