# Production-Ready Promotion System

## ✅ Current Features (Production Ready)

### **1. First Purchase Discount**
- **20% off** for first-time buyers
- **Only for logged-in users** - Guests don't get this discount
- **Automatic detection** - Checks if user has 0 paid orders
- **Can stack** with first purchase if `PROMO_STACKING_FIRST_PURCHASE=true`

**Configuration:**
```env
PROMO_FIRST_PURCHASE_PERCENT=20
PROMO_STACKING_FIRST_PURCHASE=false
```

---

### **2. Cart-Based Discounts**

#### **BUY 2 Items:**
- **10% discount** + **Free Gift** (10 Cent Diamond)
- Automatically applied when cart has exactly 2 items

#### **BUY 3+ Items:**
- **30% discount** (no gift)
- Automatically applied when cart has 3 or more items

**Configuration:**
```env
PROMO_BUY2_PERCENT=10
PROMO_BUY3_PERCENT=30
PROMO_GIFT_VARIANT_ID=gid://shopify/ProductVariant/10264124457235
PROMO_GIFT_PRODUCT_NAME=10 Cent Diamond
```

---

### **3. Shopify Discount Codes**
- **Full integration** with Shopify Admin API
- **Validation** via Admin API first, then cart-based fallback
- **Cannot stack** with cart rules (BUY2/BUY3)
- **Can work** with first purchase discount
- **Persistent** across cart sidebar, cart page, and checkout

**Features:**
- ✅ Create discount codes in Shopify Admin
- ✅ Validate codes via API
- ✅ Track usage limits
- ✅ Check expiration dates
- ✅ Apply to cart totals

**Configuration:**
```env
SHOPIFY_STORE_DOMAIN=solitarioind
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxx
SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxx
```

---

## 🎯 Discount Stacking Rules

| User Type | Cart Items | First Purchase | Cart Rule | Shopify Code | Total Discount |
|-----------|------------|----------------|-----------|--------------|----------------|
| Guest | 1 | ❌ | ❌ | ✅ | Code only |
| Guest | 2 | ❌ | 10% + Gift | ❌ | 10% |
| Guest | 3+ | ❌ | 30% | ❌ | 30% |
| Logged-in (first order) | 1 | 20% | ❌ | ✅ | 20% + Code |
| Logged-in (first order) | 2 | 20% | 10% + Gift | ❌ | 30% + Gift* |
| Logged-in (first order) | 3+ | 20% | 30% | ❌ | 50%* |
| Logged-in (repeat) | 1 | ❌ | ❌ | ✅ | Code only |
| Logged-in (repeat) | 2 | ❌ | 10% + Gift | ❌ | 10% |

*If `PROMO_STACKING_FIRST_PURCHASE=true`

---

## 🔧 API Endpoints

### **1. Validate Coupon**
```
POST /api/coupons/validate
```

**Request:**
```json
{
  "couponCode": "TESTCODE",
  "subtotal": 1099900,
  "cartId": "gid://shopify/Cart/xxx"
}
```

**Response:**
```json
{
  "success": true,
  "percentOff": 15,
  "code": "TESTCODE",
  "expiresAt": "2026-01-22T12:36:39Z",
  "source": "SHOPIFY"
}
```

### **2. Get Pricing Quote**
```
POST /api/pricing/quote
```

**Request:**
```json
{
  "cartLines": [...],
  "clerkUserId": "user_xxx",
  "couponCode": "TESTCODE"
}
```

**Response:**
```json
{
  "pricing": {
    "subtotal": 10999,
    "discounts": [
      {
        "type": "FIRST_PURCHASE",
        "percent": 20,
        "amount": 2200,
        "description": "20% off first purchase"
      }
    ],
    "total": 8799,
    "messages": ["🌟 Welcome! 20% off your first order!"]
  }
}
```

---

## 📦 Components

### **Cart Sidebar** (`components/cart/CartSidebar.tsx`)
- ✅ Coupon input with Apply button
- ✅ Shows applied coupon with Remove button
- ✅ Displays discount in totals
- ✅ Persists via localStorage

### **Cart Page** (`app/cart/page.tsx`)
- ✅ Coupon input with Apply button
- ✅ Shows applied coupon with Remove button
- ✅ Displays discount in totals
- ✅ Persists via localStorage

### **Checkout** (`components/checkout/LocalCartPromotions.tsx`)
- ✅ Loads saved coupon from localStorage
- ✅ Auto-validates on mount
- ✅ Shows discount in order summary
- ✅ Applies to payment total

---

## 🚫 Removed Features

### **Loyalty Coupon System**
- ❌ Local coupon database (`coupons.json`)
- ❌ User-specific loyalty codes
- ❌ Manual coupon creation
- ❌ Local coupon validation

**Reason:** Replaced by Shopify discount codes for production simplicity.

**Future:** Can be re-implemented when needed with:
- Automatic coupon generation
- Email/SMS delivery
- Usage analytics
- Tier-based rewards

---

## 🎨 User Experience

### **Seamless Flow:**
1. **Apply once** in cart sidebar
2. **Persists** to cart page
3. **Persists** to checkout
4. **Reflects** in payment total

### **Clear Messaging:**
- ✅ "20% off first purchase" for new users
- ✅ "10% discount + Free Gift" for BUY2
- ✅ "30% discount" for BUY3+
- ✅ "15% Discount Applied!" for Shopify codes
- ✅ "Coupons cannot be combined with cart discounts" when blocked

---

## 🔐 Security

### **Validation:**
- ✅ Shopify Admin API authentication
- ✅ Expiration date checks
- ✅ Usage limit enforcement
- ✅ Status verification (ACTIVE only)

### **User Protection:**
- ✅ First purchase only for logged-in users
- ✅ No discount stacking exploits
- ✅ Server-side validation

---

## 📊 Configuration

### **Environment Variables:**
```env
# Shopify
SHOPIFY_STORE_DOMAIN=solitarioind
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxx
SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxx

# Promotions
PROMO_ENABLED=true
PROMO_FIRST_PURCHASE_PERCENT=20
PROMO_LOYALTY_PERCENT=10
PROMO_LOYALTY_VALIDITY_DAYS=30
PROMO_BUY2_PERCENT=10
PROMO_BUY3_PERCENT=30
PROMO_GIFT_VARIANT_ID=gid://shopify/ProductVariant/10264124457235
PROMO_GIFT_PRODUCT_NAME=10 Cent Diamond
PROMO_STACKING_FIRST_PURCHASE=false
```

---

## ✅ Production Checklist

- [x] First purchase discount only for logged-in users
- [x] Cart rules (BUY2/BUY3) working
- [x] Shopify discount integration complete
- [x] Coupon persistence across cart interfaces
- [x] Discount shows in checkout totals
- [x] No stacking exploits
- [x] Clear error messages
- [x] localStorage-based persistence
- [x] Loyalty system removed (for now)
- [x] All code cleaned up and production-ready

---

## 🚀 Ready for Production

The promotion system is now **production-ready** with:
- ✅ Automatic discounts (first purchase, cart rules)
- ✅ Shopify discount code integration
- ✅ Seamless user experience
- ✅ Secure validation
- ✅ Clean codebase

**No loyalty system** - Can be added later when needed.
