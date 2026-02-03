'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from './data';
import { toast } from '@/components/providers/Toaster';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

// Stored cart item - only essential data, no prices
interface StoredCartItem {
  productId: string; // Product handle/ID
  quantity: number;
  selectedSize?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  refreshPrices: () => Promise<void>;
  isRefreshing: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'solitario-cart-v2'; // New key to avoid conflicts with old format

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
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

  // Load cart from localStorage and refresh prices
  useEffect(() => {
    const loadCart = async () => {
      setIsMounted(true);
      
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (!savedCart) {
        // Try to migrate from old format
        const oldCart = localStorage.getItem('solitario-cart');
        if (oldCart) {
          try {
            const oldItems: CartItem[] = JSON.parse(oldCart);
            // Convert to new stored format
            const storedItems: StoredCartItem[] = oldItems.map(item => ({
              productId: item.product.id,
              quantity: item.quantity,
              selectedSize: item.selectedSize,
            }));
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(storedItems));
            localStorage.removeItem('solitario-cart'); // Remove old format
            
            // Fetch fresh prices for migrated items
            const handles = storedItems.map(item => item.productId);
            const freshProducts = await fetchFreshProducts(handles);
            
            const hydratedItems: CartItem[] = storedItems
              .map(stored => {
                const product = freshProducts.find(p => p.id === stored.productId);
                if (!product) return null;
                const cartItem: CartItem = {
                  product,
                  quantity: stored.quantity,
                  selectedSize: stored.selectedSize,
                };
                return cartItem;
              })
              .filter((item): item is CartItem => item !== null);
            
            setItems(hydratedItems);
          } catch (error) {
            console.error('Error migrating old cart:', error);
            localStorage.removeItem('solitario-cart');
          }
        }
        return;
      }

      try {
        const storedItems: StoredCartItem[] = JSON.parse(savedCart);
        if (!Array.isArray(storedItems) || storedItems.length === 0) return;

        // Fetch fresh product data with current prices
        const handles = storedItems.map(item => item.productId);
        const freshProducts = await fetchFreshProducts(handles);

        // Merge stored quantities with fresh product data
        const hydratedItems: CartItem[] = storedItems
          .map(stored => {
            const product = freshProducts.find(p => p.id === stored.productId);
            if (!product) {
              console.warn(`Product ${stored.productId} not found, removing from cart`);
              return null;
            }
            const cartItem: CartItem = {
              product,
              quantity: stored.quantity,
              selectedSize: stored.selectedSize,
            };
            return cartItem;
          })
          .filter((item): item is CartItem => item !== null);

        setItems(hydratedItems);
      } catch (error) {
        console.error('Error loading cart:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    };

    loadCart();
  }, [fetchFreshProducts]);

  // Save cart to localStorage whenever it changes (only after mount)
  // Store only IDs and quantities, NOT prices
  useEffect(() => {
    if (!isMounted) return;
    
    if (items.length > 0) {
      const storedItems: StoredCartItem[] = items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
      }));
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(storedItems));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [items, isMounted]);

  // Function to manually refresh prices (e.g., when cart opens)
  const refreshPrices = useCallback(async () => {
    // Get current items synchronously to avoid race conditions
    setItems(prevItems => {
      if (prevItems.length === 0 || isRefreshing) return prevItems;
      
      setIsRefreshing(true);
      const handles = prevItems.map(item => item.product.id);
      
      // Fetch and update asynchronously
      fetchFreshProducts(handles)
        .then(freshProducts => {
          setItems(currentItems => 
            currentItems.map(item => {
              const freshProduct = freshProducts.find(p => p.id === item.product.id);
              return freshProduct ? { ...item, product: freshProduct } : item;
            })
          );
        })
        .catch(error => {
          console.error('Error refreshing prices:', error);
        })
        .finally(() => {
          setIsRefreshing(false);
        });
      
      return prevItems;
    });
  }, [fetchFreshProducts, isRefreshing]);

  const addToCart = (product: Product, quantity = 1, size?: string) => {
    // Check if item already exists before updating state
    const existingItemIndex = items.findIndex(
      (item) => item.product.id === product.id && item.selectedSize === size
    );
    
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );

      if (existingIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingIndex].quantity += quantity;
        return newItems;
      }

      return [...prevItems, { product, quantity, selectedSize: size }];
    });
    
    // Show toast outside of state setter to avoid duplicate calls
    if (existingItemIndex > -1) {
      toast.success('Cart updated!', {
        description: `${product.name} quantity increased`,
      });
    } else {
      toast.success('Added to cart!', {
        description: product.name,
      });
    }
    
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    // Get item name before removing
    const item = items.find((i) => i.product.id === productId);
    
    setItems((prevItems) => {
      return prevItems.filter((item) => item.product.id !== productId);
    });
    
    // Show toast outside of state setter to avoid duplicate calls
    if (item) {
      toast.success('Removed from cart', {
        description: item.product.name,
      });
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    const hasItems = items.length > 0;
    setItems([]);
    
    // Show toast outside of state setter to avoid duplicate calls
    if (hasItems) {
      toast.success('Cart cleared');
    }
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Refresh prices when cart opens
  const openCart = useCallback(() => {
    setIsCartOpen(true);
    // Refresh prices in the background when cart opens
    refreshPrices();
  }, [refreshPrices]);

  const closeCart = () => setIsCartOpen(false);
  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => {
      if (!prev) {
        // Opening cart - refresh prices
        refreshPrices();
      }
      return !prev;
    });
  }, [refreshPrices]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        total,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        refreshPrices,
        isRefreshing,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

