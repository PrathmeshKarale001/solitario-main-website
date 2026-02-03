/**
 * MCP Search API Route
 * 
 * Provides an endpoint for searching products using Shopify's MCP server
 * Falls back to Storefront API if MCP is not available
 */

import { NextRequest, NextResponse } from 'next/server';
import { getShopifyMCPClient } from '@/lib/shopify-mcp-client';
import { shopifyStorefrontFetch, GET_PRODUCTS_QUERY } from '@/lib/shopify';
import { isMCPEnabled } from '@/lib/feature-flags';

// Stopwords to remove from search
const STOPWORDS = new Set([
  'show', 'me', 'find', 'search', 'looking', 'for', 'want', 'need', 'please',
  'the', 'a', 'an', 'and', 'or', 'with', 'that', 'this', 'some', 'any',
  'everyday', 'daily', 'wear', 'wearing', 'occasion', 'special', 'casual',
  'formal', 'office', 'party', 'wedding', 'gift', 'gifting'
]);

// Extract core product keywords from natural language
function extractSearchTerms(query: string): string[] {
  const words = query
    .toLowerCase()
    .replace(/[₹$€£]|rs\.?|rupees?|inr|under|below|less than|maximum|max|upto|up to|within|budget|price|priced/gi, '')
    .replace(/[0-9,]+/g, '')
    .replace(/[^\w\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOPWORDS.has(word));
  
  return [...new Set(words)]; // Remove duplicates
}

// Parse price constraint from query
function parsePriceConstraint(query: string): number | null {
  const priceMatch = query.match(/(?:under|below|less than|maximum|max|upto|up to|within|budget)\s*(?:₹|rs\.?|rupees?|inr)?\s*([0-9,]+)/i);
  if (priceMatch) {
    return parseFloat(priceMatch[1].replace(/,/g, ''));
  }
  return null;
}

// Fallback: Search using Storefront API
async function searchWithStorefrontAPI(query: string) {
  console.log('[MCP Search] Input query:', query);
  
  // Parse price constraint (returns price in RUPEES)
  const maxPrice = parsePriceConstraint(query);
  console.log('[MCP Search] Max price:', maxPrice);
  
  // Extract search keywords
  const keywords = extractSearchTerms(query);
  console.log('[MCP Search] Keywords:', keywords);

  let products: any[] = [];
  
  // Try searching with different keyword combinations
  const searchAttempts = [
    keywords.join(' '), // All keywords
    keywords.slice(0, 2).join(' '), // First 2 keywords
    keywords[0], // Just first keyword
  ].filter(q => q && q.length > 0);

  // Add product type keywords if found
  const productTypes = ['ring', 'rings', 'earring', 'earrings', 'necklace', 'necklaces', 
                       'bracelet', 'bracelets', 'pendant', 'pendants', 'diamond', 'gold',
                       'silver', 'platinum', 'solitaire', 'stud', 'hoop', 'chain'];
  const matchedTypes = keywords.filter(k => productTypes.includes(k));
  if (matchedTypes.length > 0) {
    searchAttempts.unshift(matchedTypes.join(' '));
  }

  console.log('[MCP Search] Search attempts:', searchAttempts);

  for (const searchQuery of searchAttempts) {
    if (products.length > 0) break;
    
    console.log('[MCP Search] Trying:', searchQuery);
    
    try {
      const response = await shopifyStorefrontFetch(GET_PRODUCTS_QUERY, {
        first: 100, // Fetch more to filter
        query: searchQuery,
      });

      if (response.data?.products?.edges?.length > 0) {
        console.log('[MCP Search] Found', response.data.products.edges.length, 'products');
        
        products = response.data.products.edges.map((edge: any) => {
          const product = edge.node;
          const firstVariant = product.variants?.edges?.[0]?.node;
          const firstImage = product.images?.edges?.[0]?.node;
          
          // Shopify returns prices in RUPEES (not paise) for INR stores
          const price = parseFloat(
            product.priceRange?.minVariantPrice?.amount || 
            firstVariant?.price?.amount || '0'
          );

          return {
            name: product.title,
            price: price.toString(),
            priceNum: price, // Keep for filtering
            currency: product.priceRange?.minVariantPrice?.currencyCode || 'INR',
            variant_id: firstVariant?.id || product.id,
            url: `/products/${product.handle}`,
            image_url: firstImage?.url || '',
            description: product.description?.substring(0, 200) || '',
            tags: product.tags || [],
          };
        });
      }
    } catch (err) {
      console.error('[MCP Search] Error with query:', searchQuery, err);
    }
  }

  // If still no products, try fetching all and filtering
  if (products.length === 0 && keywords.length > 0) {
    console.log('[MCP Search] No results, fetching all products and filtering');
    try {
      const response = await shopifyStorefrontFetch(GET_PRODUCTS_QUERY, {
        first: 100,
      });

      if (response.data?.products?.edges?.length > 0) {
        const allProducts = response.data.products.edges.map((edge: any) => {
          const product = edge.node;
          const firstVariant = product.variants?.edges?.[0]?.node;
          const firstImage = product.images?.edges?.[0]?.node;
          const price = parseFloat(
            product.priceRange?.minVariantPrice?.amount || 
            firstVariant?.price?.amount || '0'
          );

          return {
            name: product.title,
            price: price.toString(),
            priceNum: price,
            currency: product.priceRange?.minVariantPrice?.currencyCode || 'INR',
            variant_id: firstVariant?.id || product.id,
            url: `/products/${product.handle}`,
            image_url: firstImage?.url || '',
            description: product.description?.substring(0, 200) || '',
            tags: product.tags || [],
            handle: product.handle,
          };
        });

        // Filter by keywords in title, description, or tags
        products = allProducts.filter((p: any) => {
          const searchText = `${p.name} ${p.description} ${p.tags.join(' ')} ${p.handle}`.toLowerCase();
          return keywords.some(keyword => searchText.includes(keyword));
        });

        console.log('[MCP Search] Filtered to', products.length, 'products');
      }
    } catch (err) {
      console.error('[MCP Search] Error fetching all products:', err);
    }
  }

  // Filter by price if constraint exists (price is in RUPEES)
  if (maxPrice !== null && products.length > 0) {
    const beforeCount = products.length;
    products = products.filter((p: any) => p.priceNum <= maxPrice);
    console.log('[MCP Search] Price filter:', beforeCount, '->', products.length);
  }

  // Remove internal fields and limit results
  products = products
    .slice(0, 20)
    .map(({ priceNum, tags, handle, ...rest }: any) => rest);

  console.log('[MCP Search] Final results:', products.length);
  
  return {
    content: products,
  };
}

export async function POST(request: NextRequest) {
  // Check if MCP feature is enabled
  if (!isMCPEnabled()) {
    return NextResponse.json(
      { error: 'MCP feature is disabled' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { query, context } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required and must be a string' },
        { status: 400 }
      );
    }

    // Try MCP first, fallback to Storefront API
    try {
      const mcpClient = getShopifyMCPClient();
      const results = await mcpClient.searchCatalog(query, context);
      return NextResponse.json({
        success: true,
        results,
      });
    } catch (mcpError) {
      // MCP not available, use fallback
      console.log('MCP not available, using Storefront API fallback');
      const results = await searchWithStorefrontAPI(query);
      return NextResponse.json({
        success: true,
        results,
      });
    }
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search catalog',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Check if MCP feature is enabled
  if (!isMCPEnabled()) {
    return NextResponse.json(
      { error: 'MCP feature is disabled' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const context = searchParams.get('context');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Try MCP first, fallback to Storefront API
    try {
      const mcpClient = getShopifyMCPClient();
      const results = await mcpClient.searchCatalog(query, context || undefined);
      return NextResponse.json({
        success: true,
        results,
      });
    } catch (mcpError) {
      // MCP not available, use fallback
      console.log('MCP not available, using Storefront API fallback');
      const results = await searchWithStorefrontAPI(query);
      return NextResponse.json({
        success: true,
        results,
      });
    }
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search catalog',
      },
      { status: 500 }
    );
  }
}
