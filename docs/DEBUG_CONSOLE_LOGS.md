# Debug Console Logs - Not Appearing

## Issue
After clicking "Find Nearest Store", no console logs appear.

## Possible Causes

### 1. **Dev Server Not Restarted**
The most common cause. Environment variables are only loaded when the server starts.

**Solution:**
```bash
# Stop the server (Ctrl + C)
# Start again
npm run dev
```

### 2. **Wrong Browser Tab**
Console logs only appear in the tab where you clicked the button.

**Solution:**
- Make sure you're looking at the Console tab in DevTools (F12)
- Make sure you're on the `/stores` page
- Click "Find Nearest Store" button
- Watch the Console tab for logs

### 3. **Console Cleared or Filtered**
Your browser console might be filtered or cleared.

**Solution:**
- In DevTools Console, check the filter dropdown (should be "All levels")
- Make sure "Preserve log" is checked
- Clear console (trash icon) and try again

### 4. **JavaScript Error Preventing Execution**
An error might be stopping the code before it reaches the console.log statements.

**Solution:**
- Check the Console tab for any RED error messages
- Check the Network tab for failed requests
- Look for any errors when the page loads

### 5. **Button Not Connected to Handler**
The onClick handler might not be properly connected.

**Solution:**
I've added extensive logging. After restarting the server, you should see:

```
🔘 Find Nearest Store button clicked
⏳ Setting loading state...
📡 Calling getUserLocation() from Radar client...
✅ Radar API key found, initializing SDK...
✅ Radar SDK initialized successfully
📍 Requesting user location...
```

## What You Should See

### When Everything Works:
```
🔘 Find Nearest Store button clicked
⏳ Setting loading state...
📡 Calling getUserLocation() from Radar client...
✅ Radar API key found, initializing SDK...
✅ Radar SDK initialized successfully
📍 Requesting user location...
✅ Location retrieved: {latitude: 18.xxxx, longitude: 73.xxxx}
📍 getUserLocation() returned: {latitude: 18.xxxx, longitude: 73.xxxx}
✅ Location coords: {lat: 18.xxxx, lng: 73.xxxx}
🔍 Finding nearest stores from 40 total stores...
🏪 findNearestStoresWithRadar called with 40 stores, max: 3
📊 Calculating distances from user location: {latitude: 18.xxxx, longitude: 73.xxxx}
✅ Found nearest stores: [...]
```

### If API Key Missing:
```
🔘 Find Nearest Store button clicked
⏳ Setting loading state...
📡 Calling getUserLocation() from Radar client...
❌ Radar API key not found!
Please add NEXT_PUBLIC_RADAR_PUBLISHABLE_KEY to your .env.local file
Then restart the dev server with: npm run dev
```

### If Location Denied:
```
🔘 Find Nearest Store button clicked
⏳ Setting loading state...
📡 Calling getUserLocation() from Radar client...
✅ Radar API key found, initializing SDK...
✅ Radar SDK initialized successfully
📍 Requesting user location...
❌ Error getting user location: [error details]
💡 User denied location permissions. Please allow location access in your browser.
```

## Checklist

1. [ ] Dev server restarted after adding API key
2. [ ] Looking at correct browser tab (the one with /stores page)
3. [ ] DevTools Console tab is open (press F12)
4. [ ] Console filter is set to "All levels"
5. [ ] No red errors in console when page loads
6. [ ] Clicked the "Find Nearest Store" button
7. [ ] Waiting a few seconds for logs to appear

## Still No Logs?

### Test if JavaScript is working at all:

1. Open Console (F12)
2. Type this and press Enter:
   ```javascript
   console.log('Test log');
   ```
3. You should see "Test log" appear

If that doesn't work, your browser console has an issue.

### Test if the button exists:

1. Open Console (F12)
2. Type this and press Enter:
   ```javascript
   document.querySelector('button')?.textContent
   ```
3. You should see button text

### Force a test log:

1. Open Console (F12)
2. Type this and press Enter:
   ```javascript
   console.log('NEXT_PUBLIC_RADAR_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_RADAR_PUBLISHABLE_KEY);
   ```
3. If it shows `undefined`, the server wasn't restarted

## Next Steps

1. **Restart the dev server** (most likely fix)
2. **Hard refresh the page** (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
3. **Clear browser cache** if needed
4. **Try in incognito/private window** to rule out extensions

---

**Most Common Fix:** Just restart the dev server!
```bash
# Press Ctrl + C to stop
npm run dev
```
