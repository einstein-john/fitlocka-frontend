import { Link } from 'react-router';
import { toast } from 'sonner';
import SeoHead from '@/app/components/SeoHead';
import RequireAuth from '@/app/components/auth/RequireAuth';
import { useCart } from '@/app/context/CartContext';
import { formatPrice } from '@/app/components/product/ProductTile';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { FREE_SHIPPING_THRESHOLD, qualifiesForFreeShipping } from '@/lib/shipping';

const mono = { fontFamily: "'Space Mono', monospace" } as const;
const bebas = { fontFamily: "'Bebas Neue', sans-serif" } as const;

function CartInner() {
  const { cart, setQty, remove, loading } = useCart();

  if (loading && !cart) {
    return <p style={mono}>Loading cart…</p>;
  }

  if (!cart?.items?.length) {
    return (
      <p className="text-[var(--muted-foreground)]">
        Your cart is empty.{' '}
        <Link to="/shop" className="text-[var(--accent)] underline">
          Shop jerseys
        </Link>
      </p>
    );
  }

  const subtotal = cart.items.reduce((sum, i) => sum + Number(i.product?.price ?? 0) * i.quantity, 0);
  const freeShipping = qualifiesForFreeShipping(subtotal);

  const changeQty = async (itemId: number, q: number) => {
    if (q < 1) return;
    try {
      await setQty(itemId, q);
    } catch {
      toast.error('Could not update quantity');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {cart.items.map((item) => {
        const primary = item.product?.images?.find((i) => i.isPrimary) ?? item.product?.images?.[0];
        return (
          <div key={item.id} className="flex gap-3.5 border-[1.5px] border-[var(--black)] p-3 bg-[var(--card-bg)]">
            <Link to={`/product/${item.productId}`} className="block w-[84px] h-[104px] flex-none bg-gradient-to-br from-[#c5c0b8] to-[#a8a29a]">
              {primary?.url ? (
                <ImageWithFallback src={primary.url} alt={item.product?.name ?? ''} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-[74%] h-[74%] relative flex items-center justify-center bg-[var(--accent2)]" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 14%, 100% 100%, 0% 100%, 0% 14%)' }}>
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--accent)]" />
                    <span className="text-white/30 text-[24px]" style={bebas}>
                      {item.product?.sku?.slice(0, 3) ?? '·'}
                    </span>
                  </div>
                </div>
              )}
            </Link>
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <div className="flex justify-between gap-2">
                <Link to={`/product/${item.productId}`} className="no-underline text-[var(--black)] leading-none" style={{ ...bebas, fontSize: '20px' }}>
                  {item.product?.name ?? `Product #${item.productId}`}
                </Link>
                <button type="button" aria-label="Remove" onClick={() => remove(item.id).catch(() => toast.error('Could not remove'))} className="bg-transparent border-none p-0 cursor-pointer flex-none h-fit">
                  <svg width="15" height="15" viewBox="0 0 20 20" stroke="var(--mid)" strokeWidth="1.5">
                    <line x1="4" y1="4" x2="16" y2="16" />
                    <line x1="16" y1="4" x2="4" y2="16" />
                  </svg>
                </button>
              </div>
              <span className="text-[var(--mid)]" style={{ ...mono, fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {item.product?.category?.name ?? 'Jersey'}
              </span>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center border border-[var(--black)]">
                  <button type="button" aria-label="Decrease quantity" className="w-8 h-8 bg-transparent border-none cursor-pointer" style={mono} onClick={() => void changeQty(item.id, item.quantity - 1)}>
                    −
                  </button>
                  <span className="w-7 text-center" style={{ ...mono, fontSize: '12px', fontWeight: 700 }}>
                    {item.quantity}
                  </span>
                  <button type="button" aria-label="Increase quantity" className="w-8 h-8 bg-transparent border-none cursor-pointer" style={mono} onClick={() => void changeQty(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <span style={{ ...mono, fontSize: '14px', fontWeight: 700 }}>{item.product ? formatPrice(Number(item.product.price) * item.quantity) : ''}</span>
              </div>
            </div>
          </div>
        );
      })}

      <div className="border border-[var(--border)] bg-[var(--cream)] px-3.5 py-3 flex justify-between items-center">
        <span style={{ ...mono, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {freeShipping ? '★ Free shipping unlocked' : `Add ${formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} for free shipping`}
        </span>
        <span className="text-[var(--mid)]" style={{ ...mono, fontSize: '9px' }}>
          over ${FREE_SHIPPING_THRESHOLD}
        </span>
      </div>

      <div className="flex flex-col gap-2.5 pt-2">
        <div className="flex justify-between">
          <span className="text-[var(--mid)]" style={{ ...mono, fontSize: '11px' }}>
            Subtotal
          </span>
          <span style={{ ...mono, fontSize: '11px' }}>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--mid)]" style={{ ...mono, fontSize: '11px' }}>
            Shipping
          </span>
          <span className="text-[var(--accent)]" style={{ ...mono, fontSize: '11px' }}>
            {freeShipping ? 'FREE' : 'Calculated at checkout'}
          </span>
        </div>
        <div className="flex justify-between border-t-[1.5px] border-[var(--black)] pt-3">
          <span style={{ ...mono, fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total</span>
          <span style={{ ...mono, fontSize: '18px', fontWeight: 700 }}>{formatPrice(subtotal)}</span>
        </div>
        <Link
          to="/checkout"
          className="block text-center bg-[var(--black)] text-[var(--white)] no-underline py-4 mt-1.5 transition-colors duration-200 hover:bg-[var(--accent)]"
          style={{ ...mono, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
        >
          Checkout — {formatPrice(subtotal)}
        </Link>
        <Link to="/shop" className="self-center text-[var(--black)] no-underline border-b border-[var(--black)] pb-0.5" style={{ ...mono, fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

/** Cart page. Design ref: canvas 1g. */
export default function CartPage() {
  const { cart } = useCart();
  const count = cart?.items?.reduce((n, i) => n + i.quantity, 0) ?? 0;

  return (
    <>
      <SeoHead title="Cart — FITLOCKA" description="Review your FITLOCKA cart." canonicalPath="/cart" noindex />
      <RequireAuth>
        <section className="min-h-screen px-5 lg:px-[60px] py-10 lg:py-16 pb-24 lg:pb-16 max-w-4xl">
          <div className="mb-2.5 text-[var(--mid)]" style={{ ...mono, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Bag · {count} {count === 1 ? 'item' : 'items'}
          </div>
          <h1 className="mb-8" style={{ ...bebas, fontSize: 'clamp(48px, 8vw, 52px)', lineHeight: '1' }}>
            CART
          </h1>
          <CartInner />
        </section>
      </RequireAuth>
    </>
  );
}
