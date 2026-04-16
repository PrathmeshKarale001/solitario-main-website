'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Mail, Phone } from 'lucide-react';
import { Section, Container } from '@/components/ui';


// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

const sections = [
  {
    title: 'Personal Data We Collect',
    content: `We collect information when you visit our website or make a purchase:

**Automatically Collected Information (Device Data):**
• Browser type, IP address, time zone, and device identifiers
• Pages viewed, referring URLs, and interaction patterns
• Cookies, log files, web beacons, tags, and pixels

**Information You Provide:**
• Name, billing and shipping address, email, and phone number
• Transaction details and communication records
• Payment information (processed through secure third-party gateways)

**Store Visit Data:**
• Store visit logs and CCTV footage for security purposes
• Feedback, survey responses, and customer support interactions`
  },
  {
    title: 'How We Use Your Information',
    content: `We use your personal information to:

• Process and fulfill orders placed through our website
• Send order confirmations, shipping updates, and delivery notifications
• Provide customer support and respond to inquiries
• Send promotional communications (with your consent)
• Improve our website functionality and user experience
• Detect and prevent fraudulent activities
• Comply with legal obligations and regulatory requirements`
  },
  {
    title: 'Information Sharing and Disclosure',
    content: `We do not sell your personal information. We may share information with:

• **Service Providers:** Payment processors, shipping companies, and logistics partners
• **Professional Advisors:** Lawyers, accountants, and consultants
• **Law Enforcement:** When required by law or to protect our rights
• **Business Partners:** With your explicit consent

All third parties are contractually required to maintain confidentiality and use information only for specified purposes.`
  },
  {
    title: 'Data Security and Protection',
    content: `We implement comprehensive security measures:

• **Encryption:** SSL encryption for all data transmission
• **Secure Processing:** PCI-compliant payment processing partners
• **Access Controls:** Limited access on a need-to-know basis
• **Regular Audits:** Security assessments and system updates
• **Secure Storage:** Encrypted data storage with backup systems`
  },
  {
    title: 'Your Rights and Choices',
    content: `You have the right to:

• Access and review your personal information
• Correct inaccurate or incomplete data
• Request deletion of your account and personal data
• Opt-out of marketing communications
• Request a copy of your data in portable format
• Lodge complaints with supervisory authorities

To exercise these rights, contact us at privacy@thesolitario.com`
  },
  {
    title: 'Cookies and Tracking Technologies',
    content: `We use cookies and similar technologies to:

• Remember your preferences and shopping cart contents
• Analyze website traffic and user behavior patterns
• Personalize your browsing experience
• Enable social media features and integrations

You can control cookies through your browser settings. Note that disabling cookies may affect website functionality and your user experience.`
  },
  {
    title: 'Data Retention and Updates',
    content: `**Data Retention:**
We retain personal information as long as necessary to fulfill purposes outlined in this policy or as required by law.

**Policy Updates:**
We may update this Privacy Policy periodically. Material changes will be communicated through:
• Email notifications to registered users
• Prominent notices on our website
• Updated "Last Modified" date on this page

We encourage regular review of this policy for any changes.`
  },
];

export default function PrivacyPolicyPage() {
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
            <Shield className="w-12 h-12 text-bronze-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-white mb-4">
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
                  <h2 className="font-montserrat font-bold text-xl text-brand-800 mb-4">{section.title}</h2>
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
              <h2 className="font-montserrat font-bold text-xl text-brand-800 mb-4">Contact Us</h2>
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
