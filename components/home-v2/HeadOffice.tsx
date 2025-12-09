'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function HeadOffice() {
  return (
    <section className="bg-gray-50 py-24 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/3"
          >
            <h3 className="font-didot text-3xl text-gray-900 mb-6">Contact Us</h3>
            <p className="text-gray-500 font-montserrat text-sm leading-relaxed mb-8">
              Our concierge team is available to assist you with any inquiries regarding our collections or services.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8"
          >
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-bronze-gold">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-didot text-gray-900 mb-1">Call Us</h4>
                <p className="font-gotham text-xs text-gray-500">+1 (800) 123-4567</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-bronze-gold">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-didot text-gray-900 mb-1">Email Us</h4>
                <p className="font-gotham text-xs text-gray-500">concierge@solitario.com</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-bronze-gold">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-didot text-gray-900 mb-1">Visit Us</h4>
                <p className="font-gotham text-xs text-gray-500">123 Luxury Lane, New York, NY 10001</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-bronze-gold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-didot text-gray-900 mb-1">Opening Hours</h4>
                <p className="font-gotham text-xs text-gray-500">Mon - Sat: 10am - 8pm</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
