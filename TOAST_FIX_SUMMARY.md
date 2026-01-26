# Toast Notification Duplicate Fix

**Issue:** Toast notifications appearing twice when adding/removing items from wishlist or cart

**Root Cause:** Toast calls were inside React state setter callbacks (`setWishlist`, `setItems`), which can trigger multiple times during React's rendering cycle, especially in React Strict Mode.

---

## Files Fixed

### 1. `lib/wishlist-context.tsx`

**Changes:**
- Moved toast calls outside of `setWishlist` state setter in `addToWishlist()`
- Moved toast calls outside of `setWishlist` state setter in `removeFromWishlist()`
- Moved toast calls outside of `setWishlist` state setter in `clearWishlist()`

**Before:**
```typescript
const addToWishlist = (product: Product) => {
  setWishlist((prev) => {
    if (prev.some((p) => p.id === product.id)) {
      toast('Already in wishlist', { description: product.name });
      return prev;
    }
    toast.success('Added to wishlist!', { description: product.name });
    return [...prev, product];
  });
};
```

**After:**
```typescript
const addToWishlist = (product: Product) => {
  setWishlist((prev) => {
    if (prev.some((p) => p.id === product.id)) {
      return prev;
    }
    return [...prev, product];
  });
  
  // Show toast outside of state setter to avoid duplicate calls
  const isAlreadyInWishlist = wishlist.some((p) => p.id === product.id);
  if (isAlreadyInWishlist) {
    toast('Already in wishlist', { description: product.name });
  } else {
    toast.success('Added to wishlist!', { description: product.name });
  }
};
```

---

### 2. `lib/cart-context.tsx`

**Changes:**
- Moved toast calls outside of `setItems` state setter in `addToCart()`
- Moved toast calls outside of `setItems` state setter in `removeFromCart()`
- Moved toast calls outside of `setItems` state setter in `clearCart()`

**Before:**
```typescript
const addToCart = (product: Product, quantity = 1, size?: string) => {
  setItems((prevItems) => {
    const existingItemIndex = prevItems.findIndex(
      (item) => item.product.id === product.id && item.selectedSize === size
    );

    if (existingItemIndex > -1) {
      const newItems = [...prevItems];
      newItems[existingItemIndex].quantity += quantity;
      toast.success('Cart updated!', { description: `${product.name} quantity increased` });
      return newItems;
    }

    toast.success('Added to cart!', { description: product.name });
    return [...prevItems, { product, quantity, selectedSize: size }];
  });
  setIsCartOpen(true);
};
```

**After:**
```typescript
const addToCart = (product: Product, quantity = 1, size?: string) => {
  const existingItemIndex = items.findIndex(
    (item) => item.product.id === product.id && item.selectedSize === size
  );
  
  setItems((prevItems) => {
    const existingIndex = prevItems.findIndex(
      (item) => item.product.id === product.id && item.selectedSize === size
    );

    if (existingIndex > -1) {
      const newItems = [...prevItems];
      newItems[existingIndex].quantity += quantity;
      return newItems;
    }

    return [...prevItems, { product, quantity, selectedSize: size }];
  });
  
  // Show toast outside of state setter to avoid duplicate calls
  if (existingItemIndex > -1) {
    toast.success('Cart updated!', { description: `${product.name} quantity increased` });
  } else {
    toast.success('Added to cart!', { description: product.name });
  }
  
  setIsCartOpen(true);
};
```

---

## Why This Fixes The Issue

### Problem
When toast calls are inside state setter callbacks:
1. React may call the state updater function multiple times for batching/optimization
2. React Strict Mode (development) intentionally double-invokes state updaters
3. Each invocation triggers a toast, resulting in duplicates

### Solution
By moving toast calls outside state setters:
1. Toast is called only once per function execution
2. State updates happen separately from side effects (toasts)
3. Follows React best practices for handling side effects

---

## Testing

**Test Cases:**
- [ ] Add product to wishlist → Single toast appears
- [ ] Remove product from wishlist → Single toast appears
- [ ] Add product already in wishlist → Single "Already in wishlist" toast
- [ ] Clear wishlist → Single toast appears
- [ ] Add product to cart → Single toast appears
- [ ] Add product already in cart → Single "Cart updated" toast
- [ ] Remove product from cart → Single toast appears
- [ ] Clear cart → Single toast appears

---

## Best Practices Applied

1. **Separate State Updates from Side Effects:** State setters should only update state, not trigger side effects
2. **Check State Before Updating:** Read current state to determine toast message before calling state setter
3. **Consistent Pattern:** Applied same fix pattern to all similar functions across contexts

---

**Status:** ✅ Fixed  
**Date:** January 26, 2026  
**Impact:** Improved user experience - no more duplicate toast notifications
