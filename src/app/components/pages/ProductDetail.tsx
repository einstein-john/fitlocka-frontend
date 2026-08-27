import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { toast } from 'sonner';
import SeoHead from '@/app/components/SeoHead';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';
import { getProduct } from '@/lib/api/products';
import { formatPrice } from '@/app/components/product/ProductTile';
import type { Product } from '@/lib/api/types';
import { getSiteUrl } from '@/lib/env';
import { getUserFacingErrorMessage } from '@/lib/api/userError';

const mono = { fontFamily: "'Space Mono', monospace" } as const;
const bebas = { fontFamily: "'Bebas Neue', sans-serif" } as const;

const SIZES = ['S', 'M', 'L', 'XL'];

/** Product detail with size selector, qty stepper, wishlist + info accordion.
 *  Design ref: canvas 1f. NOTE: size is client-side until the backend models variants. */
export default function ProductDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const { addItem } = useCart();
  const wishlist = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState<string>('M');

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
        <span style={mono}>Loading…</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div style={{ ...bebas, fontSize: 'clamp(48px, 10vw, 72px)' }}>Product Not Found</div>
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
  const saved = wishlist.has(product.id);
  const lineTotal = formatPrice(Number(product.price) * qty);

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

  const addToCart = async () => {
    if (!token) {
      toast.error('Sign in to add to cart');
      return;
    }
    try {
      // NOTE: `size` is not sent — the API has no variant field yet. Wire it in here when it lands.
      await addItem(product.id, qty);
      toast.success(`Added to cart · Size ${size}`);
    } catch (e) {
      toast.error(getUserFacingErrorMessage(e, 'Could not add'));
    }
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
      <section className="min-h-screen pb-20 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 border-b-[1.5px] border-[var(--black)]">
          {/* Image */}
          <div className="relative border-b-[1.5px] lg:border-b-0 lg:border-r-[1.5px] border-[var(--black)] bg-[var(--cream)] flex items-center justify-center p-10 lg:p-20 min-h-[400px]">
            <button
              type="button"
              aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
              onClick={() => wishlist.toggle(product)}
              className={`absolute top-3.5 right-3.5 z-[2] w-[38px] h-[38px] border-[1.5px] border-[var(--black)] flex items-center justify-center cursor-pointer ${saved ? 'bg-[var(--accent)]' : 'bg-[var(--white)]'}`}
            >
              <svg width="17" height="17" viewBox="0 0 20 20" fill={saved ? '#f5f3ee' : 'none'} stroke={saved ? '#f5f3ee' : 'var(--black)'} strokeWidth="1.5">
                <path d="M10 17s-6.5-4.2-6.5-8.7C3.5 5.6 5.5 4 7.5 4c1.2 0 2 .6 2.5 1.4C10.5 4.6 11.3 4 12.5 4c2 0 4 1.6 4 4.3C16.5 12.8 10 17 10 17z" />
              </svg>
            </button>
            {primary?.url ? (
              <ImageWithFallback src={primary.url} alt={primary.altText || product.name} className="max-w-full max-h-[560px] object-contain" />
            ) : (
              <div className="w-[280px] h-[360px] lg:w-[400px] lg:h-[500px] relative flex items-center justify-center shadow-[12px_16px_48px_rgba(0,0,0,0.2)] bg-[var(--accent2)]" style={{ clipPath: 'polygon(18% 0%, 82% 0%, 100% 12%, 100% 100%, 0% 100%, 0% 12%)' }}>
                <div className="absolute top-0 left-0 right-0 h-2 bg-[var(--accent)]" />
                <span className="text-[var(--white)] text-4xl opacity-30" style={bebas}>
                  {product.sku}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="px-5 lg:px-[60px] py-8 lg:py-20 flex flex-col gap-6">
            <div>
              <div className="mb-3 text-[var(--mid)]" style={{ ...mono, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                {product.category?.name ?? 'Product'} · SKU {product.sku}
              </div>
              <h1 className="mb-4 text-balance" style={{ ...bebas, fontSize: 'clamp(40px, 8vw, 72px)', lineHeight: '0.95', letterSpacing: '0.01em' }}>
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="text-[var(--accent)]" style={{ ...mono, fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 700 }}>
                  {formatPrice(Number(product.price))}
                </span>
                <span className="text-[var(--mid)]" style={{ ...mono, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {stock > 0 ? `${stock} available` : 'Out of stock'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-[var(--mid)]" style={{ ...mono, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Size
              </span>
              <div className="flex gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`flex-1 max-w-[72px] h-[46px] cursor-pointer ${size === s ? 'bg-[var(--black)] text-[var(--white)] border border-[var(--black)]' : 'bg-transparent text-[var(--black)] border border-[var(--black)]'}`}
                    style={{ ...mono, fontSize: '12px' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2.5">
              <div className="flex items-center border-[1.5px] border-[var(--black)]">
                <button type="button" aria-label="Decrease quantity" className="w-11 h-[50px] bg-transparent border-none cursor-pointer text-base" style={mono} onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  −
                </button>
                <span className="w-9 text-center" style={{ ...mono, fontSize: '13px', fontWeight: 700 }}>
                  {qty}
                </span>
                <button type="button" aria-label="Increase quantity" className="w-11 h-[50px] bg-transparent border-none cursor-pointer text-base" style={mono} onClick={() => setQty((q) => Math.min(Math.max(stock, 1), q + 1))}>
                  +
                </button>
              </div>
              <button
                type="button"
                disabled={stock <= 0}
                onClick={() => void addToCart()}
                className="flex-1 bg-[var(--black)] text-[var(--white)] border-none cursor-pointer transition-colors duration-200 hover:bg-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ ...mono, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
              >
                Add to cart — {lineTotal}
              </button>
            </div>
            {!token ? (
              <p className="m-0 text-sm text-[var(--muted-foreground)]">
                <Link to="/login" className="underline text-[var(--accent)]">
                  Sign in
                </Link>{' '}
                to purchase.
              </p>
            ) : null}

            {product.description ? <p className="m-0 text-[15px] leading-[1.8] text-[#3a3630]">{product.description}</p> : null}

            <div className="border border-[var(--border)]">
              {[
                { t: 'Authenticity guarantee', b: 'Every jersey is sourced and verified by our authentication team before it ships.' },
                { t: 'Shipping & returns', b: 'Free standard shipping over $150. 30-day returns on all items.' },
                { t: 'Condition report', b: 'Vintage items are graded 1–10; the grade is listed in the description.' },
              ].map((row) => (
                <details key={row.t} className="group border-b border-[var(--border)] last:border-b-0">
                  <summary className="list-none flex justify-between items-center px-3.5 py-3.5 cursor-pointer" style={{ ...mono, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    {row.t}
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:inline">−</span>
                  </summary>
                  <p className="m-0 px-3.5 pb-3.5 text-sm leading-relaxed text-[var(--muted-foreground)]">{row.b}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
