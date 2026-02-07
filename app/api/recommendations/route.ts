import { NextRequest, NextResponse } from 'next/server';
import { shopifyStorefrontFetch, GET_PRODUCTS_QUERY } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const maxPrice = parseInt(searchParams.get('maxPrice') || '15000');
    const limit = parseInt(searchParams.get('limit') || '6');
    const category = searchParams.get('category');
    const currentProductId = searchParams.get('currentProductId');

    console.log('🔍 API: Fetching recommendations with params:', {
      maxPrice,
      limit,
      category,
      currentProductId
    });

    // Optimize: Fetch only 50 products instead of 550 for better performance
    // We'll fetch enough to get good recommendations without over-fetching
    const result = await shopifyStorefrontFetch(GET_PRODUCTS_QUERY, { first: 50 });

    if (result.errors || !result.data?.products?.edges) {
      console.error('❌ API: Shopify fetch failed:', result.errors);
      return NextResponse.json({ products: [] });
    }

    const products = result.data.products.edges
      .map((edge: any) => {
        const product = edge.node;
        const variant = product.variants.edges[0]?.node;
        const price = variant ? parseFloat(variant.price.amount) : 0;
        const image = product.images.edges[0]?.node?.url || '';
        
        return {
          id: product.handle,
          name: product.title,
          category: product.productType?.toLowerCase().replace(/\s+/g, '-') || 'jewellery',
          price,
          currency: '₹',
          image,
          description: product.description || '',
          inStock: variant?.availableForSale ?? true,
          featured: product.tags?.some((tag: string) => tag.toLowerCase().includes('featured')) || false
        };
      })
      .filter((product: any) => {
        // Filter by criteria
        if (currentProductId && product.id === currentProductId) return false;
        if (category && product.category !== category) return false;
        if (maxPrice && product.price > maxPrice) {
          console.log(`💰 API: Filtering out ${product.name} - ₹${product.price} > ₹${maxPrice}`);
          return false;
        }
        if (!product.inStock) return false;
        return true;
      });

    console.log(`✅ API: Filtered to ${products.length} products`);

    // Shuffle and limit
    const shuffled = products.sort(() => Math.random() - 0.5);
    const result_products = shuffled.slice(0, limit);

    console.log(`🎯 API: Returning ${result_products.length} recommendations`);

    return NextResponse.json({ 
      products: result_products,
      total: products.length 
    });

  } catch (error) {
    console.error('❌ API: Error fetching recommendations:', error);
    return NextResponse.json({ 
      products: [],
      error: 'Failed to fetch recommendations' 
    }, { status: 500 });
  }
}
