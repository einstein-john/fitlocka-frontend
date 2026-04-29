import { apiGet, apiPost, apiRequestRaw, parseJsonEnvelope } from '@/lib/api/client';
import type { AuthUser } from '@/lib/api/types';

export interface RegisterBody {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}

/** Register may return a session immediately or require email confirmation first (no token in body). */
export type RegisterOutcome =
  | { kind: 'session'; token: string; user: AuthUser }
  | { kind: 'pending_confirmation'; message: string };

/** After email confirmation, API may return a session or only a success message. */
export type ConfirmEmailOutcome =
  | { kind: 'session'; token: string; user: AuthUser }
  | { kind: 'confirmed'; message: string };

export async function register(body: RegisterBody): Promise<RegisterOutcome> {
  const res = await apiRequestRaw('/auth/register', { method: 'POST', body });
  const { message, data } = await parseJsonEnvelope<Partial<AuthResult>>(res);
  const token = data && typeof data === 'object' && 'token' in data ? String((data as AuthResult).token) : '';
  const user = data && typeof data === 'object' && 'user' in data ? (data as AuthResult).user : undefined;
  if (token && user) {
    return { kind: 'session', token, user };
  }
  return { kind: 'pending_confirmation', message };
}

export async function login(body: LoginBody): Promise<AuthResult | undefined> {
  return apiPost<AuthResult, LoginBody>('/auth/login', body, null);
}

export async function magicLinkExchange(token: string): Promise<AuthResult | undefined> {
  const q = new URLSearchParams({ token });
  return apiGet<AuthResult>(`/auth/login/magic-link?${q.toString()}`, null);
}

export async function requestMagicLink(email: string): Promise<string> {
  const res = await apiRequestRaw('/auth/login/magic-link/request', {
    method: 'POST',
    body: { email },
  });
  const { message } = await parseJsonEnvelope(res);
  return message;
}

export async function confirmEmail(token: string): Promise<ConfirmEmailOutcome> {
  const q = new URLSearchParams({ token });
  const res = await apiRequestRaw(`/auth/register/confirm-email?${q.toString()}`, { method: 'GET' });
  const { message, data } = await parseJsonEnvelope<Partial<AuthResult>>(res);
  const jwt = data && typeof data === 'object' && 'token' in data ? String((data as AuthResult).token) : '';
  const user = data && typeof data === 'object' && 'user' in data ? (data as AuthResult).user : undefined;
  if (jwt && user) {
    return { kind: 'session', token: jwt, user };
  }
  return { kind: 'confirmed', message };
}
