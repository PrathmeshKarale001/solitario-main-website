# Solitario Website - Production Performance Audit Report
**Date:** December 19, 2024
**Target:** Core Web Vitals Optimization (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1)

---

## Phase 1: Current State Analysis

### Build Analysis
- **Build Time:** 3.1s compile + 4.1s TypeScript (Acceptable)
- **Static Pages:** 58 routes generated
- **Route Types:** Mix of static (○) and dynamic (ƒ) pages

### Bundle Size Analysis (Top 10 Chunks)
1. `8008d994f91f0fb6.js` - 212KB (CRITICAL - needs investigation)
2. `a81c8c328a3c2a7e.js` - 116KB 
3. `b515926bda189fe5.js` - 112KB
4. `a6dad97d9634a72d.js` - 112KB
5. `2bb83fde8d8eab00.js` - 92KB
6. `4b77dcde68464653.js` - 84KB
7. `9f576658efa5ec74.js` - 64KB
8. `b1491710240be106.js` - 60KB
9. `6aae91f3bf06cf4d.js` - 60KB
10. `234543b73b0c773c.js` - 60KB

**Total top 10:** ~972KB of JavaScript

---

## Phase 2: Identified Issues & Optimization Backlog

### 🔴 CRITICAL - LCP Impact (Immediate Action Required)

#### 1. Image Optimization Issues
**Problem:** 47 JPG files + 43 PNG files in `/public` not optimized
- Hero images are large JPG/PNG files (uncompressed)
- No WebP/AVIF variants
- Missing width/height attributes could cause CLS

**Files Requiring Optimization:**
- `/public/images/HERO BANNER 1.jpg` → Large hero image
- `/public/images/HERO BANNER 2.jpg` → Large hero image  
- `/public/images/HERO BANNER 4.jpg` → Large hero image
- `/public/images/Hero_Mobile/*.jpg` → Mobile hero images
- `/public/images/Shop/*.jpg` → Shop page hero
- `/public/about/*.jpg` → About page images
- `/public/carouselgrid/*.jpg` → Carousel images
- All PNG files in `/public/images/products/` → Product images

**Impact on LCP:** HIGH - Hero images are LCP elements
**Recommended Actions:**
1. Convert all JPG/PNG to WebP (60-80% size reduction)
2. Generate AVIF variants for modern browsers (additional 20-30% reduction)
3. Compress existing images using ImageOptim/Squoosh
4. Add `priority` loading to above-fold hero images
5. Specify `width` and `height` for all images

#### 2. Font Loading Not Optimal
**Problem:** Using Google Fonts via `next/font` but loading Montserrat twice
- Montserrat loaded for body text (weights: 400, 500, 600)
- Montserrat loaded again for Gotham variable (weights: 400, 500)
- Playfair Display for headings (weights: 400, 500, 600, 700)

**Current Code (layout.tsx lines 29-43):**
```typescript
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '500', '600'], // 3 weights
})

const gotham = Montserrat({  // DUPLICATE!
  subsets: ['latin'],
  variable: '--font-gotham',
  display: 'swap',
  weight: ['400', '500'], // 2 more weights
})
```

**Impact on LCP:** MEDIUM - Font loading delays render
**Recommended Actions:**
1. Consolidate Montserrat into single font instance
2. Use font-weight CSS for different weights
3. Reduce Playfair weights from 4 to 2 most used
4. Add `preload` hint for critical fonts
5. Consider self-hosting fonts for <100ms load time

#### 3. Client-Side Components Overuse
**Problem:** 66 components using `'use client'` directive
- Many could be Server Components
- Increases hydration cost (INP impact)
- Larger client bundle size

**Heavy Client Components Identified:**
- `components/home/Hero.tsx` - Video/Image carousel (unavoidable)
- `components/layout/Header.tsx` - Navigation (necessary)
- `components/ui/SmoothScroll.tsx` - Lenis smooth scroll (REMOVABLE on mobile)
- All product-related components are client-side
- `components/effects/Aurora.tsx` - 3D effects (DEFERRABLE)

**Impact on INP:** HIGH - Heavy hydration
**Recommended Actions:**
1. Convert static sections to Server Components
2. Lazy load below-fold client components
3. Defer non-critical interactive elements
4. Use `dynamic()` with `ssr: false` for heavy components

#### 4. Smooth Scroll Library (Lenis)
**Problem:** SmoothScroll component runs on every page load
- Adds ~20KB to client bundle
- Runs RAF loop continuously (performance cost)
- Already disabled on mobile (good!) but still loads

**Current Implementation:**
```typescript
// Disabled on mobile but library still loads
const isMobile = window.matchMedia('(max-width: 768px)').matches;
if (isMobile) return;
```

**Impact on INP:** MEDIUM - Continuous RAF loop
**Recommended Actions:**
1. Only import Lenis on desktop using dynamic import
2. Remove from layout.tsx wrapper for mobile users
3. Consider removing entirely for Lighthouse optimization

---

### 🟡 MEDIUM Priority - INP & CLS Impact

#### 5. Large CSS File
**Problem:** `globals.css` is 436 lines with many custom utilities
- Heavy custom animations
- Many unused utility classes
- Large shadow definitions

**Impact on LCP:** LOW-MEDIUM - Render blocking CSS
**Recommended Actions:**
1. Split into critical and non-critical CSS
2. Inline critical CSS in `<head>`
3. Defer non-critical styles

#### 6. Dynamic Imports Not Used Consistently
**Problem:** Home page uses dynamic imports (good!) but other pages don't
- `/products/page.tsx` - All imports are static
- `/stores/page.tsx` - No dynamic imports
- `/about/page.tsx` - No dynamic imports

**Impact on LCP/INP:** MEDIUM
**Recommended Actions:**
1. Apply dynamic imports to all below-fold components
2. Add loading placeholders to prevent CLS

#### 7. Missing Image Dimensions
**Problem:** Many `<Image>` components missing explicit dimensions
- Could cause CLS when images load
- No `placeholder="blur"` for above-fold images

**Impact on CLS:** HIGH
**Recommended Actions:**
1. Add width/height to all images
2. Add blur placeholders for hero images
3. Reserve space for dynamic content

---

### 🟢 LOW Priority - Polish & Future Optimization

#### 8. Third-Party Scripts
- Google Analytics loads synchronously
- No resource hints for external domains

#### 9. API Route Optimization
- No caching headers on `/api/products`
- Could use ISR for product data

#### 10. Middleware Deprecation Warning
```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
```

---

## Phase 3: Implementation Roadmap

### Sprint 1: LCP Fixes (Highest Impact)
1. ✅ Audit complete
2. ⏳ Optimize hero images (WebP conversion + compression)
3. ⏳ Consolidate font loading
4. ⏳ Add `priority` to LCP images
5. ⏳ Convert static components to Server Components

### Sprint 2: INP Improvements
1. ⏳ Optimize Lenis smooth scroll
2. ⏳ Lazy load heavy components
3. ⏳ Reduce client component count
4. ⏳ Defer Aurora effects

### Sprint 3: CLS Fixes
1. ⏳ Add image dimensions
2. ⏳ Add blur placeholders
3. ⏳ Reserve space for dynamic content

### Sprint 4: Final Polish
1. ⏳ Split CSS (critical/non-critical)
2. ⏳ Add resource hints
3. ⏳ Optimize API routes with caching
4. ⏳ E2E testing

---

## Expected Impact

### Before (Estimated Current State)
- **LCP:** 3.5-4.5s (hero images unoptimized)
- **INP:** 250-350ms (heavy hydration)
- **CLS:** 0.15-0.25 (missing dimensions)

### After (Target State)
- **LCP:** ≤ 2.0s (optimized images + fonts)
- **INP:** ≤ 150ms (reduced hydration)
- **CLS:** ≤ 0.05 (stable layout)

**Lighthouse Score Target:** 90+ (mobile), 95+ (desktop)

---

## Next Steps
1. Start with image optimization (biggest impact)
2. Font consolidation (quick win)
3. Client component audit (systematic)
4. Re-measure with Lighthouse after each phase
