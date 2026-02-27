# Delhivery Hybrid Integration Architecture

## Overview

This document explains the **hybrid Delhivery integration** that combines both indirect (via Shopify) and direct (via Delhivery API) approaches to provide the best of both worlds.

---

## Integration Architecture

### 🔄 **Indirect Integration (Order Creation & AWB Management)**

**Flow:** Website → Razorpay → Shopify → Delhivery ONE

**Purpose:** Order creation and manual AWB approval workflow

**How it works:**
1. Customer completes payment via Razorpay
2. Order is created in Shopify (via `/api/razorpay/verify-payment`)
3. Shopify automatically syncs order to Delhivery ONE as **"Pending AWB"**
4. Management team reviews and manually approves AWB in Delhivery dashboard
5. Once approved, Delhivery generates waybill and updates Shopify with tracking info

**Benefits:**
- ✅ Manual quality control before shipping
- ✅ Centralized order management in Shopify
- ✅ No need to manage Delhivery credentials in payment flow
- ✅ Existing workflow preserved

**Configuration:**
- Shopify-Delhivery integration configured in Shopify admin
- No code changes required for this flow
- Orders appear in Delhivery ONE automatically

---

### 🚀 **Direct Integration (Tracking & Serviceability)**

**Flow:** Website → Delhivery API → Real-time data

**Purpose:** Customer-facing features (tracking, delivery estimates)

**How it works:**
1. **Real-time Tracking:**
   - After AWB is approved, waybill number is stored in Shopify fulfillment
   - Website fetches waybill from Shopify orders API
   - Direct API call to Delhivery to get real-time tracking status
   - Display tracking timeline on order detail page

2. **Delivery Estimates:**
   - Customer enters pincode on product/checkout page
   - Direct API call to Delhivery Serviceability API
   - Calculate ETA based on location and service type
   - Display estimated delivery date

**Benefits:**
- ✅ Real-time tracking updates for customers
- ✅ Accurate delivery estimates
- ✅ Better customer experience
- ✅ Reduced support queries

**Configuration:**
- Requires `DELHIVERY_API_KEY` in environment variables
- API endpoints already implemented

---

## API Endpoints

### 1. **Check Pincode Serviceability**

**Endpoint:** `GET /api/shipping/check-pincode?pincode=411001`

**Purpose:** Check if delivery is available to a pincode and get ETA

**Response:**
```json
{
  "success": true,
  "pincode": "411001",
  "serviceable": true,
  "cod": true,
  "prepaid": true,
  "eta": "Expected by Sat, 25 Jan"
}
```

**Usage:**
- Product detail page (delivery checker)
- Checkout page (validate address)
- Cart page (show delivery estimate)

---

### 2. **Track Shipment**

**Endpoint:** `GET /api/shipping/track?waybill=SOLI123456789`

**Purpose:** Get real-time tracking status from Delhivery

**Response:**
```json
{
  "success": true,
  "tracking": {
    "waybill": "SOLI123456789",
    "status": "In Transit",
    "statusLocation": "Mumbai Hub",
    "statusDateTime": "2026-01-24T10:30:00Z",
    "origin": "Pune",
    "destination": "Mumbai",
    "pickupDate": "2026-01-23",
    "scans": [
      {
        "dateTime": "2026-01-24T10:30:00Z",
        "status": "In Transit",
        "location": "Mumbai Hub",
        "instructions": "Package in transit"
      },
      {
        "dateTime": "2026-01-23T15:00:00Z",
        "status": "Picked Up",
        "location": "Pune Warehouse",
        "instructions": "Package picked up"
      }
    ]
  }
}
```

**Usage:**
- Order detail page (show tracking timeline)
- Order list page (show current status)
- Email notifications (include tracking link)

---

### 3. **Fetch Orders with Tracking**

**Endpoint:** `GET /api/account/orders`

**Purpose:** Get user's orders including tracking information from Shopify

**Response:**
```json
{
  "orders": [
    {
      "id": "gid://shopify/Order/123",
      "orderNumber": "1031",
      "date": "2026-01-23T12:00:00Z",
      "status": "shipped",
      "total": 32999,
      "trackingNumber": "SOLI123456789",
      "trackingUrl": "https://track.delhivery.com/...",
      "trackingCompany": "Delhivery",
      "fulfillmentStatus": "IN_TRANSIT",
      "items": [...],
      "shippingAddress": {...}
    }
  ]
}
```

**Data Flow:**
1. Shopify stores waybill in fulfillment after AWB approval
2. Orders API fetches fulfillment tracking info
3. Frontend uses waybill to call Delhivery tracking API
4. Real-time status displayed to customer

---

## Environment Variables

Add these to your `.env.local` and production environment:

```bash
# Delhivery API Configuration
DELHIVERY_API_KEY=your_delhivery_api_key_here

# Warehouse Details (for order creation - optional, only if creating orders directly)
DELHIVERY_WAREHOUSE_NAME=Solitario Warehouse
DELHIVERY_WAREHOUSE_ADDRESS=Your Warehouse Address
DELHIVERY_WAREHOUSE_CITY=Pune
DELHIVERY_WAREHOUSE_STATE=Maharashtra
DELHIVERY_WAREHOUSE_PIN=411001
DELHIVERY_WAREHOUSE_PHONE=9999999999
```

**Note:** Warehouse details are only needed if you want to create orders directly via Delhivery API (not currently used since we use Shopify-Delhivery sync).

---

## Implementation Status

### ✅ **Completed**

1. **Delhivery API Service** (`lib/delhivery.ts`)
   - Track shipment by waybill
   - Check pincode serviceability with ETA
   - Create shipment (available but not used)
   - Cancel shipment
   - Generate shipping label

2. **API Endpoints**
   - `/api/shipping/track` - Real-time tracking
   - `/api/shipping/check-pincode` - Serviceability & ETA
   - `/api/account/orders` - Orders with tracking info

3. **Orders API Enhancement**
   - Fetch fulfillment tracking from Shopify
   - Include waybill, tracking URL, company in response
   - Map fulfillment status

### 🚧 **In Progress**

4. **Frontend Components**
   - Update order detail page to show tracking timeline
   - Add real-time tracking status display
   - Show estimated delivery dates on product pages
   - Enhance pincode checker with ETA

---

## Workflow Example

### **Customer Orders a Ring**

1. **Payment & Order Creation:**
   ```
   Customer → Razorpay Payment → Shopify Order Created
   ```

2. **Automatic Sync to Delhivery:**
   ```
   Shopify → Delhivery ONE (Status: "Pending AWB")
   ```

3. **Manual AWB Approval (Your Team):**
   ```
   Delhivery Dashboard → Review Order → Approve AWB → Generate Waybill
   ```

4. **Tracking Info Synced Back:**
   ```
   Delhivery → Shopify Fulfillment (Waybill: SOLI123456789)
   ```

5. **Customer Checks Order Status:**
   ```
   Website → Fetch Orders API → Get Waybill from Shopify
   Website → Delhivery Tracking API → Real-time Status
   Customer sees: "In Transit - Mumbai Hub"
   ```

6. **Customer Checks Delivery on Product Page:**
   ```
   Customer enters pincode → Delhivery Serviceability API
   Shows: "Delivery by Sat, 25 Jan"
   ```

---

## Benefits of Hybrid Approach

### **Indirect Integration Benefits:**
- ✅ Manual quality control before shipping
- ✅ Centralized order management
- ✅ Reduced API complexity in payment flow
- ✅ Existing workflow preserved
- ✅ No risk of auto-shipping wrong orders

### **Direct Integration Benefits:**
- ✅ Real-time tracking for customers
- ✅ Accurate delivery estimates
- ✅ Better customer experience
- ✅ Reduced support queries
- ✅ Professional tracking interface

### **Combined:**
- ✅ Best of both worlds
- ✅ Manual control + automated customer updates
- ✅ Scalable and maintainable
- ✅ No workflow disruption

---

## Testing

### **Test Pincode Serviceability:**
```bash
curl "https://www.thesolitario.com/api/shipping/check-pincode?pincode=411001"
```

### **Test Tracking (after AWB approval):**
```bash
curl "https://www.thesolitario.com/api/shipping/track?waybill=YOUR_WAYBILL"
```

### **Test Orders API:**
```bash
# Login to website first, then:
curl "https://www.thesolitario.com/api/account/orders" \
  -H "Cookie: your_session_cookie"
```

---

## Troubleshooting

### **No tracking number showing:**
- Check if AWB has been approved in Delhivery dashboard
- Verify Shopify-Delhivery integration is active
- Check if fulfillment has been created in Shopify

### **Tracking API returns 404:**
- Waybill might not be active yet (wait for pickup)
- Verify waybill number is correct
- Check Delhivery API key is valid

### **Pincode shows not serviceable:**
- Verify pincode is correct (6 digits)
- Check if Delhivery serves that area
- Try with a known serviceable pincode (e.g., 411001)

---

## Future Enhancements

### **Potential Additions:**

1. **Automated Notifications:**
   - Send SMS/Email when order is shipped
   - Send SMS/Email when out for delivery
   - Send SMS/Email when delivered

2. **Delivery Preferences:**
   - Let customers choose delivery time slots
   - Add delivery instructions
   - Enable contactless delivery option

3. **Returns Integration:**
   - Create return shipments via API
   - Track return status
   - Automated refund on return delivery

4. **Analytics:**
   - Track average delivery time
   - Monitor delivery success rate
   - Identify problem pincodes

---

## Support

For issues or questions:
- Check Delhivery API docs: https://developer.delhivery.com/
- Check Shopify fulfillment docs: https://shopify.dev/docs/api/admin-graphql/latest/objects/Fulfillment
- Review logs in Sentry dashboard

---

**Last Updated:** January 24, 2026
**Integration Status:** ✅ Production Ready
**Maintained By:** Solitario Development Team
