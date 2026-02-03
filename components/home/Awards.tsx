'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { AWARDS } from '@/lib/constants';
import { Section, Container } from '@/components/ui';

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
          <h2 className="text-xl sm:text-2xl md:text-3xl font-montserrat font-bold text-classic-green mb-2">
            Awards & Recognition
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto hidden sm:block">
            Celebrating excellence and innovation in the jewellery industry
          </p>
        </motion.div>

        {/* Horizontal Awards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {AWARDS && AWARDS.length > 0 ? (
            AWARDS.map((award, index) => (
              <motion.div
                key={`${award.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden border border-brand-200 shadow-sm hover:shadow-lg hover:border-bronze-gold/30 transition-all duration-300 group"
              >
                {/* Award Image */}
                <div className="relative aspect-square bg-white p-3">
                  <Image
                    src={award.image}
                    alt={award.title}
                    fill
                    className="object-contain group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
                {/* Award Info */}
                <div className="p-4 text-center">
                  <h3 className="font-montserrat font-bold text-sm md:text-base text-classic-green mb-1">
                    {award.title}
                  </h3>
                  <p className="text-xs text-gray-600">{award.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{award.year}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No awards to display</p>
          )}
        </div>
      </Container>
    </Section>
  );
}
