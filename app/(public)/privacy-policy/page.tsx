'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Mail, Phone } from 'lucide-react';
import { Section, Container } from '@/components/ui';


// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

const sections = [
  {
    title: 'Information We Collect',
    content: `We collect information you provide directly to us, such as when you create an account, make a purchase, subscribe to our newsletter, or contact us for support.

This may include:
• Name and contact information (email, phone number, address)
• Payment information (processed securely through our payment partners)
• Order history and preferences
• Communications with our customer service team
• Device and browser information when you visit our website`
  },
  {
    title: 'How We Use Your Information',
    content: `We use the information we collect to:
• Process and fulfill your orders
• Send order confirmations and shipping updates
• Respond to your questions and requests
• Send promotional communications (with your consent)
• Improve our website and services
• Detect and prevent fraud
• Comply with legal obligations`
  },
  {
    title: 'Information Sharing',
    content: `We do not sell your personal information. We may share your information with:
• Service providers who assist in our operations (shipping, payment processing)
• Professional advisors (lawyers, accountants)
• Law enforcement when required by law
• Business partners with your consent

All third parties are required to maintain the confidentiality of your information.`
  },
  {
    title: 'Data Security',
    content: `We implement appropriate technical and organizational measures to protect your personal information, including:
• SSL encryption for all data transmission
• Secure payment processing through PCI-compliant partners
• Regular security audits and updates
• Limited access to personal information on a need-to-know basis
• Secure data storage with encryption at rest`
  },
  {
    title: 'Your Rights',
    content: `You have the right to:
• Access your personal information
• Correct inaccurate information
• Delete your account and personal data
• Opt-out of marketing communications
• Request a copy of your data
• Lodge a complaint with a supervisory authority

To exercise these rights, please contact us at privacy@solitario.com`
  },
  {
    title: 'Cookies',
    content: `We use cookies and similar technologies to:
• Remember your preferences
• Analyze website traffic
• Personalize your experience
• Enable social media features

You can control cookies through your browser settings. Note that disabling cookies may affect website functionality.`
  },
  {
    title: 'Updates to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.

We encourage you to review this policy periodically for any changes.`
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-20">
      {/* Hero */}
      <section className="bg-classic-green py-16 md:py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Shield className="w-12 h-12 text-bronze-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-playfair text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-white/80 font-montserrat">
              Last updated: December 2024
            </p>
          </motion.div>
        </Container>
      </section>

      <Section variant="light" padding="lg">
        <Container>
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-brand border border-brand-100 p-8 mb-8"
            >
              <p className="text-brand-600 font-montserrat leading-relaxed">
                At Solitario, we are committed to protecting your privacy and ensuring the security 
                of your personal information. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you visit our website or make a purchase.
              </p>
            </motion.div>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-brand border border-brand-100 p-6"
                >
                  <h2 className="font-playfair text-xl text-brand-800 mb-4">{section.title}</h2>
                  <div className="text-brand-600 font-montserrat text-sm leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 bg-classic-green/5 rounded-2xl p-6 border border-classic-green/20"
            >
              <h2 className="font-playfair text-xl text-brand-800 mb-4">Contact Us</h2>
              <p className="text-brand-600 font-montserrat text-sm mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-brand-700 font-montserrat text-sm">
                  <Mail className="w-4 h-4 text-classic-green" />
                  privacy@solitario.com
                </p>
                <p className="flex items-center gap-2 text-brand-700 font-montserrat text-sm">
                  <Phone className="w-4 h-4 text-classic-green" />
                  +91 22 4567 8900
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
