# Warner Bros Images Fixed

## ✅ Issue Resolved:

### **Problem:**
- Warner Bros products weren't showing images
- Used hardcoded fake image paths (`/images/warnerbroassets/...`) that don't exist
- Products weren't fetching real data from Shopify

### **Solution:**
- **Restored Shopify API call** to fetch real Warner Bros collection products
- **Kept XXXX pricing** by adding `displayPrice: 'XXXX'` to each fetched product
- **Real images and data** now loaded from Shopify while maintaining custom pricing display

### **Updated Code:**
```tsx
// Load products from Shopify API - Warner Bros collection with XXXX pricing
useEffect(() => {
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?collection=WarnerBros');
      const data = await response.json();
      
      // Modify products to show XXXX pricing
      const productsWithXXXX = (data.products || []).map((product: Product) => ({
        ...product,
        displayPrice: 'XXXX'
      }));
      
      setProducts(productsWithXXXX);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };
  loadProducts();
}, []);
```

### **Result:**
✅ **Real product images** from Shopify now display correctly
✅ **Product names and details** fetched from Shopify collection
✅ **Pricing still shows "XXXX"** as requested
✅ **All Warner Bros products** from your Shopify collection will appear
✅ **Maintains existing filtering and sorting** functionality

## Current Status:
- Warner Bros page now fetches real products from Shopify
- Images, names, and descriptions come from your actual Shopify collection
- Pricing displays as "XXXX" for all Warner Bros products
- No more placeholder/fake image paths
