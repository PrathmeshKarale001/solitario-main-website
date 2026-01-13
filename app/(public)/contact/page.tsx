import { Section, Container, Button } from '@/components/ui';
import { Mail, Phone, MapPin } from 'lucide-react';

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
            {/* Contact Form */}
            <div>
              <h2 className="heading-md mb-6">Send Us a Message</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bronze-gold"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bronze-gold"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bronze-gold"
                    required
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
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
                    <p className="text-gray-600">info@solitario.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-bronze-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-bronze-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Phone</h3>
                    <p className="text-gray-600">+91 XXX XXX XXXX</p>
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


