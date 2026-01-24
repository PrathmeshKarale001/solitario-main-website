'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Segment-Based Navigation Component
// Client Feedback: Allow users to instantly choose their preferred product segment

const categories = [
  { id: 'all', name: 'All Products', path: '/products' },
  { id: 'rings', name: 'Rings', path: '/products?category=rings' },
  { id: 'earrings', name: 'Earrings', path: '/products?category=earrings' },
  { id: 'necklaces', name: 'Necklaces', path: '/products?category=necklaces' },
  { id: 'bracelets', name: 'Bracelets', path: '/products?category=bracelets' },
  { id: 'pendants', name: 'Pendants', path: '/products?category=pendants' },
  { id: 'engagement', name: 'Engagement Rings', path: '/products?category=engagement' },
  { id: 'wedding', name: 'Wedding Bands', path: '/products?category=wedding' },
];

export default function CategorySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(categories[0]);
  const router = useRouter();

  const handleSelect = (category: typeof categories[0]) => {
    setSelected(category);
    setIsOpen(false);
    router.push(category.path);
  };

  return (
    <div className="w-full bg-gradient-to-r from-classic-green to-classic-green/90 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4">
          <span className="text-white font-medium hidden sm:block">
            Shop by Category:
          </span>
          
          <div className="relative w-full sm:w-80">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full bg-white rounded-lg px-4 py-3 flex items-center justify-between hover:bg-ivory-pearl transition-colors shadow-md"
            >
              <span className="font-medium text-brand-900">{selected.name}</span>
              <ChevronDown 
                className={`w-5 h-5 text-brand-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {isOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                  />
                  
                  {/* Dropdown */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
                  >
                    <div className="max-h-80 overflow-y-auto">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleSelect(category)}
                          className={`w-full px-4 py-3 text-left hover:bg-ivory-pearl transition-colors ${
                            selected.id === category.id 
                              ? 'bg-classic-green/10 text-classic-green font-medium' 
                              : 'text-brand-900'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
