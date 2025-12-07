'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import BlurText from '@/components/ui/BlurText';

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-gray-900/50 to-black/80 z-10" />
        <Image
          src="/about/story-side.jpg"
          alt="Solitario craftsmanship"
          fill
          className="object-cover object-center"
          priority
          quality={85}
          sizes="100vw"
        />
      </motion.div>

      {/* Hero Content with BlurText Animation */}
      <motion.div
        className="relative z-10 text-center px-4 pt-24 md:pt-32"
        style={{ y: textY }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-bronze-gold text-xs md:text-sm uppercase tracking-[0.3em] font-gotham mb-4"
          >
            Our Story
          </motion.span>

          <h1
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-aguila text-white leading-[1.1] tracking-tight px-4 relative z-10"
            style={{
              fontFamily: 'var(--font-aguila), serif',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 4px 16px rgba(0, 0, 0, 0.6), 0 8px 32px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div className="flex items-center justify-center gap-2 md:gap-4 lg:gap-5 mb-2 md:mb-3 flex-wrap">
              <BlurText
                text="Designed for"
                className="font-aguila"
                animateBy="characters"
                direction="top"
                delay={50}
                stepDuration={0.4}
              />
              <BlurText
                text="Today"
                className="font-aguila"
                animateBy="characters"
                direction="top"
                delay={150}
                stepDuration={0.4}
              />
            </div>
            <div className="flex items-center justify-center gap-1 md:gap-3 flex-wrap">
              <BlurText
                text="Inspired by"
                className="font-aguila italic"
                animateBy="characters"
                direction="top"
                delay={100}
                stepDuration={0.3}
              />
              <BlurText
                text="Tomorrow"
                className="font-aguila"
                animateBy="characters"
                direction="top"
                delay={200}
                stepDuration={0.4}
              />
            </div>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-6 text-sm md:text-base lg:text-lg text-white font-montserrat max-w-2xl mx-auto px-4 relative z-10"
            style={{
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 4px 16px rgba(0, 0, 0, 0.6)'
            }}
          >
            Crafting heirlooms for modern and future generations with bespoke designs and unparalleled craftsmanship
          </motion.p>

          {/* CTA Buttons - Glassmorphism Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-6 md:mt-8 flex flex-wrap gap-4 justify-center"
          >
            <Link
              href="#our-story"
              className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 text-white font-gotham uppercase tracking-[0.25em] text-xs md:text-sm rounded-lg transition-all duration-500 hover:scale-105 group relative overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10">Our Journey</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 text-white font-gotham uppercase tracking-[0.25em] text-xs md:text-sm rounded-lg transition-all duration-500 hover:scale-105 group relative overflow-hidden bg-bronze-gold/20 border border-bronze-gold/40 hover:border-bronze-gold/60"
            >
              <span className="relative z-10">Explore Collection</span>
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform relative z-10" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
