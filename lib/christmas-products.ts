import { Product } from './data';

// Filter products specifically for Christmas based on REAL Shopify collections only
export function filterChristmasProducts(products: Product[]): Product[] {
  return products.filter(product => 
    product.isChristmasProduct || 
    (product.collections && product.collections.some(collection => 
      collection.title.toLowerCase().includes('christmas') ||
      collection.handle.toLowerCase().includes('christmas') ||
      collection.title.toLowerCase().includes('holiday') ||
      collection.handle.toLowerCase().includes('holiday') ||
      collection.title.toLowerCase().includes('festive') ||
      collection.handle.toLowerCase().includes('festive')
    ))
  );
}
