import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-24 flex items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-brand border border-brand-100 rounded-2xl",
          }
        }}
        fallbackRedirectUrl="/account"
      />
    </div>
  );
}
