# 🚀 Manual Shopify Metaobjects Setup Guide

Since the automated script approach has API limitations, follow this step-by-step manual guide to set up your dynamic content system.

## 📋 Step 1: Create Metaobject Definitions in Shopify Admin

### 1.1 Access Metaobjects
1. Go to your **Shopify Admin** (solitarioind.myshopify.com/admin)
2. Navigate to **Settings** → **Custom Data** → **Metaobjects**
3. Click **"Add definition"**

---

### 1.2 Create Hero Section Definition

**Click "Add definition"** and fill in:

- **Name**: `Hero Section`
- **Type**: `hero_section` (will auto-generate)

**Add these fields one by one:**

| Order | Field Name | Field Type | Key | Required | Description |
|-------|------------|------------|-----|----------|-------------|
| 1 | Title | Single line text | `title` | ✅ | Main headline |
| 2 | Subtitle | Single line text | `subtitle` | ❌ | Secondary text |
| 3 | Description | Multi-line text | `description` | ❌ | Additional text |
| 4 | Background Image | File | `background_image` | ✅ | Hero image |
| 5 | CTA Text | Single line text | `cta_text` | ❌ | Button text |
| 6 | CTA Link | URL | `cta_link` | ❌ | Button destination |
| 7 | Is Active | Boolean | `is_active` | ✅ | Show/hide |

**Important Settings:**
- Set **Access** to "Storefront API access" → **Public read**
- Click **Save**

---

### 1.3 Create Observatory Event Definition

**Click "Add definition"** and fill in:

- **Name**: `Observatory Event`
- **Type**: `observatory_event`

**Add these fields:**

| Order | Field Name | Field Type | Key | Required | Description |
|-------|------------|------------|-----|----------|-------------|
| 1 | Title | Single line text | `title` | ✅ | Event name |
| 2 | Description | Multi-line text | `description` | ✅ | Event details |
| 3 | Start Date | Date and time | `start_date` | ✅ | Event start |
| 4 | End Date | Date and time | `end_date` | ✅ | Event end |
| 5 | Banner Image | File | `banner_image` | ❌ | Optional image |
| 6 | CTA Text | Single line text | `cta_text` | ❌ | Action button |
| 7 | CTA Link | URL | `cta_link` | ❌ | Button link |
| 8 | Is Active | Boolean | `is_active` | ✅ | Enable/disable |
| 9 | Priority | Number (integer) | `priority` | ✅ | Display order |

**Settings:**
- Set **Access** to "Storefront API access" → **Public read**
- Click **Save**

---

### 1.4 Create Dynamic Banner Definition

**Click "Add definition"** and fill in:

- **Name**: `Dynamic Banner`
- **Type**: `dynamic_banner`

**Add these fields:**

| Order | Field Name | Field Type | Key | Required | Description |
|-------|------------|------------|-----|----------|-------------|
| 1 | Title | Single line text | `title` | ✅ | Banner title |
| 2 | Description | Multi-line text | `description` | ❌ | Banner text |
| 3 | Image | File | `image` | ✅ | Banner image |
| 4 | CTA Text | Single line text | `cta_text` | ❌ | Button text |
| 5 | CTA Link | URL | `cta_link` | ❌ | Button link |
| 6 | Is Active | Boolean | `is_active` | ✅ | Show/hide |
| 7 | Display Order | Number (integer) | `display_order` | ✅ | Sort order |
| 8 | Schedule Type | Single line text | `schedule_type` | ✅ | Scheduling |
| 9 | Start Date | Date and time | `start_date` | ❌ | For date ranges |
| 10 | End Date | Date and time | `end_date` | ❌ | For date ranges |

**Special Settings for Schedule Type:**
- Add **Validation** → **Choices**
- Enter these exact values: `always`, `date_range`, `alternating`

**Settings:**
- Set **Access** to "Storefront API access" → **Public read**
- Click **Save**

---

## 📝 Step 2: Create Sample Content

### 2.1 Create Your First Hero Section

1. Go to **Content** → **Metaobjects** → **Hero Section**
2. Click **"Add entry"**
3. Fill in:
   - **Handle**: `home-hero-lohri` (auto-generated from title)
   - **Title**: `Celebrate Makar Sankranti`
   - **Subtitle**: `Special Festival Collection`
   - **Description**: `Discover our exclusive jewelry collection for the festival of kites`
   - **Background Image**: Upload your Lohri banner image
   - **CTA Text**: `Shop Festival Collection`
   - **CTA Link**: `/products`
   - **Is Active**: ✅ (checked)
4. Click **Save**

### 2.2 Create Observatory Event

1. Go to **Content** → **Metaobjects** → **Observatory Event**
2. Click **"Add entry"**
3. Fill in:
   - **Handle**: `makar-sankranti-2026`
   - **Title**: `Makar Sankranti Special`
   - **Description**: `Celebrate with 20% off all jewelry collections!`
   - **Start Date**: `2026-01-14 00:00`
   - **End Date**: `2026-01-16 23:59`
   - **CTA Text**: `Shop Sale`
   - **CTA Link**: `/collections/sale`
   - **Is Active**: ✅ (checked)
   - **Priority**: `10`
4. Click **Save**

### 2.3 Create Dynamic Banners

**Banner 1 (Always Show):**
1. Go to **Content** → **Metaobjects** → **Dynamic Banner**
2. Click **"Add entry"**
3. Fill in:
   - **Handle**: `free-shipping-banner`
   - **Title**: `Free Shipping`
   - **Description**: `On orders above ₹25,000`
   - **Image**: Upload a shipping banner image
   - **CTA Text**: `Shop Now`
   - **CTA Link**: `/products`
   - **Is Active**: ✅
   - **Display Order**: `1`
   - **Schedule Type**: `always`
4. Click **Save**

**Banner 2 (Alternating):**
1. Create another entry:
   - **Handle**: `valentine-special`
   - **Title**: `Valentine's Special`
   - **Description**: `Express your love with diamonds`
   - **Image**: Upload valentine banner
   - **CTA Text**: `View Collection`
   - **CTA Link**: `/collections/rings`
   - **Is Active**: ✅
   - **Display Order**: `2`
   - **Schedule Type**: `alternating`
4. Click **Save**

---

## 🔧 Step 3: Verify Setup

### 3.1 Check Metaobject Access
1. Go to each metaobject definition
2. Verify **Access** is set to "Storefront API access" → **Public read**
3. This is crucial for the API to work

### 3.2 Test API Endpoints

Once your dev server is running, test these URLs:

```bash
# Test hero sections
curl "http://localhost:3000/api/dynamic-content?type=hero"

# Test current observatory event
curl "http://localhost:3000/api/dynamic-content?type=observatory&handle=current"

# Test dynamic banners
curl "http://localhost:3000/api/dynamic-content?type=banners"

# Test all content
curl "http://localhost:3000/api/dynamic-content?type=all"
```

---

## 🎯 Step 4: What You've Achieved

✅ **Dynamic Hero Images** - Update from Shopify admin
✅ **Observatory Events** - Auto-show during date ranges  
✅ **Alternating Banners** - Rotate daily automatically
✅ **Real-time Updates** - No code deployments needed
✅ **Mobile Responsive** - Works on all devices

---

## 📱 Daily Usage

### Update Hero Image:
1. Go to **Content** → **Metaobjects** → **Hero Section**
2. Edit existing or create new entry
3. Upload new image, change text
4. Toggle **Is Active** to show/hide
5. **Save** - Changes appear immediately!

### Add Observatory Event:
1. Go to **Content** → **Metaobjects** → **Observatory Event**
2. Create new event with future dates
3. Set **Priority** (10 = high, 5 = medium, 1 = low)
4. **Save** - Event shows automatically during date range

### Manage Banners:
1. Go to **Content** → **Metaobjects** → **Dynamic Banner**
2. Create multiple banners with different **Display Order**
3. Use **Schedule Type**:
   - `always` = Shows every day
   - `date_range` = Shows between start/end dates
   - `alternating` = Rotates daily (odd/even days)
4. **Save** - Banners update automatically

---

## 🚨 Troubleshooting

**API returns empty data?**
- Check **Storefront API access** is enabled
- Verify field keys match exactly (case-sensitive)
- Ensure **Is Active** is checked

**Images not showing?**
- Upload images directly in Shopify admin
- Check file formats (JPG, PNG, WebP)
- Verify image URLs in API response

**Observatory events not appearing?**
- Check current date is between start/end dates
- Verify **Is Active** is enabled
- Set **Priority** to 10 for testing

---

## 🎉 Success!

Your website now has dynamic content management! You can update hero images, observatory events, and banners without any code deployments. The system automatically handles scheduling and rotation.

**Next Steps:**
1. Create more hero sections for different campaigns
2. Set up seasonal observatory events
3. Create A/B test banners with alternating schedule
4. Train your team on the Shopify admin interface
