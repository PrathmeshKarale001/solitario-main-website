/**
 * Feature Flags System
 * 
 * This file centralizes all feature flags for the application.
 * Feature flags are controlled via environment variables.
 * 
 * To enable a feature:
 * 1. Add the environment variable to .env.local
 * 2. Restart the development server
 * 
 * In production, update the environment variables in your hosting provider.
 */

export const isCollectiblesEnabled = (): boolean => {
  // Default to false for production launch
  // Set to 'true' in development to test features
  return process.env.NEXT_PUBLIC_FEATURE_COLLECTIBLES_ENABLED === 'true';
};

export const isRadarGeofencingEnabled = (): boolean => {
  // Radar geofencing is ready but can be toggled if needed
  return process.env.NEXT_PUBLIC_FEATURE_RADAR_GEOFENCING_ENABLED !== 'false';
};

export const isDCBannersEnabled = (): boolean => {
  // DC banners can be toggled on/off
  return process.env.NEXT_PUBLIC_FEATURE_DC_BANNERS_ENABLED === 'true';
};

// Add more feature flags here as needed
// export const isNewFeatureEnabled = (): boolean => {
//   return process.env.NEXT_PUBLIC_FEATURE_NEW_ENABLED === 'true';
// };
