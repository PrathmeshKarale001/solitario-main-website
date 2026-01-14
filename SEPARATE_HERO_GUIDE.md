# Separate Hero Metaobjects Setup Guide

This guide shows you how to set up separate metaobjects for **Home Hero** and **Shop Hero** pages, allowing you to manage content for each page independently.

## 📋 Table of Contents

- [Overview](#overview)
- [Why Separate Metaobjects?](#why-separate-metaobjects)
- [Prerequisites](#prerequisites)
- [Step 1: Create Home Hero Metaobject](#step-1-create-home-hero-metaobject)
- [Step 2: Create Shop Hero Metaobject](#step-2-create-shop-hero-metaobject)
- [Step 3: Add Home Hero Content](#step-3-add-home-hero-content)
- [Step 4: Add Shop Hero Content](#step-4-add-shop-hero-content)
- [Field Descriptions](#field-descriptions)
- [Examples](#examples)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

With separate metaobjects, you can:

- ✅ **Manage Home and Shop heroes independently**
- ✅ **Different field structures** for each page type
- ✅ **Separate content workflows** for different teams
- ✅ **Better organization** in Shopify Admin
- ✅ **Scalable system** for future page types

## 🤔 Why Separate Metaobjects?

### Before (Single Metaobject)
- One "Hero Section" metaobject for all pages
- Mixed content types in one place
- Hard to manage page-specific content
- Limited field customization per page

### After (Separate Metaobjects)
- **Home Hero** metaobject for home page only
- **Shop Hero** metaobject for shop page only
- Page-specific field structures
- Clear content separation
- Easy to extend for new pages

## 📚 Prerequisites

1. **Shopify Admin access** with Metaobjects permissions
2. **Website updated** with DynamicHero components (already done)
3. **Basic understanding** of Shopify Metaobjects

## 🏠 Step 1: Create Home Hero Metaobject

### Access Metaobjects

1. Log in to **Shopify Admin**
2. Go to **Apps** → **Metaobjects**
3. Click **"Add definition"**

### Configure Home Hero Definition

**Basic Settings:**
- **Name**: `Home Hero`
- **Type**: `home_hero`
- **Description**: `Hero sections for the home page`

### Add Fields

| Field Name | Field Type | Required | Description |
|-----------|------------|----------|-------------|
| Title | Single line text | ❌ No | Hero title (optional) |
| Subtitle | Single line text | ❌ No | Hero subtitle (optional) |
| Description | Multi line text | ❌ No | Hero description (optional) |
| Background Image | File reference | ✅ Yes | Hero background image |
| Background Video | File reference | ❌ No | Hero background video |
| Media Type | Single line text | ❌ No | Image or video |
| CTA Text | Single line text | ❌ No | Button text |
| CTA Link | URL | ❌ No | Button destination |
| Is Active | Boolean | ✅ Yes | Enable/disable hero |
| Display Order | Number integer | ❌ No | Sort order |

### Media Type Validation

For the **Media Type** field, add validation:
- **Choices**: `image`, `video`
- **Default**: `image`

### Access Settings

- **Storefront access**: `Public read`
- **Admin access**: `Read and write`

### Save Definition

Click **"Save metaobject definition"** to create the Home Hero metaobject.

## 🛒 Step 2: Create Shop Hero Metaobject

### Access Metaobjects

1. Stay in **Apps** → **Metaobjects**
2. Click **"Add definition"** again

### Configure Shop Hero Definition

**Basic Settings:**
- **Name**: `Shop Hero`
- **Type**: `shop_hero`
- **Description**: `Hero sections for the shop/products page`

### Add Fields

Use the **exact same field structure** as Home Hero:

| Field Name | Field Type | Required | Description |
|-----------|------------|----------|-------------|
| Title | Single line text | ❌ No | Hero title (optional) |
| Subtitle | Single line text | ❌ No | Hero subtitle (optional) |
| Description | Multi line text | ❌ No | Hero description (optional) |
| Background Image | File reference | ✅ Yes | Hero background image |
| Background Video | File reference | ❌ No | Hero background video |
| Media Type | Single line text | ❌ No | Image or video |
| CTA Text | Single line text | ❌ No | Button text |
| CTA Link | URL | ❌ No | Button destination |
| Is Active | Boolean | ✅ Yes | Enable/disable hero |
| Display Order | Number integer | ❌ No | Sort order |

### Media Type Validation

Same as Home Hero:
- **Choices**: `image`, `video`
- **Default**: `image`

### Access Settings

- **Storefront access**: `Public read`
- **Admin access**: `Read and write`

### Save Definition

Click **"Save metaobject definition"** to create the Shop Hero metaobject.

## 🏠 Step 3: Add Home Hero Content

### Create Home Hero Entry

1. In **Metaobjects**, click on **"Home Hero"**
2. Click **"Add entry"**

### Fill in Home Hero Fields

#### Example 1: Simple Home Hero
```
Handle: home-hero-welcome
Title: Welcome to Solitario
Subtitle: Ethical Lab-Grown Diamonds
Description: Discover our collection of sustainable luxury jewelry
Background Image: [Upload your hero image]
Media Type: image
CTA Text: Explore Collection
CTA Link: /products
Is Active: ✅
Display Order: 1
```

#### Example 2: Video Home Hero
```
Handle: home-hero-video
Title: New Collection 2024
Subtitle: Discover Something New
Background Video: [Upload MP4 video]
Media Type: video
CTA Text: Shop Now
CTA Link: /products/new
Is Active: ✅
Display Order: 2
```

#### Example 3: Minimal Home Hero
```
Handle: home-hero-minimal
Background Image: [Upload minimal banner]
Is Active: ✅
Display Order: 3
```

### Save Entry

Click **"Save"** to create the home hero entry.

## 🛒 Step 4: Add Shop Hero Content

### Create Shop Hero Entry

1. In **Metaobjects**, click on **"Shop Hero"**
2. Click **"Add entry"**

### Fill in Shop Hero Fields

#### Example 1: Shop Hero with CTA
```
Handle: shop-hero-collection
Title: Shop Our Collection
Subtitle: Find Your Perfect Piece
Description: Browse our curated selection of lab-grown diamond jewelry
Background Image: [Upload shop banner]
Media Type: image
CTA Text: View All Products
CTA Link: #products
Is Active: ✅
Display Order: 1
```

#### Example 2: Promotional Shop Hero
```
Handle: shop-hero-sale
Title: Special Offer
Subtitle: 20% Off Selected Items
Description: Limited time offer on our most popular pieces
Background Image: [Upload sale banner]
Media Type: image
CTA Text: Shop Sale
CTA Link: /products/sale
Is Active: ✅
Display Order: 2
```

#### Example 3: Category-focused Shop Hero
```
Handle: shop-hero-rings
Title: Diamond Rings
Subtitle: Timeless Elegance
Description: Explore our stunning collection of lab-grown diamond rings
Background Image: [Upload rings banner]
Media Type: image
CTA Text: Shop Rings
CTA Link: /products/rings
Is Active: ✅
Display Order: 3
```

### Save Entry

Click **"Save"** to create the shop hero entry.

## 📝 Field Descriptions

### Required Fields

| Field | Description | Tips |
|-------|-------------|------|
| **Background Image** | Hero background image | Use 1920x1080px for best results |
| **Is Active** | Enable/disable hero | Uncheck to temporarily hide |

### Optional Fields

| Field | Description | Best Practices |
|-------|-------------|---------------|
| **Title** | Main heading | Keep short and impactful |
| **Subtitle** | Secondary text | Add context without overwhelming |
| **Description** | Detailed text | Use for SEO and user context |
| **Background Video** | Video background | Use MP4, keep under 30 seconds |
| **Media Type** | Image or video | Set to 'video' for video content |
| **CTA Text** | Button text | Use action-oriented language |
| **CTA Link** | Button destination | Use `/` for internal links |
| **Display Order** | Sort order | Use 1, 2, 3... for sequence |

## 🎨 Examples

### Home Page Examples

#### Brand-focused Home Hero
```
Handle: home-hero-brand
Title: Solitario
Subtitle: Ethical Luxury
Description: Lab-grown diamonds that don't cost the Earth
Background Image: [Brand lifestyle image]
CTA Text: Explore Collection
CTA Link: /products
Is Active: ✅
Display Order: 1
```

#### Seasonal Home Hero
```
Handle: home-hero-valentine
Title: Valentine's Special
Subtitle: Love That Lasts
Description: Find the perfect gift for your loved one
Background Image: [Valentine's theme image]
CTA Text: Shop Valentine's
CTA Link: /products/valentine
Is Active: ✅
Display Order: 2
```

#### Product Launch Home Hero
```
Handle: home-hero-launch
Title: New Collection
Subtitle: Just Arrived
Description: Discover our latest designs
Background Video: [Product showcase video]
Media Type: video
CTA Text: Shop New
CTA Link: /products/new
Is Active: ✅
Display Order: 3
```

### Shop Page Examples

#### Collection-focused Shop Hero
```
Handle: shop-hero-all
Title: Complete Collection
Subtitle: Everything We Offer
Description: Browse our entire catalog of lab-grown diamond jewelry
Background Image: [Collection overview image]
CTA Text: View All
CTA Link: #products
Is Active: ✅
Display Order: 1
```

#### Category-specific Shop Hero
```
Handle: shop-hero-necklaces
Title: Diamond Necklaces
Subtitle: Elegant & Timeless
Description: Discover our stunning necklace collection
Background Image: [Necklace showcase image]
CTA Text: Shop Necklaces
CTA Link: /products/necklaces
Is Active: ✅
Display Order: 2
```

#### Promotional Shop Hero
```
Handle: shop-hero-promo
Title: Limited Time Offer
Subtitle: 20% Off Everything
Description: Don't miss out on our biggest sale of the year
Background Image: [Sale banner image]
CTA Text: Shop Sale
CTA Link: /products/sale
Is Active: ✅
Display Order: 3
```

## 🧪 Testing

### Test Home Page

1. **Add home hero content** in Shopify Admin
2. **Wait 1-2 minutes** for Shopify to update
3. **Visit your home page**: `http://localhost:3000`
4. **Check for new hero content**
5. **Verify CTA buttons work**

### Test Shop Page

1. **Add shop hero content** in Shopify Admin
2. **Wait 1-2 minutes** for Shopify to update
3. **Visit your shop page**: `http://localhost:3000/products`
4. **Check for new hero content**
5. **Verify CTA buttons work**

### Debug Console

Check browser console for:
- `🎯 DynamicHero component rendering...`
- `✅ Found X active home hero sections`
- `🛒 Found X active shop hero sections`

## 🔧 Troubleshooting

### Content Not Showing

**Check Shopify Admin:**
1. Metaobject entries are saved
2. "Is Active" is checked
3. Images are properly uploaded

**Check API:**
1. Visit `/api/dynamic-content?type=home-hero`
2. Visit `/api/dynamic-content?type=shop-hero`
3. Look for success responses

**Check Browser:**
1. Open browser console
2. Look for API errors
3. Refresh page (Ctrl+F5)

### Images Not Loading

**Common Issues:**
- Image format not supported (use JPG, PNG, WebP)
- File size too large (keep under 5MB)
- Image still processing in Shopify
- Wrong file reference selected

**Solutions:**
- Re-upload image in correct format
- Compress image before uploading
- Wait for Shopify to process
- Select correct file reference field

### CTA Button Not Working

**Check These:**
- CTA Text is not empty
- CTA Link is valid URL
- Link starts with `/` for internal pages
- JSON format is correct for complex links

**Examples:**
- ✅ `/products` (internal link)
- ✅ `#products` (page anchor)
- ✅ `https://external-site.com` (external link)
- ❌ `products` (missing slash)
- ❌ `www.site.com` (invalid format)

### Video Not Playing

**Check These:**
- Media Type is set to `video`
- Video is MP4 format
- File size is under 10MB
- Video is properly uploaded

**Best Practices:**
- Use H.264 codec
- Keep videos under 30 seconds
- Add fallback image
- Test in multiple browsers

### Multiple Heroes Not Rotating

**Check Display Order:**
- Set different numbers for each hero
- Use 1, 2, 3... sequence
- All heroes have "Is Active" checked

**Debug Order:**
1. Home Hero 1: Display Order 1
2. Home Hero 2: Display Order 2
3. Home Hero 3: Display Order 3

## 🚀 Advanced Usage

### Seasonal Content Strategy

**Create seasonal heroes and activate them as needed:**

#### Home Page Seasonal Heroes
- `home-hero-valentine` - Valentine's Day
- `home-hero-diwali` - Diwali
- `home-hero-christmas` - Christmas
- `home-hero-new-year` - New Year

#### Shop Page Seasonal Heroes
- `shop-hero-valentine-rings` - Valentine's Day rings
- `shop-hero-diwali-pendants` - Diwali pendants
- `shop-hero-christmas-earrings` - Christmas earrings

### A/B Testing

**Create test variants:**
- `home-hero-test-a` - Version A
- `home-hero-test-b` - Version B
- `shop-hero-test-a` - Shop version A
- `shop-hero-test-b` - Shop version B

**Monitor Performance:**
- Track CTA click rates
- Measure conversion rates
- Test different images
- Compare CTA text

### Content Scheduling

**Manual Activation:**
1. Create content in advance
2. Keep "Is Active" unchecked
3. Activate when needed
4. Deactivate when expired

**Best Practices:**
- Plan content calendar
- Create seasonal content in advance
- Test content before activation
- Have backup content ready

## 📱 Mobile Optimization

### Image Sizes

**Recommended Sizes:**
- **Desktop**: 2024x1080px
- **Mobile**: 1080x2024px
- **Tablet**: 1200x800px

### File Formats

**Best Performance:**
1. **WebP** - Modern format, best compression
2. **JPG** - Good compatibility, decent compression
3. **PNG** - Best quality, larger file size

### Video Optimization

**Recommended Settings:**
- **Format**: MP4 with H.264 codec
- **Resolution**: 1920x1080px
- **Frame Rate**: 30fps
- **Bitrate**: 2-5 Mbps
- **Duration**: Under 30 seconds

## 📊 Content Management

### Organization Tips

**Naming Convention:**
- Home heroes: `home-hero-[purpose]`
- Shop heroes: `shop-hero-[category]`
- Seasonal: `[page]-hero-[season]-[year]`

**Content Calendar:**
- **Q1**: Valentine's Day, Spring Collection
- **Q2**: Summer Collection, Wedding Season
- **Q3**: Fall Collection, Festival Season
- **Q4**: Holiday Season, New Year

### Approval Workflow

**Before Publishing:**
1. ✅ Content approved by marketing
2. ✅ Images optimized for web
3. ✅ Links tested and working
4. ✅ Mobile preview checked
5. ✅ SEO titles and descriptions added

**After Publishing:**
1. 📊 Monitor performance metrics
2. 🐛 Bug check on all devices
3. 📈 Track conversion rates
4. 🔄 Update based on performance

## 🎯 Next Steps

Once your separate metaobjects are set up:

1. **Create initial content** for both pages
2. **Test thoroughly** on all devices
3. **Monitor performance** and optimize
4. **Plan content calendar** for regular updates
5. **Train team members** on content management

## 📞 Support

If you encounter issues:

1. **Check Shopify Admin** for metaobject errors
2. **Verify API endpoints** are working
3. **Check browser console** for JavaScript errors
4. **Test fallback content** works correctly
5. **Review this guide** for troubleshooting steps

---

**Success!** 🎉

You now have separate metaobjects for Home and Shop heroes, allowing you to manage content for each page independently while maintaining a clean, organized system that's easy to scale for future page types.
