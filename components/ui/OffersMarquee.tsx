'use client';

import { useEffect, useState } from 'react';
import { Tag, Gift, Sparkles, TrendingDown } from 'lucide-react';

interface Offer {
  id: string;
  text: string;
  icon?: 'tag' | 'gift' | 'sparkles' | 'trending';
}

const defaultOffers: Offer[] = [
  { id: '1', text: 'Free Shipping on Orders Above ₹5,000', icon: 'gift' },
  { id: '2', text: 'Get 20% Off on Your First Purchase', icon: 'tag' },
  { id: '3', text: 'Buy 2+ Items & Get a Free Diamond Gift', icon: 'sparkles' },
  { id: '4', text: 'Flat 15% Off on Lab-Grown Diamonds', icon: 'trending' },
  { id: '5', text: 'Exclusive Designs - Limited Stock Available', icon: 'sparkles' },
  { id: '6', text: 'Easy EMI Options Available', icon: 'tag' },
];

const getIcon = (iconType?: string) => {
  const iconClass = "w-3.5 h-3.5";
  switch (iconType) {
    case 'tag':
      return <Tag className={iconClass} />;
    case 'gift':
      return <Gift className={iconClass} />;
    case 'sparkles':
      return <Sparkles className={iconClass} />;
    case 'trending':
      return <TrendingDown className={iconClass} />;
    default:
      return <Tag className={iconClass} />;
  }
};

export default function OffersMarquee({ offers = defaultOffers }: { offers?: Offer[] }) {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate offers for seamless loop
  const duplicatedOffers = [...offers, ...offers, ...offers];

  return (
    <div className="relative w-full bg-gradient-to-r from-classic-green via-teal to-classic-green text-white overflow-hidden h-9 flex items-center border-y border-teal/30">
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-classic-green to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-classic-green to-transparent z-10 pointer-events-none" />
      
      {/* Marquee content */}
      <div
        className={`flex gap-8 ${isPaused ? '' : 'animate-marquee'}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {duplicatedOffers.map((offer, index) => (
          <div
            key={`${offer.id}-${index}`}
            className="flex items-center gap-2 whitespace-nowrap px-4"
          >
            <span className="flex-shrink-0 opacity-90">
              {getIcon(offer.icon)}
            </span>
            <span className="text-sm font-medium tracking-wide">
              {offer.text}
            </span>
            {index < duplicatedOffers.length - 1 && (
              <span className="text-ivory-pearl/60 mx-2">•</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
