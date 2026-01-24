'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

// Error Boundary for graceful error handling
// Audit Recommendation: 2.1 - Add Error Boundaries

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-playfair font-semibold text-brand-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-brand-600 mb-6">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-classic-green text-white px-6 py-3 rounded-lg font-medium hover:bg-classic-green/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Specific error boundaries for different sections
export function ProductErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-8 text-center">
          <p className="text-brand-600">Unable to load product. Please try again.</p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

export function CartErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-8 text-center">
          <p className="text-brand-600">Unable to load cart. Please refresh the page.</p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
