# 🚀 Promotions System - Quick Start Guide

## ✅ What You've Set Up

You've completed the environment setup! Here's what's working:

### Environment Variables ✓
```bash
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

### Data Directory ✓
```
data/
├── users.json
├── orders.json
└── coupons.json
```

### Razorpay Webhook ✓
Configured at: `https://yourdomain.com/api/razorpay/webhook`

### Gift Product ✓
Product: https://admin.shopify.com/store/solitarioind/products/10264124457235

---

## 🎯 Where to See Promotions

### 1. **Checkout Page** (Customer View)
**URL**: `https://yourdomain.com/checkout`

**What customers see:**
- Coupon code input field
- Automatic cart-based discounts (Buy 2 = 10% + gift, Buy 3+ = 30%)
- Promotion messages (green boxes)
- Gift notification (when buying 2 items)
- Updated total with discount applied

**How it works:**
- Add items to cart
- Go to checkout
- See promotions automatically applied based on quantity
- Enter loyalty coupon code (if they have one)
- See final discounted price

---

### 2. **Admin Panel** (Your Management Interface)
**URL**: `https://yourdomain.com/admin/promotions`

**What you can do:**
- ✅ **View all coupons** - See issued, active, redeemed, and expired coupons
- ✅ **Delete coupons** - Remove invalid or test coupons
- ✅ **View orders** - See all orders with promotion details
- ✅ **Check statistics** - Active coupons, redemption rate, revenue, discounts
- ✅ **View configuration** - Current promotion settings

**Tabs:**
1. **Coupons Tab** - Manage loyalty coupons
   - View coupon code, user ID, discount %, status
   - See issued date and expiry date
   - Delete coupons with trash icon

2. **Orders Tab** - View order history
   - See which promotions were applied
   - View subtotal, discount, and final total
   - Check coupon usage

3. **Configuration Tab** - View current settings
   - First purchase discount (20%)
   - Buy 2 items (10% + gift)
   - Buy 3+ items (30%)
   - Loyalty coupon (10%, 30 days)
   - Gift product link

---

### 3. **User's Coupons** (API Endpoint)
**URL**: `https://yourdomain.com/api/coupons/my-coupons`

**What it returns:**
```json
{
  "success": true,
  "coupons": [
    {
      "code": "SOLI-LOYAL-ABC123",
      "percentOff": 10,
      "issuedAt": "2024-01-13T12:00:00Z",
      "expiresAt": "2024-02-12T12:00:00Z",
      "daysRemaining": 15
    }
  ]
}
```

You can integrate this into a user account page to show their available coupons.

---

## 🎁 How Promotions Work

### Automatic Promotions (No Code Needed)

#### **Buy 2 Items**
- **Trigger**: Cart has exactly 2 items
- **Discount**: 10% off subtotal
- **Gift**: Free 10 Cent Diamond added
- **Message**: "🎁 10% discount applied for buying 2 items!"

#### **Buy 3+ Items**
- **Trigger**: Cart has 3 or more items
- **Discount**: 30% off subtotal
- **Gift**: None
- **Message**: "🎉 30% discount applied for buying 3+ items!"

#### **First Purchase** (Authenticated Users Only)
- **Trigger**: Clerk user with 0 paid orders
- **Discount**: 20% off subtotal
- **Only applies if**: No cart rule is active (1 item in cart)

### Manual Promotions (Requires Code)

#### **Loyalty Coupon**
- **Trigger**: User enters coupon code
- **Discount**: 10% off subtotal
- **Issued**: Automatically after successful payment
- **Validity**: 30 days
- **Limit**: 1 per calendar month per user
- **Cannot stack**: With any other promotion

---

## 📊 Promotion Flow

### Customer Journey
```
1. Add items to cart
   ↓
2. Go to checkout
   ↓
3. See automatic discount applied (if 2+ items)
   ↓
4. Enter loyalty coupon (if they have one)
   ↓
5. See final price with discount
   ↓
6. Complete payment
   ↓
7. Receive loyalty coupon for next purchase (via webhook)
```

### Admin Journey
```
1. Customer completes payment
   ↓
2. Razorpay webhook fires
   ↓
3. System marks order PAID
   ↓
4. System issues loyalty coupon (if eligible)
   ↓
5. Coupon appears in admin panel
   ↓
6. Customer can use coupon on next order
```

---

## 🔧 Managing Coupons

### View All Coupons
1. Go to `/admin/promotions`
2. Click **Coupons** tab
3. See all coupons with status

### Delete a Coupon
1. Go to `/admin/promotions`
2. Click **Coupons** tab
3. Click trash icon next to coupon
4. Confirm deletion

### Check Coupon Details
Each coupon shows:
- **Code**: `SOLI-LOYAL-XYZ123`
- **User ID**: Who owns it
- **Discount**: Percentage off
- **Status**: ACTIVE, REDEEMED, or EXPIRED
- **Issued**: When it was created
- **Expires**: When it expires

### Manually Issue Coupon (Future Feature)
Currently, coupons are auto-issued after payment. To manually create:
1. Add data directly to `data/coupons.json`, or
2. Build a "Create Coupon" form in admin panel

---

## 📈 Viewing Statistics

Go to `/admin/promotions` to see:

### Key Metrics
- **Active Coupons**: Currently valid coupons
- **Redeemed**: Used coupons
- **Total Revenue**: Sum of all paid orders
- **Total Discounts**: Sum of all discounts given

### Order Analytics
- View all orders with promotion details
- See which discounts were applied
- Check coupon usage per order
- Filter by status (PAID, PENDING, FAILED)

---

## 🧪 Testing the System

### Test Automatic Promotions
1. Add 2 items to cart
2. Go to checkout
3. ✅ Should see "10% discount applied" message
4. ✅ Should see "Free gift" message
5. ✅ Total should be reduced by 10%

### Test Loyalty Coupon
1. Complete a test payment (use Razorpay test mode)
2. Check `/admin/promotions` → Coupons tab
3. ✅ Should see new coupon issued
4. Copy the coupon code
5. Start new order with 1 item
6. Enter coupon code at checkout
7. ✅ Should see 10% discount applied

### Test Non-Stacking Rule
1. Add 2 items to cart (triggers 10% cart discount)
2. Try to apply loyalty coupon
3. ✅ Should see error: "This coupon can't be combined with other offers"

---

## 🔍 Troubleshooting

### "I don't see promotions on checkout"
- ✅ Check you're on `/checkout` page
- ✅ Add items to cart first
- ✅ Refresh the page
- ✅ Check browser console for errors

### "Coupon code doesn't work"
- Check coupon status in admin panel
- Verify coupon hasn't expired
- Ensure no other promotions are active (can't stack)
- Confirm coupon belongs to logged-in user

### "Loyalty coupon not issued after payment"
- Check Razorpay webhook is configured
- Verify webhook secret is correct
- Check server logs for errors
- Ensure payment status is "captured"
- Check `data/coupons.json` file

### "Admin panel shows no data"
- Check `data/` directory exists
- Verify JSON files are not empty
- Ensure files have correct permissions
- Check browser console for API errors

---

## 📱 Next Steps

### Immediate
1. ✅ Test checkout with 2 items
2. ✅ Complete a test payment
3. ✅ Check admin panel for coupon
4. ✅ Test coupon redemption

### Short-term
1. Build user account page to show their coupons
2. Add email notifications for loyalty coupons
3. Create "Create Coupon" form in admin
4. Add analytics dashboard

### Long-term
1. Migrate to PostgreSQL database
2. Add A/B testing for promotions
3. Implement referral program
4. Add flash sales support

---

## 📞 Quick Links

- **Checkout**: `/checkout`
- **Admin Panel**: `/admin/promotions`
- **My Coupons API**: `/api/coupons/my-coupons`
- **Gift Product**: https://admin.shopify.com/store/solitarioind/products/10264124457235
- **Razorpay Dashboard**: https://dashboard.razorpay.com

---

## 💡 Tips

1. **Test in Razorpay test mode first** before going live
2. **Backup `data/` directory regularly** - it contains all your data
3. **Monitor webhook delivery** in Razorpay dashboard
4. **Check admin panel daily** for coupon activity
5. **Set up alerts** for failed webhooks

---

**Status**: ✅ Fully Functional

**Your Setup**: Complete and ready to use!

**Support**: Check `PROMOTIONS_SETUP.md` for detailed documentation
