'use client';

import Image from 'next/image';
import { Gift, Sparkles } from 'lucide-react';
import { useFestivalGift } from '@/lib/hooks/use-festival-gift';
import { FESTIVAL_OFFER } from '@/lib/festival-offer';

interface FestivalGiftItemProps {
  /** 'cart' = tall card in cart page items list; 'sidebar' = compact list row; 'checkout' = small summary row */
  variant?: 'cart' | 'sidebar' | 'checkout';
}

export default function FestivalGiftItem({ variant = 'cart' }: FestivalGiftItemProps) {
  const { gift, loading } = useFestivalGift(true);

  if (variant === 'checkout') {
    return (
      <div className="flex gap-3 pb-4 border-b border-amber-100 last:border-0 last:pb-0 relative">
        <div className="relative w-16 h-16 flex-shrink-0 bg-amber-50 rounded-lg overflow-hidden border border-amber-200">
          {loading ? (
            <div className="w-full h-full animate-pulse bg-amber-100" />
          ) : gift?.image ? (
            <Image
              src={gift.image}
              alt={gift.name}
              fill
              className="object-contain p-2"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">💎</div>
          )}
          <div className="absolute top-0 right-0 bg-amber-500 text-white text-[6px] px-1 py-0.5 font-bold uppercase rounded-bl">
            Gift
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={12} className="text-amber-500 shrink-0" />
            <p className="font-medium text-sm text-gray-900 line-clamp-1">
              {loading ? FESTIVAL_OFFER.giftProductName : (gift?.name ?? FESTIVAL_OFFER.giftProductName)}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-gotham font-bold text-amber-600 tracking-wider uppercase bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-100">
              🪷 Akshaya Tritiya Gift
            </span>
            <span className="text-xs font-bold text-amber-600">FREE</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="flex gap-3 pb-4 border-b border-amber-100 last:border-0 relative">
        <div className="relative w-16 h-16 flex-shrink-0 bg-amber-50 rounded-xl overflow-hidden border-2 border-amber-200">
          {loading ? (
            <div className="w-full h-full animate-pulse bg-amber-100 rounded-xl" />
          ) : gift?.image ? (
            <Image
              src={gift.image}
              alt={gift.name}
              fill
              className="object-contain p-2"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">💎</div>
          )}
          <div className="absolute top-0 right-0 bg-amber-500 text-white text-[7px] px-1.5 py-0.5 font-bold uppercase rounded-bl-lg">
            Gift
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={12} className="text-amber-500 shrink-0" />
            <h4 className="font-montserrat font-bold text-body-sm text-amber-900 line-clamp-1">
              {loading ? FESTIVAL_OFFER.giftProductName : (gift?.name ?? FESTIVAL_OFFER.giftProductName)}
            </h4>
          </div>
          <p className="text-[10px] text-amber-700 mb-1.5">Akshaya Tritiya gift</p>
          <span className="text-[9px] font-gotham font-bold text-amber-700 tracking-wider uppercase bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200 w-fit">
            🪷 FREE GIFT
          </span>
        </div>
      </div>
    );
  }

  // default: 'cart' variant — tall card matching other cart items
  return (
    <div className="flex gap-3 md:gap-6 p-4 md:p-5 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl relative transition-all duration-300">
      <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-white rounded-xl overflow-hidden border-2 border-amber-300 shadow-sm">
        {loading ? (
          <div className="w-full h-full animate-pulse bg-amber-100 rounded-xl" />
        ) : gift?.image ? (
          <Image
            src={gift.image}
            alt={gift.name}
            fill
            className="object-contain p-3"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">💎</div>
        )}
        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] px-2 py-0.5 font-bold uppercase rounded-bl-xl">
          Gift
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-1.5 mb-1">
          <Gift size={16} className="text-amber-500 shrink-0" />
          <h3 className="font-montserrat font-bold text-sm text-amber-900">
            {loading ? FESTIVAL_OFFER.giftProductName : (gift?.name ?? FESTIVAL_OFFER.giftProductName)}
          </h3>
        </div>
        <p className="text-xs text-amber-700 mb-2">Free with your Akshaya Tritiya order above ₹6,999</p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-gotham font-bold text-amber-700 tracking-wider uppercase bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
            🪷 FREE GIFT
          </span>
        </div>
      </div>
    </div>
  );
}
