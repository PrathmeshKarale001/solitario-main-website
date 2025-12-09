'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "Are Solitario diamonds real diamonds?",
    answer: "Yes, absolutely. Lab-grown diamonds are chemically, physically, and optically identical to mined diamonds. The only difference is their origin."
  },
  {
    question: "Do you provide certification?",
    answer: "Every Solitario diamond comes with certification from leading independent gemological laboratories like IGI or GIA, guaranteeing its quality and authenticity."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy on all our jewellery. If you're not completely satisfied, you can return your piece for a full refund or exchange."
  },
  {
    question: "Do you offer customization?",
    answer: "Yes, our bespoke service allows you to create a unique piece. From choosing the diamond to designing the setting, our experts guide you through every step."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-bronze-gold font-gotham text-xs uppercase tracking-[0.3em] mb-4 block">
            Common Questions
          </span>
          <h2 className="text-3xl md:text-4xl font-playfair text-gray-900">
            Everything You Need to Know
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-gray-100 last:border-0"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between py-6 text-left group"
              >
                <span className={`text-lg md:text-xl font-playfair transition-colors duration-300 ${openIndex === index ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900'}`}>
                  {faq.question}
                </span>
                <span className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${openIndex === index ? 'bg-black border-black text-white' : 'border-gray-200 text-gray-400 group-hover:border-black group-hover:text-black'}`}>
                  {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-8 text-gray-500 font-montserrat leading-relaxed pr-12">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
