import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import ProductTile from '@/app/components/product/ProductTile';
import { useAuth } from '@/app/context/AuthContext';
import { listProducts } from '@/lib/api/products';
import type { Product } from '@/lib/api/types';

export default function FeaturedProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    void listProducts(token, { limit: 4, page: 1 }).then((p) => setProducts(p.items));
  }, [token]);

  return (
    <section className="py-12 px-5 lg:py-20 lg:px-[60px] border-b-[1.5px] border-[var(--black)]">
      <div className="flex justify-between items-end mb-10">
        <div>
          <div className="mb-2.5 text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Curated Picks
          </div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px', letterSpacing: '0.02em', lineHeight: '1' }}>
            FEATURED DROPS
          </div>
        </div>
        <Link
          to="/shop"
          className="no-underline text-[var(--black)] border-b-[1.5px] border-[var(--black)] pb-0.5 transition-all duration-200 hover:text-[var(--accent)] hover:border-[var(--accent)]"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
        >
          View All →
        </Link>
      </div>
      {!products.length ? (
        <p className="text-[var(--muted-foreground)] text-sm" style={{ fontFamily: "'Space Mono', monospace" }}>
          Loading featured products…
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductTile key={product.id} product={product} tag={index === 0 ? 'Best seller' : null} />
          ))}
        </div>
      )}
    </section>
  );
}
