# SPEC.md — The Solitario Website Enhancement

**Status:** FINALIZED
**Date:** 2026-02-28
**Domain:** thesolitario.com

---

## Overview

Enhance The Solitario luxury lab-grown diamond jewellery website across three strategic areas:

1. **Order Tracking & Notifications** — Real-time order status tracking with email/WhatsApp notifications
2. **Performance Optimizations** — Improve Core Web Vitals (LCP, CLS, INP) for faster load times
3. **Google Search Optimization** — Rank for "The Solitario", "Solitario", and "Lab Grown Diamonds"

---

## Feature Requirements

### 1. Order Tracking & Notifications

**Current state:** Basic orders page (`app/(public)/account/orders/page.tsx`) with Shopify data fetch. Shows 4 statuses: processing, shipped, delivered, cancelled. No tracking details or notifications.

**Requirements:**
- Order detail page with tracking timeline (step-by-step progress visualization)
- Real-time tracking info display (carrier, tracking number, estimated delivery)
- Order status change notifications via email (using Resend — already in dependencies)
- Order confirmation page after successful checkout
- Link to tracking from order confirmation emails

### 2. Performance Optimizations

**Current state:** Dynamic imports for below-fold components, lazy-loaded analytics scripts, bundle analyzer, sharp for images, Sentry tree-shaking.

**Requirements:**
- Optimize Largest Contentful Paint (LCP) — hero images, font loading
- Reduce Cumulative Layout Shift (CLS) — explicit image dimensions, skeleton placeholders
- Improve Interaction to Next Paint (INP) — debounce handlers, reduce main thread work
- Optimize image delivery — WebP/AVIF formats, responsive srcsets, priority hints
- Reduce JavaScript bundle size — code splitting, tree shaking audit
- Preconnect/prefetch critical resources

### 3. Google Search Optimization

**Current state:** Meta tags in layout.tsx, Open Graph + Twitter Cards, Organization/WebSite JSON-LD on homepage, Product JSON-LD on PDPs, BreadcrumbList, LocalBusiness, FAQ schema. Sitemap with dynamic product URLs.

**Target keywords:** "The Solitario", "Solitario", "Lab Grown Diamonds", "Lab Grown Diamond Jewellery"

**Requirements:**
- Per-page unique meta descriptions for all category pages
- Blog post structured data (Article schema)
- Enhanced Product JSON-LD with aggregateRating, review markup
- Category page (CollectionPage) structured data
- Canonical URLs on every page (especially category + product pages)
- Internal linking strategy — breadcrumbs on all pages
- Image SEO — descriptive alt tags, image sitemaps
- Dedicated landing page content for "Lab Grown Diamonds" (existing at `/lab-grown-diamonds`)

---

## Tech Stack (Existing)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 |
| Auth | Clerk |
| CMS | Sanity |
| Payments | Razorpay |
| Email | Resend |
| Styling | Tailwind CSS 3 |
| Analytics | GA, PostHog, Vercel Analytics, Meta Pixel |
| Monitoring | Sentry |
| Hosting | Vercel |

---

## Non-Requirements

- No new third-party services for SMS (out of scope for now)
- No redesign of existing UI — incremental improvements only
- No migration away from current tech stack
