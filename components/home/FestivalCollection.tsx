'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingCart, Heart, Ticket, Sparkles } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import { Section, Container } from '@/components/ui';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/lib/data';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { isPrebookingProduct, getProductDisplayPrice, getProductButtonText } from '@/lib/prebooking';
import { trackMetaAddToCart, trackMetaAddToWishlist } from '@/components/analytics/MetaPixel';
import { getActiveFestival, type FestivalConfig } from '@/lib/festival-config';

export default function FestivalCollection() {
  const [festival, setFestival] = useState<FestivalConfig | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const activeFestival = getActiveFestival();
    setFestival(activeFestival);

    if (!activeFestival) {
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `/api/products?collection=${activeFestival.collectionHandle}&limit=${activeFestival.maxProducts || 4}`
        );
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Failed to load festival products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Don't render anything if no active festival or no products
  if (!festival || (!loading && products.length === 0)) return null;

  const { theme } = festival;

  return (
    <Section
      variant="light"
      padding="sm"
      className="py-6 sm:py-8 md:py-10 relative overflow-hidden"
      style={{ background: theme.bgGradient || undefined }}
    >
      {/* Decorative corner sparkle */}
      <div
        className="absolute top-0 right-0 w-48 h-48 opacity-[0.04] pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${theme.accent}, transparent 70%)`,
        }}
      />

      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-3 sm:mb-6 md:mb-8 text-center"
        >
          {/* Tagline with festival emoji */}
          <span
            className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-gotham mb-2 inline-flex items-center gap-1.5"
            style={{ color: theme.taglineColor }}
          >
            {festival.emoji && <span className="text-sm">{festival.emoji}</span>}
            {festival.tagline}
            {festival.emoji && <span className="text-sm">{festival.emoji}</span>}
          </span>

          <h2
            className="text-xl sm:text-2xl md:text-4xl font-montserrat font-bold mb-2 sm:mb-4"
            style={{ color: theme.headingColor, letterSpacing: '-0.02em' }}
          >
            {festival.heading}
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto font-montserrat hidden sm:block">
            {festival.subtitle}
          </p>
        </motion.div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-10">
            {[...Array(festival.maxProducts || 4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl aspect-square mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-10">
            {products.map((product, index) => {
              const categoryLabel =
                CATEGORIES.find((c) => c.slug === product.category)?.label || product.category;
              const isInWishlist = wishlist.some(item => item.id === product.id);

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group"
                >
                  <div className="relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
                    style={{ '--hover-border': `${theme.accent}4D` } as React.CSSProperties}
                  >
                    {/* Image Container */}
                    <Link href={`/products/${product.id}`} className="block">
                      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-white overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        />

                        {/* Festival Badge */}
                        <div
                          className="absolute top-3 left-3 px-3 py-1 rounded-full shadow-sm flex items-center gap-1"
                          style={{ background: theme.accent, color: '#fff' }}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span className="text-[10px] uppercase tracking-wider font-gotham">
                            {festival.tagline.split(' ')[0]}
                          </span>
                        </div>

                        {/* Category Badge */}
                        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                          <span className="text-[10px] uppercase tracking-wider font-gotham text-gray-700">
                            {categoryLabel}
                          </span>
                        </div>

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isInWishlist) {
                              removeFromWishlist(product.id);
                            } else {
                              addToWishlist(product);
                              trackMetaAddToWishlist({
                                content_ids: [product.id],
                                content_name: product.name,
                                value: product.price,
                                currency: product.currency || 'INR',
                              });
                            }
                          }}
                          className="absolute top-3 right-3 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                          aria-label={isInWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                          />
                        </button>
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-4">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-montserrat font-bold text-sm sm:text-base text-gray-900 line-clamp-1 mb-2 transition-colors min-h-[1.5rem]"
                          style={{ '--tw-text-opacity': 1 } as React.CSSProperties}
                        >
                          {product.name}
                        </h3>
                      </Link>
                      <p className={`font-gotham text-base sm:text-lg font-semibold mb-3 min-h-[1.75rem] ${isPrebookingProduct(product) ? 'text-purple-600' : ''}`}
                        style={!isPrebookingProduct(product) ? { color: theme.accent } : undefined}
                      >
                        {isPrebookingProduct(product) ? getProductDisplayPrice(product) : formatPrice(product.price, product.currency)}
                      </p>

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product, 1);
                          trackMetaAddToCart({
                            content_ids: [product.id],
                            content_name: product.name,
                            content_type: 'product',
                            value: product.price,
                            currency: product.currency || 'INR',
                          });
                        }}
                        className={`w-full flex items-center justify-center gap-2 text-white py-2.5 rounded-lg font-gotham text-xs uppercase tracking-wider transition-all active:scale-95 ${isPrebookingProduct(product)
                          ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600'
                          : ''
                          }`}
                        style={!isPrebookingProduct(product) ? { background: theme.accent } : undefined}
                        onMouseEnter={(e) => {
                          if (!isPrebookingProduct(product)) e.currentTarget.style.background = theme.accentHover;
                        }}
                        onMouseLeave={(e) => {
                          if (!isPrebookingProduct(product)) e.currentTarget.style.background = theme.accent;
                        }}
                      >
                        {isPrebookingProduct(product) ? <Ticket className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                        {getProductButtonText(product, false)}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <Link
            href={festival.ctaLink}
            className="inline-flex items-center gap-2 text-white px-5 sm:px-8 py-2.5 sm:py-3 font-gotham text-[10px] sm:text-xs uppercase tracking-wider rounded-full transition-all touch-manipulation"
            style={{ background: theme.accent }}
            onMouseEnter={(e) => (e.currentTarget.style.background = theme.accentHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = theme.accent)}
          >
            {festival.ctaText}
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
        </motion.div>
      </Container>
    </Section>
  );
}
