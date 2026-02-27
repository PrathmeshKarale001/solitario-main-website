# Dynamic Hero Content Guide

This guide shows you how to add and manage dynamic hero content for your Home page and Shop page using Shopify Metaobjects.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Home Page Hero Setup](#home-page-hero-setup)
- [Shop Page Hero Setup](#shop-page-hero-setup)
- [Field Descriptions](#field-descriptions)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

Your website now supports dynamic hero content that can be managed directly from Shopify Admin. This means you can:

- ✅ Update hero images without code deployments
- ✅ Add videos to hero sections
- ✅ Change CTA buttons and links
- ✅ Manage content for both Home and Shop pages separately
- ✅ Keep your original hardcoded content as fallback

## 📚 Prerequisites

1. **Shopify Admin access** with Metaobjects permissions
2. **Hero Section metaobject definition** already created
3. **Website updated with DynamicHero components** (already done)

## 🏠 Home Page Hero Setup

### Step 1: Access Shopify Metaobjects

1. Log in to **Shopify Admin**
2. Go to **Apps** → **Metaobjects**
3. Find and click on **"Hero Section"** definition

### Step 2: Add Home Hero Content

1. Click **"Add entry"** button
2. Fill in the fields (see [Field Descriptions](#field-descriptions))
3. Use handle starting with `home-hero-` (e.g., `home-hero-1`)
4. **Save** the entry

### Step 3: Multiple Home Heroes

You can create multiple home heroes:
- `home-hero-1` - First hero section
- `home-hero-2` - Second hero section  
- `home-hero-3` - Third hero section

The system will automatically rotate through all active home heroes.

## 🛒 Shop Page Hero Setup

### Step 1: Access Shopify Metaobjects

Same as Home page - go to **Apps** → **Metaobjects** → **"Hero Section"**

### Step 2: Add Shop Hero Content

1. Click **"Add entry"** button
2. Fill in the fields
3. **Important**: Use handle starting with `shop-hero-` (e.g., `shop-hero-1`)
4. **Save** the entry

### Step 3: Multiple Shop Heroes

You can create multiple shop heroes:
- `shop-hero-1` - First shop hero
- `shop-hero-2` - Second shop hero
- `shop-hero-3` - Third shop hero

## 📝 Field Descriptions

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| **Handle** | ✅ Yes | Unique identifier (use `home-hero-` or `shop-hero-` prefix) | `home-hero-1` |
| **Title** | ❌ No | Hero title (optional) | `New Collection` |
| **Subtitle** | ❌ No | Hero subtitle (optional) | `Discover our latest designs` |
| **Description** | ❌ No | Hero description (optional) | `Ethical lab-grown diamonds` |
| **Background Image** | ✅ Yes | Hero background image | Upload JPG/PNG |
| **Background Video** | ❌ No | Hero background video (MP4) | Upload MP4 file |
| **Media Type** | ❌ No | Choose `image` or `video` | `image` |
| **CTA Text** | ❌ No | Button text | `Shop Now` |
| **CTA Link** | ❌ No | Button destination URL | `/products` |
| **Is Active** | ✅ Yes | Enable/disable this hero | ✅ Checked |

## 🎨 Examples

### Example 1: Simple Home Hero with Image Only

```
Handle: home-hero-1
Background Image: [Upload your hero image]
CTA Text: Explore Collection
CTA Link: /products
Is Active: ✅
```

### Example 2: Home Hero with Text and Video

```
Handle: home-hero-2
Title: New Arrivals
Subtitle: Latest Collection 2024
Description: Discover our newest lab-grown diamond designs
Background Video: [Upload MP4 video]
Media Type: video
CTA Text: Shop Now
CTA Link: /products/new-arrivals
Is Active: ✅
```

### Example 3: Shop Hero with Custom CTA

```
Handle: shop-hero-1
Background Image: [Upload shop banner]
CTA Text: View All Products
CTA Link: #products
Is Active: ✅
```

### Example 4: Minimal Shop Hero

```
Handle: shop-hero-2
Background Image: [Upload minimal banner]
Is Active: ✅
```

## 🔄 How It Works

### Content Fetching

- **Home Page**: Fetches all hero sections (any handle)
- **Shop Page**: Fetches only hero sections with `shop-hero-` prefix
- **Fallback**: Shows original hardcoded content if no dynamic content found

### Display Logic

1. **Check for active metaobjects** in Shopify
2. **If found**: Display dynamic content
3. **If not found**: Use original hardcoded images
4. **CTA Position**: Bottom-center (matches original design)
5. **Rotation**: Auto-rotates through multiple heroes every 5 seconds

### Mobile vs Desktop

- **Desktop**: Uses desktop-sized images
- **Mobile**: Uses mobile-sized images (if available)
- **Fallback**: Uses same image for both if mobile version not provided

## 🛠️ Troubleshooting

### Content Not Showing

1. **Check Shopify Admin**: Make sure hero entry is saved and "Is Active" is checked
2. **Wait 1-2 minutes**: Shopify needs time to update API
3. **Check browser console**: Look for any API errors
4. **Verify handle**: Home heroes can use any handle, shop heroes must start with `shop-hero-`

### Images Not Loading

1. **Check image format**: Use JPG, PNG, or WebP
2. **Check file size**: Keep images under 5MB
3. **Verify image URL**: Make sure image is properly uploaded to Shopify

### CTA Button Not Working

1. **Check CTA Link**: Make sure URL is valid (starts with `/` for internal links)
2. **Check CTA Text**: Button won't show if text is empty
3. **Check JSON format**: If using complex links, ensure proper JSON format

### Video Not Playing

1. **Check video format**: Use MP4 format
2. **Check Media Type**: Set to `video`
3. **Check file size**: Keep videos under 50MB
4. **Test in different browsers**: Some browsers have different video support

## 📱 Best Practices

### Images

- **Size**: 1920x1080px for desktop, 1080x1920px for mobile
- **Format**: WebP for best performance, JPG/PNG as fallback
- **Compression**: Keep file size under 2MB for fast loading

### Videos

- **Format**: MP4 with H.264 codec
- **Length**: Keep under 30 seconds for hero videos
- **Size**: Compress to under 10MB
- **Autoplay**: Videos are muted and autoplay automatically

### Content Strategy

- **Home Page**: Use lifestyle and brand-focused content
- **Shop Page**: Use product-focused and promotional content
- **CTA**: Keep button text short and action-oriented
- **Rotation**: Create 3-5 heroes per page for variety

## 🔄 Content Updates

### Quick Updates

1. **Edit existing hero**: Find entry in Shopify Admin and modify
2. **Add new hero**: Create new entry with unique handle
3. **Deactivate hero**: Uncheck "Is Active" to temporarily disable
4. **Delete hero**: Delete entry to permanently remove

### Scheduling

- **No built-in scheduling**: Use "Is Active" to manually control
- **Date-based**: Plan content updates and activate/deactivate as needed
- **Testing**: Always test changes in development first

## 🎯 Advanced Tips

### Multiple CTAs

You can create multiple heroes with different CTAs:
- Hero 1: "Shop Collection" → `/products`
- Hero 2: "Learn More" → `/about`
- Hero 3: "Contact Us" → `/contact`

### Seasonal Content

Create seasonal heroes and activate them as needed:
- `home-hero-valentine`
- `home-hero-diwali`
- `home-hero-christmas`

### A/B Testing

Create similar heroes with different CTAs to test performance:
- `home-hero-test-a`
- `home-hero-test-b`

## 📞 Support

If you encounter issues:

1. **Check browser console** for error messages
2. **Verify Shopify credentials** in `.env.local`
3. **Test API endpoints**: `/api/dynamic-content?type=hero`
4. **Check metaobject permissions** in Shopify Admin

## 🚀 Next Steps

Once you're comfortable with basic hero content:

1. **Add video content** for more engaging heroes
2. **Create seasonal campaigns** with scheduled activation
3. **Test different CTA strategies** for better conversion
4. **Monitor performance** and optimize based on results

---

**Remember**: Your original hardcoded content will always work as a fallback, so you can experiment with dynamic content without breaking your site!
