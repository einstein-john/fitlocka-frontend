import { addCartItem, getCart, removeCartItem, updateCartItem } from '@/lib/api/cart';
import type { Cart } from '@/lib/api/types';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

type CartContextValue = {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  setQty: (itemId: number, quantity: number) => Promise<void>;
  remove: (itemId: number) => Promise<void>;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!token) {
      setCart(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const c = await getCart(token);
      setCart(c ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Cart error');
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (productId: number, quantity = 1) => {
      if (!token) throw new Error('Sign in to add to cart');
      const c = await addCartItem(productId, quantity, token);
      setCart(c ?? null);
    },
    [token]
  );

  const setQty = useCallback(
    async (itemId: number, quantity: number) => {
      if (!token) throw new Error('Sign in required');
      const c = await updateCartItem(itemId, quantity, token);
      setCart(c ?? null);
    },
    [token]
  );

  const remove = useCallback(
    async (itemId: number) => {
      if (!token) throw new Error('Sign in required');
      const c = await removeCartItem(itemId, token);
      setCart(c ?? null);
      if (!c) await refresh();
    },
    [token, refresh]
  );

  const itemCount = useMemo(() => {
    if (!cart?.items?.length) return 0;
    return cart.items.reduce((acc, i) => acc + (i.quantity ?? 0), 0);
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      loading,
      error,
      refresh,
      addItem,
      setQty,
      remove,
      itemCount,
    }),
    [cart, loading, error, refresh, addItem, setQty, remove, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
