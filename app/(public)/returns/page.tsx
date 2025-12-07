'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { RotateCcw, CheckCircle, XCircle, Clock, Package, CreditCard, HelpCircle } from 'lucide-react';
import { Section, Container } from '@/components/ui';

const returnSteps = [
  {
    step: 1,
    title: 'Initiate Return',
    description: 'Log into your account and select the item you wish to return from your order history'
  },
  {
    step: 2,
    title: 'Pack the Item',
    description: 'Place the item in its original packaging with all certificates and tags attached'
  },
  {
    step: 3,
    title: 'Schedule Pickup',
    description: 'Our courier partner will pick up the item from your address at no extra cost'
  },
  {
    step: 4,
    title: 'Receive Refund',
    description: 'Once inspected, your refund will be processed within 5-7 business days'
  },
];

const eligibleItems = [
  'Unworn items in original condition',
  'Items with all original tags attached',
  'Items in original packaging',
  'Items with original certificates',
  'Items returned within 30 days of delivery',
];

const nonEligibleItems = [
  'Custom or personalized items',
  'Items showing signs of wear',
  'Items without original packaging',
  'Items without certificates',
  'Items returned after 30 days',
  'Sale or clearance items (unless defective)',
];

export default function ReturnsPage() {
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
            <RotateCcw className="w-12 h-12 text-bronze-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-aguila text-white mb-4">
              Returns & Exchanges
            </h1>
            <p className="text-white/80 font-montserrat text-lg">
              30-day hassle-free returns on all eligible items
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Return Policy Highlights */}
      <Section variant="light" padding="lg">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-brand border border-brand-100 p-6 text-center"
            >
              <Clock className="w-10 h-10 text-classic-green mx-auto mb-3" />
              <h3 className="font-didot text-lg text-brand-800 mb-2">30 Days</h3>
              <p className="text-brand-500 font-montserrat text-sm">Return window from delivery</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-brand border border-brand-100 p-6 text-center"
            >
              <Package className="w-10 h-10 text-classic-green mx-auto mb-3" />
              <h3 className="font-didot text-lg text-brand-800 mb-2">Free Pickup</h3>
              <p className="text-brand-500 font-montserrat text-sm">We'll collect from your doorstep</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-brand border border-brand-100 p-6 text-center"
            >
              <CreditCard className="w-10 h-10 text-classic-green mx-auto mb-3" />
              <h3 className="font-didot text-lg text-brand-800 mb-2">Quick Refund</h3>
              <p className="text-brand-500 font-montserrat text-sm">5-7 business days processing</p>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Return Process */}
      <Section variant="light" padding="lg" className="bg-brand-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-aguila text-brand-800 mb-4">
              How to Return
            </h2>
            <p className="text-brand-600 font-montserrat">
              Simple 4-step return process
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {returnSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl shadow-brand border border-brand-100 p-6">
                  <div className="w-10 h-10 bg-classic-green rounded-full flex items-center justify-center text-white font-gotham font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-didot text-lg text-brand-800 mb-2">{step.title}</h3>
                  <p className="text-brand-500 font-montserrat text-sm">{step.description}</p>
                </div>
                {index < returnSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-brand-200" />
                )}
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Eligibility */}
      <Section variant="light" padding="lg">
        <Container>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Eligible */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-brand border border-classic-green/20 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-classic-green/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-classic-green" />
                </div>
                <h3 className="font-didot text-xl text-brand-800">Eligible for Return</h3>
              </div>
              <ul className="space-y-3">
                {eligibleItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-classic-green flex-shrink-0 mt-0.5" />
                    <span className="text-brand-600 font-montserrat text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Not Eligible */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-brand border border-error/20 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-error" />
                </div>
                <h3 className="font-didot text-xl text-brand-800">Not Eligible</h3>
              </div>
              <ul className="space-y-3">
                {nonEligibleItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                    <span className="text-brand-600 font-montserrat text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Exchange Policy */}
      <Section variant="light" padding="lg" className="bg-brand-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-brand border border-brand-100 p-8"
            >
              <h2 className="font-didot text-2xl text-brand-800 mb-6">Exchange Policy</h2>
              
              <div className="space-y-4 text-brand-600 font-montserrat text-sm leading-relaxed">
                <p>
                  We offer free exchanges within 30 days of delivery. If you'd like to exchange 
                  your item for a different size, style, or product:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>If the new item costs more, you'll pay the difference</li>
                  <li>If the new item costs less, we'll refund the difference</li>
                  <li>Exchange shipping is free within India</li>
                  <li>Custom items can only be exchanged for store credit</li>
                </ul>
                <p>
                  To initiate an exchange, please contact our customer service team or visit 
                  any Solitario store with your original purchase receipt.
                </p>
              </div>
            </motion.div>

            {/* Refund Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 bg-bronze-gold/5 rounded-2xl p-6 border border-bronze-gold/20"
            >
              <h3 className="font-didot text-lg text-brand-800 mb-4">Refund Information</h3>
              <div className="space-y-3 text-brand-600 font-montserrat text-sm">
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-classic-green flex-shrink-0 mt-0.5" />
                  Refunds are credited to the original payment method
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-classic-green flex-shrink-0 mt-0.5" />
                  Credit card refunds may take 5-10 business days to appear
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-classic-green flex-shrink-0 mt-0.5" />
                  UPI and wallet refunds are typically instant
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-classic-green flex-shrink-0 mt-0.5" />
                  Original shipping charges are non-refundable
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section variant="light" padding="lg">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-classic-green to-teal rounded-3xl p-8 md:p-12 text-center"
          >
            <HelpCircle className="w-12 h-12 text-bronze-gold mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-aguila text-white mb-4">
              Need Help with a Return?
            </h2>
            <p className="text-white/80 font-montserrat mb-8 max-w-xl mx-auto">
              Our customer service team is available to assist you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-classic-green rounded-xl hover:bg-ivory-pearl transition-colors font-gotham uppercase tracking-wider text-sm"
              >
                Contact Support
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/10 text-white border border-white/30 rounded-xl hover:bg-white/20 transition-colors font-gotham uppercase tracking-wider text-sm"
              >
                View FAQ
              </Link>
            </div>
          </motion.div>
        </Container>
      </Section>
    </div>
  );
}
