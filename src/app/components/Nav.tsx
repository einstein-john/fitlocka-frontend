import { Link } from 'react-router';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { useSearchUi } from '@/app/context/SearchUiContext';

export default function Nav() {
  const { openSearch } = useSearchUi();

  return (
    <nav className="sticky top-0 z-[100] bg-[var(--white)] border-b-[1.5px] border-[var(--black)] grid grid-cols-[1fr_auto_1fr] items-center px-10 h-[68px]">
      <ul className="flex gap-8 list-none" style={{ fontFamily: "'Space Mono', monospace" }}>
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
          <button
            type="button"
            onClick={openSearch}
            className="bg-transparent border-none p-0 cursor-pointer text-[var(--black)] text-[11px] tracking-[0.1em] uppercase transition-colors duration-200 hover:text-[var(--accent)]"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
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
    </nav>
  );
}

function NavRight() {
  const { token } = useAuth();
  const { itemCount } = useCart();

  return (
    <div className="flex justify-end items-center gap-5">
      {token ? (
        <Link to="/account" className="no-underline text-[11px] uppercase tracking-[0.1em] text-[var(--black)] hover:text-[var(--accent)]" style={{ fontFamily: "'Space Mono', monospace" }}>
          Account
        </Link>
      ) : (
        <Link to="/login" className="no-underline text-[11px] uppercase tracking-[0.1em] text-[var(--black)] hover:text-[var(--accent)]" style={{ fontFamily: "'Space Mono', monospace" }}>
          Sign in
        </Link>
      )}
      <Link
        to="/cart"
        className="bg-[var(--black)] text-[var(--white)] no-underline px-[22px] py-[9px] transition-all duration-200 hover:bg-[var(--accent)]"
        style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
      >
        Cart ({itemCount})
      </Link>
    </div>
  );
}
