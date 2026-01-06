# Fix Next.js Image Optimization Warnings

## Warnings Fixed

### 1. Logo SVG Aspect Ratio Warning
**Warning:** `Image with src "/logo.svg" has either width or height modified, but not the other`

**Fix Applied:**
- Added `h-auto` to both logo Image components in Header.tsx
- This ensures the aspect ratio is maintained when CSS changes the size

### 2. Warner Bros Images Missing Sizes Prop
**Warning:** `Image with src "/images/warnerbroassets/..." has "fill" but is missing "sizes" prop`

**Fix Applied:**
- Added `sizes="(max-width: 768px) 48px, 56px"` to the Warner Bros floating button
- This helps Next.js optimize the image loading

### 3. Warner Bros Images LCP Warning
**Warning:** `Image with src "/images/warnerbroassets/..." was detected as the Largest Contentful Paint (LCP)`

**Note:** These images are in a floating button that appears after page load, not critical LCP. The warning can be ignored or you can add `loading="eager"` if needed.

## Additional Warnings (Info Only)

### Clerk Development Keys Warning
**Warning:** `Clerk has been loaded with development keys`

**Status:** This is expected in development. In production, use production keys from Clerk dashboard.

### Clerk Deprecated Prop Warning
**Warning:** `The prop "afterSignInUrl" is deprecated and should be replaced with "fallbackRedirectUrl"`

**Status:** This warning is from .env configuration. Update when convenient:
```bash
# In .env.local
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/account
# becomes
NEXT_PUBLIC_CLERK_FALLBACK_REDIRECT_URL=/account
```

## Impact
- ✅ Logo SVG warnings fixed
- ✅ Warner Bros image optimization improved
- ✅ Better page performance
- ⚠️ Clerk warnings are informational for development

## Testing
Run `npm run dev` and check console - the SVG warnings should be gone.

---

**Performance Note:** Adding proper `sizes` props to Next.js Image components helps the browser preload the correct image sizes, improving Core Web Vitals.
