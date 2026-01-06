# Radar Geofencing API Setup Guide

## Overview
This document contains instructions for setting up Radar Geofencing API integration for the Solitario Diamonds website.

## Account Setup

1. **Sign up for Radar Account**
   - Go to: https://radar.com/signup
   - Use email: `eodonsocial@gmail.com`
   - Complete the registration process

2. **Get API Keys**
   - After signing up, go to: https://dashboard.radar.com/settings
   - You'll find two types of keys:
     - **Test Publishable Key**: For development/testing
     - **Live Publishable Key**: For production

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Radar Geofencing API Keys
# Get these from: https://dashboard.radar.com/settings

# For Development/Testing
NEXT_PUBLIC_RADAR_PUBLISHABLE_KEY=prj_test_pk_...

# For Production (add to .env.production)
# NEXT_PUBLIC_RADAR_PUBLISHABLE_KEY=prj_live_pk_...
```

### Important Notes:
- ✅ Use `NEXT_PUBLIC_` prefix to make the key available on the client-side
- ✅ Use **Test Publishable Key** during development
- ✅ Use **Live Publishable Key** in production
- ❌ **NEVER** commit API keys to git
- ❌ **NEVER** use Secret keys on the client-side

## Installation

The Radar SDK has already been installed via npm:

```bash
npm install radar-sdk-js
```

## Features Implemented

### 1. **Find Nearest Store**
- Location: `/components/stores/NearestStore.tsx`
- Uses Radar to get accurate user location
- Calculates distances to all stores
- Shows top 3 nearest stores with travel times

### 2. **Store Locator**
- Location: `/app/(public)/stores/page.tsx`
- Interactive store finder with geofencing
- Real-time distance calculations

### 3. **Product Detail Pages**
- Location: Product pages
- "Find in Store" button with nearest store lookup
- Check availability at nearby locations

### 4. **Geofencing Utilities**
- Location: `/lib/radar-client.ts`
- Centralized Radar SDK configuration
- Helper functions for common operations

## Radar Dashboard Setup

### Create Geofences for Stores

1. Go to: https://dashboard.radar.com/geofences
2. Click "Create Geofence"
3. For each store, create a geofence:
   - **Tag**: `store`
   - **External ID**: Use store ID from your database
   - **Description**: Store name
   - **Type**: Circle
   - **Radius**: 100-500 meters (recommended: 200m)
   - **Coordinates**: Use store lat/lng from stores-data.ts

Example geofence creation via API (optional):
```bash
curl "https://api.radar.io/v1/geofences" \
  -H "Authorization: prj_live_sk_..." \
  -X POST \
  -d "description=Phoenix Mall Wakad" \
  -d "tag=store" \
  -d "externalId=phoenix-millennium-wakad" \
  -d "type=circle" \
  -d "coordinates=[73.75657,18.60059]" \
  -d "radius=200"
```

## Testing

### Test in Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit: http://localhost:3000/stores

3. Click "Find Nearest Store" button

4. Allow location permissions when prompted

5. Verify:
   - User location is detected
   - Nearest stores are calculated correctly
   - Distances are accurate

### Test Geofence Events

1. Go to: https://dashboard.radar.com/events
2. Track location updates in real-time
3. Monitor entry/exit events for store geofences

## Privacy & Permissions

### Location Permission Flow

1. User clicks "Find Nearest Store"
2. Browser prompts for location permission
3. User grants permission
4. Location is sent to Radar API
5. Nearest stores are calculated and displayed

### Best Practices

- ✅ Always request permission before accessing location
- ✅ Explain why you need location access
- ✅ Provide fallback options (manual city selection)
- ✅ Cache location for 5 minutes to reduce API calls
- ✅ Turn off tracking when not needed

## API Rate Limits

### Free Tier
- 100,000 API calls per month
- 1 request per second per device

### Paid Plans
- Higher limits available
- Volume discounts
- Contact: https://radar.com/pricing

## Monitoring & Analytics

### Radar Dashboard
- Track API usage: https://dashboard.radar.com/usage
- View events: https://dashboard.radar.com/events
- Monitor users: https://dashboard.radar.com/users

### Key Metrics to Monitor
- Location accuracy
- API response times
- Geofence entry/exit events
- User opt-in rates

## Troubleshooting

### Common Issues

**1. Location permission denied**
- Solution: Show instructions to enable location in browser settings
- Fallback: Allow manual city/store selection

**2. Inaccurate location**
- Check: User's device GPS is enabled
- Check: User is not using VPN
- Solution: Increase geofence radius

**3. API key not working**
- Verify: Using correct key (Test vs Live)
- Verify: Key has `NEXT_PUBLIC_` prefix
- Check: Dashboard for key status

**4. High API usage**
- Solution: Implement location caching
- Solution: Reduce tracking frequency
- Solution: Use IP geolocation as fallback

## Support

- Documentation: https://docs.radar.com
- Support: https://radar.com/support
- Status: https://status.radar.com

## Security Checklist

- [ ] API keys added to `.env.local`
- [ ] `.env.local` added to `.gitignore`
- [ ] Using Test key in development
- [ ] Using Live key in production
- [ ] No API keys committed to git
- [ ] Location permissions properly requested
- [ ] Privacy policy updated with location usage

## Next Steps

1. Sign up at https://radar.com/signup with `eodonsocial@gmail.com`
2. Get your Test Publishable Key from dashboard
3. Add key to `.env.local` file
4. Test the integration locally
5. Create geofences for all stores in dashboard
6. Monitor usage and events
7. Get Live Publishable Key for production
8. Deploy to production

---

**Last Updated**: January 6, 2026
**Integration Status**: ✅ Complete
**Account Email**: eodonsocial@gmail.com
