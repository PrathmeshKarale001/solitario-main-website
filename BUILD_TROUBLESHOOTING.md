# Build Error Troubleshooting - useSearchParams Suspense Boundary

## Current Issue
The build is failing with:
```
useSearchParams() should be wrapped in a suspense boundary at page "/account/addresses"
```

## What We've Tried
1. ✅ Added `export const dynamic = 'force-dynamic'` to the page
2. ✅ Wrapped the page content in Suspense
3. ✅ Moved the dynamic export to the correct position

## Possible Root Causes
1. A child component is using useSearchParams without Suspense
2. The ScrollToTopOnRouteChange component (imported in layout.tsx) might be the issue
3. Some other imported component might be using useSearchParams

## Next Steps to Debug
1. Temporarily remove all imports and test
2. Check each imported component for useSearchParams usage
3. Consider wrapping the entire app in a Suspense boundary

## Current Status
- The error persists despite adding dynamic rendering
- Need to identify which component is actually using useSearchParams

## Note
This error suggests that somewhere in the component tree, useSearchParams is being called without being wrapped in Suspense.
