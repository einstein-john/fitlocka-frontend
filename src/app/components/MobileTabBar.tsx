import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { useCart } from '@/app/context/CartContext';
import { useSearchUi } from '@/app/context/SearchUiContext';

const mono = { fontFamily: "'Space Mono', monospace" } as const;

const ICONS: Record<string, ReactNode> = {
  home: <path d="M3 9.5l7-6.5 7 6.5V17h-4.5v-4.5h-5V17H3V9.5z" />,
  shop: (
    <>
      <rect x="3" y="3" width="6" height="6" />
      <rect x="11" y="3" width="6" height="6" />
      <rect x="3" y="11" width="6" height="6" />
      <rect x="11" y="11" width="6" height="6" />
    </>
  ),
  search: (
    <>
      <circle cx="9" cy="9" r="6" />
      <line x1="13.5" y1="13.5" x2="18" y2="18" />
    </>
  ),
  cart: (
    <>
      <path d="M4 6.5h12l-1 11H5l-1-11z" />
      <path d="M7 6.5a3 3 0 0 1 6 0" />
    </>
  ),
  account: (
    <>
      <circle cx="10" cy="6.5" r="3.2" />
      <path d="M3.5 17.5c0-3.4 2.9-5.3 6.5-5.3s6.5 1.9 6.5 5.3" />
    </>
  ),
};

function TabIcon({ icon, active }: { icon: string; active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={active ? 'var(--accent)' : 'var(--mid)'} strokeWidth="1.6">
      {ICONS[icon]}
    </svg>
  );
}

function TabLabel({ label, active }: { label: string; active: boolean }) {
  return (
    <span className={`text-[8px] uppercase tracking-[0.08em] ${active ? 'text-[var(--accent)]' : 'text-[var(--mid)]'}`} style={mono}>
      {label}
    </span>
  );
}

/** App-like bottom tab bar — mobile only (hidden >= lg). Design ref: canvas 1a. */
export default function MobileTabBar() {
  const { pathname } = useLocation();
  const { itemCount } = useCart();
  const { openSearch } = useSearchUi();

  const tabs = [
    { icon: 'home', label: 'Home', to: '/', active: pathname === '/' },
    { icon: 'shop', label: 'Shop', to: '/shop', active: pathname.startsWith('/shop') || pathname.startsWith('/product') || pathname.startsWith('/collections') },
    { icon: 'cart', label: 'Cart', to: '/cart', active: pathname.startsWith('/cart') || pathname.startsWith('/checkout') },
    { icon: 'account', label: 'Account', to: '/account', active: pathname.startsWith('/account') || pathname.startsWith('/login') || pathname.startsWith('/wishlist') },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[110] bg-[var(--white)] border-t-[1.5px] border-[var(--black)] grid grid-cols-5 pt-2 pb-[max(env(safe-area-inset-bottom),8px)]">
      {tabs.slice(0, 2).map((t) => (
        <Link key={t.icon} to={t.to} className="no-underline flex flex-col items-center gap-1 min-h-[44px]">
          <TabIcon icon={t.icon} active={t.active} />
          <TabLabel label={t.label} active={t.active} />
        </Link>
      ))}
      <button type="button" onClick={openSearch} className="bg-transparent border-none p-0 cursor-pointer flex flex-col items-center gap-1 min-h-[44px]">
        <TabIcon icon="search" active={false} />
        <TabLabel label="Search" active={false} />
      </button>
      {tabs.slice(2).map((t) => (
        <Link key={t.icon} to={t.to} className="no-underline flex flex-col items-center gap-1 min-h-[44px] relative">
          {t.icon === 'cart' && itemCount > 0 ? (
            <span className="absolute -top-1 right-[26%] bg-[var(--accent)] text-[var(--white)] text-[7px] w-[13px] h-[13px] flex items-center justify-center" style={mono}>
              {itemCount}
            </span>
          ) : null}
          <TabIcon icon={t.icon} active={t.active} />
          <TabLabel label={t.label} active={t.active} />
        </Link>
      ))}
    </nav>
  );
}
