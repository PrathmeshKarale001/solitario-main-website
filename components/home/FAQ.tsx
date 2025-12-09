'use client';

import { motion } from 'framer-motion';
import { FAQS } from '@/lib/constants';
import { Section, Container, Accordion } from '@/components/ui';
import type { AccordionItem } from '@/components/ui/Accordion';

export default function FAQ() {
  const accordionItems: AccordionItem[] = FAQS.map((faq, index) => ({
    id: `faq-${index}`,
    title: faq.question,
    content: <p className="text-gray-600 leading-relaxed">{faq.answer}</p>,
  }));

  return (
    <Section variant="light" padding="sm" className="bg-ivory-pearl">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-start">
          {/* Left Side - Heading - Compact */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-playfair mb-2 sm:mb-4 text-classic-green">FAQ</h2>
            <p className="text-xs sm:text-sm md:text-lg text-gray-600 hidden sm:block">
              Have another question? Please contact our team!
            </p>
          </motion.div>

          {/* Right Side - Accordion - Compact */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Accordion items={accordionItems} defaultOpen={['faq-0']} />
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
