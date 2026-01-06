'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Leaf, Droplets, Wind, Recycle, Heart, Globe, TreePine, Zap } from 'lucide-react';
import { Section, Container } from '@/components/ui';


// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

const stats = [
  { value: '99%', label: 'Less Water Usage', icon: Droplets },
  { value: '95%', label: 'Lower Carbon Footprint', icon: Wind },
  { value: '0', label: 'Mining Required', icon: TreePine },
  { value: '100%', label: 'Conflict-Free', icon: Heart },
];

const initiatives = [
  {
    icon: Recycle,
    title: 'Sustainable Packaging',
    description: 'All our packaging is made from recycled and recyclable materials. We use soy-based inks and eliminate single-use plastics.'
  },
  {
    icon: Zap,
    title: 'Renewable Energy',
    description: 'Our lab facilities are powered by renewable energy sources, significantly reducing our carbon footprint.'
  },
  {
    icon: Globe,
    title: 'Carbon Offset Program',
    description: 'We partner with certified organizations to offset our remaining carbon emissions through reforestation projects.'
  },
  {
    icon: Heart,
    title: 'Ethical Sourcing',
    description: 'Every material in our jewellery is ethically sourced, from recycled gold to conflict-free gemstones.'
  },
];

const commitments = [
  'Carbon neutral operations by 2025',
  '100% recycled precious metals by 2024',
  'Zero waste to landfill by 2026',
  'Plastic-free packaging by 2024',
  'Support for 10,000 trees planted annually',
  'Fair wages and safe working conditions',
];

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-20">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-classic-green via-teal to-classic-green py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/images/patterns/leaves.svg')] opacity-5" />
        </div>
        
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto relative z-10"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-bronze-gold text-sm font-montserrat mb-6">
              <Leaf className="w-4 h-4" />
              Our Commitment
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-white mb-6">
              Sustainability
            </h1>
            <p className="text-white/80 font-montserrat text-lg md:text-xl max-w-2xl mx-auto">
              Luxury that doesn't cost the Earth. We're committed to creating beautiful 
              jewellery while protecting our planet for future generations.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Stats */}
      <Section variant="light" padding="lg" className="-mt-12 relative z-10">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-brand border border-brand-100 text-center"
              >
                <stat.icon className="w-8 h-8 text-classic-green mx-auto mb-3" />
                <p className="text-3xl md:text-4xl font-playfair text-brand-800 mb-1">{stat.value}</p>
                <p className="text-brand-500 font-montserrat text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why Lab Grown */}
      <Section variant="light" padding="lg">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-playfair text-brand-800 mb-6">
                The Sustainable Choice
              </h2>
              <p className="text-brand-600 font-montserrat mb-6 leading-relaxed">
                Traditional diamond mining has significant environmental impacts - from habitat 
                destruction to water pollution and carbon emissions. Lab grown diamonds offer 
                a beautiful alternative that's kinder to our planet.
              </p>
              <p className="text-brand-600 font-montserrat mb-6 leading-relaxed">
                By choosing lab grown diamonds, you're not just getting a stunning piece of 
                jewellery - you're making a conscious choice to reduce your environmental 
                footprint without compromising on quality or beauty.
              </p>
              <Link
                href="/lab-grown-diamonds"
                className="inline-flex items-center gap-2 text-classic-green hover:text-classic-green/80 font-montserrat transition-colors"
              >
                Learn more about lab grown diamonds
                <span>→</span>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-classic-green/10 to-teal/10 rounded-3xl flex items-center justify-center">
                <div className="text-center p-8">
                  <Leaf className="w-24 h-24 text-classic-green/30 mx-auto mb-4" />
                  <p className="text-brand-400 font-montserrat">Sustainability Image</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-bronze-gold text-white p-6 rounded-2xl shadow-lg">
                <p className="text-3xl font-playfair">30-40%</p>
                <p className="text-sm font-montserrat opacity-80">More affordable</p>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Initiatives */}
      <Section variant="dark" padding="lg" className="bg-brand-800">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-playfair text-white mb-4">
              Our Green Initiatives
            </h2>
            <p className="text-white/70 font-montserrat max-w-2xl mx-auto">
              Beyond lab grown diamonds, we're committed to sustainability across our entire operation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initiatives.map((initiative, index) => (
              <motion.div
                key={initiative.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-classic-green/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <initiative.icon className="w-6 h-6 text-bronze-gold" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg text-white mb-2">{initiative.title}</h3>
                    <p className="text-white/60 font-montserrat text-sm">{initiative.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Commitments */}
      <Section variant="light" padding="lg">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-playfair text-brand-800 mb-4">
                Our Commitments
              </h2>
              <p className="text-brand-600 font-montserrat">
                Measurable goals we're working towards
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commitments.map((commitment, index) => (
                <motion.div
                  key={commitment}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-brand-100 shadow-sm"
                >
                  <div className="w-6 h-6 bg-classic-green rounded-full flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-montserrat text-brand-700 text-sm">{commitment}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
            <Leaf className="w-12 h-12 text-bronze-gold mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-playfair text-white mb-4">
              Join the Sustainable Luxury Movement
            </h2>
            <p className="text-white/80 font-montserrat mb-8 max-w-xl mx-auto">
              Every purchase supports our mission to create a more sustainable future
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-classic-green rounded-xl hover:bg-ivory-pearl transition-colors font-gotham uppercase tracking-wider text-sm"
            >
              Shop Sustainably
            </Link>
          </motion.div>
        </Container>
      </Section>
    </div>
  );
}
