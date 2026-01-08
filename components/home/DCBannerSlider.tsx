'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Container } from '@/components/ui';

const DC_BANNERS = [
  { id: 1, src: '/images/banners/dc/dc1.jpg', alt: 'DC Collection 1' },
  { id: 2, src: '/images/banners/dc/dc2.jpg', alt: 'DC Collection 2' },
  { id: 3, src: '/images/banners/dc/dc3.jpg', alt: 'DC Collection 3' },
  { id: 4, src: '/images/banners/dc/dc4.jpg', alt: 'DC Collection 4' },
  { id: 5, src: '/images/banners/dc/dc5.jpg', alt: 'DC Collection 5' },
  { id: 6, src: '/images/banners/dc/dc6.jpg', alt: 'DC Collection 6' },
];

export default function DCBannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DC_BANNERS.length);
    }, 5000); // Auto-slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full bg-white overflow-hidden py-8">
      <div className="relative w-full aspect-[21/9] md:aspect-[25/7] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={DC_BANNERS[currentIndex].id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Image
              src={DC_BANNERS[currentIndex].src}
              alt={DC_BANNERS[currentIndex].alt}
              fill
              className="object-contain"
              priority
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {DC_BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx ? 'bg-white w-6' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
