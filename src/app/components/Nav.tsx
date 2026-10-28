import { Link } from 'react-router';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { useSearchUi } from '@/app/context/SearchUiContext';

const mono = { fontFamily: "'Space Mono', monospace" } as const;

/** Responsive nav: compact icon header on mobile, original 3-column bar on >= lg. Design ref: canvas 1a header. */
export default function Nav() {
  const { openSearch } = useSearchUi();
  const { itemCount } = useCart();

  return (
    <nav className="sticky top-0 z-[100] bg-[var(--white)] border-b-[1.5px] border-[var(--black)]">
      {/* Mobile header */}
      <div className="grid lg:hidden grid-cols-[44px_1fr_44px] items-center px-2.5 h-[54px]">
        <button type="button" onClick={openSearch} aria-label="Search" className="bg-transparent border-none p-0 cursor-pointer w-11 h-11 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--black)" strokeWidth="1.5">
            <circle cx="9" cy="9" r="6" />
            <line x1="13.5" y1="13.5" x2="18" y2="18" />
          </svg>
        </button>
        <Link to="/" className="text-center no-underline text-[var(--black)]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', letterSpacing: '0.05em' }}>
          FITL<span className="text-[var(--accent)]">O</span>CKA.
        </Link>
        <Link to="/cart" aria-label="Cart" className="relative no-underline justify-self-end w-11 h-11 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--black)" strokeWidth="1.5">
            <path d="M4 6.5h12l-1 11H5l-1-11z" />
            <path d="M7 6.5a3 3 0 0 1 6 0" />
          </svg>
          {itemCount > 0 ? (
            <span className="absolute top-1 right-0 bg-[var(--accent)] text-[var(--white)] text-[8px] w-[14px] h-[14px] flex items-center justify-center" style={mono}>
              {itemCount}
            </span>
          ) : null}
        </Link>
      </div>

      {/* Desktop header (unchanged from original, plus Wishlist) */}
      <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center px-10 h-[68px]">
        <ul className="flex gap-8 list-none" style={mono}>
          <li>
            <Link to="/shop" className="no-underline text-[var(--black)] text-[11px] tracking-[0.1em] uppercase transition-colors duration-200 hover:text-[var(--accent)]">
              Shop
            </Link>
          </li>
          <li>
            <Link to="/collections" className="no-underline text-[var(--black)] text-[11px] tracking-[0.1em] uppercase transition-colors duration-200 hover:text-[var(--accent)]">
              Collections
            </Link>
          </li>
          <li>
            <button type="button" onClick={openSearch} className="bg-transparent border-none p-0 cursor-pointer text-[var(--black)] text-[11px] tracking-[0.1em] uppercase transition-colors duration-200 hover:text-[var(--accent)]" style={mono}>
              Search
            </button>
          </li>
          <li>
            <Link to="/about" className="no-underline text-[var(--black)] text-[11px] tracking-[0.1em] uppercase transition-colors duration-200 hover:text-[var(--accent)]">
              About
            </Link>
          </li>
        </ul>
        <Link to="/" className="text-center relative no-underline text-[var(--black)]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '0.05em' }}>
          FITL<span className="text-[var(--accent)]">O</span>CKA.
        </Link>
        <NavRight />
      </div>
    </nav>
  );
}

function NavRight() {
  const { token } = useAuth();
  const { itemCount } = useCart();

  return (
    <div className="flex justify-end items-center gap-5">
      <Link to="/wishlist" className="no-underline text-[11px] uppercase tracking-[0.1em] text-[var(--black)] hover:text-[var(--accent)]" style={mono}>
        Wishlist
      </Link>
      {token ? (
        <Link to="/account" className="no-underline text-[11px] uppercase tracking-[0.1em] text-[var(--black)] hover:text-[var(--accent)]" style={mono}>
          Account
        </Link>
      ) : (
        <Link to="/login" className="no-underline text-[11px] uppercase tracking-[0.1em] text-[var(--black)] hover:text-[var(--accent)]" style={mono}>
          Sign in
        </Link>
      )}
      <Link to="/cart" className="bg-[var(--black)] text-[var(--white)] no-underline px-[22px] py-[9px] transition-all duration-200 hover:bg-[var(--accent)]" style={{ ...mono, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        Cart ({itemCount})
      </Link>
    </div>
  );
}
