import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { Product } from '@/lib/data';

// TanStack Query hooks for data fetching with proper caching and state management

interface ProductsResponse {
  products: Product[];
  error?: string;
}

interface UseProductsOptions {
  category?: string;
  collection?: string;
  exclude?: string;
  limit?: number;
  enabled?: boolean;
}

/**
 * Hook to fetch all products with optional filters
 * Uses React Query for automatic caching, refetching, and state management
 */
export function useProducts(options: UseProductsOptions = {}) {
  const { category, collection, exclude, limit, enabled = true } = options;

  // Build query key with filters for proper cache separation
  const queryKey = [
    ...queryKeys.products,
    category,
    collection,
    exclude,
    limit,
  ] as const;

  return useQuery({
    queryKey,
    queryFn: async (): Promise<Product[]> => {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (collection) params.set('collection', collection);
      if (exclude) params.set('exclude', exclude);
      if (limit) params.set('limit', limit.toString());

      const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data: ProductsResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.products || [];
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes - cache persists for 30 minutes
    retry: 2, // Retry failed requests 2 times
    refetchOnWindowFocus: false, // Don't refetch on window focus (already cached)
    refetchOnReconnect: true, // Refetch if connection was lost
  });
}

/**
 * Hook to fetch a single product by handle
 */
export function useProduct(handle: string) {
  return useQuery({
    queryKey: queryKeys.product(handle),
    queryFn: async (): Promise<Product> => {
      const response = await fetch(`/api/products/${handle}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error(`Failed to fetch product: ${response.status}`);
      }

      const data = await response.json();
      return data.product;
    },
    enabled: !!handle,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch related products by category, excluding a specific product
 */
export function useRelatedProducts(category: string, productId: string, limit = 6) {
  return useQuery({
    queryKey: queryKeys.relatedProducts(category, productId),
    queryFn: async (): Promise<Product[]> => {
      const params = new URLSearchParams({
      category,
      exclude: productId,
      limit: limit.toString(),
    });

      const response = await fetch(`/api/products?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch related products');
      }

      const data: ProductsResponse = await response.json();
      return data.products || [];
    },
    enabled: !!category && !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes for related products
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
}
