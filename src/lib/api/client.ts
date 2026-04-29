import { getApiBaseUrl, getApiKey } from '@/lib/env';
import type { ApiEnvelope, ApiMessage } from '@/lib/api/types';

export class ApiError extends Error {
  /** When false, UI must use a generic message (see getUserFacingErrorMessage). */
  readonly safeForUser: boolean;

  constructor(message: string, public status: number, public body?: unknown, safeForUser = true) {
    super(message);
    this.name = 'ApiError';
    this.safeForUser = safeForUser;
  }
}

export type RequestOptions = {
  method?: string;
  body?: unknown;
  /** JWT issued by the backend after login/register/magic-link; sent as `Authorization: Bearer …` so the API acts on behalf of that user. Omit for anonymous-only calls. */
  token?: string | null;
  /** When true, omit `x-api-key` (only for routes that reject the header) */
  skipApiKey?: boolean;
  /** Skip default JSON content-type (e.g. not needed) */
  skipJson?: boolean;
};

export async function apiRequestRaw(path: string, options: RequestOptions = {}): Promise<Response> {
  const base = getApiBaseUrl();
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`;

  const headers = new Headers();
  if (!options.skipJson && options.body !== undefined && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const key = getApiKey();
  if (!options.skipApiKey) {
    if (!key) {
      console.error('[fitlocka] Missing VITE_API_KEY — set it in .env for API requests.');
      throw new ApiError('MISSING_API_KEY', 0, undefined, false);
    }
    headers.set('x-api-key', key);
  }

  // User session: backend JWT from sign-in. Always use together with x-api-key for user-scoped routes.
  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  return fetch(url, {
    method: options.method ?? 'GET',
    headers,
    body:
      options.body === undefined || options.body instanceof FormData
        ? (options.body as BodyInit | undefined)
        : JSON.stringify(options.body),
  });
}

export async function parseJsonEnvelope<T>(res: Response): Promise<{ message: string; data?: T }> {
  const text = await res.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text) as unknown;
    } catch {
      console.error('[fitlocka] Non-JSON response', res.status, text?.slice(0, 200));
      throw new ApiError('Invalid response from server', res.status, text, false);
    }
  }

  if (!res.ok) {
    const msg =
      typeof parsed === 'object' &&
      parsed !== null &&
      'message' in parsed &&
      typeof (parsed as ApiMessage).message === 'string'
        ? (parsed as ApiMessage).message
        : `Request failed (${res.status})`;
    const safeForUser = res.status >= 400 && res.status < 500;
    throw new ApiError(msg, res.status, parsed, safeForUser);
  }

  const env = parsed as ApiEnvelope<T>;
  if (!env || typeof env.message !== 'string') {
    throw new ApiError('Unexpected response from server', res.status, parsed, false);
  }
  return { message: env.message, data: env.data as T | undefined };
}

export async function apiGet<T>(path: string, token?: string | null, skipApiKey = false): Promise<T | undefined> {
  const res = await apiRequestRaw(path, { method: 'GET', token: token ?? undefined, skipApiKey });
  const { data } = await parseJsonEnvelope<T>(res);
  return data;
}

export async function apiPost<T, B = unknown>(
  path: string,
  body: B,
  token?: string | null,
  skipApiKey = false
): Promise<T | undefined> {
  const res = await apiRequestRaw(path, { method: 'POST', body, token: token ?? undefined, skipApiKey });
  const { data } = await parseJsonEnvelope<T>(res);
  return data;
}

export async function apiPut<T, B = unknown>(
  path: string,
  body: B,
  token?: string | null,
  skipApiKey = false
): Promise<T | undefined> {
  const res = await apiRequestRaw(path, { method: 'PUT', body, token: token ?? undefined, skipApiKey });
  const { data } = await parseJsonEnvelope<T>(res);
  return data;
}

export async function apiPatch<T, B = unknown>(
  path: string,
  body: B,
  token?: string | null,
  skipApiKey = false
): Promise<T | undefined> {
  const res = await apiRequestRaw(path, { method: 'PATCH', body, token: token ?? undefined, skipApiKey });
  const { data } = await parseJsonEnvelope<T>(res);
  return data;
}

export async function apiDeleteMessage(path: string, token?: string | null, skipApiKey = false): Promise<string> {
  const res = await apiRequestRaw(path, { method: 'DELETE', token: token ?? undefined, skipApiKey });
  const { message } = await parseJsonEnvelope(res);
  return message;
}

export async function apiDeleteData<T>(path: string, token?: string | null, skipApiKey = false): Promise<T | undefined> {
  const res = await apiRequestRaw(path, { method: 'DELETE', token: token ?? undefined, skipApiKey });
  const { data } = await parseJsonEnvelope<T>(res);
  return data;
}
