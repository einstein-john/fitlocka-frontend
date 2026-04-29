import type { Category, CategoryListResult, Product, ProductListResult } from '@/lib/api/types';

export function normalizeProductList(data: unknown): ProductListResult {
  if (!data || typeof data !== 'object') return { items: [], total: 0, page: 1, limit: 12 };
  const o = data as Record<string, unknown>;
  const items = (Array.isArray(o.items)
    ? o.items
    : Array.isArray(o.products)
      ? o.products
      : []) as Product[];
  const total = typeof o.total === 'number' ? o.total : items.length;
  const page = typeof o.page === 'number' ? o.page : 1;
  const limit = typeof o.limit === 'number' ? o.limit : items.length || 12;
  return { items, total, page, limit };
}

export function normalizeCategoryList(data: unknown): Category[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as Category[];
  const o = data as CategoryListResult | { categories: Category[] };
  if ('items' in o && Array.isArray(o.items)) return o.items;
  if ('categories' in o && Array.isArray(o.categories)) return o.categories;
  return [];
}
