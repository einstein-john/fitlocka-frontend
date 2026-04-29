import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import SeoHead from '@/app/components/SeoHead';
import RequireAuth from '@/app/components/auth/RequireAuth';
import { formatPrice } from '@/app/components/product/ProductTile';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Link } from 'react-router';
import { toast } from 'sonner';

function CartInner() {
  const { cart, setQty, remove, loading } = useCart();

  if (loading && !cart) {
    return <p style={{ fontFamily: "'Space Mono', monospace" }}>Loading cart…</p>;
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

  return (
    <ul className="divide-y divide-[var(--border)] border border-[var(--black)]">
      {cart.items.map((item) => (
        <li key={item.id} className="flex flex-wrap gap-6 items-center p-6">
          <div className="flex-1 min-w-[200px]">
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px' }}>
              {item.product?.name ?? `Product #${item.productId}`}
            </div>
            <div className="text-sm text-[var(--muted-foreground)]">{item.product ? formatPrice(Number(item.product.price)) : ''}</div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor={`q-${item.id}`} className="sr-only">
              Quantity
            </label>
            <Input
              id={`q-${item.id}`}
              type="number"
              min={1}
              className="w-20 rounded-none border-[var(--black)]"
              defaultValue={item.quantity}
              onBlur={async (e) => {
                const q = Number(e.target.value);
                if (q >= 1) {
                  try {
                    await setQty(item.id, q);
                  } catch {
                    toast.error('Could not update quantity');
                  }
                }
              }}
            />
          </div>
          <Button variant="outline" className="rounded-none border-[var(--black)]" type="button" onClick={() => remove(item.id).catch(() => toast.error('Could not remove'))}>
            Remove
          </Button>
        </li>
      ))}
    </ul>
  );
}

export default function CartPage() {
  return (
    <>
      <SeoHead title="Cart — FITLOCKA" description="Review your FITLOCKA cart." canonicalPath="/cart" noindex />
      <RequireAuth>
        <section className="min-h-screen px-[60px] py-16 max-w-4xl">
          <div className="mb-2.5 text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Bag
          </div>
          <h1 className="mb-10" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px', lineHeight: '1' }}>
            CART
          </h1>
          <CartInner />
          <div className="mt-10">
            <Link
              to="/checkout"
              className="inline-block bg-[var(--black)] text-[var(--white)] px-8 py-4 no-underline hover:bg-[var(--accent)] transition-colors"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
            >
              Checkout
            </Link>
          </div>
        </section>
      </RequireAuth>
    </>
  );
}
