import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import SeoHead from '@/app/components/SeoHead';
import RequireAuth from '@/app/components/auth/RequireAuth';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { formatPrice } from '@/app/components/product/ProductTile';
import { getUserFacingErrorMessage } from '@/lib/api/userError';

const mono = { fontFamily: "'Space Mono', monospace" } as const;
const bebas = { fontFamily: "'Bebas Neue', sans-serif" } as const;

const SHIPPING_KEY = 'fitlocka.shipping.v1';
const EXPRESS_PRICE = 24;

type Shipping = { name: string; line1: string; city: string; state: string; zip: string };
const emptyShipping: Shipping = { name: '', line1: '', city: '', state: '', zip: '' };

function loadShipping(): Shipping {
  try {
    const raw = localStorage.getItem(SHIPPING_KEY);
    return raw ? { ...emptyShipping, ...(JSON.parse(raw) as Shipping) } : emptyShipping;
  } catch {
    return emptyShipping;
  }
}

const inputCls = 'w-full rounded-none border-[1.5px] border-[var(--black)] bg-[var(--background)] px-3.5 py-3 outline-none focus:border-[var(--accent)] min-w-0';
const labelStyle = { ...mono, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' } as const;

function CheckoutInner() {
  const { placeOrderAndPay, user } = useAuth();
  const { cart, refresh } = useCart();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [shipping, setShipping] = useState<Shipping>(loadShipping);
  const [express, setExpress] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(SHIPPING_KEY, JSON.stringify(shipping));
    } catch {
      /* non-fatal */
    }
  }, [shipping]);

  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, i) => sum + Number(i.product?.price ?? 0) * i.quantity, 0);
  const shippingCost = express ? EXPRESS_PRICE : 0;
  const total = subtotal + shippingCost;

  const set = (k: keyof Shipping) => (e: React.ChangeEvent<HTMLInputElement>) => setShipping((s) => ({ ...s, [k]: e.target.value }));

  const go = async () => {
    if (!items.length) {
      toast.error('Cart is empty');
      return;
    }
    if (!shipping.name.trim() || !shipping.line1.trim() || !shipping.city.trim() || !shipping.zip.trim()) {
      toast.error('Fill in your shipping address');
      return;
    }
    setBusy(true);
    try {
      // NOTE: address + delivery choice are stored client-side for now —
      // pass them to the API here once the backend accepts them.
      const { orderId } = await placeOrderAndPay();
      await refresh();
      toast.success('Order placed');
      navigate(`/account/orders/${orderId}`, { replace: true });
    } catch (e) {
      toast.error(getUserFacingErrorMessage(e, 'Checkout failed'));
    } finally {
      setBusy(false);
    }
  };

  const radioBox = (active: boolean) => `flex justify-between items-center px-3.5 py-3.5 cursor-pointer ${active ? 'border-[1.5px] border-[var(--black)] bg-[var(--cream)]' : 'border border-[rgba(10,10,10,0.2)]'}`;
  const radioDot = (active: boolean) => (
    <span className={`w-3.5 h-3.5 flex-none flex items-center justify-center border-[1.5px] ${active ? 'border-[var(--black)]' : 'border-[rgba(10,10,10,0.3)]'}`}>
      {active ? <span className="w-[7px] h-[7px] bg-[var(--accent)]" /> : null}
    </span>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] lg:border-t-[1.5px] lg:border-[var(--black)]">
      {/* Form column */}
      <div className="flex flex-col gap-7 lg:border-r-[1.5px] lg:border-[var(--black)] lg:pr-14 lg:py-12">
        <div className="flex items-center gap-3" style={mono}>
          <span className="text-[10px] uppercase tracking-[0.1em] font-bold">01 Address</span>
          <span className="flex-1 h-[1.5px] bg-[var(--black)]" />
          <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-[var(--accent)]">02 Payment</span>
          <span className="flex-1 h-px bg-[rgba(10,10,10,0.2)]" />
          <span className="text-[10px] uppercase tracking-[0.1em] text-[var(--mid)]">03 Review</span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[var(--mid)]" style={labelStyle}>
            Contact
          </span>
          <input className={inputCls} style={mono} type="email" value={user?.email ?? ''} readOnly aria-label="Email" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[var(--mid)]" style={labelStyle}>
            Shipping address
          </span>
          <input className={inputCls} style={mono} placeholder="Full name" value={shipping.name} onChange={set('name')} autoComplete="name" />
          <input className={inputCls} style={mono} placeholder="Street address" value={shipping.line1} onChange={set('line1')} autoComplete="address-line1" />
          <div className="grid grid-cols-[2fr_1fr_1fr] gap-2">
            <input className={inputCls} style={mono} placeholder="City" value={shipping.city} onChange={set('city')} autoComplete="address-level2" />
            <input className={inputCls} style={mono} placeholder="State" value={shipping.state} onChange={set('state')} autoComplete="address-level1" />
            <input className={inputCls} style={mono} placeholder="ZIP" value={shipping.zip} onChange={set('zip')} autoComplete="postal-code" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[var(--mid)]" style={labelStyle}>
            Delivery
          </span>
          <button type="button" className={`${radioBox(!express)} bg-transparent w-full text-left`} onClick={() => setExpress(false)}>
            <span className="flex items-center gap-2.5" style={{ ...mono, fontSize: '12px' }}>
              {radioDot(!express)} Standard · 4–6 days
            </span>
            <span className="font-bold text-[var(--accent)]" style={{ ...mono, fontSize: '12px' }}>
              FREE
            </span>
          </button>
          <button type="button" className={`${radioBox(express)} bg-transparent w-full text-left`} onClick={() => setExpress(true)}>
            <span className="flex items-center gap-2.5" style={{ ...mono, fontSize: '12px' }}>
              {radioDot(express)} Express · 1–2 days
            </span>
            <span style={{ ...mono, fontSize: '12px' }}>{formatPrice(EXPRESS_PRICE)}</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[var(--mid)]" style={labelStyle}>
            Payment
          </span>
          <div className="border-[1.5px] border-[var(--black)]">
            <div className="flex items-center gap-2.5 px-3.5 py-3.5 bg-[var(--cream)]">
              {radioDot(true)}
              <span style={{ ...mono, fontSize: '12px' }}>Platform secure checkout</span>
              <span className="ml-auto text-[var(--mid)]" style={{ ...mono, fontSize: '9px', letterSpacing: '0.08em' }}>
                256-BIT ENCRYPTED
              </span>
            </div>
            <p className="m-0 px-3.5 py-3 text-sm text-[var(--muted-foreground)] border-t border-[var(--border)]">
              Payment is processed through our platform — you&apos;ll receive confirmation on the next screen.
            </p>
          </div>
        </div>
      </div>

      {/* Summary column */}
      <div className="flex flex-col gap-5 bg-[var(--card-bg)] p-5 lg:p-10 mt-4 lg:mt-0 border-[1.5px] border-[var(--black)] lg:border-0">
        <span style={{ ...bebas, fontSize: '30px' }}>ORDER SUMMARY</span>
        <div className="flex flex-col">
          {items.map((i) => (
            <div key={i.id} className="flex justify-between gap-3 py-3 border-b border-[var(--border)]">
              <span className="text-[var(--mid)]" style={{ ...mono, fontSize: '11px' }}>
                {i.product?.name ?? `Product #${i.productId}`} × {i.quantity}
              </span>
              <span style={{ ...mono, fontSize: '11px' }}>{i.product ? formatPrice(Number(i.product.price) * i.quantity) : ''}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-[var(--mid)]" style={{ ...mono, fontSize: '12px' }}>
              Subtotal
            </span>
            <span style={{ ...mono, fontSize: '12px' }}>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--mid)]" style={{ ...mono, fontSize: '12px' }}>
              Shipping
            </span>
            <span className={shippingCost === 0 ? 'text-[var(--accent)]' : ''} style={{ ...mono, fontSize: '12px' }}>
              {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
            </span>
          </div>
          <div className="flex justify-between border-t-[1.5px] border-[var(--black)] pt-3">
            <span style={{ ...mono, fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em' }}>TOTAL</span>
            <span style={{ ...mono, fontSize: '20px', fontWeight: 700 }}>{formatPrice(total)}</span>
          </div>
        </div>
        <button
          type="button"
          disabled={busy || !items.length}
          onClick={() => void go()}
          className="w-full bg-[var(--accent)] text-[var(--white)] border-none px-4 py-4 cursor-pointer transition-colors duration-200 hover:bg-[var(--black)] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ ...mono, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
        >
          {busy ? 'Processing…' : `Pay ${formatPrice(total)} & place order`}
        </button>
        <div className="flex flex-col gap-2 border border-[var(--border)] px-4 py-3.5" style={{ ...mono, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <span>★ Authenticity guaranteed</span>
          <span>★ Free returns within 30 days</span>
          <span>★ 256-bit encrypted checkout</span>
        </div>
        <Link to="/cart" className="self-center text-sm underline text-[var(--black)]">
          Back to cart
        </Link>
      </div>
    </div>
  );
}

/** Full checkout — replaces the single-button stub. Design ref: canvas 1h (mobile) / 1n (desktop). */
export default function Checkout() {
  return (
    <>
      <SeoHead title="Checkout — FITLOCKA" description="Complete your FITLOCKA order." canonicalPath="/checkout" noindex />
      <RequireAuth>
        <section className="min-h-screen px-5 lg:px-[60px] py-10 lg:py-12 pb-24 lg:pb-16">
          <div className="mb-2.5 text-[var(--mid)]" style={{ ...mono, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Secure checkout
          </div>
          <h1 className="mb-8 lg:mb-10" style={{ ...bebas, fontSize: 'clamp(48px, 8vw, 64px)', lineHeight: '1' }}>
            CHECKOUT
          </h1>
          <CheckoutInner />
        </section>
      </RequireAuth>
    </>
  );
}
