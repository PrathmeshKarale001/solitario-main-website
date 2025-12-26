'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Section, Container, Button } from '@/components/ui';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration. Check your environment variables.',
    AccessDenied: 'Access denied. You do not have permission to sign in.',
    Verification: 'The verification token has expired or has already been used.',
    Default: 'An error occurred during authentication.',
    OAuthSignin: 'Error in constructing an authorization URL.',
    OAuthCallback: 'Error in handling the response from an OAuth provider.',
    OAuthCreateAccount: 'Could not create OAuth account.',
    EmailCreateAccount: 'Could not create email account.',
    Callback: 'Error in the OAuth callback handler.',
    OAuthAccountNotLinked: 'The email on the account is already in use with another provider.',
    SessionRequired: 'Please sign in to access this page.',
  };

  const errorMessage = errorMessages[error || ''] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white flex items-center justify-center pt-24">
      <Section variant="light" padding="lg">
        <Container>
          <div className="max-w-md mx-auto text-center">
            <h1 className="font-playfair text-display-sm text-brand-800 mb-4">Authentication Error</h1>
            <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-brand mb-6">
              <p className="font-montserrat text-body-sm">{errorMessage}</p>
              {error && (
                <p className="font-montserrat text-body-xs mt-2 opacity-75">Error code: {error}</p>
              )}
            </div>
            <div className="space-y-3">
              <Link href="/auth/login">
                <Button variant="primary" className="w-full">
                  Try Again
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
