# Shopify Discount Integration Plan

## 🎯 Objective
Replace the custom backend coupon system with Shopify's native discount code system at `https://admin.shopify.com/store/solitarioind/discounts`

---

## 📊 Current System vs Target System

### Current Custom System
- **Storage:** In-memory `CouponRepository` in `lib/db/storage.ts`
- **Validation:** Custom `/api/coupons/validate` endpoint
- **Creation:** Manual or via webhook after purchase
- **Limitations:** Data lost on restart, no persistence

### Target Shopify System
- **Storage:** Shopify's database (persistent)
- **Validation:** Shopify Admin API
- **Creation:** Shopify Admin dashboard or API
- **Benefits:** Persistent, analytics, native checkout integration

---

## 🔧 Implementation Phases

### Phase 1: Add Shopify Discount API Functions

**File:** `lib/shopify.ts`

```typescript
// Add these functions to lib/shopify.ts

export async function validateShopifyDiscount(code: string) {
  const query = `
    query getDiscountCode($code: String!) {
      codeDiscountNodeByCode(code: $code) {
        id
        codeDiscount {
          ... on DiscountCodeBasic {
            title
            status
            startsAt
            endsAt
            usageLimit
            asyncUsageCount
            customerGets {
              value {
                ... on DiscountPercentage {
                  percentage
                }
                ... on DiscountAmount {
                  amount {
                    amount
                    currencyCode
                  }
                }
              }
            }
            customerSelection {
              ... on DiscountCustomerAll {
                allCustomers
              }
            }
          }
        }
      }
    }
  `;
  
  const response = await shopifyAdminFetch(query, { code });
  return response.data?.codeDiscountNodeByCode;
}

export async function createShopifyDiscountCode(
  title: string,
  code: string,
  percentOff: number,
  endsAt: Date,
  usageLimit: number = 1
) {
  const mutation = `
    mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
      discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
        codeDiscountNode {
          id
          codeDiscount {
            ... on DiscountCodeBasic {
              codes(first: 1) {
                nodes {
                  code
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    basicCodeDiscount: {
      title,
      code,
      startsAt: new Date().toISOString(),
      endsAt: endsAt.toISOString(),
      usageLimit,
      customerGets: {
        value: {
          percentage: percentOff / 100
        },
        items: {
          all: true
        }
      },
      customerSelection: {
        all: true
      }
    }
  };

  return shopifyAdminFetch(mutation, variables);
}
```

---

### Phase 2: Create New Validation Endpoint

**File:** `app/api/shopify/validate-discount/route.ts` (NEW)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { validateShopifyDiscount } from '@/lib/shopify';

export async function POST(req: NextRequest) {
  try {
    const { couponCode, subtotal } = await req.json();

    if (!couponCode) {
      return NextResponse.json({ error: 'Coupon code required' }, { status: 400 });
    }

    const discount = await validateShopifyDiscount(couponCode.toUpperCase());

    if (!discount || !discount.codeDiscount) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 });
    }

    const { codeDiscount } = discount;

    // Check if discount is active
    if (codeDiscount.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'This coupon is no longer active' }, { status: 400 });
    }

    // Check expiration
    if (codeDiscount.endsAt && new Date(codeDiscount.endsAt) < new Date()) {
      return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 });
    }

    // Check usage limit
    if (codeDiscount.usageLimit && codeDiscount.asyncUsageCount >= codeDiscount.usageLimit) {
      return NextResponse.json({ error: 'This coupon has reached its usage limit' }, { status: 400 });
    }

    // Calculate discount
    const percentOff = codeDiscount.customerGets?.value?.percentage 
      ? codeDiscount.customerGets.value.percentage * 100 
      : 0;

    const discountAmount = Math.round((subtotal * percentOff) / 100);

    return NextResponse.json({
      valid: true,
      code: couponCode.toUpperCase(),
      title: codeDiscount.title,
      percentOff,
      discountAmount,
      source: 'shopify'
    });

  } catch (error) {
    console.error('Shopify discount validation error:', error);
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
```

---

### Phase 3: Update Existing Validation Endpoint

**File:** `app/api/coupons/validate/route.ts`

```typescript
// Update to use Shopify as primary, fallback to custom
import { NextRequest, NextResponse } from 'next/server';
import { validateShopifyDiscount } from '@/lib/shopify';
import { CouponRepository } from '@/lib/db/storage';

export async function POST(req: NextRequest) {
  try {
    const { couponCode, subtotal } = await req.json();

    if (!couponCode) {
      return NextResponse.json({ error: 'Coupon code required' }, { status: 400 });
    }

    const code = couponCode.toUpperCase();

    // Try Shopify first
    try {
      const shopifyDiscount = await validateShopifyDiscount(code);
      
      if (shopifyDiscount?.codeDiscount?.status === 'ACTIVE') {
        const percentOff = shopifyDiscount.codeDiscount.customerGets?.value?.percentage 
          ? shopifyDiscount.codeDiscount.customerGets.value.percentage * 100 
          : 0;

        return NextResponse.json({
          valid: true,
          percentOff,
          code,
          source: 'shopify'
        });
      }
    } catch (shopifyError) {
      console.warn('Shopify discount lookup failed, trying custom:', shopifyError);
    }

    // Fallback to custom system (for loyalty coupons)
    const customCoupon = CouponRepository.findByCode(code);
    if (customCoupon && customCoupon.is_active && new Date(customCoupon.expires_at) > new Date()) {
      return NextResponse.json({
        valid: true,
        percentOff: customCoupon.percent_off,
        code,
        source: 'custom'
      });
    }

    return NextResponse.json({ error: 'Invalid or expired coupon' }, { status: 400 });

  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
```

---

### Phase 4: Update Loyalty Coupon Creation

**File:** `app/api/razorpay/webhook/route.ts`

Update the loyalty coupon creation to use Shopify:

```typescript
// After successful payment, create Shopify discount code
import { createShopifyDiscountCode } from '@/lib/shopify';

// In the payment.captured handler:
const loyaltyCode = `LOYALTY-${userId.slice(-6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
const expiresAt = new Date();
expiresAt.setDate(expiresAt.getDate() + 30); // 30 days validity

try {
  await createShopifyDiscountCode(
    `Loyalty Coupon for ${userEmail}`,
    loyaltyCode,
    10, // 10% off
    expiresAt,
    1 // Single use
  );
  
  // Send email with coupon code
  await sendLoyaltyCouponEmail(userEmail, loyaltyCode);
} catch (error) {
  console.error('Failed to create Shopify loyalty coupon:', error);
  // Fallback to custom system
  CouponRepository.create({
    code: loyaltyCode,
    percent_off: 10,
    expires_at: expiresAt,
    is_active: true,
    clerk_user_id: userId
  });
}
```

---

### Phase 5: Update Promotion Engine

**File:** `lib/promotions/engine.ts`

```typescript
// Update validateCoupon function
async function validateCoupon(
  code: string,
  clerkUserId?: string
): Promise<{ percent_off: number; source: string } | null> {
  
  // Try Shopify first
  try {
    const shopifyDiscount = await validateShopifyDiscount(code);
    
    if (shopifyDiscount?.codeDiscount?.status === 'ACTIVE') {
      const percentOff = shopifyDiscount.codeDiscount.customerGets?.value?.percentage 
        ? shopifyDiscount.codeDiscount.customerGets.value.percentage * 100 
        : 0;

      return { percent_off: percentOff, source: 'shopify' };
    }
  } catch (error) {
    console.warn('Shopify validation failed:', error);
  }

  // Fallback to custom system
  const coupon = CouponRepository.findByCode(code);
  if (!coupon) return null;

  if (!coupon.is_active) return null;
  if (new Date(coupon.expires_at) < new Date()) return null;
  if (coupon.clerk_user_id && coupon.clerk_user_id !== clerkUserId) return null;

  return { percent_off: coupon.percent_off, source: 'custom' };
}
```

---

## 📋 Migration Checklist

### Pre-Migration
- [ ] Backup existing coupon data
- [ ] Create test discount codes in Shopify admin
- [ ] Test Shopify Admin API access
- [ ] Verify API permissions for discount operations

### Migration Steps
- [ ] Add Shopify discount functions to `lib/shopify.ts`
- [ ] Create new validation endpoint
- [ ] Update existing validation endpoint with fallback
- [ ] Update promotion engine
- [ ] Update loyalty coupon creation webhook
- [ ] Test all discount scenarios

### Post-Migration
- [ ] Monitor for errors in production
- [ ] Verify loyalty coupons created in Shopify
- [ ] Check discount redemption analytics
- [ ] Remove custom coupon system (optional, keep as fallback)

---

## 🧪 Testing Plan

### Test 1: Shopify Discount Code
1. Create discount code "TEST10" (10% off) in Shopify admin
2. Apply code in cart
3. Verify 10% discount applied
4. Complete checkout
5. Verify code marked as used

### Test 2: Loyalty Coupon Creation
1. Complete a purchase as new user
2. Check Shopify admin for new discount code
3. Verify email sent with coupon code
4. Apply loyalty coupon on next purchase
5. Verify single-use restriction

### Test 3: Fallback System
1. Disable Shopify API temporarily
2. Apply custom coupon code
3. Verify fallback to custom system works
4. Re-enable Shopify API

### Test 4: Invalid Codes
1. Apply non-existent code
2. Apply expired code
3. Apply already-used code
4. Verify appropriate error messages

---

## ⚠️ Important Notes

### API Rate Limits
Shopify Admin API has rate limits. Consider caching discount validation results for a short period (e.g., 5 minutes).

### Error Handling
Always have fallback to custom system in case Shopify API is unavailable.

### Discount Code Format
Recommend standardized format:
- Loyalty: `LOYALTY-XXXXXX-XXXXXX`
- Promotional: `PROMO-XXXXXX`
- First Purchase: `WELCOME-XXXXXX`

### Security
- Never expose Shopify Admin API token to client
- Validate all coupon codes server-side
- Log all discount applications for audit

---

## 🎯 Timeline Estimate

| Phase | Duration | Priority |
|-------|----------|----------|
| Phase 1: API Functions | 2 hours | High |
| Phase 2: New Endpoint | 1 hour | High |
| Phase 3: Update Existing | 1 hour | High |
| Phase 4: Loyalty Coupons | 2 hours | Medium |
| Phase 5: Promotion Engine | 1 hour | Medium |
| Testing | 3 hours | High |
| **Total** | **10 hours** | - |

---

## 📝 Summary

This integration plan provides:
1. **Seamless migration** from custom to Shopify discounts
2. **Fallback support** for reliability
3. **Loyalty coupon automation** via Shopify
4. **Comprehensive testing** strategy
5. **Clear timeline** for implementation

**Recommended Approach:** Implement in phases, keeping custom system as fallback until Shopify integration is fully tested and stable.

---

**Document Created:** January 15, 2026
**Status:** Ready for Implementation
**Estimated Effort:** 10 hours
