'use client';

import { Gift, Truck, Shield, Percent } from 'lucide-react';

// Unified Offer Communication Component
// Client Feedback: Align offer messaging between homepage and checkout for consistency

interface Offer {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const offers: Offer[] = [
  {
    icon: <Truck className="w-5 h-5" />,
    title: 'Free Shipping',
    description: 'On orders above ₹50,000',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Lifetime Warranty',
    description: 'On all lab-grown diamonds',
  },
  {
    icon: <Percent className="w-5 h-5" />,
    title: 'No Cost EMI',
    description: 'Available on orders above ₹25,000',
  },
  {
    icon: <Gift className="w-5 h-5" />,
    title: 'Free Gift Wrapping',
    description: 'Luxury packaging included',
  },
];

interface UnifiedOfferBannerProps {
  variant?: 'homepage' | 'checkout';
  className?: string;
}

export default function UnifiedOfferBanner({ variant = 'homepage', className = '' }: UnifiedOfferBannerProps) {
  return (
    <div className={`bg-gradient-to-r from-ivory-pearl to-white py-6 ${className}`}>
      <div className="container mx-auto px-4">
        {variant === 'checkout' && (
          <h3 className="text-center text-lg font-playfair font-semibold text-brand-900 mb-4">
            Your Benefits
          </h3>
        )}
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {offers.map((offer, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-classic-green/10 rounded-full flex items-center justify-center mb-3 text-classic-green">
                {offer.icon}
              </div>
              <h4 className="font-gotham font-semibold text-sm text-brand-900 mb-1">
                {offer.title}
              </h4>
              <p className="text-xs text-brand-600">
                {offer.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
