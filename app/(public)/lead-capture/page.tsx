'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadCaptureSchema, LeadCaptureFormData } from '@/lib/validations';
import { toast } from '@/components/providers/Toaster';
import { trackMetaLead } from '@/components/analytics/MetaPixel';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Shield,
  Users,
  Gem,
  ArrowRight,
  Loader2,
  Phone,
  Mail,
  ChevronDown,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

const INVESTMENT_OPTIONS = [
  '₹50L – ₹1 Cr',
  '₹1 Cr – ₹2 Cr',
  '₹2 Cr – ₹5 Cr',
  '₹5 Cr+',
] as const;

const BENEFITS = [
  {
    icon: TrendingUp,
    title: 'Growing Market',
    stat: '20%+',
    statLabel: 'Annual Growth',
    description:
      'Lab-grown diamonds are the fastest-growing segment in the jewellery industry, with massive consumer adoption worldwide.',
  },
  {
    icon: Shield,
    title: 'Established Brand',
    stat: '15+',
    statLabel: 'Retail Stores',
    description:
      'A brand backed by celebrity co-founders with proven market presence and consumer trust across the country.',
  },
  {
    icon: Users,
    title: 'Complete Support',
    stat: '360°',
    statLabel: 'Brand Support',
    description:
      'End-to-end training, marketing, visual merchandising, and day-to-day operational guidance from our expert team.',
  },
  {
    icon: Gem,
    title: 'Premium Product',
    stat: '100%',
    statLabel: 'Certified Diamonds',
    description:
      'Every diamond is IGI/GIA certified, ethically sourced, and crafted by master artisans — a product that sells itself.',
  },
];

const TRUST_POINTS = [
  'No royalty fees',
  'Exclusive territory rights',
  'Celebrity-backed brand',
  'In-house design team',
  'Marketing & ad support',
  'Proven ROI model',
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

export default function LeadCapturePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadCaptureFormData>({
    resolver: zodResolver(leadCaptureSchema),
  });

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onSubmit = async (data: LeadCaptureFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Submission failed');

      toast.success('Thank you for your interest!', {
        description: 'Our team will contact you within 24 hours.',
      });

      trackMetaLead({
        content_name: 'Lead Capture Form — Performance Marketing',
        content_category: 'Franchise Lead',
      });

      setIsSubmitted(true);
      reset();
    } catch {
      toast.error('Something went wrong', {
        description: 'Please try again or call us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input class helper
  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3.5 rounded-xl border ${
      hasError ? 'border-error' : 'border-brand-200'
    } bg-white text-brand-800 font-montserrat text-sm placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-classic-green/30 focus:border-classic-green transition-all duration-200`;

  return (
    <div className="min-h-screen bg-brand-50">
      {/* ===== MINI HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Image
            src="/logo.svg"
            alt="Solitario"
            width={140}
            height={32}
            className="h-7 md:h-8 w-auto"
            priority
          />
          <button
            onClick={scrollToForm}
            className="text-xs md:text-sm font-montserrat font-semibold uppercase tracking-widest text-white bg-classic-green hover:bg-classic-green/90 px-4 py-2 md:px-5 md:py-2.5 rounded-lg transition-all duration-300"
          >
            Enquire Now
          </button>
        </div>
      </header>

      {/* ===== SECTION 1: HERO BANNER ===== */}
      <section className="pt-14 md:pt-16">
        <div className="relative w-full aspect-[16/9] md:aspect-[16/7] lg:aspect-[16/6] bg-brand-800 overflow-hidden">
          <Image
            src="/images/lead-capture/hero-banner.jpg"
            alt="Solitario Franchise Investment Opportunity"
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="100vw"
          />
          {/* Subtle gradient for polish */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>
      </section>

      {/* ===== SECTION 2: LEAD CAPTURE FORM ===== */}
      <section ref={formRef} id="enquiry-form" className="relative z-10 px-4 -mt-6 md:-mt-10">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-brand-lg border border-brand-100 overflow-hidden"
          >
            {/* Form Header */}
            <div className="bg-gradient-brand px-6 py-5 text-center">
              <h1 className="text-lg md:text-xl font-montserrat font-bold text-white tracking-tight">
                Interested in a Solitario Franchise?
              </h1>
              <p className="text-white/80 text-xs md:text-sm font-montserrat mt-1">
                Fill in your details and our team will reach out to you
              </p>
            </div>

            {isSubmitted ? (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 md:p-10 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-classic-green/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-classic-green" />
                </div>
                <h2 className="text-xl font-montserrat font-bold text-brand-800 mb-2">
                  Thank You!
                </h2>
                <p className="text-brand-600 font-montserrat text-sm mb-6">
                  We&apos;ve received your enquiry. Our franchise team will contact you within 24 hours.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm font-montserrat">
                  <a
                    href="tel:+919876543210"
                    className="inline-flex items-center gap-2 text-classic-green hover:text-teal-dark transition-colors"
                  >
                    <Phone className="w-4 h-4" /> Call Us Directly
                  </a>
                  <span className="hidden sm:inline text-brand-300">|</span>
                  <a
                    href="mailto:franchise@thesolitario.com"
                    className="inline-flex items-center gap-2 text-classic-green hover:text-teal-dark transition-colors"
                  >
                    <Mail className="w-4 h-4" /> franchise@thesolitario.com
                  </a>
                </div>
              </motion.div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-4">
                {/* Name & Phone — side by side on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="lc-name"
                      className="block text-sm font-medium text-brand-700 font-montserrat mb-1.5"
                    >
                      Full Name <span className="text-error">*</span>
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      id="lc-name"
                      className={inputClass(!!errors.name)}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-error">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lc-phone"
                      className="block text-sm font-medium text-brand-700 font-montserrat mb-1.5"
                    >
                      Phone <span className="text-error">*</span>
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      id="lc-phone"
                      className={inputClass(!!errors.phone)}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-error">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="lc-email"
                    className="block text-sm font-medium text-brand-700 font-montserrat mb-1.5"
                  >
                    Email <span className="text-error">*</span>
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    id="lc-email"
                    className={inputClass(!!errors.email)}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-error">{errors.email.message}</p>
                  )}
                </div>

                {/* City & Investment Interest — side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="lc-city"
                      className="block text-sm font-medium text-brand-700 font-montserrat mb-1.5"
                    >
                      City <span className="text-error">*</span>
                    </label>
                    <input
                      {...register('city')}
                      type="text"
                      id="lc-city"
                      className={inputClass(!!errors.city)}
                      placeholder="Your city"
                    />
                    {errors.city && (
                      <p className="mt-1 text-xs text-error">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lc-investment"
                      className="block text-sm font-medium text-brand-700 font-montserrat mb-1.5"
                    >
                      Investment Interest <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <select
                        {...register('investmentInterest')}
                        id="lc-investment"
                        className={`${inputClass(!!errors.investmentInterest)} appearance-none pr-10 cursor-pointer`}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select range
                        </option>
                        {INVESTMENT_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400 pointer-events-none" />
                    </div>
                    {errors.investmentInterest && (
                      <p className="mt-1 text-xs text-error">
                        {errors.investmentInterest.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message (optional) */}
                <div>
                  <label
                    htmlFor="lc-message"
                    className="block text-sm font-medium text-brand-700 font-montserrat mb-1.5"
                  >
                    Message <span className="text-brand-400">(optional)</span>
                  </label>
                  <textarea
                    {...register('message')}
                    id="lc-message"
                    rows={3}
                    className={`${inputClass(!!errors.message)} resize-none`}
                    placeholder="Tell us about your background or any questions..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-error">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-white font-montserrat font-semibold uppercase tracking-widest text-sm rounded-xl bg-classic-green hover:bg-teal-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-brand-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Enquiry <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-brand-400 font-montserrat">
                  Your information is secure and will never be shared with third parties.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 3: WHY SOLITARIO ===== */}
      <section className="py-16 md:py-20 px-4 mt-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block text-bronze-gold text-xs uppercase tracking-[0.3em] font-montserrat font-semibold mb-3">
              Investment Opportunity
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-montserrat font-bold text-brand-800 tracking-tight">
              Why Invest in <span className="text-classic-green">Solitario</span>?
            </h2>
            <p className="mt-3 text-brand-600 font-montserrat max-w-2xl mx-auto text-sm md:text-base">
              Join India&apos;s fastest-growing lab-grown diamond jewellery brand and be part of a revolution in sustainable luxury.
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {BENEFITS.map((benefit) => (
              <motion.div
                key={benefit.title}
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
                className="group relative bg-white rounded-2xl border border-brand-100 p-6 hover:border-classic-green/30 hover:shadow-brand-lg transition-all duration-500"
              >
                <div className="w-12 h-12 mb-4 rounded-xl bg-classic-green/8 flex items-center justify-center group-hover:bg-classic-green/15 transition-colors duration-300">
                  <benefit.icon className="w-6 h-6 text-classic-green" />
                </div>
                <div className="mb-3">
                  <span className="text-2xl font-montserrat font-bold text-classic-green">
                    {benefit.stat}
                  </span>
                  <span className="block text-xs text-brand-500 font-montserrat uppercase tracking-wider mt-0.5">
                    {benefit.statLabel}
                  </span>
                </div>
                <h3 className="text-base font-montserrat font-bold text-brand-800 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-brand-600 text-sm font-montserrat leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Points Strip */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          >
            {TRUST_POINTS.map((point) => (
              <span
                key={point}
                className="inline-flex items-center gap-1.5 text-sm font-montserrat text-brand-700"
              >
                <CheckCircle className="w-4 h-4 text-classic-green flex-shrink-0" />
                {point}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 4: FINAL CTA ===== */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-brand px-4 py-16 md:py-20">
          {/* Subtle decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-3xl mx-auto text-center"
          >
            <Sparkles className="w-10 h-10 text-bronze-gold mx-auto mb-5" />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-montserrat font-bold text-white tracking-tight mb-4">
              Ready to Invest in Your Future?
            </h2>
            <p className="text-white/80 font-montserrat text-sm md:text-base max-w-xl mx-auto mb-8">
              Take the first step towards owning a Solitario franchise. Our team is ready to guide you through every stage of the journey.
            </p>
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 px-8 py-4 text-classic-green font-montserrat font-semibold uppercase tracking-widest text-sm rounded-xl bg-white hover:bg-ivory-pearl transition-all duration-300 hover:shadow-gold-glow-lg hover:scale-[1.02]"
            >
              Get in Touch <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Footer strip */}
        <div className="bg-brand-900 px-4 py-4 text-center">
          <p className="text-brand-400 text-xs font-montserrat">
            © {new Date().getFullYear()} The Solitario. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
}
