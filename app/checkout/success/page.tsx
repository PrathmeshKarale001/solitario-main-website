'use client';

import { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Truck, Mail, Phone, ArrowRight, Download, Share2, Copy, Check } from 'lucide-react';
import { Container } from '@/components/ui';
import confetti from 'canvas-confetti';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');
  const waybill = searchParams.get('waybill');
  const [copied, setCopied] = useState(false);

  // Trigger confetti on mount
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#146552', '#ac884b', '#FFD700'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#146552', '#ac884b', '#FFD700'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-classic-green/5 to-white pt-24">
      <Container className="py-12">
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
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 bg-classic-green rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-playfair text-3xl md:text-4xl text-gray-900 mb-4"
          >
            Thank You for Your Order!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 font-montserrat text-lg mb-8"
          >
            Your payment was successful. We're preparing your beautiful jewellery with care.
          </motion.p>

          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 mb-8 text-left"
          >
            <h2 className="font-playfair text-xl text-gray-900 mb-6 text-center">Order Details</h2>
            
            <div className="space-y-4">
              {/* Order ID */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-mono font-semibold text-gray-900">{orderId || 'N/A'}</p>
                </div>
                <button
                  onClick={copyOrderId}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy Order ID"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-classic-green" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>

              {/* Payment ID */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Payment ID</p>
                  <p className="font-mono text-sm text-gray-700">{paymentId || 'N/A'}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-classic-green/10 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-semibold text-classic-green">Payment Successful</p>
                </div>
                <CheckCircle className="w-6 h-6 text-classic-green" />
              </div>

              {/* Tracking Number (if available) */}
              {waybill && (
                <div className="flex items-center justify-between p-4 bg-bronze-gold/10 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Tracking Number (Delhivery)</p>
                    <p className="font-mono font-semibold text-gray-900">{waybill}</p>
                  </div>
                  <a
                    href={`https://www.delhivery.com/track/package/${waybill}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-classic-green hover:underline"
                  >
                    <Truck className="w-4 h-4" />
                    Track
                  </a>
                </div>
              )}
            </div>
          </motion.div>

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 mb-8"
          >
            <h2 className="font-playfair text-xl text-gray-900 mb-6">What Happens Next?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-classic-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-classic-green" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Confirmation Email</h3>
                <p className="text-sm text-gray-500">You'll receive an order confirmation email shortly</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-classic-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-classic-green" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Order Processing</h3>
                <p className="text-sm text-gray-500">We'll carefully prepare your jewellery (1-2 days)</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-classic-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-6 h-6 text-classic-green" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Shipping</h3>
                <p className="text-sm text-gray-500">Insured delivery within 5-7 business days</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-50 rounded-xl p-6 mb-8"
          >
            <p className="text-gray-600 mb-4">Need help with your order?</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 text-classic-green hover:underline"
              >
                <Phone className="w-4 h-4" />
                +91 98765 43210
              </a>
              <span className="hidden sm:block text-gray-300">|</span>
              <a
                href="mailto:support@thesolitario.com"
                className="flex items-center gap-2 text-classic-green hover:underline"
              >
                <Mail className="w-4 h-4" />
                support@thesolitario.com
              </a>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-classic-green hover:bg-classic-green/90 text-white px-8 py-4 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 font-semibold rounded-lg border border-gray-200 transition-all"
            >
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-classic-green"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
