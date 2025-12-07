'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

// Custom Diamond Cursor SVG Component
const DiamondCursor = ({ isHovering, isOnText }: { isHovering: boolean; isOnText: boolean }) => (
  <svg 
    width="32" 
    height="32" 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-all duration-300 ${isHovering ? 'drop-shadow-[0_0_8px_rgba(172,136,75,0.6)]' : ''}`}
  >
    <g filter="url(#filter0_d)">
      <path 
        d="M4 4L14 26L17 17L4 4Z" 
        fill={isOnText ? '#f8eee7' : '#146552'}
        className="transition-colors duration-200"
      />
      <path 
        d="M4 4L17 17L26 13L4 4Z" 
        fill={isOnText ? '#ac884b' : '#107571'}
        className="transition-colors duration-200"
      />
      <path 
        d="M4 4L14 26L17 17L26 13L4 4Z" 
        stroke={isOnText ? '#146552' : '#f8eee7'} 
        strokeWidth="1.5"
        className="transition-colors duration-200"
      />
    </g>
    <defs>
      <filter id="filter0_d" x="0" y="0" width="32" height="32" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3"/>
      </filter>
    </defs>
  </svg>
);

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isOnText, setIsOnText] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Smooth spring-based cursor position
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  // Spring config for smooth following
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Rotation based on scroll velocity
  const rotation = useTransform(
    useMotionValue(scrollVelocity),
    [-50, 0, 50],
    [-15, 0, 15]
  );

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia('(max-width: 768px)').matches || 
                     'ontouchstart' in window;
      setIsMobile(mobile);
      if (!mobile) {
        document.body.style.cursor = 'none';
        // Hide cursor on all elements
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

  // Mouse position tracking
  const updateMousePosition = useCallback((e: MouseEvent) => {
    if (isMobile) return;
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  }, [isMobile, cursorX, cursorY]);

  // Scroll velocity tracking for rotation effect
  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const velocity = currentScrollY - lastScrollY.current;
      setScrollVelocity(velocity);
      lastScrollY.current = currentScrollY;

      // Reset velocity after scroll stops
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => setScrollVelocity(0), 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // Click handlers
  const handleMouseDown = useCallback(() => {
    if (!isMobile) setIsClicking(true);
  }, [isMobile]);

  const handleMouseUp = useCallback(() => {
    if (!isMobile) setIsClicking(false);
  }, [isMobile]);

  // Hover and text detection
  const handleMouseOver = useCallback((e: MouseEvent) => {
    if (isMobile) return;
    const target = e.target as Element;
    if (!target || typeof target.closest !== 'function') return;

    // Check for interactive elements
    const isInteractive = 
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.closest('a') ||
      target.closest('button') ||
      target.closest('[data-cursor-hover]') ||
      target.closest('[role="button"]');

    // Check for text elements
    const isText = 
      target.tagName === 'P' ||
      target.tagName === 'H1' ||
      target.tagName === 'H2' ||
      target.tagName === 'H3' ||
      target.tagName === 'H4' ||
      target.tagName === 'H5' ||
      target.tagName === 'H6' ||
      target.tagName === 'SPAN' ||
      target.tagName === 'LI' ||
      target.closest('p') ||
      target.closest('h1, h2, h3, h4, h5, h6');

    setIsHovering(!!isInteractive);
    setIsOnText(!!isText);
  }, [isMobile]);

  const handleMouseOut = useCallback(() => {
    if (!isMobile) {
      setIsHovering(false);
      setIsOnText(false);
    }
  }, [isMobile]);

  // Event listeners
  useEffect(() => {
    if (isMobile) return;

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isMobile, updateMousePosition, handleMouseDown, handleMouseUp, handleMouseOver, handleMouseOut]);

  if (isMobile) return null;

  return (
    <>
      {/* Main Diamond Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-4px',
          translateY: '-4px',
        }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.8 : isHovering ? 1.04 : 1, // reduced hover scale by ~20%
            rotate: scrollVelocity * 0.5,
          }}
          transition={{ 
            scale: { type: 'spring', stiffness: 400, damping: 17 },
            rotate: { type: 'spring', stiffness: 300, damping: 20 }
          }}
        >
          <DiamondCursor isHovering={isHovering} isOnText={isOnText} />
        </motion.div>
      </motion.div>

      {/* Trailing Ring - appears on hover */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-20px',
          translateY: '-20px',
        }}
      >
        <motion.div
          className="w-10 h-10 rounded-full border-2"
          animate={{
            scale: isHovering ? 1.2 : 0, // reduced ring scale by ~20%
            opacity: isHovering ? 1 : 0,
            borderColor: isOnText ? 'rgba(20, 101, 82, 0.5)' : 'rgba(172, 136, 75, 0.5)',
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 20 
          }}
        />
      </motion.div>

      {/* Sparkle particles on click - Enhanced */}
      {isClicking && (
        <motion.div
          className="fixed pointer-events-none z-[9997]"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="w-12 h-12 -translate-x-6 -translate-y-6">
            {/* Inner ring - 8 particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`inner-${i}`}
                className="absolute w-1.5 h-1.5 bg-bronze-gold rounded-full"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((i * Math.PI) / 4) * 35,
                  y: Math.sin((i * Math.PI) / 4) * 35,
                  opacity: 0,
                  scale: 0.5,
                }}
                transition={{ duration: 0.8, delay: i * 0.025 }}
              />
            ))}
            {/* Outer ring - 12 particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`outer-${i}`}
                className="absolute w-1 h-1 bg-ivory-pearl rounded-full"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((i * Math.PI) / 6) * 60,
                  y: Math.sin((i * Math.PI) / 6) * 60,
                  opacity: 0,
                  scale: 0.3,
                }}
                transition={{ duration: 0.9, delay: i * 0.02 }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}

