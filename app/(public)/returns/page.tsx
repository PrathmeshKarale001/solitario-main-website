'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { RotateCcw, CheckCircle, XCircle, Clock, Package, CreditCard, HelpCircle } from 'lucide-react';
import { Section, Container } from '@/components/ui';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

const returnSteps = [
  {
    step: 1,
    title: 'Contact Support',
    description: 'Email paymentdesk@thesolitario.com with order number and reason for return'
  },
  {
    step: 2,
    title: 'Get Approval',
    description: 'Wait for pre-approval before sending any items back to us'
  },
  {
    step: 3,
    title: 'Pack Securely',
    description: 'Include original product, invoice, certificates, ID proof, and warranty card'
  },
  {
    step: 4,
    title: 'Processing',
    description: 'Approved returns processed within 5-7 business days after inspection'
  },
];

const eligibleItems = [
  'Exchange requests within 7 days of delivery',
  'Items unused, unworn, and undamaged',
  'Original condition with original packaging',
  'Original invoice and certificates included',
  'No signs of wear, alteration, or tampering',
];

const nonEligibleItems = [
  'Customized, engraved, or made-to-order items',
  'Items showing signs of wear or damage',
  'Items without original packaging or certificates',
  'Items returned after 7 days',
  'Items sent without prior approval',
  'Making charges and taxes (non-recoverable)',
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white">
      {/* Hero */}
      <section className="bg-classic-green py-12 md:py-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <RotateCcw className="w-12 h-12 text-bronze-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-playfair text-white mb-4">
              Returns, Exchange & Buyback
            </h1>
            <p className="text-white/80 font-montserrat text-lg">
              7-day exchange policy with buyback options available
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Return Policy Highlights */}
      <Section variant="light" padding="sm">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-brand border border-brand-100 p-6 text-center"
            >
              <Clock className="w-10 h-10 text-classic-green mx-auto mb-3" />
              <h3 className="font-playfair text-lg text-brand-800 mb-2">7 Days</h3>
              <p className="text-brand-500 font-montserrat text-sm">Exchange window from delivery</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-brand border border-brand-100 p-6 text-center"
            >
              <Package className="w-10 h-10 text-classic-green mx-auto mb-3" />
              <h3 className="font-playfair text-lg text-brand-800 mb-2">Pre-Approval</h3>
              <p className="text-brand-500 font-montserrat text-sm">Contact support before returning</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-brand border border-brand-100 p-6 text-center"
            >
              <CreditCard className="w-10 h-10 text-classic-green mx-auto mb-3" />
              <h3 className="font-playfair text-lg text-brand-800 mb-2">Buyback Available</h3>
              <p className="text-brand-500 font-montserrat text-sm">Store credit or purchase adjustment</p>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Return Process */}
      <Section variant="light" padding="sm" className="bg-brand-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-playfair text-brand-800 mb-4">
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
                  <h3 className="font-playfair text-lg text-brand-800 mb-2">{step.title}</h3>
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
      <Section variant="light" padding="sm">
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
                <h3 className="font-playfair text-xl text-brand-800">Eligible for Return</h3>
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
                <h3 className="font-playfair text-xl text-brand-800">Not Eligible</h3>
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
      <Section variant="light" padding="sm" className="bg-brand-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-brand border border-brand-100 p-8"
            >
              <h2 className="font-playfair text-2xl text-brand-800 mb-6">Exchange Policy</h2>
              
              <div className="space-y-4 text-brand-600 font-montserrat text-sm leading-relaxed">
                <p>
                  We offer exchanges on eligible jewellery items within <strong>7 days of delivery</strong>:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Item must be unused, unworn, and undamaged</li>
                  <li>Returned in original condition with original packaging</li>
                  <li>Original invoice and certificates must be included</li>
                  <li>No signs of wear, alteration, damage, or tampering</li>
                  <li>Price differences will be adjusted accordingly</li>
                </ul>
                <p className="font-semibold text-brand-700">
                  Required Documentation:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Original product and packaging</li>
                  <li>Original or copy of invoice</li>
                  <li>Product certificates (if applicable)</li>
                  <li>Valid government ID proof</li>
                  <li>Warranty card</li>
                </ul>
              </div>
            </motion.div>

            {/* Buyback Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 bg-classic-green/5 rounded-2xl p-6 border border-classic-green/20"
            >
              <h3 className="font-playfair text-lg text-brand-800 mb-4">Buyback Policy</h3>
              <div className="space-y-3 text-brand-600 font-montserrat text-sm">
                <p>
                  We offer buyback services on jewellery purchased from Solitario:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-brand-700 mb-2">Valuation Basis:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Current metal market value</li>
                      <li>Gemstone valuation (if applicable)</li>
                      <li>Company policy deductions</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-brand-700 mb-2">Non-Recoverable:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Making charges and craftsmanship fees</li>
                      <li>Taxes and certification charges</li>
                      <li>Shipping and handling costs</li>
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-brand-500 mt-4">
                  Buyback values subject to prevailing market rates. Payment as store credit or purchase adjustment.
                </p>
              </div>
            </motion.div>

            {/* Refund Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 bg-bronze-gold/5 rounded-2xl p-6 border border-bronze-gold/20"
            >
              <h3 className="font-playfair text-lg text-brand-800 mb-4">Refund Policy</h3>
              <div className="space-y-3 text-brand-600 font-montserrat text-sm">
                <p className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                  <strong>General Policy:</strong> Cash refunds are not typically offered
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-classic-green flex-shrink-0 mt-0.5" />
                  Exceptional cases considered at company's sole discretion
                </p>
                <p className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                  Shipping, handling, and certification charges non-refundable
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-classic-green flex-shrink-0 mt-0.5" />
                  All requests require pre-approval by customer support
                </p>
                <p className="text-xs text-brand-500 mt-4">
                  Contact: <strong>paymentdesk@thesolitario.com</strong> with order number and reason
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section variant="light" padding="sm">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-classic-green to-teal rounded-3xl p-8 md:p-12 text-center"
          >
            <HelpCircle className="w-12 h-12 text-bronze-gold mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-playfair text-white mb-4">
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
