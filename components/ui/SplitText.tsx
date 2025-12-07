'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export default function SplitText({ children, className = '', delay = 0, duration = 0.5 }: SplitTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const words = children.split(' ');

  return (
    <div ref={ref} className={className}>
      {words.map((word, index) => (
        <span key={index} className={`inline-block mr-2 ${className}`}>
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className={`inline-block ${className}`}
              style={className.includes('font-aguila') ? { fontFamily: 'var(--font-aguila), serif' } : undefined}
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{
                duration,
                delay: delay + (index * 0.05) + (charIndex * 0.02),
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </span>
      ))}
    </div>
  );
}

