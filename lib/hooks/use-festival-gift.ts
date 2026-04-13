'use client';

import { useState, useEffect } from 'react';

export interface FestivalGiftProduct {
  name: string;
  image: string;
  price: number;
  fallback?: boolean;
}

// Module-level cache so all components share the same fetched data
let cachedGift: FestivalGiftProduct | null = null;
let fetchPromise: Promise<FestivalGiftProduct> | null = null;

async function loadGift(): Promise<FestivalGiftProduct> {
  if (cachedGift) return cachedGift;
  if (!fetchPromise) {
    fetchPromise = fetch('/api/products/gift')
      .then((r) => r.json())
      .then((data) => {
        cachedGift = data as FestivalGiftProduct;
        return cachedGift;
      })
      .catch(() => {
        // Reset promise on error so next call retries
        fetchPromise = null;
        return {
          name: 'Premium Diamond',
          image: '',
          price: 0,
          fallback: true,
        };
      });
  }
  return fetchPromise;
}

/**
 * Hook that fetches the Premium Diamond gift product from Shopify.
 * Caches the result in module scope — safe to call from multiple components.
 */
export function useFestivalGift(enabled: boolean) {
  const [gift, setGift] = useState<FestivalGiftProduct | null>(cachedGift);
  const [loading, setLoading] = useState(!cachedGift && enabled);

  useEffect(() => {
    if (!enabled) return;
    if (cachedGift) {
      setGift(cachedGift);
      setLoading(false);
      return;
    }
    setLoading(true);
    loadGift().then((data) => {
      setGift(data);
      setLoading(false);
    });
  }, [enabled]);

  return { gift, loading };
}
