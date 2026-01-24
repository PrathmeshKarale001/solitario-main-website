import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';

// TanStack Query hooks for data fetching
// Practical implementation showing how to use the installed packages

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json() as Promise<Product[]>;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useProduct(handle: string) {
  return useQuery({
    queryKey: queryKeys.product(handle),
    queryFn: async () => {
      const response = await fetch(`/api/products/${handle}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return response.json() as Promise<Product>;
    },
    enabled: !!handle,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRelatedProducts(category: string, productId: string) {
  return useQuery({
    queryKey: queryKeys.relatedProducts(category, productId),
    queryFn: async () => {
      const response = await fetch(`/api/products?category=${category}&exclude=${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch related products');
      }
      return response.json() as Promise<Product[]>;
    },
    enabled: !!category && !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes for related products
  });
}
