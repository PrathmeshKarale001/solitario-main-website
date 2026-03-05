'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ShopHeroSection } from '@/lib/shopify-metaobjects';

interface DynamicShopHeroProps {
  fallbackMedia?: Array<{
    type: 'image' | 'video';
    src: string;
    pos?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
  }>;
}

export default function DynamicShopHero({ fallbackMedia }: DynamicShopHeroProps) {

  const [heroSections, setHeroSections] = useState<ShopHeroSection[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  // Default fallback media - using optimized WebP images
  const defaultFallbackMedia = [
    {
      type: 'image' as const,
      src: '/images/home-hero/newhero/2nd.png',
      pos: 'object-center',
      title: '',
      subtitle: '',
      description: '',
      ctaText: 'Shop Collection',
      ctaLink: '#products'
    },
    {
      type: 'image' as const,
      src: '/images/Shop/shop1desk.webp',
      pos: 'object-[50%_0%]',
      title: '',
      subtitle: '',
      description: '',
      ctaText: 'Shop Collection',
      ctaLink: '#products'
    },
    {
      type: 'image' as const,
      src: '/images/category-page-banner/Web Banner - Bracelet.webp',
      pos: 'object-center',
      title: '',
      subtitle: '',
      description: '',
      ctaText: 'Shop Collection',
      ctaLink: '#products'
    },
    {
      type: 'image' as const,
      src: '/images/category-page-banner/Web Banner - Necklace.webp',
      pos: 'object-center',
      title: '',
      subtitle: '',
      description: '',
      ctaText: 'Shop Collection',
      ctaLink: '#products'
    },
    {
      type: 'image' as const,
      src: '/images/category-page-banner/Web Banner - earrings.webp',
      pos: 'object-center',
      title: '',
      subtitle: '',
      description: '',
      ctaText: 'Shop Collection',
      ctaLink: '#products'
    },

    {
      type: 'image' as const,
      src: '/images/category-page-banner/Web Banner - Rings.webp',
      pos: 'object-center',
      title: '',
      subtitle: '',
      description: '',
      ctaText: 'Shop Collection',
      ctaLink: '#products'
    },




  ];

  // Mobile fallback media - using optimized WebP images
  const defaultFallbackMediaMobile = [
    {
      type: 'image' as const,
      src: '/images/home-hero/newhero/2ndMobile.png',
      pos: 'object-center',
      title: '',
      subtitle: '',
      description: '',
      ctaText: 'Shop Collection',
      ctaLink: '#products'
    },
    {
      type: 'image' as const,
      src: '/images/Shop/shop1mobile.webp',
      pos: 'object-[50%_20%]',
      title: '',
      subtitle: '',
      description: '',
      ctaText: 'Shop Collection',
      ctaLink: '#products'
    },
    {
      type: 'image' as const,
      src: '/images/category-page-banner/Mobile Banner - Bracelet.webp',
      pos: 'object-center',
      title: '',
      subtitle: '',
      description: '',
      ctaText: 'Shop Collection',
      ctaLink: '#products'
    },
    {
      type: 'image' as const,
      src: '/images/category-page-banner/Mobile Banner - necklace.webp',
      pos: 'object-center',
      title: '',
      subtitle: '',
      description: '',
      ctaText: 'Shop Collection',
      ctaLink: '#products'
    },
    {
      type: 'image' as const,
      src: '/images/category-page-banner/Mobile Banner - Earrings.webp',
      pos: 'object-center',
      title: '',
      subtitle: '',
      description: '',
      ctaText: 'Shop Collection',
      ctaLink: '#products'
    },
    {
      type: 'image' as const,
      src: '/images/category-page-banner/Mobile Banner - Rings.webp',
      pos: 'object-center',
      title: '',
      subtitle: '',
      description: '',
      ctaText: 'Shop Collection',
      ctaLink: '#products'
    },
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Set loading to false immediately so fallback images show right away
    setLoading(false);

    // Fetch shop hero content in background (non-blocking)
    async function fetchShopHeroContent() {
      try {
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const heroResponse = await fetch('/api/dynamic-content?type=shop-hero', {
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (heroResponse.ok) {
          const heroData = await heroResponse.json();
          if (heroData.success && heroData.data?.length > 0) {
            setHeroSections(heroData.data);
          }
        }

      } catch (error) {
        // Silent error handling - fallback images will be used
        if (error instanceof Error && error.name !== 'AbortError') {
          console.warn('Failed to fetch shop hero content, using fallback');
        }
      }
    }

    // Fetch in background without blocking
    fetchShopHeroContent();

    return () => window.removeEventListener('resize', checkMobile);
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
  // Combine Shopify content with static fallback content
  const shopifyMedia: MediaItem[] = heroSections.length > 0
    ? heroSections.map(hero => {
      // Use mobile-specific media if on mobile and available
      const backgroundImage = isMobile && hero.mobileBackgroundImage?.url
        ? hero.mobileBackgroundImage.url
        : hero.backgroundImage.url;

      const backgroundVideo = isMobile && hero.mobileBackgroundVideo
        ? hero.mobileBackgroundVideo
        : hero.backgroundVideo;

      return {
        type: hero.mediaType || 'image',
        src: hero.mediaType === 'video' && backgroundVideo
          ? backgroundVideo
          : backgroundImage,
        pos: 'object-center',
        title: hero.title,
        subtitle: hero.subtitle,
        description: hero.description,
        ctaText: hero.ctaText,
        ctaLink: hero.ctaLink
      };
    })
    : [];

  const staticMedia = fallbackMedia || (isMobile ? defaultFallbackMediaMobile : defaultFallbackMedia);

  // Show Shopify content first, then static content
  // Always ensure we have at least fallback media available
  const mediaToUse = shopifyMedia.length > 0
    ? [...shopifyMedia, ...staticMedia]
    : (staticMedia.length > 0 ? staticMedia : defaultFallbackMedia);

  // Safety check - if somehow no media, use desktop fallback
  if (mediaToUse.length === 0) {
    console.warn('No media available, using desktop fallback');
    return (
      <section className="relative w-full overflow-hidden bg-[#1a1a1a]">
        <div className="relative w-full aspect-[4/5] md:aspect-[16/7] max-h-[85vh] md:max-h-[700px]">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/home-hero/newhero/2nd.png"
              alt="Solitario Jewelry Shop"
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          </div>
          <div className="absolute inset-0 z-10 flex items-end justify-center pb-16 md:pb-20">
            <Link
              href="#products"
              className="group inline-flex items-center gap-2 px-5 py-2.5 md:gap-3 md:px-12 md:py-5 text-white font-gotham uppercase tracking-[0.3em] text-xs md:text-sm rounded-full transition-all duration-500 hover:scale-105 relative overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              }}
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="relative z-10">Shop Collection</span>
              <ArrowRight className="w-3 h-3 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Handle media transition
  const handleMediaEnded = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % mediaToUse.length);
      setIsTransitioning(false);
    }, 300);
  };

  // Auto-advance for images only
  useEffect(() => {
    if (mediaToUse[currentIndex]?.type === 'image') {
      const timer = setTimeout(() => {
        handleMediaEnded();
      }, 5000); // Change image every 5 seconds
      return () => clearTimeout(timer);
    }
  }, [currentIndex, mediaToUse]);

  // Reset index when media changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [isMobile, heroSections]);

  // Get current media content
  const currentMedia = mediaToUse[currentIndex];
  const hasCustomCTA = currentMedia && currentMedia.ctaText && currentMedia.ctaLink;

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#1a1a1a]">
      <div className="relative w-full aspect-[4/5] md:aspect-[16/7] max-h-[85vh] md:max-h-[700px]">
        {/* Video/Image Background */}
        <div className="absolute inset-0 z-0">
          {mediaToUse.map((media, index) => (
            <motion.div
              key={index}
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
                  alt="Solitario Jewelry Shop"
                  fill
                  priority={index === 0}
                  quality={index === 0 ? 90 : 75}
                  sizes="100vw"
                  className={`object-cover ${media.pos ?? 'object-center'}`}
                />
              )}
              {/* Dark overlay for better CTA visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
            </motion.div>
          ))}
        </div>

        {/* CTA - Always at bottom like original */}
        <div className="absolute inset-0 z-10 flex items-end justify-center pb-16 md:pb-20">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center"
          >
            {(hasCustomCTA && currentMedia.ctaText && currentMedia.ctaLink) ? (
              <Link
                href={typeof currentMedia.ctaLink === 'string' && (currentMedia.ctaLink.startsWith('{') || currentMedia.ctaLink.startsWith('['))
                  ? (() => {
                    try {
                      const parsed = JSON.parse(currentMedia.ctaLink);
                      return parsed.url || parsed.link || currentMedia.ctaLink;
                    } catch (e) {
                      return currentMedia.ctaLink;
                    }
                  })()
                  : currentMedia.ctaLink}
                className="group inline-flex items-center gap-2 px-5 py-2.5 md:gap-3 md:px-12 md:py-5 text-white font-gotham uppercase tracking-[0.3em] text-xs md:text-sm rounded-full transition-all duration-500 hover:scale-105 relative overflow-hidden"
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
                <ArrowRight className="w-3 h-3 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
              </Link>
            ) : (
              <Link
                href="#products"
                className="group inline-flex items-center gap-2 px-5 py-2.5 md:gap-3 md:px-12 md:py-5 text-white font-gotham uppercase tracking-[0.3em] text-xs md:text-sm rounded-full transition-all duration-500 hover:scale-105 relative overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="relative z-10">Shop Collection</span>
                <ArrowRight className="w-3 h-3 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
              </Link>
            )}
          </motion.div>
        </div>

        {/* Media indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
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
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
