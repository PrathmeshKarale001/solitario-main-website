'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '@/lib/constants';
import { Section, Container } from '@/components/ui';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section variant="light" padding="sm" className="bg-ivory-pearl py-8 sm:py-10 md:py-12">
      <Container>
        {/* Header - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-playfair text-classic-green mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
            Have another question? Please contact our team!
          </p>
        </motion.div>

        {/* Horizontal FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FAQS.slice(0, 6).map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-xl border border-brand-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-4 py-3 flex items-center justify-between text-left gap-3"
              >
                <span className="font-montserrat text-sm font-medium text-brand-800 line-clamp-2">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-4 h-4 text-bronze-gold flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0">
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
