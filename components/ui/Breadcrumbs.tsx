'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbSchema } from '@/components/seo/JsonLd';

// Breadcrumbs Component for SEO and Navigation
// Audit Recommendation: 9.2 - Add breadcrumbs

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  showSchema?: boolean;
}

export default function Breadcrumbs({
  items,
  className = '',
  showHome = true,
  showSchema = true,
}: BreadcrumbsProps) {
  const allItems = showHome
    ? [{ label: 'Home', href: '/' }, ...items]
    : items;

  const schemaItems = allItems.map((item) => ({
    name: item.label,
    url: `https://www.thesolitario.com${item.href}`,
  }));

  return (
    <>
      {showSchema && <BreadcrumbSchema items={schemaItems} />}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center space-x-1 text-sm font-montserrat ${className}`}
      >
        <ol className="flex items-center flex-wrap" itemScope itemType="https://schema.org/BreadcrumbList">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            const isFirst = index === 0;

            return (
              <li
                key={item.href}
                className="flex items-center"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-brand-400 mx-1 flex-shrink-0" aria-hidden="true" />
                )}
                
                {isLast ? (
                  <span
                    className="text-brand-600 font-medium truncate max-w-[200px]"
                    aria-current="page"
                    itemProp="name"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-brand-500 hover:text-classic-green transition-colors flex items-center gap-1"
                    itemProp="item"
                  >
                    {isFirst && showHome && (
                      <Home className="w-4 h-4" aria-hidden="true" />
                    )}
                    <span itemProp="name" className={isFirst && showHome ? 'sr-only sm:not-sr-only' : ''}>
                      {item.label}
                    </span>
                  </Link>
                )}
                <meta itemProp="position" content={String(index + 1)} />
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

// Helper to generate breadcrumbs from pathname
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  
  return segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
    
    return { label, href };
  });
}
