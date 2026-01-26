'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from './data';
import { toast } from '@/components/providers/Toaster';

export interface CartItem {
  product: Product;
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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem('solitario-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error('Error loading cart:', error);
        localStorage.removeItem('solitario-cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes (only after mount)
  useEffect(() => {
    if (!isMounted) return;
    
    if (items.length > 0) {
      localStorage.setItem('solitario-cart', JSON.stringify(items));
    } else {
      localStorage.removeItem('solitario-cart');
    }
  }, [items, isMounted]);

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

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

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

