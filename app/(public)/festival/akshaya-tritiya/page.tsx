'use client';

import { Suspense } from 'react';
import { FESTIVALS } from '@/lib/festival-config';
import { FestivalPageContent } from '../page';

const AKSHAYA_TRITIYA = FESTIVALS.find(f => f.id === 'akshaya-tritiya-2026') || FESTIVALS[0];

export default function AkshayaTritiyaPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-classic-green mx-auto mb-4" />
            <p className="text-gray-500 font-montserrat text-sm">Loading Akshaya Tritiya details…</p>
          </div>
        </div>
      }
    >
      <FestivalPageContent festivalOverride={AKSHAYA_TRITIYA} />
    </Suspense>
  );
}
