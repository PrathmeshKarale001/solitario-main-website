'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, ArrowRight, Share2, Package, Check, AlertTriangle, Copy, CheckCheck, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useWishlist } from '@/lib/wishlist-context';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import { Section, Container } from '@/components/ui';


// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, refreshPrices, isRefreshing } = useWishlist();
  const { addToCart } = useCart();
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Refresh prices when page loads
  useEffect(() => {
    refreshPrices();
  }, [refreshPrices]);

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
  };

  const handleAddAllToCart = () => {
    wishlist.forEach(product => {
      addToCart(product, 1);
    });
  };

  const handleShareWishlist = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    setShareLink(url);
    setShowShareModal(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-pearl via-white to-ivory-pearl pt-20">
      <Section variant="light" padding="lg">
        <Container>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair text-brand-800 mb-2">
                My Wishlist
              </h1>
              <p className="text-brand-500 font-montserrat">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            {wishlist.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
                <button
                  onClick={handleAddAllToCart}
                  className="flex items-center gap-2 px-4 py-2 bg-classic-green text-white rounded-lg hover:bg-classic-green/90 transition-colors text-sm font-medium"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add All to Cart
                </button>
                <button
                  onClick={() => refreshPrices()}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50"
                  title="Refresh prices from Shopify"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh Prices'}
                </button>
                <button
                  onClick={handleShareWishlist}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={clearWishlist}
                  className="text-sm text-brand-500 hover:text-error transition-colors font-montserrat flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Empty State */}
          {wishlist.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-brand-300" />
              </div>
              <h2 className="text-2xl font-playfair text-brand-800 mb-3">Your wishlist is empty</h2>
              <p className="text-brand-500 font-montserrat mb-6 max-w-md mx-auto">
                Start adding items you love to your wishlist. They'll be saved here for you to revisit anytime.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-classic-green text-white rounded-lg hover:bg-classic-green/90 transition-colors font-gotham text-sm uppercase tracking-wider"
              >
                Explore Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}

          {/* Wishlist Grid */}
          {wishlist.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-brand border border-brand-100 overflow-hidden group hover:shadow-brand-lg transition-shadow"
                >
                  {/* Image */}
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="aspect-square relative bg-brand-50">
                      <Image
                        src={product.image || '/images/placeholder.svg'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.featured && (
                        <div className="absolute top-3 left-3 bg-bronze-gold text-white px-3 py-1 rounded-full text-xs font-gotham uppercase tracking-wider">
                          Featured
                        </div>
                      )}
                      {/* Stock Status Badge */}
                      <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${product.inStock !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.inStock !== false ? (
                          <><Check className="w-3 h-3" /> In Stock</>
                        ) : (
                          <><AlertTriangle className="w-3 h-3" /> Out of Stock</>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-4">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-playfair text-lg text-brand-800 mb-1 hover:text-classic-green transition-colors truncate">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-brand-500 font-montserrat capitalize mb-2">
                      {product.category}
                    </p>
                    <p className="font-gotham text-classic-green font-semibold text-lg mb-4">
                      {formatPrice(product.price, product.currency)}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-classic-green text-white rounded-lg hover:bg-classic-green/90 transition-colors text-sm font-montserrat"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="p-2.5 bg-brand-100 hover:bg-error/10 rounded-lg transition-colors group/remove"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4 text-brand-500 group-hover/remove:text-error transition-colors" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Continue Shopping */}
          {wishlist.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-classic-green hover:text-classic-green/80 transition-colors font-montserrat"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Share Modal */}
          {showShareModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-playfair text-xl text-gray-900">Share Wishlist</h3>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">Share your wishlist with friends and family!</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-classic-green text-white rounded-lg hover:bg-classic-green/90 transition-colors flex items-center gap-2"
                  >
                    {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
