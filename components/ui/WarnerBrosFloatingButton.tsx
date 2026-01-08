'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { WARNER_BROS_CONFIG } from '@/lib/warner-bros-config';
import BatTransition from './BatTransition';

export default function WarnerBrosFloatingButton() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Don't show on Warner Bros page itself or admin pages
  const isWarnerBrosPage = pathname === '/warner-bros';
  const isAdminPage = pathname?.startsWith('/admin');
  const isCheckoutPage = pathname?.startsWith('/checkout') || pathname?.startsWith('/cart');

  // Alternate between logos
  useEffect(() => {
    if (isHovered) return; // Pause animation on hover

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        (prev + 1) % WARNER_BROS_CONFIG.floatingButton.images.length
      );
    }, WARNER_BROS_CONFIG.floatingButton.intervalMs);

    return () => clearInterval(interval);
  }, [isHovered]);

  // Reset transition state when pathname changes
  useEffect(() => {
    setShowTransition(false);
  }, [pathname]);

  // Don't render on certain pages
  if (isWarnerBrosPage || isAdminPage || isCheckoutPage) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowTransition(true);
  };

  const handleTransitionComplete = () => {
    router.push('/warner-bros');
  };

  return (
    <>
      <BatTransition isActive={showTransition} onComplete={handleTransitionComplete} />
      
      <button
        onClick={handleClick}
        className="fixed bottom-6 right-4 lg:right-6 z-40 group outline-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Explore Warner Bros Collectibles"
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            width: isHovered ? (typeof window !== 'undefined' && window.innerWidth < 1024 ? '220px' : '280px') : '72px',
            height: isHovered ? (typeof window !== 'undefined' && window.innerWidth < 1024 ? '72px' : '80px') : '72px',
            borderRadius: isHovered ? '20px' : '36px'
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 25,
            width: { duration: 0.4, ease: "circOut" },
            height: { duration: 0.4, ease: "circOut" },
            borderRadius: { duration: 0.3 }
          }}
          className="relative bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#000000] border-2 border-[#C6A664] shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(198,166,100,0.5)] flex items-center overflow-hidden animate-premium-breathe px-4"
        >
          {/* Animated border glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#C6A664] via-transparent to-[#C6A664] opacity-20 transition-opacity duration-500" />
          
          {/* Premium shimmer sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer-sweep" />

          {/* Content Wrapper */}
          <div className="flex items-center gap-4 w-full h-full relative z-10">
            {/* Logo Section - Always visible, centered in circle mode */}
            <div className={`flex-shrink-0 transition-all duration-300 ${isHovered ? 'w-12 lg:w-14' : 'w-full flex justify-center'}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className="w-12 h-12 lg:w-14 lg:h-14 relative"
                >
                  <Image
                    src={WARNER_BROS_CONFIG.floatingButton.images[currentImageIndex]}
                    alt="Warner Bros"
                    fill
                    sizes="(max-width: 768px) 48px, 56px"
                    className="object-contain drop-shadow-[0_4px_8px_rgba(198,166,100,0.4)]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Text Section - Only visible on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex flex-col whitespace-nowrap overflow-hidden pr-2"
                >
                  <span className="text-[#C6A664] font-gotham text-sm lg:text-base font-bold tracking-[0.25em] leading-tight">
                    COLLECTIBLES
                  </span>
                  <span className="text-white/60 font-montserrat text-[10px] lg:text-[11px] uppercase tracking-[0.4em] leading-tight mt-1">
                    EXPLORE NOW
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Decorative corner accents - Only visible when expanded */}
          <motion.div 
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#C6A664]/40 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#C6A664]/40 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#C6A664]/40 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#C6A664]/40 rounded-br-lg" />
          </motion.div>
        </motion.div>
      </button>
    </>
  );
}
