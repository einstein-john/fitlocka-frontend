import { apiDeleteData, apiGet, apiPost, apiPut } from '@/lib/api/client';
import { normalizeProductList } from '@/lib/api/normalize';
import type { Product, ProductImage, ProductListResult } from '@/lib/api/types';

export type ProductCreateBody = {
  categoryId: number;
  name: string;
  sku: string;
  description?: string | null;
  price: number;
  status?: 'ACTIVE' | 'INACTIVE';
  initialStock?: number;
};

export type ProductUpdateBody = {
  categoryId?: number;
  name?: string;
  sku?: string;
  description?: string | null;
  price?: number;
  status?: 'ACTIVE' | 'INACTIVE';
};

export type ProductAttachImageBody = {
  url: string;
  altText?: string | null;
  sortOrder?: number;
  isPrimary?: boolean;
};

export async function listProducts(
  token: string | null,
  params?: { page?: number; limit?: number; search?: string; categoryId?: number }
): Promise<ProductListResult> {
  const q = new URLSearchParams();
  if (params?.page != null) q.set('page', String(params.page));
  if (params?.limit != null) q.set('limit', String(params.limit));
  if (params?.search) q.set('search', params.search);
  if (params?.categoryId != null) q.set('categoryId', String(params.categoryId));
  const qs = q.toString();
  const raw = await apiGet<unknown>(`/products${qs ? `?${qs}` : ''}`, token);
  return normalizeProductList(raw);
}

export async function getProduct(id: number, token: string | null): Promise<Product | undefined> {
  const data = await apiGet<{ product: Product } | Product>(`/products/${id}`, token);
  if (data && 'product' in data) return (data as { product: Product }).product;
  return data as Product | undefined;
}

export async function createProduct(body: ProductCreateBody, token: string): Promise<Product | undefined> {
  const data = await apiPost<Product | { product: Product }, ProductCreateBody>('/products', body, token);
  if (data && typeof data === 'object' && 'product' in data) return (data as { product: Product }).product;
  if (data && typeof data === 'object' && 'id' in data) return data as Product;
  return undefined;
}

export async function updateProduct(id: number, body: ProductUpdateBody, token: string): Promise<Product | undefined> {
  const data = await apiPut<{ product: Product }, ProductUpdateBody>(`/products/${id}`, body, token);
  return data?.product;
}

export async function deleteProduct(id: number, token: string): Promise<void> {
  await apiDeleteData(`/products/${id}`, token);
}

export async function attachProductImage(
  productId: number,
  body: ProductAttachImageBody,
  token: string
): Promise<ProductImage | undefined> {
  const data = await apiPost<{ image: ProductImage } | ProductImage, ProductAttachImageBody>(
    `/products/${productId}/images`,
    body,
    token
  );
  if (data && 'image' in data) return (data as { image: ProductImage }).image;
  return data as ProductImage | undefined;
}

export async function removeProductImage(
  productId: number,
  productImageId: number,
  token: string
): Promise<void> {
  await apiDeleteData(`/products/${productId}/images/${productImageId}`, token);
}
