'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUserLocation, checkIfNearStore, RadarLocation } from '@/lib/radar-client';
import { ALL_STORES, StoreLocation } from '@/lib/stores-data';

interface GeofencingState {
  userLocation: RadarLocation | null;
  nearestStore: StoreLocation | null;
  isNearStore: boolean;
  distance: number | null;
  isLoading: boolean;
  error: string | null;
}

interface UseGeofencingOptions {
  autoTrack?: boolean;
  nearbyRadiusKm?: number;
}

export function useGeofencing(options: UseGeofencingOptions = {}) {
  const { autoTrack = false, nearbyRadiusKm = 0.5 } = options;

  const [state, setState] = useState<GeofencingState>({
    userLocation: null,
    nearestStore: null,
    isNearStore: false,
    distance: null,
    isLoading: false,
    error: null,
  });

  const trackLocation = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const location = await getUserLocation();
      
      if (!location) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Unable to get location',
        }));
        return;
      }

      // Find nearest store
      let nearestStore: StoreLocation | null = null;
      let minDistance = Infinity;

      for (const store of ALL_STORES) {
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          store.lat,
          store.lng
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestStore = store;
        }
      }

      // Check if near any store
      const isNear = nearestStore
        ? await checkIfNearStore(
            location.latitude,
            location.longitude,
            nearestStore.lat,
            nearestStore.lng,
            nearbyRadiusKm
          )
        : false;

      setState({
        userLocation: location,
        nearestStore,
        isNearStore: isNear,
        distance: minDistance,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error?.message || 'Failed to track location',
      }));
    }
  }, [nearbyRadiusKm]);

  useEffect(() => {
    if (autoTrack) {
      trackLocation();
    }
  }, [autoTrack, trackLocation]);

  return {
    ...state,
    trackLocation,
    refetch: trackLocation,
  };
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
