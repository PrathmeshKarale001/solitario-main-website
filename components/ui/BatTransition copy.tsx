'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface BatTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

export default function BatTransition({ isActive, onComplete }: BatTransitionProps) {
  const [bats, setBats] = useState<Array<{ id: number; delay: number; startX: number; startY: number; scale: number; duration: number }>>([]);

  useEffect(() => {
    if (isActive) {
      // Generate 25-30 bats for a dense swarm
      const newBats = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        delay: Math.random() * 0.4, // Staggered start
        startX: 80 + (Math.random() * 40), // Start from far right
        startY: 100 + (Math.random() * 20), // Start from bottom
        scale: 0.5 + Math.random() * 1.5, // Random sizes
        duration: 0.8 + Math.random() * 0.7, // Random speeds
      }));
      setBats(newBats);

      const timer = setTimeout(() => {
        onComplete();
      }, 2500); // Slightly longer to allow text and logos to be seen

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
    >
      {/* Dark overlay with diagonal sweep from right */}
      <motion.div
        initial={{ x: '100%', y: '100%' }}
        animate={{ x: '-100%', y: '-100%' }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-[-100%] bg-gradient-to-tl from-black via-black to-[#1a1a1a] -rotate-12"
      />

      {/* Background fill to ensure no gaps */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="absolute inset-0 bg-black"
      />

      {/* Flying bats swarm from right */}
      {bats.map((bat) => (
        <motion.div
          key={bat.id}
          initial={{
            x: `${bat.startX}vw`,
            y: `${bat.startY}vh`,
            opacity: 0,
            scale: bat.scale,
            rotate: 45,
          }}
          animate={{
            x: `${bat.startX - 150}vw`, // Fly diagonally across to the left
            y: `${bat.startY - 150}vh`,
            opacity: [0, 1, 1, 0],
            rotate: [45, 35, 45], // Slight wobble
          }}
          transition={{
            duration: bat.duration,
            delay: bat.delay,
            ease: "easeIn",
          }}
          className="absolute"
        >
          <BatSVG />
        </motion.div>
      ))}

      {/* Gold cinematic text with logos */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute inset-0 flex flex-col items-center justify-center gap-8"
      >
        <div className="flex items-center justify-center gap-12 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="relative w-24 h-24 lg:w-32 lg:h-32"
          >
            <Image 
              src="/logo.png" 
              alt="Solitario Logo" 
              fill 
              className="object-contain filter brightness-0 invert"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, type: "spring" }}
            className="text-[#C6A664] text-4xl lg:text-6xl font-montserrat font-bold font-bold"
          >
            X
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="relative w-24 h-24 lg:w-32 lg:h-32"
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
          <span className="text-[#C6A664] text-4xl lg:text-6xl font-gotham font-bold tracking-[0.3em]">
            SOLITARIO
          </span>
          <div className="flex items-center gap-4 mt-2">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C6A664]" />
            <span className="text-white/80 text-base lg:text-lg font-montserrat tracking-[0.5em] uppercase">
              Warner Bros
            </span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#C6A664]" />
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
