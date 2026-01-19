'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Building2, TrendingUp, Users, Shield, Sparkles, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import BlurText from '@/components/ui/BlurText';


// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// Hero images for desktop
const HERO_IMAGES_DESKTOP = [
  { src: '/images/general/Copy of WhatsApp Image 2025-02-19 at 5.13.42 PM (1).jpeg', pos: 'object-center' },
  { src: '/images/Franchise/2.webp', pos: 'object-[50%_20%]' },
  { src: '/images/Franchise/3.webp', pos: 'object-[50%_25%]' },
];

// Hero images for mobile
const HERO_IMAGES_MOBILE = [
  { src: '/images/Franchise/Mobile1.webp', pos: 'object-[50%_20%]' },
  { src: '/images/Franchise/2.webp', pos: 'object-[50%_20%]' },
  { src: '/images/Franchise/3.webp', pos: 'object-[50%_25%]' },
];

const BENEFITS = [
  {
    icon: TrendingUp,
    title: 'Growing Market',
    description: 'Lab-grown diamonds are the fastest-growing segment in the jewelry industry with 20%+ annual growth.',
  },
  {
    icon: Shield,
    title: 'Established Brand',
    description: 'Partner with a brand backed by celebrity co-founders and proven market presence across continents.',
  },
  {
    icon: Users,
    title: 'Full Support',
    description: 'Comprehensive training, marketing support, and operational guidance from our expert team.',
  },
  {
    icon: Building2,
    title: 'Prime Locations',
    description: 'Access to premium retail locations in high-traffic malls and luxury shopping destinations.',
  },
];

const REQUIREMENTS = [
  'Minimum investment capacity of ₹1 Crore',
  'Retail space of 500-1000 sq ft in premium location',
  'Passion for luxury retail and customer service',
  'Commitment to brand values and excellence',
  'Prior retail or business experience preferred',
];

export default function FranchisePage() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const imageIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-rotate images
  useEffect(() => {
    const heroImages = isMobile ? HERO_IMAGES_MOBILE : HERO_IMAGES_DESKTOP;
    imageIntervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => {
      if (imageIntervalRef.current) clearInterval(imageIntervalRef.current);
    };
  }, [isMobile]);

  const heroImages = isMobile ? HERO_IMAGES_MOBILE : HERO_IMAGES_DESKTOP;

  return (
    <div className="min-h-screen bg-brand-50">
      {/* Hero Section */}
      <section ref={sectionRef} className="relative min-h-[80vh] md:min-h-[91vh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-gray-900/60 to-black/80 z-10" />
          <AnimatePresence mode="wait">
            {heroImages.map((item, index) => (
              index === currentImageIndex % heroImages.length && (
                <motion.div
                  key={`${isMobile ? 'mobile' : 'desktop'}-${index}`}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={item.src}
                    alt={`Franchise Opportunities ${index + 1}`}
                    fill
                    className={`object-cover ${item.pos}`}
                    priority={index === 0}
                    quality={index === 0 ? 85 : 75}
                    sizes="(max-width: 768px) 100vw, 1920px"
                  />
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </motion.div>

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
              Business Opportunity
            </motion.span>

            <h1
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-playfair text-white leading-[1.1] tracking-tight px-4"
              style={{
                fontFamily: 'var(--font-playfair), serif',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
              }}
            >
              <BlurText
                text="Franchise"
                className="font-playfair inline-block"
                animateBy="characters"
                direction="top"
                delay={50}
                stepDuration={0.4}
              />
              <span className="inline-block">&nbsp;</span>
              <BlurText
                text="With"
                className="font-playfair inline-block"
                animateBy="characters"
                direction="top"
                delay={150}
                stepDuration={0.4}
              />
              <span className="inline-block">&nbsp;</span>
              <BlurText
                text="Us"
                className="font-playfair inline-block"
                animateBy="characters"
                direction="top"
                delay={250}
                stepDuration={0.4}
              />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-6 text-sm md:text-base lg:text-lg text-white/80 font-montserrat max-w-2xl mx-auto"
            >
              Join the revolution in modern luxury. Partner with Solitario and bring lab-grown diamonds to your city.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-8"
            >
              <Link
                href="#apply"
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-gotham uppercase tracking-[0.25em] text-sm rounded-lg bg-bronze-gold/20 border border-bronze-gold/40 hover:border-bronze-gold/60 transition-all duration-500 hover:scale-105"
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Why Partner Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-xl sm:text-2xl md:text-4xl font-playfair text-brand-800 mb-4" style={{ letterSpacing: '-0.02em' }}>
              Why Partner With <span className="text-classic-green">Solitario</span>?
            </h2>
            <p className="text-brand-700 font-montserrat max-w-2xl mx-auto">
              Be part of the fastest-growing segment in the jewelry industry with a brand that stands for innovation, quality, and luxury.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((benefit, idx) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-2xl bg-brand-50 border border-brand-200 hover:border-classic-green/30 hover:shadow-brand-lg p-6 text-center transition-all duration-500"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-classic-green/10 flex items-center justify-center">
                  <benefit.icon className="w-7 h-7 text-classic-green" />
                </div>
                <h3 className="text-xl font-playfair text-brand-800 mb-3">{benefit.title}</h3>
                <p className="text-brand-600 text-sm font-montserrat">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-24 px-4 bg-brand-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-xl sm:text-2xl md:text-4xl font-playfair text-brand-800 mb-4" style={{ letterSpacing: '-0.02em' }}>
                Franchise <span className="text-classic-green">Requirements</span>
              </h2>
              <p className="text-brand-700 font-montserrat mb-8">
                We're looking for passionate partners who share our vision for sustainable luxury and exceptional customer experiences.
              </p>

              <div className="space-y-4">
                {REQUIREMENTS.map((req, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-classic-green flex-shrink-0 mt-0.5" />
                    <p className="text-brand-700 font-montserrat">{req}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden"
            >
              <Image
                src="/images/general/DSC09569.jpg"
                alt="Solitario Store"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                quality={60}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Apply Form Section */}
      <section id="apply" className="py-24 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Sparkles className="w-12 h-12 text-classic-green mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-playfair text-brand-800 mb-4">
              Start Your <span className="text-classic-green">Journey</span>
            </h2>
            <p className="text-brand-700 font-montserrat">
              Fill out the form below and our franchise team will get in touch with you.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 rounded-3xl bg-brand-50 border border-brand-200 p-8 shadow-brand"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-brand-800 text-sm font-montserrat mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-white border border-brand-200 text-brand-800 font-montserrat focus:border-classic-green focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-brand-800 text-sm font-montserrat mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-lg bg-white border border-brand-200 text-brand-800 font-montserrat focus:border-classic-green focus:outline-none transition-colors"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>
            <div>
              <label className="block text-brand-800 text-sm font-montserrat mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg bg-white border border-brand-200 text-brand-800 font-montserrat focus:border-classic-green focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-brand-800 text-sm font-montserrat mb-2">Preferred City</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-white border border-brand-200 text-brand-800 font-montserrat focus:border-classic-green focus:outline-none transition-colors"
                placeholder="City where you want to open franchise"
              />
            </div>
            <div>
              <label className="block text-brand-800 text-sm font-montserrat mb-2">Message</label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white border border-brand-200 text-brand-800 font-montserrat focus:border-classic-green focus:outline-none transition-colors resize-none"
                placeholder="Tell us about your experience and why you want to partner with Solitario..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 text-white font-gotham uppercase tracking-[0.25em] text-sm rounded-lg bg-classic-green hover:bg-classic-green/90 transition-all duration-500 hover:scale-[1.02]"
            >
              Submit Application
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
