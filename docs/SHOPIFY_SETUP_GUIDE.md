# Shopify Dynamic Content Setup Guide

This guide will help you set up dynamic content management in your Shopify admin, allowing you to update hero images, observatory events, and banners without code deployments.

## 🎯 What You'll Be Able to Update Dynamically

1. **Hero Sections** - Home page and shop page hero images with custom text
2. **Observatory Events** - Monthly special events with banners
3. **Dynamic Banners** - Alternating promotional banners
4. **Special Announcements** - Time-sensitive content

---

## 📋 Step 1: Create Metaobject Definitions

Go to your Shopify Admin → Settings → Custom Data → Metaobjects

### 1.1 Hero Section Metaobject

**Click "Add definition"** and create:

- **Name**: `Hero Section`
- **Type**: `hero_section` (auto-generated)

**Add these fields:**

| Field Name | Field Type | Key | Required | Description |
|------------|------------|-----|----------|-------------|
| Title | Single line text | `title` | ✅ | Main headline text |
| Subtitle | Single line text | `subtitle` | ❌ | Secondary text |
| Description | Multi-line text | `description` | ❌ | Additional description |
| Background Image | File | `background_image` | ✅ | Hero background image |
| CTA Text | Single line text | `cta_text` | ❌ | Button text (e.g., "Shop Now") |
| CTA Link | URL | `cta_link` | ❌ | Button destination |
| Is Active | Boolean | `is_active` | ✅ | Show/hide this hero |

### 1.2 Observatory Event Metaobject

**Click "Add definition"** and create:

- **Name**: `Observatory Event`
- **Type**: `observatory_event`

**Add these fields:**

| Field Name | Field Type | Key | Required | Description |
|------------|------------|-----|----------|-------------|
| Title | Single line text | `title` | ✅ | Event name |
| Description | Multi-line text | `description` | ✅ | Event description |
| Start Date | Date and time | `start_date` | ✅ | When event starts |
| End Date | Date and time | `end_date` | ✅ | When event ends |
| Banner Image | File | `banner_image` | ❌ | Optional banner image |
| CTA Text | Single line text | `cta_text` | ❌ | Action button text |
| CTA Link | URL | `cta_link` | ❌ | Action button link |
| Is Active | Boolean | `is_active` | ✅ | Enable/disable event |
| Priority | Number (integer) | `priority` | ✅ | Display priority (higher = first) |

### 1.3 Dynamic Banner Metaobject

**Click "Add definition"** and create:

- **Name**: `Dynamic Banner`
- **Type**: `dynamic_banner`

**Add these fields:**

| Field Name | Field Type | Key | Required | Description |
|------------|------------|-----|----------|-------------|
| Title | Single line text | `title` | ✅ | Banner title |
| Description | Multi-line text | `description` | ❌ | Banner description |
| Image | File | `image` | ✅ | Banner image |
| CTA Text | Single line text | `cta_text` | ❌ | Button text |
| CTA Link | URL | `cta_link` | ❌ | Button destination |
| Is Active | Boolean | `is_active` | ✅ | Show/hide banner |
| Display Order | Number (integer) | `display_order` | ✅ | Sort order (1, 2, 3...) |
| Schedule Type | Single line text | `schedule_type` | ✅ | `always`, `date_range`, or `alternating` |
| Start Date | Date and time | `start_date` | ❌ | For date_range scheduling |
| End Date | Date and time | `end_date` | ❌ | For date_range scheduling |

---

## 📝 Step 2: Create Your First Content

### 2.1 Create a Hero Section

1. Go to **Content → Metaobjects → Hero Section**
2. Click **"Add entry"**
3. Fill in the details:
   - **Title**: "Discover Lab-Grown Diamonds"
   - **Subtitle**: "Ethical Beauty, Exceptional Quality"
   - **Description**: "Explore our collection of certified lab-grown diamonds"
   - **Background Image**: Upload your hero image
   - **CTA Text**: "Shop Collection"
   - **CTA Link**: "/products"
   - **Is Active**: ✅ (checked)
4. **Save**

### 2.2 Create an Observatory Event

1. Go to **Content → Metaobjects → Observatory Event**
2. Click **"Add entry"**
3. Fill in the details:
   - **Title**: "Makar Sankranti Special"
   - **Description**: "Celebrate with 20% off all jewelry"
   - **Start Date**: January 14, 2026 00:00
   - **End Date**: January 16, 2026 23:59
   - **CTA Text**: "Shop Sale"
   - **CTA Link**: "/collections/sale"
   - **Is Active**: ✅ (checked)
   - **Priority**: 10
4. **Save**

### 2.3 Create Dynamic Banners

**Banner 1 (Always Show):**
1. Go to **Content → Metaobjects → Dynamic Banner**
2. Click **"Add entry"**
3. Fill in:
   - **Title**: "Free Shipping"
   - **Description**: "On orders above ₹25,000"
   - **Image**: Upload banner image
   - **CTA Text**: "Shop Now"
   - **CTA Link**: "/products"
   - **Is Active**: ✅
   - **Display Order**: 1
   - **Schedule Type**: `always`
4. **Save**

**Banner 2 (Alternating):**
1. Create another entry:
   - **Title**: "Valentine's Special"
   - **Description**: "Express your love with diamonds"
   - **Image**: Upload valentine banner
   - **CTA Text**: "View Collection"
   - **CTA Link**: "/collections/rings"
   - **Is Active**: ✅
   - **Display Order**: 2
   - **Schedule Type**: `alternating`
4. **Save**

---

## 🔧 Step 3: Update Your Website Code

I've already created the dynamic components. Now you need to replace the static hero with the dynamic one:

### 3.1 Update Home Page

In your home page file, replace the Hero component:

```tsx
// Replace this:
import Hero from '@/components/home/Hero';

// With this:
import DynamicHero from '@/components/home/DynamicHero';

// And in your JSX:
<DynamicHero />
```

---

## 🎨 Step 4: How to Update Content (Daily Operations)

### For Hero Images:
1. Go to **Content → Metaobjects → Hero Section**
2. Click on existing entry or create new one
3. Update image, text, or CTA
4. Toggle **Is Active** to show/hide
5. **Save** - Changes appear immediately!

### For Observatory Events:
1. Go to **Content → Metaobjects → Observatory Event**
2. Create new event with future dates
3. Set **Priority** (higher number = shows first)
4. **Save** - Event will auto-show during date range

### For Alternating Banners:
1. Go to **Content → Metaobjects → Dynamic Banner**
2. Create multiple banners with **Schedule Type**: `alternating`
3. Set different **Display Order** numbers
4. **Save** - Banners will alternate daily

---

## 📅 Schedule Types Explained

### `always`
- Banner shows every day
- Good for: Permanent offers, shipping info

### `date_range`
- Banner shows only between Start Date and End Date
- Good for: Sales, seasonal promotions

### `alternating`
- Banners rotate daily based on Display Order
- Day 1: Banner with order 1, 3, 5...
- Day 2: Banner with order 2, 4, 6...
- Good for: Multiple promotions, A/B testing

---

## 🚀 Testing Your Setup

### Test API Endpoints:

1. **Hero Sections**: `https://yoursite.com/api/dynamic-content?type=hero`
2. **Current Observatory**: `https://yoursite.com/api/dynamic-content?type=observatory&handle=current`
3. **Today's Banners**: `https://yoursite.com/api/dynamic-content?type=banners&handle=alternating`
4. **All Content**: `https://yoursite.com/api/dynamic-content?type=all`

### Troubleshooting:

**Content not showing?**
- Check **Is Active** is enabled
- Verify dates for observatory events
- Check image URLs are valid

**API returning empty?**
- Ensure Metaobject types match exactly: `hero_section`, `observatory_event`, `dynamic_banner`
- Check field keys match the guide
- Verify Storefront API permissions

---

## 💡 Pro Tips

### For Observatory Events:
- Create events 1-2 weeks in advance
- Use Priority 10 for major events, 5 for minor ones
- Set end dates to avoid expired content

### For Alternating Banners:
- Create 4-6 banners for good variety
- Use even numbers (2, 4, 6) for one set, odd (1, 3, 5) for another
- Test by changing your computer date

### For Hero Images:
- Use high-quality images (1920x1080 minimum)
- Keep text short and impactful
- Test on mobile devices

---

## 🎯 What You've Achieved

✅ **No more code deployments** for content updates
✅ **Real-time content management** from Shopify admin
✅ **Automated scheduling** for events and banners
✅ **Alternating content** for better engagement
✅ **Observatory events** with date-based display
✅ **Mobile-responsive** dynamic content

Your website now updates instantly when you change content in Shopify admin!
