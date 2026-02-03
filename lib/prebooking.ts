// Prebooking system for Warner Bros collection products

import { Product } from './data';

// Prebooking price in INR
export const PREBOOK_PRICE = 999;

// Check if a product belongs to Warner Bros collection and is eligible for prebooking
export function isWarnerBrosProduct(product: Product): boolean {
  if (!product.collections) return false;
  
  return product.collections.some(
    (col) =>
      col.handle?.toLowerCase().includes('warner') ||
      col.title?.toLowerCase().includes('warner') ||
      col.handle?.toLowerCase() === 'warnerbros'
  );
}

// Check if product is available for prebooking (Warner Bros + out of stock)
export function isPrebookingProduct(product: Product): boolean {
  return isWarnerBrosProduct(product);
}

// Get display price for a product
export function getProductDisplayPrice(product: Product): string {
  if (isPrebookingProduct(product)) {
    return `Prebook for ₹${PREBOOK_PRICE.toLocaleString('en-IN')}`;
  }
  return '';
}

// Get button text for a product
export function getProductButtonText(product: Product, isAdding: boolean): string {
  if (isAdding) return 'Added!';
  
  if (isPrebookingProduct(product)) {
    return 'Prebook Now';
  }
  
  return product.inStock ? 'Add to Cart' : 'Out of Stock';
}

// Check if product button should be enabled
export function isProductButtonEnabled(product: Product): boolean {
  // Warner Bros products are always available for prebooking
  if (isPrebookingProduct(product)) {
    return true;
  }
  return product.inStock === true;
}

// Calculate cart item price (considering prebooking)
export function getCartItemPrice(product: Product): number {
  if (isPrebookingProduct(product)) {
    return PREBOOK_PRICE;
  }
  return product.price;
}

// Format prebooking order notes
export function formatPrebookingOrderNotes(
  customerName: string,
  prebookingItems: Array<{ name: string; quantity: number }>
): string {
  if (prebookingItems.length === 0) return '';
  
  const itemsList = prebookingItems
    .map((item) => `  - ${item.name} (Qty: ${item.quantity})`)
    .join('\n');
  
  return `
🎬 PREBOOKING ORDER 🎬
Customer: ${customerName}

Warner Bros Collection Items (Prebooking):
${itemsList}

Note: This is a prebooking order. Full payment will be collected upon product availability.
Prebooking amount: ₹${PREBOOK_PRICE.toLocaleString('en-IN')} per item
`.trim();
}
