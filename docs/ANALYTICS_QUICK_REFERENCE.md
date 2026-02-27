# Analytics Quick Reference Card

## 🎯 All Tracking Systems Installed

Your website now has **3 powerful analytics systems** working together:

| Platform | Status | Purpose |
|----------|--------|---------|
| **Google Analytics** | ✅ Active | User behavior, traffic analysis |
| **Google Ads** | ✅ Active | Conversion tracking, ROI |
| **Meta Pixel** | ⚙️ Needs Setup | Facebook/Instagram ad tracking |

---

## ⚡ Quick Setup (5 Minutes)

### 1. Get Your Meta Pixel ID

1. Visit: https://business.facebook.com/events_manager
2. Create or select a Pixel
3. Copy your Pixel ID (16 digits)

### 2. Add to Environment

```bash
# Edit .env.local
NEXT_PUBLIC_META_PIXEL_ID=1234567890123456
```

### 3. Restart & Test

```bash
npm run dev
```

Install **Meta Pixel Helper** (Chrome extension) to verify.

---

## 📊 What's Being Tracked?

### Automatic Events (No Code Required)

- ✅ **Page Views** - Every page visit
- ✅ **Product Views** - When products are viewed
- ✅ **Add to Cart** - Items added to cart
- ✅ **Checkout** - Checkout process started
- ✅ **Purchase** - Orders completed
- ✅ **Search** - Product searches
- ✅ **Wishlist** - Items added to wishlist
- ✅ **Registration** - User sign-ups

---

## 💻 Developer Usage

### Simple Unified API

```typescript
import {
  trackProductView,
  trackAddToCart,
  trackSearch,
  trackPurchase
} from '@/lib/unified-analytics';

// Track product view (sends to GA + Meta + Google Ads)
trackProductView({
  id: 'SKU123',
  name: 'Diamond Ring',
  price: 25000,
  category: 'rings'
});

// Track add to cart
trackAddToCart({
  id: 'SKU123',
  name: 'Diamond Ring',
  price: 25000
});

// Track purchase
trackPurchase('ORDER123', cartItems, 55000);
```

**One function call → All platforms tracked automatically!**

---

## 🎨 Common Implementation Examples

### Example 1: Product Page

```tsx
'use client';
import { trackProductView } from '@/lib/unified-analytics';

export default function ProductPage({ product }) {
  useEffect(() => {
    trackProductView({
      id: product.id,
      name: product.title,
      price: product.price,
      category: product.category
    });
  }, [product]);

  return <div>...</div>;
}
```

### Example 2: Add to Cart Button

```tsx
import { trackAddToCart } from '@/lib/unified-analytics';

function AddToCartButton({ product }) {
  const handleClick = () => {
    // Your cart logic...
    
    // Track the event
    trackAddToCart({
      id: product.id,
      name: product.title,
      price: product.price
    });
  };

  return <button onClick={handleClick}>Add to Cart</button>;
}
```

### Example 3: Search Box

```tsx
import { trackSearch } from '@/lib/unified-analytics';

function SearchBox() {
  const handleSearch = (query: string) => {
    // Your search logic...
    
    // Track the search
    trackSearch(query, 'products');
  };

  return <input onChange={(e) => handleSearch(e.target.value)} />;
}
```

---

## 🔍 Verification

### Check if Meta Pixel is Working

1. **Install Meta Pixel Helper**
   - Chrome Web Store → "Meta Pixel Helper"
   
2. **Visit Your Site**
   - Extension shows green ✅ = Working
   - Extension shows red ❌ = Not working

3. **Check Events Manager**
   - https://business.facebook.com/events_manager
   - Click "Test Events"
   - Enter your URL
   - Browse site - see events in real-time

### Check if Google Analytics is Working

1. **Google Analytics Dashboard**
   - https://analytics.google.com
   - Realtime → Overview
   - Visit your site - see yourself online

### Check if Google Ads is Working

1. **Google Ads Dashboard**
   - https://ads.google.com
   - Tools → Conversions
   - Check conversion count

---

## 🚨 Troubleshooting

### "Pixel Not Firing"

- ✅ Check `.env.local` has `NEXT_PUBLIC_META_PIXEL_ID`
- ✅ Restart dev server (`npm run dev`)
- ✅ Clear browser cache
- ✅ Disable ad blockers
- ✅ Use incognito mode

### "Events Not Showing"

- ⏱️ Wait 5-10 minutes (there's a delay)
- 🔍 Use "Test Events" tool in Events Manager
- 🌐 Check browser console for errors (F12)

### "Need Help?"

- 📖 Read: `META_PIXEL_SETUP_GUIDE.md` (full documentation)
- 👨‍💻 Contact: Your Web Performance Team
- 🔗 Visit: https://business.facebook.com/help

---

## 📈 Creating Campaigns

### Facebook/Instagram Ads

1. **Build Custom Audience**
   - Ads Manager → Audiences → Create
   - Select "Website" source
   - Target visitors, cart abandoners, or purchasers

2. **Create Conversion Campaign**
   - Ads Manager → Create → Conversions
   - Select your pixel
   - Choose conversion event (Purchase, AddToCart, etc.)
   - Launch!

3. **Set Up Retargeting**
   - Create Dynamic Product Ads
   - Target people who viewed products
   - Show them what they viewed + discount

---

## 📁 File Locations

| What | Where |
|------|-------|
| **Meta Pixel Component** | `components/analytics/MetaPixel.tsx` |
| **Google Analytics** | `components/analytics/GoogleAnalytics.tsx` |
| **Unified Tracking** | `lib/unified-analytics.ts` |
| **Root Layout** | `app/layout.tsx` |
| **CSP Config** | `next.config.js` |

---

## 🎉 Success Checklist

- [ ] Meta Pixel ID added to `.env.local`
- [ ] Server restarted
- [ ] Meta Pixel Helper shows ✅
- [ ] Test events visible in Events Manager
- [ ] Google Analytics showing data
- [ ] Created first Custom Audience
- [ ] Launched first campaign

---

## 📞 Support Resources

- **Full Setup Guide**: `META_PIXEL_SETUP_GUIDE.md`
- **Meta Help Center**: https://business.facebook.com/help
- **Meta Events Manager**: https://business.facebook.com/events_manager
- **Google Analytics**: https://analytics.google.com
- **Google Ads**: https://ads.google.com

---

**Last Updated:** Feb 6, 2026  
**Status:** ✅ Meta Pixel Ready for Setup  
**Team:** Web Performance & Marketing
