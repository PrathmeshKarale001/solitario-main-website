'use client';

import { motion } from 'framer-motion';
import { 
  Gem, 
  RefreshCw, 
  BadgeCheck, 
  Sparkles, 
  WandSparkles,
  HeartHandshake
} from 'lucide-react';
import { PROMISES } from '@/lib/constants';
import { Section, Container } from '@/components/ui';

const iconMap = {
  gem: Gem,
  'refresh-cw': RefreshCw,
  'badge-check': BadgeCheck,
  sparkles: Sparkles,
  'wand-sparkles': WandSparkles,
  'heart-handshake': HeartHandshake,
};

export default function Promise() {
  // Create exactly 2 sets for seamless infinite loop
  const allPromises = [...PROMISES, ...PROMISES];

  return (
    <Section variant="light" padding="sm" className="bg-[#FAF5EF] relative overflow-hidden py-6 sm:py-10 md:py-14">
      {/* Decorative Elements - Smaller on mobile */}
      <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-bronze-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-classic-green/5 rounded-full blur-3xl" />
      
      <Container className="relative z-10 px-3 sm:px-4">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-4 sm:mb-6 md:mb-8"
        >
          <h3 className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-gray-500 font-gotham mb-1 sm:mb-2">
            THE PROMISE
          </h3>
          <h2 className="text-lg sm:text-xl md:text-3xl text-classic-green font-playfair px-2">
            The Fine Print of Trust
          </h2>
        </motion.div>

        {/* Compact Carousel */}
        <div className="relative">
          <div 
            className="overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
            }}
          >
            <div className="flex gap-3 sm:gap-4 md:gap-6 animate-scroll">
              {allPromises.map((promise, index) => {
                const Icon = iconMap[promise.icon as keyof typeof iconMap];
                const uniqueKey = `promise-${promise.id}-${index}`;

                return (
                  <div
                    key={uniqueKey}
                    className="flex-shrink-0 w-[140px] sm:w-[180px] md:w-[220px]"
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* Compact Icon */}
                      <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border border-bronze-gold/30 flex items-center justify-center bg-white/50 mb-2 sm:mb-3 shadow-sm">
                        <Icon className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 text-bronze-gold" strokeWidth={1.5} />
                      </div>

                      <h3 className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-0.5 sm:mb-1 font-gotham tracking-wider uppercase">
                        {promise.title}
                      </h3>
                      
                      <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 leading-tight font-montserrat line-clamp-2">
                        {promise.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
