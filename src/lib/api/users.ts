import { apiDeleteData, apiDeleteMessage, apiGet, apiPut } from '@/lib/api/client';
import type { AuthUser } from '@/lib/api/types';

export type UserUpdateBody = {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string | null;
  lastName?: string | null;
  enabled?: boolean | null;
  isAdmin?: boolean | null;
  profilePicture?: string | null;
};

export async function getMe(token: string): Promise<AuthUser | undefined> {
  const data = await apiGet<{ user: AuthUser }>('/users/me', token);
  return data?.user;
}

export async function getUser(id: number, token: string): Promise<AuthUser | undefined> {
  const data = await apiGet<{ user: AuthUser }>(`/users/${id}`, token);
  return data?.user;
}

export async function updateUser(id: number, body: UserUpdateBody, token: string): Promise<AuthUser | undefined> {
  const data = await apiPut<{ user: AuthUser }, UserUpdateBody>(`/users/${id}`, body, token);
  return data?.user;
}

export async function deleteUser(id: number, token: string): Promise<void> {
  await apiDeleteMessage(`/users/${id}`, token);
}
