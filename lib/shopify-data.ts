import { shopifyStorefrontFetch, GET_PRODUCTS_QUERY, GET_PRODUCT_BY_HANDLE_QUERY, GET_PRODUCT_BY_ID_QUERY, GET_COLLECTIONS_QUERY, GET_COLLECTION_BY_HANDLE_QUERY, ShopifyProduct, ShopifyCollection } from './shopify';
import { Product } from './data';

// Convert Shopify product to our local Product interface
export function mapShopifyProductToLocal(product: ShopifyProduct): Product {
  const firstVariant = product.variants.edges[0]?.node;
  const price = firstVariant ? parseFloat(firstVariant.price.amount) : 0;
  const compareAtPrice = firstVariant?.compareAtPrice ? parseFloat(firstVariant.compareAtPrice.amount) : undefined;

  // Convert currency code to symbol (INR -> ₹)
  const currencyCode = firstVariant?.price.currencyCode || 'INR';
  const currency = currencyCode === 'INR' ? '₹' : currencyCode;
  const image = product.images.edges[0]?.node.url || '/images/placeholder.svg';

  // Get ALL images from Shopify
  const images = product.images.edges.map(edge => edge.node.url);

  // Keep HTML for parsing specifications - use descriptionHtml if available
  const description = product.descriptionHtml || product.description || '';

  // Use productType directly as category (already normalized from upload)
  const category = product.productType.toLowerCase().replace(/\s+/g, '-') || 'jewellery';

  // Get SKU from first variant
  const sku = firstVariant?.sku || product.handle.toUpperCase();

  // Get stock availability from variant
  const inStock = firstVariant?.availableForSale ?? true;

  // Check if product is featured (based on tags or collections)
  const featuredTags = ['featured', 'bestseller', 'best-seller', 'best seller'];
  const isFeatured =
    product.tags.some((tag: string) => {
      const normalized = tag.toLowerCase().trim();
      return featuredTags.includes(normalized) || normalized.includes('featured');
    }) ||
    (product.collections?.edges?.some((collection: any) => {
      const title = collection.node.title?.toLowerCase().trim() || '';
      const handle = collection.node.handle?.toLowerCase().trim() || '';
      return title.includes('featured') || handle.includes('featured');
    }) ?? false);

  // Check if this is a Christmas product based on collections
  const isChristmasProduct = product.collections?.edges?.some((collection: any) => {
    const title = collection.node.title?.toLowerCase().trim() || '';
    const handle = collection.node.handle?.toLowerCase().trim() || '';
    return title.includes('christmas') || handle.includes('christmas') ||
      title.includes('holiday') || handle.includes('holiday') ||
      title.includes('festive') || handle.includes('festive');
  }) ?? false;

  // Extract collection information for the product
  const collections = product.collections?.edges?.map((edge: any) => ({
    id: edge.node.id,
    title: edge.node.title,
    handle: edge.node.handle,
  })) || [];

  return {
    id: product.handle, // Use handle as a more URL-friendly ID
    handle: product.handle, // Also expose handle explicitly for API consumers
    name: product.title,
    category,
    price,
    currency,
    image,
    images, // All product images
    description,
    featured: isFeatured,
    sku, // Real SKU from Shopify
    inStock, // Real stock status
    variantId: firstVariant?.id, // Shopify variant ID for cart
    comparePrice: compareAtPrice, // Compare at price from Shopify
    tags: product.tags, // Include all tags for filtering
    isChristmasProduct, // Christmas product flag
    collections, // Include collection information
  };
}

// Fetch all products from Shopify (with pagination to get ALL products)
export async function fetchShopifyProducts(first = 250): Promise<Product[]> {
  try {
    console.log(`🔍 Fetching products from Shopify (page size: ${first})...`);

    let allProducts: Product[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;
    let pageCount = 0;

    while (hasNextPage) {
      pageCount++;
      const variables: Record<string, any> = { first };
      if (cursor) {
        variables.after = cursor;
      }

      const result = await shopifyStorefrontFetch<{ products: { edges: Array<{ node: ShopifyProduct }>; pageInfo: { hasNextPage: boolean; endCursor: string } } }>(
        GET_PRODUCTS_QUERY,
        variables
      );

      console.log(`📡 Shopify API Response (page ${pageCount}):`, {
        hasErrors: !!result.errors,
        errors: result.errors,
        hasData: !!result.data,
        productCount: result.data?.products?.edges?.length || 0
      });

      if (result.errors) {
        console.error('❌ Shopify GraphQL errors:', result.errors);
        break;
      }

      if (!result.data?.products?.edges) {
        console.error('❌ No products data in Shopify response');
        break;
      }

      const pageProducts = result.data.products.edges.map(edge => {
        return mapShopifyProductToLocal(edge.node);
      });

      allProducts = [...allProducts, ...pageProducts];

      // Check pagination
      hasNextPage = result.data.products.pageInfo?.hasNextPage ?? false;
      cursor = result.data.products.pageInfo?.endCursor ?? null;

      // Safety: max 10 pages (2500 products)
      if (pageCount >= 10) {
        console.warn('⚠️ Reached maximum pagination limit (10 pages)');
        break;
      }
    }

    console.log(`✅ Successfully fetched and mapped ${allProducts.length} products from Shopify (${pageCount} page(s))`);
    return allProducts;
  } catch (error) {
    console.error('❌ Error fetching Shopify products:', error);
    return [];
  }
}

// Fetch a single product by handle
export async function fetchShopifyProductByHandle(handle: string): Promise<Product | null> {
  try {
    const result = await shopifyStorefrontFetch<{ product: ShopifyProduct }>(
      GET_PRODUCT_BY_HANDLE_QUERY,
      { handle }
    );

    if (result.errors || !result.data?.product) {
      console.error(`Failed to fetch Shopify product ${handle}:`, result.errors);
      return null;
    }

    return mapShopifyProductToLocal(result.data.product);
  } catch (error) {
    console.error(`Error fetching Shopify product ${handle}:`, error);
    return null;
  }
}

// Fetch a single product by ID (most reliable for specific products)
export async function fetchShopifyProductById(id: string): Promise<Product | null> {
  try {
    const result = await shopifyStorefrontFetch<{ node: ShopifyProduct }>(
      GET_PRODUCT_BY_ID_QUERY,
      { id }
    );

    if (result.errors || !result.data?.node) {
      console.error(`Failed to fetch Shopify product by ID ${id}:`, result.errors);
      return null;
    }

    return mapShopifyProductToLocal(result.data.node);
  } catch (error) {
    console.error(`Error fetching Shopify product by ID ${id}:`, error);
    return null;
  }
}

// Fetch collections from Shopify
export async function fetchShopifyCollections(first = 20): Promise<ShopifyCollection[]> {
  try {
    const result = await shopifyStorefrontFetch<{ collections: { edges: Array<{ node: ShopifyCollection }> } }>(
      GET_COLLECTIONS_QUERY,
      { first }
    );

    if (result.errors || !result.data?.collections) {
      console.error('Failed to fetch Shopify collections:', result.errors);
      return [];
    }

    return result.data.collections.edges.map(edge => edge.node);
  } catch (error) {
    console.error('Error fetching Shopify collections:', error);
    return [];
  }
}

// Fetch products in a collection
export async function fetchShopifyCollectionProducts(handle: string): Promise<Product[]> {
  try {
    const result = await shopifyStorefrontFetch<{ collection: ShopifyCollection }>(
      GET_COLLECTION_BY_HANDLE_QUERY,
      { handle }
    );

    if (result.errors || !result.data?.collection) {
      console.error(`Failed to fetch Shopify collection ${handle}:`, result.errors);
      return [];
    }

    return result.data.collection.products.edges.map(edge => mapShopifyProductToLocal(edge.node));
  } catch (error) {
    console.error(`Error fetching Shopify collection ${handle}:`, error);
    return [];
  }
}

// Unified product fetch function with fallback to local data
export async function getProducts(useShopify = true): Promise<Product[]> {
  if (useShopify && process.env.USE_SHOPIFY_PRODUCTS === 'true') {
    const shopifyProducts = await fetchShopifyProducts();
    if (shopifyProducts.length > 0) {
      return shopifyProducts;
    }
    console.warn('Falling back to local products due to Shopify fetch failure');
  }

  // Fallback to local data
  const { PRODUCTS } = await import('./data');
  return PRODUCTS;
}

// Unified single product fetch with fallback
export async function getProductByHandle(handle: string, useShopify = true): Promise<Product | null> {
  if (useShopify && process.env.USE_SHOPIFY_PRODUCTS === 'true') {
    const shopifyProduct = await fetchShopifyProductByHandle(handle);
    if (shopifyProduct) {
      return shopifyProduct;
    }
    console.warn(`Falling back to local product ${handle} due to Shopify fetch failure`);
  }

  // Fallback to local data
  const { PRODUCTS } = await import('./data');
  return PRODUCTS.find(p => p.id === handle) || null;
}

// Unified collection products fetch with fallback
export async function getCollectionProducts(handle: string, useShopify = true): Promise<Product[]> {
  if (useShopify && process.env.USE_SHOPIFY_PRODUCTS === 'true') {
    const shopifyProducts = await fetchShopifyCollectionProducts(handle);
    if (shopifyProducts.length > 0) {
      return shopifyProducts;
    }
    console.warn(`Falling back to local collection products ${handle} due to Shopify fetch failure`);
  }

  // Fallback: filter local products by category (handle as category)
  const { PRODUCTS } = await import('./data');
  return PRODUCTS.filter(p => p.category === handle);
}

// Fetch products for recommendations using API endpoint
export async function getRecommendationProducts({
  currentProductId,
  category,
  maxPrice = 15000,
  limit = 6,
  useShopify = true
}: {
  currentProductId?: string;
  category?: string;
  maxPrice?: number;
  limit?: number;
  useShopify?: boolean;
}): Promise<Product[]> {
  console.log('🔍 Fetching recommendations via API endpoint...');

  try {
    // Build query parameters
    const params = new URLSearchParams({
      maxPrice: maxPrice.toString(),
      limit: limit.toString(),
    });

    if (category) params.append('category', category);
    if (currentProductId) params.append('currentProductId', currentProductId);

    console.log('🚀 Calling /api/recommendations with params:', params.toString());

    const response = await fetch(`/api/recommendations?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('❌ API Error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();

    if (data.error) {
      console.error('❌ API returned error:', data.error);
      return [];
    }

    const products = data.products || [];
    console.log(`✅ Received ${products.length} recommendations from API`);
    console.log('🎯 Products:', products.map((p: any) => `${p.name} - ₹${p.price}`));

    return products;
  } catch (error) {
    console.error('❌ Error fetching recommendations:', error);
    return [];
  }
}
