'use client';

import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import BlurText from '@/components/ui/BlurText';

// Lazy load Particles component to improve initial load
const Particles = lazy(() => import('@/components/ui/Particles').then(mod => ({ default: mod.default })));

type HeroMedia = { type: 'image' | 'video'; src: string };

// Hero media: start with flagship video, then continue images
const HERO_MEDIA: HeroMedia[] = [
  {
    type: 'video',
    src: '/product-hero-assets/Lab Grown Diamond  Jewellery  Lab Cultured Diamonds  Engineered Diamonds.mp4',
  },
  { type: 'image', src: '/images/background/optimized/bg (2).jpg' },  // 144KB
  { type: 'image', src: '/images/background/optimized/bg (3).jpg' },  // 177KB
  { type: 'image', src: '/images/background/optimized/bg (6).jpg' },  // 100KB
];

// Featured jewellery images - Reduced to 2 for better performance
const JEWELLERY_IMAGES = [
  '/images/products/imgi_10_IZRG0120_AP.png',
  '/images/products/imgi_8_IZRG0086_AP.png',
];

  export default function Hero() {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentJewelleryIndex, setCurrentJewelleryIndex] = useState(0);
  const [hasVideoFinished, setHasVideoFinished] = useState(false);
  const mediaIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const panelsY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const jewelleryY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const jewelleryRotate = useTransform(scrollYProgress, [0, 1], [0, 5]);

  useEffect(() => {
    let jewelleryInterval: NodeJS.Timeout | null = null;

    // Delay jewellery carousel to improve initial render
    const jewelleryTimeout = setTimeout(() => {
      jewelleryInterval = setInterval(() => {
        setCurrentJewelleryIndex((prev) => (prev + 1) % JEWELLERY_IMAGES.length);
      }, 5000); // Change jewellery every 5 seconds (slower = less CPU)
    }, 2500); // Start jewellery carousel after 2.5 seconds

    return () => {
      clearTimeout(jewelleryTimeout);
      if (mediaIntervalRef.current) clearInterval(mediaIntervalRef.current);
      if (jewelleryInterval) clearInterval(jewelleryInterval);
    };
  }, []);

  // Force play video on mount with a delay to allow transition to complete
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (currentMediaIndex === 0 && videoRef.current) {
      // Delay playback by 1 second to sync with entrance animation
      const playTimeout = setTimeout(() => {
        videoRef.current?.play().catch(console.error);
      }, 1000);

      return () => clearTimeout(playTimeout);
    }
  }, [currentMediaIndex]);

  // Start cycling images only after the intro video finishes
  useEffect(() => {
    if (!hasVideoFinished) return;
    mediaIntervalRef.current = setInterval(() => {
      setCurrentMediaIndex((prev) => {
        const next = prev + 1;
        // Loop only through images (indexes 1..end), skipping the video index 0
        return next >= HERO_MEDIA.length ? 1 : next;
      });
    }, 8000);

    return () => {
      if (mediaIntervalRef.current) clearInterval(mediaIntervalRef.current);
    };
  }, [hasVideoFinished]);

  const handleVideoEnded = () => {
    setHasVideoFinished(true);
    // Move to the first image as soon as the video ends
    setCurrentMediaIndex(1);
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Particles Background - Disabled for performance */}
      {/* <Suspense fallback={null}>
        <Particles count={15} />
      </Suspense> */}

      {/* Background Media (video first, then images) with Cross-fade and Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <AnimatePresence mode="wait">
          {HERO_MEDIA.map((media, index) => (
            index === currentMediaIndex && (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-classic-green/60 via-teal/50 to-classic-green/80" />
                {media.type === 'video' ? (
                  <video
                    ref={videoRef}
                    key={media.src}
                    src={media.src}
                    muted
                    playsInline
                    onEnded={handleVideoEnded}
                    onError={handleVideoEnded}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    preload="auto"
                  />
                ) : (
                  <Image
                    src={media.src}
                    alt={`Hero image ${index + 1}`}
                    fill
                    className="object-cover object-center"
                    priority={index === 0}
                    quality={index === 0 ? 85 : 75}
                    sizes="100vw"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                )}
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Hero Content - Main Text Overlay with Parallax */}
      {hasVideoFinished && (
        <motion.div
          className="relative z-10 flex-1 flex items-center justify-center px-4 pt-24 md:pt-32 pb-8"
          style={{ y: textY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-7xl mx-auto text-center">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-aguila text-white leading-[1.1] tracking-tight px-4 relative z-10"
            style={{ 
              fontFamily: 'var(--font-aguila), serif',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 4px 16px rgba(0, 0, 0, 0.6), 0 8px 32px rgba(0, 0, 0, 0.4)'
            }}
          >
            {/* First Line: Sparkle - Jewellery - Endlessly */}
            <div className="flex items-center justify-center gap-2 md:gap-4 lg:gap-5 mb-2 md:mb-3">
              <BlurText
                text="Sparkle"
                className="font-aguila"
                animateBy="characters"
                direction="top"
                delay={50}
                stepDuration={0.4}
              />
              
              {/* Transparent Jewellery Image - Integrated in text */}
              <motion.span
                className="relative inline-block"
                style={{ y: jewelleryY, rotate: jewelleryRotate }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentJewelleryIndex}
                    initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
                    animate={{ opacity: 0.85, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotate: 10 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28"
                  >
                    <Image
                      src={JEWELLERY_IMAGES[currentJewelleryIndex]}
                      alt="Diamond Ring"
                      fill
                      className="object-contain drop-shadow-[0_0_30px_rgba(172,136,75,0.4)]"
                      sizes="(max-width: 768px) 64px, (max-width: 1024px) 80px, 112px"
                      quality={80}
                      loading="lazy"
                      style={{
                        filter: 'brightness(1.1) contrast(1.1)',
                        mixBlendMode: 'screen',
                      }}
                    />
                    {/* Glow effect */}
                    <div 
                      className="absolute inset-0 blur-xl rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(172,136,75,0.2) 0%, rgba(172,136,75,0.1) 50%, transparent 100%)'
                      }}
                    />
                    {/* Sparkle effect */}
                    <motion.div
                      className="absolute inset-0"
                      animate={{
                        opacity: [0.3, 0.7, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <div className="absolute top-0 left-1/2 w-2 h-2 bg-bronze-gold rounded-full blur-sm" />
                      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-bronze-gold rounded-full blur-sm" />
                      <div className="absolute top-1/2 left-0 w-1 h-1 bg-bronze-gold rounded-full blur-sm" />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </motion.span>

              <span className="relative inline-block">
                <BlurText
                  text="endlessly"
                  className="font-aguila"
                  animateBy="characters"
                  direction="top"
                  delay={200}
                  stepDuration={0.4}
                />
                <motion.span
                  className="absolute -top-1 -right-6 md:-right-8 text-xl md:text-2xl lg:text-3xl opacity-60 font-aguila"
                  style={{ fontFamily: 'var(--font-aguila), serif' }}
                  animate={{
                    rotate: [0, 360],
                    scale: [0.6, 0.8, 0.6],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  ♢
                </motion.span>
              </span>
            </div>

            {/* Second Line: with exclusive Diamond Designs */}
            <div className="flex items-center justify-center gap-1 md:gap-3 flex-wrap">
              <span 
                className="relative inline-block italic font-aguila"
                style={{ fontFamily: 'var(--font-aguila), serif' }}
              >
                <BlurText
                  text="with"
                  className="font-aguila italic"
                  animateBy="characters"
                  direction="top"
                  delay={200}
                  stepDuration={0.3}
                />
              </span>
              <span 
                className="relative inline-block italic font-aguila"
                style={{ fontFamily: 'var(--font-aguila), serif' }}
              >
                <BlurText
                  text="exclusive"
                  className="font-aguila italic"
                  animateBy="characters"
                  direction="top"
                  delay={120}
                  stepDuration={0.3}
                />
              </span>
              <span 
                className="relative inline-block font-aguila"
                style={{ fontFamily: 'var(--font-aguila), serif' }}
              >
                <BlurText
                  text="Diamond"
                  className="font-aguila"
                  animateBy="characters"
                  direction="top"
                  delay={100}
                  stepDuration={0.4}
                />
              </span>
              <span 
                className="relative inline-block font-aguila"
                style={{ fontFamily: 'var(--font-aguila), serif' }}
              >
                <BlurText
                  text="Designs"
                  className="font-aguila"
                  animateBy="characters"
                  direction="top"
                  delay={200}
                  stepDuration={0.4}
                />
              </span>
            </div>
            
          </h1>

          {/* Subtitle with enhanced styling - 1.5rem gap from title */}
          <br />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-6 text-sm md:text-base lg:text-lg text-white font-montserrat max-w-2xl mx-auto px-4 relative z-10"
            style={{ 
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 4px 16px rgba(0, 0, 0, 0.6)'
            }}
          >
            Crafted for modern & future generations
          </motion.p>

          {/* CTA Button - Glassmorphism style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-2 sm:mt-3 md:mt-4"
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-3 text-white font-gotham uppercase tracking-[0.2em] text-[10px] sm:text-xs lg:text-sm rounded-lg transition-all duration-500 hover:scale-105 group relative overflow-hidden touch-manipulation"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              }}
            >
              {/* Glassmorphism overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Border glow on hover */}
              <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-bronze-gold/40 transition-all duration-500" />
              
              <span className="relative z-10">Explore Collections</span>
              <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </Link>
          </motion.div>
        </div>
        </motion.div>
      )}

      {/* Content Panels Below Hero - Compact & Wide with Parallax */}
      {hasVideoFinished && (
        <motion.div
          className="relative z-10 px-3 sm:px-4 pb-4 sm:pb-6"
          style={{ y: panelsY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
          {/* Left Panel - Latest Collections */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative rounded-2xl overflow-hidden backdrop-blur-2xl bg-black/30 border border-white/10 shadow-luxury-lg hover:border-bronze-gold/30 transition-all duration-500 group"
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-bronze-gold/5 opacity-60 pointer-events-none" />
            
            {/* Gold accent border */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-bronze-gold/20 transition-all duration-500" />
            
            <div className="relative z-10 p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
              {/* Product Image - Left Side */}
              <div className="relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44">
                <Image
                  src="/images/hero/herostatic (1).png"
                  alt="Latest Diamond Collection"
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 176px"
                  quality={75}
                  loading="lazy"
                />
              </div>

              {/* Text Content - Right Side */}
              <div className="flex-1 min-w-0 space-y-2 md:space-y-2.5">
                <h2 className="text-sm md:text-xl lg:text-2xl font-didot text-white" style={{ letterSpacing: '-0.01em' }}>
                  Latest Collections
                </h2>
                <p className="text-white/90 text-xs md:text-sm leading-relaxed font-montserrat hidden sm:block">
                  We're crafting personalised Memories since 1984
                </p>
                <div className="flex items-center justify-between">
                  <Link
                    href="/products"
                    className="inline-flex items-center text-white bg-bronze-gold/20 hover:bg-bronze-gold/30 border border-bronze-gold/40 hover:border-bronze-gold/60 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] rounded-lg backdrop-blur-sm transition-all duration-500 group/btn font-gotham shadow-luxury hover:shadow-glow touch-manipulation"
                    style={{ letterSpacing: '0.25em' }}
                  >
                    VIEW COLLECTION
                    <ArrowRight className="ml-1 sm:ml-2 w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                  <span className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wider font-gotham">
                    01/025/FA
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Premium Grade Ring */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative rounded-3xl overflow-hidden backdrop-blur-2xl bg-gradient-to-br from-bronze-gold/15 via-black/30 to-black/40 border border-bronze-gold/20 shadow-luxury-lg hover:border-bronze-gold/40 transition-all duration-500 group"
          >
            {/* Glassmorphism overlay with gold tint */}
            <div className="absolute inset-0 bg-gradient-to-br from-bronze-gold/10 via-transparent to-bronze-gold/5 opacity-60 pointer-events-none" />
            
            {/* Gold accent border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-bronze-gold/30 transition-all duration-500" />
            
            <div className="relative z-10 p-4 md:p-5 flex items-center gap-2 md:gap-3">
              {/* Text Content - Left Side */}
              <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2 md:space-y-2.5">
                <div>
                  <span className="text-bronze-gold text-[10px] sm:text-xs uppercase tracking-[0.2em] font-gotham mb-1 block" style={{ letterSpacing: '0.3em' }}>
                    Premium
                  </span>
                  <h2 className="text-sm md:text-xl lg:text-2xl font-didot text-white" style={{ letterSpacing: '-0.01em' }}>
                    Gold Ring
                  </h2>
                </div>
                <p className="text-white/90 text-[10px] sm:text-xs md:text-sm leading-relaxed font-montserrat hidden sm:block">
                  Handcrafted excellence
                </p>
                <div className="flex items-center justify-between">
                  <button
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-bronze-gold/20 hover:bg-bronze-gold/30 backdrop-blur-md border-2 border-bronze-gold/40 hover:border-bronze-gold/60 flex items-center justify-center transition-all duration-500 group/play shadow-glow touch-manipulation"
                    aria-label="Play video"
                  >
                    <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-bronze-gold ml-0.5 group-hover/play:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
              
              {/* Product Image - Right Side */}
              <div className="relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44">
                <Image
                  src="/images/hero/herostatic (2).png"
                  alt="Premium Gold Plated Ring"
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 176px"
                  quality={75}
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      )}
    </section>
  );
}
