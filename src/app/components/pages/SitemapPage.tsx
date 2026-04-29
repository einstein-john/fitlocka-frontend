import { Link } from 'react-router';
import SeoHead from '@/app/components/SeoHead';
import { getSiteUrl } from '@/lib/env';

const paths = [
  { path: '/', label: 'Home' },
  { path: '/shop', label: 'Shop' },
  { path: '/collections', label: 'Collections' },
  { path: '/about', label: 'About' },
  { path: '/authenticity', label: 'Authenticity policy' },
  { path: '/shipping', label: 'Shipping policy' },
  { path: '/returns', label: 'Returns policy' },
  { path: '/login', label: 'Sign in' },
  { path: '/register', label: 'Register' },
  { path: '/auth/magic-link', label: 'Magic link callback (?token= from email)' },
  { path: '/auth/email-confirmation', label: 'Email confirmation (?token= from signup email)' },
  { path: '/cart', label: 'Cart' },
  { path: '/sitemap.xml', label: 'XML Sitemap (for crawlers)' },
];

export default function SitemapPage() {
  const site = getSiteUrl();
  return (
    <>
      <SeoHead title="Sitemap — FITLOCKA" description="All public pages on FITLOCKA for quick navigation and search discovery." canonicalPath="/sitemap" />
      <section className="min-h-screen px-[60px] py-20 max-w-2xl">
        <div className="mb-2.5 text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Discovery
        </div>
        <h1 className="mb-10" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px', lineHeight: '1' }}>
          SITEMAP
        </h1>
        <p className="text-[var(--muted-foreground)] mb-10 text-sm leading-relaxed">
          Human-readable list of main URLs. Search engines use the{' '}
          <a href={`${site}/sitemap.xml`} className="underline text-[var(--accent)]">
            XML sitemap
          </a>{' '}
          and{' '}
          <a href={`${site}/robots.txt`} className="underline text-[var(--accent)]">
            robots.txt
          </a>
          .
        </p>
        <ul className="space-y-3 list-none pl-0">
          {paths.map(({ path, label }) => (
            <li key={path}>
              {path === '/sitemap.xml' ? (
                <a href={`${site}/sitemap.xml`} className="text-[var(--accent)] underline break-all">
                  {label}
                </a>
              ) : (
                <Link to={path} className="text-[var(--accent)] underline">
                  {label} — {path}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
