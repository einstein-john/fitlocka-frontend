import { Link } from 'react-router';
import SeoHead, { defaultJsonLdOrganization } from '@/app/components/SeoHead';
import { useAuth } from '@/app/context/AuthContext';
import { getSiteUrl } from '@/lib/env';
import { useCategoriesCatalog } from '@/lib/hooks/useCategoriesCatalog';

const fallbackBg = ['var(--accent2)', 'var(--black)', 'var(--accent)', '#2c5f2e'];

export default function Collections() {
  const { token } = useAuth();
  const { categories, loading } = useCategoriesCatalog(token);

  const site = getSiteUrl();

  return (
    <>
      <SeoHead
        title="Collections — FITLOCKA"
        description="Explore curated collections of retro jerseys by era and category."
        canonicalPath="/collections"
        jsonLd={defaultJsonLdOrganization()}
      />
      <section className="min-h-screen">
        <div className="py-20 px-[60px] border-b-[1.5px] border-[var(--black)]">
          <div className="mb-2.5 text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Curated Collections
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '96px', letterSpacing: '0.01em', lineHeight: '0.95' }}>
            EXPLORE
            <br />
            <span className="text-[var(--accent)]">THE VAULT</span>
          </div>
        </div>

        {loading ? (
          <div className="px-[60px] py-20 text-[var(--muted-foreground)]" style={{ fontFamily: "'Space Mono', monospace" }}>
            Loading collections…
          </div>
        ) : !categories.length ? (
          <div className="px-[60px] py-20 max-w-lg" style={{ fontFamily: "'Space Mono', monospace" }}>
            <p className="text-[var(--muted-foreground)] mb-4">No collections yet. Check back soon or browse the full catalog.</p>
            <Link to="/shop" className="text-[var(--accent)] underline underline-offset-4">
              Shop all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2">
            {categories.map((collection, index) => (
              <Link
                key={collection.id}
                to={`/shop?categoryId=${collection.id}`}
                className={`relative overflow-hidden min-h-[400px] flex flex-col justify-end px-8 md:px-[60px] py-16 md:py-20 no-underline text-[var(--white)] transition-transform duration-300 hover:-translate-y-2 ${
                  index % 2 === 0 ? 'md:border-r-[1.5px]' : ''
                } ${index < 2 ? 'border-b-[1.5px]' : ''} border-[var(--black)]`}
                style={{ background: fallbackBg[index % fallbackBg.length] }}
              >
                <div
                  className="absolute top-0 right-0 opacity-[0.08] leading-none pointer-events-none text-[var(--white)]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'min(25vw, 280px)' }}
                >
                  {collection.id}
                </div>
                <div className="relative z-10">
                  <div className="mb-3 text-white/60" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    Collection
                  </div>
                  <div className="mb-4 text-white text-balance" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px,8vw,64px)', lineHeight: '0.95', letterSpacing: '0.02em' }}>
                    {collection.name}
                  </div>
                  {collection.description ? (
                    <p className="text-white/80 text-[15px] leading-[1.7] mb-6 max-w-[380px]">{collection.description}</p>
                  ) : (
                    <p className="text-white/80 text-[15px] leading-[1.7] mb-6 max-w-[380px]">Shop pieces in this line.</p>
                  )}
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className="inline-block bg-white text-[var(--black)] px-8 py-3.5"
                      style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
                    >
                      Explore
                    </span>
                    <span className="text-white/50 text-[12px]" style={{ fontFamily: "'Space Mono', monospace", letterSpacing: '0.1em' }}>
                      {site.replace(/^https?:\/\//, '')}/shop
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
