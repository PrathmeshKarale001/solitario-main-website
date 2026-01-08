'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const HERO_MEDIA_DESKTOP = [
  // {
  //   type: 'image',
  //   src: '/images/HomeBanner1st.jpg',
  //   pos: 'object-center',
  // },
  {
    type: 'image',
    src: '/images/home-hero/newhero/1st.png',
    pos: 'object-center',
  },
  {
    type: 'image',
    src: '/images/HERO BANNER 2.webp',
    pos: 'object-[50%_20%]',
  },
  {
    type: 'image',
    src: '/images/hero-banner-3.webp',
    pos: 'object-center',
  },
  {
    type: 'image',
    src: '/images/HERO BANNER 4.webp',
    pos: 'object-center',
  },
  {
    type: 'video',
    src: '/product-hero-assets/Lab Grown Diamond  Jewellery  Lab Cultured Diamonds  Engineered Diamonds (3).mp4',
  },
];

const HERO_MEDIA_MOBILE = [
  // {
  //   type: 'image',
  //   src: '/images/HomeBanner1st.jpg',
  //   pos: 'object-center',
  // },
  {
    type: 'image',
    src: '/images/home-hero/newhero/1stMobile.png',
    pos: 'object-center',
  },
  {
    type: 'image',
    src: '/images/HOMEBanner5.jpg',
    pos: 'object-center',
  },
  {
    type: 'image',
    src: '/images/Hero_Mobile/Hero%20banner%202.jpg',
    pos: 'object-center',
  },
  {
    type: 'image',
    src: '/images/home-hero/newhero/3rdMobile.png',
    pos: 'object-center',
  },
  {
    type: 'image',
    src: '/images/Hero_Mobile/Hero%20banner%204.jpg',
    pos: 'object-center',
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

  // Handle video ended event to cycle to next media
  const handleVideoEnded = () => {
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
    <section ref={sectionRef} className="relative min-h-[80vh] md:min-h-screen flex flex-col overflow-hidden bg-black">
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
              <video
                ref={(el) => { videoRefs.current[index] = el; }}
                src={media.src}
                muted
                playsInline
                preload="auto"
                onEnded={handleVideoEnded}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <Image
                src={media.src}
                alt="Solitario Jewelry"
                fill
                priority={index === 0} // Always prioritize first image for LCP
                quality={index === 0 ? 90 : 75} // Higher quality for LCP image
                sizes="100vw"
                className={`object-cover ${(media as any).pos ?? 'object-center'}`}
              />
            )}
            {/* Dark overlay for better CTA visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          </motion.div>
        ))}
      </div>

      {/* Aesthetic CTA - Centered at bottom */}
      <div className="absolute inset-0 z-10 flex items-end justify-center pb-20 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center"
        >
          <Link
            href="/products"
            className="group inline-flex items-center gap-3 px-8 py-4 md:px-12 md:py-5 text-white font-gotham uppercase tracking-[0.3em] text-xs md:text-sm rounded-full transition-all duration-500 hover:scale-105 relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <span className="relative z-10">Explore Collection</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
          </Link>
        </motion.div>
      </div>

      {/* Media indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
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
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentVideoIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to media ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
