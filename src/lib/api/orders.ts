import { apiGet, apiPost } from '@/lib/api/client';
import type { Order } from '@/lib/api/types';

export async function createOrder(token: string): Promise<Order | undefined> {
  const data = await apiPost<{ order: Order } | Order>('/orders', {}, token);
  if (data && 'order' in data) return (data as { order: Order }).order;
  return data as Order | undefined;
}

export async function listOrders(
  token: string,
  params?: { page?: number; limit?: number }
): Promise<Order[]> {
  const q = new URLSearchParams();
  if (params?.page != null) q.set('page', String(params.page));
  if (params?.limit != null) q.set('limit', String(params.limit));
  const qs = q.toString();
  const data = await apiGet<unknown>(`/orders${qs ? `?${qs}` : ''}`, token);
  if (!data || typeof data !== 'object') return [];
  const o = data as Record<string, unknown>;
  if (Array.isArray(o.orders)) return o.orders as Order[];
  if (Array.isArray(o.items)) return o.items as Order[];
  if (Array.isArray(data)) return data as Order[];
  return [];
}

export async function getOrder(id: number, token: string): Promise<Order | undefined> {
  const data = await apiGet<{ order: Order } | Order>(`/orders/${id}`, token);
  if (data && 'order' in data) return (data as { order: Order }).order;
  return data as Order | undefined;
}
