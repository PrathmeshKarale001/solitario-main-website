'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from './data';
import { toast } from '@/components/providers/Toaster';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'solitario_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWishlist(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load wishlist from localStorage:', error);
    }
    setIsHydrated(true);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      } catch (error) {
        console.error('Failed to save wishlist to localStorage:', error);
      }
    }
  }, [wishlist, isHydrated]);

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
