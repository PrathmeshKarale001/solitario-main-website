'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/data';
import { Section, Container } from '@/components/ui';
import Image from 'next/image';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const currentTestimonial = TESTIMONIALS[currentIndex];

  return (
    <Section variant="dark" padding="md" className="bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Decorative Background Elements - Smaller on mobile */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-5 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 border border-bronze-gold/20 rounded-full" />
        <div className="absolute bottom-20 right-10 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 border border-bronze-gold/20 rounded-full" />
      </div>

      <Container className="relative z-10">
        {/* Header - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-bronze-gold fill-bronze-gold" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] font-gotham text-bronze-gold">Testimonials</span>
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-bronze-gold fill-bronze-gold" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-aguila mb-2 sm:mb-4 md:mb-6 text-white">Trusted by Leaders</h2>
          <p className="text-xs sm:text-sm md:text-lg text-white/70 max-w-md sm:max-w-2xl mx-auto font-montserrat leading-relaxed hidden sm:block">
            Discover what leading publications say about Solitario
          </p>
        </motion.div>

        <div className="max-w-5xl sm:max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Testimonial Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/* Quote Icon - Compact */}
              <div className="absolute -top-2 -left-2 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-bronze-gold/20">
                <Quote className="w-full h-full" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  {/* Quote Text - Compact */}
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-4 sm:mb-6 md:mb-8 leading-relaxed font-didot italic relative z-10">
                    "{currentTestimonial.text}"
                  </p>

                  {/* Author Info - Compact */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full overflow-hidden border border-bronze-gold/30">
                      <Image
                        src={currentTestimonial.image || '/images/placeholder.svg'}
                        alt={currentTestimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-gotham text-sm sm:text-base md:text-lg font-semibold">
                        {currentTestimonial.name}
                      </h4>
                      <p className="text-white/60 text-xs sm:text-sm font-montserrat">
                        {currentTestimonial.title}
                      </p>
                    </div>
                  </div>

                  {/* Company Logo & Rating - Compact */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {currentTestimonial.companyLogo && (
                        <div className="relative w-16 h-8 sm:w-20 sm:h-10 md:w-24 md:h-12 bg-white/10 rounded-lg p-1 sm:p-2 backdrop-blur-sm border border-white/10">
                          <div className="text-white/80 font-bold text-xs sm:text-sm font-gotham uppercase tracking-wider">
                            {currentTestimonial.company}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-0.5 sm:gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${
                            i < Math.floor(currentTestimonial.rating)
                              ? 'fill-bronze-gold text-bronze-gold'
                              : i < currentTestimonial.rating
                              ? 'fill-bronze-gold/50 text-bronze-gold/50'
                              : 'text-bronze-gold/30'
                          }`}
                        />
                      ))}
                      <span className="ml-1 sm:ml-2 text-white/60 text-[10px] sm:text-xs font-montserrat">
                        {currentTestimonial.rating}
                      </span>
                    </div>
                  </div>

                  {/* Counter - Compact */}
                  <div className="flex items-center gap-1 sm:gap-2 mt-4 sm:mt-6 md:mt-8 pt-3 sm:pt-4 md:pt-6 border-t border-bronze-gold/20">
                    <div className="flex gap-1 sm:gap-1.5">
                      {TESTIMONIALS.map((_, index) => (
                        <div
                          key={index}
                          className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                            index === currentIndex
                              ? 'w-4 sm:w-6 md:w-8 bg-bronze-gold'
                              : 'w-1 sm:w-1.5 bg-bronze-gold/30'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-white/60 text-[9px] sm:text-xs font-gotham uppercase tracking-wider ml-auto">
                      {currentIndex + 1} / {TESTIMONIALS.length}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation - Compact */}
              <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6 md:mt-8">
                <button
                  onClick={prevTestimonial}
                  className="p-2 sm:p-3 rounded-full bg-white/5 hover:bg-bronze-gold/20 text-white border border-white/10 hover:border-bronze-gold/40 transition-all duration-300 hover:scale-110 backdrop-blur-sm touch-manipulation"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="p-3 rounded-full bg-white/5 hover:bg-bronze-gold/20 text-white border border-white/10 hover:border-bronze-gold/40 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            {/* Customer Image with Company Badge */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="relative aspect-square rounded-3xl overflow-hidden group"
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-bronze-gold/30 via-transparent to-soft-bronze/20 z-10" />
                  
                  {/* Image */}
                  <Image
                    src={currentTestimonial.image || '/images/placeholder.svg'}
                    alt={currentTestimonial.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Company Badge */}
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-luxury-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-bronze-gold/20 to-soft-bronze/20 rounded-lg flex items-center justify-center border border-bronze-gold/30">
                          <Star className="w-6 h-6 text-bronze-gold fill-bronze-gold" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-gotham mb-1">
                            Featured In
                          </p>
                          <p className="text-lg font-bold text-gray-900 font-gotham">
                            {currentTestimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-6 right-6 w-20 h-20 border-2 border-bronze-gold/20 rounded-full z-10" />
                  <div className="absolute bottom-20 right-10 w-3 h-3 bg-bronze-gold rounded-full shadow-glow animate-pulse z-10" />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Company Logos Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 pt-12 border-t border-bronze-gold/20"
          >
            <p className="text-center text-white/50 text-sm uppercase tracking-[0.2em] font-gotham mb-8">
              Trusted by Leading Publications
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
              {['Forbes', 'Vogue', 'The New York Times', 'Harper\'s Bazaar', 'Bloomberg'].map((company, index) => (
                <motion.div
                  key={company}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="px-6 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-bronze-gold/30 hover:bg-white/10 transition-all duration-300"
                >
                  <p className="text-white/60 hover:text-bronze-gold font-gotham font-semibold text-sm uppercase tracking-wider transition-colors">
                    {company}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
