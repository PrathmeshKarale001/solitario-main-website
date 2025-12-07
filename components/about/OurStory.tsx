'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Diamond, Sparkles } from 'lucide-react';

export default function OurStory() {
  return (
    <section id="our-story" className="py-24 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-bronze-gold text-xs md:text-sm uppercase tracking-[0.3em] font-gotham mb-4">
              The Solitario Story
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-didot text-white mb-6">
              Our <span className="text-bronze-gold">Story</span>
            </h2>
            <div className="space-y-4 text-white/80 text-base md:text-lg leading-relaxed font-montserrat">
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
                className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4"
              >
                <Diamond className="w-8 h-8 text-bronze-gold mb-3" />
                <h4 className="text-lg font-didot text-white mb-1">Bespoke Designs</h4>
                <p className="text-white/60 text-sm font-montserrat">Crafted for your unique story</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4"
              >
                <Sparkles className="w-8 h-8 text-bronze-gold mb-3" />
                <h4 className="text-lg font-didot text-white mb-1">Timeless Style</h4>
                <p className="text-white/60 text-sm font-montserrat">Created for all occasions</p>
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
