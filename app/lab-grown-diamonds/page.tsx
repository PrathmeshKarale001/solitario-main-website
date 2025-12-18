'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Leaf, Shield, Diamond, Scissors, Palette, Search, Scale, Download } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import BlurText from '@/components/ui/BlurText';

export default function LabGrownDiamondsPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <div className="min-h-screen bg-brand-50">
      {/* Hero Section - Matching Home Page Theme */}
      <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-gray-900/50 to-black/80 z-10" />
          {/* Desktop hero image */}
          <Image
            src="/images/general/banner2314.jpeg"
            alt="Lab grown diamonds"
            fill
            className="object-cover object-center hidden md:block"
            priority
            quality={85}
            sizes="100vw"
          />
          {/* Mobile hero image */}
          <Image
            src="/images/general/1.7.2025 Solitario1347.jpg"
            alt="Lab grown diamonds"
            fill
            className="object-cover object-center md:hidden"
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
            <h1
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-playfair text-white leading-[1.1] tracking-tight px-4 relative z-10"
              style={{
                fontFamily: 'var(--font-playfair), serif',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 4px 16px rgba(0, 0, 0, 0.6), 0 8px 32px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div className="flex items-center justify-center gap-2 md:gap-4 lg:gap-5 mb-2 md:mb-3 flex-wrap">
                <BlurText
                  text="Why"
                  className="font-playfair"
                  animateBy="characters"
                  direction="top"
                  delay={50}
                  stepDuration={0.4}
                />
                <BlurText
                  text="Lab"
                  className="font-playfair"
                  animateBy="characters"
                  direction="top"
                  delay={100}
                  stepDuration={0.4}
                />
                <BlurText
                  text="Grown"
                  className="font-playfair"
                  animateBy="characters"
                  direction="top"
                  delay={150}
                  stepDuration={0.4}
                />
                <motion.span
                  className="relative inline-block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Diamond className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-bronze-gold drop-shadow-[0_0_30px_rgba(172,136,75,0.4)]" />
                </motion.span>
                <BlurText
                  text="Diamonds"
                  className="font-playfair"
                  animateBy="characters"
                  direction="top"
                  delay={200}
                  stepDuration={0.4}
                />
              </div>
              <div className="flex items-center justify-center gap-1 md:gap-3 flex-wrap">
                <BlurText
                  text="Are"
                  className="font-playfair"
                  animateBy="characters"
                  direction="top"
                  delay={100}
                  stepDuration={0.3}
                />
                <BlurText
                  text="The"
                  className="font-playfair"
                  animateBy="characters"
                  direction="top"
                  delay={130}
                  stepDuration={0.3}
                />
                <BlurText
                  text="Future"
                  className="font-playfair"
                  animateBy="characters"
                  direction="top"
                  delay={160}
                  stepDuration={0.3}
                />
                <BlurText
                  text="of"
                  className="font-playfair"
                  animateBy="characters"
                  direction="top"
                  delay={190}
                  stepDuration={0.3}
                />
                <BlurText
                  text="Luxury"
                  className="font-playfair"
                  animateBy="characters"
                  direction="top"
                  delay={220}
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
              A luxury that doesn't cost the Earth
            </motion.p>

            {/* CTA Buttons - Glassmorphism Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-6 md:mt-8 flex flex-wrap gap-4 justify-center"
            >
              <Link
                href="#why-lab-grown"
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
                <span className="relative z-10">Discover More</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 text-white font-gotham uppercase tracking-[0.25em] text-xs md:text-sm rounded-lg transition-all duration-500 hover:scale-105 group relative overflow-hidden bg-bronze-gold/20 border border-bronze-gold/40 hover:border-bronze-gold/60"
              >
                <span className="relative z-10">Shop Collection</span>
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform relative z-10" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Why Lab Grown Section */}
      <section id="why-lab-grown" className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl sm:text-2xl md:text-4xl font-playfair text-brand-800 mb-6" style={{ letterSpacing: '-0.02em' }}>
              The Brilliance That Paves To A <span className="text-classic-green">Brighter World</span>
            </h2>
            <p className="text-base md:text-lg text-brand-700 mb-6 leading-relaxed font-montserrat">
              For centuries, the pursuit of natural diamonds has cast a looming shadow on our planet. Beneath their sparkling allure lay tales of environmental degradation, exploitation, and blood-stained histories.
            </p>
            <p className="text-base md:text-lg text-brand-700 mb-6 leading-relaxed font-montserrat">
              Welcome to the world of lab-grown diamonds — a triumph of science, ethics, and responsibility. These ethically nurtured wonders are cultivated in controlled lab environments, channeling the genius of human innovation to recreate nature's dazzling brilliance.
            </p>
            <p className="text-base md:text-lg text-brand-800 leading-relaxed font-montserrat font-medium">
              As eco-conscious consumers increasingly opt for these sustainable gems, a new age of elegance dawns — a luxury that doesn't cost the Earth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl sm:text-2xl md:text-4xl font-playfair text-brand-800 mb-4" style={{ letterSpacing: '-0.02em' }}>
                Born From <span className="text-classic-green">Vision</span>
              </h2>
              <p className="text-base md:text-lg text-brand-700 mb-8 leading-relaxed font-montserrat">
                Solitario was born from the vision to meet the desires of modern, consciously-minded customers seeking sustainable luxury. We believe in leaving a positive footprint for the next generation.
              </p>

              {/* Vision Card */}
              <motion.div
                className="relative rounded-2xl overflow-hidden bg-white border border-brand-200 p-6 mb-6 shadow-brand"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-classic-green/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-classic-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-playfair text-brand-800 mb-2">Our Vision</h3>
                    <p className="text-brand-600 text-sm font-montserrat leading-relaxed">
                      Solitario envisions a world where ethics and beauty combine seamlessly. Our jewelry reflects the mindful values of a transformed luxury industry.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Mission Card */}
              <motion.div
                className="relative rounded-2xl overflow-hidden bg-classic-green/5 border border-classic-green/20 p-6 shadow-brand"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-classic-green/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-classic-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-playfair text-brand-800 mb-2">Our Mission</h3>
                    <p className="text-brand-600 text-sm font-montserrat leading-relaxed">
                      We pioneer sustainable jewelry for a future built on unwavering ethics. Our mission is to craft adornments that enhance beauty without exploitation.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative flex justify-center"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-luxury-lg w-[60%]">
                <Image
                  src="/images/general/Solitario D26322.jpg"
                  alt="Sustainable luxury diamonds"
                  width={480}
                  height={360}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How They're Made Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-xl sm:text-2xl md:text-4xl font-playfair text-brand-800 mb-4" style={{ letterSpacing: '-0.02em' }}>
              How They're <span className="text-classic-green">Made</span>
            </h2>
            <p className="text-base md:text-lg text-brand-700 max-w-3xl mx-auto font-montserrat">
              Lab-grown diamonds are created through advanced technological processes that replicate the natural conditions under which diamonds develop beneath the Earth's crust.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden shadow-luxury-lg"
            >
              <Image
                src="/ai-generated/lab-process.jpg"
                alt="CVD diamond creation process"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl md:text-3xl font-playfair text-brand-800 mb-6">The CVD Process</h3>
              <p className="text-brand-700 mb-6 leading-relaxed font-montserrat">
                Using Chemical Vapor Deposition (CVD), we cultivate diamonds atom by atom, ensuring each stone possesses identical physical, chemical, and optical properties to mined diamonds.
              </p>
              <p className="text-brand-700 mb-8 leading-relaxed font-montserrat">
                The process begins with a small diamond seed placed in a chamber filled with carbon-rich gases. Under precise temperature and pressure conditions, carbon atoms deposit onto the seed, gradually building a perfect diamond crystal.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-brand-50 border border-brand-200 p-4">
                  <Diamond className="w-8 h-8 text-classic-green mb-3" />
                  <h4 className="text-lg font-playfair text-brand-800 mb-1">100% Real</h4>
                  <p className="text-brand-600 text-sm font-montserrat">Identical properties to mined diamonds</p>
                </div>
                <div className="rounded-xl bg-brand-50 border border-brand-200 p-4">
                  <Leaf className="w-8 h-8 text-classic-green mb-3" />
                  <h4 className="text-lg font-playfair text-brand-800 mb-1">Eco-Friendly</h4>
                  <p className="text-brand-600 text-sm font-montserrat">Minimal environmental impact</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4Cs Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl sm:text-2xl md:text-4xl font-playfair text-brand-800 mb-4" style={{ letterSpacing: '-0.02em' }}>
                The 4Cs, <span className="text-classic-green">Elevated</span>
              </h2>
              <p className="text-base md:text-lg text-brand-700 mb-8 font-montserrat">
                A diamond's journey is guided by the timeless 4Cs. Our lab-grown diamonds honor these standards while delivering a responsible future for luxury.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Scissors, title: 'Cut', desc: 'Heart of the sparkle — light dances through precision-cut facets for unmatched brilliance.' },
                  { icon: Palette, title: 'Colour', desc: 'Near-colourless to colourless grades that showcase pure, luminous beauty.' },
                  { icon: Search, title: 'Clarity', desc: 'Minimal inclusions for a captivating, flawless look — refined by technology.' },
                  { icon: Scale, title: 'Carat', desc: 'Presence with purpose — select the size that fits your style and values.' },
                ].map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4 items-start"
                  >
                    <div className="w-10 h-10 rounded-full bg-classic-green/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-classic-green" />
                    </div>
                    <div>
                      <h3 className="text-lg font-playfair text-classic-green mb-1">{item.title}</h3>
                      <p className="text-brand-600 text-sm font-montserrat">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { src: '/diamonds/cut.png', label: 'Cut drives brilliance' },
                { src: '/diamonds/color.png', label: 'Colour spectrum D–J' },
                { src: '/diamonds/clarity.png', label: 'Clarity scale SI2 to FL' },
                { src: '/diamonds/dia_hand.jpg', label: 'Elegance in motion' },
              ].map((item, idx) => (
                <motion.div
                  key={item.src}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl bg-brand-50 border border-brand-200 p-4 overflow-hidden"
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    width={300}
                    height={200}
                    className="w-full h-40 object-contain mb-3"
                  />
                  <p className="text-brand-600 text-sm font-montserrat text-center">{item.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Diamond Gallery - Every Diamond Holds Wonder */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-xl sm:text-2xl md:text-4xl font-playfair text-brand-800 mb-4" style={{ letterSpacing: '-0.02em' }}>
              Every Diamond Holds <span className="text-classic-green">Wonder</span>
            </h2>
            <p className="text-base md:text-lg text-brand-700 max-w-3xl mx-auto font-montserrat">
              Explore the facets of Solitario lab-grown diamonds — crafted for brilliance, clarity, and a conscious footprint.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['/diamonds/dia1.jpg', '/diamonds/dia2.jpg', '/diamonds/dia3.jpg', '/diamonds/dia4.jpg'].map((src, idx) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative rounded-2xl overflow-hidden"
              >
                <Image
                  src={src}
                  alt={`Diamond detail ${idx + 1}`}
                  width={400}
                  height={400}
                  className="w-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-100">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xl sm:text-2xl md:text-4xl font-playfair text-brand-800 mb-4" style={{ letterSpacing: '-0.02em' }}>
              Experience the <span className="text-classic-green">Future</span> of Diamonds
            </h2>
            <p className="text-base md:text-lg text-brand-700 mb-8 font-montserrat">
              Discover our collection of lab-grown diamonds that combine cutting-edge science with timeless beauty.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-gotham uppercase tracking-[0.25em] text-sm rounded-lg transition-all duration-500 hover:scale-105 group bg-classic-green hover:bg-classic-green/90"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="https://thesolitario.com/assets/imgs/diamonds/solitario-catalogue.pdf"
                target="_blank"
                className="inline-flex items-center gap-2 px-6 py-3 text-classic-green font-gotham uppercase tracking-[0.25em] text-sm rounded-lg transition-all duration-500 hover:scale-105 group bg-white border border-brand-200 hover:border-classic-green/40"
              >
                <Download className="w-4 h-4" />
                <span>Download Catalogue</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
