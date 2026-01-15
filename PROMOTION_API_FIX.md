# Promotion API Fix - Cart ID Error Resolved

## 🐛 Problem
**Error:** `Failed to fetch pricing: "Cart ID is required"`

**Cause:** The pricing API at `/api/pricing/quote` was expecting a Shopify cart ID, but the cart is stored in localStorage, not in Shopify.

## ✅ Solution

### Updated API Endpoint
**File:** `app/api/pricing/quote/route.ts`

**Changes Made:**
1. **Accept cartLines directly:** API now accepts `cartLines` parameter as an array
2. **Fallback support:** Still supports `cartId` for Shopify carts (backward compatibility)
3. **Flexible input:** Either `cartLines` OR `cartId` is required (not both)

### New API Parameters
```typescript
// Option 1: Direct cart lines (for localStorage cart)
{
  cartLines: [
    {
      merchandise: {
        price: {
          amount: "500.00",
          currencyCode: "INR"
        }
      },
      quantity: 2
    }
  ],
  clerkUserId: "user_123",
  couponCode: "LOYALTY-ABC123"
}

// Option 2: Shopify cart ID (fallback)
{
  cartId: "gid://shopify/Cart/12345",
  couponCode: "LOYALTY-ABC123"
}
```

### Updated Logic Flow
```typescript
let finalCartLines: CartLine[] = [];

// Option 1: Use provided cartLines directly
if (cartLines && Array.isArray(cartLines)) {
  finalCartLines = cartLines;
}
// Option 2: Fetch from Shopify cart using cartId (fallback)
else if (cartId) {
  const cart = await getCart(cartId);
  finalCartLines = cart.lines.edges.map(edge => ({...}));
}
else {
  return NextResponse.json({ error: 'Either cartLines or cartId is required' });
}
```

## 🎯 Impact

### Before Fix
- ❌ Error: "Cart ID is required"
- ❌ No promotion calculations
- ❌ Static offer banners only

### After Fix
- ✅ Real-time promotion calculations
- ✅ Works with localStorage cart
- ✅ Shows actual discount amounts
- ✅ Promotion messages appear
- ✅ Backward compatible with Shopify carts

## 📱 User Experience

Now when users add items to cart:
1. Cart sidebar shows real-time pricing
2. Cart page shows calculated discounts
3. Promotion messages appear (e.g., "🎉 30% discount applied for 3+ items!")
4. Actual discount amounts displayed
5. Loading states during calculation

## 🔧 Technical Details

### Cart Sidebar Call
```typescript
const response = await fetch('/api/pricing/quote', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cartLines: items.map(item => ({
      merchandise: {
        price: {
          amount: (item.product.price / 100).toString(),
          currencyCode: item.product.currency || 'INR'
        }
      },
      quantity: item.quantity
    })),
    clerkUserId: userId,
    couponCode: appliedCoupon || undefined,
  }),
});
```

### Cart Page Call
Same structure as cart sidebar - passes cart items directly.

## 🚀 Benefits

1. **No More Errors:** Cart ID error resolved
2. **Real-Time Pricing:** Live discount calculations
3. **Better UX:** Users see actual savings
4. **Flexible:** Works with any cart implementation
5. **Backward Compatible:** Still supports Shopify carts

---

**Fix Applied:** January 15, 2026
**Status:** ✅ Resolved
**Files Modified:** 1 (pricing API)
**Impact:** Cart promotions now work correctly
