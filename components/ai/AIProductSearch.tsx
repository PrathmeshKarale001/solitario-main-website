/**
 * AI Product Search Component
 * 
 * Allows customers to search products using natural language via Shopify MCP
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Sparkles, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface SearchResult {
  name: string;
  price: string;
  currency: string;
  variant_id: string;
  url: string;
  image_url: string;
  description: string;
}

export default function AIProductSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  // Check if MCP is enabled
  useEffect(() => {
    setIsEnabled(process.env.NEXT_PUBLIC_FEATURE_MCP_ENABLED === 'true');
  }, []);

  // If MCP is disabled, show disabled message
  if (!isEnabled) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-2">AI Search is currently disabled</p>
          <p className="text-gray-500 text-sm">
            This feature is not available in production at this time.
          </p>
        </div>
      </div>
    );
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    setIsSearching(true);
    setError(null);
    setShowResults(true);

    try {
      console.log('[AI Search] Searching for:', query.trim());
      
      const response = await fetch('/api/mcp/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          context: 'Customer browsing lab-grown diamond jewellery',
        }),
      });

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('[AI Search] Non-JSON response:', text.substring(0, 500));
        setError('Server configuration error. Please ensure Shopify API credentials are set correctly.');
        return;
      }

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('[AI Search] API Error:', errorData);
        setError(errorData.error || `Error ${response.status}: ${response.statusText}`);
        return;
      }

      const data = await response.json();
      console.log('[AI Search] Response:', data);

      if (data.success && data.results?.content) {
        // Parse the MCP response content
        const content = data.results.content;
        
        // Handle different response formats
        if (Array.isArray(content)) {
          console.log('[AI Search] Found', content.length, 'products');
          setResults(content);
          if (content.length === 0) {
            setError(null); // Clear error, will show "No products found" message
          }
        } else if (content.text) {
          // If text response, try to parse as JSON
          try {
            const parsed = JSON.parse(content.text);
            setResults(Array.isArray(parsed) ? parsed : []);
          } catch {
            console.error('[AI Search] Failed to parse content.text');
            setError('Unable to parse search results');
            setResults([]);
          }
        } else {
          console.log('[AI Search] Unexpected content format:', content);
          setResults([]);
        }
      } else if (data.success === false) {
        console.error('[AI Search] API returned error:', data.error);
        setError(data.error || 'Search failed. Please try again.');
        setResults([]);
      } else {
        console.log('[AI Search] No results in response');
        setResults([]);
      }
    } catch (err) {
      console.error('[AI Search] Exception:', err);
      setError('Failed to connect to search service. Please check your internet connection and try again.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setError(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me anything... (e.g., 'Show me diamond rings under ₹20,000')"
            className="w-full pl-12 pr-24 py-4 rounded-xl border-2 border-gray-200 focus:border-classic-green focus:outline-none focus:ring-2 focus:ring-classic-green/20 text-gray-900 placeholder-gray-400 font-montserrat transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-classic-green hover:bg-classic-green/90 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6"
          >
            {isSearching ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-classic-green mx-auto mb-4" />
                <p className="text-gray-600">Searching our catalog...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            ) : results.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Found {results.length} result{results.length !== 1 ? 's' : ''}
                  </h3>
                  <button
                    onClick={clearSearch}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((product, index) => (
                    <motion.div
                      key={product.variant_id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={product.url}
                        className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-bronze-gold hover:shadow-lg transition-all"
                      >
                        {product.image_url && (
                          <div className="relative aspect-square bg-gray-50">
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-contain p-4"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h4 className="font-playfair text-lg text-gray-900 mb-2 line-clamp-2">
                            {product.name}
                          </h4>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <p className="text-xl font-bold text-classic-green">
                            {formatPrice(parseFloat(product.price), product.currency === 'INR' ? '₹' : '$')}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-3">No products found. Try a different search term.</p>
                <p className="text-gray-500 text-sm">
                  Try searching for: <span className="font-medium">rings</span>, <span className="font-medium">diamond necklace</span>, or <span className="font-medium">gold earrings</span>
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
