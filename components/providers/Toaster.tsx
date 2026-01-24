'use client';

import { Toaster as SonnerToaster } from 'sonner';

// Sonner Toast Provider
// Audit Recommendation: 5.2 - Implement Sonner for Toast Notifications

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          fontFamily: 'var(--font-montserrat)',
        },
        className: 'sonner-toast',
        descriptionClassName: 'sonner-toast-description',
      }}
      theme="light"
    />
  );
}

// Re-export toast function for convenience
export { toast } from 'sonner';
