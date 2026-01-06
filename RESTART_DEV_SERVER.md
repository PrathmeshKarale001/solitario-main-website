# 🔄 Restart Dev Server Required

## Issue
You added the Radar API key to `.env.local`, but the location feature still shows an error.

## Why?
Next.js only loads environment variables when the server **starts**. Adding or changing variables in `.env.local` while the server is running won't take effect until you restart.

## Solution

### Step 1: Stop the Current Dev Server
Press `Ctrl + C` in the terminal where `npm run dev` is running.

### Step 2: Start the Dev Server Again
```bash
npm run dev
```

### Step 3: Test the Location Feature
1. Visit: http://localhost:3000/stores
2. Open browser DevTools (F12) and go to the **Console** tab
3. Click "Find Nearest Store"
4. You should see these messages in the console:
   - ✅ Radar API key found, initializing SDK...
   - ✅ Radar SDK initialized successfully
   - 📍 Requesting user location...
   - ✅ Location retrieved: {latitude: ..., longitude: ...}

### Step 4: Allow Location Permissions
When your browser asks for location permissions, click **"Allow"**.

## Troubleshooting

### If you see: "❌ Radar API key not found!"
- Check that `.env.local` exists in the project root
- Verify the key is on line 79: `NEXT_PUBLIC_RADAR_PUBLISHABLE_KEY=prj_test_pk_...`
- Make sure you restarted the dev server after adding the key

### If you see: "User denied location permissions"
1. Click the lock icon in your browser's address bar
2. Find "Location" permissions
3. Change to "Allow"
4. Refresh the page and try again

### If you see: "Location request timed out"
- Check your internet connection
- Try again - sometimes the first request takes longer
- Make sure you're not using a VPN that blocks geolocation

## Verification Checklist
- [ ] `.env.local` file exists with the Radar API key
- [ ] Dev server was restarted after adding the key
- [ ] Browser console shows "✅ Radar SDK initialized successfully"
- [ ] Location permissions are set to "Allow"
- [ ] "Find Nearest Store" button shows nearest stores

## Current API Key
Your `.env.local` should have:
```bash
NEXT_PUBLIC_RADAR_PUBLISHABLE_KEY=prj_test_pk_4d4c24a4902928707266600e2d5401b4af64739f
```

This is correct! Just restart the server.

---

**Quick Command:**
```bash
# Stop server: Ctrl + C
# Start server:
npm run dev
```
