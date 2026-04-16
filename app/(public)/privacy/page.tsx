import { Shield, Lock } from 'lucide-react';
import { Section, Container } from '@/components/ui';

// Server component - static content, no client-side interactivity needed
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white">
      {/* Hero */}
      <section className="relative w-full aspect-[4/5] md:aspect-[16/7] max-h-[85vh] md:max-h-[700px] bg-classic-green flex items-center justify-center pt-24 md:pt-32">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <Shield className="w-12 h-12 text-bronze-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-white/80 font-montserrat text-lg">
              Your privacy and security are our top priorities
            </p>
          </div>
        </Container>
      </section>

      <Section variant="light" padding="lg">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-brand border border-brand-100 p-8 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-classic-green/10 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-classic-green" />
                </div>
                <div>
                  <h2 className="font-montserrat font-bold text-2xl text-brand-800">Our Commitment</h2>
                  <p className="text-brand-500 font-montserrat text-sm">Last updated: December 2024</p>
                </div>
              </div>
              <p className="text-brand-600 font-montserrat leading-relaxed">
                At Solitario, we are committed to protecting your personal information and your right to privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you visit our website or make a purchase.
              </p>
            </div>

            <div className="prose prose-brand max-w-none font-montserrat text-brand-600">
              <p>
                Privacy policy content will be added here. This will include detailed information about:
              </p>
              <ul>
                <li>Information we collect</li>
                <li>How we use your information</li>
                <li>How we share your information</li>
                <li>Your privacy rights and choices</li>
                <li>Security of your personal information</li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

