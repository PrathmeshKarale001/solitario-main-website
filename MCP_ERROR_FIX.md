# MCP Error Fix - "Unexpected token '<', "<!doctype "... is not valid JSON"

## Problem

The error occurs when the API endpoint returns HTML (an error page) instead of JSON. This typically happens when:

1. **Shopify MCP endpoint is not available** - The MCP feature may not be enabled for your Shopify store
2. **Store domain not configured** - `SHOPIFY_STORE_DOMAIN` environment variable is missing
3. **Incorrect endpoint URL** - The MCP endpoint URL is wrong
4. **Network/CORS issues** - Can't reach the Shopify MCP server

## Fixes Applied

### 1. ✅ Improved Error Handling in Component
**File:** `components/ai/AIProductSearch.tsx`

- Added content-type checking before parsing JSON
- Better error messages for users
- Handles HTML responses gracefully

### 2. ✅ Improved Error Handling in MCP Client
**File:** `lib/shopify-mcp-client.ts`

- Checks if response is JSON before parsing
- Provides detailed error messages
- Identifies common configuration issues

### 3. ✅ Improved Error Handling in API Route
**File:** `app/api/mcp/search/route.ts`

- Better error messages for common issues
- Checks for missing environment variables
- Identifies MCP availability issues

## How to Fix the Root Cause

### Step 1: Check Environment Variables

Make sure `.env.local` has:
```bash
SHOPIFY_STORE_DOMAIN=your-store-name
```

**Important:** 
- Use just the store name (e.g., `my-store`)
- Don't include `.myshopify.com`
- The code will add it automatically

### Step 2: Verify MCP is Available

Shopify MCP is a relatively new feature. Check if it's available for your store:

1. **Check Shopify Documentation:**
   - Visit: https://shopify.dev/docs/apps/build/storefront-mcp
   - Verify your store meets requirements

2. **Test the Endpoint Directly:**
   ```bash
   # Replace YOUR_STORE with your actual store name
   curl -X POST https://YOUR_STORE.myshopify.com/api/mcp \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
   ```

3. **Expected Response:**
   - If MCP is available: JSON with tools list
   - If not available: HTML error page (404/403)

### Step 3: Alternative Solution (If MCP Not Available)

If Shopify MCP is not available for your store, you can:

**Option A: Use Direct Shopify Storefront API**
- Modify the search to use your existing Shopify integration
- Use GraphQL queries instead of MCP

**Option B: Create a Fallback**
- Keep MCP code but add fallback to regular search
- Use existing product search functionality

## Testing the Fix

1. **Check Browser Console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for detailed error messages

2. **Check Network Tab:**
   - Open DevTools → Network
   - Try a search
   - Click on `/api/mcp/search` request
   - Check Response tab - should be JSON, not HTML

3. **Check Server Logs:**
   - Look at terminal where `npm run dev` is running
   - Should see detailed error messages

## Common Error Messages

### "SHOPIFY_STORE_DOMAIN environment variable is required"
**Fix:** Add `SHOPIFY_STORE_DOMAIN=your-store-name` to `.env.local`

### "Shopify MCP endpoint returned HTML instead of JSON"
**Fix:** MCP is not available for your store. Use alternative approach.

### "MCP request failed: 404"
**Fix:** The endpoint doesn't exist. MCP may not be enabled.

### "MCP request failed: 403"
**Fix:** Access denied. Check store permissions.

## Next Steps

1. ✅ **Error handling improved** - Users will see helpful messages
2. ⚠️ **Check MCP availability** - Verify if your store supports MCP
3. 🔄 **Consider alternatives** - If MCP not available, use direct Shopify API

## Quick Test

```bash
# Test if MCP endpoint exists
curl https://YOUR_STORE.myshopify.com/api/mcp

# If you get HTML (404 page), MCP is not available
# If you get JSON error, MCP exists but needs proper request format
```

---

**Status:** ✅ Error handling fixed  
**Action Required:** Verify MCP availability for your Shopify store
