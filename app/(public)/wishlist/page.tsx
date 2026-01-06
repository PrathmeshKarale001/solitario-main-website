'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/lib/wishlist-context';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import { Section, Container } from '@/components/ui';


// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
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
              <button
                onClick={clearWishlist}
                className="mt-4 md:mt-0 text-sm text-brand-500 hover:text-error transition-colors font-montserrat flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear Wishlist
              </button>
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
        </Container>
      </Section>
    </div>
  );
}
