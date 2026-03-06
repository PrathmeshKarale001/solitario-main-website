The Solitario \| Product Requirements Document \| Confidential \| March
2026

> **THE** **SOLITARIO**
>
> Lab-Grown Diamond Jewellery E-Commerce Platform
>
> **PRODUCT** **REQUIREMENTS** **DOCUMENT** Version 1.0 \| March 2026
> Domain: thesolitario.com

||
||
||
||
||

> thesolitario.com \| Page \| Internal Use Only

The Solitario \| Product Requirements Document \| Confidential \| March
2026

**Table** **of** **Contents**

Table of
Contents................................................................................................................................................2 1.
Product
Overview............................................................................................................................................4
1.1 Product
Goals............................................................................................................................................4
1.2 Target Audience
........................................................................................................................................4
2. Tech Stack &
Architecture...............................................................................................................................5
2.1 Core
Framework........................................................................................................................................5
2.2 Backend / Headless
Commerce................................................................................................................5
2.3
Authentication............................................................................................................................................5
2.4 Payments & Logistics
................................................................................................................................5
2.5 Data Layer
.................................................................................................................................................5
2.6 Analytics &
Marketing................................................................................................................................6
2.7 Email &
AI..................................................................................................................................................6
3. Frontend Pages & UX
.....................................................................................................................................7
3.1 Public
Pages..............................................................................................................................................7
3.2 Legal & Policy
Pages.................................................................................................................................7
3.3 User Account Pages
(Protected)...............................................................................................................7
3.4 Checkout Flow
Pages................................................................................................................................8
3.5 UX
Features...............................................................................................................................................8
4. Product
System.............................................................................................................................................10
4.1 Data Source &
Catalog............................................................................................................................10
4.2 Product
Features.....................................................................................................................................10
5. Authentication & User
Accounts....................................................................................................................11
5.1 Auth Provider: Clerk
v6............................................................................................................................11
5.2 Auth
Flow.................................................................................................................................................11
5.3 User Account
Features............................................................................................................................11
6. Cart &
Checkout............................................................................................................................................12
6.1 Dual Cart
System.....................................................................................................................................12
6.2 Cart
Features...........................................................................................................................................12
6.3 Checkout Flow (9 Steps)
.........................................................................................................................12
7.
Payments.......................................................................................................................................................13
7.1 Provider:
Razorpay..................................................................................................................................13
7.2 Payment API
Endpoints...........................................................................................................................13
7.3 Payment
Flow..........................................................................................................................................13
8. Shipping &
Logistics......................................................................................................................................14
8.1 Provider: Delhivery
..................................................................................................................................14
8.2 Shipping API
Endpoints...........................................................................................................................14
9. Promotions, Coupons & Discounts
...............................................................................................................15

> thesolitario.com \| Page \| Internal Use Only

The Solitario \| Product Requirements Document \| Confidential \| March
2026

9.1 Promotion
Engine....................................................................................................................................15
9.2 Coupon
System.......................................................................................................................................15
9.3 Promotion
Configuration..........................................................................................................................15
10. Admin
Panel................................................................................................................................................16
10.1 Admin Pages
.........................................................................................................................................16
10.2 Admin API
Endpoints.............................................................................................................................16
10.3 Admin
Authentication.............................................................................................................................16
11. Email
System...............................................................................................................................................17
11.1 Provider:
Resend...................................................................................................................................17
11.2 Email
Specifications...............................................................................................................................17
12. Analytics &
Tracking....................................................................................................................................18
12.1 Unified Analytics
Events........................................................................................................................18
12.2 Additional
Tracking................................................................................................................................18
13. SEO & Structured
Data...............................................................................................................................19
14. AI &
Chatbot................................................................................................................................................20
14.1 Provider: Google Gemini
.......................................................................................................................20
14.2 Brand Guidelines (Embedded in
AI)......................................................................................................20
15. Store
Locator...............................................................................................................................................21
16. Warner Bros
Collectibles.............................................................................................................................22
17. Performance &
Caching..............................................................................................................................23
18. Database &
Storage....................................................................................................................................24
18.1 JSON File Storage
(lib/db/)....................................................................................................................24
18.2 Repository
Layer....................................................................................................................................24
18.3 External Data
Sources...........................................................................................................................24
19. Security &
Middleware.................................................................................................................................25
20. Third-Party Integrations Summary
..............................................................................................................26
21. API Routes
Reference.................................................................................................................................27
21.1
Products.................................................................................................................................................27
21.2
Authentication........................................................................................................................................27
21.3
Account..................................................................................................................................................27
21.4
Payments...............................................................................................................................................27
21.5
Shipping.................................................................................................................................................28
21.6 Coupons &
Promotions..........................................................................................................................28
21.7 Webhooks & Other
................................................................................................................................28
Summary...........................................................................................................................................................29

> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **1.** **Product** **Overview**
>
> The Solitario is a premium lab-grown diamond jewellery e-commerce
> platform built on a modern headless architecture. It serves customers
> across India with 220+ curated jewellery products spanning rings,
> earrings, necklaces, bracelets, and collectibles. The platform
> integrates best-in-class third-party services to deliver a seamless
> shopping experience from discovery through delivery.
>
> *Domain:* *thesolitario.com* *\|* *Stack:* *Next.js* *15* *·*
> *TypeScript* *·* *Shopify* *·* *Clerk* *·* *Razorpay* *·* *Delhivery*
> *·* *Vercel*
>
> **1.1** **Product** **Goals**
>
> • Deliver a premium, brand-consistent shopping experience for
> lab-grown diamond jewellery
>
> • Support end-to-end e-commerce: browsing → cart → payment → shipping
> → delivery confirmation • Enable strong conversion through promotions,
> AI-assisted search, and frictionless checkout
>
> • Provide real-time inventory, pricing, and logistics powered by
> Shopify and Delhivery
>
> • Empower administrators with a full-featured back-office panel for
> orders, coupons, and analytics
>
> **1.2** **Target** **Audience**

||
||
||
||
||
||
||
||

> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **2.** **Tech** **Stack** **&** **Architecture**
>
> **2.1** **Core** **Framework**

||
||
||
||
||
||
||
||

> **2.2** **Backend** **/** **Headless** **Commerce**

||
||
||
||
||
||
||

> **2.3** **Authentication**

||
||
||
||
||

> **2.4** **Payments** **&** **Logistics**

||
||
||
||
||
||

> **2.5** **Data** **Layer**
>
> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026

||
||
||
||
||
||
||

> **2.6** **Analytics** **&** **Marketing**

||
||
||
||
||
||
||
||

> **2.7** **Email** **&** **AI**

||
||
||
||
||

> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **3.** **Frontend** **Pages** **&** **UX**
>
> **3.1** **Public** **Pages**

||
||
||
||
||
||
||
||
||
||
||
||
||
||
||
||
||
||

> **3.2** **Legal** **&** **Policy** **Pages**

||
||
||
||
||
||
||
||

> **3.3** **User** **Account** **Pages** **(Protected)**
>
> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026

||
||
||
||
||
||
||
||
||

> **3.4** **Checkout** **Flow** **Pages**

||
||
||
||
||
||
||
||

> **3.5** **UX** **Features**

||
||
||
||
||
||
||
||
||
||
||
||
||
||
||
||

> thesolitario.com \| Page \| Internal Use Only

The Solitario \| Product Requirements Document \| Confidential \| March
2026

> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **4.** **Product** **System**
>
> **4.1** **Data** **Source** **&** **Catalog**
>
> • Primary source: Shopify Storefront API (GraphQL)
>
> • Product count: 220+ lab-grown diamond jewellery items
>
> • Categories: Rings, Earrings, Necklaces, Bracelets, Jewellery
>
> **4.2** **Product** **Features**

||
||
||
||
||
||
||
||
||
||

> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **5.** **Authentication** **&** **User** **Accounts**
>
> **5.1** **Auth** **Provider:** **Clerk** **v6**

||
||
||
||
||
||
||
||
||

> **5.2** **Auth** **Flow**
>
> • User signs up via Clerk — email/password or Google OAuth
>
> • On first sign-in, a Shopify customer is auto-created via Admin API •
> Shopify customer access token is stored in session
>
> • Protected routes check authentication via clerkMiddleware
>
> **5.3** **User** **Account** **Features**
>
> • Profile Management: name, email, phone, avatar upload
>
> • Address Book: multiple saved addresses with default selection •
> Order History: past orders with status tracking and order details
>
> • Wishlist: persisted wishlist with live price refresh from Shopify
> API
>
> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **6.** **Cart** **&** **Checkout**
>
> **6.1** **Dual** **Cart** **System**

||
||
||
||
||

> **6.2** **Cart** **Features**
>
> • Add and remove items
>
> • Quantity adjustment per line item
>
> • Cart total calculation with discounts applied • Cart item count
> badge in site header
>
> • Persistent cart state across page navigation
>
> **6.3** **Checkout** **Flow** **(9** **Steps)**

||
||
||
||
||
||
||
||
||
||
||
||

> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **7.** **Payments**
>
> **7.1** **Provider:** **Razorpay**

||
||
||
||
||
||
||
||

> **7.2** **Payment** **API** **Endpoints**

||
||
||
||
||
||
||

> **7.3** **Payment** **Flow**
>
> *Client* *→* *Create* *Razorpay* *Order* *(API)* *→* *Open* *Razorpay*
> *Modal* *→* *User* *Pays* *→* *Razorpay* *Callback* *→* *Verify*
> *Signature* *(API)* *→* *Update* *Order* *Status* *→* *Send*
> *Confirmation* *Email* *→* *Redirect* *to* *Success* *Page*
>
> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **8.** **Shipping** **&** **Logistics**
>
> **8.1** **Provider:** **Delhivery**

||
||
||
||
||
||
||
||
||
||

> **8.2** **Shipping** **API** **Endpoints**

||
||
||
||
||
||
||
||

> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **9.** **Promotions,** **Coupons** **&** **Discounts**
>
> **9.1** **Promotion** **Engine**

||
||
||
||
||
||
||

> **9.2** **Coupon** **System**
>
> • Code format: SOLI-LOYAL-XXXXX (auto-generated)
>
> • Validation: expiry check, status check (ACTIVE / REDEEMED / EXPIRED)
> • Redemption: marked as redeemed on successful use
>
> • Per-month limit: one coupon per user per calendar month
>
> **9.3** **Promotion** **Configuration**

||
||
||
||
||
||
||
||

> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **10.** **Admin** **Panel**
>
> **10.1** **Admin** **Pages**

||
||
||
||
||
||
||
||
||
||
||

> **10.2** **Admin** **API** **Endpoints**

||
||
||
||
||
||
||
||

> **10.3** **Admin** **Authentication**
>
> • Protected via Clerk middleware — requires valid session • Additional
> admin role check via admin-auth.ts
>
> • Admin context provider (admin-context.tsx) for role-based state
>
> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **11.** **Email** **System**
>
> **11.1** **Provider:** **Resend**

||
||
||
||
||
||
||

> **11.2** **Email** **Specifications**
>
> • Branded HTML email templates with Solitario branding • Product
> images embedded in order confirmation emails • Responsive email design
> for mobile and desktop clients • From address:
> noreply@thesolitario.com (via Resend)
>
> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **12.** **Analytics** **&** **Tracking**
>
> **12.1** **Unified** **Analytics** **Events**
>
> A single unified analytics module (lib/unified-analytics.ts) fires
> events to all platforms simultaneously:

||
||
||
||
||
||
||
||
||
||
||
||

> **12.2** **Additional** **Tracking**

||
||
||
||
||
||

> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **13.** **SEO** **&** **Structured** **Data**

||
||
||
||
||
||
||
||
||
||
||
||

> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **14.** **AI** **&** **Chatbot**
>
> **14.1** **Provider:** **Google** **Gemini**

||
||
||
||
||
||
||

> **14.2** **Brand** **Guidelines** **(Embedded** **in** **AI)**
>
> *Colors:* *Classic* *Green* *\#146552,* *Bronze* *Gold* *\#AC884B,*
> *Ivory* *Pearl* *\#F8EEE7* *\|* *Style:* *Soft* *warm* *lighting,*
> *professional* *studio,* *golden* *hour* *\|* *Mood:* *Sophisticated,*
> *premium,* *timeless* *elegance*
>
> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **15.** **Store** **Locator**

||
||
||
||
||
||
||
||
||
||

> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **16.** **Warner** **Bros** **Collectibles**

||
||
||
||
||
||
||
||
||
||

> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **17.** **Performance** **&** **Caching**

||
||
||
||
||
||
||
||
||
||
||
||
||
||

> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **18.** **Database** **&** **Storage**
>
> **18.1** **JSON** **File** **Storage** **(lib/db/)**

||
||
||
||
||
||

> **18.2** **Repository** **Layer**
>
> • UserRepository — find, create, upsert by Clerk user ID
>
> • OrderRepository — CRUD, find by Razorpay ID, count paid orders
>
> • CouponRepository — validate, redeem, generate codes, enforce monthly
> limits
>
> **18.3** **External** **Data** **Sources**
>
> • Shopify — products, collections, cart, customers, discount codes •
> Supabase — additional persistence layer for extended data
>
> • SessionStorage — client-side scroll positions and navigation flags
>
> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **19.** **Security** **&** **Middleware**

||
||
||
||
||
||
||
||
||
||
||
||

> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **20.** **Third-Party** **Integrations** **Summary**

||
||
||
||
||
||
||
||
||
||
||
||
||
||
||
||
||
||
||

> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **21.** **API** **Routes** **Reference**
>
> **21.1** **Products**

||
||
||
||
||
||
||
||
||

> **21.2** **Authentication**

||
||
||
||
||
||
||

> **21.3** **Account**

||
||
||
||
||
||
||

> **21.4** **Payments**

||
||
||
||
||
||
||

> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **21.5** **Shipping**

||
||
||
||
||
||
||
||

> **21.6** **Coupons** **&** **Promotions**

||
||
||
||
||
||
||

> **21.7** **Webhooks** **&** **Other**

||
||
||
||
||
||
||
||
||

> thesolitario.com \| Page \| Internal Use Only
>
> The Solitario \| Product Requirements Document \| Confidential \|
> March 2026
>
> **Summary**

||
||
||
||
||
||

> **Full** **e-commerce** **pipeline:** **Browsing** **→** **Cart**
> **→** **Payment** **→** **Shipping** **→** **Delivery**
>
> thesolitario.com \| Confidential \| March 2026
>
> thesolitario.com \| Page \| Internal Use Only
