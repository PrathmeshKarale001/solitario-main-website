import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number, currency: string = '₹'): string {
  // Ensure INR is converted to ₹ symbol
  const symbol = currency === 'INR' ? '₹' : currency;
  // Round to nearest integer to remove decimal values
  const roundedPrice = Math.round(price);
  return `${symbol}${roundedPrice.toLocaleString('en-IN')}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}


