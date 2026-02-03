'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/data';
import { Section, Container } from '@/components/ui';

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
    <Section variant="light" padding="md" className="bg-classic-green relative overflow-hidden">
      {/* Decorative Background Elements - Smaller on mobile */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-5 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 border border-white/30 rounded-full" />
        <div className="absolute bottom-20 right-10 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 border border-white/30 rounded-full" />
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
          <h2 className="text-xl sm:text-2xl md:text-3xl font-montserrat font-bold mb-2 sm:mb-4 md:mb-6 text-classic-green">What Our Customers Say</h2>
          <p className="text-xs sm:text-sm md:text-lg text-gray-600 max-w-md sm:max-w-2xl mx-auto font-montserrat leading-relaxed hidden sm:block">
            Real reviews from our valued customers
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Testimonial Content - Centered, No Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative text-center"
          >
            {/* Quote Icon - Centered */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-bronze-gold/20 mx-auto mb-4">
              <Quote className="w-full h-full" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {/* Quote Text - Centered */}
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-black mb-6 sm:mb-8 leading-relaxed font-montserrat font-bold italic relative z-10">
                  "{currentTestimonial.text}"
                </p>

                {/* Rating Stars - Centered */}
                <div className="flex justify-center gap-1 sm:gap-1.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                        i < Math.floor(currentTestimonial.rating)
                          ? 'fill-bronze-gold text-bronze-gold'
                          : i < currentTestimonial.rating
                          ? 'fill-bronze-gold/50 text-bronze-gold/50'
                          : 'text-bronze-gold/30'
                      }`}
                    />
                  ))}
                </div>

                {/* Author Info - Centered */}
                <div className="mb-6">
                  <h4 className="text-black font-gotham text-base sm:text-lg md:text-xl font-semibold">
                    {currentTestimonial.name}
                  </h4>
                  <p className="text-black/70 text-xs sm:text-sm font-montserrat">
                    {currentTestimonial.title}
                  </p>
                </div>

                {/* Counter - Centered */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-bronze-gold/20">
                  <div className="flex gap-1.5 sm:gap-2">
                    {TESTIMONIALS.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? 'w-6 sm:w-8 bg-bronze-gold'
                            : 'w-1.5 sm:w-2 bg-bronze-gold/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-black/60 text-xs sm:text-sm font-gotham uppercase tracking-wider">
                    {currentIndex + 1} / {TESTIMONIALS.length}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation - Centered */}
            <div className="flex justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
              <button
                onClick={prevTestimonial}
                className="p-2.5 sm:p-3 rounded-full bg-bronze-gold/10 hover:bg-bronze-gold/20 text-bronze-gold border border-bronze-gold/20 hover:border-bronze-gold/40 transition-all duration-300 hover:scale-110 backdrop-blur-sm touch-manipulation"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2.5 sm:p-3 rounded-full bg-bronze-gold/10 hover:bg-bronze-gold/20 text-bronze-gold border border-bronze-gold/20 hover:border-bronze-gold/40 transition-all duration-300 hover:scale-110 backdrop-blur-sm touch-manipulation"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </motion.div>

          {/* Google Reviews Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 pt-6 border-t border-bronze-gold/20"
          >
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="px-6 py-3 bg-bronze-gold/10 backdrop-blur-sm rounded-lg border border-bronze-gold/20">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-bronze-gold text-bronze-gold" />
                    ))}
                  </div>
                  <span className="text-bronze-gold font-gotham text-sm">4.9 Rating on Google</span>
                </div>
              </div>
              <div className="px-6 py-3 bg-bronze-gold/10 backdrop-blur-sm rounded-lg border border-bronze-gold/20">
                <p className="text-bronze-gold/80 font-gotham text-sm">1200++ Happy Customers</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
