'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Building2, TrendingUp, Users, Shield, Sparkles, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import BlurText from '@/components/ui/BlurText';

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
  'Minimum investment capacity of ₹50 Lakhs',
  'Retail space of 500-1000 sq ft in premium location',
  'Passion for luxury retail and customer service',
  'Commitment to brand values and sustainability',
  'Prior retail or business experience preferred',
];

export default function FranchisePage() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section ref={sectionRef} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-gray-900/60 to-black/80 z-10" />
          <Image
            src="/solitario/featured/overlay1.jpg"
            alt="Franchise Opportunities"
            fill
            className="object-cover object-center"
            priority
            quality={85}
            sizes="100vw"
          />
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
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-aguila text-white leading-[1.1] tracking-tight px-4"
              style={{
                fontFamily: 'var(--font-aguila), serif',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
              }}
            >
              <BlurText
                text="Franchise   With   Us"
                className="font-aguila"
                animateBy="characters"
                direction="top"
                delay={50}
                stepDuration={0.4}
              />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-6 text-sm md:text-base lg:text-lg text-white/80 font-montserrat max-w-2xl mx-auto"
            >
              Join the revolution in sustainable luxury. Partner with Solitario and bring lab-grown diamonds to your city.
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
      <section className="py-24 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-didot text-white mb-6">
              Why Partner With <span className="text-bronze-gold">Solitario</span>?
            </h2>
            <p className="text-white/70 font-montserrat max-w-2xl mx-auto">
              Be part of the fastest-growing segment in the jewelry industry with a brand that stands for innovation, sustainability, and luxury.
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
                className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-bronze-gold/30 p-6 text-center transition-all duration-500"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-bronze-gold/20 flex items-center justify-center">
                  <benefit.icon className="w-7 h-7 text-bronze-gold" />
                </div>
                <h3 className="text-xl font-didot text-white mb-3">{benefit.title}</h3>
                <p className="text-white/60 text-sm font-montserrat">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-didot text-white mb-6">
                Franchise <span className="text-bronze-gold">Requirements</span>
              </h2>
              <p className="text-white/70 font-montserrat mb-8">
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
                    <CheckCircle className="w-5 h-5 text-bronze-gold flex-shrink-0 mt-0.5" />
                    <p className="text-white/80 font-montserrat">{req}</p>
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
                src="/solitario/stores/dubai.jpg"
                alt="Solitario Store"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Apply Form Section */}
      <section id="apply" className="py-24 px-4 bg-gradient-to-b from-black to-gray-900/30">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Sparkles className="w-12 h-12 text-bronze-gold mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-didot text-white mb-4">
              Start Your <span className="text-bronze-gold">Journey</span>
            </h2>
            <p className="text-white/70 font-montserrat">
              Fill out the form below and our franchise team will get in touch with you.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-8"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 text-sm font-montserrat mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white font-montserrat focus:border-bronze-gold/60 focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-montserrat mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white font-montserrat focus:border-bronze-gold/60 focus:outline-none transition-colors"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>
            <div>
              <label className="block text-white/80 text-sm font-montserrat mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white font-montserrat focus:border-bronze-gold/60 focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-montserrat mb-2">Preferred City</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white font-montserrat focus:border-bronze-gold/60 focus:outline-none transition-colors"
                placeholder="City where you want to open franchise"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-montserrat mb-2">Message</label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white font-montserrat focus:border-bronze-gold/60 focus:outline-none transition-colors resize-none"
                placeholder="Tell us about your experience and why you want to partner with Solitario..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 text-white font-gotham uppercase tracking-[0.25em] text-sm rounded-lg bg-bronze-gold/20 border border-bronze-gold/40 hover:border-bronze-gold/60 transition-all duration-500 hover:scale-[1.02]"
            >
              Submit Application
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
