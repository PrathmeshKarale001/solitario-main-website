# Shopify MCP Architecture - Solitario Integration

**Visual Guide to MCP Implementation**

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         SOLITARIO WEBSITE                        │
│                     (Next.js 16 + TypeScript)                    │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │
┌────────────────────────────────┴───────────────────────────────┐
│                                                                 │
│                    FRONTEND COMPONENTS                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  AIProductSearch.tsx                                     │  │
│  │  - Natural language input                                │  │
│  │  - Real-time results                                     │  │
│  │  - Product cards                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTP POST
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API ROUTES                                │
│                    (Next.js API Routes)                          │
│                                                                  │
│  ┌─────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │ /api/mcp/search │  │ /api/mcp/policies│  │ /api/mcp/cart │ │
│  │                 │  │                  │  │               │ │
│  │ Product search  │  │ Policy answers   │  │ Cart ops      │ │
│  └─────────────────┘  └──────────────────┘  └───────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ Uses
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MCP CLIENT SERVICE                           │
│                  (lib/shopify-mcp-client.ts)                     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ShopifyMCPClient                                         │  │
│  │  • searchCatalog(query, context)                          │  │
│  │  • searchPolicies(query, context)                         │  │
│  │  • getCart(cartId)                                        │  │
│  │  • updateCart(cartId, lines)                              │  │
│  │  • createCart(lines)                                      │  │
│  │  • addToCart(cartId, merchandiseId, quantity)            │  │
│  │  • removeFromCart(cartId, lineItemId)                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ JSON-RPC 2.0
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SHOPIFY MCP SERVER                            │
│          https://{store}.myshopify.com/api/mcp                   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  MCP Tools                                                │  │
│  │  • search_shop_catalog                                    │  │
│  │  • search_shop_policies_and_faqs                          │  │
│  │  • get_cart                                               │  │
│  │  • update_cart                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ GraphQL
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SHOPIFY STOREFRONT                          │
│                                                                  │
│  ┌────────────┐    ┌──────────┐    ┌─────────────────────┐    │
│  │  Products  │    │   Cart   │    │  Policies & FAQs    │    │
│  └────────────┘    └──────────┘    └─────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request Flow Example

### Product Search Request

```
1. Customer Input
   ↓
   "Show me diamond rings under ₹20,000"
   ↓

2. Frontend (AIProductSearch.tsx)
   ↓
   POST /api/mcp/search
   Body: { query: "diamond rings under 20000", context: "..." }
   ↓

3. API Route (app/api/mcp/search/route.ts)
   ↓
   const client = getShopifyMCPClient();
   const results = await client.searchCatalog(query, context);
   ↓

4. MCP Client (lib/shopify-mcp-client.ts)
   ↓
   POST https://your-store.myshopify.com/api/mcp
   {
     "jsonrpc": "2.0",
     "method": "tools/call",
     "id": 1,
     "params": {
       "name": "search_shop_catalog",
       "arguments": { "query": "...", "context": "..." }
     }
   }
   ↓

5. Shopify MCP Server
   ↓
   [Processes query with AI]
   [Searches product catalog]
   [Filters by context]
   ↓

6. Response
   ↓
   {
     "jsonrpc": "2.0",
     "id": 1,
     "result": {
       "content": [
         {
           "name": "Poise Ring",
           "price": "10999",
           "currency": "INR",
           "variant_id": "gid://shopify/ProductVariant/123",
           "url": "/products/poise-ring",
           "image_url": "https://cdn.shopify.com/...",
           "description": "Elegant diamond ring..."
         }
       ]
     }
   }
   ↓

7. Frontend Display
   ↓
   [Product cards with images, prices, descriptions]
   [Click to view product details]
```

---

## Component Hierarchy

```
ai-search/page.tsx
│
├── AIProductSearch.tsx
│   │
│   ├── Search Input
│   │   └── Natural language query
│   │
│   ├── Search Button
│   │   └── Triggers API call
│   │
│   └── Results Grid
│       │
│       ├── Product Card 1
│       │   ├── Image
│       │   ├── Name
│       │   ├── Description
│       │   └── Price
│       │
│       ├── Product Card 2
│       └── Product Card 3
│
└── Example Queries
    ├── Budget queries
    ├── Occasion queries
    └── Style queries
```

---

## Data Flow

### Search Flow
```
User Input → Validation → API Call → MCP Client → Shopify MCP
     ↓                                                    ↓
  "rings"                                          JSON-RPC Request
     ↓                                                    ↓
  Sanitized                                        Shopify Process
     ↓                                                    ↓
API Route                                          Search Results
     ↓                                                    ↓
Transform                                               JSON
     ↓                                                    ↓
  Display ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← Response
```

### Error Flow
```
Error Occurs → Caught by try/catch → Logged to console
     ↓                                        ↓
Sanitize message                        Sentry (optional)
     ↓                                        ↓
Return to client                        Analytics
     ↓
Display error message
```

---

## Integration Layers

### Layer 1: UI Layer
- **Components:** React components for user interaction
- **Responsibility:** Display results, handle user input
- **Technology:** React, Framer Motion, Tailwind CSS

### Layer 2: API Layer
- **Routes:** Next.js API routes
- **Responsibility:** Validate input, call MCP client, format response
- **Technology:** Next.js API Routes, TypeScript

### Layer 3: Service Layer
- **Client:** ShopifyMCPClient class
- **Responsibility:** JSON-RPC communication with Shopify
- **Technology:** Fetch API, TypeScript

### Layer 4: Protocol Layer
- **Protocol:** JSON-RPC 2.0
- **Responsibility:** Standardized request/response format
- **Technology:** JSON, HTTPS

### Layer 5: Shopify Layer
- **Server:** Shopify MCP Server
- **Responsibility:** Process queries, access store data
- **Technology:** Shopify Infrastructure

---

## Security Layers

```
┌─────────────────────────────────────────┐
│  1. Input Validation                    │
│     - Sanitize queries                  │
│     - Type checking                     │
│     - Length limits                     │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  2. Rate Limiting (Recommended)         │
│     - Prevent abuse                     │
│     - API quotas                        │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  3. Error Handling                      │
│     - Try/catch blocks                  │
│     - Sanitized error messages          │
│     - No sensitive data in responses    │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  4. HTTPS Only                          │
│     - Encrypted communication           │
│     - Secure endpoints                  │
└─────────────────────────────────────────┘
```

---

## Performance Considerations

### Optimization Strategies

1. **Caching**
   ```typescript
   // Cache frequently searched terms
   const cache = new Map();
   
   async function searchWithCache(query: string) {
     if (cache.has(query)) {
       return cache.get(query);
     }
     const results = await client.searchCatalog(query);
     cache.set(query, results);
     return results;
   }
   ```

2. **Debouncing**
   ```typescript
   // Debounce search input
   const debouncedSearch = useDebounce(searchQuery, 300);
   
   useEffect(() => {
     if (debouncedSearch) {
       performSearch(debouncedSearch);
     }
   }, [debouncedSearch]);
   ```

3. **Lazy Loading**
   ```typescript
   // Load MCP client only when needed
   const client = lazy(() => import('@/lib/shopify-mcp-client'));
   ```

---

## Monitoring & Analytics

### Track MCP Usage

```typescript
// In API routes
posthog.capture('mcp_search', {
  query: searchQuery,
  results_count: results.length,
  response_time: Date.now() - startTime
});

// In components
useEffect(() => {
  if (results.length > 0) {
    posthog.capture('mcp_search_success', {
      query: query,
      results: results.length
    });
  }
}, [results]);
```

### Error Tracking

```typescript
try {
  const results = await client.searchCatalog(query);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      service: 'mcp',
      operation: 'search_catalog'
    },
    extra: { query, context }
  });
}
```

---

## Comparison: Traditional vs MCP

### Traditional Search
```
User → Search Bar → GraphQL Query → Parse Response → Display
         ↓
   Keyword matching
   Manual filtering
   Complex queries
```

### MCP Search
```
User → Natural Language → MCP Request → AI Processing → Display
         ↓
   Intent understanding
   Context-aware
   Simple queries
```

---

## Technical Stack

```
┌──────────────────────────────────────┐
│         Frontend Layer               │
│  • React 18                          │
│  • Next.js 16                        │
│  • TypeScript 5.3                    │
│  • Framer Motion                     │
└──────────────────────────────────────┘
                 ↓
┌──────────────────────────────────────┐
│         API Layer                    │
│  • Next.js API Routes                │
│  • JSON validation                   │
│  • Error handling                    │
└──────────────────────────────────────┘
                 ↓
┌──────────────────────────────────────┐
│         Service Layer                │
│  • ShopifyMCPClient                  │
│  • TypeScript interfaces             │
│  • Singleton pattern                 │
└──────────────────────────────────────┘
                 ↓
┌──────────────────────────────────────┐
│         Protocol Layer               │
│  • JSON-RPC 2.0                      │
│  • HTTPS                             │
│  • RESTful endpoints                 │
└──────────────────────────────────────┘
                 ↓
┌──────────────────────────────────────┐
│         Shopify Layer                │
│  • MCP Server                        │
│  • Storefront API                    │
│  • Product Catalog                   │
└──────────────────────────────────────┘
```

---

## File Dependencies

```
ai-search/page.tsx
   │
   └── imports ──→ components/ai/AIProductSearch.tsx
                      │
                      └── calls ──→ /api/mcp/search
                                       │
                                       └── uses ──→ lib/shopify-mcp-client.ts
                                                       │
                                                       └── connects ──→ Shopify MCP Server
                                                                           │
                                                                           └── accesses ──→ Store Data
```

---

## MCP Tools Relationship

```
┌────────────────────────────────────────────────────────────┐
│                    MCP Tool Ecosystem                       │
└────────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┴────────────────┐
        │                                  │
┌───────▼─────────┐              ┌────────▼────────┐
│  Catalog Tools  │              │   Cart Tools    │
├─────────────────┤              ├─────────────────┤
│ • search_shop_  │              │ • get_cart      │
│   catalog       │              │ • update_cart   │
│                 │              │ • create_cart   │
│ • search_shop_  │              │ • add_to_cart   │
│   policies      │              │ • remove_from   │
│                 │              │   _cart         │
└─────────────────┘              └─────────────────┘
```

---

## API Endpoint Structure

```
/api/mcp/
│
├── search/
│   ├── route.ts
│   │   ├── GET  → Query param search
│   │   └── POST → Body param search
│   │
│   └── Calls: searchCatalog()
│
├── policies/
│   ├── route.ts
│   │   ├── GET  → Query param search
│   │   └── POST → Body param search
│   │
│   └── Calls: searchPolicies()
│
├── cart/
│   ├── route.ts
│   │   ├── GET    → Get cart contents
│   │   ├── POST   → Update cart
│   │   ├── PUT    → Add to cart
│   │   └── DELETE → Remove from cart
│   │
│   └── Calls: getCart(), updateCart(), etc.
│
└── tools/
    ├── route.ts
    │   └── GET → List all available tools
    │
    └── Calls: listTools()
```

---

## State Management

```
MCP State Flow
===============

User Action
   ↓
Component State Update
   ↓
API Call (async)
   ↓
MCP Request
   ↓
Loading State (isSearching = true)
   ↓
MCP Response
   ↓
Parse Results
   ↓
Update State (results, error)
   ↓
Loading Complete (isSearching = false)
   ↓
Render Results
```

---

## Error Handling Flow

```
Error Handling
==============

MCP Request
   ↓
Try Block
   ↓
   ├─ Success ──→ Return Results
   │
   └─ Error
      ↓
   Catch Block
      ↓
   Log Error
      ↓
   Sanitize Message
      ↓
   Return Error Response
      ↓
   Display to User
```

---

## Integration Points Map

```
Solitario Website
├── Home Page
│   └── Could add: AI search hero
│
├── Products Page
│   └── Could add: AI search bar
│
├── Header
│   └── Could add: AI search link
│
├── AI Search Page (NEW!)
│   └── ✅ Full AI search experience
│
└── Help Center (Future)
    └── Could add: Policy chatbot
```

---

## MCP vs Direct API

```
┌──────────────────┬──────────────────┬─────────────────┐
│    Feature       │   MCP Server     │   Direct API    │
├──────────────────┼──────────────────┼─────────────────┤
│ Authentication   │ Not required     │ Required        │
│ Query Language   │ Natural language │ GraphQL/REST    │
│ Complexity       │ Low              │ High            │
│ AI Optimized     │ Yes              │ No              │
│ Setup Time       │ Minutes          │ Hours           │
│ Learning Curve   │ Easy             │ Moderate        │
│ Flexibility      │ Moderate         │ High            │
│ Use Case         │ AI assistants    │ Full control    │
└──────────────────┴──────────────────┴─────────────────┘
```

---

## Scalability

```
Current Implementation
├── Single MCP client instance (Singleton)
├── Stateless API routes
├── No database dependencies
└── Scales with Next.js/Vercel

Future Considerations
├── Add Redis cache for frequent searches
├── Implement request queuing
├── Add CDN for static responses
└── Monitor API quota usage
```

---

## Development Workflow

```
1. Local Development
   └── npm run dev
       └── http://localhost:3000/ai-search

2. Testing
   └── Browser console
       └── Test API endpoints

3. Integration
   └── Add components to pages
       └── Update navigation

4. Deployment
   └── Deploy to Vercel
       └── No config changes needed

5. Monitoring
   └── Track usage in PostHog
       └── Monitor errors in Sentry
```

---

## Quick Access Links

### Demo & Testing
- **Demo Page:** http://localhost:3000/ai-search
- **API Test:** http://localhost:3000/api/mcp/tools

### Documentation
- **Quick Start:** MCP_QUICK_START.md
- **Full Docs:** SHOPIFY_MCP_INTEGRATION.md
- **Summary:** SHOPIFY_MCP_SUMMARY.md
- **Architecture:** MCP_ARCHITECTURE.md (this file)

### Code Files
- **Client:** lib/shopify-mcp-client.ts
- **Search API:** app/api/mcp/search/route.ts
- **UI Component:** components/ai/AIProductSearch.tsx
- **Demo Page:** app/ai-search/page.tsx

---

**Ready to use!** 🚀  
Start with: `npm run dev` → Visit `/ai-search`
