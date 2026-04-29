# FITLOCKA frontend

React + Vite storefront with API integration, account/cart/checkout, hidden admin panel (**⌘⇧M** / **Ctrl+Shift+M**), and SEO (`SeoHead`, `robots.txt`, `sitemap.xml`).

## Setup

1. Copy [.env.example](.env.example) to `.env` and set:
   - `VITE_API_BASE_URL` — API origin (no trailing slash), e.g. `https://fit.damtowise.xyz`
   - `VITE_API_KEY` — `x-api-key` for your app (from backend seed / `applications`)
   - `VITE_SITE_URL` — public site URL for canonical tags & JSON-LD

2. Install and run:

```bash
npm install
npm run dev
```

3. Production build outputs to `dist/` (includes `robots.txt` and `sitemap.xml` from `public/`).

## Routes (high level)

| Path | Purpose |
|------|---------|
| `/`, `/shop`, `/collections`, `/about` | Public catalog |
| `/authenticity`, `/shipping`, `/returns` | Policies (authenticity, shipping, returns) |
| `/login`, `/register`, `/auth/magic-link`, `/auth/email-confirmation` | Auth (magic link + email confirm) |
| `/cart`, `/checkout`, `/account/*` | Signed-in flows |
| `/__admin` | Management panel (**⌘⇧M** / **Ctrl+Shift+M**; requires admin JWT) |
| `/sitemap` | Human sitemap; crawlers use `/sitemap.xml` |

## API authentication (application + user)

The backend expects **two different credentials** on most routes:

| Header | Role | When |
|--------|------|------|
| **`x-api-key`** | Identifies the **frontend application** (your `applications` row / `VITE_API_KEY`) | **Every** request the app makes (unless you explicitly skip it). |
| **`Authorization: Bearer &lt;jwt&gt;`** | Identifies the **signed-in user**; the API runs the operation **on their behalf** (cart, orders, profile, etc.) | After login, register (if session returned), magic link, or email confirmation—whenever the backend returns a session JWT. |

**Anonymous browsing** (e.g. catalog): only **`x-api-key`** is sent (`token` is `null` in the API helpers).

**After sign-in**: the JWT from the auth response is stored (see `AuthContext` → `localStorage`). All user-scoped API modules pass that value into `apiGet` / `apiPost` / … as the `token` argument, so each request sends **both** `x-api-key` **and** `Authorization: Bearer <user jwt>`. The app key is **not** replaced by the user token—they work together.

## Notes

- Every API request sends **`x-api-key`** (`VITE_API_KEY`). When the user is signed in, the same request also sends **`Authorization: Bearer <jwt>`** using the token returned by the backend.
- If the API enforces JWT on `GET /products`, users must **sign in** to load the catalog.
- Update [public/robots.txt](public/robots.txt) and [public/sitemap.xml](public/sitemap.xml) if your production domain differs.

## Backend email redirects (API server `.env`)

Resend emails must point users at these frontend routes (with `https://` in production):

| Variable | Example value |
|----------|----------------|
| `MAGIC_LINK_REDIRECT_URL` | `https://fit.damtowise.xyz/auth/magic-link` |
| `EMAIL_CONFIRMATION_REDIRECT_URL` | `https://fit.damtowise.xyz/auth/email-confirmation` |

The app handles `?token=...` on both URLs (`GET /auth/login/magic-link` and `GET /auth/register/confirm-email` respectively).
