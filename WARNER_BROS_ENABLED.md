# Warner Bros Collectibles Re-Enabled

## Changes Made:

### 1. Feature Flag Enabled
- **Collectibles:** `NEXT_PUBLIC_FEATURE_COLLECTIBLES_ENABLED=true`
- **DC Banners:** `NEXT_PUBLIC_FEATURE_DC_BANNERS_ENABLED=false` (kept disabled)

### 2. Warner Bros Content Now Visible:

#### ✅ **Header & Navigation**
- Navbar CTA button (desktop) - "Collectibles" with premium styling
- Mobile menu link - "Collectibles" in shop section
- BatTransition animation on CTA click

#### ✅ **Floating Button**
- WarnerBrosFloatingButton - bottom-right corner
- Animated with premium gold styling
- Redirects to /warner-bros page

#### ✅ **Hero Images**
- **Home page desktop:** Warner Bros hero (`/images/home-hero/newhero/1st.png`) - **1st position**
- **Home page mobile:** Warner Bros hero (`/images/home-hero/newhero/1stMobile.png`) - **1st position**
- Both images now appear first in carousel rotation

#### ✅ **Warner Bros Collection Page**
- Full page accessible at `/warner-bros`
- All Warner Bros products and content
- Premium dark theme with gold accents

### 3. Content Still Disabled:

#### ❌ **Christmas Banner**
- Shop page Christmas sale banner remains commented out
- No Christmas-related CTAs or redirects

#### ❌ **DC Banners**
- DC banner slider on shop page remains hidden
- All 6 DC banners (dc1.jpg through dc6.jpg) not displayed

### 4. Files Modified:
- `.env.local` - Enabled collectibles feature flag
- `components/home/Hero.tsx` - Re-enabled and repositioned Warner Bros hero images

### 5. Current Hero Carousel Order:

#### **Home Page Desktop:**
1. **Warner Bros hero** (`1st.png`) ✅
2. HOMEBanner5.jpg
3. HERO BANNER 2.webp
4. hero-banner-3.webp
5. HERO BANNER 4.webp
6. Video

#### **Home Page Mobile:**
1. **Warner Bros hero** (`1stMobile.png`) ✅
2. HOMEBanner5.jpg
3. Hero banner 2.jpg
4. 3rdMobile.png
5. Hero banner 4.jpg

## Result:
✅ All Warner Bros collectibles content is now ENABLED and visible
✅ Warner Bros hero images appear first in home page carousel
✅ Christmas content remains disabled as requested
✅ DC banners remain disabled as requested
✅ Ready for testing - no GitHub push yet

## To Test:
Visit http://localhost:3000 to see:
- Warner Bros CTA button in navbar
- Warner Bros floating button (bottom-right)
- Warner Bros hero images first in home carousel
- Warner Bros collection page at /warner-bros
