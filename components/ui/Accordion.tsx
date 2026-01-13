'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
}

export default function Accordion({ items, allowMultiple = false, defaultOpen = [] }: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      
      if (allowMultiple) {
        return [...prev, id];
      }
      
      return [id];
    });
  };

  return (
    <div className="space-y-2 sm:space-y-3 md:space-y-4">
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);

        return (
          <div
            key={item.id}
            className={cn(
              'border-b border-gray-200 pb-2 sm:pb-3 md:pb-4 mb-2 sm:mb-3 md:mb-4 transition-all',
              isOpen && 'border-bronze-gold/30'
            )}
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between py-2 sm:py-3 md:py-4 text-left group touch-manipulation"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-sm sm:text-base md:text-lg text-classic-green group-hover:text-bronze-gold transition-colors pr-2">
                {item.title}
              </span>
              <ChevronDown
                className={cn(
                  'w-4 h-4 sm:w-5 sm:h-5 text-classic-green transition-transform duration-300 flex-shrink-0 ml-2',
                  isOpen && 'transform rotate-180 text-bronze-gold'
                )}
              />
            </button>

            <div
              className={cn(
                'overflow-hidden transition-all duration-300',
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="pt-1 sm:pt-2 pb-2 sm:pb-3 md:pb-4 text-xs sm:text-sm text-gray-600">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}


