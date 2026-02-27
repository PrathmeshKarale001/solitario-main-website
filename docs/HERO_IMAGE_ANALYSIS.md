# Hero Image Container Analysis

## Current Implementation Issues

### 🚨 **Problem Identified:**
The hero containers are using `object-cover` with specific positioning that CROPS images on mobile!

### **Home Page Hero:**
```tsx
<section className="relative min-h-[80vh] md:min-h-screen">
  <Image className="object-cover" />
</section>
```
- **Height:** 80vh on mobile, full screen on desktop
- **Issue:** `object-cover` CROPS images to fit, losing content

### **Shop Page Hero:**
```tsx
<section className="relative min-h-[80vh] md:min-h-[91vh]">
  <Image className={`object-cover ${item.pos}`} />
</section>
```
- **Height:** 80vh on mobile, 91vh on desktop
- **Positioning:** 
  - Desktop: `object-center`, `object-[50%_0%]`, `object-[50%_20%]`, etc.
  - Mobile: `object-center`, `object-[50%_20%]`
- **Issue:** `object-cover` with positioning CROPS images significantly

## 🔍 **What's Actually Happening:**

### **Object-Cover Behavior:**
- **Scales image to cover entire container**
- **Maintains aspect ratio**
- **CROPS parts that don't fit**
- **Different positioning = different crops**

### **Mobile Impact:**
- 80vh height on portrait mobile = tall, narrow container
- Landscape images get heavily cropped on sides
- Portrait images get cropped top/bottom

## ✅ **Recommended Solutions:**

### **Option 1: Object-Contain (No Cropping)**
```tsx
className="object-contain"
```
- Pros: Shows full image, no cropping
- Cons: May have empty space

### **Option 2: Responsive Aspect Ratios**
```tsx
// Mobile: Use portrait images
// Desktop: Use landscape images
```
- Pros: Optimal for each viewport
- Cons: Requires separate image sets

### **Option 3: Fixed Aspect Container**
```tsx
<section className="relative aspect-[9/16] md:aspect-[16/9]">
```
- Pros: Consistent display
- Cons: May not fill full viewport

## 📐 **Optimal Image Ratios (Revised):**

| Viewport | Container Height | Recommended Image Ratio |
|----------|------------------|------------------------|
| Mobile (80vh) | ~667px (iPhone) | 9:16 Vertical |
| Tablet (80vh) | ~1024px | 4:3 or 3:4 |
| Desktop (91-100vh) | ~1080px | 21:9 or 16:9 |

## 🎯 **Immediate Fix:**
Change from `object-cover` to `object-contain` to prevent cropping, or use mobile-specific portrait images with `object-cover`.
