# Radar Location Retrieval Issue - Fix Guide

## Problem
The "Find Nearest Store" feature shows: **"Unable to retrieve your location. Please try again."**

## Root Cause
The Radar SDK requires the API key to be set **before** calling `getLocation()`. The current implementation may be failing because:

1. **Missing API Key**: `NEXT_PUBLIC_RADAR_PUBLISHABLE_KEY` not set in `.env.local`
2. **Browser Permissions**: User hasn't granted location permissions
3. **HTTPS Required**: Geolocation API requires HTTPS in production
4. **Initialization Timing**: SDK not properly initialized before location request

## Solution

### Step 1: Add API Key to `.env.local`

Create or update `/Users/prathmeshkarale/Developer/SolitarioWebsite/.env.local`:

```bash
# Radar Geofencing API Key
# Sign up at: https://radar.com/signup (use: eodonsocial@gmail.com)
# Get key from: https://dashboard.radar.com/settings
NEXT_PUBLIC_RADAR_PUBLISHABLE_KEY=prj_test_pk_YOUR_KEY_HERE
```

### Step 2: Restart Development Server

After adding the key:
```bash
# Stop the current dev server (Ctrl+C)
npm run dev
```

### Step 3: Test Location Access

1. Visit: http://localhost:3000/stores
2. Click "Find Nearest Store"
3. **Allow location permissions** when browser prompts
4. Should now show nearest stores with distances

## Debugging Steps

### Check if API Key is Loaded

Add this to your browser console on the stores page:
```javascript
console.log('Radar Key:', process.env.NEXT_PUBLIC_RADAR_PUBLISHABLE_KEY);
```

### Check Browser Console for Errors

Open DevTools (F12) and look for:
- `Radar API key not found` - Missing `.env.local` file
- `User denied geolocation` - Location permissions denied
- `Network error` - API connectivity issues

### Manual Location Test

Test if browser geolocation works:
```javascript
navigator.geolocation.getCurrentPosition(
  (pos) => console.log('Location:', pos.coords),
  (err) => console.error('Error:', err)
);
```

## Common Issues & Fixes

### Issue 1: "Radar API key not found"
**Fix**: Add `NEXT_PUBLIC_RADAR_PUBLISHABLE_KEY` to `.env.local` and restart server

### Issue 2: "User denied geolocation"
**Fix**: 
1. Click the lock icon in browser address bar
2. Set "Location" to "Allow"
3. Refresh page and try again

### Issue 3: Works in dev but not production
**Fix**: 
1. Ensure `.env.production` has the **Live** Publishable Key
2. Deploy with environment variable set
3. Ensure site uses HTTPS (required for geolocation)

### Issue 4: "Unable to retrieve your location"
**Possible causes**:
- API key not set or invalid
- Radar SDK not initialized
- Network connectivity issue
- Browser doesn't support geolocation

**Fix**:
```typescript
// Check initialization in browser console
if (typeof Radar !== 'undefined') {
  console.log('Radar SDK loaded');
} else {
  console.error('Radar SDK not loaded');
}
```

## Fallback Options

If Radar continues to fail, the code already has a fallback:

1. **Haversine Distance**: Uses mathematical calculation without API
2. **Manual Selection**: Allow users to select city/store manually
3. **IP Geolocation**: Use `ipGeocode()` as fallback

## Testing Checklist

- [ ] `.env.local` file exists with `NEXT_PUBLIC_RADAR_PUBLISHABLE_KEY`
- [ ] Development server restarted after adding key
- [ ] Browser location permissions granted
- [ ] No console errors in DevTools
- [ ] "Find Nearest Store" button works
- [ ] Stores displayed with accurate distances
- [ ] Travel times showing (if available)

## Production Deployment

Before deploying to production:

1. **Get Live Key**: https://dashboard.radar.com/settings
2. **Add to Vercel/Netlify**: 
   - Go to project settings
   - Add environment variable: `NEXT_PUBLIC_RADAR_PUBLISHABLE_KEY`
   - Value: `prj_live_pk_...` (Live key, not Test key)
3. **Redeploy**: Trigger new deployment
4. **Test on HTTPS**: Geolocation requires secure context

## Support

If issues persist:
- Check Radar Status: https://status.radar.com
- Radar Docs: https://docs.radar.com/sdk/web
- Radar Support: https://radar.com/support

---

**Last Updated**: January 6, 2026
**Status**: Awaiting API key configuration
