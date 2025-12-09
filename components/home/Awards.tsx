'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { AWARDS } from '@/lib/constants';
import { Section, Container } from '@/components/ui';

export default function Awards() {
  return (
    <Section variant="light" padding="sm" className="bg-ivory-pearl">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6 sm:mb-8 md:mb-12"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-playfair mb-2 sm:mb-4 text-classic-green">International Awards</h2>
          <p className="text-xs sm:text-sm md:text-lg text-gray-600 max-w-md sm:max-w-3xl mx-auto hidden sm:block">
            Our creations recognized by prestigious stages in fine jewelry
          </p>
        </motion.div>

        <div className="max-w-3xl sm:max-w-4xl mx-auto">
          <div className="space-y-0">
            {AWARDS.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`flex gap-3 sm:gap-4 md:gap-6 items-start group ${
                  index < AWARDS.length - 1 ? 'border-b border-bronze-gold/20 pb-3 sm:pb-4 md:pb-6 mb-3 sm:mb-4 md:mb-6' : ''
                } ${index === 0 ? 'bg-ivory-pearl/50 rounded-lg p-3 sm:p-4 md:p-6 -mx-3 sm:-mx-4 md:-mx-6' : ''}`}
              >
                {/* Year Badge - Compact */}
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-classic-green rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm md:text-lg">
                  {award.year}
                </div>

                {/* Award Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base md:text-xl font-playfair text-classic-green mb-1 sm:mb-2">
                    {award.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {award.description}
                  </p>
                </div>

                {/* Arrow Icon - Smaller */}
                <div className="flex-shrink-0">
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-classic-green group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
