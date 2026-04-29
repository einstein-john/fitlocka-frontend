import { useAuth } from '@/app/context/AuthContext';
import { useSearchUi } from '@/app/context/SearchUiContext';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Dialog, DialogContent, DialogTitle } from '@/app/components/ui/dialog';
import { cn } from '@/app/components/ui/utils';
import { formatPrice } from '@/app/components/product/ProductTile';
import { listProducts } from '@/lib/api/products';
import type { Product } from '@/lib/api/types';
import { getUserFacingErrorMessage } from '@/lib/api/userError';
import { useCategoriesCatalog } from '@/lib/hooks/useCategoriesCatalog';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';

function useDebouncedValue<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), ms);
    return () => window.clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

export default function RetroSearchOverlay() {
  const { open, closeSearch } = useSearchUi();
  const { token } = useAuth();
  const navigate = useNavigate();
  const { categories } = useCategoriesCatalog(token);

  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query.trim(), 320);

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setItems([]);
      setError(null);
      setLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (!debounced) {
      setItems([]);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    void listProducts(token, { search: debounced, page: 1, limit: 12 })
      .then((res) => {
        if (!cancelled) setItems(res.items);
      })
      .catch((e) => {
        if (!cancelled) setError(getUserFacingErrorMessage(e, 'Search failed'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, debounced, token]);

  const goShopAll = () => {
    const q = query.trim();
    if (!q) return;
    navigate(`/shop?search=${encodeURIComponent(q)}`);
    closeSearch();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) closeSearch();
      }}
    >
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          queueMicrotask(() => inputRef.current?.focus());
        }}
        className={cn(
          'max-w-[min(44rem,calc(100vw-1.5rem))] gap-0 rounded-none border-[3px] border-[var(--black)] bg-[var(--cream)] p-0 shadow-[8px_10px_0_0_var(--black)] sm:max-w-[min(44rem,calc(100vw-2rem))]',
          '[&>button]:hidden',
        )}
      >
        <DialogTitle className="sr-only">Search the catalog</DialogTitle>

        <div className="border-b-[3px] border-[var(--black)] bg-[var(--black)] px-5 py-3 flex items-center justify-between gap-4">
          <span className="text-[var(--white)] tracking-[0.2em]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px' }}>
            CATALOG SEARCH
          </span>
          <button
            type="button"
            onClick={closeSearch}
            className="text-[var(--white)]/80 hover:text-[var(--white)] bg-transparent border border-white/25 px-2 py-1 cursor-pointer text-[10px] tracking-[0.15em] uppercase"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Esc · Close
          </button>
        </div>

        <div className="p-5 md:p-6 border-b-[1.5px] border-[var(--black)]/15">
          <label className="block mb-2 text-[var(--mid)] tracking-[0.12em] uppercase" style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px' }}>
            Find jerseys, teams, eras…
          </label>
          <input
            ref={inputRef}
            type="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                goShopAll();
              }
            }}
            className="w-full box-border border-[2px] border-[var(--black)] bg-[var(--white)] px-4 py-3 text-[var(--black)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: '15px' }}
            placeholder="Type and wait for live results…"
          />
          <p className="mt-2 text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.06em' }}>
            <span className="hidden sm:inline">Tip: </span>Enter runs a full browse with filters.{' '}
            <kbd className="border border-[var(--black)]/20 px-1 py-0.5 bg-[var(--white)]">⌘K</kbd> /{' '}
            <kbd className="border border-[var(--black)]/20 px-1 py-0.5 bg-[var(--white)]">Ctrl K</kbd> toggles this panel.
          </p>
        </div>

        <div className="max-h-[min(50vh,28rem)] overflow-y-auto">
          {error ? (
            <div className="p-5 text-destructive" style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px' }}>
              {error}
            </div>
          ) : null}

          {!debounced && !error ? (
            <div className="p-5 md:p-6">
              <div className="mb-3 text-[var(--mid)] uppercase tracking-[0.15em]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px' }}>
                Jump to a collection
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/shop?categoryId=${c.id}`}
                    onClick={closeSearch}
                    className="no-underline border-[1.5px] border-[var(--black)] px-3 py-1.5 text-[11px] text-[var(--black)] bg-transparent hover:bg-[var(--black)] hover:text-[var(--white)] transition-colors"
                    style={{ fontFamily: "'Space Mono', monospace", letterSpacing: '0.06em', textTransform: 'uppercase' }}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
              {categories.length === 0 ? (
                <p className="text-[var(--muted-foreground)] mt-2" style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px' }}>
                  No collections yet — type above to search products.
                </p>
              ) : null}
            </div>
          ) : null}

          {debounced && loading ? (
            <div className="p-5 text-[var(--mid)] animate-pulse" style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px' }}>
              Scanning the vault…
            </div>
          ) : null}

          {debounced && !loading && !error && items.length === 0 ? (
            <div className="p-5 text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px' }}>
              No matches. Try another spelling or hit Enter to open the shop.
            </div>
          ) : null}

          {items.length > 0 ? (
            <ul className="list-none m-0 p-0 divide-y divide-[var(--black)]/10">
              {items.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/product/${p.id}`}
                    onClick={closeSearch}
                    className="no-underline flex gap-4 p-4 hover:bg-[var(--black)]/5 text-[var(--black)] items-center transition-colors"
                  >
                    <div className="w-14 h-[4.5rem] shrink-0 bg-[var(--card-bg)] border border-[var(--black)]/15 overflow-hidden">
                      {(() => {
                        const img = p.images?.find((i) => i.isPrimary) ?? p.images?.[0];
                        return img?.url ? (
                          <ImageWithFallback src={img.url} alt={img.altText || p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace" }}>
                            —
                          </div>
                        );
                      })()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-[15px] leading-snug">{p.name}</div>
                      <div className="text-[var(--mid)] mt-0.5" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.08em' }}>
                        {p.category?.name ?? 'Jersey'} · {formatPrice(p.price)}
                      </div>
                    </div>
                    <span className="shrink-0 text-[var(--accent)] text-[10px] tracking-[0.12em] uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
                      Open →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {debounced && !loading && items.length > 0 ? (
          <div className="border-t-[1.5px] border-[var(--black)]/15 p-4 flex justify-between items-center gap-4 bg-[var(--white)]/60">
            <span className="text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px' }}>
              Showing top matches. Refine on the shop.
            </span>
            <button
              type="button"
              onClick={goShopAll}
              className="shrink-0 cursor-pointer border-[2px] border-[var(--black)] bg-[var(--black)] text-[var(--white)] px-4 py-2 uppercase tracking-[0.12em] hover:bg-[var(--accent)] transition-colors"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px' }}
            >
              All results →
            </button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
