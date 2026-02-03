'use client';

export const dynamic = 'force-dynamic';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { CreditCard, ChevronLeft, Plus, Trash2, Check, X, Shield } from 'lucide-react';
import { Section, Container } from '@/components/ui';

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi';
  last4?: string;
  brand?: string;
  upiId?: string;
  isDefault: boolean;
  expiryMonth?: number;
  expiryYear?: number;
}

const STORAGE_KEY = 'solitario_payment_methods';

const cardBrands: Record<string, { name: string; color: string }> = {
  visa: { name: 'Visa', color: 'bg-blue-600' },
  mastercard: { name: 'Mastercard', color: 'bg-red-500' },
  amex: { name: 'Amex', color: 'bg-blue-400' },
  rupay: { name: 'RuPay', color: 'bg-orange-500' },
};

export default function PaymentPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'card' | 'upi'>('card');

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in?redirect_url=/account/payment');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMethods(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    }
    setLoading(false);
  }, []);

  const saveMethods = (newMethods: PaymentMethod[]) => {
    setMethods(newMethods);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMethods));
  };

  const handleDelete = (id: string) => {
    const updated = methods.filter(m => m.id !== id);
    if (updated.length > 0 && !updated.some(m => m.isDefault)) {
      updated[0].isDefault = true;
    }
    saveMethods(updated);
  };

  const handleSetDefault = (id: string) => {
    const updated = methods.map(m => ({
      ...m,
      isDefault: m.id === id,
    }));
    saveMethods(updated);
  };

  const openModal = (type: 'card' | 'upi') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bronze-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-20">
      <Section variant="light" padding="lg">
        <Container>
          <div className="max-w-2xl mx-auto">
            {/* Back Button */}
            <Link href="/account" className="inline-flex items-center gap-2 text-brand-500 hover:text-brand-700 mb-6 font-montserrat transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Back to Account
            </Link>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-brand-800 mb-2">Payment Methods</h1>
              <p className="text-brand-500 font-montserrat">Manage your saved payment options</p>
            </motion.div>

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-classic-green/5 border border-classic-green/20 rounded-xl p-4 mb-6 flex items-start gap-3"
            >
              <Shield className="w-5 h-5 text-classic-green flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-montserrat text-sm text-classic-green font-medium">Your payment information is secure</p>
                <p className="text-xs text-classic-green/70 font-montserrat mt-1">
                  We use industry-standard encryption to protect your data. Card details are stored securely with our payment partner.
                </p>
              </div>
            </motion.div>

            {/* Add Payment Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-4 mb-6"
            >
              <button
                onClick={() => openModal('card')}
                className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border-2 border-dashed border-brand-200 hover:border-classic-green hover:bg-classic-green/5 transition-all group"
              >
                <div className="w-12 h-12 bg-brand-100 group-hover:bg-classic-green/10 rounded-xl flex items-center justify-center transition-colors">
                  <CreditCard className="w-6 h-6 text-brand-500 group-hover:text-classic-green transition-colors" />
                </div>
                <div className="text-center">
                  <p className="font-montserrat text-brand-700 font-medium">Add Card</p>
                  <p className="text-xs text-brand-400 font-montserrat">Debit or Credit</p>
                </div>
              </button>
              <button
                onClick={() => openModal('upi')}
                className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border-2 border-dashed border-brand-200 hover:border-bronze-gold hover:bg-bronze-gold/5 transition-all group"
              >
                <div className="w-12 h-12 bg-brand-100 group-hover:bg-bronze-gold/10 rounded-xl flex items-center justify-center transition-colors">
                  <span className="text-xl font-bold text-brand-500 group-hover:text-bronze-gold transition-colors">₹</span>
                </div>
                <div className="text-center">
                  <p className="font-montserrat text-brand-700 font-medium">Add UPI</p>
                  <p className="text-xs text-brand-400 font-montserrat">GPay, PhonePe, etc.</p>
                </div>
              </button>
            </motion.div>

            {/* Saved Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="font-montserrat font-bold text-lg text-brand-800 mb-4">Saved Payment Methods</h2>
              
              {methods.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-brand border border-brand-100 p-12 text-center">
                  <CreditCard className="w-16 h-16 text-brand-300 mx-auto mb-4" />
                  <h3 className="text-xl font-montserrat font-bold text-brand-800 mb-2">No payment methods saved</h3>
                  <p className="text-brand-500 font-montserrat">
                    Add a payment method for faster checkout
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {methods.map((method, index) => (
                    <motion.div
                      key={method.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white rounded-xl shadow-brand border-2 p-4 ${
                        method.isDefault ? 'border-classic-green' : 'border-brand-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {method.type === 'card' ? (
                            <div className={`w-12 h-8 ${cardBrands[method.brand || 'visa'].color} rounded flex items-center justify-center`}>
                              <span className="text-white text-xs font-bold">{cardBrands[method.brand || 'visa'].name}</span>
                            </div>
                          ) : (
                            <div className="w-12 h-8 bg-bronze-gold rounded flex items-center justify-center">
                              <span className="text-white text-sm font-bold">UPI</span>
                            </div>
                          )}
                          <div>
                            {method.type === 'card' ? (
                              <>
                                <p className="font-montserrat text-brand-800">•••• •••• •••• {method.last4}</p>
                                <p className="text-xs text-brand-500 font-montserrat">
                                  Expires {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}
                                </p>
                              </>
                            ) : (
                              <p className="font-montserrat text-brand-800">{method.upiId}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {method.isDefault ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-classic-green text-white rounded text-xs font-montserrat">
                              <Check className="w-3 h-3" />
                              Default
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSetDefault(method.id)}
                              className="text-xs text-brand-500 hover:text-classic-green font-montserrat transition-colors"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(method.id)}
                            className="p-2 text-brand-400 hover:text-error hover:bg-error/5 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Add Payment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[15%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md bg-white rounded-2xl shadow-2xl z-50"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-montserrat font-bold text-brand-800">
                    {modalType === 'card' ? 'Add Card' : 'Add UPI'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-brand-100 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-brand-500" />
                  </button>
                </div>

                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-bronze-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {modalType === 'card' ? (
                      <CreditCard className="w-8 h-8 text-bronze-gold" />
                    ) : (
                      <span className="text-2xl font-bold text-bronze-gold">₹</span>
                    )}
                  </div>
                  <h3 className="font-montserrat font-bold text-lg text-brand-800 mb-2">Coming Soon</h3>
                  <p className="text-brand-500 font-montserrat text-sm">
                    {modalType === 'card' 
                      ? 'Card saving will be available during checkout with Shopify Payments.'
                      : 'UPI ID saving will be available soon.'}
                  </p>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-3 bg-brand-100 text-brand-700 rounded-xl hover:bg-brand-200 transition-colors font-montserrat"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
