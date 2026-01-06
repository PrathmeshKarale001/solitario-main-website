'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Store, Loader2, AlertCircle } from 'lucide-react';
import { ALL_STORES, formatDistance, StoreLocation } from '@/lib/stores-data';
import { findNearestStoresWithRadar } from '@/lib/radar-client';

interface StoreAvailabilityProps {
  productName?: string;
  className?: string;
}

export default function StoreAvailability({ productName, className = '' }: StoreAvailabilityProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [nearestStore, setNearestStore] = useState<{ store: StoreLocation; distance: number; travelTime?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const findNearestStore = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nearest = await findNearestStoresWithRadar(ALL_STORES, 1);
      
      if (nearest && nearest.length > 0) {
        setNearestStore(nearest[0]);
      } else {
        setError('Unable to find nearby stores');
      }
    } catch (err) {
      setError('Unable to access your location. Please enable location permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className={`rounded-lg border border-red-200 bg-red-50 p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Location Access Required</p>
            <p className="text-xs text-red-600 mt-1">{error}</p>
            <button
              onClick={findNearestStore}
              className="mt-2 text-xs text-red-700 underline hover:text-red-900"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (nearestStore) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg border border-classic-green/30 bg-classic-green/5 p-4 ${className}`}
      >
        <div className="flex items-start gap-3">
          <Store className="w-5 h-5 text-classic-green flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-brand-800">Available at Nearest Store</p>
            <p className="text-sm text-brand-700 mt-1">{nearestStore.store.name}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-brand-600">
              <span className="flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                {formatDistance(nearestStore.distance)}
              </span>
              {nearestStore.travelTime && (
                <span>{nearestStore.travelTime} away</span>
              )}
            </div>
            <a
              href={nearestStore.store.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-xs text-classic-green font-medium hover:underline"
            >
              Get Directions →
            </a>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <button
      onClick={findNearestStore}
      disabled={isLoading}
      className={`w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-classic-green text-classic-green hover:bg-classic-green hover:text-white font-gotham text-xs uppercase tracking-wider rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Finding Nearest Store...
        </>
      ) : (
        <>
          <MapPin className="w-4 h-4" />
          Check Store Availability
        </>
      )}
    </button>
  );
}
