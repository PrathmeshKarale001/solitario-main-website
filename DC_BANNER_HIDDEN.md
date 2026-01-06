# DC Banner Hidden - Shop Page

## What Was Done
The DC banner slider has been hidden from the shop page using the same feature flag system as the collectibles.

### Location
- File: `/app/products/page.tsx`
- Line: 301
- Component: `<DCBannerSlider />`

### Implementation
```typescript
// Before
<DCBannerSlider />

// After
{process.env.NEXT_PUBLIC_FEATURE_COLLECTIBLES_ENABLED === 'true' && <DCBannerSlider />}
```

### Why This Approach
- Uses the same feature flag as other collectibles
- Consistent with Warner Bros hiding strategy
- Easy to enable later without code changes
- Banner will appear when collectibles are launched

### Current Status
- ✅ DC Banner is HIDDEN
- ✅ Feature flag = false
- ✅ Ready for production

### To Enable Later
When ready to launch collectibles:
1. Set `NEXT_PUBLIC_FEATURE_COLLECTIBLES_ENABLED=true` in production
2. DC banner will automatically appear on shop page

---

**Note:** The banner component still exists in code, just hidden from rendering when the feature is disabled.
