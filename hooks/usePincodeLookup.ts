import { useState, useCallback } from 'react';

export interface PincodeLookupResult {
  success: boolean;
  pincode?: string;
  city?: string;
  state?: string;
  district?: string;
  region?: string;
  country?: string;
  areas?: string[];
  postOffices?: Array<{
    name: string;
    branchType: string;
    deliveryStatus: string;
  }>;
  error?: string;
}

interface UsePincodeLookupReturn {
  lookup: (pincode: string) => Promise<PincodeLookupResult>;
  data: PincodeLookupResult | null;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

/**
 * Hook for PIN code lookup with auto-fill functionality
 * Fetches city/state from India Post API based on PIN code
 * 
 * @example
 * const { lookup, data, loading, error } = usePincodeLookup();
 * 
 * // When user enters 6-digit PIN code
 * const result = await lookup('400001');
 * if (result.success) {
 *   setCity(result.city);
 *   setState(result.state);
 * }
 */
export function usePincodeLookup(): UsePincodeLookupReturn {
  const [data, setData] = useState<PincodeLookupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(async (pincode: string): Promise<PincodeLookupResult> => {
    // Validate PIN code format
    if (!/^\d{6}$/.test(pincode)) {
      const result = { success: false, error: 'Invalid PIN code format' };
      setError(result.error);
      setData(result);
      return result;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/pincode/lookup?pincode=${pincode}`);
      const result: PincodeLookupResult = await response.json();

      setData(result);
      
      if (!result.success) {
        setError(result.error || 'Failed to fetch PIN code details');
      }

      return result;
    } catch (err) {
      const errorMessage = 'Failed to fetch PIN code details';
      const result = { success: false, error: errorMessage };
      setError(errorMessage);
      setData(result);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { lookup, data, loading, error, reset };
}

export default usePincodeLookup;
