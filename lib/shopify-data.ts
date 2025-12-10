import { shopifyStorefrontFetch, ShopifyProduct, ShopifyCollection, GET_PRODUCTS_QUERY, GET_PRODUCT_BY_HANDLE_QUERY, GET_COLLECTIONS_QUERY, GET_COLLECTION_BY_HANDLE_QUERY } from './shopify';
import { Product } from './data';

// Convert Shopify product to our local Product interface
export function mapShopifyProductToLocal(product: ShopifyProduct): Product {
  const firstVariant = product.variants.edges[0]?.node;
  const price = firstVariant ? parseFloat(firstVariant.price.amount) : 0;
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

  return {
    id: product.handle, // Use handle as a more URL-friendly ID
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
  };
}

// Fetch all products from Shopify
export async function fetchShopifyProducts(first = 250): Promise<Product[]> {
  try {
    const result = await shopifyStorefrontFetch<{ products: { edges: Array<{ node: ShopifyProduct }> } }>(
      GET_PRODUCTS_QUERY,
      { first }
    );

    if (result.errors || !result.data?.products) {
      console.error('Failed to fetch Shopify products:', result.errors);
      return [];
    }

    return result.data.products.edges.map(edge => mapShopifyProductToLocal(edge.node));
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
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
