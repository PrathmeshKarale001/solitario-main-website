'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = scrollPx / winHeightPx;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-classic-green/10">
      <motion.div
        className="h-full bg-gradient-to-r from-bronze-gold via-bronze-gold/90 to-soft-bronze shadow-glow"
        style={{
          scaleX: scrollProgress,
          transformOrigin: 'left',
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 30 }}
      />
    </div>
  );
}

