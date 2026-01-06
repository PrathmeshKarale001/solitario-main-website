'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/data';
import { ProductCard, QuickLookModal } from '@/components/ui';
import { useCart } from '@/lib/cart-context';

export interface ProductGridProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
  darkMode?: boolean;
}

export default function ProductGrid({ products, onQuickView, darkMode = false }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart: addToCartContext } = useCart();

  const handleQuickView = (product: Product) => {
    if (onQuickView) {
      onQuickView(product);
    } else {
      setSelectedProduct(product);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCartContext(product, 1);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              layout
            >
              <ProductCard
                product={product}
                onQuickView={handleQuickView}
                onAddToCart={handleAddToCart}
                darkMode={darkMode}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">No products found in this category.</p>
        </div>
      )}

      {/* Quick Look Modal */}
      <QuickLookModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </>
  );
}


