'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, Diamond, ArrowRight } from 'lucide-react';

interface FestivalLeadFormProps {
  campaignId?: string;
  className?: string;
}

const FestivalLeadForm: React.FC<FestivalLeadFormProps> = ({ 
  campaignId = 'akshaya-tritiya-2024',
  className = '' 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/leads/festival', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, campaign_id: campaignId }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setStatus('error');
      setErrorMessage('Failed to submit form. Please check your connection.');
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="relative bg-[#fdf9f3] rounded-2xl overflow-hidden shadow-2xl border border-gold/40">
        {/* Abstract Background Design */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        
        <div className="relative p-8 md:p-12 z-10">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gold/20 rounded-full mb-6">
                  <CheckCircle2 className="w-10 h-10 text-gold" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 font-playfair">Congratulations!</h2>
                <p className="text-black/80 text-lg mb-8 max-w-md mx-auto">
                  Your entry has been registered successfully. Our team will contact you soon regarding your Free Diamond offer.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="px-8 py-3 bg-white hover:bg-brand-100 text-black border border-brand-200 font-semibold rounded-lg transition-colors shadow-sm"
                >
                  Submit Another
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-classic-green/10 border border-classic-green/20 rounded-full mb-6">
                      <Diamond className="w-4 h-4 text-classic-green" />
                      <span className="text-classic-green text-xs font-bold uppercase tracking-widest">Akshaya Tritiya Exclusive</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight font-playfair">
                      Claim Your <span className="text-classic-green">Free Diamond</span> This Festive Season
                    </h2>
                    <p className="text-black/80 text-lg mb-8 leading-relaxed max-w-lg">
                      Celebrate the auspicious occasion of Akshaya Tritiya with Solitario. Fill the form below to receive a certified loose diamond with your purchase.
                    </p>
                    
                    <div className="flex items-center gap-4 py-4 px-6 bg-black/5 rounded-xl border border-black/10 backdrop-blur-sm">
                      <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-brand-100 flex items-center justify-center overflow-hidden">
                            <img 
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=customer${i}`} 
                              alt="" 
                              width={40}
                              height={40}
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-black/70 text-sm">
                        <span className="text-black font-bold">500+</span> customers already claimed
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-[400px] bg-white rounded-xl p-6 md:p-8 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Full Name</label>
                        <input
                          required
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-gray-900"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Email Address</label>
                        <input
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="example@email.com"
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-gray-900"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Phone</label>
                          <input
                            required
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Mobile no."
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-gray-900"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">City</label>
                          <input
                            required
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Enter city"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-gray-900"
                          />
                        </div>
                      </div>

                      {status === 'error' && (
                        <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
                      )}

                      <button
                        disabled={status === 'loading'}
                        type="submit"
                        className="w-full py-4 bg-white hover:bg-brand-50 text-black border-2 border-classic-green font-bold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {status === 'loading' ? (
                          <Loader2 className="w-5 h-5 animate-spin text-classic-green" />
                        ) : (
                          <>
                            CLAIM FREE DIAMOND
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                      <p className="text-[10px] text-gray-400 text-center uppercase tracking-wider">
                        * T&C Apply. Offer valid till Akshaya Tritiya.
                      </p>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FestivalLeadForm;
