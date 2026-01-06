# Feature Flags System - Guide

## Overview
A simple feature flag system to control the visibility of features without changing code.

## Available Flags

### 1. Collectibles Feature (`NEXT_PUBLIC_FEATURE_COLLECTIBLES_ENABLED`)
Controls the Warner Bros collectibles collection visibility.

**Components affected:**
- Warner Bros floating button
- Collectibles CTA in header
- Collectibles link in mobile menu
- `/warner-bros` page (returns 404 when disabled)

### 2. Radar Geofencing (`NEXT_PUBLIC_FEATURE_RADAR_GEOFENCING_ENABLED`)
Controls the Radar geofencing functionality for store location features.

**Components affected:**
- Nearest Store component
- Store availability checks
- Location-based features

## How to Use

### In Development (.env.local)
```bash
# Enable collectibles for testing
NEXT_PUBLIC_FEATURE_COLLECTIBLES_ENABLED=true

# Disable geofencing if needed
NEXT_PUBLIC_FEATURE_RADAR_GEOFENCING_ENABLED=false
```

### In Production
Update environment variables in your hosting provider:
- **Vercel**: Project Settings > Environment Variables
- **Netlify**: Site settings > Build & deploy > Environment
- **Other**: Check your provider's documentation

## Current Status for GitHub Push

### Collectibles Feature
- ✅ **DISABLED** - Set to `false` in .env.local
- ✅ All CTAs hidden
- ✅ `/warner-bros` page returns 404
- ✅ Ready for production push

### Radar Geofencing
- ✅ **ENABLED** - Set to `true` (default)
- ✅ Location features active
- ✅ Ready for production

## Enabling Collectibles Later

When ready to launch the Warner Bros collection:

1. **Update Production Environment:**
   ```bash
   NEXT_PUBLIC_FEATURE_COLLECTIBLES_ENABLED=true
   ```

2. **Deploy the change** (no code changes needed)

3. **Verify:**
   - Floating button appears
   - Header CTA appears
   - Mobile menu link appears
   - `/warner-bros` page is accessible

## Adding New Feature Flags

1. Add to `/lib/feature-flags.ts`:
   ```typescript
   export const isNewFeatureEnabled = (): boolean => {
     return process.env.NEXT_PUBLIC_FEATURE_NEW_ENABLED === 'true';
   };
   ```

2. Add to `.env.example`:
   ```bash
   NEXT_PUBLIC_FEATURE_NEW_ENABLED=false
   ```

3. Use in components:
   ```typescript
   import { isNewFeatureEnabled } from '@/lib/feature-flags';
   
   if (!isNewFeatureEnabled()) {
     return null;
   }
   ```

## Benefits

- ✅ No code changes for feature toggles
- ✅ Easy A/B testing
- ✅ Gradual feature rollouts
- ✅ Quick disable if issues arise
- ✅ Clean production builds

## Security Note

Only use `NEXT_PUBLIC_` prefix for client-side features. Server-side features should use regular environment variables without the prefix.

---

**Status:** Ready for GitHub push with collectibles hidden 🔒
