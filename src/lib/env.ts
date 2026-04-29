/** Normalized site origin for SEO (no trailing slash). */
export function getSiteUrl(): string {
  const raw = import.meta.env.VITE_SITE_URL ?? 'https://fit.damtowise.xyz';
  return raw.replace(/\/+$/, '');
}

export function getApiBaseUrl(): string {
  return (import.meta.env.VITE_API_BASE_URL ?? 'https://fit.damtowise.xyz').replace(/\/+$/, '');
}

export function getApiKey(): string {
  return import.meta.env.VITE_API_KEY ?? '';
}

/** When false, login defaults to password only (no magic-link UI). Default: enabled. */
export function isMagicLinkLoginEnabled(): boolean {
  const v = import.meta.env.VITE_MAGIC_LINK_LOGIN;
  if (typeof v === 'string' && (v === 'false' || v === '0')) return false;
  return true;
}
