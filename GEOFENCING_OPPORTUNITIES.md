# Geofencing Integration Opportunities

This document outlines all the places where Radar Geofencing has been integrated and additional opportunities for location-based features.

## ✅ Implemented Features

### 1. **Find Nearest Store** (`/components/stores/NearestStore.tsx`)
- **Location**: Stores page, Home page
- **Features**:
  - Real-time user location detection via Radar API
  - Accurate distance calculations using Haversine formula
  - Travel time estimates (by car) using Radar Distance API
  - Shows top 3 nearest stores with full details
  - Graceful error handling for location permissions
  - Caches location for 5 minutes to reduce API calls

### 2. **Store Availability Checker** (`/components/stores/StoreAvailability.tsx`)
- **Location**: Can be added to product detail pages
- **Features**:
  - Check if product is available at nearest store
  - One-click "Find in Store" functionality
  - Shows distance and travel time
  - Direct link to get directions

### 3. **Geofencing Hook** (`/hooks/useGeofencing.ts`)
- **Purpose**: Reusable React hook for location-based features
- **Features**:
  - Track user location automatically or on-demand
  - Detect if user is near a store (within configurable radius)
  - Find nearest store from user's location
  - Calculate distance to stores
  - Error handling and loading states

### 4. **Radar Client Library** (`/lib/radar-client.ts`)
- **Purpose**: Centralized Radar SDK integration
- **Functions**:
  - `getUserLocation()` - Get user's current location
  - `trackUserLocation()` - Track and send location to Radar
  - `calculateDistance()` - Get distance and travel time between two points
  - `findNearestStoresWithRadar()` - Find nearest stores with travel times
  - `searchNearbyGeofences()` - Search for geofences near a location
  - `forwardGeocode()` - Convert address to coordinates
  - `reverseGeocode()` - Convert coordinates to address
  - `ipGeocode()` - Get location from IP address
  - `autocompleteAddress()` - Address autocomplete
  - `checkIfNearStore()` - Check if user is within radius of a store

## 🎯 Additional Opportunities

### 5. **Product Detail Pages** (Recommended)
**File**: `/app/products/[handle]/page.tsx`

**Implementation**:
```tsx
import StoreAvailability from '@/components/stores/StoreAvailability';

// Add to product page
<StoreAvailability productName={product.title} />
```

**Benefits**:
- Show if product is available at nearby stores
- Encourage in-store visits
- Reduce shipping costs for customers
- Drive foot traffic to physical locations

### 6. **Shopping Cart - Store Pickup Option** (High Value)
**File**: `/app/cart/page.tsx` or checkout flow

**Features to Add**:
- "Pick up at store" option during checkout
- Show nearest store with availability
- Reserve items for pickup
- Estimated pickup time based on distance

**Implementation**:
```tsx
import { useGeofencing } from '@/hooks/useGeofencing';

const { nearestStore, distance, trackLocation } = useGeofencing();

// Add pickup option in cart
{nearestStore && (
  <div>
    <input type="radio" name="delivery" value="pickup" />
    <label>
      Pick up at {nearestStore.name} ({formatDistance(distance)})
    </label>
  </div>
)}
```

### 7. **Location-Based Promotions** (Marketing)
**File**: Create `/components/promotions/LocationPromotion.tsx`

**Features**:
- Show special offers when user is near a store
- "Visit us today" promotions with geofencing
- Store-specific discounts
- Event notifications (new store openings, sales)

**Example**:
```tsx
const { isNearStore, nearestStore } = useGeofencing({ 
  autoTrack: true,
  nearbyRadiusKm: 2 
});

if (isNearStore) {
  return (
    <Banner>
      You're near {nearestStore.name}! 
      Visit today for 10% off in-store purchases.
    </Banner>
  );
}
```

### 8. **Store Locator with Map** (Enhanced UX)
**File**: `/app/(public)/stores/page.tsx`

**Features to Add**:
- Interactive map showing all stores
- User's current location marker
- Click on store to see details
- Filter stores by distance
- Route visualization

**Libraries**:
- Use Radar Maps SDK
- Or integrate with Mapbox/Google Maps

### 9. **Appointment Booking** (High-End Jewelry)
**File**: Create `/app/appointments/page.tsx`

**Features**:
- Book consultation at nearest store
- Show available time slots
- Automatic store selection based on location
- Calendar integration

### 10. **Store Events & Workshops**
**File**: Create `/app/events/page.tsx`

**Features**:
- Show events at nearby stores
- Filter by distance
- "Events near you" section
- RSVP functionality

### 11. **Delivery Time Estimates**
**File**: Checkout pages

**Features**:
- Show estimated delivery time based on user location
- Compare delivery vs pickup times
- Dynamic shipping cost based on distance

### 12. **Store Hours & Status**
**File**: Enhance store data

**Features**:
- Real-time "Open Now" / "Closed" status
- Show hours for user's timezone
- Holiday hours
- Busy times indicator

### 13. **Virtual Try-On Location Sharing**
**File**: AR/Virtual try-on features

**Features**:
- After virtual try-on, suggest nearest store
- "Try in person at [Store Name]"
- Book appointment to see the item

### 14. **Wishlist with Store Availability**
**File**: `/app/wishlist/page.tsx`

**Features**:
- Show which wishlist items are available nearby
- "Available at [X] stores near you"
- Notify when item becomes available at nearby store

### 15. **Store Performance Analytics** (Admin)
**File**: Admin dashboard

**Features**:
- Track foot traffic via geofencing
- Conversion rates by store
- Popular stores by region
- Customer journey analysis

## 📊 Geofencing Events to Track

### Entry Events
- User enters store geofence (200m radius)
- Trigger: Welcome notification
- Action: Show special in-store offer

### Exit Events
- User leaves store geofence
- Trigger: Feedback request
- Action: "How was your visit?" survey

### Dwell Time
- User spends time near store
- Trigger: After 5 minutes nearby
- Action: "Come inside for exclusive deals"

### Conversion Events
- User visits store after seeing online product
- Track: Online-to-offline attribution
- Measure: Effectiveness of digital marketing

## 🔧 Technical Implementation Guide

### Setup Geofences in Radar Dashboard

For each store, create a geofence:

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

### Webhook Integration

Set up webhooks to receive geofence events:

1. Go to: https://dashboard.radar.com/webhooks
2. Add endpoint: `https://yourdomain.com/api/radar/webhook`
3. Select events: `user.entered_geofence`, `user.exited_geofence`

### Example Webhook Handler

```typescript
// app/api/radar/webhook/route.ts
export async function POST(request: Request) {
  const event = await request.json();
  
  if (event.type === 'user.entered_geofence') {
    // User entered store geofence
    const storeId = event.geofence.externalId;
    const userId = event.user.userId;
    
    // Send push notification
    await sendNotification(userId, {
      title: 'Welcome to Solitario!',
      body: 'Show this notification for 10% off your purchase today.'
    });
  }
  
  return Response.json({ received: true });
}
```

## 📱 Mobile App Opportunities

If you build a mobile app in the future:

### Background Tracking
- Track user location in background
- Send notifications when near stores
- Automatic check-ins

### Beacon Integration
- Place Bluetooth beacons in stores
- Trigger events when user enters specific sections
- Product recommendations based on location in store

### Loyalty Program
- Automatic points for store visits
- Gamification: "Visit 5 stores, get reward"
- VIP experiences for frequent visitors

## 🎨 UI/UX Enhancements

### Location Permission Flow
1. Explain benefits before requesting permission
2. Show example of what user will see
3. Provide fallback (manual city selection)
4. Remember user's choice

### Loading States
- Skeleton screens while loading location
- Animated map markers
- Smooth transitions

### Error Handling
- Clear error messages
- Retry buttons
- Alternative options (browse all stores)

## 📈 Success Metrics

### Track These KPIs:
- Location permission opt-in rate
- "Find Nearest Store" usage
- Store visit conversion rate
- Online-to-offline attribution
- Average distance to nearest store
- Store pickup vs delivery ratio

## 🔐 Privacy & Compliance

### Best Practices:
- ✅ Clear privacy policy
- ✅ Explain why location is needed
- ✅ Allow users to opt-out
- ✅ Don't track without permission
- ✅ Secure API keys
- ✅ GDPR/CCPA compliance
- ✅ Data retention policies

## 🚀 Quick Wins (Implement First)

1. **Store Availability on Product Pages** (30 min)
   - Add `<StoreAvailability />` component
   - High conversion impact

2. **Store Pickup Option in Cart** (1-2 hours)
   - Add pickup option
   - Show nearest store
   - Save on shipping

3. **Location-Based Promotions** (1 hour)
   - Show banner when near store
   - Increase foot traffic

4. **Enhanced Store Locator** (2-3 hours)
   - Add map view
   - Better filtering
   - Improved UX

## 📚 Resources

- Radar Documentation: https://docs.radar.com
- Radar Dashboard: https://dashboard.radar.com
- API Reference: https://docs.radar.com/api
- Web SDK: https://docs.radar.com/sdk/web
- Support: https://radar.com/support

---

**Last Updated**: January 6, 2026
**Integration Status**: ✅ Core features implemented
**Next Steps**: Add to product pages and checkout flow
