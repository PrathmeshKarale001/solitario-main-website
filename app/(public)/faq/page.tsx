'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Diamond, Truck, CreditCard, RotateCcw, Shield, HelpCircle } from 'lucide-react';
import { Section, Container } from '@/components/ui';


// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: any;
  faqs: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    id: 'diamonds',
    title: 'Lab Grown Diamonds',
    icon: Diamond,
    faqs: [
      {
        question: 'What are lab grown diamonds?',
        answer: 'Lab grown diamonds are real diamonds created in controlled laboratory environments using advanced technology that replicates the natural diamond growing process. They have the same physical, chemical, and optical properties as mined diamonds.'
      },
      {
        question: 'Are lab grown diamonds real diamonds?',
        answer: 'Yes! Lab grown diamonds are 100% real diamonds. They are chemically, physically, and optically identical to mined diamonds. The only difference is their origin - one is created in a lab, the other is mined from the earth.'
      },
      {
        question: 'How can I tell if a diamond is lab grown?',
        answer: 'Lab grown diamonds are virtually indistinguishable from mined diamonds to the naked eye. Only specialized equipment can detect the subtle differences. All our diamonds come with certification that clearly states their origin.'
      },
      {
        question: 'Are lab grown diamonds certified?',
        answer: 'Yes, all our lab grown diamonds are certified by reputable gemological laboratories like IGI (International Gemological Institute). Each diamond comes with a detailed grading report.'
      },
    ]
  },
  {
    id: 'shipping',
    title: 'Shipping & Delivery',
    icon: Truck,
    faqs: [
      {
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 5-7 business days within India. Express shipping (2-3 business days) is available for an additional fee. International shipping takes 7-14 business days depending on the destination.'
      },
      {
        question: 'Do you offer free shipping?',
        answer: 'Yes! We offer free standard shipping on all orders above ₹50,000 within India. Orders below this amount have a flat shipping fee of ₹500.'
      },
      {
        question: 'Can I track my order?',
        answer: 'Absolutely! Once your order is shipped, you will receive a tracking number via email and SMS. You can track your order status in real-time through our website or the courier partner\'s website.'
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to select international destinations. International shipping charges and delivery times vary by location. Please contact us for specific details about your country.'
      },
    ]
  },
  {
    id: 'payment',
    title: 'Payment & Pricing',
    icon: CreditCard,
    faqs: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit/debit cards (Visa, Mastercard, Amex, RuPay), UPI, Net Banking, and popular wallets like Paytm and PhonePe. We also offer EMI options on select cards.'
      },
      {
        question: 'Is it safe to pay online?',
        answer: 'Yes, absolutely! We use industry-standard SSL encryption and partner with trusted payment gateways to ensure your payment information is always secure.'
      },
      {
        question: 'Do you offer EMI options?',
        answer: 'Yes, we offer No-Cost EMI on orders above ₹25,000 for select credit cards. EMI tenure options range from 3 to 12 months depending on your card issuer.'
      },
      {
        question: 'Why are lab grown diamonds more affordable?',
        answer: 'Lab grown diamonds cost 30-40% less than mined diamonds because the production process is more efficient and doesn\'t involve expensive mining operations. This doesn\'t affect quality - you get the same brilliance at a better price.'
      },
    ]
  },
  {
    id: 'returns',
    title: 'Returns & Exchanges',
    icon: RotateCcw,
    faqs: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy on all unworn items in original condition with tags attached. Custom or personalized items cannot be returned unless defective.'
      },
      {
        question: 'How do I initiate a return?',
        answer: 'To initiate a return, log into your account, go to Order History, select the item you wish to return, and follow the prompts. You can also contact our customer service team for assistance.'
      },
      {
        question: 'How long does it take to process a refund?',
        answer: 'Once we receive your return, refunds are processed within 5-7 business days. The amount will be credited to your original payment method. Bank processing times may vary.'
      },
      {
        question: 'Can I exchange my purchase?',
        answer: 'Yes! We offer free exchanges within 30 days of purchase. If the new item costs more, you\'ll pay the difference. If it costs less, we\'ll refund the difference.'
      },
    ]
  },
  {
    id: 'warranty',
    title: 'Warranty & Care',
    icon: Shield,
    faqs: [
      {
        question: 'What warranty do you offer?',
        answer: 'All Solitario jewellery comes with a lifetime warranty against manufacturing defects. This covers issues like loose stones, broken clasps, and structural defects under normal wear.'
      },
      {
        question: 'How should I care for my diamond jewellery?',
        answer: 'Clean your jewellery regularly with mild soap and warm water using a soft brush. Avoid harsh chemicals, chlorine, and extreme temperatures. Store pieces separately to prevent scratching.'
      },
      {
        question: 'Do you offer cleaning services?',
        answer: 'Yes! We offer complimentary cleaning and inspection services at all our stores. We recommend having your jewellery professionally cleaned every 6-12 months.'
      },
      {
        question: 'What if my jewellery needs repair?',
        answer: 'Contact our customer service team or visit any Solitario store for repairs. Manufacturing defects are covered under warranty. Other repairs may have associated costs depending on the work required.'
      },
    ]
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('diamonds');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (question: string) => {
    setOpenItems(prev => 
      prev.includes(question) 
        ? prev.filter(q => q !== question)
        : [...prev, question]
    );
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  const currentCategory = searchQuery 
    ? filteredCategories 
    : faqCategories.filter(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-20">
      {/* Hero */}
      <section className="bg-classic-green py-16 md:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-playfair text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-white/80 font-montserrat text-sm md:text-lg mb-6 md:mb-8 px-4">
              Find answers to common questions about our products, shipping, and services
            </p>
            
            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-bronze-gold font-montserrat"
              />
            </div>
          </motion.div>
        </Container>
      </section>

      <Section variant="light" padding="lg">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Category Tabs */}
            {!searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap justify-center gap-3 mb-12"
              >
                {faqCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-montserrat text-sm transition-all ${
                        activeCategory === category.id
                          ? 'bg-classic-green text-white shadow-brand'
                          : 'bg-white text-brand-600 border border-brand-200 hover:border-classic-green'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {category.title}
                    </button>
                  );
                })}
              </motion.div>
            )}

            {/* FAQ Items */}
            {currentCategory.map((category) => (
              <div key={category.id} className="mb-8">
                {searchQuery && (
                  <h2 className="font-playfair text-xl text-brand-800 mb-4 flex items-center gap-2">
                    <category.icon className="w-5 h-5 text-classic-green" />
                    {category.title}
                  </h2>
                )}
                <div className="space-y-3">
                  {category.faqs.map((faq, index) => (
                    <motion.div
                      key={faq.question}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl border border-brand-100 overflow-hidden shadow-sm"
                    >
                      <button
                        onClick={() => toggleItem(faq.question)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-brand-50 transition-colors"
                      >
                        <span className="font-montserrat text-brand-800 font-medium pr-4">
                          {faq.question}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-brand-400 flex-shrink-0 transition-transform ${
                          openItems.includes(faq.question) ? 'rotate-180' : ''
                        }`} />
                      </button>
                      <AnimatePresence>
                        {openItems.includes(faq.question) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-5 pb-5 text-brand-600 font-montserrat leading-relaxed border-t border-brand-100 pt-4">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}

            {/* No Results */}
            {searchQuery && filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-brand-300 mx-auto mb-4" />
                <h3 className="text-xl font-playfair text-brand-800 mb-2">No results found</h3>
                <p className="text-brand-500 font-montserrat">
                  Try different keywords or browse our categories above
                </p>
              </div>
            )}

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 bg-gradient-to-br from-bronze-gold/10 to-bronze-gold/5 rounded-2xl p-8 text-center border border-bronze-gold/20"
            >
              <h3 className="text-xl font-playfair text-brand-800 mb-2">Still have questions?</h3>
              <p className="text-brand-600 font-montserrat mb-4">
                Our customer support team is here to help
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-classic-green text-white rounded-xl hover:bg-classic-green/90 transition-colors font-montserrat"
              >
                Contact Us
              </a>
            </motion.div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
