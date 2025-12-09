# Razorpay Payment Integration Setup Guide

## Overview

This document provides step-by-step instructions to configure Razorpay payment gateway for the Solitario website.

## Prerequisites

- Razorpay Account (Sign up at https://razorpay.com)
- Access to Razorpay Dashboard

---

## Step 1: Get API Keys

### For Testing (Sandbox)

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Switch to **Test Mode** (toggle at top-left)
3. Go to **Settings** → **API Keys**
4. Click **Generate Test Key**
5. Copy both:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret**

### For Production (Live)

1. Complete KYC verification on Razorpay
2. Switch to **Live Mode**
3. Go to **Settings** → **API Keys**
4. Click **Generate Live Key**
5. Copy both:
   - **Key ID** (starts with `rzp_live_`)
   - **Key Secret**

---

## Step 2: Configure Environment Variables

Add these to your `.env.local` file:

```env
# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
```

**Important:**
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are server-side only
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` is exposed to the browser (this is safe, it's the public key)

---

## Step 3: Configure Webhook (Optional but Recommended)

Webhooks provide real-time payment status updates.

### Create Webhook in Razorpay

1. Go to **Settings** → **Webhooks**
2. Click **Add New Webhook**
3. Enter Webhook URL: `https://your-domain.com/api/razorpay/webhook`
4. Select Events:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
   - `refund.created`
5. Copy the **Webhook Secret**
6. Click **Create Webhook**

### Add Webhook Secret to Environment

```env
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
```

---

## Step 4: Vercel Environment Variables

If deploying to Vercel, add these environment variables:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:

| Name | Value | Environment |
|------|-------|-------------|
| `RAZORPAY_KEY_ID` | `rzp_live_xxx` | Production |
| `RAZORPAY_KEY_SECRET` | `xxx` | Production |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_live_xxx` | Production |
| `RAZORPAY_WEBHOOK_SECRET` | `xxx` | Production |

For testing, add the same with test keys for Preview/Development environments.

---

## Step 5: Test the Integration

### Test Card Numbers

Use these test cards in Test Mode:

| Card Type | Number | CVV | Expiry |
|-----------|--------|-----|--------|
| Mastercard | 5267 3181 8797 5449 | Any 3 digits | Any future date |
| Visa | 4111 1111 1111 1111 | Any 3 digits | Any future date |

### Test UPI

- Use any UPI ID ending with `@razorpay` (e.g., `success@razorpay`)
- For failure testing, use `failure@razorpay`

### Test Net Banking

- Select any bank
- Use OTP: `1234`

---

## Payment Flow

```
┌─────────────────┐
│   Checkout Page │
│   (Customer     │
│   fills form)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Create Order    │
│ POST /api/      │
│ razorpay/       │
│ create-order    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Razorpay        │
│ Checkout Modal  │
│ (UPI/Card/etc)  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌───────┐
│Success│ │Failed │
└───┬───┘ └───┬───┘
    │         │
    ▼         ▼
┌─────────────────┐
│ Verify Payment  │
│ POST /api/      │
│ razorpay/       │
│ verify-payment  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────────┐ ┌───────────┐
│ /checkout │ │ /checkout │
│ /success  │ │ /failed   │
└───────────┘ └───────────┘
```

---

## API Endpoints

### POST /api/razorpay/create-order

Creates a Razorpay order.

**Request Body:**
```json
{
  "items": [...],
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": {...}
  },
  "subtotal": 50000,
  "shipping": 0,
  "tax": 1500,
  "total": 50000
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_xxx",
    "amount": 5000000,
    "currency": "INR",
    "receipt": "SOL_xxx"
  }
}
```

### POST /api/razorpay/verify-payment

Verifies payment signature after successful payment.

**Request Body:**
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "xxx",
  "orderData": {...}
}
```

### POST /api/razorpay/webhook

Receives webhook events from Razorpay.

---

## Troubleshooting

### "Payment gateway not configured"

- Check if `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set
- Restart the development server after adding env variables

### "Payment verification failed"

- Ensure `RAZORPAY_KEY_SECRET` is correct
- Check if you're using test keys in test mode and live keys in production

### Webhook not receiving events

- Verify webhook URL is accessible (not localhost)
- Check webhook secret is correct
- Ensure selected events match your implementation

### "Invalid key" error

- Make sure you're not mixing test and live keys
- Verify the key hasn't been regenerated

---

## Security Best Practices

1. **Never expose `RAZORPAY_KEY_SECRET`** - Keep it server-side only
2. **Always verify signatures** - Don't trust client-side payment status
3. **Use webhooks** - For reliable payment confirmation
4. **Log transactions** - Keep records for debugging and audits
5. **Handle failures gracefully** - Show user-friendly error messages

---

## Support

- **Razorpay Documentation:** https://razorpay.com/docs/
- **Razorpay Support:** https://razorpay.com/support/
- **API Reference:** https://razorpay.com/docs/api/

---

## Checklist Before Going Live

- [ ] KYC completed on Razorpay
- [ ] Live API keys generated
- [ ] Environment variables updated on Vercel
- [ ] Webhook configured with production URL
- [ ] Test transaction completed successfully
- [ ] Refund flow tested
- [ ] Error handling verified
