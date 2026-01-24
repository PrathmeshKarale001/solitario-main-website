import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';

// TanStack Query hook for pincode serviceability check
// Shows caching and automatic refetching

interface PincodeResult {
  success: boolean;
  pincode: string;
  serviceable: boolean;
  cod: boolean;
  prepaid: boolean;
  eta?: string;
}

export function usePincodeCheck(pincode: string | null) {
  return useQuery({
    queryKey: queryKeys.pincodeServiceability(pincode || ''),
    queryFn: async () => {
      if (!pincode || !/^\d{6}$/.test(pincode)) {
        throw new Error('Invalid pincode');
      }
      
      const response = await fetch(`/api/shipping/check-pincode?pincode=${pincode}`);
      if (!response.ok) {
        throw new Error('Failed to check pincode');
      }
      return response.json() as Promise<PincodeResult>;
    },
    enabled: !!pincode && /^\d{6}$/.test(pincode),
    staleTime: 10 * 60 * 1000, // 10 minutes - pincode data doesn't change often
    retry: 2,
  });
}
