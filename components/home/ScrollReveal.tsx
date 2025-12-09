'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Diamond, Gem, Award } from 'lucide-react';

// Craftsmanship highlights for mobile
const craftHighlights = [
  {
    icon: Diamond,
    title: 'Lab-Grown Excellence',
    description: 'Sustainable diamonds with identical brilliance',
  },
  {
    icon: Gem,
    title: 'Master Crafted',
    description: 'Each piece handcrafted by expert artisans',
  },
  {
    icon: Award,
    title: 'Certified Quality',
    description: 'IGI certified with lifetime guarantee',
  },
];

// Gallery images for desktop masonry
const galleryImages = [
  {
    src: require('@/public/images/general/images (1).jpg'),
    alt: 'Elegant diamond ring',
    span: 'tall',
  },
  {
    src: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&q=90',
    alt: 'Diamond earring',
    span: 'square',
  },
  {
    src: require('@/public/images/background/bg (5).jpg'),
    alt: 'Luxury necklace',
    span: 'wide',
  },
];

export default function ScrollReveal() {
  return (
    <section className="relative bg-gradient-to-b from-black via-gray-900 to-black py-12 sm:py-16 md:py-24 overflow-hidden">
      {/* Decorative Elements - Smaller on mobile */}
      <div className="absolute top-0 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-bronze-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-classic-green/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 sm:w-16 h-px bg-gradient-to-r from-transparent via-bronze-gold to-bronze-gold/50" />
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-bronze-gold" />
            <div className="w-8 sm:w-16 h-px bg-gradient-to-l from-transparent via-bronze-gold to-bronze-gold/50" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-didot text-ivory-pearl mb-3 sm:mb-4" style={{ letterSpacing: '-0.02em' }}>
            Our Craftsmanship
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-white/70 font-montserrat max-w-2xl mx-auto px-4">
            Discover the artistry behind every piece
          </p>
        </motion.div>

        {/* Mobile Layout - Vertical Cards */}
        <div className="md:hidden space-y-4">
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden"
          >
            <Image
              src={require('@/public/images/general/images (1).jpg')}
              alt="Solitario Craftsmanship"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-xl font-didot text-white mb-1">Timeless Elegance</h3>
              <p className="text-sm text-white/80 font-montserrat">Crafting jewelry that carries personal stories</p>
            </div>
          </motion.div>

          {/* Highlights Grid - 3 cards */}
          <div className="grid grid-cols-1 gap-3">
            {craftHighlights.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-bronze-gold/20 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-bronze-gold" />
                </div>
                <div>
                  <h4 className="text-base font-didot text-ivory-pearl mb-0.5">{item.title}</h4>
                  <p className="text-xs text-white/60 font-montserrat">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Secondary Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[16/9] rounded-2xl overflow-hidden"
          >
            <Image
              src={require('@/public/images/background/bg (5).jpg')}
              alt="Luxury Collection"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-classic-green/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="inline-block px-3 py-1 bg-bronze-gold/90 text-white text-xs font-gotham uppercase tracking-wider rounded-full mb-2">
                Artistry
              </span>
              <p className="text-sm text-white/90 font-montserrat">Each piece reflects soulful elegance</p>
            </div>
          </motion.div>
        </div>

        {/* Desktop Layout - Masonry Grid */}
        <div className="hidden md:grid grid-cols-4 gap-5 auto-rows-[250px]">
          {/* Tall Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="col-span-1 row-span-2 group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-luxury hover:shadow-glow transition-all duration-500"
          >
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-bronze-gold/50 transition-all duration-500 z-10" />
            <div className="absolute top-3 right-3 w-4 h-4 rotate-45 bg-bronze-gold/60 group-hover:bg-bronze-gold transition-all duration-500 z-10" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
            <Image
              src={require('@/public/images/general/images (1).jpg')}
              alt="Elegant diamond ring"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </motion.div>

          {/* Text Card - Gold */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="col-span-1 row-span-1 backdrop-blur-2xl bg-gradient-to-br from-bronze-gold/20 via-bronze-gold/10 to-soft-bronze/20 border-2 border-bronze-gold/30 rounded-2xl p-7 flex flex-col justify-center shadow-luxury hover:shadow-glow transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-bronze-gold to-transparent opacity-70" />
            <div className="absolute -top-8 -right-8 w-24 h-24 rotate-45 bg-bronze-gold/10 group-hover:bg-bronze-gold/20 transition-all duration-500" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
            <h3 className="text-2xl lg:text-3xl font-didot text-bronze-gold mb-4">Timeless Elegance</h3>
            <p className="text-base text-white/80 leading-relaxed font-montserrat">Crafting jewelry that carries personal stories.</p>
            <div className="absolute bottom-3 right-3 w-3 h-3 rotate-45 bg-bronze-gold/60" />
          </motion.div>

          {/* Square Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-1 row-span-1 group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-luxury hover:shadow-glow transition-all duration-500"
          >
            <div className="absolute top-3 right-3 w-4 h-4 rotate-45 bg-bronze-gold/60 group-hover:bg-bronze-gold transition-all duration-500 z-10" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
            <Image
              src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&q=90"
              alt="Diamond earring"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </motion.div>

          {/* Feature Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="col-span-1 row-span-1 backdrop-blur-2xl bg-gradient-to-br from-classic-green/30 via-teal/20 to-classic-green/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-luxury hover:shadow-glow transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute inset-0 rounded-2xl border-2 border-bronze-gold/40" />
            <div className="relative mb-4">
              <div className="w-16 h-16 rotate-45 bg-bronze-gold/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
                <span className="text-4xl -rotate-45 text-bronze-gold">♢</span>
              </div>
            </div>
            <h4 className="text-lg lg:text-xl font-didot text-ivory-pearl mb-2">Lab-Grown</h4>
            <p className="text-sm text-ivory-pearl/90 font-montserrat">Sustainable Luxury</p>
          </motion.div>

          {/* Wide Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="col-span-2 row-span-1 group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-luxury hover:shadow-glow transition-all duration-500"
          >
            <div className="absolute top-3 right-3 w-4 h-4 rotate-45 bg-bronze-gold/60 group-hover:bg-bronze-gold transition-all duration-500 z-10" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
            <Image
              src={require('@/public/images/background/bg (5).jpg')}
              alt="Luxury necklace"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-bronze-gold/40 via-bronze-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>

          {/* Text Card - Bronze */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="col-span-1 row-span-1 backdrop-blur-2xl bg-gradient-to-br from-classic-green/20 via-classic-green/10 to-teal/20 border-2 border-classic-green/30 rounded-2xl p-7 flex flex-col justify-center shadow-luxury hover:shadow-glow transition-all duration-500 group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-bronze-gold to-transparent opacity-70" />
            <div className="absolute -top-8 -right-8 w-24 h-24 rotate-45 bg-bronze-gold/10 group-hover:bg-bronze-gold/20 transition-all duration-500" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
            <h3 className="text-2xl lg:text-3xl font-didot text-bronze-gold mb-4">Artistry</h3>
            <p className="text-base text-white/80 leading-relaxed font-montserrat">Each piece reflects soulful elegance.</p>
            <div className="absolute bottom-3 right-3 w-3 h-3 rotate-45 bg-bronze-gold/60" />
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-8 sm:mt-12 md:mt-16"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 backdrop-blur-xl bg-gradient-to-r from-bronze-gold via-bronze-gold/90 to-soft-bronze text-white font-gotham text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.25em] rounded-full border-2 border-bronze-gold/50 shadow-glow hover:shadow-luxury-lg hover:scale-105 transition-all duration-500 group touch-manipulation"
          >
            Explore Collection
            <span className="text-lg sm:text-xl group-hover:rotate-45 transition-transform duration-500">♢</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

