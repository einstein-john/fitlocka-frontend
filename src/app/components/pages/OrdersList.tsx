import { useAuth } from '@/app/context/AuthContext';
import SeoHead from '@/app/components/SeoHead';
import { listOrders } from '@/lib/api/orders';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Order } from '@/lib/api/types';

export default function OrdersList() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    void listOrders(token).then((list) => {
      if (!cancelled) {
        setOrders(list);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <>
      <SeoHead title="Orders — FITLOCKA" description="Your FITLOCKA order history." canonicalPath="/account/orders" noindex />
      <section className="min-h-screen px-5 lg:px-[60px] py-10 lg:py-16 pb-24 lg:pb-16 max-w-3xl">
        <div className="mb-2.5 text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          History
        </div>
        <h1 className="mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px', lineHeight: '1' }}>
          ORDERS
        </h1>
        <Link to="/account" className="text-sm underline mb-8 inline-block">
          ← Account
        </Link>
        {loading ? (
          <p style={{ fontFamily: "'Space Mono', monospace" }}>Loading…</p>
        ) : orders.length === 0 ? (
          <p className="text-[var(--muted-foreground)]">No orders yet.</p>
        ) : (
          <ul className="border border-[var(--black)] divide-y divide-[var(--border)]">
            {orders.map((o) => (
              <li key={o.id} className="p-6 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px' }}>Order #{o.id}</div>
                  <div className="text-sm text-[var(--muted-foreground)]">
                    {o.status ?? 'Status pending'}
                    {o.total != null ? ` · $${Number(o.total).toFixed(2)}` : ''}
                  </div>
                </div>
                <Link
                  to={`/account/orders/${o.id}`}
                  className="no-underline border border-[var(--black)] px-4 py-2 hover:bg-[var(--black)] hover:text-[var(--white)] transition-colors"
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                  Details
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
