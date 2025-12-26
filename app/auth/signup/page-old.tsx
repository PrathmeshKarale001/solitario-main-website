'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Section, Container, Button, Input } from '@/components/ui';

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    try {
      // Create customer via API route
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.details || errorData.error || 'Signup failed';
        throw new Error(errorMessage);
      }

      setSuccess(true);
      
      // Auto-login after successful signup
      setTimeout(async () => {
        try {
          const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
          });
          
          if (result?.error) {
            console.error('Auto-login failed:', result.error);
            // Redirect to login page with error
            window.location.href = '/auth/login?error=CredentialsSignin&callbackUrl=/account';
          } else if (result?.url) {
            window.location.href = result.url;
          } else {
            // Fallback redirect
            window.location.href = '/account';
          }
        } catch (error) {
          console.error('Auto-login error:', error);
          window.location.href = '/auth/login?callbackUrl=/account';
        }
      }, 1500);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    signIn('google', { callbackUrl: '/account' });
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
                  <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-playfair text-heading-xl text-brand-800 mb-2">Account Created!</h2>
                <p className="text-brand-600 font-montserrat text-body-md">
                  Redirecting you to your account...
                </p>
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
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-playfair text-display-sm text-brand-800 mb-3">Create Account</h1>
              <p className="text-brand-600 font-montserrat text-body-md">
                Join Solitario for exclusive benefits and offers
              </p>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-brand mb-6 font-montserrat text-body-sm">
                {formError}
              </div>
            )}

            {/* Signup Form */}
            <div className="bg-white rounded-brand-xl p-8 shadow-brand border border-brand-100">
              {/* Google Sign Up */}
              <button
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-brand-200 hover:border-bronze-gold/50 text-brand-700 px-6 py-3 rounded-brand font-montserrat transition-all duration-300 mb-6"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-brand-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-brand-500 font-montserrat">or sign up with email</span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="text"
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                    leftIcon={<User className="w-5 h-5" />}
                  />
                  <Input
                    type="text"
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>

                <Input
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  leftIcon={<Mail className="w-5 h-5" />}
                />

                <div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    hint="Minimum 8 characters"
                    leftIcon={<Lock className="w-5 h-5" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-brand-400 hover:text-brand-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    }
                  />
                </div>

                <Input
                  type={showPassword ? 'text' : 'password'}
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  leftIcon={<Lock className="w-5 h-5" />}
                />

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 rounded border-brand-300 text-bronze-gold focus:ring-bronze-gold"
                  />
                  <span className="text-body-sm text-brand-600 font-montserrat">
                    I agree to the{' '}
                    <Link href="/terms" className="text-teal hover:text-teal-dark transition-colors">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-teal hover:text-teal-dark transition-colors">Privacy Policy</Link>
                  </span>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              {/* Sign In Link */}
              <p className="text-center text-brand-600 font-montserrat mt-6">
                Already have an account?{' '}
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
