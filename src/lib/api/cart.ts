import { apiDeleteData, apiGet, apiPatch, apiPost } from '@/lib/api/client';
import type { Cart } from '@/lib/api/types';

export async function getCart(token: string): Promise<Cart | undefined> {
  const data = await apiGet<{ cart: Cart } | Cart>('/cart', token);
  if (data && 'cart' in data) return (data as { cart: Cart }).cart;
  return data as Cart | undefined;
}

export async function addCartItem(productId: number, quantity: number, token: string): Promise<Cart | undefined> {
  const data = await apiPost<{ cart: Cart } | Cart, { productId: number; quantity?: number }>(
    '/cart',
    { productId, quantity },
    token
  );
  if (data && 'cart' in data) return (data as { cart: Cart }).cart;
  return data as Cart | undefined;
}

export async function updateCartItem(itemId: number, quantity: number, token: string): Promise<Cart | undefined> {
  const data = await apiPatch<{ cart: Cart } | Cart, { quantity: number }>(
    `/cart/items/${itemId}`,
    { quantity },
    token
  );
  if (data && 'cart' in data) return (data as { cart: Cart }).cart;
  return data as Cart | undefined;
}

export async function removeCartItem(itemId: number, token: string): Promise<Cart | undefined> {
  const data = await apiDeleteData<{ cart: Cart } | Cart>(`/cart/items/${itemId}`, token);
  if (data && 'cart' in data) return (data as { cart: Cart }).cart;
  return data as Cart | undefined;
}
