'use client';

import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export interface ProductFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function ProductFilter({ activeCategory, onCategoryChange }: ProductFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.slug)}
          className={cn(
            'px-8 py-4 rounded-full font-gotham text-xs uppercase tracking-[0.15em] transition-all duration-500',
            activeCategory === category.slug
              ? 'bg-bronze-gold text-white shadow-luxury-lg scale-105'
              : 'bg-white text-gray-700 hover:bg-bronze-gold/10 hover:text-bronze-gold border border-gray-200 hover:shadow-luxury'
          )}
          style={{ letterSpacing: '0.2em' }}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}


