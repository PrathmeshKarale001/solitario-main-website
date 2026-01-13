import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'teal';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-gotham uppercase tracking-luxury transition-all duration-500 rounded-brand disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-bronze-gold/50 focus:ring-offset-2';
    
    const variants = {
      // Primary - Bronze Gold (main CTAs)
      primary: 'bg-bronze-gold hover:bg-soft-bronze text-white border border-bronze-gold/30 shadow-brand hover:shadow-brand-lg hover:shadow-gold-glow',
      // Secondary - Classic Green (secondary actions)
      secondary: 'bg-classic-green hover:bg-classic-green/90 text-ivory-pearl shadow-brand hover:shadow-brand-lg',
      // Outline - Bronze border (tertiary actions)
      outline: 'border-2 border-bronze-gold text-bronze-gold hover:bg-bronze-gold hover:text-white bg-transparent',
      // Ghost - Text only (minimal actions)
      ghost: 'text-bronze-gold hover:bg-bronze-gold/10',
      // Teal - Accent CTA
      teal: 'bg-teal hover:bg-teal-dark text-white shadow-brand hover:shadow-brand-lg',
    };
    
    const sizes = {
      sm: 'px-6 py-2.5 text-ui-sm',
      md: 'px-10 py-4 text-ui',
      lg: 'px-12 py-5 text-ui',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;


