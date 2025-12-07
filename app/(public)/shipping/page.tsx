'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Truck, Clock, MapPin, Package, Shield, Gift, CheckCircle } from 'lucide-react';
import { Section, Container } from '@/components/ui';

const shippingOptions = [
  {
    name: 'Standard Shipping',
    time: '5-7 Business Days',
    price: '₹500',
    freeAbove: '₹50,000',
    icon: Truck,
  },
  {
    name: 'Express Shipping',
    time: '2-3 Business Days',
    price: '₹1,000',
    freeAbove: '₹1,00,000',
    icon: Clock,
  },
  {
    name: 'Same Day Delivery',
    time: 'Within 24 Hours',
    price: '₹2,000',
    freeAbove: null,
    note: 'Available in select cities',
    icon: Package,
  },
];

const features = [
  {
    icon: Shield,
    title: 'Fully Insured',
    description: 'All shipments are fully insured against loss or damage during transit'
  },
  {
    icon: Package,
    title: 'Secure Packaging',
    description: 'Tamper-proof packaging with discreet labeling for your privacy'
  },
  {
    icon: MapPin,
    title: 'Real-time Tracking',
    description: 'Track your order every step of the way with live updates'
  },
  {
    icon: Gift,
    title: 'Gift Packaging',
    description: 'Complimentary luxury gift packaging on all orders'
  },
];

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 
  'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Kochi'
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-20">
      {/* Hero */}
      <section className="bg-classic-green py-16 md:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Truck className="w-12 h-12 text-bronze-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-aguila text-white mb-4">
              Shipping & Delivery
            </h1>
            <p className="text-white/80 font-montserrat text-lg">
              Fast, secure, and insured delivery across India
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Shipping Options */}
      <Section variant="light" padding="lg">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-aguila text-brand-800 mb-4">
              Shipping Options
            </h2>
            <p className="text-brand-600 font-montserrat">
              Choose the delivery speed that works for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {shippingOptions.map((option, index) => (
              <motion.div
                key={option.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-brand border border-brand-100 p-6 text-center"
              >
                <div className="w-14 h-14 bg-classic-green/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <option.icon className="w-7 h-7 text-classic-green" />
                </div>
                <h3 className="font-didot text-xl text-brand-800 mb-2">{option.name}</h3>
                <p className="text-bronze-gold font-gotham text-lg mb-1">{option.time}</p>
                <p className="text-brand-600 font-montserrat mb-3">{option.price}</p>
                {option.freeAbove && (
                  <p className="text-classic-green font-montserrat text-sm">
                    Free on orders above {option.freeAbove}
                  </p>
                )}
                {option.note && (
                  <p className="text-brand-400 font-montserrat text-xs mt-2">{option.note}</p>
                )}
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Features */}
      <Section variant="light" padding="lg" className="bg-brand-50">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-white rounded-xl shadow-brand flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-classic-green" />
                </div>
                <h3 className="font-didot text-lg text-brand-800 mb-2">{feature.title}</h3>
                <p className="text-brand-500 font-montserrat text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Delivery Information */}
      <Section variant="light" padding="lg">
        <Container>
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-brand border border-brand-100 p-8"
            >
              <h2 className="font-didot text-2xl text-brand-800 mb-6">Delivery Information</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-gotham text-sm uppercase tracking-wider text-brand-500 mb-2">
                    Processing Time
                  </h3>
                  <p className="text-brand-600 font-montserrat text-sm">
                    Orders are processed within 1-2 business days. Custom or made-to-order items 
                    may take 7-14 business days to prepare before shipping.
                  </p>
                </div>

                <div>
                  <h3 className="font-gotham text-sm uppercase tracking-wider text-brand-500 mb-2">
                    Delivery Partners
                  </h3>
                  <p className="text-brand-600 font-montserrat text-sm">
                    We partner with trusted courier services including Blue Dart, FedEx, and DTDC 
                    to ensure safe and timely delivery of your precious jewellery.
                  </p>
                </div>

                <div>
                  <h3 className="font-gotham text-sm uppercase tracking-wider text-brand-500 mb-2">
                    Signature Required
                  </h3>
                  <p className="text-brand-600 font-montserrat text-sm">
                    All deliveries require a signature upon receipt. Please ensure someone is 
                    available to receive the package at the delivery address.
                  </p>
                </div>

                <div>
                  <h3 className="font-gotham text-sm uppercase tracking-wider text-brand-500 mb-2">
                    International Shipping
                  </h3>
                  <p className="text-brand-600 font-montserrat text-sm">
                    We ship to select international destinations. International orders may be 
                    subject to customs duties and taxes, which are the responsibility of the recipient.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Same Day Cities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 bg-bronze-gold/5 rounded-2xl p-6 border border-bronze-gold/20"
            >
              <h3 className="font-didot text-lg text-brand-800 mb-4">
                Same Day Delivery Available In
              </h3>
              <div className="flex flex-wrap gap-2">
                {cities.map((city) => (
                  <span key={city} className="px-3 py-1 bg-white rounded-full text-brand-600 font-montserrat text-sm border border-brand-200">
                    {city}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section variant="light" padding="lg">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-classic-green to-teal rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-aguila text-white mb-4">
              Have Questions About Shipping?
            </h2>
            <p className="text-white/80 font-montserrat mb-8 max-w-xl mx-auto">
              Our customer service team is here to help
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-classic-green rounded-xl hover:bg-ivory-pearl transition-colors font-gotham uppercase tracking-wider text-sm"
            >
              Contact Us
            </Link>
          </motion.div>
        </Container>
      </Section>
    </div>
  );
}
