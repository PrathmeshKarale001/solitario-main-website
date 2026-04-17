import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, UserPlus, Coins, Gift, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import Image from 'next/image';
import { Container } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import { trackCustomEvent } from '@/lib/unified-analytics';

interface AkshayaRewardSectionProps {
  className?: string;
}

import { CAMPAIGNS } from '@/lib/campaigns';

const TNC_TEXT = CAMPAIGNS.find(c => c.id === 'akshaya-tritiya-2026')?.terms || '';


const AkshayaRewardSection: React.FC<AkshayaRewardSectionProps> = ({ className = '' }) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    if (isAccepted && !hasTracked) {
      fetch('/api/track/tnc', { method: 'POST' })
        .then(res => {
          if (!res.ok) throw new Error('Tracking response not OK');
          return res.json();
        })
        .then(data => {
          if (data.success) {
            setHasTracked(true);
            // Also track in unified analytics (GA/PostHog) as backup
            trackCustomEvent('AKSHAYA_TNC_ACCEPTED', {
              category: 'Promotion',
              label: 'Akshaya Tritiya 2026'
            });
          }
        })
        .catch(err => console.error('Tracking failed:', err));
    }
  }, [isAccepted, hasTracked]);

  const steps = [
    {
      id: 1,
      title: 'SCAN',
      description: 'Use your smartphone to begin your Solitario experience.',
      icon: <QrCode className="w-6 h-6 text-bronze-gold" />,
    },
    {
      id: 2,
      title: 'JOIN',
      description: 'Sign up & enjoy 1000 reward points instantly.',
      icon: <UserPlus className="w-6 h-6 text-bronze-gold" />,
    },
    {
      id: 3,
      title: 'EARN',
      description: 'Get reward points with every purchase you make.',
      icon: <Coins className="w-6 h-6 text-bronze-gold" />,
    },
    {
      id: 4,
      title: 'REDEEM',
      description: 'Unlock a special diamond reward once you complete your milestones.',
      icon: <Gift className="w-6 h-6 text-bronze-gold" />,
    },
  ];

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      <div className="relative bg-gradient-to-br from-[#fdf9f3] to-[#f5efdf] rounded-[2rem] overflow-hidden border border-bronze-gold/30 shadow-2xl">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-bronze-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-classic-green/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

        <div className="relative p-8 md:p-12 z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-center">
            {/* Left Column: Title & Steps Grid */}
            <div className="flex-1 min-w-0 w-full space-y-8">
              <div className="space-y-3">
                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl lg:text-5xl font-montserrat font-bold text-brand-800 leading-[1.1]"
                >
                  <span className="text-classic-green">LOVE DIAMONDS?</span><br />
                  WE REWARD YOU WITH MORE.
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-base md:text-lg font-montserrat text-brand-600 tracking-wide font-medium"
                >
                  SHOP MORE, SHINE MORE, EARN MORE.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {steps.map((step, idx) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/30 backdrop-blur-sm border border-transparent hover:border-bronze-gold/20 transition-all group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white shadow-brand-sm flex items-center justify-center border border-bronze-gold/20 group-hover:scale-110 transition-transform relative">
                      <span className="text-[10px] font-bold text-white absolute -top-1.5 -left-1.5 w-5 h-5 bg-brand-800 rounded-lg flex items-center justify-center border-2 border-white">
                        {step.id}
                      </span>
                      {React.cloneElement(step.icon as React.ReactElement, { className: "w-6 h-6 text-bronze-gold" })}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-montserrat font-bold text-brand-800 tracking-tight">{step.title}</h3>
                      <p className="text-xs md:text-sm text-brand-600 font-montserrat leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column: QR Code & T&C */}
            <div className="flex-shrink-0 w-full lg:w-[380px] space-y-6">
              {/* T&C Checkbox Placement */}
              <div className="p-5 bg-white/80 backdrop-blur-md rounded-2xl border border-bronze-gold/20 shadow-lg animate-fade-in ring-1 ring-bronze-gold/5">
                <label className="flex items-start gap-4 cursor-pointer select-none group">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      id="tnc-checkbox"
                      checked={isAccepted}
                      onChange={(e) => setIsAccepted(e.target.checked)}
                      className="peer w-6 h-6 rounded-lg border-2 border-bronze-gold/30 text-classic-green focus:ring-0 focus:ring-offset-0 cursor-pointer transition-all appearance-none checked:bg-classic-green checked:border-classic-green"
                    />
                    <svg
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[11px] md:text-xs font-montserrat text-brand-700 leading-normal">
                    I agree to the <button onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }} className="text-classic-green font-bold underline hover:text-teal transition-colors">Terms & Conditions</button> for the Free Diamond Offer.
                  </span>
                </label>
              </div>

              {/* QR Card Container */}
              <div className="relative group">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className={`bg-white p-6 rounded-[1.5rem] shadow-brand-lg border border-bronze-gold/20 flex flex-col items-center gap-6 relative overflow-hidden transition-all duration-500 ${ !isAccepted ? 'blur-md grayscale opacity-50 select-none pointer-events-none' : 'blur-0 grayscale-0 opacity-100' } `}
                >
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-classic-green via-bronze-gold to-classic-green" />

                  <div className="relative w-full aspect-square max-w-[200px]">
                    <Image
                      src="/images/akshaya-tritiya/akshaya-qr.png"
                      alt="Scan to Join Solitario Rewards"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="w-full space-y-3">
                    <a
                      href="https://solitarioloyalty-member.erlpaas.com/Login"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-brand-800 hover:bg-black text-white font-montserrat font-bold rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
                    >
                      CLICK HERE
                      <ArrowRight className="w-4 h-4 text-bronze-gold" />
                    </a>
                    <p className="text-[10px] text-brand-400 text-center uppercase tracking-[0.15em] font-medium">
                      Powered by Solitario Loyalty Program
                    </p>
                  </div>
                </motion.div>

                {/* Overlay Hint if not accepted */}
                {!isAccepted && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 pointer-events-none">
                    <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center mb-3 shadow-lg border border-bronze-gold/30">
                      <ShieldCheck className="w-6 h-6 text-bronze-gold" />
                    </div>
                    <p className="text-sm font-montserrat font-bold text-brand-800 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                      Please accept T&C to scan
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* T&C Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Terms & Conditions"
        size="lg"
      >
        <div className="font-montserrat text-sm text-brand-800 space-y-6 leading-relaxed">
          <div className="whitespace-pre-line">
            {TNC_TEXT}
          </div>

          <div className="pt-6 border-t border-brand-200">
            <button
              onClick={() => {
                setIsAccepted(true);
                setIsModalOpen(false);
              }}
              className="w-full py-4 bg-classic-green text-white font-bold rounded-xl hover:bg-teal transition-all shadow-md capitalize"
            >
              I Accept the Terms & Conditions
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AkshayaRewardSection;

