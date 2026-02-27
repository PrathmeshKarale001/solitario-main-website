# Shopify Hero Loading Issue - Diagnosis Report

## 🔍 Problem Analysis

### **Issue**: Shopify home hero is not loading
- **API Response**: `{ "success": true, "data": [] }`
- **Root Cause**: Metaobject definitions not created in Shopify Admin

### **🧪 Tests Performed**:

1. **API Endpoint Test**: `/api/dynamic-content?type=home-hero`
   - ✅ Returns success: true
   - ❌ Returns empty data array

2. **Direct Shopify API Test**: 
   - ❌ Returns HTML instead of JSON
   - **Status**: 200 OK but wrong content type

3. **Environment Variables**:
   - ✅ `SHOPIFY_STORE_DOMAIN`: solitarioind
   - ✅ `SHOPIFY_STOREFRONT_ACCESS_TOKEN`: Present

## 🎯 Root Cause

### **Metaobject Definitions Missing**
The `home_hero` metaobject definition has not been created in Shopify Admin. This is why:
- API returns empty data
- Direct GraphQL queries fail
- No entries can be created

## 🛠️ Solution Steps

### **Step 1: Create Metaobject Definitions in Shopify Admin**

1. **Go to Shopify Admin**
2. **Navigate to**: Apps → Metaobjects
3. **Click**: "Add definition"

#### **Create Home Hero Definition:**
- **Name**: `Home Hero`
- **Type**: `home_hero`
- **Description**: `Hero sections for the home page`

#### **Add Required Fields:**
| Field Name | Field Type | Required | Description |
|-----------|------------|----------|-------------|
| Background Image | File reference | ✅ Yes | Hero background image |
| Is Active | Boolean | ✅ Yes | Enable/disable hero |
| Display Order | Number integer | ❌ No | Sort order |
| CTA Text | Single line text | ❌ No | Button text |
| CTA Link | URL | ❌ No | Button destination |
| Media Type | Single line text | ❌ No | Image or video |
| Background Video | File reference | ❌ No | Hero background video |
| Title | Single line text | ❌ No | Hero title |
| Subtitle | Single line text | ❌ No | Hero subtitle |
| Description | Multi line text | ❌ No | Hero description |

#### **Media Type Validation:**
- **Choices**: `image`, `video`
- **Default**: `image`

#### **Access Settings:**
- **Storefront access**: `Public read`
- **Admin access**: `Read and write`

### **Step 2: Create Shop Hero Definition**

1. **Click**: "Add definition" again
2. **Settings**:
   - **Name**: `Shop Hero`
   - **Type**: `shop_hero`
   - **Description**: `Hero sections for the shop/products page`
3. **Add same fields** as Home Hero

### **Step 3: Add Sample Content**

#### **Home Hero Entry:**
1. **Click** on "Home Hero" metaobject
2. **Click** "Add entry"
3. **Fill in**:
   ```
   Handle: home-hero-welcome
   Background Image: [Upload your hero image]
   CTA Text: Explore Collection
   CTA Link: /products
   Is Active: ✅
   Display Order: 1
   ```
4. **Save**

#### **Shop Hero Entry:**
1. **Click** on "Shop Hero" metaobject
2. **Click** "Add entry"
3. **Fill in**:
   ```
   Handle: shop-hero-collection
   Background Image: [Upload shop banner]
   CTA Text: Shop Collection
   CTA Link: #products
   Is Active: ✅
   Display Order: 1
   ```
4. **Save**

### **Step 4: Test the System**

1. **Wait 1-2 minutes** for Shopify to update
2. **Test API**: `curl "http://localhost:3000/api/dynamic-content?type=home-hero"`
3. **Check website**: Visit home page
4. **Verify**: Hero content appears

## 🔧 Alternative: Use Legacy Hero System

If metaobjects are not working, you can temporarily use the legacy system:

1. **Create** the old "Hero Section" metaobject definition
2. **Type**: `hero_section`
3. **Use**: `/api/dynamic-content?type=hero`

## 📋 Verification Checklist

### **Before Testing:**
- [ ] Metaobject definitions created in Shopify Admin
- [ ] At least one entry added to each metaobject
- [ ] "Is Active" checked for entries
- [ ] Images uploaded to entries
- [ ] Wait 1-2 minutes after saving

### **After Setup:**
- [ ] API returns data: `{ "success": true, "data": [...] }`
- [ ] Home page shows Shopify content
- [ ] Shop page shows Shopify content
- [ ] Static content loads after Shopify content
- [ ] CTA buttons work correctly

## 🚀 Expected Behavior

### **With Metaobjects Working:**
1. **Home Page**: Shows Shopify home heroes first, then static content
2. **Shop Page**: Shows Shopify shop heroes first, then static content
3. **Fallback**: Always shows static content if Shopify fails
4. **Rotation**: Auto-rotates through multiple entries

### **Content Flow:**
```
Shopify Content (if available) → Static Content (fallback)
```

## 📞 Support

If issues persist:

1. **Check Shopify Admin** for metaobject errors
2. **Verify API tokens** in `.env.local`
3. **Check browser console** for JavaScript errors
4. **Test static content** works (should always work)

## 🎯 Next Steps

1. **Create metaobject definitions** in Shopify Admin
2. **Add sample content** to test
3. **Verify API responses** return data
4. **Test website** displays content
5. **Remove debug logging** once working

---

**Status**: 🟡 **Waiting for Metaobject Creation in Shopify Admin**
