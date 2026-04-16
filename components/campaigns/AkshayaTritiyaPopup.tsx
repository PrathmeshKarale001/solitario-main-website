'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Diamond, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * Akshaya Tritiya promotional popup — appears after 4s delay on every visit.
 * Renders on home page & product pages. CTA links to /stores#akshaya-tritiya-form.
 */
export default function AkshayaTritiyaPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after 4 seconds on every visit
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="Close popup"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header — festive gradient */}
            <div className="relative bg-gradient-to-br from-amber-600 via-amber-500 to-orange-500 px-6 pt-8 pb-6 text-center overflow-hidden">
              {/* Decorative sparkles */}
              <div className="absolute top-2 left-4 text-amber-200/40 animate-pulse">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="absolute top-6 right-8 text-amber-200/30 animate-pulse delay-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="absolute bottom-3 left-8 text-amber-200/20 animate-pulse delay-700">
                <Sparkles className="w-3 h-3" />
              </div>

              {/* Diamond icon */}
              <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Diamond className="w-7 h-7 text-white" />
              </div>

              {/* Festival badge */}
              <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-[10px] font-gotham uppercase tracking-[0.2em] mb-3 border border-white/10">
                🪷 Akshaya Tritiya 2026
              </span>

              {/* Title */}
              <h2 className="text-2xl font-montserrat font-bold text-white leading-tight">
                Claim Your{' '}
                <span className="text-amber-100">Free Diamond</span>
              </h2>
              <p className="mt-2 text-white/80 font-montserrat text-sm leading-relaxed">
                First 100 customers get a certified premium diamond — absolutely free!
              </p>
            </div>

            {/* CTA Section */}
            <div className="px-6 py-6">
              {/* Highlights */}
              <div className="flex items-center justify-center gap-4 mb-5 text-xs text-gray-500 font-montserrat">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Free Diamond
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-classic-green" />
                  10% Off
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-bronze-gold" />
                  Limited Spots
                </span>
              </div>

              {/* CTA Button */}
              <Link
                href="/stores#akshaya-tritiya-form"
                onClick={handleClose}
                className="group flex items-center justify-center gap-2 w-full py-3.5 bg-classic-green text-white text-center rounded-xl font-gotham text-sm uppercase tracking-[0.15em] hover:bg-classic-green/90 transition-all duration-300 hover:shadow-lg hover:shadow-classic-green/20"
              >
                <span>Register Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Skip */}
              <button
                onClick={handleClose}
                className="w-full mt-3 text-center text-gray-400 text-xs font-montserrat hover:text-gray-600 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
