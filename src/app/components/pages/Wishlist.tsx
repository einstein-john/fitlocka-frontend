import { Link } from 'react-router';
import { toast } from 'sonner';
import SeoHead from '@/app/components/SeoHead';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';
import { formatPrice } from '@/app/components/product/ProductTile';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { getUserFacingErrorMessage } from '@/lib/api/userError';

const mono = { fontFamily: "'Space Mono', monospace" } as const;
const bebas = { fontFamily: "'Bebas Neue', sans-serif" } as const;

/** Wishlist page (new). Design ref: canvas 1l (mobile) / 1o (desktop). */
export default function Wishlist() {
  const { items, remove } = useWishlist();
  const { addItem } = useCart();
  const { token } = useAuth();

  const moveToCart = async (id: number) => {
    if (!token) {
      toast.error('Sign in to add to cart');
      return;
    }
    try {
      await addItem(id, 1);
      remove(id);
      toast.success('Moved to cart');
    } catch (e) {
      toast.error(getUserFacingErrorMessage(e, 'Could not add'));
    }
  };

  return (
    <>
      <SeoHead title="Wishlist — FITLOCKA" description="Jerseys you saved for later." canonicalPath="/wishlist" noindex />
      <section className="min-h-screen px-5 lg:px-[60px] py-10 lg:py-16 pb-24 lg:pb-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 text-[var(--mid)]" style={{ ...mono, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Saved · {items.length} {items.length === 1 ? 'item' : 'items'}
            </div>
            <h1 style={{ ...bebas, fontSize: 'clamp(48px, 8vw, 72px)', lineHeight: '1' }}>WISHLIST</h1>
          </div>
        </div>

        {items.length === 0 ? (
          <p className="text-[var(--muted-foreground)]">
            Nothing saved yet.{' '}
            <Link to="/shop" className="text-[var(--accent)] underline">
              Shop jerseys
            </Link>{' '}
            and tap the heart to keep them here.
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 lg:gap-5">
            {items.map((item) => (
              <div key={item.id} className="bg-[var(--card-bg)] border border-[var(--border)] flex flex-col">
                <div className="relative w-full aspect-[3/4]">
                  <Link to={`/product/${item.id}`} className="block w-full h-full overflow-hidden bg-gradient-to-br from-[#c5c0b8] to-[#a8a29a]">
                    {item.image ? (
                      <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-[76%] h-[72%] relative flex items-center justify-center bg-[var(--accent2)]" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 14%, 100% 100%, 0% 100%, 0% 14%)' }}>
                          <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--accent)]" />
                          <span className="text-white/25 text-[44px]" style={bebas}>
                            {item.sku?.slice(0, 3) ?? '·'}
                          </span>
                        </div>
                      </div>
                    )}
                  </Link>
                  <button
                    type="button"
                    aria-label="Remove from wishlist"
                    onClick={() => remove(item.id)}
                    className="absolute top-2 right-2 w-[30px] h-[30px] bg-[var(--accent)] border border-[var(--black)] flex items-center justify-center cursor-pointer"
                  >
                    <svg width="15" height="15" viewBox="0 0 20 20" fill="#f5f3ee" stroke="#f5f3ee" strokeWidth="1">
                      <path d="M10 17s-6.5-4.2-6.5-8.7C3.5 5.6 5.5 4 7.5 4c1.2 0 2 .6 2.5 1.4C10.5 4.6 11.3 4 12.5 4c2 0 4 1.6 4 4.3C16.5 12.8 10 17 10 17z" />
                    </svg>
                  </button>
                </div>
                <div className="p-3 lg:p-4 border-t-[1.5px] border-[var(--black)] flex flex-col gap-1 flex-1">
                  <span className="text-[var(--mid)]" style={{ ...mono, fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    {item.category ?? 'Collection'}
                  </span>
                  <Link to={`/product/${item.id}`} className="no-underline text-[var(--black)] leading-[1.05]" style={{ ...bebas, fontSize: '18px' }}>
                    {item.name}
                  </Link>
                  <span style={{ ...mono, fontSize: '12px', fontWeight: 700 }}>{formatPrice(Number(item.price))}</span>
                </div>
                <button
                  type="button"
                  onClick={() => void moveToCart(item.id)}
                  className="w-full bg-[var(--black)] text-[var(--white)] border-none py-3 cursor-pointer transition-colors duration-200 hover:bg-[var(--accent)]"
                  style={{ ...mono, fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
                >
                  Move to cart
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
