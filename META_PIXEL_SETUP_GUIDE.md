# Meta Pixel (Facebook Pixel) Installation Guide

## 📋 Overview

Meta Pixel (formerly Facebook Pixel) has been successfully installed on your website! This guide will help you set it up and start tracking user behavior for advertising optimization.

---

## 🎯 What is Meta Pixel?

Meta Pixel is a tracking code that helps you:
- **Measure conversions** from Facebook/Instagram ads
- **Build custom audiences** for retargeting campaigns
- **Optimize ad delivery** to people likely to take action
- **Track user behavior** across your website
- **Calculate ROI** from your advertising campaigns

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Your Meta Pixel ID

1. Go to **[Facebook Events Manager](https://business.facebook.com/events_manager)**
2. Select your business account
3. Click **"Connect Data Sources"** → **"Web"**
4. Click **"Connect"** under Meta Pixel
5. Name your pixel (e.g., "Solitario Website")
6. Copy your **Pixel ID** (looks like: `1234567890123456`)

### Step 2: Add Pixel ID to Your Environment

1. Open your `.env.local` file (create if it doesn't exist)
2. Add this line:

```bash
NEXT_PUBLIC_META_PIXEL_ID=YOUR_PIXEL_ID_HERE
```

Replace `YOUR_PIXEL_ID_HERE` with your actual Pixel ID.

**Example:**
```bash
NEXT_PUBLIC_META_PIXEL_ID=1234567890123456
```

### Step 3: Deploy & Verify

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Install Meta Pixel Helper** (Chrome Extension):
   - Visit: https://chrome.google.com/webstore (search "Meta Pixel Helper")
   - Install the extension
   - Visit your website
   - Click the extension icon - it should show a green checkmark ✅

3. **Test in Facebook Events Manager:**
   - Go to Events Manager → Your Pixel
   - Click "Test Events"
   - Enter your website URL
   - Browse your site - you should see events appearing in real-time!

---

## 📊 Events Being Tracked Automatically

Once installed, Meta Pixel automatically tracks:

| Event | When It Fires |
|-------|---------------|
| **PageView** | Every page visit |
| **ViewContent** | Product page views |
| **AddToCart** | Items added to cart |
| **InitiateCheckout** | Checkout started |
| **AddPaymentInfo** | Payment details entered |
| **Purchase** | Order completed |
| **AddToWishlist** | Items added to wishlist |
| **Search** | Product search |
| **Lead** | Form submissions |
| **CompleteRegistration** | User signup |

---

## 🔧 Advanced Implementation (For Developers)

### Manual Event Tracking

You can track custom events anywhere in your code:

```typescript
import { 
  trackMetaAddToCart,
  trackMetaPurchase,
  trackMetaSearch 
} from '@/components/analytics/MetaPixel';

// Example: Track when user adds product to cart
trackMetaAddToCart({
  content_ids: ['SKU123'],
  content_name: 'Diamond Ring',
  content_type: 'product',
  value: 25000,
  currency: 'INR'
});

// Example: Track completed purchase
trackMetaPurchase({
  content_ids: ['SKU123', 'SKU456'],
  contents: [
    { id: 'SKU123', quantity: 1, item_price: 25000 },
    { id: 'SKU456', quantity: 2, item_price: 15000 }
  ],
  value: 55000,
  currency: 'INR',
  num_items: 3
});

// Example: Track search
trackMetaSearch({
  search_string: 'diamond engagement rings',
  content_category: 'rings'
});
```

### Available Tracking Functions

All functions are exported from `@/components/analytics/MetaPixel`:

```typescript
// E-commerce Events
trackMetaViewContent()       // Product views
trackMetaAddToCart()          // Add to cart
trackMetaInitiateCheckout()   // Start checkout
trackMetaPurchase()           // Complete purchase
trackMetaAddToWishlist()      // Add to wishlist
trackMetaAddPaymentInfo()     // Payment info added

// User Actions
trackMetaSearch()             // Search performed
trackMetaLead()               // Lead generated
trackMetaCompleteRegistration() // Sign up completed
trackMetaContact()            // Contact form submitted
trackMetaSubscribe()          // Newsletter subscription

// Custom Events
trackMetaCustomEvent('EventName', { param1: 'value' })
```

---

## 🎨 Integration Examples

### Example 1: Product Page Tracking

```typescript
// app/products/[id]/page.tsx
'use client';

import { useEffect } from 'react';
import { trackMetaViewContent } from '@/components/analytics/MetaPixel';

export default function ProductPage({ product }) {
  useEffect(() => {
    trackMetaViewContent({
      content_name: product.title,
      content_category: product.category,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'INR'
    });
  }, [product]);

  return <div>...</div>;
}
```

### Example 2: Cart Button Tracking

```typescript
// components/AddToCartButton.tsx
import { trackMetaAddToCart } from '@/components/analytics/MetaPixel';

function AddToCartButton({ product }) {
  const handleAddToCart = () => {
    // Add to cart logic...
    
    // Track with Meta Pixel
    trackMetaAddToCart({
      content_ids: [product.id],
      content_name: product.title,
      content_type: 'product',
      value: product.price,
      currency: 'INR'
    });
  };

  return <button onClick={handleAddToCart}>Add to Cart</button>;
}
```

### Example 3: Checkout Tracking

```typescript
// app/checkout/page.tsx
import { trackMetaInitiateCheckout } from '@/components/analytics/MetaPixel';

function CheckoutPage({ cart }) {
  useEffect(() => {
    trackMetaInitiateCheckout({
      content_ids: cart.items.map(i => i.id),
      contents: cart.items.map(i => ({
        id: i.id,
        quantity: i.quantity
      })),
      value: cart.total,
      currency: 'INR',
      num_items: cart.items.length
    });
  }, [cart]);

  return <div>...</div>;
}
```

---

## 📈 Creating Facebook Ad Campaigns

### Step 1: Build Custom Audiences

1. Go to **Facebook Ads Manager** → **Audiences**
2. Click **"Create Audience"** → **"Custom Audience"**
3. Select **"Website"**
4. Choose your pixel
5. Create audiences like:
   - **All website visitors** (last 30 days)
   - **Product viewers** (ViewContent event)
   - **Cart abandoners** (AddToCart but not Purchase)
   - **Past purchasers** (Purchase event)

### Step 2: Create Conversion Campaigns

1. Go to **Ads Manager** → **Create Campaign**
2. Select **"Conversions"** objective
3. Choose your Meta Pixel
4. Select conversion event: **Purchase**, **AddToCart**, etc.
5. Set up your ad creative
6. Launch campaign!

### Step 3: Set Up Retargeting

1. Create a **Dynamic Product Ad** campaign
2. Target **"People who viewed products"**
3. Show them the **exact products they viewed**
4. Add a **special discount** to encourage purchase

---

## 🔍 Troubleshooting

### Pixel Not Firing?

1. **Check environment variable:**
   ```bash
   # Run in terminal:
   echo $NEXT_PUBLIC_META_PIXEL_ID
   ```
   Should output your Pixel ID.

2. **Check browser console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for errors related to `fbq`

3. **Verify with Meta Pixel Helper:**
   - Install the Chrome extension
   - Visit your site
   - Extension should show green checkmark

4. **Check network requests:**
   - Open DevTools → Network tab
   - Filter by "facebook"
   - Should see requests to `facebook.net`

### Events Not Showing in Events Manager?

- **Wait 5-10 minutes** - there's a delay
- Check **Test Events** tool in Events Manager
- Ensure you're browsing in **incognito mode** (to avoid ad blockers)
- Disable browser extensions that block trackers

### Ad Blockers Blocking Pixel?

- Consider using **Facebook Conversions API** (server-side tracking)
- This is more reliable and bypasses ad blockers
- Contact your developer to implement

---

## 🔐 Privacy & Compliance

### GDPR Compliance

Meta Pixel respects user privacy. Make sure to:

1. **Update Privacy Policy** to mention Meta Pixel tracking
2. **Get user consent** before tracking (consider cookie banner)
3. **Allow users to opt-out** of tracking

### Data Retention

Facebook stores pixel data for a limited time:
- **Event data**: 180 days
- **Audience data**: Can vary based on settings

---

## 📞 Support & Resources

### Official Documentation
- **Meta Pixel Guide**: https://www.facebook.com/business/help/952192354843755
- **Events Manager**: https://business.facebook.com/events_manager
- **Conversion API**: https://developers.facebook.com/docs/marketing-api/conversions-api

### Quick Links
- **Meta Pixel Helper**: https://chrome.google.com/webstore (search "Meta Pixel Helper")
- **Events Reference**: https://developers.facebook.com/docs/facebook-pixel/reference
- **Pixel Dashboard**: https://business.facebook.com/events_manager

### Need Help?
- Contact your **Web Performance Team**
- Refer to Facebook's **Help Center**
- Check the **Meta Business Help Community**

---

## ✅ Verification Checklist

Before going live, verify:

- [ ] Meta Pixel ID added to `.env.local`
- [ ] Development server restarted
- [ ] Meta Pixel Helper shows green checkmark
- [ ] PageView events visible in Events Manager
- [ ] Test events working (add to cart, etc.)
- [ ] Privacy policy updated
- [ ] Cookie consent implemented (if required)
- [ ] Team trained on using Events Manager

---

## 🎉 Next Steps

1. **Create your first Custom Audience** in Ads Manager
2. **Set up a conversion campaign** targeting website visitors
3. **Monitor performance** in Events Manager
4. **Optimize campaigns** based on pixel data
5. **Scale winning campaigns** with lookalike audiences

---

## 🆘 Quick Reference

**Pixel Location in Code:**
- Main component: `components/analytics/MetaPixel.tsx`
- Integrated in: `app/layout.tsx`
- CSP updated in: `next.config.js`

**Environment Variable:**
```bash
NEXT_PUBLIC_META_PIXEL_ID=your_pixel_id_here
```

**Test URL:**
```
https://business.facebook.com/events_manager → Test Events
```

---

**Installation Date:** Feb 6, 2026  
**Installed By:** Cursor AI Agent  
**Status:** ✅ Ready for configuration
