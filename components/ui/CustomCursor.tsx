'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

// Simple dot cursor - clean and minimal
export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 30, stiffness: 500, mass: 0.3 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia('(max-width: 768px)').matches || 
                     'ontouchstart' in window;
      setIsMobile(mobile);
      if (!mobile) {
        document.body.style.cursor = 'none';
        const style = document.createElement('style');
        style.id = 'custom-cursor-style';
        style.textContent = '* { cursor: none !important; }';
        document.head.appendChild(style);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.style.cursor = 'auto';
      const style = document.getElementById('custom-cursor-style');
      if (style) style.remove();
    };
  }, []);

  const updateMousePosition = useCallback((e: MouseEvent) => {
    if (isMobile) return;
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  }, [isMobile, cursorX, cursorY]);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    if (isMobile) return;
    const target = e.target as Element;
    if (!target || typeof target.closest !== 'function') return;

    const isInteractive = 
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.closest('a') ||
      target.closest('button') ||
      target.closest('[role="button"]');

    setIsHovering(!!isInteractive);
  }, [isMobile]);

  const handleMouseOut = useCallback(() => {
    if (!isMobile) setIsHovering(false);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isMobile, updateMousePosition, handleMouseOver, handleMouseOut]);

  if (isMobile) return null;

  return (
    <>
      {/* Simple dot cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="rounded-full bg-classic-green"
          animate={{
            width: isHovering ? 40 : 8,
            height: isHovering ? 40 : 8,
            x: isHovering ? -20 : -4,
            y: isHovering ? -20 : -4,
            opacity: isHovering ? 0.3 : 1,
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 400, 
            damping: 25 
          }}
        />
      </motion.div>
    </>
  );
}

