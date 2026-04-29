import { useParams, Link } from 'react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import SeoHead from '@/app/components/SeoHead';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { getProduct } from '@/lib/api/products';
import { formatPrice } from '@/app/components/product/ProductTile';
import type { Product } from '@/lib/api/types';
import { getSiteUrl } from '@/lib/env';
import { getUserFacingErrorMessage } from '@/lib/api/userError';

export default function ProductDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id) return;
    const pid = Number(id);
    if (Number.isNaN(pid)) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    void getProduct(pid, token)
      .then((p) => {
        if (!cancelled) setProduct(p ?? null);
      })
      .catch(() => {
        if (!cancelled) setProduct(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span style={{ fontFamily: "'Space Mono', monospace" }}>Loading…</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '72px' }}>Product Not Found</div>
          <Link to="/shop" className="underline mt-6 inline-block">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const primary = product.images?.find((i) => i.isPrimary) ?? product.images?.[0];
  const site = getSiteUrl();
  const url = `${site}/product/${product.id}`;
  const stock = product.inventory?.stock ?? 0;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || undefined,
    sku: product.sku,
    image: primary?.url ? [primary.url] : undefined,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'USD',
      price: String(product.price),
      availability: stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: `${site}/shop` },
      { '@type': 'ListItem', position: 3, name: product.name, item: url },
    ],
  };

  return (
    <>
      <SeoHead
        title={`${product.name} — FITLOCKA`}
        description={product.description ?? `Shop ${product.name} at FITLOCKA.`}
        canonicalPath={`/product/${product.id}`}
        ogType="product"
        ogImage={primary?.url}
        jsonLd={[productJsonLd, breadcrumbJsonLd]}
      />
      <section className="min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 border-b-[1.5px] border-[var(--black)]">
          <div className="border-b lg:border-b-0 lg:border-r-[1.5px] border-[var(--black)] bg-[var(--cream)] flex items-center justify-center p-10 lg:p-20 min-h-[400px]">
            {primary?.url ? (
              <ImageWithFallback
                src={primary.url}
                alt={primary.altText || product.name}
                className="max-w-full max-h-[560px] object-contain"
              />
            ) : (
              <div
                className="w-[280px] h-[360px] lg:w-[400px] lg:h-[500px] relative flex items-center justify-center shadow-[12px_16px_48px_rgba(0,0,0,0.2)] bg-[var(--accent2)]"
                style={{ clipPath: 'polygon(18% 0%, 82% 0%, 100% 12%, 100% 100%, 0% 100%, 0% 12%)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-2 bg-[var(--accent)]" />
                <span className="text-[var(--white)] text-4xl opacity-30" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {product.sku}
                </span>
              </div>
            )}
          </div>

          <div className="px-8 lg:px-[60px] py-16 lg:py-20">
            <div className="mb-3 text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              {product.category?.name ?? 'Product'} · SKU {product.sku}
            </div>
            <h1 className="mb-6 text-balance" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px,8vw,72px)', lineHeight: '0.95', letterSpacing: '0.01em' }}>
              {product.name}
            </h1>
            <div className="mb-8 text-[var(--accent)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '36px', fontWeight: '700' }}>
              {formatPrice(Number(product.price))}
            </div>
            {product.description ? (
              <p className="text-[15px] leading-[1.8] text-[#3a3630] mb-8">{product.description}</p>
            ) : null}

            <div className="mb-8 pb-8 border-b border-[var(--border)]">
              <div className="mb-4 text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Quantity
              </div>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                className="w-24 border-[1.5px] border-[var(--black)] px-3 py-2 bg-[var(--background)]"
              />
              <p className="mt-3 text-sm text-[var(--muted-foreground)]">{stock > 0 ? `${stock} available` : 'Out of stock'}</p>
            </div>

            <button
              type="button"
              disabled={!token || stock <= 0}
              className="w-full bg-[var(--black)] text-[var(--white)] border-none px-9 py-5 cursor-pointer transition-all duration-200 hover:bg-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
              onClick={async () => {
                if (!token) {
                  toast.error('Sign in to add to cart');
                  return;
                }
                try {
                  await addItem(product.id, qty);
                  toast.success('Added to cart');
                } catch (e) {
                  toast.error(getUserFacingErrorMessage(e, 'Could not add'));
                }
              }}
            >
              Add to Cart
            </button>
            {!token ? (
              <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                <Link to="/login" className="underline text-[var(--accent)]">
                  Sign in
                </Link>{' '}
                to purchase.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
