import FilterRow from '@/app/components/sections/FilterRow';
import ProductTile from '@/app/components/product/ProductTile';
import SeoHead, { defaultJsonLdOrganization, jsonLdWebSite } from '@/app/components/SeoHead';
import { useAuth } from '@/app/context/AuthContext';
import { listProducts } from '@/lib/api/products';
import { listCategories } from '@/lib/api/categories';
import type { Category, Product } from '@/lib/api/types';
import { getSiteUrl } from '@/lib/env';
import { getUserFacingErrorMessage } from '@/lib/api/userError';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';

export default function Shop() {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryIdParam = searchParams.get('categoryId');
  const searchQ = searchParams.get('search') ?? '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState(searchQ);

  const categoryId = categoryIdParam ? Number(categoryIdParam) : undefined;
  const site = getSiteUrl();
  const canonical = `${site}/shop${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  useEffect(() => {
    let cancelled = false;
    void listCategories(token, { limit: 200 }).then((c) => {
      if (!cancelled) setCategories(c);
    });
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    setLocalSearch(searchQ);
  }, [searchQ]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    void (async () => {
      try {
        const p = await listProducts(token, {
          page,
          limit,
          search: searchQ || undefined,
          categoryId: categoryId != null && !Number.isNaN(categoryId) ? categoryId : undefined,
        });
        if (cancelled) return;
        setTotal(p.total);
        setProducts((prev) => (page === 1 ? p.items : [...prev, ...p.items]));
      } catch (e) {
        if (!cancelled) {
          setError(getUserFacingErrorMessage(e, 'Could not load products'));
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, page, limit, searchQ, categoryId]);

  useEffect(() => {
    setPage(1);
    setProducts([]);
  }, [token]);

  const applyFilters = () => {
    const next = new URLSearchParams();
    if (categoryIdParam) next.set('categoryId', categoryIdParam);
    if (localSearch.trim()) next.set('search', localSearch.trim());
    setSearchParams(next);
    setPage(1);
    setProducts([]);
  };

  const hasMore = total > products.length;

  return (
    <>
      <SeoHead
        title="Shop retro jerseys — FITLOCKA"
        description="Browse authentic retro jerseys and sport culture. Filter by collection and search the catalog."
        canonicalUrl={canonical}
        jsonLd={[defaultJsonLdOrganization(), jsonLdWebSite()]}
      />
      <FilterRow />
      <section className="py-20 px-[60px] min-h-screen">
        <div className="mb-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="mb-2.5 text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              All Products
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '72px', letterSpacing: '0.02em', lineHeight: '1' }}>
              SHOP JERSEYS
            </div>
          </div>
          <div className="flex flex-wrap gap-3 items-center max-w-xl">
            <select
              className="h-9 border border-[var(--black)] bg-[var(--background)] px-2 min-w-[160px]"
              value={categoryIdParam ?? ''}
              onChange={(e) => {
                const next = new URLSearchParams(searchParams);
                if (e.target.value) next.set('categoryId', e.target.value);
                else next.delete('categoryId');
                setSearchParams(next);
                setPage(1);
                setProducts([]);
              }}
            >
              <option value="">All collections</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Input
              className="rounded-none border-[var(--black)] max-w-[220px]"
              placeholder="Search…"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            />
            <Button type="button" variant="outline" className="rounded-none border-[var(--black)]" onClick={applyFilters}>
              Search
            </Button>
            {!token ? (
              <span className="text-xs text-[var(--muted-foreground)]" style={{ fontFamily: "'Space Mono', monospace" }}>
                <Link to="/login" className="underline">
                  Sign in
                </Link>{' '}
                for cart & checkout
              </span>
            ) : null}
          </div>
        </div>

        {error ? (
          <div className="mb-8 p-4 border border-destructive text-destructive max-w-2xl" style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px' }}>
            {error}
          </div>
        ) : null}

        {loading && page === 1 && products.length === 0 ? (
          <p style={{ fontFamily: "'Space Mono', monospace" }}>Loading catalog…</p>
        ) : products.length === 0 ? (
          <p className="text-[var(--muted-foreground)]">No products match your filters.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductTile key={product.id} product={product} />
              ))}
            </div>
            {hasMore ? (
              <div className="mt-12 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none"
                  disabled={loading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {loading ? 'Loading…' : 'Load more'}
                </Button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </>
  );
}
