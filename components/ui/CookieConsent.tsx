'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';

const STORAGE_KEY = 'solitario_cookie_consent';
const STORAGE_EXPIRY_DAYS = 365;

export type CookiePreference = 'all' | 'essential';

function getStoredPreference(): CookiePreference | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { value: CookiePreference; expiry?: number };
    if (parsed.expiry && Date.now() > parsed.expiry) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.value === 'all' || parsed.value === 'essential' ? parsed.value : null;
  } catch {
    return null;
  }
}

function setStoredPreference(value: CookiePreference) {
  try {
    const expiry = Date.now() + STORAGE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ value, expiry }));
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ value }));
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (getStoredPreference() === null) setVisible(true);
  }, []);

  const handleChoice = (preference: CookiePreference) => {
    setStoredPreference(preference);
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-label="Cookie consent"
        aria-describedby="cookie-consent-description"
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-[9998]"
      >
        <div className="bg-ivory-pearl/98 backdrop-blur-xl border-t-2 border-bronze-gold/40 shadow-[0_-8px_40px_rgba(20,101,82,0.06),0_-2px_0_0_rgba(172,136,75,0.15)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-classic-green/10 border border-classic-green/20 flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-classic-green" aria-hidden />
                </div>
                <div>
                  <p
                    id="cookie-consent-description"
                    className="text-brand-700 text-sm sm:text-base font-montserrat leading-relaxed"
                  >
                    We use cookies to run the site, improve your experience, and for analytics. By continuing you agree to our use of cookies.{' '}
                    <Link
                      href="/privacy-policy"
                      className="text-classic-green font-medium underline underline-offset-2 hover:text-teal-dark focus:outline-none focus:ring-2 focus:ring-classic-green focus:ring-offset-2 rounded"
                    >
                      Privacy &amp; cookies
                    </Link>
                  </p>
                </div>
              </div>
              <div className="flex flex-shrink-0 gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => handleChoice('essential')}
                  className="px-4 sm:px-5 py-2.5 font-gotham text-xs sm:text-sm uppercase tracking-wider border-2 border-brand-300 text-brand-700 rounded-lg hover:border-classic-green hover:text-classic-green focus:outline-none focus:ring-2 focus:ring-classic-green focus:ring-offset-2 transition-colors touch-manipulation min-h-[44px]"
                >
                  Essential only
                </button>
                <button
                  type="button"
                  onClick={() => handleChoice('all')}
                  className="px-4 sm:px-6 py-2.5 font-gotham text-xs sm:text-sm uppercase tracking-wider bg-classic-green text-white rounded-lg hover:bg-teal-dark focus:outline-none focus:ring-2 focus:ring-classic-green focus:ring-offset-2 shadow-brand-sm transition-colors touch-manipulation min-h-[44px]"
                >
                  Accept all
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
