'use client';

// Skip Link Component for Accessibility
// Audit Recommendation: 8.2 - Add skip links

interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
}

export default function SkipLink({ 
  href = '#main-content', 
  children = 'Skip to content' 
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className="
        sr-only focus:not-sr-only
        focus:fixed focus:top-4 focus:left-4 focus:z-[9999]
        focus:px-4 focus:py-2
        focus:bg-classic-green focus:text-white
        focus:rounded-lg focus:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-classic-green
        font-gotham text-sm uppercase tracking-wider
        transition-all duration-200
      "
    >
      {children}
    </a>
  );
}

// Multiple skip links for complex pages
export function SkipLinks() {
  return (
    <div className="skip-links">
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#navigation">Skip to navigation</SkipLink>
      <SkipLink href="#footer">Skip to footer</SkipLink>
    </div>
  );
}
