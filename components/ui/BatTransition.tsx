'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface BatTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

export default function BatTransition({ isActive, onComplete }: BatTransitionProps) {
  const [bats, setBats] = useState<Array<{ id: number; delay: number; startX: number; startY: number; scale: number; duration: number; rotation: number }>>([]);

  useEffect(() => {
    if (isActive) {
      // Generate 60-70 bats for an epic swarm effect
      const newBats = Array.from({ length: 65 }, (_, i) => ({
        id: i,
        delay: Math.random() * 0.6, // More staggered start for wave effect
        startX: 80 + (Math.random() * 50), // Wider starting area
        startY: 80 + (Math.random() * 40), // More vertical spread
        scale: 0.4 + Math.random() * 1.8, // Wider size variation
        duration: 0.7 + Math.random() * 0.9, // More varied speeds
        rotation: 35 + Math.random() * 20, // Varied initial rotation
      }));
      setBats(newBats);

      const timer = setTimeout(() => {
        onComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="fixed inset-0 z-[9999] pointer-events-none"
    >
      {/* 
        SIMPLIFIED SOLID FADE
        To eliminate all box artifacts, we use a clean full-screen black fade
        that perfectly synchronizes with the bat swarm.
      */}
      <div className="absolute inset-0 bg-black" />

      {/* Epic bat swarm with multiple layers */}
      {bats.map((bat, idx) => {
        // Create 3 layers: foreground (large), mid (medium), background (small)
        const layer = idx % 3;
        const zIndex = layer === 0 ? 15 : layer === 1 ? 12 : 10;
        const blurAmount = layer === 2 ? 'blur(0.5px)' : 'blur(0px)';
        
        return (
          <motion.div
            key={bat.id}
            initial={{
              left: `${bat.startX}vw`,
              top: `${bat.startY}vh`,
              opacity: 0,
              scale: bat.scale,
              rotate: bat.rotation,
            }}
            animate={{
              left: `${bat.startX - 160}vw`,
              top: `${bat.startY - 160}vh`,
              opacity: [0, 0.9, 1, 0.9, 0],
              rotate: [bat.rotation, bat.rotation - 10, bat.rotation + 5, bat.rotation - 5],
              scale: [bat.scale, bat.scale * 1.1, bat.scale, bat.scale * 0.9],
            }}
            transition={{
              duration: bat.duration,
              delay: bat.delay,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="absolute"
            style={{ 
              zIndex, 
              filter: blurAmount,
              mixBlendMode: layer === 0 ? 'normal' : 'multiply'
            }}
          >
            <BatSVG />
          </motion.div>
        );
      })}

      {/* Gold cinematic text with logos - matching exact UI */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute inset-0 flex flex-col items-center justify-center p-4"
      >
        {/* Main logos row - center aligned */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 lg:gap-8">
          {/* Solitario Logo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="relative w-[120px] h-[40px] sm:w-[180px] sm:h-[55px] lg:w-[260px] lg:h-[80px] flex items-center justify-center"
          >
            <Image 
              src="/logo.svg" 
              alt="Solitario Logo" 
              fill 
              className="object-contain filter brightness-0 invert"
            />
          </motion.div>

          {/* X separator */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, type: "spring" }}
            className="text-[#C6A664] text-lg sm:text-2xl lg:text-4xl font-playfair font-bold flex items-center justify-center"
          >
            X
          </motion.div>

          {/* DC Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="relative w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] lg:w-[140px] lg:h-[140px] flex items-center justify-center"
          >
            <Image 
              src="/images/warnerbroassets/dc-logo.webp" 
              alt="DC Logo" 
              fill 
              className="object-contain"
            />
          </motion.div>

          {/* Vertical separator line */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 1.3, duration: 0.4 }}
            className="w-[1px] h-[50px] sm:h-[70px] lg:h-[100px] bg-[#C6A664]/60"
          />

          {/* Tom & Jerry Logo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="relative w-[80px] h-[60px] sm:w-[120px] sm:h-[90px] lg:w-[160px] lg:h-[120px] flex items-center justify-center"
          >
            <Image 
              src="/images/warnerbroassets/T&J-Logo.png" 
              alt="Tom and Jerry Logo" 
              fill 
              className="object-contain"
            />
          </motion.div>
        </div>

        {/* SOLITARIO text and WARNER BROS tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="flex flex-col items-center mt-8 sm:mt-10 lg:mt-14"
        >
          <motion.div
            animate={{
              textShadow: [
                "0 0 20px rgba(198,166,100,0.3)",
                "0 0 40px rgba(198,166,100,0.6)",
                "0 0 20px rgba(198,166,100,0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-[#C6A664] text-2xl sm:text-4xl lg:text-6xl font-gotham font-bold tracking-[0.3em] sm:tracking-[0.4em] lg:tracking-[0.5em]">
              SOLITARIO
            </span>
          </motion.div>
          <span className="text-white text-xs sm:text-sm lg:text-lg font-montserrat tracking-[0.3em] sm:tracking-[0.4em] lg:tracking-[0.5em] uppercase mt-2 sm:mt-3">
            WARNER BROS
          </span>
        </motion.div>

        {/* Bottom footer with logos and copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          className="absolute bottom-6 sm:bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="flex items-center justify-center gap-3 sm:gap-4">
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
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function BatSVG() {
  return (
    <svg
      width="60"
      height="36"
      viewBox="0 0 40 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_0_12px_rgba(198,166,100,0.4)]"
    >
      <motion.path
        d="M20 12C20 12 15 8 10 8C5 8 2 10 0 12C2 10 5 9 8 10C11 11 14 14 16 16C17 17 18 18 20 18C22 18 23 17 24 16C26 14 29 11 32 10C35 9 38 10 40 12C38 10 35 8 30 8C25 8 20 12 20 12Z"
        fill="#C6A664"
        animate={{
          d: [
            "M20 12C20 12 15 8 10 8C5 8 2 10 0 12C2 10 5 9 8 10C11 11 14 14 16 16C17 17 18 18 20 18C22 18 23 17 24 16C26 14 29 11 32 10C35 9 38 10 40 12C38 10 35 8 30 8C25 8 20 12 20 12Z",
            "M20 12C20 12 15 4 10 4C5 4 2 8 0 12C2 10 5 9 8 10C11 11 14 14 16 16C17 17 18 18 20 18C22 18 23 17 24 16C26 14 29 11 32 10C35 9 38 10 40 12C38 10 35 4 30 4C25 4 20 12 20 12Z",
            "M20 12C20 12 15 8 10 8C5 8 2 10 0 12C2 10 5 9 8 10C11 11 14 14 16 16C17 17 18 18 20 18C22 18 23 17 24 16C26 14 29 11 32 10C35 9 38 10 40 12C38 10 35 8 30 8C25 8 20 12 20 12Z"
          ]
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <circle cx="17" cy="11" r="1" fill="#000" />
      <circle cx="23" cy="11" r="1" fill="#000" />
    </svg>
  );
}
