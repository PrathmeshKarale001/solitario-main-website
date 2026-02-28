'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Ticket } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { isPrebookingProduct, getProductDisplayPrice, getProductButtonText } from '@/lib/prebooking';
import { trackMetaAddToCart, trackMetaAddToWishlist } from '@/components/analytics/MetaPixel';
import { Product } from '@/lib/data';
import { getRecommendationProducts } from '@/lib/shopify-data';

interface ProductRecommendationsProps {
  title?: string;
  currentProductId?: string;
  category?: string;
  limit?: number;
  className?: string;
  maxPrice?: number;
}

export default function ProductRecommendations({
  title = "Products you may like",
  currentProductId,
  category,
  limit = 4,
  className = "",
  maxPrice
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const products = await getRecommendationProducts({
          currentProductId,
          category,
          maxPrice,
          limit,
          useShopify: true
        });
        setRecommendations(products);
      } catch (error) {
        console.error('Error fetching product recommendations:', error);
        setRecommendations([]);
      }
    }

    fetchRecommendations();
  }, [currentProductId, category, limit, maxPrice]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    trackMetaAddToCart({
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price,
      currency: product.currency || 'INR',
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product.id)) {
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
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-6"
      >
        <h2 className="font-montserrat font-bold text-2xl md:text-3xl text-gray-900 mb-2">
          {title}
        </h2>
        <p className="text-gray-600 font-montserrat text-sm">
          Handpicked recommendations just for you
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {recommendations.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
              <Link href={`/products/${product.id}`}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {/* Wishlist Button */}
              <button
                onClick={() => handleWishlistToggle(product)}
                className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                aria-label={isInWishlist(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${isInWishlist(product.id)
                      ? 'text-red-500 fill-red-500'
                      : 'text-gray-400 hover:text-red-500'
                    }`}
                />
              </button>

              {/* Featured Badge */}
              {product.featured && (
                <div className="absolute top-3 left-3 bg-classic-green text-white text-xs px-2 py-1 rounded-full font-medium">
                  Featured
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              <Link href={`/products/${product.id}`}>
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-classic-green transition-colors">
                  {product.name}
                </h3>
              </Link>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {isPrebookingProduct(product) ? (
                    <span className="font-bold text-lg text-purple-600">
                      {getProductDisplayPrice(product)}
                    </span>
                  ) : (
                    <>
                      <span className="font-bold text-lg text-classic-green">
                        {formatPrice(product.price, product.currency)}
                      </span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.comparePrice, product.currency)}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Add to Cart / Prebook Button */}
              <button
                onClick={() => handleAddToCart(product)}
                className={`w-full text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${isPrebookingProduct(product)
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600'
                    : 'bg-classic-green hover:bg-classic-green/90'
                  }`}
              >
                {isPrebookingProduct(product) ? <Ticket className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                {getProductButtonText(product, false)}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
