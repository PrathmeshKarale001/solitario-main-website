'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product } from './data';
import { toast } from '@/components/providers/Toaster';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
  refreshPrices: () => Promise<void>;
  isRefreshing: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'solitario_wishlist_v2'; // New key to avoid conflicts with old format

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch fresh product data from API
  const fetchFreshProducts = useCallback(async (handles: string[]): Promise<Product[]> => {
    if (handles.length === 0) return [];
    
    try {
      const response = await fetch('/api/products/by-handles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handles }),
      });

      if (!response.ok) {
        console.error('Failed to fetch fresh product data');
        return [];
      }

      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Error fetching fresh product data:', error);
      return [];
    }
  }, []);

  // Load wishlist from localStorage and refresh prices
  useEffect(() => {
    const loadWishlist = async () => {
      let storedIds: string[] = [];
      
      try {
        const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            storedIds = parsed;
          }
        } else {
          // Try to migrate from old format
          const oldStored = localStorage.getItem('solitario_wishlist');
          if (oldStored) {
            const oldParsed = JSON.parse(oldStored);
            if (Array.isArray(oldParsed)) {
              // Old format stored full products, extract IDs
              storedIds = oldParsed.map((p: Product) => p.id);
              // Save in new format
              localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(storedIds));
              localStorage.removeItem('solitario_wishlist'); // Remove old format
            }
          }
        }

        if (storedIds.length > 0) {
          // Fetch fresh product data with current prices
          const freshProducts = await fetchFreshProducts(storedIds);
          
          // Only keep products that still exist
          const validProducts = storedIds
            .map(id => freshProducts.find(p => p.id === id))
            .filter((p): p is Product => p !== undefined);
          
          setWishlist(validProducts);
        }
      } catch (error) {
        console.error('Failed to load wishlist from localStorage:', error);
      }
      
      setIsHydrated(true);
    };

    loadWishlist();
  }, [fetchFreshProducts]);

  // Save wishlist to localStorage whenever it changes - store only IDs
  useEffect(() => {
    if (isHydrated) {
      try {
        const ids = wishlist.map(p => p.id);
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
      } catch (error) {
        console.error('Failed to save wishlist to localStorage:', error);
      }
    }
  }, [wishlist, isHydrated]);

  // Function to manually refresh prices
  const refreshPrices = useCallback(async () => {
    if (wishlist.length === 0) return;
    
    setIsRefreshing(true);
    try {
      const handles = wishlist.map(p => p.id);
      const freshProducts = await fetchFreshProducts(handles);

      setWishlist(prevWishlist => 
        prevWishlist.map(item => {
          const freshProduct = freshProducts.find(p => p.id === item.id);
          if (freshProduct) {
            return freshProduct;
          }
          return item;
        })
      );
    } catch (error) {
      console.error('Error refreshing prices:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [wishlist, fetchFreshProducts]);

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      // Check if already in wishlist
      if (prev.some((p) => p.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
    
    // Show toast outside of state setter to avoid duplicate calls
    const isAlreadyInWishlist = wishlist.some((p) => p.id === product.id);
    if (isAlreadyInWishlist) {
      toast('Already in wishlist', {
        description: product.name,
      });
    } else {
      toast.success('Added to wishlist!', {
        description: product.name,
      });
    }
  };

  const removeFromWishlist = (productId: string) => {
    // Get product name before removing
    const product = wishlist.find((p) => p.id === productId);
    
    setWishlist((prev) => {
      return prev.filter((p) => p.id !== productId);
    });
    
    // Show toast outside of state setter to avoid duplicate calls
    if (product) {
      toast.success('Removed from wishlist', {
        description: product.name,
      });
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const clearWishlist = () => {
    const hasItems = wishlist.length > 0;
    setWishlist([]);
    
    // Show toast outside of state setter to avoid duplicate calls
    if (hasItems) {
      toast.success('Wishlist cleared');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
        refreshPrices,
        isRefreshing,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
