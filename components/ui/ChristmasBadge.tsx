'use client';

import { Gift, Star } from 'lucide-react';

export default function ChristmasBadge() {
  return (
    <div className="absolute top-2 left-2 z-10">
      <div className="relative">
        <div className="bg-gradient-to-r from-red-500 to-green-500 text-white px-2 py-1 rounded-full flex items-center gap-1 shadow-lg animate-pulse">
          <Gift className="w-3 h-3" />
          <span className="text-xs font-bold uppercase tracking-wider">Christmas Deal</span>
          <Star className="w-3 h-3 text-yellow-300" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-green-500 rounded-full blur-sm opacity-50 animate-ping" />
      </div>
    </div>
  );
}
