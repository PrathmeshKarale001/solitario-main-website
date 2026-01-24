import { Section, Container } from '@/components/ui';
import { Mail, Phone, MapPin } from 'lucide-react';
import ContactForm from '@/components/forms/ContactForm';

export default function ContactPage() {
  return (
    <div>
      <Section variant="dark" padding="md">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="heading-xl mb-6">Get In Touch</h1>
            <p className="text-base md:text-xl text-ivory-pearl/90">
              Have questions about our lab-grown diamond jewellery? 
              We'd love to hear from you.
            </p>
          </div>
        </Container>
      </Section>

      <Section variant="light" padding="md">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form with Zod Validation */}
            <div>
              <h2 className="heading-md mb-6">Send Us a Message</h2>
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="heading-md mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-bronze-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-bronze-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Email</h3>
                    <p className="text-gray-600">paymentdesk@thesolitario.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-bronze-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-bronze-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Phone</h3>
                    <p className="text-gray-600">+91 98765 43210</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-bronze-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-bronze-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Locations</h3>
                    <p className="text-gray-600">India | Spain | Malaysia | Dubai</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}


