# PageSpeed Insights – Audit Recommendations

This document summarizes findings from the PageSpeed Insights audit for **https://www.thesolitario.com/** (desktop and mobile) and provides actionable recommendations, ordered by impact and effort.

---

## Summary

| Category       | Status   | Priority |
|----------------|----------|----------|
| Performance    | Failing  | Critical |
| Accessibility  | Failing | High     |
| Best Practices | Failing | High     |
| SEO            | Pass     | Maintain |

**Core Web Vitals:** LCP and TBT are the main drivers of the “Failing” assessment; INP and CLS are acceptable but can be improved.

---

## 1. Performance

### 1.1 Core Web Vitals

- **LCP (Largest Contentful Paint)**  
  - **Current:** ~5s (mobile), ~3.9–4.1s (desktop); report shows 7.6s in some runs.  
  - **Target:** &lt; 2.5s.

**Actions:**

1. **LCP element = hero image/video**  
   - Ensure the **first** hero asset (image or poster) is the LCP candidate:
     - Use `priority` on the first hero `Image` (already used in `Hero.tsx` / `DynamicHero.tsx`).
     - If the first slide can be a **video**, add a `poster` image and use `preload="metadata"` (or `preload="none"`) so the browser doesn’t block LCP on the full video download.
   - Prefer **image-first** hero (e.g. first slide = image, video later in carousel) so LCP is a single image request.

2. **Fetch priority**  
   - For the LCP image, ensure `priority` is set (Next.js will add `fetchpriority="high"`). If you ever use a raw `<img>` for the hero, add `fetchPriority="high"` and `loading="eager"`.

3. **Reduce hero payload**  
   - Hero video: `product-hero-assets/Lab Grown Diamond ... (3).mp4` is a major contributor to payload and LCP.
   - Compress and/or shorten the video; serve in modern formats (e.g. WebM/AV1 or H.264 in MP4) with appropriate bitrate.
   - Consider lazy-loading the video (load when slide becomes active) and using a lightweight poster image for the first paint.

### 1.2 JavaScript and Main Thread

- **Total Blocking Time (TBT):** ~930 ms (target: &lt; 200 ms).  
- **Bootup time:** ~3.2 s wasted; main thread ~6.3 s.  
- **Largest first-party JS:** `_next/static/chunks/2cb2d61e511600b1.js` (high bootup + unused JS).

**Actions:**

1. **Reduce JS execution**
   - Code-split routes and heavy components (e.g. CartSidebar, WarnerBros, map, admin) so they load only when needed.
   - Lazy-load third-party scripts (e.g. Google Tag Manager / gtag) with `strategy="lazyOnload"` or after FCP/LCP.
   - Review `next.config.js` `splitChunks` (vendor, framer-motion, maplibre) and add more aggressive splitting for large pages.

2. **Unused JavaScript (~1,254 KiB potential savings)**
   - Use dynamic imports for below-the-fold and modal content (e.g. `React.lazy` + `Suspense` for SearchModal, QuickView, WarnerBros).
   - Ensure tree-shaking: import only the icons/components you use from `lucide-react` and other libraries.
   - Run bundle analyzer (`@next/bundle-analyzer`) and remove or replace heavy, unused dependencies.

3. **Minification**
   - Confirm production builds minify JS (Next.js does by default). Est. savings ~189 KiB if any non-minified assets remain.

4. **Legacy JavaScript (~24 KiB)**
   - Adjust browserslist / SWC to target modern browsers and avoid transpiling unnecessary polyfills.

### 1.3 Network and Resources

- **Total payload:** ~20,072 KiB (target: &lt; 1,600 KiB for critical path).
- **Major contributors:** hero video, large images, JS chunks, third-party (GTM, Clerk, etc.).

**Actions:**

1. **Hero video**
   - Compress and shorten; lazy-load when slide is active; use poster for first paint (see 1.1).

2. **Images**
   - **Formats:** Use AVIF/WebP (Next.js `formats: ['image/avif', 'image/webp']` is already set); ensure all hero and above-the-fold images go through `next/image`.
   - **Sizing:** Use correct `sizes` for each breakpoint so the browser doesn’t fetch oversized images (e.g. celebrity/product images).
   - **Compression:** Resize and compress PNGs/JPGs at build time or via CDN; avoid very large PNGs (e.g. celebrity images like `IMG_3236.PNG`).
   - Est. savings from “Improve image delivery”: ~649 KiB.

3. **Render-blocking CSS**
   - `_next/static/chunks/480ca1d9903a7a9a.css` and `cba24d3e704cd321.css` block initial render.
   - Inline critical above-the-fold CSS and defer non-critical CSS, or use Next.js automatic CSS optimization and ensure no large global CSS is blocking.

4. **Caching**
   - Ensure long cache for static assets (e.g. `minimumCacheTTL` for images). For third-party (e.g. Google Maps), cache where possible; est. savings ~21 KiB from better cache lifetimes.

### 1.4 Layout Shift (CLS)

- **Current:** Mobile 0.11–0.15 in some runs; desktop 0.01–0.11. One reported shift on `button.fixed.bottom-6.right-4` (WarnerBros floating button).
- Reserve space for the floating button (e.g. fixed height/width container or `min-height`/`aspect-ratio`) so it doesn’t push content when it appears. Avoid animating layout-affecting properties (width/height) without reserved space.

---

## 2. Accessibility

### 2.1 Implemented in This Pass

- **Skip links:** Added `id="navigation"` on `<header>` and `id="footer"` on `<footer>` so “Skip to navigation” and “Skip to footer” have valid targets. “Skip to main content” already targeted `#main-content`.
- **Buttons without accessible names:** Added `aria-label` to:
  - ProductRecommendations wishlist button (add/remove product name from wishlist).
  - ProductCategories wishlist button (same).
  - Footer subscribe button (`aria-label="Subscribe to newsletter"`).
- WarnerBros floating button already had `aria-label="Explore Warner Bros Collectibles"`.

### 2.2 Remaining Accessibility Work

1. **Color contrast (failing)**
   - Fix contrast for:
     - “RADIATE ELEGANCE” and other `text-[10px]` / small text on backgrounds.
     - “ALL” filter button and category pills (e.g. `text-gray-600` on light gray).
     - Footer: “Privacy Policy”, “Terms & Conditions”, “© 2025 Solitario…” (`text-ivory-pearl/70` on classic-green).
   - Aim for at least 4.5:1 for normal text, 3:1 for large text. Use DevTools or a contrast checker on each combination.

2. **Heading order**
   - Ensure a single logical outline: no skipping (e.g. h2 → h4). Fix sections that use `<h4>` (e.g. “Eco-Conscious”, “Shruti Rana”) so they follow the page’s h1 → h2 → h3 flow.

3. **Touch targets**
   - Carousel/slider controls (e.g. 6×6 px or 24×6 px) are too small. Make at least 44×44 px (or 48×48 px) with padding/spacing, or use `min-width`/`min-height` and `touch-manipulation` where applicable.

4. **Non-composited animations**
   - Warner Bros card (e.g. “Warner Bros” gradient card) uses `border-*` and `box-shadow` in animations, which can jank. Prefer `transform` and `opacity` only for animations, or use `will-change: transform` sparingly.

---

## 3. Best Practices

### 3.1 Third-Party Cookies

- **Finding:** 42 cookies (e.g. Google Maps, Clerk).  
- **Action:** Document which cookies are essential; use first-party or same-site patterns where possible; show a clear cookie/consent notice and allow users to opt out of non-essential cookies.

### 3.2 Source Maps

- **Finding:** Large first-party JS chunk (`2cb2d61e511600b1.js`) missing source maps in production.  
- **Action:** For debugging and Lighthouse stack traces, enable production source maps in development/staging or via a controlled release. Current `productionBrowserSourceMaps: false` is good for size; if you need source maps in production, consider uploading them only to Sentry and not serving them publicly.

### 3.3 Security Headers (from audit)

- **CSP:** `script-src` uses allowlists and `'unsafe-inline'`. Tighten over time: reduce `'unsafe-inline'` using nonces or hashes for known scripts; consider Trusted Types where feasible.
- **COOP:** Add `Cross-Origin-Opener-Policy: same-origin` (or a more permissive value if you rely on cross-origin windows) to mitigate cross-origin leaks.
- **HSTS:** Already present; ensure `preload` is submitted if you want HSTS preload list.

---

## 4. SEO

- **Status:** Pass.  
- **Maintain:** Meta description, canonical, structured data (Organization, Website JSON-LD), crawlable links, and correct `lang` on `<html>`.

---

## 5. Priority Checklist

**Quick wins (already done or small changes):**

- [x] Skip link targets: `id="navigation"`, `id="footer"`.
- [x] Accessible names for icon-only buttons (wishlist, subscribe).
- [x] Contrast: Footer and “ALL”/category pill text; “RADIATE ELEGANCE” and small labels.
- [x] Touch target size for carousel/slider controls (min 44×44 px).
- [x] Heading order: fix h4 usage so outline is sequential.

**High impact (performance):**

- [x] Hero: First slide = image (not video); add poster + lazy-load video (video only mounts when that slide is active; `preload="metadata"`).
- [x] LCP image: Keep `priority` on first hero image; ensure no video blocks it (video not in DOM until user reaches that slide).
- [x] Defer or lazy-load GTM/gtag and other third-party scripts (Google Ads, GA, Meta Pixel use `strategy="lazyOnload"`).
- [x] Code-split and lazy-load heavy components (CartSidebar → LazyCartSidebar; WarnerBros → dynamic import; SearchModal → dynamic, mounts when open).
- [x] Reduce unused JS: bundle analyzer wired (`npm run analyze`); LoginPopup lazy-loaded on homepage.
- [ ] Image delivery: correct `sizes`, AVIF/WebP, compress large PNGs/JPGs (excluded per request).

**Medium effort:**

- [x] WarnerBros floating button: entrance animation changed from scale 0→1 to opacity-only to avoid CLS.
- [ ] Non-critical CSS: inline critical, defer rest.
- [x] COOP header added (`Cross-Origin-Opener-Policy: same-origin` in `next.config.js`).
- [x] Browserslist set to modern targets (`defaults`, `not ie 11`) to reduce legacy JS.
- [x] ScrollReveal cards: GPU layer hint and transition scope to reduce non-composited animation jank.
- [x] Cookie notice: bottom bar with Accept all / Essential only and link to Privacy Policy (see `components/ui/CookieConsent.tsx`).

**Ongoing:**

- [ ] Monitor LCP, TBT, and CLS in production (e.g. RUM or CrUX).
- [ ] Re-run PageSpeed (mobile + desktop) after each major change.

---

## 6. File Reference (for implementation)

| Topic              | Files / areas |
|--------------------|----------------|
| Skip links         | `components/ui/SkipLink.tsx`, `app/layout.tsx`, `Header.tsx`, `Footer.tsx` |
| Hero / LCP         | `components/home/Hero.tsx`, `components/home/DynamicHero.tsx` |
| Wishlist buttons   | `components/product/ProductRecommendations.tsx`, `components/home/ProductCategories.tsx` |
| Footer             | `components/layout/Footer.tsx` |
| WarnerBros button  | `components/ui/WarnerBrosFloatingButton.tsx` |
| Security headers   | `next.config.js` → `headers()` |
| Scripts (GTM, etc.)| `app/layout.tsx` (Script strategy) |
| Images             | All `next/image` usage; `next.config.js` `images` |
| Bundle             | `next.config.js` `webpack`; consider `@next/bundle-analyzer` |

---

*Document generated from PageSpeed Insights audit (desktop + mobile) and codebase review. Re-run the audit after implementing changes to validate improvements.*
