'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface DynamicHeroProps {
  fallbackMedia?: Array<{
    type: 'image' | 'video';
    src: string;
    mobileSrc?: string;
    pos?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
  }>;
}

export default function DynamicHero({ fallbackMedia }: DynamicHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  // New hero images - Desktop: 1600x700px, Mobile: 1080x1350px (4:5)
  // Images with CTA embedded - but also showing overlay CTA button
  const defaultFallbackMedia = [
    {
      type: 'image' as const,
      src: '/images/home-hero/Home_Herofeb 1171277230.jpg',
      mobileSrc: '/images/home-hero/Mobile_Banner_1.jpg',
      pos: 'object-cover',
      ctaText: 'Shop Now',
      ctaLink: '/products'
    },
    {
      type: 'image' as const,
      src: '/images/home-hero/Home_Herofeb 1171277231.jpg',
      mobileSrc: '/images/home-hero/Mobile_Banner_2.jpg',
      pos: 'object-cover',
      ctaText: 'Shop Now',
      ctaLink: '/products'
    },
    {
      type: 'image' as const,
      src: '/images/home-hero/Home_Herofeb 1171277232.jpg',
      mobileSrc: '/images/home-hero/Mobile_Banner_3.jpg',
      pos: 'object-cover',
      ctaText: 'Shop Now',
      ctaLink: '/products'
    },
    {
      type: 'image' as const,
      src: '/images/home-hero/Home_Herofeb 1171277233.jpg',
      mobileSrc: '/images/home-hero/Mobile_Banner_4.jpg',
      pos: 'object-cover',
      ctaText: 'Shop Now',
      ctaLink: '/products'
    },
    {
      type: 'video' as const,
      src: '/product-hero-assets/Lab Grown Diamond  Jewellery  Lab Cultured Diamonds  Engineered Diamonds (3).mp4',
      pos: 'object-cover',
      ctaText: 'Explore Collection',
      ctaLink: '/products'
    }
  ];

  // Mobile fallback media - Mobile_Banner images for mobile viewport
  const defaultFallbackMediaMobile = [
    { type: 'image' as const, src: '/images/home-hero/Mobile_Banner_1.jpg', pos: 'object-cover', ctaText: 'Shop Now', ctaLink: '/products' },
    { type: 'image' as const, src: '/images/home-hero/Mobile_Banner_2.jpg', pos: 'object-cover', ctaText: 'Shop Now', ctaLink: '/products' },
    { type: 'image' as const, src: '/images/home-hero/Mobile_Banner_3.jpg', pos: 'object-cover', ctaText: 'Shop Now', ctaLink: '/products' },
    { type: 'image' as const, src: '/images/home-hero/Mobile_Banner_4.jpg', pos: 'object-cover', ctaText: 'Shop Now', ctaLink: '/products' },
    { type: 'image' as const, src: '/images/home-hero/Mobile_Banner_5.jpg', pos: 'object-cover', ctaText: 'Shop Now', ctaLink: '/products' },
    { type: 'image' as const, src: '/images/home-hero/Mobile_Banner_6.jpg', pos: 'object-cover', ctaText: 'Shop Now', ctaLink: '/products' },
    { type: 'image' as const, src: '/images/home-hero/Mobile_Banner_7.jpg', pos: 'object-cover', ctaText: 'Shop Now', ctaLink: '/products' },
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Skip dynamic content fetching for now - using static images
    setLoading(false);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Define media type with optional content fields
  type MediaItem = {
    type: 'image' | 'video';
    src: string;
    mobileSrc?: string;
    pos?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
  };

  // Use mobile-specific media array on mobile devices
  const staticMedia = fallbackMedia || (isMobile ? defaultFallbackMediaMobile : defaultFallbackMedia);
  const mediaToUse = staticMedia;
  
  // Helper to get the correct source based on device
  const getMediaSrc = (media: MediaItem) => {
    if (isMobile && media.mobileSrc) {
      return media.mobileSrc;
    }
    return media.src;
  };
  
  // Navigate to previous/next slide
  const goToPrevious = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + mediaToUse.length) % mediaToUse.length);
      setIsTransitioning(false);
    }, 300);
  };
  
  const goToNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % mediaToUse.length);
      setIsTransitioning(false);
    }, 300);
  };

  // Handle media transition
  const handleMediaEnded = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % mediaToUse.length);
      setIsTransitioning(false);
    }, 300);
  };

  // Auto-advance for images
  useEffect(() => {
    const currentMedia = mediaToUse[currentIndex];
    if (currentMedia.type === 'image') {
      const timer = setTimeout(() => {
        handleMediaEnded();
      }, 6000); // Show image for 6 seconds
      return () => clearTimeout(timer);
    }
  }, [currentIndex, mediaToUse]);

  // Handle video playback
  useEffect(() => {
    const currentMedia = mediaToUse[currentIndex];
    if (currentMedia.type === 'video') {
      const currentVideo = videoRefs.current[currentIndex];
      if (currentVideo) {
        currentVideo.load();
        currentVideo.currentTime = 0;
        const playPromise = currentVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay was prevented, handle silently
          });
        }
      }
    }
    
    // Pause other videos
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentIndex) {
        video.pause();
      }
    });
  }, [currentIndex, mediaToUse]);

  // Reset index when device type changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [isMobile]);

  // Get current media content
  const currentMedia = mediaToUse[currentIndex];

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full overflow-hidden bg-[#1a1a1a]"
      style={{
        // Desktop: 1600x700 ratio = 43.75% | Mobile: 4:5 ratio = 125%
        // Using max-height to ensure it doesn't take full screen
      }}
    >
      {/* Aspect ratio container - Desktop: ~16:7, Mobile: 4:5 */}
      <div className="relative w-full aspect-[4/5] md:aspect-[16/7] max-h-[85vh] md:max-h-[700px]">
        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 z-20 bg-[#1a1a1a] flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto"></div>
            </div>
          </div>
        )}

        {/* Media Background */}
        <div className="absolute inset-0 z-0">
          {mediaToUse.map((media, index) => (
            <motion.div
              key={`${media.src}-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentIndex && !isTransitioning ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
              style={{ pointerEvents: index === currentIndex ? 'auto' : 'none' }}
            >
              {media.type === 'video' ? (
                <>
                  <video
                    ref={(el) => { videoRefs.current[index] = el; }}
                    src={media.src}
                    muted
                    playsInline
                    preload="auto"
                    onEnded={handleMediaEnded}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Dark overlay for video */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
                </>
              ) : (
                <Image
                  src={getMediaSrc(media)}
                  alt="Solitario Jewelry Collection"
                  fill
                  priority={index === 0}
                  quality={index === 0 ? 90 : 80}
                  sizes="100vw"
                  unoptimized
                  className={`${media.pos ?? 'object-cover'} object-center`}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Button - Show on all slides */}
        <div className="absolute inset-0 z-10 flex items-end justify-center pb-16 md:pb-20">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center"
          >
            <Link
              href={currentMedia.ctaLink || '/products'}
              className="group inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-3.5 text-white font-gotham uppercase tracking-[0.2em] text-xs md:text-sm rounded-full transition-all duration-500 hover:scale-105 relative overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="relative z-10">{currentMedia.ctaText || 'Shop Now'}</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
            </Link>
          </motion.div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Media indicators - positioned at bottom */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {mediaToUse.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsTransitioning(false);
                }, 300);
              }}
              className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-6 md:w-8 bg-white'
                  : 'w-1.5 md:w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
