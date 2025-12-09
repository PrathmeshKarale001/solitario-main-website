'use client';

import { motion } from 'framer-motion';
import { MapPin, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const FEATURED_STORES = [
  {
    id: 'spain',
    name: 'Solitario Spain',
    location: 'Spain',
    country: 'Europe',
    image: '/solitario/stores/spain.jpg',
  },
  {
    id: 'malaysia',
    name: 'Solitario Malaysia',
    location: 'Malaysia',
    country: 'Asia Pacific',
    image: '/solitario/stores/malaysia.jpg',
  },
  {
    id: 'dubai',
    name: 'Solitario Dubai',
    location: 'Dubai, UAE',
    country: 'Middle East',
    image: '/solitario/stores/dubai.jpg',
  },
];

export default function Stores() {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-3 sm:px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <span className="inline-block text-classic-green text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] font-gotham mb-2 sm:mb-4">
            Global Presence
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-didot text-brand-800 mb-2 sm:mb-4">
            Visit Our <span className="text-classic-green">Stores</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-brand-600 max-w-xl mx-auto font-montserrat hidden sm:block">
            Experience the brilliance of lab-grown diamonds in person at our stores worldwide.
          </p>
        </motion.div>

        {/* Store Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {FEATURED_STORES.map((store, idx) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={store.image}
                  alt={store.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                {/* Country Badge */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                  <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-bronze-gold/90 text-white text-[10px] sm:text-xs font-gotham uppercase tracking-wider rounded-full">
                    <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {store.country}
                  </span>
                </div>
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-didot text-white mb-1 sm:mb-2">{store.name}</h3>
                <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm font-montserrat">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-bronze-gold" />
                  {store.location}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-8 sm:mt-10 md:mt-12"
        >
          <Link
            href="/stores"
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-white font-gotham uppercase tracking-[0.2em] text-[10px] sm:text-xs md:text-sm rounded-lg bg-classic-green hover:bg-classic-green/90 transition-all duration-500 hover:scale-105 touch-manipulation"
          >
            View All Stores <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
