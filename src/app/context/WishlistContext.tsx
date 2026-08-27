import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '@/lib/api/types';

/** Client-side wishlist (localStorage) — no backend endpoint exists yet.
 *  Swap the persistence layer for an API module when one lands. */

export type WishItem = {
  id: number;
  name: string;
  price: number;
  category?: string | null;
  sku?: string;
  image?: string | null;
};

type WishlistCtx = {
  items: WishItem[];
  count: number;
  has: (id: number) => boolean;
  toggle: (p: Product) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const KEY = 'fitlocka.wishlist.v1';
const Ctx = createContext<WishlistCtx | null>(null);

function isWishItem(v: unknown): v is WishItem {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
  const o = v as Record<string, unknown>;
  return typeof o.id === 'number' && Number.isFinite(o.id) && typeof o.name === 'string' && typeof o.price === 'number';
}

/** localStorage is user-writable, so anything that isn't a well-formed list is discarded. */
function load(): WishItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isWishItem) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishItem[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* storage full/unavailable — wishlist stays in-memory */
    }
  }, [items]);

  const has = useCallback((id: number) => items.some((i) => i.id === id), [items]);

  const toggle = useCallback((p: Product) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === p.id)) return prev.filter((i) => i.id !== p.id);
      const primary = p.images?.find((i) => i.isPrimary) ?? p.images?.[0];
      return [
        { id: p.id, name: p.name, price: p.price, category: p.category?.name ?? null, sku: p.sku, image: primary?.url ?? null },
        ...prev,
      ];
    });
  }, []);

  const remove = useCallback((id: number) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({ items, count: items.length, has, toggle, remove, clear }), [items, has, toggle, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}
