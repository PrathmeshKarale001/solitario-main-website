# Warner Bros Collectibles Enabled

## Changes Made:

### 1. Environment Variable Updated
- Changed `NEXT_PUBLIC_FEATURE_COLLECTIBLES_ENABLED=false` to `NEXT_PUBLIC_FEATURE_COLLECTIBLES_ENABLED=true`
- This enables all Warner Bros collectibles features

### 2. What's Now Visible:
✅ **Navbar CTA Button** - Warner Bros collectibles button in the header
✅ **Floating Bottom Button** - Warner Bros collectibles floating button
✅ **Home Page Hero Images** - Warner Bros hero images in the carousel
✅ **Warner Bros Collection Page** - Accessible at /warner-bros
✅ **Mobile Menu Link** - Warner Bros link in mobile navigation menu

### 3. Feature Flag System:
The collectibles feature controls multiple components:
- Header CTA button
- WarnerBrosFloatingButton component
- Hero carousel images (1st.png and 1stMobile.png)
- Warner Bros collection page
- Mobile menu navigation

## Current Status:
✅ All Warner Bros collectibles CTAs are now ENABLED and visible
✅ DC banners remain enabled (separate feature flag)
✅ Both features can be controlled independently

## To Disable Collectibles:
Set `NEXT_PUBLIC_FEATURE_COLLECTIBLES_ENABLED=false` in `.env.local` and restart the dev server

## View the Results:
Visit http://localhost:3000 to see:
- Warner Bros button in the navbar
- Floating Warner Bros button (bottom-right)
- Warner Bros hero images on home page
