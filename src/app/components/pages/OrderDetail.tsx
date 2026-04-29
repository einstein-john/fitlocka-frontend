import { useAuth } from '@/app/context/AuthContext';
import SeoHead from '@/app/components/SeoHead';
import { formatPrice } from '@/app/components/product/ProductTile';
import { getOrder } from '@/lib/api/orders';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import type { Order } from '@/lib/api/types';

export default function OrderDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) return;
    const oid = Number(id);
    if (Number.isNaN(oid)) {
      setError('Invalid order');
      return;
    }
    let cancelled = false;
    void getOrder(oid, token).then((o) => {
      if (!cancelled) {
        if (o) setOrder(o);
        else setError('Order not found');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [token, id]);

  return (
    <>
      <SeoHead title={order ? `Order #${order.id} — FITLOCKA` : 'Order — FITLOCKA'} description="Order details." canonicalPath={`/account/orders/${id ?? ''}`} noindex />
      <section className="min-h-screen px-[60px] py-16 max-w-3xl">
        <Link to="/account/orders" className="text-sm underline mb-8 inline-block">
          ← All orders
        </Link>
        {error ? (
          <p className="text-destructive">{error}</p>
        ) : !order ? (
          <p style={{ fontFamily: "'Space Mono', monospace" }}>Loading…</p>
        ) : (
          <>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px', lineHeight: '1' }} className="mb-4">
              ORDER #{order.id}
            </h1>
            <p className="text-[var(--muted-foreground)] mb-10">
              {order.status ?? '—'}
              {order.total != null ? ` · ${formatPrice(Number(order.total))}` : ''}
            </p>
            <ul className="border border-[var(--black)] divide-y divide-[var(--border)]">
              {(order.items ?? []).map((line, idx) => (
                <li key={line.id ?? idx} className="p-6 flex justify-between gap-4">
                  <div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px' }}>{line.product?.name ?? `Product #${line.productId}`}</div>
                    <div className="text-sm text-[var(--muted-foreground)]">Qty {line.quantity}</div>
                  </div>
                  <div className="text-sm">{line.unitPrice != null ? formatPrice(Number(line.unitPrice)) : ''}</div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  );
}
