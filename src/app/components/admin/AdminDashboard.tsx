import { listProducts } from '@/lib/api/products';
import { listCategories } from '@/lib/api/categories';
import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [productTotal, setProductTotal] = useState<number | null>(null);
  const [categoryCount, setCategoryCount] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      const [p, c] = await Promise.all([listProducts(token, { limit: 1, page: 1 }), listCategories(token, { limit: 200 })]);
      if (!cancelled) {
        setProductTotal(p?.total ?? p.items.length);
        setCategoryCount(c.length);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div>
      <h1 className="mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px' }}>
        DASHBOARD
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
        <div className="border border-[var(--black)] p-6 bg-[var(--card-bg)]">
          <div className="text-[10px] uppercase tracking-widest text-[var(--muted-foreground)] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
            Products
          </div>
          <div className="text-3xl font-bold">{productTotal ?? '—'}</div>
          <Link to="/__admin/products" className="text-sm underline mt-4 inline-block">
            Manage
          </Link>
        </div>
        <div className="border border-[var(--black)] p-6 bg-[var(--card-bg)]">
          <div className="text-[10px] uppercase tracking-widest text-[var(--muted-foreground)] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
            Categories
          </div>
          <div className="text-3xl font-bold">{categoryCount ?? '—'}</div>
          <Link to="/__admin/categories" className="text-sm underline mt-4 inline-block">
            Manage
          </Link>
        </div>
        <div className="border border-[var(--black)] p-6 bg-[var(--card-bg)]">
          <div className="text-[10px] uppercase tracking-widest text-[var(--muted-foreground)] mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
            API keys
          </div>
          <div className="text-3xl font-bold">Apps</div>
          <Link to="/__admin/applications" className="text-sm underline mt-4 inline-block">
            Applications
          </Link>
        </div>
      </div>
      <p className="mt-10 text-sm text-[var(--muted-foreground)] max-w-xl">
        Use <kbd className="px-1 border border-[var(--border)]">Ctrl</kbd> + <kbd className="px-1 border border-[var(--border)]">Shift</kbd> +{' '}
        <kbd className="px-1 border border-[var(--border)]">M</kbd> from any page to open this panel.
      </p>
    </div>
  );
}
