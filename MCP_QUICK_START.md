# Shopify MCP Integration - Quick Start Guide

**Get started with AI-powered product search in 5 minutes!**

---

## What You Get

✅ Natural language product search  
✅ AI-powered policy answers  
✅ Smart cart management  
✅ Ready-to-use React components  
✅ Full TypeScript support

---

## Installation (Already Done!)

All MCP integration files have been created. No additional packages required.

---

## Quick Test

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Test Product Search
Open your browser console and run:

```javascript
// Search for products
fetch('/api/mcp/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'diamond rings',
    context: 'modern style'
  })
})
.then(r => r.json())
.then(data => console.log('Search Results:', data));
```

### 3. Test Policy Search
```javascript
// Search policies
fetch('/api/mcp/policies', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'What is your return policy?'
  })
})
.then(r => r.json())
.then(data => console.log('Policy Answer:', data));
```

### 4. List Available Tools
```javascript
// Get all MCP tools
fetch('/api/mcp/tools')
.then(r => r.json())
.then(data => console.log('Available Tools:', data));
```

---

## Use in Your Code

### Option 1: Use API Routes (Frontend)

```typescript
// In any client component
const searchProducts = async (query: string) => {
  const response = await fetch('/api/mcp/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  
  const data = await response.json();
  return data.results;
};
```

### Option 2: Use MCP Client (Server-Side)

```typescript
// In API routes or server components
import { getShopifyMCPClient } from '@/lib/shopify-mcp-client';

const client = getShopifyMCPClient();
const results = await client.searchCatalog('gold necklaces');
```

### Option 3: Use AI Search Component

```tsx
// In any page
import AIProductSearch from '@/components/ai/AIProductSearch';

export default function SearchPage() {
  return (
    <div>
      <h1>Find Your Perfect Piece</h1>
      <AIProductSearch />
    </div>
  );
}
```

---

## API Endpoints

### Product Search
```bash
POST /api/mcp/search
GET  /api/mcp/search?query=rings&context=modern
```

### Policy Search
```bash
POST /api/mcp/policies
GET  /api/mcp/policies?query=return+policy
```

### Cart Operations
```bash
GET    /api/mcp/cart?cart_id=gid://shopify/Cart/abc
POST   /api/mcp/cart              # Update cart
PUT    /api/mcp/cart              # Add to cart
DELETE /api/mcp/cart              # Remove from cart
```

### List Tools
```bash
GET /api/mcp/tools
```

---

## Pre-Built Demo Page

Visit the AI search demo page:
```
http://localhost:3000/ai-search
```

This page includes:
- AI-powered search interface
- Example queries
- How it works explanation
- Live product results

---

## Example Use Cases

### 1. Smart Search Bar
Replace traditional search with AI-powered search:
```tsx
<AIProductSearch />
```

### 2. Product Recommendations
```typescript
const getRecommendations = async (style: string, budget: number) => {
  const client = getShopifyMCPClient();
  return await client.searchCatalog(
    `${style} jewellery under ${budget}`,
    'Customer browsing for recommendations'
  );
};
```

### 3. Policy Bot
```typescript
const answerQuestion = async (question: string) => {
  const client = getShopifyMCPClient();
  return await client.searchPolicies(question);
};
```

### 4. Voice Search
```typescript
const voiceSearch = async (transcript: string) => {
  const response = await fetch('/api/mcp/search', {
    method: 'POST',
    body: JSON.stringify({ query: transcript })
  });
  return await response.json();
};
```

---

## Configuration

### Required Environment Variables

Already configured in `.env.local`:
```bash
SHOPIFY_STORE_DOMAIN=your-store-name
```

**That's it!** No additional API keys or authentication needed for storefront MCP features.

---

## Testing Checklist

- [ ] Dev server running (`npm run dev`)
- [ ] Visit `/ai-search` page
- [ ] Try natural language search
- [ ] Check browser console for API responses
- [ ] Test example queries
- [ ] Verify product results display

---

## Next Steps

### Add to Your Site

1. **Add to Header Navigation:**
```tsx
// components/layout/Header.tsx
<Link href="/ai-search">
  <Sparkles className="w-4 h-4" />
  AI Search
</Link>
```

2. **Add to Products Page:**
```tsx
// app/products/page.tsx
<AIProductSearch />
```

3. **Create Help Center:**
```tsx
// app/help/page.tsx
<PolicyChatbot />
```

---

## Troubleshooting

**No results appearing?**
- Check if `SHOPIFY_STORE_DOMAIN` is set correctly
- Verify Shopify store has products
- Check browser console for errors

**API errors?**
- Ensure dev server is running
- Check network tab for failed requests
- Verify Shopify store domain format

**TypeScript errors?**
- Run `npm run type-check`
- Ensure all imports are correct

---

## Resources

- Full documentation: `SHOPIFY_MCP_INTEGRATION.md`
- MCP client code: `lib/shopify-mcp-client.ts`
- API routes: `app/api/mcp/*`
- UI component: `components/ai/AIProductSearch.tsx`

---

**Ready to use!** 🚀  
Open `http://localhost:3000/ai-search` to try it now.
