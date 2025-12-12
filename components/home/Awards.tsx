'use client';

import { motion } from 'framer-motion';
import { Award, Trophy, Medal, Star } from 'lucide-react';
import { AWARDS } from '@/lib/constants';
import { Section, Container } from '@/components/ui';

// Award icons for visual representation
const awardIcons = [Trophy, Award, Medal, Star];

export default function Awards() {
  return (
    <Section variant="light" padding="sm" className="bg-ivory-pearl py-8 sm:py-10 md:py-12">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-playfair text-classic-green mb-2">
            International Awards
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto hidden sm:block">
            Our creations recognized by prestigious stages in fine jewelry
          </p>
        </motion.div>

        {/* Horizontal Awards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {AWARDS.map((award, index) => {
            const IconComponent = awardIcons[index % awardIcons.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 md:p-5 border border-brand-200 shadow-sm hover:shadow-lg hover:border-bronze-gold/30 transition-all duration-300 group text-center"
              >
                {/* Award Icon */}
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-bronze-gold/20 to-bronze-gold/5 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-7 h-7 md:w-8 md:h-8 text-bronze-gold" />
                </div>
                
                {/* Year Badge */}
                <span className="inline-block px-3 py-1 bg-classic-green text-white text-xs font-gotham rounded-full mb-2">
                  {award.year}
                </span>
                
                {/* Award Title */}
                <h3 className="text-sm md:text-base font-playfair text-brand-800 mb-1 line-clamp-2">
                  {award.title}
                </h3>
                
                {/* Description - Hidden on mobile */}
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 hidden md:block">
                  {award.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
