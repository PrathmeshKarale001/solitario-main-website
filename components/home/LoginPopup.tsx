'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the popup before
    const hasSeenPopup = localStorage.getItem('solitario_popup_seen');
    
    if (!hasSeenPopup) {
      // Show popup after 3 seconds for first-time visitors
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Mark popup as seen
    localStorage.setItem('solitario_popup_seen', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Close popup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with gradient */}
            <div className="relative bg-gradient-to-br from-classic-green via-classic-green to-teal p-8 text-center">
              <div className="absolute inset-0 bg-[url('/images/general/pattern.png')] opacity-10" />
              <div className="relative">
                <div className="w-24 h-20 mx-auto mb-6 relative">
                  <Image
                    src="/logo.svg"
                    alt="Solitario Logo"
                    fill
                    className="object-contain scale-125 brightness-0 invert"
                    priority
                  />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-bronze-gold" />
                  <span className="text-bronze-gold/90 font-gotham text-xs uppercase tracking-[0.2em]">
                    Exclusive Offer
                  </span>
                  <Sparkles className="w-5 h-5 text-bronze-gold" />
                </div>
                <h2 className="text-2xl md:text-3xl font-playfair text-white mb-2">
                  Login to Get Exclusive Offers
                </h2>
                <p className="text-white/80 font-montserrat text-sm">
                  Join our community for special discounts & early access
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Benefits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-classic-green/10 flex items-center justify-center flex-shrink-0">
                    <Gift className="w-4 h-4 text-classic-green" />
                  </div>
                  <p className="text-sm text-gray-700 font-montserrat">
                    <span className="font-semibold">10% off</span> on your first purchase
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-bronze-gold/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-bronze-gold" />
                  </div>
                  <p className="text-sm text-gray-700 font-montserrat">
                    Early access to <span className="font-semibold">new collections</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <Gift className="w-4 h-4 text-teal" />
                  </div>
                  <p className="text-sm text-gray-700 font-montserrat">
                    <span className="font-semibold">Birthday rewards</span> & special surprises
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Link
                  href="/sign-in"
                  onClick={handleClose}
                  className="block w-full py-3 bg-classic-green text-white text-center rounded-xl font-gotham text-sm uppercase tracking-[0.15em] hover:bg-classic-green/90 transition-colors"
                >
                  Login Now
                </Link>
                <Link
                  href="/sign-up"
                  onClick={handleClose}
                  className="block w-full py-3 bg-bronze-gold/10 text-bronze-gold text-center rounded-xl font-gotham text-sm uppercase tracking-[0.15em] hover:bg-bronze-gold/20 transition-colors"
                >
                  Create Account
                </Link>
              </div>

              {/* Skip */}
              <button
                onClick={handleClose}
                className="w-full mt-4 text-center text-gray-400 text-xs font-montserrat hover:text-gray-600 transition-colors"
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
