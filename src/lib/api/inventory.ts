import { apiGet, apiPatch } from '@/lib/api/client';
import type { InventoryRecord } from '@/lib/api/types';

export async function getInventory(productId: number, token: string): Promise<InventoryRecord | undefined> {
  const data = await apiGet<{ inventory: InventoryRecord } | InventoryRecord>(`/inventory/${productId}`, token);
  if (data && 'inventory' in data) return (data as { inventory: InventoryRecord }).inventory;
  return data as InventoryRecord | undefined;
}

export async function patchInventory(productId: number, stock: number, token: string): Promise<InventoryRecord | undefined> {
  const data = await apiPatch<{ inventory: InventoryRecord }, { stock: number }>(
    `/inventory/${productId}`,
    { stock },
    token
  );
  if (data && 'inventory' in data) return (data as { inventory: InventoryRecord }).inventory;
  return data as InventoryRecord | undefined;
}
