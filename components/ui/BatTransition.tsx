'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';

interface BatTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

// Static bat SVG - different sizes for depth effect
function BatSVG({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dimensions = {
    sm: { width: 28, height: 17 },
    md: { width: 40, height: 24 },
    lg: { width: 56, height: 34 },
  };
  const { width, height } = dimensions[size];
  
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={size === 'lg' ? 'drop-shadow-[0_0_8px_rgba(198,166,100,0.3)]' : ''}
    >
      <path
        d="M20 12C20 12 15 8 10 8C5 8 2 10 0 12C2 10 5 9 8 10C11 11 14 14 16 16C17 17 18 18 20 18C22 18 23 17 24 16C26 14 29 11 32 10C35 9 38 10 40 12C38 10 35 8 30 8C25 8 20 12 20 12Z"
        fill="#C6A664"
      />
    </svg>
  );
}

// Seeded random for consistent bat positions
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

export default function BatTransition({ isActive, onComplete }: BatTransitionProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Generate bats with controlled randomness
  const bats = useMemo(() => {
    const count = isMobile ? 18 : 30;
    return Array.from({ length: count }, (_, i) => {
      const seed = i + 1;
      const layer = i % 3; // 0: foreground, 1: mid, 2: background
      
      return {
        id: i,
        // Staggered with some randomness
        delay: seededRandom(seed) * 0.5 + (i * 0.03),
        // Spread across right side with randomness
        startX: 75 + seededRandom(seed * 2) * 35,
        startY: 60 + seededRandom(seed * 3) * 50,
        // Different end positions for variety
        endX: -20 - seededRandom(seed * 4) * 40,
        endY: -20 - seededRandom(seed * 5) * 40,
        // Scale based on layer + randomness
        scale: layer === 0 ? 1.2 + seededRandom(seed * 6) * 0.5 
             : layer === 1 ? 0.8 + seededRandom(seed * 7) * 0.3 
             : 0.5 + seededRandom(seed * 8) * 0.2,
        // Varied duration
        duration: 0.9 + seededRandom(seed * 9) * 0.6,
        // Initial rotation
        rotation: -30 + seededRandom(seed * 10) * 20,
        // Layer determines opacity and size
        layer,
        size: (layer === 0 ? 'lg' : layer === 1 ? 'md' : 'sm') as 'sm' | 'md' | 'lg',
        opacity: layer === 0 ? 1 : layer === 1 ? 0.85 : 0.6,
      };
    });
  }, [isMobile]);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none bg-black overflow-hidden">
      {/* Bat swarm with varied paths and sizes */}
      {bats.map((bat) => (
        <motion.div
          key={bat.id}
          initial={{
            x: `${bat.startX}vw`,
            y: `${bat.startY}vh`,
            opacity: 0,
            scale: bat.scale * 0.8,
            rotate: bat.rotation,
          }}
          animate={{
            x: `${bat.endX}vw`,
            y: `${bat.endY}vh`,
            opacity: [0, bat.opacity, bat.opacity, bat.opacity * 0.8, 0],
            scale: [bat.scale * 0.8, bat.scale, bat.scale * 1.1, bat.scale],
            rotate: [bat.rotation, bat.rotation - 15, bat.rotation + 10, bat.rotation - 5],
          }}
          transition={{
            duration: bat.duration,
            delay: bat.delay,
            ease: [0.25, 0.1, 0.25, 1], // Smooth curve
          }}
          className="absolute will-change-transform"
          style={{ 
            zIndex: 10 + bat.layer,
          }}
        >
          <BatSVG size={bat.size} />
        </motion.div>
      ))}

      {/* Logos and text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="absolute inset-0 flex flex-col items-center justify-center p-4"
      >
        {/* Main logos row */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 lg:gap-8">
          {/* Solitario Logo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
            className="relative w-[120px] h-[40px] sm:w-[180px] sm:h-[55px] lg:w-[260px] lg:h-[80px]"
          >
            <Image 
              src="/logo.svg" 
              alt="Solitario Logo" 
              fill 
              className="object-contain filter brightness-0 invert"
              priority
            />
          </motion.div>

          {/* X separator */}
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.3, type: 'spring', stiffness: 200 }}
            className="text-[#C6A664] text-lg sm:text-2xl lg:text-4xl font-montserrat font-bold"
          >
            X
          </motion.span>

          {/* DC Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5, ease: 'easeOut' }}
            className="relative w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] lg:w-[140px] lg:h-[140px]"
          >
            <Image 
              src="/images/warnerbroassets/dc-logo.webp" 
              alt="DC Logo" 
              fill 
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Vertical separator */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 1.1, duration: 0.4 }}
            className="w-[1px] h-[50px] sm:h-[70px] lg:h-[100px] bg-[#C6A664]/60 origin-center"
          />

          {/* Tom & Jerry Logo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
            className="relative w-[80px] h-[60px] sm:w-[120px] sm:h-[90px] lg:w-[160px] lg:h-[120px]"
          >
            <Image 
              src="/images/warnerbroassets/T&J-Logo.png" 
              alt="Tom and Jerry Logo" 
              fill 
              className="object-contain"
              priority
            />
          </motion.div>
        </div>

        {/* SOLITARIO text and WARNER BROS tagline - centered with letter-spacing compensation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-8 sm:mt-10 lg:mt-14 w-full text-center"
        >
          {/* Nudge right to offset letter-spacing so text is visually centered */}
          <div className="inline-block text-center ml-[0.25em] sm:ml-[0.35em] lg:ml-[0.45em]">
            <motion.span 
              className="block text-[#C6A664] text-2xl sm:text-4xl lg:text-6xl font-gotham font-bold tracking-[0.3em] sm:tracking-[0.4em] lg:tracking-[0.5em]"
              animate={{
                textShadow: [
                  '0 0 20px rgba(198,166,100,0.3)',
                  '0 0 40px rgba(198,166,100,0.5)',
                  '0 0 20px rgba(198,166,100,0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: 1, ease: 'easeInOut' }}
            >
              SOLITARIO
            </motion.span>
            <span className="block text-white text-xs sm:text-sm lg:text-lg font-montserrat tracking-[0.3em] sm:tracking-[0.4em] lg:tracking-[0.5em] uppercase mt-2 sm:mt-3">
              WARNER BROS
            </span>
          </div>
        </motion.div>

        {/* Bottom footer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.4 }}
          className="absolute bottom-6 sm:bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-4"
        >
          {/* Small DC Logo */}
          <div className="relative w-[28px] h-[28px] sm:w-[36px] sm:h-[36px]">
            <Image 
              src="/images/warnerbroassets/dc-logo.webp" 
              alt="DC" 
              fill 
              className="object-contain"
            />
          </div>
          {/* WB Shield */}
          <div className="relative w-[32px] h-[32px] sm:w-[40px] sm:h-[40px]">
            <Image 
              src="/images/warnerbroassets/warner-bg.webp" 
              alt="Warner Bros" 
              fill 
              className="object-contain"
            />
          </div>
          {/* Copyright text */}
          <div className="text-white/50 text-[8px] sm:text-[10px] font-montserrat leading-tight text-left">
            <p>All DC characters and elements © & ™ DC.</p>
            <p>WB SHIELD: © & ™ WBEI. (s26)</p>
            <p>© & ™ Turner Entertainment Co. (s26)</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
