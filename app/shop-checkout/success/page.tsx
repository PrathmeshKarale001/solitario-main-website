'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Package, Phone, Mail, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-24 pb-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-classic-green/10 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle className="w-12 h-12 text-classic-green" />
          </motion.div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-playfair text-classic-green mb-4">
            Order Received!
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            Thank you for your order. We have received your request and our team will contact you shortly.
          </p>

          {/* Order ID */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Package className="w-5 h-5 text-bronze-gold" />
              <span className="text-sm text-gray-500">Order Reference</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 font-mono">
              {orderId}
            </p>
          </div>

          {/* What's Next */}
          <div className="bg-classic-green/5 rounded-xl p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-classic-green text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  1
                </div>
                <p className="text-gray-600">
                  Our team will review your order and verify the details.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-classic-green text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  2
                </div>
                <p className="text-gray-600">
                  You will receive a call or email to confirm your order and payment details.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-classic-green text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  3
                </div>
                <p className="text-gray-600">
                  Once confirmed, your order will be processed and shipped with full insurance.
                </p>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8 text-sm text-gray-600">
            <a href="tel:+917887883444" className="flex items-center gap-2 hover:text-classic-green transition-colors">
              <Phone className="w-4 h-4" />
              +91 788 788 3444
            </a>
            <a href="mailto:paymentdesk@thesolitario.com" className="flex items-center gap-2 hover:text-classic-green transition-colors">
              <Mail className="w-4 h-4" />
              paymentdesk@thesolitario.com
            </a>
          </div>

          {/* Continue Shopping */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-classic-green text-white px-8 py-4 rounded-lg font-semibold hover:bg-classic-green/90 transition-colors"
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </Container>
    </div>
  );
}

export default function ShopCheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-classic-green"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
