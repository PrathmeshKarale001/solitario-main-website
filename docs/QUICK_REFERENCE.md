# Solitario Website - Quick Reference Guide

**For:** Developers working on the Solitario e-commerce platform  
**IDE:** Cursor (migrated from Windsurf)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check
```

**Local URL:** http://localhost:3000

---

## 📁 Key File Locations

### **Core Files**
- `app/layout.tsx` - Root layout with providers
- `app/page.tsx` - Home page
- `proxy.ts` - Middleware (Clerk auth, route protection)
- `next.config.js` - Next.js configuration

### **Components**
- `components/layout/Header.tsx` - Main navigation
- `components/layout/Footer.tsx` - Footer
- `components/cart/CartSidebar.tsx` - Cart drawer
- `components/products/ProductDetail.tsx` - Product page
- `components/checkout/PromotionDisplay.tsx` - Promotions UI

### **Libraries**
- `lib/shopify.ts` - Shopify API client
- `lib/shopify-cart.ts` - Cart operations
- `lib/razorpay.ts` - Payment integration
- `lib/promotions/engine.ts` - Promotion calculations
- `lib/db/storage.ts` - Data storage (JSON files)

### **API Routes**
- `app/api/products/route.ts` - Product listing
- `app/api/payments/create/route.ts` - Payment creation
- `app/api/razorpay/webhook/route.ts` - Payment webhook
- `app/api/pricing/quote/route.ts` - Promotion calculation
- `app/api/shipping/check-pincode/route.ts` - Shipping checks

---

## 🔑 Environment Variables

### **Required for Development**

```bash
# Shopify
SHOPIFY_STORE_DOMAIN=your-store-name
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
SHOPIFY_ADMIN_ACCESS_TOKEN=your-token

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Razorpay
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...

# Feature Flags
NEXT_PUBLIC_FEATURE_COLLECTIBLES_ENABLED=false
NEXT_PUBLIC_FEATURE_RADAR_GEOFENCING_ENABLED=true
```

See `.env.example` for complete list.

---

## 🛍️ E-Commerce Flow

### **Product Flow**
```
Shopify → Storefront API → /api/products → ProductGrid → ProductCard
```

### **Cart Flow**
```
Add to Cart → ShopifyCartContext → Shopify Cart API → Cart State Update
```

### **Checkout Flow**
```
Cart → /checkout → Address → Pincode Check → Promotion Calculation
→ Payment Creation → Razorpay → Webhook → Order Creation
```

---

## 🎁 Promotions System

### **Promotion Types**
1. **First Purchase (20%)** - Auto-applied for new customers
2. **Loyalty Coupon (10%)** - Issued after payment, 30-day validity
3. **Buy 2 (10% + Gift)** - Discount + free gift
4. **Buy 3+ (30%)** - Higher discount, no gift

### **How It Works**
```typescript
// Calculate promotions
import { calculatePromotions } from '@/lib/promotions/engine';

const result = await calculatePromotions({
  clerkUserId: user.id,
  cartLines: cart.lines,
  couponCode: coupon
});

// Result contains:
// - discounts array
// - giftLines array
// - total amount
// - messages
```

### **Key Files**
- `lib/promotions/engine.ts` - Calculation logic
- `lib/promotions/config.ts` - Configuration
- `app/api/pricing/quote/route.ts` - API endpoint
- `components/checkout/PromotionDisplay.tsx` - UI component

---

## 👤 Authentication

### **Clerk Integration**
- Sign up: `/sign-up`
- Sign in: `/sign-in`
- Protected routes: `/account/*`
- Admin routes: `/admin/*` (disabled)

### **Using Auth in Components**
```typescript
import { useUser } from '@clerk/nextjs';

function MyComponent() {
  const { user, isSignedIn } = useUser();
  
  if (!isSignedIn) {
    return <div>Please sign in</div>;
  }
  
  return <div>Welcome {user.emailAddresses[0].emailAddress}</div>;
}
```

---

## 🛒 Cart System

### **Using Cart Context**
```typescript
import { useCart } from '@/lib/cart-context';
// OR for Shopify cart:
import { useShopifyCart } from '@/lib/shopify-cart-context';

function MyComponent() {
  const { 
    items, 
    itemCount, 
    total, 
    addToCart, 
    removeFromCart 
  } = useCart();
  
  // Add product to cart
  await addToCart(product, quantity);
}
```

### **Cart Features**
- Persistent via cookies
- Real-time updates
- Promotion calculation
- Sidebar drawer

---

## 💳 Payment Processing

### **Payment Flow**
1. User clicks "Pay Now"
2. Frontend calls `/api/payments/create`
3. Server creates Razorpay order
4. Frontend opens Razorpay modal
5. User completes payment
6. Webhook verifies payment
7. Order created in Shopify

### **Key Files**
- `app/api/payments/create/route.ts` - Payment creation
- `app/api/razorpay/webhook/route.ts` - Webhook handler
- `lib/razorpay.ts` - Razorpay client

---

## 🚚 Shipping

### **Delhivery Integration**
- **Pincode Check:** `/api/shipping/check-pincode`
- **Tracking:** `/api/shipping/track`
- **Warehouses:** `/api/shipping/warehouses`

### **Usage**
```typescript
// Check serviceability
const response = await fetch('/api/shipping/check-pincode', {
  method: 'POST',
  body: JSON.stringify({ pincode: '411001' })
});

const { serviceable, estimatedDays } = await response.json();
```

---

## 📍 Store Locator

### **Features**
- Store listing: `/stores`
- Nearest store finder (Radar geofencing)
- Map integration (MapLibre GL)

### **Geofencing**
- Feature flag: `NEXT_PUBLIC_FEATURE_RADAR_GEOFENCING_ENABLED`
- Provider: Radar.io
- Component: `components/stores/NearestStore.tsx`

---

## 🎨 Styling

### **Tailwind Config**
- Brand colors defined in `tailwind.config.ts`
- Custom fonts: Playfair Display, Montserrat
- Brand-specific utilities

### **Brand Colors**
```typescript
'classic-green': '#146552'
'bronze-gold': '#ac884b'
'soft-bronze': '#c39275'
'ivory-pearl': '#f8eee7'
'teal': '#107571'
```

### **Usage**
```tsx
<div className="bg-classic-green text-ivory-pearl">
  Brand colored content
</div>
```

---

## 🔧 Common Tasks

### **Add a New Product**
Products are managed in Shopify. They automatically sync via Storefront API.

### **Modify Promotions**
Edit `lib/promotions/config.ts` or environment variables:
```bash
PROMO_FIRST_PURCHASE_PERCENT=20
PROMO_BUY2_PERCENT=10
PROMO_BUY3_PERCENT=30
```

### **Add a New Page**
1. Create file in `app/(public)/your-page/page.tsx`
2. Add route to navigation in `components/layout/Header.tsx`
3. Update sitemap if needed

### **Add a New API Route**
1. Create file in `app/api/your-route/route.ts`
2. Export `GET`, `POST`, etc. functions
3. Use `NextRequest` and `NextResponse`

### **Update Environment Variables**
1. Update `.env.local` (development)
2. Update Vercel environment variables (production)
3. Restart dev server after changes

---

## 🐛 Debugging

### **Check Logs**
- Development: Console output
- Production: Vercel logs, Sentry

### **Common Issues**

**Build Errors:**
```bash
npm run type-check  # Check TypeScript errors
rm -rf .next        # Clear build cache
npm run build       # Rebuild
```

**Cart Not Working:**
- Check Shopify tokens
- Verify cart context provider
- Check browser console for errors

**Payment Issues:**
- Verify Razorpay keys
- Check webhook configuration
- Review payment logs

**Auth Issues:**
- Verify Clerk keys
- Check middleware configuration
- Review protected routes

---

## 📊 Analytics

### **PostHog**
- User tracking
- Event tracking
- User identification

### **Sentry**
- Error tracking
- Performance monitoring
- Source maps

### **Vercel Analytics**
- Web Vitals
- Performance metrics

---

## 🚀 Deployment

### **Vercel Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Pre-Deployment Checklist**
- [ ] Environment variables set
- [ ] Build passes (`npm run build`)
- [ ] Feature flags configured
- [ ] Webhooks configured
- [ ] Payment gateway tested

---

## 📚 Documentation

- `PROJECT_ANALYSIS.md` - Complete project analysis
- `GETTING_STARTED.md` - Setup guide
- `COMPLETED_REQUIREMENTS.md` - Feature status
- `PROMOTIONS_SETUP.md` - Promotion system guide
- `FEATURE_FLAGS_GUIDE.md` - Feature flags usage

---

## 🔐 Security Notes

- Admin panel is disabled (double-layer protection)
- Gift products filtered at API level
- Server-side promotion calculations
- Webhook HMAC verification
- CSP headers configured
- Rate limiting on API routes

---

## 💡 Tips

1. **Always use TypeScript types** - Check `lib/db/schema.ts` for data types
2. **Server-side calculations** - Never trust client for promotions/pricing
3. **Error handling** - Use try-catch and proper error responses
4. **Loading states** - Show loading indicators for async operations
5. **Accessibility** - Use semantic HTML and ARIA labels

---

## 🆘 Getting Help

1. Check documentation files in root directory
2. Review component code (well-commented)
3. Check API route implementations
4. Review error logs in Sentry
5. Check browser console for client errors

---

**Last Updated:** January 26, 2026  
**IDE:** Cursor
