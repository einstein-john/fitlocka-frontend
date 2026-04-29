import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import SeoHead from '@/app/components/SeoHead';
import RequireAuth from '@/app/components/auth/RequireAuth';
import { Button } from '@/app/components/ui/button';
import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { getUserFacingErrorMessage } from '@/lib/api/userError';

function CheckoutInner() {
  const { placeOrderAndPay } = useAuth();
  const { cart, refresh } = useCart();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const go = async () => {
    if (!cart?.items?.length) {
      toast.error('Cart is empty');
      return;
    }
    setBusy(true);
    try {
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

  return (
    <div className="max-w-md space-y-8">
      <p className="text-[var(--muted-foreground)] leading-relaxed">
        We&apos;ll create an order from your cart and run secure checkout. Payment is processed through our platform— you&apos;ll receive confirmation on the next screen.
      </p>
      <Button
        type="button"
        disabled={busy || !cart?.items?.length}
        onClick={() => void go()}
        className="w-full rounded-none bg-[var(--black)] text-[var(--white)] hover:bg-[var(--accent)] py-6"
        style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
      >
        {busy ? 'Processing…' : 'Pay & place order'}
      </Button>
      <Link to="/cart" className="block text-sm underline">
        Back to cart
      </Link>
    </div>
  );
}

export default function Checkout() {
  return (
    <>
      <SeoHead title="Checkout — FITLOCKA" description="Complete your FITLOCKA order." canonicalPath="/checkout" noindex />
      <RequireAuth>
        <section className="min-h-screen px-[60px] py-16">
          <div className="mb-2.5 text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Secure
          </div>
          <h1 className="mb-10" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px', lineHeight: '1' }}>
            CHECKOUT
          </h1>
          <CheckoutInner />
        </section>
      </RequireAuth>
    </>
  );
}
