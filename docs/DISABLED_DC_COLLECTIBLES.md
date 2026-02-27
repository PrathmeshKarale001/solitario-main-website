# DC & Collectibles Content Disabled

## Changes Made:

### 1. Feature Flags Updated
- **Collectibles:** `NEXT_PUBLIC_FEATURE_COLLECTIBLES_ENABLED=false`
- **DC Banners:** `NEXT_PUBLIC_FEATURE_DC_BANNERS_ENABLED=false`

### 2. Content Now Hidden:

#### ❌ **Collectibles (Warner Bros)**
- Navbar CTA button (hidden)
- Floating bottom button (hidden)
- Warner Bros hero images (removed from carousel)
- Warner Bros collection page (inaccessible)
- Mobile menu link (hidden)

#### ❌ **DC Banners**
- Shop page DC banner slider (hidden)
- All 6 DC banners (dc1.jpg through dc6.jpg)

#### ❌ **DC Hero Images**
- **Home page:** Removed `/images/home-hero/newhero/1st.png`
- **Shop page:** Removed `/images/banners/dc/dc7.jpg` from both desktop and mobile

### 3. Files Modified:
- `.env.local` - Feature flags set to false
- `components/home/Hero.tsx` - Removed DC hero image
- `app/products/page.tsx` - Removed DC hero image from desktop and mobile arrays

### 4. Current Hero Carousels:

#### **Home Page:**
1. HOMEBanner5.jpg
2. HERO BANNER 2.webp
3. hero-banner-3.webp
4. HERO BANNER 4.webp
5. Video

#### **Shop Page:**
**Desktop:**
1. 2nd.png
2. Banner1 1.webp
3. 2.webp
4. 3.webp

**Mobile:**
1. 2ndMobile.png
2. ShopMobile.webp
3. ShopMobile2.webp

## Result:
✅ All Warner Bros collectibles content hidden
✅ All DC banners hidden
✅ DC hero images removed from carousels
✅ Clean, brand-focused experience
✅ Feature flags allow easy re-enabling later
