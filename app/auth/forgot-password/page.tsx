'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import { Section, Container, Button } from '@/components/ui';
import Input from '@/components/ui/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');

    if (!email) {
      setFormError('Email is required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }

      setSuccess(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-24">
        <Section variant="light" padding="lg">
          <Container>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center"
            >
              <div className="bg-white rounded-brand-xl p-8 shadow-brand border border-brand-100">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-success" />
                </div>
                <h2 className="font-playfair text-heading-xl text-brand-800 mb-2">Check Your Email</h2>
                <p className="text-brand-600 font-montserrat text-body-md mb-6">
                  If an account exists with {email}, you will receive password reset instructions shortly.
                </p>
                <p className="text-brand-500 font-montserrat text-sm mb-6">
                  Don't forget to check your spam folder!
                </p>
                <Link href="/auth/login">
                  <Button variant="primary" size="lg" className="w-full">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </motion.div>
          </Container>
        </Section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-pearl to-white pt-24">
      <Section variant="light" padding="lg">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto"
          >
            {/* Back to Login */}
            <Link 
              href="/auth/login" 
              className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-800 font-montserrat text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-playfair text-display-sm text-brand-800 mb-3">Forgot Password?</h1>
              <p className="text-brand-600 font-montserrat text-body-md">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-brand mb-6 font-montserrat text-body-sm">
                {formError}
              </div>
            )}

            {/* Forgot Password Form */}
            <div className="bg-white rounded-brand-xl p-8 shadow-brand border border-brand-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  leftIcon={<Mail className="w-5 h-5" />}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
                </Button>
              </form>

              {/* Sign In Link */}
              <p className="text-center text-brand-600 font-montserrat mt-6">
                Remember your password?{' '}
                <Link href="/auth/login" className="text-teal hover:text-teal-dark font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </Container>
      </Section>
    </div>
  );
}
