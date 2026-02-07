'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { isPrebookingProduct, getProductDisplayPrice } from '@/lib/prebooking';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES_KEY = 'solitario_recent_searches';
const MAX_RECENT_SEARCHES = 5;

const popularSearches = [
  'Diamond Ring',
  'Solitaire',
  'Engagement Ring',
  'Gold Earrings',
  'Pendant',
];

// Debounce timeout type
type TimeoutId = ReturnType<typeof setTimeout>;

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>(undefined);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Debounced search
  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      // Filter results client-side for more flexibility
      const filtered = (data.products || []).filter((product: Product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setResults(filtered.slice(0, 8)); // Limit to 8 results
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = (value: string) => {
    setQuery(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      searchProducts(value);
    }, 300);
  };

  // Save search to recent
  const saveRecentSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updated);
    
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  };

  // Handle search submission
  const handleSearch = (searchTerm: string) => {
    saveRecentSearch(searchTerm);
    onClose();
    window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`;
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 right-0 z-[101] max-h-[90vh] overflow-hidden"
          >
            <div className="max-w-3xl mx-auto mt-20 mx-4">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="relative border-b border-brand-100">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-brand-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                    placeholder="Search for rings, earrings, necklaces..."
                    className="w-full pl-14 pr-14 py-5 text-lg font-montserrat focus:outline-none"
                  />
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-brand-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-brand-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {/* Loading State */}
                  {loading && (
                    <div className="p-8 text-center">
                      <div className="w-8 h-8 border-2 border-classic-green border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  )}

                  {/* Search Results */}
                  {!loading && results.length > 0 && (
                    <div className="p-4">
                      <p className="text-xs font-gotham uppercase tracking-wider text-brand-500 mb-3 px-2">
                        Products
                      </p>
                      <div className="space-y-1">
                        {results.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            onClick={() => {
                              saveRecentSearch(product.name);
                              onClose();
                            }}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-brand-50 transition-colors group"
                          >
                            <div className="w-14 h-14 relative rounded-lg overflow-hidden bg-brand-100 flex-shrink-0">
                              <Image
                                src={product.image || '/images/placeholder.svg'}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-montserrat font-bold text-brand-800 group-hover:text-classic-green transition-colors truncate">
                                {product.name}
                              </p>
                              <p className="text-sm text-brand-500 font-montserrat capitalize">
                                {product.category}
                              </p>
                            </div>
                            <p className={`font-gotham font-semibold ${isPrebookingProduct(product) ? 'text-purple-600 text-sm' : 'text-classic-green'}`}>
                              {isPrebookingProduct(product) ? getProductDisplayPrice(product) : formatPrice(product.price, product.currency)}
                            </p>
                            <ArrowRight className="w-4 h-4 text-brand-400 group-hover:text-classic-green group-hover:translate-x-1 transition-all" />
                          </Link>
                        ))}
                      </div>
                      
                      {/* View All Results */}
                      <button
                        onClick={() => handleSearch(query)}
                        className="w-full mt-4 py-3 text-center text-classic-green font-montserrat text-sm hover:bg-classic-green/5 rounded-lg transition-colors"
                      >
                        View all results for "{query}"
                      </button>
                    </div>
                  )}

                  {/* No Results */}
                  {!loading && query && results.length === 0 && (
                    <div className="p-8 text-center">
                      <p className="text-brand-500 font-montserrat">No products found for "{query}"</p>
                      <p className="text-sm text-brand-400 mt-2">Try a different search term</p>
                    </div>
                  )}

                  {/* Default State - Recent & Popular */}
                  {!loading && !query && (
                    <div className="p-4">
                      {/* Recent Searches */}
                      {recentSearches.length > 0 && (
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-3 px-2">
                            <p className="text-xs font-gotham uppercase tracking-wider text-brand-500 flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5" />
                              Recent Searches
                            </p>
                            <button
                              onClick={clearRecentSearches}
                              className="text-xs text-brand-400 hover:text-brand-600 font-montserrat"
                            >
                              Clear
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {recentSearches.map((search, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setQuery(search);
                                  searchProducts(search);
                                }}
                                className="px-4 py-2 bg-brand-50 hover:bg-brand-100 rounded-full text-sm font-montserrat text-brand-700 transition-colors"
                              >
                                {search}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Popular Searches */}
                      <div>
                        <p className="text-xs font-gotham uppercase tracking-wider text-brand-500 mb-3 px-2 flex items-center gap-2">
                          <TrendingUp className="w-3.5 h-3.5" />
                          Popular Searches
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {popularSearches.map((search, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setQuery(search);
                                searchProducts(search);
                              }}
                              className="px-4 py-2 bg-classic-green/5 hover:bg-classic-green/10 rounded-full text-sm font-montserrat text-classic-green transition-colors"
                            >
                              {search}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
