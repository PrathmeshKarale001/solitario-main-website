import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'none', children, ...props }, ref) => {
    const baseStyles = 'rounded-brand-lg overflow-hidden transition-all duration-500';
    
    const variants = {
      // Default - Clean white
      default: 'bg-white',
      // Elevated - With brand shadow
      elevated: 'bg-white shadow-brand hover:shadow-brand-lg',
      // Outlined - With brand border
      outlined: 'bg-white border border-brand-200 hover:border-bronze-gold/50',
      // Glass - Frosted glass effect
      glass: 'bg-white/80 backdrop-blur-lg border border-brand-200/50',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], paddings[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;


