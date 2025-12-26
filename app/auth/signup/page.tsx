import { SignUp } from '@clerk/nextjs';
import { Section, Container } from '@/components/ui';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-24">
      <Section variant="light" padding="lg">
        <Container>
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-playfair text-brand-800 mb-2">
                Create Account
              </h1>
              <p className="text-brand-500 font-montserrat">
                Join Solitario today
              </p>
            </div>
            
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-brand border border-brand-100 rounded-2xl",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-white border-brand-200 hover:bg-brand-50 text-brand-800 font-montserrat",
                  formButtonPrimary: "bg-classic-green hover:bg-classic-green/90 font-montserrat",
                  formFieldInput: "border-brand-200 focus:border-classic-green focus:ring-classic-green/20 font-montserrat",
                  footerActionLink: "text-classic-green hover:text-classic-green/80",
                }
              }}
            />
          </div>
        </Container>
      </Section>
    </div>
  );
}
