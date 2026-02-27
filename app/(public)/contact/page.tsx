'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageSquare, Zap, Shield } from 'lucide-react';
import ContactForm from '@/components/forms/ContactForm';
import HeadOffice from '@/components/home/HeadOffice';
import { Container } from '@/components/ui';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-brand-50">
      {/* Hero Section - Matching FAQ/Stores pattern */}
      <section className="bg-classic-green pt-28 md:pt-32 pb-10 md:pb-14">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block text-bronze-gold text-xs md:text-sm uppercase tracking-[0.3em] font-gotham mb-4">
              Get In Touch
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-montserrat font-bold text-white mb-4">
              We'd Love to <span className="text-bronze-gold">Hear From You</span>
            </h1>
            <p className="text-white/80 font-montserrat text-sm md:text-lg px-4">
              Have questions about our lab-grown diamond jewellery?
              Our team is here to help you find the perfect piece.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 md:py-16 bg-brand-100">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-12"
          >
            <span className="inline-block text-classic-green text-xs uppercase tracking-[0.3em] font-gotham mb-4">
              Reach Out
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-montserrat font-bold text-brand-800">
              Contact <span className="text-classic-green">Information</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Email Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0 }}
              className="rounded-2xl bg-white border border-brand-200 hover:border-classic-green/30 hover:shadow-brand-lg p-6 transition-all duration-500 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-classic-green/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-classic-green" />
              </div>
              <h3 className="text-lg font-montserrat font-bold text-brand-800 mb-2">Email</h3>
              <a
                href="mailto:paymentdesk@thesolitario.com"
                className="text-brand-600 text-sm font-montserrat hover:text-classic-green transition-colors"
              >
                paymentdesk@thesolitario.com
              </a>
            </motion.div>

            {/* Phone Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-2xl bg-white border border-brand-200 hover:border-classic-green/30 hover:shadow-brand-lg p-6 transition-all duration-500 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-classic-green/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-classic-green" />
              </div>
              <h3 className="text-lg font-montserrat font-bold text-brand-800 mb-2">Phone</h3>
              <a
                href="tel:+919876543210"
                className="text-brand-600 text-sm font-montserrat hover:text-classic-green transition-colors"
              >
                +91 98765 43210
              </a>
            </motion.div>

            {/* Locations Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-2xl bg-white border border-brand-200 hover:border-classic-green/30 hover:shadow-brand-lg p-6 transition-all duration-500 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-classic-green/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-classic-green" />
              </div>
              <h3 className="text-lg font-montserrat font-bold text-brand-800 mb-2">Locations</h3>
              <p className="text-brand-600 text-sm font-montserrat">
                India | Spain | Malaysia | Dubai
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Form + Info Section */}
      <section className="py-12 md:py-16 bg-brand-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Contact Form Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl bg-white border border-brand-200 p-6 sm:p-8 shadow-brand"
            >
              <h2 className="text-xl sm:text-2xl font-montserrat font-bold text-brand-800 mb-6">
                Send Us a <span className="text-classic-green">Message</span>
              </h2>
              <ContactForm />
            </motion.div>

            {/* Why Contact Us Panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-xl sm:text-2xl font-montserrat font-bold text-brand-800 mb-6">
                Why <span className="text-classic-green">Contact Us</span>?
              </h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-classic-green/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-classic-green" />
                  </div>
                  <div>
                    <h3 className="font-montserrat font-semibold text-brand-800 mb-1">Quick Response</h3>
                    <p className="text-brand-600 text-sm font-montserrat leading-relaxed">
                      We respond to all enquiries within 24 hours during business days.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-classic-green/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-classic-green" />
                  </div>
                  <div>
                    <h3 className="font-montserrat font-semibold text-brand-800 mb-1">Expert Guidance</h3>
                    <p className="text-brand-600 text-sm font-montserrat leading-relaxed">
                      Our diamond specialists can help you choose the perfect piece for any occasion.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-classic-green/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-classic-green" />
                  </div>
                  <div>
                    <h3 className="font-montserrat font-semibold text-brand-800 mb-1">Secure & Confidential</h3>
                    <p className="text-brand-600 text-sm font-montserrat leading-relaxed">
                      Your enquiries and personal details are treated with complete confidentiality.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-classic-green/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-classic-green" />
                  </div>
                  <div>
                    <h3 className="font-montserrat font-semibold text-brand-800 mb-1">Business Hours</h3>
                    <p className="text-brand-600 text-sm font-montserrat leading-relaxed">
                      Mon – Sat: 10:00 AM – 7:00 PM IST
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Head Office Section */}
      <HeadOffice />
    </div>
  );
}
