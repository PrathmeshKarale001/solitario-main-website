import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: 'light' | 'dark' | 'teal';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = 'light', padding = 'md', children, ...props }, ref) => {
    const variants = {
      light: 'bg-ivory-pearl',
      dark: 'bg-classic-green text-ivory-pearl',
      teal: 'bg-teal text-ivory-pearl',
    };
    
    const paddings = {
      none: '',
      sm: 'py-8 md:py-12',
      md: 'py-16 md:py-24',
      lg: 'py-24 md:py-32',
    };

    return (
      <section
        ref={ref}
        className={cn(variants[variant], paddings[padding], className)}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';

export default Section;


