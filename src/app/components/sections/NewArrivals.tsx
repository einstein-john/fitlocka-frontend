import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import ProductTile from '@/app/components/product/ProductTile';
import { useAuth } from '@/app/context/AuthContext';
import { listProducts } from '@/lib/api/products';
import type { Product } from '@/lib/api/types';

export default function NewArrivals() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    void listProducts(token, { limit: 3, page: 1 }).then((p) => setProducts(p.items));
  }, [token]);

  return (
    <section className="py-20 px-[60px] border-b-[1.5px] border-[var(--black)]">
      <div className="flex justify-between items-end mb-10">
        <div>
          <div className="mb-2.5 text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Just Landed
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px', letterSpacing: '0.02em', lineHeight: '1' }}>
            NEW ARRIVALS
          </div>
        </div>
        <Link
          to="/shop"
          className="no-underline text-[var(--black)] border-b-[1.5px] border-[var(--black)] pb-0.5 transition-all duration-200 hover:text-[var(--accent)] hover:border-[var(--accent)]"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
        >
          See All →
        </Link>
      </div>
      {!products.length ? (
        <p className="text-[var(--muted-foreground)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px' }}>
          Loading…
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((item) => (
            <ProductTile key={item.id} product={item} tag="New" />
          ))}
        </div>
      )}
    </section>
  );
}
