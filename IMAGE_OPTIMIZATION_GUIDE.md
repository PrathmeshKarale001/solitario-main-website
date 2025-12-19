# Image Optimization Guide - Critical for LCP Performance
**Impact:** Expected LCP improvement of 1-2 seconds

---

## 🔴 CRITICAL PRIORITY - Hero Images (LCP Elements)

These images are **Largest Contentful Paint** elements and must be optimized first.

### Home Page Hero
**Location:** `/public/images/`
```
HERO BANNER 1.jpg → HERO BANNER 1.webp (target: <200KB)
HERO BANNER 2.jpg → HERO BANNER 2.webp (target: <200KB)
HERO BANNER 4.jpg → HERO BANNER 4.webp (target: <200KB)
```

### Home Page Mobile Hero
**Location:** `/public/images/Hero_Mobile/`
```
Hero banner 2.jpg → Hero banner 2.webp (target: <150KB)
Hero banner 3.jpg → Hero banner 3.webp (target: <150KB)
Hero banner 4.jpg → Hero banner 4.webp (target: <150KB)
```

### Shop Page Hero
**Location:** `/public/images/Shop/`
```
Banner1 1.jpg → Banner1 1.webp (target: <200KB)
2.png → 2.webp (target: <150KB)
3.jpg → 3.webp (target: <150KB)
ShopMobile.jpg → ShopMobile.webp (target: <150KB)
ShopMobile2.webp (already optimized ✓)
```

---

## 🟡 MEDIUM PRIORITY - Above-Fold Images

### Stores Page
**Location:** `/public/images/Stores/`
```
1.jpg → 1.webp
3.jpg → 3.webp
10.jpg → 10.webp
```

### About Page
**Location:** `/public/about/`
```
IMG_0061.JPG → IMG_0061.webp
IMG_0373.JPG → IMG_0373.webp
story-side.jpg → story-side.webp
vision-bg.jpg → vision-bg.webp
```

### Team Photos
```
anurag-lunia.jpg → anurag-lunia.webp
kabir-kate.jpg → kabir-kate.webp
kamini-singh.jpg → kamini-singh.webp
ricky-vasandani1.jpg → ricky-vasandani1.webp
vivek-oberoi.jpg → vivek-oberoi.webp
```

---

## 🟢 LOW PRIORITY - Below-Fold Images

### Carousel Images
**Location:** `/public/carouselgrid/`
All optimized-*.jpg files → .webp

### Diamond Images
**Location:** `/public/diamonds/`
```
dia1.jpg → dia1.webp
dia2.jpg → dia2.webp
dia3.jpg → dia3.webp
dia4.jpg → dia4.webp
dia_hand.jpg → dia_hand.webp
```

### Product Images
**Location:** `/public/images/products/`
All imgi_*.png files → .webp (43 files)

---

## 🛠️ Recommended Tools

### Option 1: Squoosh (Easiest - Web-Based)
**URL:** https://squoosh.app

**Steps:**
1. Open Squoosh in browser
2. Drag and drop image
3. Select "WebP" format
4. Set quality to 85-90
5. Download optimized image
6. Repeat for all images

**Pros:** Easy, visual quality preview
**Cons:** One image at a time

---

### Option 2: ImageOptim (Mac - Batch Processing)
**URL:** https://imageoptim.com

**Steps:**
1. Install ImageOptim
2. Drag entire folder to ImageOptim
3. Wait for compression
4. Use cwebp command for WebP conversion

**Batch WebP Conversion:**
```bash
cd /Users/prathmeshkarale/Developer/SolitarioWebsite/public/images

# Convert all JPG to WebP
for file in *.jpg; do
  cwebp -q 85 "$file" -o "${file%.jpg}.webp"
done

# Convert all PNG to WebP
for file in *.png; do
  cwebp -q 90 "$file" -o "${file%.png}.webp"
done
```

---

### Option 3: Sharp (Node.js - Automated)
**For bulk conversion with Node.js**

**Install:**
```bash
npm install --save-dev sharp
```

**Create script:** `scripts/convert-images.js`
```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const directories = [
  'public/images',
  'public/images/Hero_Mobile',
  'public/images/Shop',
  'public/about',
  'public/carouselgrid',
  'public/diamonds',
];

async function convertImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPath);
    console.log(`✓ Converted: ${path.basename(inputPath)}`);
  } catch (err) {
    console.error(`✗ Failed: ${path.basename(inputPath)}`, err.message);
  }
}

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const inputPath = path.join(dir, file);
      const outputPath = path.join(dir, file.replace(ext, '.webp'));
      await convertImage(inputPath, outputPath);
    }
  }
}

async function main() {
  for (const dir of directories) {
    console.log(`\nProcessing: ${dir}`);
    await processDirectory(dir);
  }
  console.log('\n✓ All images converted!');
}

main();
```

**Run:**
```bash
node scripts/convert-images.js
```

---

## 📝 After Conversion Checklist

### 1. Update Image References
Most images use `next/image` which auto-detects WebP support, so **no code changes needed** if you keep both formats!

**Recommended Approach:**
- Keep both .jpg/.png AND .webp files
- Next.js will automatically serve WebP to supporting browsers
- JPG/PNG as fallback for older browsers

**Alternative (Manual):**
If you want to use WebP only:
```typescript
// Before
src="/images/HERO BANNER 1.jpg"

// After
src="/images/HERO BANNER 1.webp"
```

### 2. Verify File Sizes
**Target Compression:**
- Hero images: 60-80% reduction
- Other images: 50-70% reduction

**Example:**
```
Before: HERO BANNER 1.jpg = 800KB
After:  HERO BANNER 1.webp = 180KB (77% reduction)
```

### 3. Test Image Quality
- Check images on actual devices
- Ensure no visible artifacts
- Adjust quality if needed (85-92 range)

### 4. Remove Original Files (Optional)
**Only after confirming WebP versions work!**
```bash
# Backup first
mkdir ../image-backups
cp -r public/images ../image-backups/

# Then remove originals (if using WebP only)
find public/images -type f \( -name "*.jpg" -o -name "*.png" \) -delete
```

---

## 🎯 Expected Results

### Before Optimization
```
Total Page Weight: 3-5MB
LCP: 3.5-4.5s
Lighthouse: 60-70
```

### After Optimization
```
Total Page Weight: 1-2MB (50-60% reduction)
LCP: 2.0-2.5s (40-50% faster)
Lighthouse: 85-90
```

### Bandwidth Savings
- Mobile users: 2-3MB per page load
- Annual savings (100k visitors): ~200-300GB

---

## 🚨 Critical Notes

1. **Start with hero images** - These have the biggest LCP impact
2. **Test on mobile devices** - Mobile users will see the biggest improvement
3. **Keep backups** - Don't delete originals until WebP is confirmed working
4. **WebP support** - 97% of browsers support WebP (IE11 will see fallback)

---

## ✅ Verification

After converting images, run:

```bash
# 1. Build project
npm run build

# 2. Check file sizes
du -sh public/images/*.webp

# 3. Start production server
npm start

# 4. Open Chrome DevTools > Network
# Verify WebP images are loading
# Check file sizes in Network tab

# 5. Run Lighthouse
# Check LCP score improved
```

**Target LCP Times:**
- **Home Page:** < 2.0s
- **Products Page:** < 2.5s
- **Category Pages:** < 2.0s

---

## 📞 Need Help?

If conversion fails or quality is poor:
1. Increase quality setting (85 → 90 → 92)
2. Try different tool (Squoosh vs Sharp)
3. Check source image isn't already compressed
4. Ensure sufficient disk space for conversion
