import Radar from 'radar-sdk-js';
import { StoreLocation } from './stores-data';

let isInitialized = false;

export interface RadarLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export function initializeRadar(): boolean {
  if (isInitialized) {
    return true;
  }

  // In Next.js, NEXT_PUBLIC_ variables are embedded at build time
  const publishableKey = process.env.NEXT_PUBLIC_RADAR_PUBLISHABLE_KEY;

  if (!publishableKey) {
    console.warn('⚠️ Radar API key not configured');
    console.warn('Set NEXT_PUBLIC_RADAR_PUBLISHABLE_KEY in environment variables');
    console.warn('Store locator will use basic geolocation without Radar features');
    // Don't return false - allow basic geolocation to work
    return false;
  }

  try {
    console.log('✅ Initializing Radar SDK...');
    Radar.initialize(publishableKey, {
      logLevel: 'warn', // Reduce console noise
      cacheLocationMinutes: 5,
      locationTimeout: 30000,
      desiredAccuracy: 'high',
    });
    isInitialized = true;
    console.log('✅ Radar SDK initialized');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Radar SDK:', error);
    return false;
  }
}

export async function getUserLocation(): Promise<RadarLocation | null> {
  const radarInitialized = initializeRadar();
  
  if (!radarInitialized) {
    console.log('📍 Using basic geolocation (Radar SDK not available)');
  }

  try {
    console.log('📍 Requesting user location from browser...');
    
    // Use browser's native geolocation API to get location and request permissions
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 300000, // Cache for 5 minutes
        }
      );
    });

    const location: RadarLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
    };

    console.log('✅ Location retrieved:', location);
    
    // Track this location with Radar for geofencing events (optional, only if Radar is initialized)
    if (radarInitialized) {
      try {
        await Radar.trackOnce({
          latitude: location.latitude,
          longitude: location.longitude,
        });
        console.log('📍 Location tracked with Radar');
      } catch (trackError) {
        console.warn('⚠️ Could not track with Radar (non-critical):', trackError);
      }
    }

    return location;
  } catch (error: any) {
    console.error('❌ Error getting user location:', error);
    if (error?.message?.includes('denied') || error?.code === 1) {
      console.error('💡 User denied location permissions. Please allow location access in your browser.');
      throw new Error('Location permission denied');
    } else if (error?.message?.includes('timeout') || error?.code === 3) {
      console.error('💡 Location request timed out. Please try again.');
      throw new Error('Location request timeout');
    } else if (error?.code === 2) {
      console.error('💡 Location unavailable. Please check your device settings.');
      throw new Error('Location unavailable');
    }
    throw error;
  }
}

export async function trackUserLocation(userId?: string): Promise<any | null> {
  if (!initializeRadar()) {
    return null;
  }

  try {
    if (userId) {
      Radar.setUserId(userId);
    }

    const result = await Radar.trackOnce();
    return result;
  } catch (error) {
    console.error('Error tracking user location:', error);
    return null;
  }
}

export async function getLocationContext(
  latitude?: number,
  longitude?: number
): Promise<any | null> {
  if (!initializeRadar()) {
    return null;
  }

  try {
    const location = await getUserLocation();
    if (!location) {
      return null;
    }
    
    const coords = latitude && longitude ? { latitude, longitude } : location;
    const result = await Radar.getContext(coords);
    return result;
  } catch (error) {
    console.error('Error getting location context:', error);
    return null;
  }
}

export async function calculateDistance(
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number },
  modes: ('foot' | 'car' | 'bike')[] = ['foot', 'car']
): Promise<any | null> {
  if (!initializeRadar()) {
    return null;
  }

  try {
    const result = await Radar.distance({
      origin,
      destination,
      modes,
      units: 'metric',
    });
    return result;
  } catch (error) {
    console.error('Error calculating distance:', error);
    return null;
  }
}

export async function searchNearbyGeofences(
  latitude: number,
  longitude: number,
  radius: number = 5000,
  tags: string[] = ['store'],
  limit: number = 10
): Promise<any[] | null> {
  if (!initializeRadar()) {
    return null;
  }

  try {
    const result = await Radar.searchGeofences({
      near: { latitude, longitude },
      radius,
      tags,
      limit,
    });
    return result.geofences || [];
  } catch (error) {
    console.error('Error searching geofences:', error);
    return null;
  }
}

export async function forwardGeocode(address: string): Promise<any[] | null> {
  if (!initializeRadar()) {
    return null;
  }

  try {
    const result = await Radar.forwardGeocode({ query: address });
    return result.addresses || [];
  } catch (error) {
    console.error('Error forward geocoding:', error);
    return null;
  }
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<any[] | null> {
  if (!initializeRadar()) {
    return null;
  }

  try {
    const result = await Radar.reverseGeocode({ latitude, longitude });
    return result.addresses || [];
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}

export async function ipGeocode(): Promise<any | null> {
  if (!initializeRadar()) {
    return null;
  }

  try {
    const result = await Radar.ipGeocode();
    return result;
  } catch (error) {
    console.error('Error IP geocoding:', error);
    return null;
  }
}

export async function autocompleteAddress(
  query: string,
  near?: { latitude: number; longitude: number },
  limit: number = 10
): Promise<any[] | null> {
  if (!initializeRadar()) {
    return null;
  }

  try {
    const result = await Radar.autocomplete({
      query,
      near,
      limit,
    });
    return result.addresses || [];
  } catch (error) {
    console.error('Error autocompleting address:', error);
    return null;
  }
}

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
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

export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

export async function findNearestStoresWithRadar(
  stores: StoreLocation[],
  maxStores: number = 3
): Promise<Array<{ store: StoreLocation; distance: number; travelTime?: string }>> {
  console.log('🏪 findNearestStoresWithRadar called with', stores.length, 'stores, max:', maxStores);
  const userLocation = await getUserLocation();
  
  if (!userLocation) {
    console.warn('⚠️ No user location available, returning stores without distances');
    const storesWithDistance = stores.map((store) => ({
      store,
      distance: 0,
    }));
    return storesWithDistance.slice(0, maxStores);
  }
  
  console.log('📊 Calculating distances from user location:', userLocation);

  const storesWithDistance = stores.map((store) => {
    const distance = haversineDistance(
      userLocation.latitude,
      userLocation.longitude,
      store.lat,
      store.lng
    );
    return { store, distance };
  });

  storesWithDistance.sort((a, b) => a.distance - b.distance);
  const nearestStores = storesWithDistance.slice(0, maxStores);

  const storesWithTravelTime = await Promise.all(
    nearestStores.map(async ({ store, distance }) => {
      try {
        const distanceResult = await calculateDistance(
          { latitude: userLocation.latitude, longitude: userLocation.longitude },
          { latitude: store.lat, longitude: store.lng },
          ['car']
        );

        const travelTime = distanceResult?.routes?.car?.duration?.text;
        return { store, distance, travelTime };
      } catch (error) {
        return { store, distance };
      }
    })
  );

  return storesWithTravelTime;
}

export async function checkIfNearStore(
  userLat: number,
  userLng: number,
  storeLat: number,
  storeLng: number,
  radiusKm: number = 0.5
): Promise<boolean> {
  const distance = haversineDistance(userLat, userLng, storeLat, storeLng);
  return distance <= radiusKm;
}

export const RadarClient = {
  initialize: initializeRadar,
  getUserLocation,
  trackUserLocation,
  getLocationContext,
  calculateDistance,
  searchNearbyGeofences,
  forwardGeocode,
  reverseGeocode,
  ipGeocode,
  autocompleteAddress,
  findNearestStoresWithRadar,
  checkIfNearStore,
  haversineDistance,
  formatDistance,
};

export default RadarClient;
