'use client';

import { useState, useMemo } from 'react';
import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Grid3x3, List, ChevronDown, ChevronUp } from 'lucide-react';

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
  productCounts?: Record<string, number>;
}

export default function ProductFilters({
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  priceRange,
  onPriceRangeChange,
  showFeaturedOnly,
  onFeaturedToggle,
  productCounts = {},
}: ProductFiltersProps) {
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);
  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    price: true,
    categories: true,
    view: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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
      {/* Sort By Section */}
      <div className="border-b border-gray-200 pb-6">
        <button
          onClick={() => toggleSection('sort')}
          className="flex items-center justify-between w-full mb-4"
        >
          <h3 className="font-playfair text-lg text-gray-900">Sort By</h3>
          {expandedSections.sort ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.sort && (
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === option.value}
                  onChange={() => onSortChange(option.value)}
                  className="w-4 h-4 text-bronze-gold border-gray-300 focus:ring-bronze-gold"
                />
                <span className={cn(
                  'text-sm font-montserrat transition-colors',
                  sortBy === option.value ? 'text-bronze-gold font-medium' : 'text-gray-600 group-hover:text-gray-900'
                )}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter Section */}
      <div className="border-b border-gray-200 pb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-4"
        >
          <h3 className="font-playfair text-lg text-gray-900">Price Filter</h3>
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.price && (
          <div className="space-y-4">
            <div className="relative pt-2">
              <input
                type="range"
                min="0"
                max="500000"
                step="10000"
                value={localPriceRange[0]}
                onChange={(e) => setLocalPriceRange([Number(e.target.value), localPriceRange[1]])}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-classic-green"
              />
              <input
                type="range"
                min="0"
                max="500000"
                step="10000"
                value={localPriceRange[1]}
                onChange={(e) => setLocalPriceRange([localPriceRange[0], Number(e.target.value)])}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-classic-green mt-2"
              />
            </div>
            <div className="flex items-center justify-between text-sm font-montserrat text-gray-700">
              <span>₹{localPriceRange[0].toLocaleString()}</span>
              <span>-</span>
              <span>₹{localPriceRange[1].toLocaleString()}</span>
            </div>
            <button
              onClick={handlePriceRangeApply}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-gotham text-xs uppercase tracking-wider transition-colors"
            >
              Filter
            </button>
          </div>
        )}
      </div>

      {/* Product Status Section */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="font-playfair text-lg text-gray-900 mb-4">Product Status</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={showFeaturedOnly}
              onChange={() => onFeaturedToggle(!showFeaturedOnly)}
              className="w-4 h-4 text-bronze-gold border-gray-300 rounded focus:ring-bronze-gold"
            />
            <span className={cn(
              'text-sm font-montserrat transition-colors',
              showFeaturedOnly ? 'text-bronze-gold font-medium' : 'text-gray-600 group-hover:text-gray-900'
            )}>
              Featured Only
            </span>
          </label>
        </div>
      </div>

      {/* Categories Section */}
      <div className="border-b border-gray-200 pb-6">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full mb-4"
        >
          <h3 className="font-playfair text-lg text-gray-900">Categories</h3>
          {expandedSections.categories ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.categories && (
          <div className="space-y-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.slug)}
                className={cn(
                  'flex items-center justify-between w-full py-2 px-3 rounded-lg text-sm font-montserrat transition-all',
                  activeCategory === category.slug
                    ? 'bg-classic-green/10 text-classic-green font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <span className="flex items-center gap-2">
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    activeCategory === category.slug ? 'bg-classic-green' : 'bg-gray-300'
                  )} />
                  {category.label}
                </span>
                {productCounts[category.slug] !== undefined && (
                  <span className="text-xs text-gray-400">
                    {productCounts[category.slug]}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* View Mode Section */}
      <div>
        <button
          onClick={() => toggleSection('view')}
          className="flex items-center justify-between w-full mb-4"
        >
          <h3 className="font-playfair text-lg text-gray-900">View Mode</h3>
          {expandedSections.view ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {expandedSections.view && (
          <div className="flex gap-2">
            <button
              onClick={() => onViewModeChange('grid')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all font-gotham text-xs uppercase tracking-wider',
                viewMode === 'grid'
                  ? 'bg-classic-green text-white border-classic-green'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              )}
            >
              <Grid3x3 className="w-4 h-4" />
              Grid
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all font-gotham text-xs uppercase tracking-wider',
                viewMode === 'list'
                  ? 'bg-classic-green text-white border-classic-green'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              )}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

