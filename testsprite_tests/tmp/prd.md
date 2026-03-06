# Product Requirements Document - The Solitario

## 1. Product Overview

The Solitario is a premium lab-grown diamond jewellery e-commerce platform built on a modern headless architecture. It serves customers across India with 220+ curated jewellery products spanning rings, earrings, necklaces, bracelets, and collectibles. The platform integrates best-in-class third-party services to deliver a seamless shopping experience from discovery through delivery.

**Domain:** thesolitario.com
**Stack:** Next.js 16 · TypeScript · Shopify · Clerk · Razorpay · Delhivery · Vercel

### 1.1 Product Goals
- Deliver a premium, brand-consistent shopping experience for lab-grown diamond jewellery
- Support end-to-end e-commerce: browsing → cart → payment → shipping → delivery confirmation
- Enable strong conversion through promotions, AI-assisted search, and frictionless checkout
- Provide real-time inventory, pricing, and logistics powered by Shopify and Delhivery
- Empower administrators with a full-featured back-office panel for orders, coupons, and analytics

### 1.2 Target Audience
- Primary: Young professionals (25-40) looking for premium lab-grown diamond jewellery in India
- Secondary: Gift buyers seeking high-quality jewellery with ethical sourcing

## 2. Tech Stack & Architecture

### 2.1 Core Framework
- Next.js 16 with TypeScript
- React 18
- TailwindCSS 3
- Framer Motion for animations
- Vercel for hosting

### 2.2 Backend / Headless Commerce
- Shopify Storefront API (GraphQL) for product catalog
- Shopify Admin API for customer and order management

### 2.3 Authentication
- Clerk v6 for authentication (email/password + Google OAuth)

### 2.4 Payments & Logistics
- Razorpay for payments (UPI, cards, netbanking, wallets)
- Delhivery for shipping and logistics

### 2.5 Data Layer
- React Query (TanStack) for data fetching and caching
- JSON file storage for local data
- Supabase for extended persistence

## 3. Frontend Pages & UX

### 3.1 Public Pages
| Page | Route | Description |
|------|-------|-------------|
| Homepage | / | Hero banner, featured products, brand storytelling |
| Shop / Products | /products | Product grid with category filters and search |
| Product Detail (PDP) | /products/[handle] | Product images, description, variants, add to cart |
| About | /about | Brand story and values |
| Contact | /contact | Contact inquiry form |
| Blog | /blog | Blog articles listing |
| FAQ | /faq | Frequently asked questions |
| Stores | /stores | Store locator with map |
| Warner Bros | /warner-bros | Warner Bros collectibles collaboration |
| Lab Grown Diamonds | /lab-grown-diamonds | Information about lab-grown diamonds |
| Sustainability | /sustainability | Sustainability commitment |
| Certifications | /certifications | Product certifications |
| Franchise | /franchise | Franchise inquiry |

### 3.2 Legal & Policy Pages
| Page | Route |
|------|-------|
| Privacy Policy | /privacy-policy |
| Terms & Conditions | /terms |
| Shipping Policy | /shipping |
| Returns Policy | /returns |
| Regulatory Disclosures | /regulatory-disclosures |

### 3.3 User Account Pages (Protected)
| Page | Route |
|------|-------|
| Account Dashboard | /account |
| Order History | /account/orders |
| Addresses | /account/addresses |
| Wishlist | /wishlist |
| Sign In | /sign-in |
| Sign Up | /sign-up |

### 3.4 Checkout Flow Pages
| Page | Route |
|------|-------|
| Cart | /cart |
| Checkout | /checkout |
| Shop Checkout | /shop-checkout |

### 3.5 UX Features
- Smooth page transitions with Framer Motion
- Responsive design for mobile, tablet, and desktop
- Scroll restoration between shop and PDP pages
- Dynamic hero banners per category
- Product image galleries with zoom
- Real-time cart badge updates
- AI-powered chatbot for customer assistance
- Wishlist with live price refresh

## 4. Product System

### 4.1 Data Source & Catalog
- Primary source: Shopify Storefront API (GraphQL)
- Product count: 220+ lab-grown diamond jewellery items
- Categories: Rings, Earrings, Necklaces, Bracelets, Jewellery

### 4.2 Product Features
- Multiple product images with gallery view
- Variant selection (size, metal type)
- Real-time pricing from Shopify
- Product recommendations
- Category-based filtering
- Search functionality

## 5. Authentication & User Accounts

### 5.1 Auth Provider: Clerk v6
- Email/password authentication
- Google OAuth social login
- Protected routes via clerkMiddleware

### 5.2 Auth Flow
- User signs up via Clerk — email/password or Google OAuth
- On first sign-in, a Shopify customer is auto-created via Admin API
- Shopify customer access token stored in session
- Protected routes check authentication via clerkMiddleware

### 5.3 User Account Features
- Profile Management: name, email, phone, avatar upload
- Address Book: multiple saved addresses with default selection
- Order History: past orders with status tracking
- Wishlist: persisted wishlist with live price refresh from Shopify API

## 6. Cart & Checkout

### 6.1 Dual Cart System
- Guest cart (localStorage)
- Authenticated cart (Shopify cart API)

### 6.2 Cart Features
- Add and remove items
- Quantity adjustment per line item
- Cart total calculation with discounts applied
- Cart item count badge in site header
- Persistent cart state across page navigation

### 6.3 Checkout Flow (9 Steps)
- Cart review → Address → Shipping → Payment → Confirmation

## 7. Payments
- Provider: Razorpay
- Payment methods: UPI, Credit/Debit Cards, Net Banking, Wallets
- Payment flow: Client → Create Razorpay Order (API) → Open Razorpay Modal → User Pays → Verify Signature → Update Order Status → Send Confirmation Email → Success Page

## 8. AI & Chatbot
- Provider: Google Gemini
- AI-powered chatbot for customer assistance
- Brand guidelines embedded: Classic Green #146552, Bronze Gold #AC884B, Ivory Pearl #F8EEE7

## 9. Warner Bros Collectibles
- Special collaboration collection page
- Themed product showcase

## Summary
Full e-commerce pipeline: Browsing → Cart → Payment → Shipping → Delivery
