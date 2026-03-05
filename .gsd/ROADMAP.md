# ROADMAP.md — The Solitario Website Enhancement

**Created:** 2026-02-28
**Spec:** .gsd/SPEC.md (FINALIZED)

---

## Milestone 1: Website Enhancement — SEO, Performance & Order Tracking

### Phase 1: Google Search Optimization (SEO)
**Priority:** High — directly impacts discoverability for target keywords.
**Scope:**
- Add per-page unique metadata for all category pages (rings, earrings, necklaces, bracelets, pendants)
- Add Article JSON-LD schema for blog posts
- Add CollectionPage JSON-LD for category listing pages
- Add canonical URLs to all pages
- Add breadcrumbs on category and product pages
- Enhance Product JSON-LD with aggregateRating
- Optimize image alt tags across product and category pages
- Enhance `/lab-grown-diamonds` landing page content and metadata

### Phase 2: Performance Optimizations
**Priority:** High — impacts user experience and Google ranking (Core Web Vitals).
**Scope:**
- Optimize LCP: hero image priority hints, font-display swap, preconnect to critical domains
- Reduce CLS: explicit width/height on all images, skeleton loaders for dynamic content
- Reduce bundle size: audit and code-split heavy dependencies (framer-motion, maplibre-gl, react-pdf)
- Optimize images: ensure WebP/AVIF via Next.js Image component, add responsive srcsets
- Preconnect/prefetch: critical third-party domains (CDN, Sanity, Shopify, Clerk)
- Defer non-critical JavaScript: lazy-load analytics, chat widgets

### Phase 3: Order Tracking & Notifications
**Priority:** Medium — improves post-purchase experience.
**Scope:**
- Create order detail page with tracking timeline component
- Display carrier info, tracking number, estimated delivery date
- Build order confirmation page after checkout
- Send order confirmation email via Resend
- Send shipping notification email with tracking link via Resend
- Add webhook handler for Shopify order status updates

---

## Phase Status

| Phase | Name | Status |
|-------|------|--------|
| 1 | Google Search Optimization | Not started |
| 2 | Performance Optimizations | Not started |
| 3 | Order Tracking & Notifications | Not started |
