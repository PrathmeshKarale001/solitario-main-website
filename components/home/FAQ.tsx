'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, ArrowRight } from 'lucide-react';
import { FAQS } from '@/lib/constants';
import Link from 'next/link';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-ivory-pearl relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-bronze-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-classic-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Left Column - Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 lg:sticky lg:top-32"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-bronze-gold/10 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-bronze-gold" />
              </div>
              <span className="text-xs uppercase tracking-[0.2em] font-gotham text-bronze-gold">
                Got Questions?
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair text-classic-green mb-4 leading-tight">
              Frequently Asked<br className="hidden sm:block" /> Questions
            </h2>
            
            <p className="text-sm md:text-base text-gray-600 mb-6 max-w-sm">
              Everything you need to know about lab-grown diamonds and our jewellery. Can't find what you're looking for?
            </p>
            
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-sm font-gotham uppercase tracking-wider text-classic-green hover:text-bronze-gold transition-colors group"
            >
              <span>View All FAQs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <div className="mt-8 p-4 bg-classic-green/5 rounded-xl border border-classic-green/10 hidden md:block">
              <p className="text-sm text-gray-600 mb-2">Still have questions?</p>
              <Link
                href="/contact"
                className="text-sm font-medium text-classic-green hover:text-bronze-gold transition-colors"
              >
                Contact our team →
              </Link>
            </div>
          </motion.div>

          {/* Right Column - FAQ Accordion */}
          <div className="lg:col-span-3 space-y-3">
            {FAQS.slice(0, 6).map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <div
                  className={`bg-white rounded-2xl border transition-all duration-300 ${
                    openIndex === index 
                      ? 'border-bronze-gold/30 shadow-lg shadow-bronze-gold/5' 
                      : 'border-gray-100 hover:border-gray-200 shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-start justify-between text-left gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <span className={`text-xs font-gotham mt-0.5 transition-colors ${
                        openIndex === index ? 'text-bronze-gold' : 'text-gray-400'
                      }`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className={`font-montserrat text-sm sm:text-base font-medium transition-colors ${
                        openIndex === index ? 'text-classic-green' : 'text-gray-800'
                      }`}>
                        {faq.question}
                      </span>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      openIndex === index 
                        ? 'bg-bronze-gold text-white' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {openIndex === index ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                          <div className="pl-8 sm:pl-10 border-l-2 border-bronze-gold/20">
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
