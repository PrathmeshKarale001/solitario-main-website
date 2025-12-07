# Shopify Headless Integration Plan (Shopify Basic)

This document details how to integrate Shopify Headless into the existing Next.js site (App Router, TypeScript, Tailwind).

## Implementation Status

### ✅ Completed
- Shopify client (Storefront + Admin APIs) with GraphQL queries/mutations
- Product data fetching with fallback to local data
- Cart via Storefront API with httpOnly cookie for cart ID
- Checkout redirect to Shopify hosted checkout
- NextAuth.js with Google SSO + email/password via Shopify Customer Accounts
- Shopify customer upsert on Google login via Admin API
- Webhook endpoints for orders/products with HMAC verification
- Auth pages (login, signup, account dashboard)
- Header with session-aware account link

### 🔄 Pending
- Search integration (Algolia/Typesense)
- Analytics pipeline (RudderStack/Segment)
- Cache revalidation on webhooks
- Order history in account page
- Password reset flow
- Returns/RMA flow

## 0) Assumptions & Constraints
- Plan: **Shopify Basic** (no Checkout UI extensions; hosted Shopify Checkout required).
- APIs: Storefront API for storefront, Admin API + webhooks via private app.
- Frontend: keep current Next.js app; no Hydrogen.
- Payments: Shopify Checkout using Shopify Payments/Stripe/Razorpay (per region availability).
- Hosting: Vercel (frontend + API routes/webhooks) unless specified otherwise.

## 1) Data Ownership & Sources of Truth
- **Shopify Admin**: products, variants, pricing, collections, discounts, customers, orders, refunds/returns.
- **Frontend data**: Storefront API (products, collections, cart, checkout, customer).
- **Optional sidecar** (Postgres): audit logs, custom data models, event sink for advanced analytics (not required for Basic).
- **Search**: Algolia/Typesense index fed from Shopify data and/or webhooks.
- **Content**: keep current static content; optionally add CMS (Sanity/Contentful) or Shopify metaobjects for structured marketing content.

## 2) Authentication (Customers)
- Use **Shopify Customer Accounts (Classic)** via Storefront API.
- Flows:
  - Signup: `customerCreate`; optional email verification.
  - Login: `customerAccessTokenCreate`; store token in HttpOnly cookie; refresh with `customerAccessTokenRenew`.
  - Password reset: Storefront API mutation; email sent via Shopify.
- Frontend work:
  - Auth context (server actions/route handlers) managing access token cookie.
  - Protected routes: account dashboard (orders, addresses).
- Admin/staff: continue using Shopify Admin; no custom admin on Basic unless sidecar is added.
- **Google SSO (headless-friendly approach on Basic)**:
  - Use an external IdP (e.g., NextAuth.js with Google, or Clerk/Auth0) for authentication.
  - On Google login, upsert the customer in Shopify via **Admin API** (email/name) and store the Shopify customer ID in your session/db.
  - Maintain the IdP session in an HttpOnly cookie; associate it with the Shopify customer ID.
  - Use the stored Shopify customer ID + Storefront API to fetch customer data and orders.
  - Keep Shopify email/password as fallback if desired. Note: Classic accounts do not support adding Google SSO directly inside Shopify; this headless pattern provides Google login while keeping Shopify as order/customer source of truth.

## 3) Catalog & Merchandising
- Model products/variants/options in Shopify; use metafields for specs (metal, stone, size, certifications).
- Collections for categories; price rules/discounts in Shopify.
- Replace local demo data with Storefront API queries on Home/PLP/PDP.
- Caching: ISR/Next cache for catalog pages; revalidate on product/inventory webhooks.

## 4) Cart & Checkout
- Cart: Storefront API cart endpoints; cart ID stored in cookie.
- Checkout: Create checkout via Storefront API and redirect to **hosted Shopify Checkout** (Basic requirement).
- Discounts: apply codes via Shopify; expose input on cart.
- Shipping/Tax: configured in Shopify; flows through checkout automatically.
- Edge cases: handle OOS, price changes, abandoned checkout (optional email app).

## 5) Orders, Returns, Refunds
- Source of truth: Shopify Admin → Orders.
- Customer account pages: fetch orders via Storefront API (requires customer token).
- Returns/RMAs: prefer an app (e.g., Loop). If manual: intake form → support; refunds processed in Shopify Admin.
- Refunds: executed in Shopify; surface status in order history via Storefront API.
- Notifications: Shopify email or app (Klaviyo/Omnisend).

## 6) Payments
- Fully handled in Shopify Checkout (Shopify Payments/Stripe/Razorpay regionally).
- No card handling in Next.js; rely on checkout redirect.
- Webhooks confirm payment and update order state.

## 7) Webhooks & Sync
- Private app webhooks: `orders/create`, `orders/paid`, `orders/fulfilled`, `products/update`, `variants/update`, `inventory_levels/update`.
- Next.js route handlers for webhook endpoints with HMAC verification.
- On webhook:
  - Invalidate/revalidate ISR caches.
  - (Optional) Mirror to Postgres and/or update search index.
  - Emit analytics events.

## 8) Search & Discovery
- Prefer Algolia/Typesense over native search.
- Sync strategy: webhook trigger → queue → index update; periodic backfill if needed.
- Frontend: autocomplete, facets, typo tolerance using search SDK.

## 9) Content Strategy
- Option A: keep current static marketing content in repo.
- Option B: Shopify metaobjects for structured sections.
- Option C: add a headless CMS (Sanity/Contentful) for richer marketing control.

## 10) Analytics & Reporting
- Built-in Shopify reports: sales, orders, top products; visible to client in Admin.
- Enhanced analytics (recommended):
  - Instrument events (view_product, add_to_cart, checkout_start, purchase) via RudderStack/Segment.
  - Land in warehouse (BigQuery/Postgres) and build Metabase dashboards (GMV, AOV, funnel, retention, repeat purchase, LTV, returns).
  - Capture UTM/referrer and pass through checkout; join to orders in warehouse.
- Observability: Sentry for errors; Logtail/Datadog for webhook logs.

## 11) Security & Performance
- HttpOnly cookies for customer tokens; CSRF for any custom POST endpoints.
- Rate limiting on API routes (Upstash Redis).
- Strict HMAC verification on webhooks.
- ISR/caching strategy for catalog; avoid excessive Storefront API calls.

## 12) Rollout Steps (Sequenced)
1. Shopify store setup: products, collections, discounts, shipping, tax, payments.
2. Create Storefront API credentials; test queries.
3. Wire Next.js data fetching (Home/PLP/PDP) from Shopify; remove local demo data.
4. Implement cart + checkout redirect; add discount code handling.
5. Implement customer auth (signup/login/reset) and account pages (orders, addresses).
6. Configure webhooks; add cache revalidation and optional sync to search/index/sidecar DB.
7. Add returns app or interim manual returns flow.
8. Instrument analytics; add Sentry/logging.
9. QA edge cases (stock, price changes, checkout redirect, webhook resilience).
10. Launch.

## 13) Optional Sidecar (When Needed)
- Postgres for audit logs, custom data models, richer admin dashboards.
- Redis for rate limiting/sessions/queues.
- Search index and warehouse pipelines operate from webhooks + sidecar.

## 14) SEO Foundations (Headless + Shopify)
- **Technical**: proper meta tags per page/collection/PDP; Open Graph/Twitter cards; canonical URLs; XML sitemap + robots.txt; hreflang if multi-region; structured data (Product, BreadcrumbList, Organization) injected on SSR.
- **Performance**: optimize LCP/INP/CLS; use Next/Image; cache/ISR on catalog pages; limit client JS; prefetch key routes; serve fonts efficiently.
- **Content**: unique titles/descriptions; collection copy blocks; PDP rich content (materials, care, certifications); FAQ schema blocks where relevant.
- **Internal linking**: related products, featured collections, footer/nav links to key categories; avoid orphan pages.
- **Index hygiene**: noindex search/results, carts, account pages; handle 404/410; redirects for retired SKUs/collections.
- **Analytics/attribution**: preserve UTM/referrer through checkout; align events with campaigns; integrate GSC/GA4 if desired.
- **Image/alt**: meaningful alt text for product/media; compress and serve responsive sizes.
- **Monitoring**: regular crawl checks; track sitemap submission and coverage; alert on 4xx/5xx spikes.

## 15) Legal, Compliance, and Trust
- Privacy policy, terms, and cookie policy surfaced on site; consent banner if required.
- PCI handled by Shopify Checkout; avoid handling card data in Next.js.
- Region-specific needs: GST invoicing, tax IDs, high-value KYC (if applicable).
- Accessibility conformance: run audits for forms, menus, PDP media, focus/ARIA.

## 16) Fraud, Abuse, and Security Controls
- Shopify fraud tools/rules; AVS/CVV checks (where supported).
- Rate limiting on headless APIs (Upstash Redis); bot mitigation (Turnstile/recaptcha) on auth/contact forms.
- HMAC verification for webhooks; secret management via environment variables.

## 17) Staging, Migration, and Content Ops
- Staging/UAT store with sanitized data; release checklist per phase.
- Migration runbook for products, collections, redirects (301s), and media.
- Content workflow: publishing guidelines for CMS/metaobjects; 404/410 policy for retired SKUs; redirect strategy.

## 18) Internationalization (if needed)
- Markets/currencies setup in Shopify; hreflang and canonical strategy.
- Shipping/tax rules per market; currency display on frontend; localized content blocks.

## 19) Performance Budgets
- Targets: LCP < 2.5s, INP < 200ms, CLS < 0.1 on core templates.
- Bundle budgets for JS; defer non-critical scripts; image/CDN strategy; prefetching rules.

## 20) Observability & Runbooks
- Alerting thresholds: webhook failures, 5xx rates, checkout redirect errors, search errors.
- On-call/runbook steps: replay webhooks, clear/rebuild search index, cache revalidation triggers.
- Logging/metrics destinations (Sentry, Logtail/Datadog); dashboard links.

## 21) Backups & Disaster Recovery
- Sidecar DB (if used): automated backups and PITR; restoration test cadence.
- Search index rebuild procedure from Shopify source.
- Webhook replay strategy for missed events.

## 22) Returns/RMA Policy Detail
- Define SLAs, eligibility window, restock fees, exchange vs refund rules, label workflow.
- Decide on app-based vs manual flow; map statuses to customer-facing updates.

## 23) Search Relevance & Merchandising
- Synonym sets, typo tolerance, boosters (bestsellers, margin, inventory), zero-results handling.
- Merchandising rules for collections/landing pages; pinned results for campaigns.

## 24) Inventory & Operations
- Multi-location handling (if used); reservation rules (if needed) vs soft OOS messaging.
- Stockout UX: back-in-stock notifications (app) or email capture.

## 25) Launch Checklist
- DNS cutover plan; environment variables/secrets set in Vercel.
- Webhook endpoint tests (HMAC verified); payment test cases; redirect audit.
- Sitemap submission, robots.txt verification, GSC/GA4 linkage.
