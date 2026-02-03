'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// New hero images - Desktop: 1600x700px format (compact banner like Palmonas/LimeLight)
const HERO_MEDIA_DESKTOP = [
  {
    type: 'image',
    src: '/images/home-hero/Home_Herofeb 1171277230.jpg',
    pos: 'object-cover',
    ctaText: 'Shop Now',
    ctaLink: '/products',
  },
  {
    type: 'image',
    src: '/images/home-hero/Home_Herofeb 1171277231.jpg',
    pos: 'object-cover',
    ctaText: 'Shop Now',
    ctaLink: '/products',
  },
  {
    type: 'image',
    src: '/images/home-hero/Home_Herofeb 1171277232.jpg',
    pos: 'object-cover',
    ctaText: 'Shop Now',
    ctaLink: '/products',
  },
  {
    type: 'video',
    src: '/product-hero-assets/Lab Grown Diamond  Jewellery  Lab Cultured Diamonds  Engineered Diamonds (3).mp4',
    ctaText: 'Explore Collection',
    ctaLink: '/products',
  },
];

// Mobile hero images - 1080x1350px (4:5 ratio)
const HERO_MEDIA_MOBILE = [
  {
    type: 'image',
    src: '/images/home-hero/Home_Herofeb 1171277234.jpg',
    pos: 'object-cover',
    ctaText: 'Shop Now',
    ctaLink: '/products',
  },
  {
    type: 'image',
    src: '/images/home-hero/Home_Herofeb 1171277235.jpg',
    pos: 'object-cover',
    ctaText: 'Shop Now',
    ctaLink: '/products',
  },
  {
    type: 'image',
    src: '/images/home-hero/Home_Herofeb 1171277236.jpg',
    pos: 'object-cover',
    ctaText: 'Shop Now',
    ctaLink: '/products',
  },
  {
    type: 'image',
    src: '/images/home-hero/Home_Herofeb 1171277237.jpg',
    pos: 'object-cover',
    ctaText: 'Shop Now',
    ctaLink: '/products',
  },
];

export default function Hero() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const heroMedia = isMobile ? HERO_MEDIA_MOBILE : HERO_MEDIA_DESKTOP;
  const currentMedia = heroMedia[currentVideoIndex];

  // Handle video ended event to cycle to next media
  const handleVideoEnded = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % heroMedia.length);
      setIsTransitioning(false);
    }, 300);
  };

  // Navigate to previous/next slide
  const goToPrevious = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentVideoIndex((prev) => (prev - 1 + heroMedia.length) % heroMedia.length);
      setIsTransitioning(false);
    }, 300);
  };
  
  const goToNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % heroMedia.length);
      setIsTransitioning(false);
    }, 300);
  };

  // Auto-advance for images (since they don't have onEnded event)
  useEffect(() => {
    const currentMedia = heroMedia[currentVideoIndex];
    if (currentMedia.type === 'image') {
      const timer = setTimeout(() => {
        handleVideoEnded();
      }, 5000); // Show image for 5 seconds before transitioning
      return () => clearTimeout(timer);
    }
  }, [currentVideoIndex, heroMedia]);

  // Play current video when index changes
  useEffect(() => {
    const currentMedia = heroMedia[currentVideoIndex];
    if (currentMedia.type === 'video') {
      const currentVideo = videoRefs.current[currentVideoIndex];
      if (currentVideo) {
        // Ensure video is loaded before playing
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
      if (video && index !== currentVideoIndex) {
        video.pause();
      }
    });
  }, [currentVideoIndex, heroMedia]);

  useEffect(() => {
    setCurrentVideoIndex(0);
  }, [isMobile]);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full overflow-hidden bg-[#1a1a1a]"
    >
      {/* Aspect ratio container - Desktop: ~16:7, Mobile: 4:5 */}
      <div className="relative w-full aspect-[4/5] md:aspect-[16/7] max-h-[85vh] md:max-h-[700px]">
        {/* Video/Image Background */}
        <div className="absolute inset-0 z-0">
          {heroMedia.map((media, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentVideoIndex && !isTransitioning ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
              style={{ pointerEvents: index === currentVideoIndex ? 'auto' : 'none' }}
            >
              {media.type === 'video' ? (
                <>
                  <video
                    ref={(el) => { videoRefs.current[index] = el; }}
                    src={media.src}
                    muted
                    playsInline
                    preload="auto"
                    onEnded={handleVideoEnded}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Dark overlay for video */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
                </>
              ) : (
                <Image
                  src={media.src}
                  alt="Solitario Jewelry Collection"
                  fill
                  priority={index === 0}
                  quality={index === 0 ? 90 : 80}
                  sizes="100vw"
                  className={`object-cover object-center`}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Button - Show on all slides */}
        <div className="absolute inset-0 z-10 flex items-end justify-center pb-16 md:pb-20">
          <motion.div
            key={currentVideoIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center"
          >
            <Link
              href={(currentMedia as any).ctaLink || '/products'}
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
              <span className="relative z-10">{(currentMedia as any).ctaText || 'Shop Now'}</span>
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

        {/* Media indicators */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroMedia.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentVideoIndex(index);
                  setIsTransitioning(false);
                }, 300);
              }}
              className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                index === currentVideoIndex
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
