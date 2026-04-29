import { Link } from 'react-router';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import type { Product } from '@/lib/api/types';

export function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

const strip = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 2) return { a: name, b: '' };
  const mid = Math.ceil(parts.length / 2);
  return { a: parts.slice(0, mid).join(' '), b: parts.slice(mid).join(' ') };
};

export default function ProductTile({ product, tag }: { product: Product; tag?: string | null }) {
  const primary = product.images?.find((i) => i.isPrimary) ?? product.images?.[0];
  const { a, b } = strip(product.name);
  const subtitle = product.category?.name ?? 'Collection';

  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-[var(--card-bg)] cursor-pointer relative overflow-hidden transition-transform duration-250 hover:-translate-y-1 no-underline text-[var(--black)] block"
    >
      <div className="w-full aspect-[3/4] block relative overflow-hidden bg-gradient-to-br from-[#c5c0b8] to-[#a8a29a]">
        {primary?.url ? (
          <ImageWithFallback src={primary.url} alt={primary.altText || product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            <div
              className="w-[80%] h-[75%] relative flex items-center justify-center bg-[var(--accent2)]"
              style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 14%, 100% 100%, 0% 100%, 0% 14%)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-[5px] bg-[var(--accent)]" />
              <span className="text-white/20 text-[52px]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {product.sku?.slice(0, 3) ?? '·'}
              </span>
            </div>
          </div>
        )}
        {tag ? (
          <div
            className="absolute top-3.5 left-3.5 text-[var(--white)] px-2.5 py-1 bg-[var(--accent)]"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            {tag}
          </div>
        ) : null}
      </div>
      <div className="p-[18px_20px_22px] border-t-[1.5px] border-[var(--black)]">
        <div className="mb-1 text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {subtitle}
        </div>
        <div className="mb-2 leading-[1.1]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '0.05em' }}>
          {a}
          {b ? (
            <>
              <br />
              {b}
            </>
          ) : null}
        </div>
        <div className="flex justify-between items-center">
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '13px', fontWeight: '700' }}>{formatPrice(Number(product.price))}</span>
          <span className="text-[11px] text-[var(--mid)] uppercase" style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px' }}>
            {product.status === 'INACTIVE' ? 'Unavailable' : 'In stock'}
          </span>
        </div>
      </div>
    </Link>
  );
}
