# Build Error Fixed - Warner Bros Page

## Problem
Vercel build was failing with:
```
Error: Failed to collect configuration for /warner-bros
Error: NEXT_HTTP_ERROR_FALLBACK;404
```

## Root Cause
The `notFound()` was being called at the module level (outside the component), which caused Next.js to fail during the build process when trying to collect page data.

## Solution Implemented

### 1. Created Redirect Component
- File: `/components/ui/Redirect.tsx`
- Client component that handles redirects safely
- Uses `router.replace()` for navigation

### 2. Updated Warner Bros Page
- Moved the feature flag check inside the component
- Returns `<Redirect to="/" />` instead of calling `notFound()`
- Page now redirects to home when collectibles are disabled

### Code Changes
```typescript
// Before (causing build error)
if (process.env.NEXT_PUBLIC_FEATURE_COLLECTIBLES_ENABLED !== 'true') {
  notFound();
}

// After (build-friendly)
export default function WarnerBrosPage() {
  if (process.env.NEXT_PUBLIC_FEATURE_COLLECTIBLES_ENABLED !== 'true') {
    return <Redirect to="/" />;
  }
  // ...
}
```

## Benefits
- ✅ Build now passes successfully
- ✅ Users are gracefully redirected to home
- ✅ No 404 errors during build
- ✅ Feature flag still works as expected

## Current Status
- ✅ All collectibles CTAs hidden
- ✅ Warner Bros page redirects to home
- ✅ Build error resolved
- ✅ Ready for production deployment

---

**Note:** This approach is more user-friendly than showing a 404 page when the feature is disabled.
