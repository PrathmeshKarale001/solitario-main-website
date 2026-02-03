// Server component - static content
import { FileText, Mail, Phone } from 'lucide-react';
import { Section, Container } from '@/components/ui';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing and using the Solitario website (thesolitario.com), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or services.

These terms apply to all visitors, users, and customers of our website.`
  },
  {
    title: '2. Products and Pricing',
    content: `• All products displayed on our website are subject to availability
• Prices are listed in Indian Rupees (INR) and include applicable taxes unless otherwise stated
• We reserve the right to modify prices without prior notice
• Product images are for illustration purposes; actual products may vary slightly
• Diamond specifications are as per IGI certification`
  },
  {
    title: '3. Orders and Payment',
    content: `• By placing an order, you are making an offer to purchase the product(s)
• Order confirmation does not constitute acceptance; acceptance occurs when we ship the product
• We accept major credit/debit cards, UPI, net banking, and EMI options
• Payment must be received in full before dispatch
• We reserve the right to cancel orders due to pricing errors, stock issues, or suspected fraud`
  },
  {
    title: '4. Shipping and Delivery',
    content: `• We ship to addresses within India and select international locations
• Delivery times are estimates and not guaranteed
• Risk of loss passes to you upon delivery to the carrier
• You are responsible for providing accurate shipping information
• Additional customs duties may apply for international orders`
  },
  {
    title: '5. Returns and Refunds',
    content: `• Returns are accepted within 15 days of delivery for unworn items in original condition
• Custom or personalized items cannot be returned unless defective
• Refunds are processed within 5-7 business days after receiving the return
• Original shipping charges are non-refundable
• Items must be returned with all original packaging and certificates`
  },
  {
    title: '6. Warranty',
    content: `• All Solitario jewellery comes with a lifetime warranty against manufacturing defects
• Warranty does not cover normal wear and tear, accidental damage, or unauthorized repairs
• Warranty claims must be accompanied by original purchase documentation
• We reserve the right to repair or replace defective items at our discretion`
  },
  {
    title: '7. Intellectual Property',
    content: `• All content on this website (images, text, logos, designs) is owned by Solitario
• You may not reproduce, distribute, or use our content without written permission
• Our trademarks may not be used without authorization
• User-submitted content grants us a license to use it for marketing purposes`
  },
  {
    title: '8. User Accounts',
    content: `• You are responsible for maintaining the confidentiality of your account
• You must provide accurate and complete information
• You are responsible for all activities under your account
• We reserve the right to suspend or terminate accounts for violations
• You must notify us immediately of any unauthorized use`
  },
  {
    title: '9. Limitation of Liability',
    content: `• Our liability is limited to the purchase price of the product
• We are not liable for indirect, incidental, or consequential damages
• We do not guarantee uninterrupted or error-free website operation
• We are not responsible for third-party website content or services`
  },
  {
    title: '10. Governing Law',
    content: `• These terms are governed by the laws of India
• Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra
• If any provision is found invalid, other provisions remain in effect`
  },
  {
    title: '11. Changes to Terms',
    content: `• We may modify these terms at any time without prior notice
• Continued use of the website constitutes acceptance of modified terms
• We encourage you to review these terms periodically`
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-20">
      {/* Hero */}
      <section className="bg-classic-green py-10 md:py-14">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <FileText className="w-12 h-12 text-bronze-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-white mb-4">
              Terms & Conditions
            </h1>
            <p className="text-white/80 font-montserrat">
              Last updated: December 2024
            </p>
          </div>
        </Container>
      </section>

      <Section variant="light" padding="lg">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-brand border border-brand-100 p-8 mb-8">
              <p className="text-brand-600 font-montserrat leading-relaxed">
                Please read these Terms and Conditions carefully before using the Solitario website 
                or making a purchase. These terms constitute a legally binding agreement between 
                you and Solitario Jewellery Pvt. Ltd.
              </p>
            </div>

            <div className="space-y-6">
              {sections.map((section) => (
                <div
                  key={section.title}
                  className="bg-white rounded-2xl shadow-brand border border-brand-100 p-6"
                >
                  <h2 className="font-montserrat font-bold text-lg text-brand-800 mb-3">{section.title}</h2>
                  <div className="text-brand-600 font-montserrat text-sm leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="mt-8 bg-classic-green/5 rounded-2xl p-6 border border-classic-green/20">
              <h2 className="font-montserrat font-bold text-xl text-brand-800 mb-4">Questions?</h2>
              <p className="text-brand-600 font-montserrat text-sm mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-brand-700 font-montserrat text-sm">
                  <Mail className="w-4 h-4 text-classic-green" />
                  legal@solitario.com
                </p>
                <p className="flex items-center gap-2 text-brand-700 font-montserrat text-sm">
                  <Phone className="w-4 h-4 text-classic-green" />
                  +91 22 4567 8900
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
