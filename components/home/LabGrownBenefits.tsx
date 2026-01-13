'use client';

import { motion } from 'framer-motion';
import { Sparkles, Leaf, Brain } from 'lucide-react';
import { LAB_GROWN_BENEFITS } from '@/lib/constants';
import { Section, Container, Card } from '@/components/ui';

const iconMap = {
  sparkles: Sparkles,
  leaf: Leaf,
  brain: Brain,
};

export default function LabGrownBenefits() {
  return (
    <Section variant="light" padding="sm">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6 sm:mb-8 md:mb-12"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-playfair mb-2 sm:mb-4 text-classic-green">Luxury, Reimagined</h2>
          <p className="text-xs sm:text-sm md:text-lg text-gray-700 max-w-md sm:max-w-2xl mx-auto hidden sm:block">
            All the beauty, minus the baggage. Lab-grown diamonds are the elegant evolution of fine jewellery.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {LAB_GROWN_BENEFITS.map((benefit, index) => {
            const Icon = iconMap[benefit.icon as keyof typeof iconMap];
            
            return (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card variant="elevated" className="p-4 sm:p-6 md:p-8 text-center h-full hover:shadow-xl transition-shadow duration-300">
                  <div className="mb-3 sm:mb-4 md:mb-6 flex justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-bronze-gold to-soft-bronze rounded-full flex items-center justify-center">
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-playfair mb-2 sm:mb-4 text-classic-green">{benefit.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}


