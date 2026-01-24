'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// TanStack Query Provider Setup
// Audit Recommendation: 5.2 - Integrate TanStack Query (React Query)

// Create query client with default options
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 5 minutes
        staleTime: 5 * 60 * 1000,
        // Cache data for 30 minutes
        gcTime: 30 * 60 * 1000,
        // Retry failed requests 2 times
        retry: 2,
        // Don't refetch on window focus in production
        refetchOnWindowFocus: process.env.NODE_ENV === 'development',
        // Refetch on reconnect
        refetchOnReconnect: true,
      },
      mutations: {
        // Retry mutations once
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Use useState to ensure we only create the query client once per component lifecycle
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Export query client for use in server components
export { getQueryClient };

// Common query keys for consistent caching
export const queryKeys = {
  // Products
  products: ['products'] as const,
  product: (handle: string) => ['product', handle] as const,
  productById: (id: string) => ['product', 'id', id] as const,
  relatedProducts: (category: string, productId: string) => ['products', 'related', category, productId] as const,
  
  // Collections
  collections: ['collections'] as const,
  collection: (handle: string) => ['collection', handle] as const,
  
  // Cart
  cart: (cartId: string) => ['cart', cartId] as const,
  
  // Orders
  orders: (userId: string) => ['orders', userId] as const,
  order: (orderId: string) => ['order', orderId] as const,
  
  // User
  user: (userId: string) => ['user', userId] as const,
  
  // Shipping
  pincodeServiceability: (pincode: string) => ['pincode', pincode] as const,
  tracking: (waybill: string) => ['tracking', waybill] as const,
  
  // Stores
  stores: ['stores'] as const,
  nearestStores: (lat: number, lng: number) => ['stores', 'nearest', lat, lng] as const,
};

// Prefetch helpers for server components
export async function prefetchProducts(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.products,
    queryFn: async () => {
      const res = await fetch('/api/products');
      return res.json();
    },
  });
}
