'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { SlidersHorizontal, X, Search, Grid3x3, List, ArrowUpDown } from 'lucide-react';

export interface ProductFiltersProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  showFeaturedOnly: boolean;
  onFeaturedToggle: (show: boolean) => void;
}

export default function ProductFilters({
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  priceRange,
  onPriceRangeChange,
  showFeaturedOnly,
  onFeaturedToggle,
}: ProductFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showSortDropdown && !target.closest('.sort-dropdown-container')) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSortDropdown]);

  const handlePriceRangeApply = () => {
    onPriceRangeChange(localPriceRange);
  };

  const sortOptions = [
    { value: 'featured', label: 'Featured First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
  ];

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-bronze-gold/20 focus:border-bronze-gold transition-all font-montserrat text-sm"
        />
      </div>

      {/* Category Filter Pills - Horizontal scroll on mobile */}
      <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:justify-center scrollbar-hide">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.slug)}
              className={cn(
                'flex-shrink-0 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-gotham text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.15em] transition-all duration-300 touch-manipulation',
                activeCategory === category.slug
                  ? 'bg-gradient-to-r from-bronze-gold to-bronze-gold/80 text-white shadow-luxury-lg'
                  : 'bg-white text-gray-700 hover:bg-bronze-gold/10 hover:text-bronze-gold border border-gray-200 hover:shadow-luxury hover:border-bronze-gold/30'
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        {/* Left: Sort & Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Sort Dropdown */}
          <div className="relative sort-dropdown-container">
            <button 
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full hover:border-bronze-gold/50 hover:shadow-luxury transition-all font-gotham text-xs uppercase tracking-[0.15em] text-gray-700"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>Sort</span>
            </button>
            <AnimatePresence>
              {showSortDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-luxury-lg border border-gray-100 z-50"
                >
                  <div className="p-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onSortChange(option.value);
                          setShowSortDropdown(false);
                        }}
                        className={cn(
                          'w-full text-left px-4 py-2.5 rounded-lg text-sm font-montserrat transition-all',
                          sortBy === option.value
                            ? 'bg-bronze-gold/10 text-bronze-gold font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all font-gotham text-xs uppercase tracking-[0.15em]',
              showAdvancedFilters
                ? 'bg-bronze-gold/10 border-bronze-gold text-bronze-gold'
                : 'bg-white border-gray-200 text-gray-700 hover:border-bronze-gold/50 hover:shadow-luxury'
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Featured Toggle */}
          <button
            onClick={() => onFeaturedToggle(!showFeaturedOnly)}
            className={cn(
              'px-4 py-2.5 rounded-full border transition-all font-gotham text-xs uppercase tracking-[0.15em]',
              showFeaturedOnly
                ? 'bg-bronze-gold text-white border-bronze-gold shadow-luxury'
                : 'bg-white border-gray-200 text-gray-700 hover:border-bronze-gold/50'
            )}
          >
            ⭐ Featured
          </button>
        </div>

        {/* Right: View Toggle */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'p-2 rounded-lg transition-all',
              viewMode === 'grid'
                ? 'bg-bronze-gold text-white shadow-luxury'
                : 'text-gray-400 hover:text-gray-600'
            )}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={cn(
              'p-2 rounded-lg transition-all',
              viewMode === 'list'
                ? 'bg-bronze-gold text-white shadow-luxury'
                : 'text-gray-400 hover:text-gray-600'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-br from-ivory-pearl/50 to-white rounded-2xl p-6 border border-gray-200 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-didot text-lg text-gray-900">Price Range</h3>
                <button
                  onClick={() => {
                    setLocalPriceRange([0, 500000]);
                    onPriceRangeChange([0, 500000]);
                  }}
                  className="text-xs text-bronze-gold hover:underline font-gotham"
                >
                  Reset
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-2 font-gotham uppercase tracking-wider">
                      Min: ₹{localPriceRange[0].toLocaleString()}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="10000"
                      value={localPriceRange[0]}
                      onChange={(e) => setLocalPriceRange([Number(e.target.value), localPriceRange[1]])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-bronze-gold"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-2 font-gotham uppercase tracking-wider">
                      Max: ₹{localPriceRange[1].toLocaleString()}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="10000"
                      value={localPriceRange[1]}
                      onChange={(e) => setLocalPriceRange([localPriceRange[0], Number(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-bronze-gold"
                    />
                  </div>
                </div>
                <button
                  onClick={handlePriceRangeApply}
                  className="w-full py-2.5 bg-bronze-gold hover:bg-bronze-gold/90 text-white rounded-full font-gotham text-xs uppercase tracking-[0.2em] transition-all shadow-luxury hover:shadow-glow"
                >
                  Apply Price Filter
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

