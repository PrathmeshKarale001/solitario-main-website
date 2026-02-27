# MCP Integration - Frontend Locations Guide

**Where to find the AI search feature on your website**

---

## 🎯 Demo Page (Ready to Use!)

### **Location:** `/ai-search`
**URL:** `http://localhost:3000/ai-search` (dev) or `https://yourdomain.com/ai-search` (production)

**File:** `app/ai-search/page.tsx`

**What it contains:**
- ✅ Full AI-powered search interface
- ✅ Natural language input
- ✅ Example queries
- ✅ "How It Works" section
- ✅ Product results display

**How to access:**
1. Start dev server: `npm run dev`
2. Visit: `http://localhost:3000/ai-search`
3. Or type `/ai-search` in your browser

**Status:** ✅ **Fully functional and ready to use!**

---

## 🔍 Frontend Component

### **Component:** `AIProductSearch`
**File:** `components/ai/AIProductSearch.tsx`

**What it does:**
- Natural language search input
- Real-time product search via MCP
- Product cards with images, prices, descriptions
- Loading states and error handling
- Responsive design

**How to use it:**
```tsx
import AIProductSearch from '@/components/ai/AIProductSearch';

// In any page or component
<AIProductSearch />
```

---

## 📍 Current Status: Where It's Integrated

### ✅ **Currently Active:**
1. **Demo Page** - `/ai-search` ✅
   - Fully functional
   - Accessible via direct URL
   - Complete UI with examples

### ❌ **Not Yet Integrated (But Ready!):**
1. **Header Navigation** - Not linked yet
2. **Products Page** - Not added yet
3. **Home Page** - Not added yet
4. **Mobile Menu** - Not added yet

---

## 🚀 How to Add to Your Site

### Option 1: Add to Header Navigation

**File:** `components/layout/Header.tsx`

**Add this to the navigation links:**
```tsx
const NAV_LINKS = [
  { href: '/products', label: 'Shop' },
  { href: '/ai-search', label: 'AI Search' }, // ← Add this
  { href: '/stores', label: 'Stores' },
  { href: '/about', label: 'About' },
] as const;
```

**Or add as a button in the header:**
```tsx
<Link 
  href="/ai-search" 
  className="flex items-center gap-2 px-4 py-2 bg-classic-green text-white rounded-lg hover:bg-classic-green/90"
>
  <Sparkles className="w-4 h-4" />
  AI Search
</Link>
```

---

### Option 2: Add to Products Page

**File:** `app/products/page.tsx` or `app/(public)/products/page.tsx`

**Add at the top of the products page:**
```tsx
import AIProductSearch from '@/components/ai/AIProductSearch';

export default function ProductsPage() {
  return (
    <div>
      {/* Add AI search section */}
      <section className="mb-12">
        <h2 className="text-2xl font-playfair mb-4">Try AI-Powered Search</h2>
        <AIProductSearch />
      </section>
      
      {/* Existing product grid */}
      <ProductGrid products={products} />
    </div>
  );
}
```

---

### Option 3: Add to Home Page

**File:** `app/(public)/page.tsx` or `app/page.tsx`

**Add in the hero section or as a feature:**
```tsx
import AIProductSearch from '@/components/ai/AIProductSearch';

// In your home page component
<section className="py-16 bg-gradient-to-b from-ivory-pearl to-white">
  <Container>
    <h2 className="text-3xl font-playfair text-center mb-8">
      Find Your Perfect Piece with AI
    </h2>
    <AIProductSearch />
  </Container>
</section>
```

---

### Option 4: Add to Mobile Menu

**File:** `components/layout/Header.tsx`

**Add to MOBILE_MENU_SECTIONS:**
```tsx
const MOBILE_MENU_SECTIONS = [
  {
    title: 'Shop',
    links: [
      { href: '/products', label: 'All Products', icon: Sparkles },
      { href: '/ai-search', label: 'AI Search', icon: Sparkles, highlight: true }, // ← Add this
      // ... rest of links
    ],
  },
  // ... rest of sections
];
```

---

## 🔗 API Endpoints (Backend)

These are the API routes that power the AI search:

### **Product Search**
- **Route:** `/api/mcp/search`
- **File:** `app/api/mcp/search/route.ts`
- **Methods:** GET, POST
- **Usage:** Called by `AIProductSearch` component

### **Policy Search**
- **Route:** `/api/mcp/policies`
- **File:** `app/api/mcp/policies/route.ts`
- **Methods:** GET, POST
- **Usage:** For answering policy questions

### **Cart Operations**
- **Route:** `/api/mcp/cart`
- **File:** `app/api/mcp/cart/route.ts`
- **Methods:** GET, POST, PUT, DELETE
- **Usage:** For AI-powered cart management

### **Tools Listing**
- **Route:** `/api/mcp/tools`
- **File:** `app/api/mcp/tools/route.ts`
- **Methods:** GET
- **Usage:** Discover available MCP tools

---

## 📂 File Structure

```
solitario-main-website/
│
├── app/
│   ├── ai-search/
│   │   └── page.tsx              ← Demo page (✅ EXISTS)
│   │
│   └── api/
│       └── mcp/
│           ├── search/
│           │   └── route.ts      ← Product search API (✅ EXISTS)
│           ├── policies/
│           │   └── route.ts      ← Policy search API (✅ EXISTS)
│           ├── cart/
│           │   └── route.ts      ← Cart operations API (✅ EXISTS)
│           └── tools/
│               └── route.ts      ← Tools listing API (✅ EXISTS)
│
├── components/
│   └── ai/
│       └── AIProductSearch.tsx   ← AI search component (✅ EXISTS)
│
└── lib/
    └── shopify-mcp-client.ts     ← MCP client service (✅ EXISTS)
```

---

## 🧪 Testing the Integration

### 1. Test Demo Page
```bash
# Start dev server
npm run dev

# Visit demo page
http://localhost:3000/ai-search
```

### 2. Test API Directly
```javascript
// In browser console
fetch('/api/mcp/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'diamond rings under 20000',
    context: 'modern designs'
  })
})
.then(r => r.json())
.then(data => console.log('Results:', data));
```

### 3. Test Component
```tsx
// In any page
import AIProductSearch from '@/components/ai/AIProductSearch';

export default function TestPage() {
  return (
    <div>
      <h1>Test AI Search</h1>
      <AIProductSearch />
    </div>
  );
}
```

---

## 🎨 UI Preview

### Demo Page Features:
- **Header:** "Find Your Perfect Jewellery" with AI badge
- **Search Bar:** Natural language input with search button
- **Example Queries:** 3 clickable examples
- **How It Works:** 3-step explanation
- **Results:** Product cards with images, prices, descriptions

### Component Features:
- Search input with placeholder
- Loading spinner during search
- Error messages if search fails
- Product grid with cards
- Click to view product details

---

## 📱 Mobile Responsive

Both the demo page and component are fully responsive:
- ✅ Mobile-friendly search input
- ✅ Responsive product grid
- ✅ Touch-friendly buttons
- ✅ Optimized for all screen sizes

---

## 🚦 Current Access Methods

### Method 1: Direct URL
```
http://localhost:3000/ai-search
```

### Method 2: Browser Navigation
Type `/ai-search` in your browser address bar

### Method 3: Programmatic
```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/ai-search');
```

---

## 💡 Quick Integration Examples

### Add to Header (Quick)
```tsx
// In Header.tsx, add to navigation
<Link href="/ai-search" className="flex items-center gap-2">
  <Sparkles className="w-4 h-4" />
  AI Search
</Link>
```

### Add to Products Page (Quick)
```tsx
// At top of products page
<div className="mb-8">
  <Link href="/ai-search" className="inline-flex items-center gap-2 text-classic-green hover:underline">
    <Sparkles className="w-4 h-4" />
    Try AI-Powered Search
  </Link>
</div>
```

### Add as Modal (Advanced)
```tsx
// Create a button that opens AI search in modal
const [isAISearchOpen, setIsAISearchOpen] = useState(false);

<button onClick={() => setIsAISearchOpen(true)}>
  AI Search
</button>

{isAISearchOpen && (
  <Modal onClose={() => setIsAISearchOpen(false)}>
    <AIProductSearch />
  </Modal>
)}
```

---

## ✅ Summary

### What Exists:
- ✅ Demo page at `/ai-search` - **Fully functional**
- ✅ AI search component - **Ready to use**
- ✅ API endpoints - **All working**
- ✅ MCP client service - **Complete**

### What's Missing:
- ❌ Link in header navigation
- ❌ Link in mobile menu
- ❌ Integration in products page
- ❌ Integration in home page

### Next Steps:
1. **Test the demo page:** Visit `/ai-search`
2. **Add to navigation:** Follow Option 1 above
3. **Add to products page:** Follow Option 2 above
4. **Customize as needed:** Component is fully customizable

---

## 🎯 Quick Access

**Right Now:**
- Demo: `http://localhost:3000/ai-search`
- Component: `components/ai/AIProductSearch.tsx`
- API: `/api/mcp/search`

**To Add to Site:**
- Header: Edit `components/layout/Header.tsx`
- Products: Edit `app/products/page.tsx`
- Home: Edit `app/(public)/page.tsx`

---

**Status:** ✅ **All code exists and works!**  
**Action Needed:** Add links/navigation to make it discoverable  
**Demo:** Visit `/ai-search` to see it in action!
