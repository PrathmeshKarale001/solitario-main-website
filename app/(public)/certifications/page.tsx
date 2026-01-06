'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Award, Shield, CheckCircle, FileCheck, Diamond, Star, Download, Scissors, Palette, Search, Scale } from 'lucide-react';
import { Section, Container } from '@/components/ui';


// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

const certifications = [
  {
    name: 'IGI Certified',
    fullName: 'International Gemological Institute',
    description: 'All our diamonds are certified by IGI, one of the world\'s largest independent gemological laboratories. Each diamond comes with a detailed grading report.',
    features: ['Cut Grade', 'Color Grade', 'Clarity Grade', 'Carat Weight', 'Fluorescence', 'Proportions'],
    logo: '/images/certifications/igi.png',
    pdfLink: '/certifications/IGI  Certification.pdf.pdf',
  },
  {
    name: 'SGLP Certified',
    fullName: 'SGL Precious Metals',
    description: 'Our diamonds are also certified by SGLP, ensuring the highest standards of quality and authenticity. Each piece comes with comprehensive documentation.',
    features: ['Diamond Authentication', 'Quality Verification', 'Detailed Grading Report', 'Authenticity Certificate'],
    logo: '/images/certifications/sgl.png',
    pdfLink: '/certifications/SGLP Certification.pdf',
  },
];

const qualityStandards = [
  {
    icon: Diamond,
    title: 'Diamond Grading',
    description: 'Every diamond is graded using the 4Cs - Cut, Color, Clarity, and Carat weight'
  },
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'Multi-point quality checks at every stage of production'
  },
  {
    icon: FileCheck,
    title: 'Documentation',
    description: 'Complete certification and authenticity documents with every purchase'
  },
  {
    icon: Star,
    title: 'Craftsmanship',
    description: 'Handcrafted by skilled artisans with decades of experience'
  },
];

const fourCs = [
  { icon: Scissors, title: 'Cut', desc: 'Heart of the sparkle — light dances through precision-cut facets for unmatched brilliance.' },
  { icon: Palette, title: 'Colour', desc: 'Near-colourless to colourless grades that showcase pure, luminous beauty.' },
  { icon: Search, title: 'Clarity', desc: 'Minimal inclusions for a captivating, flawless look — refined by technology.' },
  { icon: Scale, title: 'Carat', desc: 'Presence with purpose — select the size that fits your style and values.' },
];

export default function CertificationsPage() {
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
            <Award className="w-16 h-16 text-bronze-gold mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-playfair text-white mb-4">
              Certifications & Quality
            </h1>
            <p className="text-white/80 font-montserrat text-lg">
              Every piece of Solitario jewellery comes with internationally recognized 
              certifications, ensuring authenticity and quality you can trust.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Certifications */}
      <Section variant="light" padding="lg">
        <Container>
          <div className="space-y-8">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-brand border border-brand-100 overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  <div className="p-8 bg-gradient-to-br from-classic-green/5 to-bronze-gold/5 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                        <Award className="w-16 h-16 text-classic-green" />
                      </div>
                      <h3 className="font-playfair text-2xl text-brand-800">{cert.name}</h3>
                      <p className="text-brand-500 font-montserrat text-sm">{cert.fullName}</p>
                    </div>
                  </div>
                  <div className="lg:col-span-2 p-8">
                    <p className="text-brand-600 font-montserrat mb-6 leading-relaxed">
                      {cert.description}
                    </p>
                    <h4 className="font-gotham text-sm uppercase tracking-wider text-brand-500 mb-3">
                      What's Included
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                      {cert.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-classic-green flex-shrink-0" />
                          <span className="text-brand-700 font-montserrat text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    {cert.pdfLink && (
                      <Link
                        href={cert.pdfLink}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-classic-green text-white rounded-lg hover:bg-classic-green/90 transition-colors font-gotham text-xs uppercase tracking-wider"
                      >
                        <Download className="w-4 h-4" />
                        View Certificate
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4Cs */}
      <Section variant="dark" padding="lg" className="bg-brand-800">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-playfair text-white mb-4">
              Understanding the 4Cs
            </h2>
            <p className="text-white/70 font-montserrat max-w-2xl mx-auto">
              The universal standard for evaluating diamond quality
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fourCs.map((c, index) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-full bg-classic-green/10 flex items-center justify-center flex-shrink-0">
                  <c.icon className="w-5 h-5 text-bronze-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-playfair text-bronze-gold mb-1">{c.title}</h3>
                  <p className="text-white/70 text-sm font-montserrat">{c.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Quality Standards */}
      <Section variant="light" padding="lg">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-playfair text-brand-800 mb-4">
              Our Quality Standards
            </h2>
            <p className="text-brand-600 font-montserrat max-w-2xl mx-auto">
              Excellence at every step of the journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {qualityStandards.map((standard, index) => (
              <motion.div
                key={standard.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-brand border border-brand-100 text-center"
              >
                <div className="w-14 h-14 bg-classic-green/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <standard.icon className="w-7 h-7 text-classic-green" />
                </div>
                <h3 className="font-playfair text-lg text-brand-800 mb-2">{standard.title}</h3>
                <p className="text-brand-500 font-montserrat text-sm">{standard.description}</p>
              </motion.div>
            ))}
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
            <Shield className="w-12 h-12 text-bronze-gold mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-playfair text-white mb-4">
              Shop with Confidence
            </h2>
            <p className="text-white/80 font-montserrat mb-8 max-w-xl mx-auto">
              Every Solitario piece comes with complete certification and lifetime warranty
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-classic-green rounded-xl hover:bg-ivory-pearl transition-colors font-gotham uppercase tracking-wider text-sm"
            >
              Explore Collection
            </Link>
          </motion.div>
        </Container>
      </Section>
    </div>
  );
}
