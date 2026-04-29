import { Link } from 'react-router';
import SeoHead from '@/app/components/SeoHead';

export default function NotFound() {
  return (
    <>
      <SeoHead title="404 — FITLOCKA" description="Page not found." canonicalPath="/404" noindex />
      <section className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
      <div className="text-center px-10">
        <div className="mb-8 text-[var(--accent)]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(120px, 20vw, 240px)', lineHeight: '0.9', letterSpacing: '0.02em' }}>
          404
        </div>
        <div className="mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 6vw, 64px)', letterSpacing: '0.02em' }}>
          PAGE NOT FOUND
        </div>
        <p className="text-[15px] leading-[1.8] text-[#3a3630] mb-10 max-w-[480px] mx-auto">
          Looks like this jersey got retired early. The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block bg-[var(--black)] text-[var(--white)] border-none px-9 py-4 cursor-pointer transition-all duration-200 hover:bg-[var(--accent)] no-underline"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
        >
          Back to Home
        </Link>
      </div>
    </section>
    </>
  );
}
