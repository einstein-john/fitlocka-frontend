import { useEffect, useState } from 'react';
import { listCategories } from '@/lib/api/categories';
import type { Category } from '@/lib/api/types';

/** Categories returned by GET /categories for storefront nav (footer, filters, /collections). */
export function useCategoriesCatalog(token: string | null) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void listCategories(token, { limit: 200 })
      .then((c) => {
        if (!cancelled) setCategories(c);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return { categories, loading };
}
