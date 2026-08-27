import SeoHead, { defaultJsonLdOrganization } from '@/app/components/SeoHead';
import { Link } from 'react-router';
import type { ReactNode } from 'react';

type PolicyPageProps = {
  title: string;
  description: string;
  canonicalPath: string;
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight?: string;
  lastUpdated?: string;
  children: ReactNode;
};

/** Shared shell for Authenticity, Shipping, and Returns policy pages. */
export default function PolicyPage({
  title,
  description,
  canonicalPath,
  heroEyebrow,
  heroTitle,
  heroHighlight,
  lastUpdated = 'April 2026',
  children,
}: PolicyPageProps) {
  return (
    <>
      <SeoHead title={title} description={description} canonicalPath={canonicalPath} jsonLd={defaultJsonLdOrganization()} />
      <section className="min-h-screen">
        <div className="py-12 md:py-24 px-5 lg:px-[60px] border-b-[1.5px] border-[var(--black)] bg-[var(--cream)]">
          <div className="max-w-[720px]">
            <div className="mb-4 text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              {heroEyebrow}
            </div>
            <h1 className="text-balance" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 7vw, 80px)', lineHeight: '0.95', letterSpacing: '0.02em' }}>
              {heroTitle}
              {heroHighlight ? (
                <>
                  <br />
                  <span className="text-[var(--accent)]">{heroHighlight}</span>
                </>
              ) : null}
            </h1>
            <p className="mt-6 text-[13px] text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", letterSpacing: '0.08em' }}>
              Last updated {lastUpdated}
            </p>
          </div>
        </div>
        <div className="py-12 lg:py-16 px-5 lg:px-[60px] pb-24 lg:pb-16 max-w-[720px]">
          <div className="space-y-8 text-[15px] leading-[1.85] text-[#3a3630]">{children}</div>
          <nav className="mt-14 pt-8 border-t border-[var(--border)] flex flex-wrap gap-x-6 gap-y-2 text-[13px]" style={{ fontFamily: "'Space Mono', monospace" }}>
            <Link to="/authenticity" className="text-[var(--accent)] underline">
              Authenticity
            </Link>
            <Link to="/shipping" className="text-[var(--accent)] underline">
              Shipping
            </Link>
            <Link to="/returns" className="text-[var(--accent)] underline">
              Returns
            </Link>
            <Link to="/about" className="text-[var(--muted-foreground)] underline">
              About
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}

export function PolicyH2({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[26px] md:text-[30px] mb-3 mt-10 first:mt-0 text-[var(--black)] tracking-[0.02em]" style={{ fontFamily: "'Bebas Neue', sans-serif", lineHeight: '1.1' }}>
      {children}
    </h2>
  );
}
