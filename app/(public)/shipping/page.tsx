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
    time: '48-72 Hours (In-stock)',
    price: 'FREE',
    freeAbove: 'All orders',
    icon: Truck,
    note: 'Made-to-order: Up to 25 business days'
  },
  {
    name: 'International Shipping',
    time: '7-21 Business Days',
    price: 'Calculated at checkout',
    freeAbove: null,
    icon: Clock,
    note: 'Based on weight, value, and destination'
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
            <h1 className="text-4xl md:text-5xl font-playfair text-white mb-4">
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
            <h2 className="text-3xl md:text-4xl font-playfair text-brand-800 mb-4">
              Shipping Services
            </h2>
            <p className="text-brand-600 font-montserrat">
              Fast, secure, and insured delivery worldwide
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
                <h3 className="font-playfair text-xl text-brand-800 mb-2">{option.name}</h3>
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
                <h3 className="font-playfair text-lg text-brand-800 mb-2">{feature.title}</h3>
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
              <h2 className="font-playfair text-2xl text-brand-800 mb-6">Delivery Information</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-gotham text-sm uppercase tracking-wider text-brand-500 mb-2">
                    Domestic Shipping (India)
                  </h3>
                  <p className="text-brand-600 font-montserrat text-sm">
                    <strong>Free Shipping:</strong> We offer FREE shipping on all orders within India<br/>
                    <strong>In-stock items:</strong> 48–72 hours<br/>
                    <strong>Made-to-order items:</strong> Up to 25 business days<br/>
                    All orders are fully insured and handled through trusted third-party courier partners.
                  </p>
                </div>

                <div>
                  <h3 className="font-gotham text-sm uppercase tracking-wider text-brand-500 mb-2">
                    International Shipping
                  </h3>
                  <p className="text-brand-600 font-montserrat text-sm">
                    We proudly ship to selected countries abroad.<br/>
                    <strong>Delivery Time:</strong> 7–21 business days (depending on destination and customs)<br/>
                    <strong>Shipping Charges:</strong> Calculated at checkout based on weight, value, and destination<br/>
                    All international shipments are fully insured. Customers are responsible for customs duties.
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
              <h3 className="font-playfair text-lg text-brand-800 mb-4">
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
            <h2 className="text-2xl md:text-3xl font-playfair text-white mb-4">
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
