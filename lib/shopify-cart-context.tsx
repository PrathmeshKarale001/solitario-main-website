'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ShopifyCart } from './shopify';
import { 
  getOrCreateCart as serverGetOrCreateCart,
  addToCart as serverAddToCart,
  updateCartItem as serverUpdateCartItem,
  removeFromCart as serverRemoveFromCart,
  clearCart as serverClearCart,
  getCartId as serverGetCartId
} from './shopify-cart';
import { CartItem, useCart as useLocalCart } from './cart-context';
import { Product } from './data';

interface ShopifyCartItem {
  id: string;
  quantity: number;
  merchandise: {
    __typename: string;
    id: string;
    title: string;
    product: {
      id: string;
      title: string;
      handle: string;
    };
    variant?: {
      id: string;
      title: string;
      sku: string | null;
      price: {
        amount: string;
        currencyCode: string;
      };
      availableForSale: boolean;
      selectedOptions: Array<{
        name: string;
        value: string;
      }>;
    };
  };
  cost: {
    amountPerQuantity: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface ShopifyCartContextType {
  cart: ShopifyCart | null;
  isLoading: boolean;
  isOpen: boolean;
  itemCount: number;
  total: number;
  currency: string;
  checkoutUrl: string | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, quantity?: number, selectedVariantId?: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const ShopifyCartContext = createContext<ShopifyCartContextType | undefined>(undefined);

export function ShopifyCartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const useShopifyCart = process.env.USE_SHOPIFY_CART === 'true';

  // Fallback to local cart context
  const localCart = useLocalCart();

  const refreshCart = useCallback(async () => {
    if (!useShopifyCart) return;
    
    setIsLoading(true);
    try {
      const freshCart = await serverGetOrCreateCart();
      setCart(freshCart);
    } catch (error) {
      console.error('Failed to refresh cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [useShopifyCart]);

  // Load cart on mount
  useEffect(() => {
    if (useShopifyCart) {
      refreshCart();
    }
  }, [useShopifyCart, refreshCart]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(prev => !prev);

  const addToCart = useCallback(async (product: Product & { firstVariantId?: string }, quantity = 1, selectedVariantId?: string) => {
    if (!useShopifyCart) {
      // Fallback to local cart
      localCart.addToCart(product, quantity);
      openCart();
      return;
    }

    setIsLoading(true);
    try {
      // Optimistic update
      const optimisticCart = cart ? { ...cart } : null;
      // Note: For simplicity, we're not doing optimistic UI updates here
      // In a real implementation, you'd update local state immediately

      // Use the selected variant ID or the first variant ID from the product
      const merchandiseId = selectedVariantId || product.firstVariantId;
      if (!merchandiseId) {
        throw new Error('No variant ID available for this product');
      }

      const updatedCart = await serverAddToCart(merchandiseId, quantity);
      
      if (updatedCart) {
        setCart(updatedCart);
        openCart();
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // Revert optimistic update if needed
    } finally {
      setIsLoading(false);
    }
  }, [useShopifyCart, cart, localCart, openCart]);

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    if (!useShopifyCart) {
      // Fallback to local cart - this won't work directly since local cart uses product ID
      // You might need to map lineId to productId
      return;
    }

    if (quantity <= 0) {
      await removeFromCart(lineId);
      return;
    }

    setIsLoading(true);
    try {
      const updatedCart = await serverUpdateCartItem(lineId, quantity);
      if (updatedCart) {
        setCart(updatedCart);
      } else {
        throw new Error('Failed to update cart');
      }
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
    } finally {
      setIsLoading(false);
    }
  }, [useShopifyCart]);

  const removeFromCart = useCallback(async (lineId: string) => {
    if (!useShopifyCart) {
      // Fallback to local cart
      return;
    }

    setIsLoading(true);
    try {
      const updatedCart = await serverRemoveFromCart(lineId);
      if (updatedCart) {
        setCart(updatedCart);
      } else {
        throw new Error('Failed to remove from cart');
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [useShopifyCart]);

  const clearCart = useCallback(async () => {
    if (!useShopifyCart) {
      // Fallback to local cart
      localCart.clearCart();
      return;
    }

    setIsLoading(true);
    try {
      const updatedCart = await serverClearCart();
      if (updatedCart) {
        setCart(updatedCart);
      } else {
        throw new Error('Failed to clear cart');
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [useShopifyCart, localCart]);

  // Calculate derived values
  const itemCount = cart ? cart.lines.edges.reduce((total, line) => total + line.node.quantity, 0) : localCart.itemCount;
  const total = cart ? parseFloat(cart.estimatedCost.totalAmount.amount) : localCart.total;
  const currency = cart ? cart.estimatedCost.totalAmount.currencyCode : '₹';
  const checkoutUrl = cart ? cart.checkoutUrl : null;

  const value: ShopifyCartContextType = {
    cart,
    isLoading,
    isOpen,
    itemCount,
    total,
    currency,
    checkoutUrl,
    openCart,
    closeCart,
    toggleCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return (
    <ShopifyCartContext.Provider value={value}>
      {children}
    </ShopifyCartContext.Provider>
  );
}

export function useShopifyCart() {
  const context = useContext(ShopifyCartContext);
  if (context === undefined) {
    throw new Error('useShopifyCart must be used within a ShopifyCartProvider');
  }
  return context;
}

// Helper to convert Shopify cart line to local CartItem for UI components
export function shopifyLineToCartItem(line: ShopifyCartItem): CartItem {
  const product: Product = {
    id: line.merchandise.product.handle,
    name: line.merchandise.product.title,
    category: 'jewellery', // Default, could be enhanced by fetching full product
    price: parseFloat(line.cost.amountPerQuantity.amount),
    currency: line.cost.amountPerQuantity.currencyCode,
    image: '/images/placeholder.svg', // Will be updated below if available
    description: '',
  };

  // Try to get image from merchandise if available
  // Note: Cart lines don't include product images directly, so we'd need to fetch product details
  // For now, we'll use a placeholder or could fetch product by handle if needed
  
  return {
    product,
    quantity: line.quantity,
    selectedSize: line.merchandise.variant?.selectedOptions.find(opt => opt.name === 'Size')?.value,
  };
}
