# Warner Bros Hero Image Hidden

## What Was Done
The Warner Bros hero image has been hidden from the home page hero carousel when the collectibles feature is disabled.

### Location
- File: `/components/home/Hero.tsx`
- Arrays: `HERO_MEDIA_DESKTOP` and `HERO_MEDIA_MOBILE`

### Implementation
```typescript
// Before
const HERO_MEDIA_DESKTOP = [
  { src: '/images/HOMEBanner5.jpg', pos: 'object-center' },
  { src: '/images/home-hero/newhero/1st.png', pos: 'object-center' }, // Warner Bros
  // ... other images
];

// After
const HERO_MEDIA_DESKTOP = [
  { src: '/images/HOMEBanner5.jpg', pos: 'object-center' },
  // Filter out Warner Bros hero when collectibles disabled
  ...(process.env.NEXT_PUBLIC_FEATURE_COLLECTIBLES_ENABLED === 'true' ? [{
    src: '/images/home-hero/newhero/1st.png', 
    pos: 'object-center',
  }] : []),
  // ... other images
];
```

### Images Hidden
- Desktop: `/images/home-hero/newhero/1st.png`
- Mobile: `/images/home-hero/newhero/1stMobile.png`

### Why This Approach
- Uses the same feature flag as other collectibles
- Maintains array structure for smooth transitions
- No breaking changes to the carousel logic
- Easy to enable later without code changes

### Current Status
- ✅ Warner Bros hero is HIDDEN from carousel
- ✅ Feature flag = false
- ✅ Carousel continues with other images
- ✅ Ready for production

### To Enable Later
When ready to launch collectibles:
1. Set `NEXT_PUBLIC_FEATURE_COLLECTIBLES_ENABLED=true` in production
2. Warner Bros hero will automatically appear in carousel

---

**Note:** The hero images are filtered at the array level, ensuring they never render when the feature is disabled.
