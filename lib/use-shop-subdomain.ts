'use client';

import { useState, useEffect } from 'react';

export function useIsShopSubdomain(): boolean {
  const [isShop, setIsShop] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      setIsShop(hostname.startsWith('shop.') || hostname.includes('shop.thesolitario.com'));
    }
  }, []);

  return isShop;
}
