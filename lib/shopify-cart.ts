'use server';

import { cookies } from 'next/headers';
import { shopifyStorefrontFetch, ShopifyCart, GET_CART_QUERY, CART_CREATE_MUTATION, CART_LINES_ADD_MUTATION, CART_LINES_UPDATE_MUTATION, CART_LINES_REMOVE_MUTATION } from './shopify';

const CART_COOKIE_NAME = 'solitario_cart_id';

// Get cart ID from httpOnly cookie
export async function getCartId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE_NAME)?.value || null;
}

// Set cart ID in httpOnly cookie
export async function setCartId(cartId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE_NAME, cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}

// Clear cart ID cookie
export async function clearCartId(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE_NAME);
}

// Create a new cart
export async function createCart(): Promise<ShopifyCart | null> {
  try {
    const result = await shopifyStorefrontFetch<{ cartCreate: { cart: ShopifyCart; userErrors: any[] } }>(
      CART_CREATE_MUTATION,
      { input: {} }
    );

    if (result.data?.cartCreate?.cart) {
      await setCartId(result.data.cartCreate.cart.id);
      return result.data.cartCreate.cart;
    }

    if (result.data?.cartCreate?.userErrors?.length) {
      console.error('Cart creation errors:', result.data.cartCreate.userErrors);
    }

    return null;
  } catch (error) {
    console.error('Error creating cart:', error);
    return null;
  }
}

// Get cart by ID
export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  try {
    const result = await shopifyStorefrontFetch<{ cart: ShopifyCart }>(
      GET_CART_QUERY,
      { cartId }
    );

    if (result.errors || !result.data?.cart) {
      console.error('Failed to fetch cart:', result.errors);
      return null;
    }

    return result.data.cart;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
}

// Get or create cart
export async function getOrCreateCart(): Promise<ShopifyCart | null> {
  const cartId = await getCartId();
  
  if (cartId) {
    // Try to fetch existing cart
    const existingCart = await getCart(cartId);
    if (existingCart) {
      return existingCart;
    }
    // Cart doesn't exist or is invalid, clear cookie and create new
    await clearCartId();
  }

  // Create new cart
  return await createCart();
}

// Add items to cart
export async function addCartLines(cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>): Promise<ShopifyCart | null> {
  try {
    const result = await shopifyStorefrontFetch<{ cartLinesAdd: { cart: ShopifyCart; userErrors: any[] } }>(
      CART_LINES_ADD_MUTATION,
      { cartId, lines }
    );

    if (result.data?.cartLinesAdd?.cart) {
      return result.data.cartLinesAdd.cart;
    }

    if (result.data?.cartLinesAdd?.userErrors?.length) {
      console.error('Add to cart errors:', result.data.cartLinesAdd.userErrors);
    }

    return null;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return null;
  }
}

// Update cart line quantities
export async function updateCartLines(cartId: string, lines: Array<{ id: string; quantity: number }>): Promise<ShopifyCart | null> {
  try {
    const result = await shopifyStorefrontFetch<{ cartLinesUpdate: { cart: ShopifyCart; userErrors: any[] } }>(
      CART_LINES_UPDATE_MUTATION,
      { cartId, lines }
    );

    if (result.data?.cartLinesUpdate?.cart) {
      return result.data.cartLinesUpdate.cart;
    }

    if (result.data?.cartLinesUpdate?.userErrors?.length) {
      console.error('Update cart errors:', result.data.cartLinesUpdate.userErrors);
    }

    return null;
  } catch (error) {
    console.error('Error updating cart:', error);
    return null;
  }
}

// Remove items from cart
export async function removeCartLines(cartId: string, lineIds: string[]): Promise<ShopifyCart | null> {
  try {
    const result = await shopifyStorefrontFetch<{ cartLinesRemove: { cart: ShopifyCart; userErrors: any[] } }>(
      CART_LINES_REMOVE_MUTATION,
      { cartId, lineIds }
    );

    if (result.data?.cartLinesRemove?.cart) {
      return result.data.cartLinesRemove.cart;
    }

    if (result.data?.cartLinesRemove?.userErrors?.length) {
      console.error('Remove from cart errors:', result.data.cartLinesRemove.userErrors);
    }

    return null;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return null;
  }
}

// Add a single product to cart
export async function addToCart(merchandiseId: string, quantity = 1): Promise<ShopifyCart | null> {
  const cart = await getOrCreateCart();
  if (!cart) return null;

  return await addCartLines(cart.id, [{ merchandiseId, quantity }]);
}

// Update cart item quantity
export async function updateCartItem(lineId: string, quantity: number): Promise<ShopifyCart | null> {
  const cartId = await getCartId();
  if (!cartId) return null;

  return await updateCartLines(cartId, [{ id: lineId, quantity }]);
}

// Remove item from cart
export async function removeFromCart(lineId: string): Promise<ShopifyCart | null> {
  const cartId = await getCartId();
  if (!cartId) return null;

  return await removeCartLines(cartId, [lineId]);
}

// Clear entire cart (create a new one)
export async function clearCart(): Promise<ShopifyCart | null> {
  await clearCartId();
  return await createCart();
}
