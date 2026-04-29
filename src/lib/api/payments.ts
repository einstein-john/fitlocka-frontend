import { apiPost } from '@/lib/api/client';

export async function checkout(orderId: number, token: string): Promise<unknown> {
  return apiPost<unknown, { orderId: number }>('/payments/checkout', { orderId }, token);
}
