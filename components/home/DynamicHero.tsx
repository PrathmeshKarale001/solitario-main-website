'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { HeroSection, ObservatoryEvent } from '@/lib/shopify-metaobjects';

interface DynamicHeroProps {
  fallbackMedia?: Array<{
    type: 'image' | 'video';
    src: string;
    pos?: string;
  }>;
}

export default function DynamicHero({ fallbackMedia }: DynamicHeroProps) {
  const [heroSections, setHeroSections] = useState<HeroSection[]>([]);
  const [observatoryEvent, setObservatoryEvent] = useState<ObservatoryEvent | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  // Default fallback media
  const defaultFallbackMedia = [
    {
      type: 'image' as const,
      src: '/images/home-hero/newhero/LohriPC.jpg',
      pos: 'object-center',
    },
    {
      type: 'image' as const,
      src: '/images/home-hero/newhero/1st.png',
      pos: 'object-center',
    },
    {
      type: 'image' as const,
      src: '/images/HERO BANNER 2.webp',
      pos: 'object-[50%_20%]',
    }
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch dynamic content
  useEffect(() => {
    async function fetchDynamicContent() {
      try {
        console.log('🎯 Fetching dynamic hero content...');
        
        // Fetch hero sections and current observatory event
        const [heroResponse, observatoryResponse] = await Promise.all([
          fetch('/api/dynamic-content?type=hero'),
          fetch('/api/dynamic-content?type=observatory&handle=current')
        ]);

        if (heroResponse.ok) {
          const heroData = await heroResponse.json();
          if (heroData.success && heroData.data?.length > 0) {
            console.log(`✅ Found ${heroData.data.length} hero sections`);
            setHeroSections(heroData.data);
          }
        }

        if (observatoryResponse.ok) {
          const observatoryData = await observatoryResponse.json();
          if (observatoryData.success && observatoryData.data) {
            console.log(`🔭 Found current observatory event: ${observatoryData.data.title}`);
            setObservatoryEvent(observatoryData.data);
          }
        }

      } catch (error) {
        console.error('❌ Error fetching dynamic content:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDynamicContent();
  }, []);

  // Define media type with optional content fields
  type MediaItem = {
    type: 'image' | 'video';
    src: string;
    pos?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
  };

  // Determine which media to use
  const mediaToUse: MediaItem[] = heroSections.length > 0 
    ? heroSections.map(hero => ({
        type: 'image' as const,
        src: hero.backgroundImage.url,
        pos: 'object-center',
        title: hero.title,
        subtitle: hero.subtitle,
        description: hero.description,
        ctaText: hero.ctaText,
        ctaLink: hero.ctaLink
      }))
    : (fallbackMedia || defaultFallbackMedia);

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

  // Reset index when media changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [isMobile, heroSections]);

  // Get current media content
  const currentMedia = mediaToUse[currentIndex];
  const hasCustomContent = currentMedia && currentMedia.title;

  return (
    <section ref={sectionRef} className="relative min-h-[80vh] md:min-h-screen flex flex-col overflow-hidden bg-black">
      {/* Observatory Event Banner */}
      {observatoryEvent && (
        <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2 px-4">
          <div className="container mx-auto text-center">
            <p className="text-sm md:text-base font-medium">
              🔭 {observatoryEvent.title} - {observatoryEvent.description}
              {observatoryEvent.ctaLink && (
                <Link href={observatoryEvent.ctaLink} className="ml-2 underline hover:no-underline">
                  {observatoryEvent.ctaText || 'Learn More'}
                </Link>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 z-20 bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading...</p>
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
              <video
                ref={(el) => { videoRefs.current[index] = el; }}
                src={media.src}
                muted
                playsInline
                preload="auto"
                onEnded={handleMediaEnded}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <Image
                src={media.src}
                alt={hasCustomContent ? currentMedia.title || 'Solitario Jewelry' : 'Solitario Jewelry'}
                fill
                priority={index === 0}
                quality={index === 0 ? 90 : 75}
                sizes="100vw"
                className={`object-cover ${media.pos ?? 'object-center'}`}
              />
            )}
            {/* Dark overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          </motion.div>
        ))}
      </div>

      {/* Dynamic Content Overlay */}
      {hasCustomContent && currentMedia.title && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white max-w-4xl mx-auto px-6"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-gotham font-light mb-4 tracking-wide">
              {currentMedia.title}
            </h1>
            {currentMedia.subtitle && (
              <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-6 opacity-90">
                {currentMedia.subtitle}
              </h2>
            )}
            {currentMedia.description && (
              <p className="text-lg md:text-xl mb-8 opacity-80 max-w-2xl mx-auto">
                {currentMedia.description}
              </p>
            )}
            {currentMedia.ctaText && currentMedia.ctaLink && (
              <Link
                href={currentMedia.ctaLink}
                className="group inline-flex items-center gap-3 px-8 py-4 md:px-12 md:py-5 text-white font-gotham uppercase tracking-[0.3em] text-xs md:text-sm rounded-full transition-all duration-500 hover:scale-105 relative overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="relative z-10">{currentMedia.ctaText}</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
              </Link>
            )}
          </motion.div>
        </div>
      )}

      {/* Default CTA (when no custom content) */}
      {!hasCustomContent && (
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
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="relative z-10">Explore Collection</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
            </Link>
          </motion.div>
        </div>
      )}

      {/* Media indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
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
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentIndex
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
