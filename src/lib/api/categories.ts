import { apiDeleteData, apiGet, apiPost, apiPut } from '@/lib/api/client';
import { normalizeCategoryList } from '@/lib/api/normalize';
import type { Category } from '@/lib/api/types';

export type CategoryCreateBody = { name: string; description?: string | null; slug?: string };
export type CategoryUpdateBody = { name?: string; description?: string | null; slug?: string };

export async function listCategories(
  token: string | null,
  params?: { search?: string; page?: number; limit?: number }
): Promise<Category[]> {
  const q = new URLSearchParams();
  if (params?.search) q.set('search', params.search);
  if (params?.page != null) q.set('page', String(params.page));
  if (params?.limit != null) q.set('limit', String(params.limit));
  const qs = q.toString();
  const data = await apiGet<unknown>(`/categories${qs ? `?${qs}` : ''}`, token);
  return normalizeCategoryList(data);
}

export async function getCategory(id: number, token: string | null): Promise<Category | undefined> {
  const data = await apiGet<{ category: Category } | Category>(`/categories/${id}`, token);
  if (data && 'category' in data) return (data as { category: Category }).category;
  return data as Category | undefined;
}

export async function createCategory(body: CategoryCreateBody, token: string): Promise<Category | undefined> {
  const data = await apiPost<Category | { category: Category }, CategoryCreateBody>('/categories', body, token);
  if (data && typeof data === 'object' && 'category' in data) return (data as { category: Category }).category;
  if (data && typeof data === 'object' && 'id' in data) return data as Category;
  return undefined;
}

export async function updateCategory(id: number, body: CategoryUpdateBody, token: string): Promise<Category | undefined> {
  const data = await apiPut<{ category: Category }, CategoryUpdateBody>(`/categories/${id}`, body, token);
  return data?.category;
}

export async function deleteCategory(id: number, token: string): Promise<void> {
  await apiDeleteData(`/categories/${id}`, token);
}
