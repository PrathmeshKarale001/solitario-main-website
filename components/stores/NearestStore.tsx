'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Phone, Clock, ExternalLink, Loader2, MapPinOff, RefreshCw } from 'lucide-react';
import { ALL_STORES, formatDistance, StoreLocation } from '@/lib/stores-data';
import { findNearestStoresWithRadar, getUserLocation } from '@/lib/radar-client';

interface NearestStoreProps {
  showTitle?: boolean;
  maxStores?: number;
  compact?: boolean; // For use in ProductDetail page
}

interface LocationState {
  status: 'idle' | 'loading' | 'success' | 'error' | 'denied';
  coords: { lat: number; lng: number } | null;
  error: string | null;
}

export default function NearestStore({ showTitle = true, maxStores = 3, compact = false }: NearestStoreProps) {
  const [locationState, setLocationState] = useState<LocationState>({
    status: 'idle',
    coords: null,
    error: null,
  });
  const [nearestStores, setNearestStores] = useState<{ store: StoreLocation; distance: number; travelTime?: string }[]>([]);

  const requestLocation = async () => {
    console.log('🔘 Find Nearest Store button clicked');
    
    if (!navigator.geolocation) {
      console.error('❌ Geolocation not supported by browser');
      setLocationState({
        status: 'error',
        coords: null,
        error: 'Geolocation is not supported by your browser',
      });
      return;
    }

    console.log('⏳ Setting loading state...');
    setLocationState({ status: 'loading', coords: null, error: null });

    try {
      console.log('📡 Calling getUserLocation() from Radar client...');
      // Use Radar API for more accurate location and distance calculations
      const location = await getUserLocation();
      console.log('📍 getUserLocation() returned:', location);
      
      if (!location) {
        setLocationState({
          status: 'error',
          coords: null,
          error: 'Unable to retrieve your location. Please try again.',
        });
        return;
      }

      const coords = {
        lat: location.latitude,
        lng: location.longitude,
      };
      
      console.log('✅ Location coords:', coords);
      setLocationState({ status: 'success', coords, error: null });
      
      // Find nearest stores using Radar with travel time calculations
      console.log('🔍 Finding nearest stores from', ALL_STORES.length, 'total stores...');
      const nearest = await findNearestStoresWithRadar(ALL_STORES, maxStores);
      console.log('✅ Found nearest stores:', nearest);
      setNearestStores(nearest);
      
    } catch (error: any) {
      console.error('❌ Error in requestLocation:', error);
      let errorMessage = 'Unable to retrieve your location';
      let status: LocationState['status'] = 'error';
      
      if (error?.message?.includes('denied') || error?.message?.includes('permission')) {
        errorMessage = 'Location access was denied. Please enable location permissions.';
        status = 'denied';
        console.error('🚫 Location permission denied');
      } else if (error?.message?.includes('timeout')) {
        errorMessage = 'Location request timed out. Please try again.';
        console.error('⏱️ Location request timeout');
      }
      
      setLocationState({ status, coords: null, error: errorMessage });
    }
  };

  // Auto-request location on mount (optional - can be triggered by button instead)
  useEffect(() => {
    // Don't auto-request, let user click the button
  }, []);

  // Compact version for ProductDetail page
  if (compact) {
    return (
      <div className="w-full">
        {locationState.status === 'idle' && (
          <button
            onClick={requestLocation}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-classic-green text-classic-green hover:bg-classic-green hover:text-white font-gotham text-ui uppercase tracking-luxury rounded-brand transition-all duration-500"
          >
            <Navigation className="w-5 h-5" />
            Find Nearest Store
          </button>
        )}

        {locationState.status === 'loading' && (
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-brand-300 text-brand-500 font-gotham text-ui uppercase tracking-luxury rounded-brand cursor-wait"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            Locating...
          </button>
        )}

        {locationState.status === 'success' && nearestStores.length > 0 && (
          <a
            href={nearestStores[0].store.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-classic-green bg-classic-green/5 text-classic-green hover:bg-classic-green hover:text-white font-gotham text-ui uppercase tracking-luxury rounded-brand transition-all duration-500"
          >
            <MapPin className="w-5 h-5" />
            <span className="truncate">{nearestStores[0].store.name}</span>
            <span className="text-xs opacity-70">({formatDistance(nearestStores[0].distance)})</span>
          </a>
        )}

        {(locationState.status === 'error' || locationState.status === 'denied') && (
          <button
            onClick={requestLocation}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-red-300 text-red-600 hover:bg-red-50 font-gotham text-ui uppercase tracking-luxury rounded-brand transition-all duration-500"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Location
          </button>
        )}
      </div>
    );
  }

  // Full version for Stores page
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-brand-50 to-white">
      <div className="max-w-7xl mx-auto">
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <span className="inline-block text-classic-green text-xs uppercase tracking-[0.3em] font-gotham mb-4">
              Personalized For You
            </span>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-playfair text-brand-800 mb-4" style={{ letterSpacing: '-0.02em' }}>
              Nearest Store to <span className="text-classic-green">Your Location</span>
            </h2>
            <p className="text-sm md:text-base text-brand-600 max-w-2xl mx-auto font-montserrat">
              Allow location access to find the Solitario store closest to you.
            </p>
          </motion.div>
        )}

        {/* Location Request State */}
        <AnimatePresence mode="wait">
          {locationState.status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <button
                onClick={requestLocation}
                className="inline-flex items-center gap-3 px-8 py-4 bg-classic-green hover:bg-classic-green/90 text-white font-gotham uppercase tracking-[0.2em] text-sm rounded-xl transition-all duration-500 hover:scale-105 shadow-brand hover:shadow-brand-lg"
              >
                <Navigation className="w-5 h-5" />
                Find Nearest Store
              </button>
              <p className="mt-4 text-sm text-brand-500 font-montserrat">
                Click to share your location and discover stores near you
              </p>
            </motion.div>
          )}

          {locationState.status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <Loader2 className="w-12 h-12 text-classic-green animate-spin mx-auto mb-4" />
              <p className="text-brand-700 font-montserrat">Finding stores near you...</p>
            </motion.div>
          )}

          {(locationState.status === 'error' || locationState.status === 'denied') && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <MapPinOff className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-brand-700 font-montserrat mb-4">{locationState.error}</p>
              <button
                onClick={requestLocation}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-100 hover:bg-brand-200 text-brand-800 font-gotham uppercase tracking-[0.15em] text-sm rounded-lg transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </motion.div>
          )}

          {locationState.status === 'success' && nearestStores.length > 0 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid md:grid-cols-3 gap-6">
                {nearestStores.map(({ store, distance }, idx) => (
                  <motion.div
                    key={store.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`rounded-2xl border p-6 transition-all duration-500 ${
                      idx === 0
                        ? 'bg-classic-green/5 border-classic-green/30 shadow-brand-lg'
                        : 'bg-white border-brand-200 hover:border-classic-green/30 hover:shadow-brand'
                    }`}
                  >
                    {idx === 0 && (
                      <span className="inline-block px-3 py-1 bg-classic-green text-white text-xs font-gotham uppercase tracking-wider rounded-full mb-4">
                        Nearest Store
                      </span>
                    )}
                    
                    <h3 className="text-xl font-playfair text-brand-800 mb-2">{store.name}</h3>
                    
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center gap-2 text-classic-green font-gotham text-sm">
                        <Navigation className="w-4 h-4" />
                        {formatDistance(distance)} away
                      </div>
                      {nearestStores[idx].travelTime && (
                        <div className="flex items-center gap-2 text-brand-600 font-montserrat text-xs">
                          <Clock className="w-3 h-3" />
                          {nearestStores[idx].travelTime} by car
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-brand-700 text-sm font-montserrat">{store.address}</p>
                          <p className="text-brand-500 text-sm font-montserrat">{store.city}, {store.country}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-brand-500 flex-shrink-0" />
                        <a href={`tel:${store.phone}`} className="text-brand-700 text-sm font-montserrat hover:text-classic-green transition-colors">
                          {store.phone}
                        </a>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-brand-500 flex-shrink-0" />
                        <p className="text-brand-700 text-sm font-montserrat">{store.hours}</p>
                      </div>
                    </div>

                    <a
                      href={store.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 text-sm font-gotham uppercase tracking-wider transition-all hover:gap-3 ${
                        idx === 0 ? 'text-classic-green' : 'text-brand-600 hover:text-classic-green'
                      }`}
                    >
                      Get Directions <ExternalLink className="w-4 h-4" />
                    </a>
                  </motion.div>
                ))}
              </div>

              {/* Refresh button */}
              <div className="text-center mt-8">
                <button
                  onClick={requestLocation}
                  className="inline-flex items-center gap-2 px-4 py-2 text-brand-600 hover:text-classic-green font-montserrat text-sm transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Location
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
