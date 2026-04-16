'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Truck, Clock, MapPin, Package, Shield, Gift, CheckCircle } from 'lucide-react';
import { Section, Container } from '@/components/ui';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

const shippingOptions = [
  {
    name: 'Domestic Shipping (India)',
    time: '5-7 Days',
    price: 'Included',
    freeAbove: null,
    icon: Truck,
    note: 'Made-to-order items may take longer'
  },
  {
    name: 'Gift Packaging',
    time: 'Included with all orders',
    price: 'FREE',
    freeAbove: null,
    note: 'Personalized gift messages available',
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
    <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white">
      {/* Hero */}
      <section className="relative w-full aspect-[4/5] md:aspect-[16/7] max-h-[85vh] md:max-h-[700px] bg-classic-green flex items-center justify-center pt-24 md:pt-32">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Truck className="w-12 h-12 text-bronze-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-white mb-4">
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
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-brand-800 mb-4">
              Shipping Services
            </h2>
            <p className="text-brand-600 font-montserrat">
              Fast, secure, and insured delivery across India
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
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
                <h3 className="font-montserrat font-bold text-xl text-brand-800 mb-2">{option.name}</h3>
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
                <h3 className="font-montserrat font-bold text-lg text-brand-800 mb-2">{feature.title}</h3>
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
              <h2 className="font-montserrat font-bold text-2xl text-brand-800 mb-6">Delivery Information</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-gotham text-sm uppercase tracking-wider text-brand-500 mb-2">
                    Domestic Shipping (India)
                  </h3>
                  <p className="text-brand-600 font-montserrat text-sm">
                    <strong>Delivery Time:</strong> 5-7 Days<br />
                    <strong>Made-to-order items:</strong> May take additional time<br />
                    All orders are fully insured and handled through trusted third-party courier partners.
                  </p>
                </div>

                <div>
                  <h3 className="font-gotham text-sm uppercase tracking-wider text-brand-500 mb-2">
                    Packaging & Presentation
                  </h3>
                  <p className="text-brand-600 font-montserrat text-sm">
                    Every item is delivered in durable, tamper-proof packaging in exclusive Solitario boxes
                    with all relevant certificates. Free gift packaging and personalized messages available.
                  </p>
                </div>

                <div>
                  <h3 className="font-gotham text-sm uppercase tracking-wider text-brand-500 mb-2">
                    Delivery Requirements
                  </h3>
                  <p className="text-brand-600 font-montserrat text-sm">
                    All deliveries require signature upon receipt. Please ensure someone is available
                    to receive high-value packages and inspect immediately upon delivery.
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
              <h3 className="font-montserrat font-bold text-lg text-brand-800 mb-4">
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
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-white mb-4">
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
