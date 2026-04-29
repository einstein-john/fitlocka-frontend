import { ApiError } from '@/lib/api/client';

const DEFAULT_USER_MESSAGE = 'Something went wrong. Please try again.';

/**
 * Message safe to show in toasts / inline UI. Never exposes env vars, parser internals, or 5xx details.
 */
export function getUserFacingErrorMessage(err: unknown, fallback = DEFAULT_USER_MESSAGE): string {
  if (err instanceof ApiError) {
    if (!err.safeForUser) return fallback;
    if (err.status >= 500) return fallback;
    const msg = err.message?.trim();
    if (msg) return msg;
    return fallback;
  }
  if (err instanceof Error) {
    const msg = err.message?.trim() ?? '';
    if (!msg) return fallback;
    if (/VITE_|Invalid JSON|Unexpected response|Request failed \(\d+\)|\[object Object\]/i.test(msg)) return fallback;
    if (msg.length > 280 || /\n/.test(msg) || /at\s+.+\(.+\)/.test(msg)) return fallback;
    return msg;
  }
  return fallback;
}
