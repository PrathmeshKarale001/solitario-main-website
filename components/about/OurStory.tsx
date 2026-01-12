'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Diamond, Sparkles, Heart, Leaf, Award, Users } from 'lucide-react';

export default function OurStory() {
  const storyPoints = [
    {
      icon: Heart,
      title: "Born from Passion",
      description: "Founded with a vision to make luxury accessible while staying true to ethical values"
    },
    {
      icon: Leaf,
      title: "Sustainable Future",
      description: "Lab-grown diamonds that don't compromise the Earth for beauty"
    },
    {
      icon: Award,
      title: "Unmatched Quality",
      description: "Every piece crafted with precision and attention to detail"
    },
    {
      icon: Users,
      title: "For Everyone",
      description: "Luxury that's inclusive, accessible, and meaningful"
    }
  ];

  return (
    <section id="our-story" className="py-24 px-4 bg-gradient-to-b from-white via-brand-50/30 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-classic-green/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-bronze-gold/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-classic-green text-xs md:text-sm uppercase tracking-[0.3em] font-gotham mb-4">
            The Solitario Story
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-playfair text-brand-800 mb-6" style={{ letterSpacing: '-0.02em' }}>
            Crafting Tomorrow's <span className="text-classic-green">Heirlooms</span>
          </h2>
          <p className="text-lg md:text-xl text-brand-600 max-w-3xl mx-auto font-montserrat leading-relaxed">
            Where conscious luxury meets timeless elegance, creating pieces that tell your story while protecting our planet
          </p>
        </motion.div>

        {/* Main Story Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6 text-brand-700 text-lg leading-relaxed font-montserrat">
              <p className="text-xl font-medium text-brand-800">
                When modern, consciously-minded customers asked for timeless sustainable luxury, we listened.
              </p>
              <p>
                Solitario was born from the belief that luxury shouldn't come at the Earth's expense. We saw an opportunity to revolutionize the diamond industry by creating pieces that are as ethical as they are beautiful.
              </p>
              <p>
                At our core, we're creating heirlooms for modern and future generations. Each piece tells a story of bespoke design, unparalleled craftsmanship, and unwavering commitment to sustainability.
              </p>
              <p className="text-classic-green font-medium">
                Our style is timeless, created for all occasions, and doesn't cost the Earth. Literally.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-brand-200">
              <div className="text-center">
                <div className="text-3xl font-playfair text-classic-green mb-2">100%</div>
                <div className="text-sm text-brand-600 font-montserrat">Lab-Grown</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-playfair text-classic-green mb-2">∞</div>
                <div className="text-sm text-brand-600 font-montserrat">Lifetime Value</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-playfair text-classic-green mb-2">0</div>
                <div className="text-sm text-brand-600 font-montserrat">Earth Impact</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/about/story-side.jpg"
                alt="Solitario craftsmanship"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              
              {/* Floating Badge */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-classic-green" />
                  <span className="text-sm font-gotham text-brand-800 uppercase tracking-wider">Sustainable</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Story Points Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {storyPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-2xl bg-white border border-brand-200 p-6 hover:border-classic-green/40 hover:shadow-xl transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-classic-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-classic-green/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-classic-green/20 transition-colors duration-300">
                  <point.icon className="w-6 h-6 text-classic-green" />
                </div>
                <h4 className="text-lg font-playfair text-brand-800 mb-3 group-hover:text-classic-green transition-colors duration-300">
                  {point.title}
                </h4>
                <p className="text-brand-600 text-sm font-montserrat leading-relaxed">
                  {point.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
