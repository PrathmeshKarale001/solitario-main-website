'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Link from 'next/link';

export default function HeadOffice() {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-brand-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="inline-block text-classic-green text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] font-gotham mb-2 sm:mb-4">
            Visit Us
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-playfair text-brand-800 mb-2 sm:mb-4">
            Our <span className="text-classic-green">Head Office</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-brand-600 max-w-xl mx-auto font-montserrat hidden sm:block">
            Visit our headquarters in Pune and experience the world of Solitario lab grown diamonds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Map - Full Height */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl sm:rounded-3xl overflow-hidden border border-brand-200 shadow-brand h-[500px] sm:h-[550px] lg:h-[600px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7564.914352624912!2d73.7969086!3d18.5534165!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf54b5e6cc31%3A0xdc6172742cb69fa3!2sSolitario%20Lab%20Grown%20Private%20Limited%20Head%20Office!5e0!3m2!1sen!2sin!4v1765067715948!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Solitario Head Office Location"
            />
          </motion.div>

          {/* Office Details - Matching Height */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl sm:rounded-3xl bg-white border border-brand-200 p-6 sm:p-8 flex flex-col justify-center shadow-brand h-[500px] sm:h-[550px] lg:h-[600px]"
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-playfair text-brand-800 mb-6 sm:mb-8">
              Solitario Lab Grown <span className="text-classic-green">Pvt. Ltd.</span>
            </h3>

            <div className="space-y-4 sm:space-y-6">
              {/* Address */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-classic-green/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-classic-green" />
                </div>
                <div>
                  <h4 className="text-brand-800 font-gotham text-sm sm:text-base mb-1">Address</h4>
                  <p className="text-brand-600 text-xs sm:text-sm font-montserrat leading-relaxed">
                    Solitario Lab Grown Private Limited Head Office, <br />
                    401 Vascon Eco Towers, Baner - Pashan Link Road <br />
                    Pune, Maharashtra, India
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-classic-green/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-classic-green" />
                </div>
                <div>
                  <h4 className="text-brand-800 font-gotham text-sm sm:text-base mb-1">Phone</h4>
                  <a href="tel:+919876543210" className="text-brand-600 text-xs sm:text-sm font-montserrat hover:text-classic-green transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-classic-green/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-classic-green" />
                </div>
                <div>
                  <h4 className="text-brand-800 font-gotham text-sm sm:text-base mb-1">Email</h4>
                  <a href="mailto:info@thesolitario.com" className="text-brand-600 text-xs sm:text-sm font-montserrat hover:text-classic-green transition-colors">
                    info@thesolitario.com
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-classic-green/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-classic-green" />
                </div>
                <div>
                  <h4 className="text-brand-800 font-gotham text-sm sm:text-base mb-1">Business Hours</h4>
                  <p className="text-brand-600 text-xs sm:text-sm font-montserrat">
                    Mon - Sat: 10:00 AM - 7:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 sm:mt-8 pt-6 border-t border-brand-200">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-white font-gotham uppercase tracking-[0.2em] text-[10px] sm:text-xs md:text-sm rounded-lg bg-classic-green hover:bg-classic-green/90 transition-all duration-500 hover:scale-105 touch-manipulation"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
