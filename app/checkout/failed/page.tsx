'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle, RefreshCw, Phone, Mail, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Container } from '@/components/ui';

function FailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const description = searchParams.get('description');

  // Map error codes to user-friendly messages
  const getErrorMessage = () => {
    switch (reason) {
      case 'BAD_REQUEST_ERROR':
        return 'There was an issue with the payment request. Please try again.';
      case 'GATEWAY_ERROR':
        return 'Payment gateway is temporarily unavailable. Please try again later.';
      case 'SERVER_ERROR':
        return 'Our servers encountered an issue. Please try again.';
      case 'verification_failed':
        return 'Payment verification failed. If money was deducted, it will be refunded within 5-7 business days.';
      case 'PAYMENT_CANCELLED':
        return 'You cancelled the payment. Your cart items are still saved.';
      default:
        return description || 'Something went wrong with your payment. Please try again.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white pt-24">
      <Container className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Failed Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
          >
            <XCircle className="w-12 h-12 text-white" />
          </motion.div>

          {/* Failed Message */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-montserrat font-bold text-3xl md:text-4xl text-gray-900 mb-4"
          >
            Payment Failed
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 font-montserrat text-lg mb-8"
          >
            {getErrorMessage()}
          </motion.p>

          {/* Error Details Card */}
          {reason && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8"
            >
              <div className="flex items-start gap-4 text-left">
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Error Details</h3>
                  <p className="text-sm text-gray-600 font-mono bg-gray-50 p-3 rounded">
                    Code: {reason}
                    {description && (
                      <>
                        <br />
                        Description: {decodeURIComponent(description)}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* What You Can Do */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 mb-8"
          >
            <h2 className="font-montserrat font-bold text-xl text-gray-900 mb-6">What You Can Do</h2>
            
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <RefreshCw className="w-5 h-5 text-classic-green flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Try Again</h3>
                  <p className="text-sm text-gray-600">Your cart items are saved. Go back to checkout and try a different payment method.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-classic-green flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Contact Support</h3>
                  <p className="text-sm text-gray-600">If money was deducted, contact us immediately with your transaction details.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <h3 className="font-semibold text-amber-800 mb-1">Money Deducted?</h3>
                <p className="text-sm text-amber-700">
                  If your payment was deducted but the order wasn't confirmed, don't worry! 
                  The amount will be automatically refunded to your account within 5-7 business days. 
                  If you don't receive the refund, please contact our support team.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gray-50 rounded-xl p-6 mb-8"
          >
            <p className="text-gray-600 mb-4">Need immediate assistance?</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:+917887883444"
                className="flex items-center gap-2 text-classic-green hover:underline font-semibold"
              >
                <Phone className="w-4 h-4" />
                +91 788 788 3444
              </a>
              <span className="hidden sm:block text-gray-300">|</span>
              <a
                href="mailto:paymentdesk@thesolitario.com"
                className="flex items-center gap-2 text-classic-green hover:underline"
              >
                <Mail className="w-4 h-4" />
                paymentdesk@thesolitario.com
              </a>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 bg-classic-green hover:bg-classic-green/90 text-white px-8 py-4 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </Link>
            
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 font-semibold rounded-lg border border-gray-200 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Shop
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}

export default function CheckoutFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    }>
      <FailedContent />
    </Suspense>
  );
}
