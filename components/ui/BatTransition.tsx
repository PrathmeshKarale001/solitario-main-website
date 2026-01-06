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

      {/* Gold cinematic text with logos */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute inset-0 flex flex-col items-center justify-center gap-6 sm:gap-8 p-4"
      >
        <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="relative w-[180px] h-[45px] sm:w-[260px] sm:h-[65px] lg:w-[380px] lg:h-[95px] flex items-center justify-center"
          >
            <Image 
              src="/logo.svg" 
              alt="Solitario Logo" 
              fill 
              className="object-contain filter brightness-0 invert"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, type: "spring" }}
            className="text-[#C6A664] text-xl sm:text-3xl lg:text-5xl font-playfair font-bold flex items-center justify-center"
            style={{ lineHeight: 1, margin: '0 auto' }}
          >
            X
          </motion.div>

          <br />

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="relative w-[90px] h-[90px] sm:w-[130px] sm:h-[130px] lg:w-[190px] lg:h-[190px] flex items-center justify-center"
          >
            <Image 
              src="/images/warnerbroassets/warner-bg.webp" 
              alt="Warner Bros Logo" 
              fill 
              className="object-contain"
            />
          </motion.div>
        </div>

        <motion.div
          animate={{
            textShadow: [
              "0 0 20px rgba(198,166,100,0.3)",
              "0 0 40px rgba(198,166,100,0.6)",
              "0 0 20px rgba(198,166,100,0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center"
        >
          <span className="text-[#C6A664] text-2xl sm:text-4xl lg:text-6xl font-gotham font-bold tracking-[0.2em] sm:tracking-[0.3em]">
            SOLITARIO
          </span>
          <div className="flex items-center gap-3 sm:gap-4 mt-2">
            <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#C6A664]" />
            <span className="text-white/80 text-xs sm:text-base lg:text-lg font-montserrat tracking-[0.3em] sm:tracking-[0.5em] uppercase">
              Warner Bros
            </span>
            <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#C6A664]" />
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
