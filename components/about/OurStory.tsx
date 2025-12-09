'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Diamond, Sparkles } from 'lucide-react';

export default function OurStory() {
  return (
    <section id="our-story" className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-classic-green text-xs md:text-sm uppercase tracking-[0.3em] font-gotham mb-4">
              The Solitario Story
            </span>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-playfair text-brand-800 mb-4" style={{ letterSpacing: '-0.02em' }}>
              Our <span className="text-classic-green">Story</span>
            </h2>
            <div className="space-y-4 text-brand-700 text-base md:text-lg leading-relaxed font-montserrat">
              <p>
                Solitario saw an opportunity when more modern and consciously-minded customers asked for timeless sustainable luxury. We created Solitario Diamonds with an aim to leave a positive footprint for the next generation.
              </p>
              <p>
                At its core, Solitario is creating heirlooms for modern and future generations with bespoke designs and unparalleled craftsmanship. Our jewellery is meant to be cherished and to last a lifetime.
              </p>
              <p>
                Our style is timeless, created for all occasions, and doesn't cost the Earth. Literally.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-xl bg-brand-50 border border-brand-200 p-4"
              >
                <Diamond className="w-8 h-8 text-classic-green mb-3" />
                <h4 className="text-lg font-playfair text-brand-800 mb-1">Bespoke Designs</h4>
                <p className="text-brand-600 text-sm font-montserrat">Crafted for your unique story</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-xl bg-brand-50 border border-brand-200 p-4"
              >
                <Sparkles className="w-8 h-8 text-classic-green mb-3" />
                <h4 className="text-lg font-playfair text-brand-800 mb-1">Timeless Style</h4>
                <p className="text-brand-600 text-sm font-montserrat">Created for all occasions</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-luxury-lg">
              <Image
                src="/about/story-side.jpg"
                alt="Solitario craftsmanship"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
