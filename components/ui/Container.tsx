import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'default' | 'lg';
  children: React.ReactNode;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', padding = 'default', children, ...props }, ref) => {
    const sizes = {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-7xl',
      xl: 'max-w-[1400px]',
      full: 'max-w-full',
    };

    const paddings = {
      none: '',
      sm: 'px-4',
      default: 'px-4 sm:px-6 lg:px-8',
      lg: 'px-6 sm:px-8 lg:px-12',
    };

    return (
      <div
        ref={ref}
        className={cn('mx-auto', paddings[padding], sizes[size], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

export default Container;


