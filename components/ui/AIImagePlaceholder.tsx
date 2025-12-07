'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface AIImagePlaceholderProps {
  src: string;
  alt: string;
  prompt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

/**
 * AIImagePlaceholder - Shows a stylized placeholder with the AI prompt
 * while the image is being generated or if it doesn't exist yet.
 * Once the image exists, it displays normally.
 */
export default function AIImagePlaceholder({
  src,
  alt,
  prompt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
}: AIImagePlaceholderProps) {
  const [imageExists, setImageExists] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Check if image exists
  useEffect(() => {
    const checkImage = async () => {
      try {
        const response = await fetch(src, { method: 'HEAD' });
        setImageExists(response.ok);
      } catch {
        setImageExists(false);
      }
      setIsLoading(false);
    };
    checkImage();
  }, [src]);

  // Show placeholder if image doesn't exist
  if (!imageExists || isLoading) {
    return (
      <div 
        className={`relative bg-gradient-to-br from-brand-100 via-brand-50 to-ivory-pearl overflow-hidden ${className}`}
        style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
      >
        {/* Animated shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Diamond icon */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="text-bronze-gold/30 mb-4"
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 8.5L12 22L22 8.5L12 2ZM12 4.5L18.5 8.5L12 18L5.5 8.5L12 4.5Z" />
            </svg>
          </motion.div>
          
          {/* Prompt preview */}
          <div className="text-center max-w-md">
            <p className="text-xs text-brand-500 uppercase tracking-wider mb-2">
              AI Image Generating...
            </p>
            <p className="text-sm text-brand-400 line-clamp-3 italic">
              &ldquo;{prompt.substring(0, 150)}...&rdquo;
            </p>
          </div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-bronze-gold/20" />
        <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-bronze-gold/20" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-bronze-gold/20" />
        <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-bronze-gold/20" />
      </div>
    );
  }

  // Show actual image
  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      className={className}
      priority={priority}
    />
  );
}
