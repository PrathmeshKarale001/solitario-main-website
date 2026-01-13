'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function Particles({ count = 20 }: { count?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    particles.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }));
  }, [count]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.current.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-bronze-gold/30"
          initial={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            y: [particle.y, particle.y - 100, particle.y - 200],
            x: [particle.x, particle.x + (Math.random() - 0.5) * 50, particle.x + (Math.random() - 0.5) * 100],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            fontSize: `${particle.size}px`,
          }}
        >
          ♢
        </motion.div>
      ))}
    </div>
  );
}

