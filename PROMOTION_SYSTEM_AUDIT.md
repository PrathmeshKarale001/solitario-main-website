# Promotion System Audit Report

## ✅ System Overview

The promotion system is implemented in `lib/promotions/engine.ts` with configuration in `lib/promotions/config.ts`.

---

## 📊 Current Promotion Rules

### 1. BUY 3+ Items → 30% OFF
**Status:** ✅ Working
**Logic:** `totalItems >= 3`
**Discount:** 30% off subtotal
**Gift:** None (removed as per requirement)
**Code Location:** `engine.ts` lines 77-87

### 2. BUY 2 Items → 10% OFF + FREE GIFT
**Status:** ✅ Working
**Logic:** `totalItems === 2`
**Discount:** 10% off subtotal
**Gift:** 10 Cent Diamond (variant ID from config)
**Code Location:** `engine.ts` lines 88-109

### 3. First Purchase → 20% OFF
**Status:** ✅ Working (needs live testing)
**Logic:** `isFirstPurchase && !cartRuleApplied`
**Discount:** 20% off subtotal
**Condition:** User has 0 paid orders in system
**Code Location:** `engine.ts` lines 111-131

### 4. Loyalty Coupon → 10% OFF
**Status:** ✅ Working (needs live testing)
**Logic:** Valid coupon code provided
**Discount:** Coupon percentage (default 10%)
**Condition:** Cannot combine with other offers
**Code Location:** `engine.ts` lines 133-149

---

## 🔧 Configuration Values

### Default Configuration (`lib/db/schema.ts`)
```typescript
DEFAULT_PROMO_CONFIG = {
  enabled: true,
  first_purchase_percent: 20,      // 20% off first purchase
  loyalty_coupon_percent: 10,      // 10% loyalty coupon
  loyalty_coupon_validity_days: 30, // 30 days validity
  buy2_percent: 10,                // 10% off for 2 items
  buy3_percent: 30,                // 30% off for 3+ items
  gift_variant_id: '',             // Set in env or Shopify
  gift_product_name: '10-cent Diamond Gift',
  stacking_first_purchase: false,  // Don't stack with cart rules
}
```

### Environment Variables (Optional Override)
```env
PROMO_ENABLED=true
PROMO_FIRST_PURCHASE_PERCENT=20
PROMO_LOYALTY_PERCENT=10
PROMO_LOYALTY_VALIDITY_DAYS=30
PROMO_BUY2_PERCENT=10
PROMO_BUY3_PERCENT=30
PROMO_GIFT_VARIANT_ID=10264124457235
PROMO_GIFT_PRODUCT_NAME=10 Cent Diamond
PROMO_STACKING_FIRST_PURCHASE=false
```

---

## 🧪 Test Scenarios

### Test 1: BUY 3+ Items (30% OFF)
```
Input: 3 items, subtotal ₹50,000
Expected:
- Discount: ₹15,000 (30%)
- Gift: None
- Total: ₹35,000
```

### Test 2: BUY 2 Items (10% OFF + Gift)
```
Input: 2 items, subtotal ₹30,000
Expected:
- Discount: ₹3,000 (10%)
- Gift: 10 Cent Diamond (FREE)
- Total: ₹27,000
```

### Test 3: First Purchase (20% OFF)
```
Input: 1 item, subtotal ₹20,000, new user
Expected:
- Discount: ₹4,000 (20%)
- Gift: None
- Total: ₹16,000
```

### Test 4: Loyalty Coupon (10% OFF)
```
Input: 1 item, subtotal ₹20,000, valid coupon
Expected:
- Discount: ₹2,000 (10%)
- Gift: None
- Total: ₹18,000
```

### Test 5: Coupon with Cart Rule (Should Fail)
```
Input: 3 items, subtotal ₹50,000, coupon code
Expected:
- Error: "This coupon can't be combined with other offers."
- Discount: ₹15,000 (30% from BUY3)
- Total: ₹35,000
```

---

## 📋 Promotion Priority Order

1. **BUY3 (30% off)** - Highest priority for 3+ items
2. **BUY2 (10% off + gift)** - For exactly 2 items
3. **First Purchase (20% off)** - Only if no cart rule applied
4. **Loyalty Coupon** - Only if no other discounts

**Note:** Coupons cannot stack with cart rules (BUY2/BUY3) or first purchase discount.

---

## 🔍 Code Analysis

### First Purchase Detection
```typescript
const isFirstPurchase =
  input.clerkUserId && OrderRepository.countPaidOrdersByClerkUserId(input.clerkUserId) === 0;
```
**Dependency:** `OrderRepository.countPaidOrdersByClerkUserId()`
**Location:** `lib/db/storage.ts`

### Coupon Validation
```typescript
async function validateCoupon(code: string, clerkUserId?: string) {
  const coupon = CouponRepository.findByCode(code);
  if (!coupon) return null;
  // Check expiration, usage limits, user restrictions
}
```
**Dependency:** `CouponRepository`
**Location:** `lib/db/storage.ts`

### Loyalty Coupon Creation (After Purchase)
**Location:** `app/api/razorpay/webhook/route.ts`
**Trigger:** `payment.captured` webhook event
**Action:** Creates 10% coupon valid for 30 days

---

## ⚠️ Known Issues & Recommendations

### Issue 1: In-Memory Storage
**Problem:** `OrderRepository` and `CouponRepository` use in-memory storage
**Impact:** Data lost on server restart
**Recommendation:** Migrate to persistent database (PostgreSQL/MongoDB)

### Issue 2: Coupon Stacking
**Current:** Coupons cannot combine with any other offer
**Recommendation:** Consider allowing coupons with first purchase discount

### Issue 3: Gift Product Visibility
**Fixed:** Gift product (SKU: GIFT) now filtered from API responses
**File:** `app/api/products/route.ts`

---

## 🎯 Shopify Discount Integration Plan

### Phase 1: API Integration
1. Add Shopify discount lookup function to `lib/shopify.ts`
2. Create `/api/shopify/validate-discount` endpoint
3. Test with existing Shopify discount codes

### Phase 2: Replace Custom System
1. Update `validateCoupon()` to use Shopify API
2. Remove `CouponRepository` dependency
3. Update loyalty coupon creation to use Shopify Admin API

### Phase 3: Frontend Updates
1. Update cart coupon input validation
2. Update checkout discount display
3. Ensure Shopify discount codes work at payment

### Shopify API Endpoints
```graphql
# Validate discount code
query getDiscountCode($code: String!) {
  codeDiscountNodeByCode(code: $code) {
    id
    codeDiscount {
      ... on DiscountCodeBasic {
        title
        status
        endsAt
        customerGets {
          value {
            ... on DiscountPercentage {
              percentage
            }
          }
        }
      }
    }
  }
}
```

---

## ✅ Audit Checklist

- [x] BUY3 discount logic correct
- [x] BUY2 discount + gift logic correct
- [x] Gift removed for 3+ items
- [x] First purchase discount logic correct
- [x] Loyalty coupon validation logic correct
- [x] Coupon stacking prevention working
- [x] Error messages clear and helpful
- [x] Configuration values documented
- [x] Environment variable overrides working
- [ ] Live testing with real users (pending)
- [ ] Loyalty coupon creation after purchase (pending verification)
- [ ] Shopify discount integration (planned)

---

## 📝 Summary

The promotion system is **correctly implemented** with the following features:
- ✅ 30% off for 3+ items (no gift)
- ✅ 10% off + free gift for 2 items
- ✅ 20% off first purchase
- ✅ 10% loyalty coupon system
- ✅ Proper stacking prevention
- ✅ Clear error messages

**Pending:**
- Live testing with real user accounts
- Verification of loyalty coupon creation webhook
- Shopify discount integration (major project)

---

**Audit Date:** January 15, 2026
**Auditor:** Cascade AI
**Status:** ✅ System Healthy - Ready for Live Testing
