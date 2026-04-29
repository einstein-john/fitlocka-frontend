import { Link, NavLink, Outlet } from 'react-router';
import { useAuth } from '@/app/context/AuthContext';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block px-3 py-2 no-underline text-[11px] uppercase tracking-widest border-l-2 ${
    isActive ? 'border-[var(--accent)] bg-[var(--cream)] text-[var(--black)]' : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
  }`;

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-[var(--background)] text-[var(--foreground)]">
      <aside className="w-56 shrink-0 border-r-[1.5px] border-[var(--black)] bg-[var(--card-bg)] flex flex-col">
        <div className="p-4 border-b border-[var(--border)]">
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px' }}>ADMIN</div>
          <div className="text-[10px] text-[var(--muted-foreground)] mt-1 truncate" style={{ fontFamily: "'Space Mono', monospace" }}>
            {user?.email}
          </div>
        </div>
        <nav className="flex-1 py-4 flex flex-col gap-0.5" style={{ fontFamily: "'Space Mono', monospace" }}>
          <NavLink to="/__admin" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/__admin/products" className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/__admin/categories" className={linkClass}>
            Categories
          </NavLink>
          <NavLink to="/__admin/inventory" className={linkClass}>
            Inventory
          </NavLink>
          <NavLink to="/__admin/applications" className={linkClass}>
            API apps
          </NavLink>
          <NavLink to="/__admin/users" className={linkClass}>
            Users
          </NavLink>
        </nav>
        <div className="p-4 border-t border-[var(--border)] space-y-2">
          <Link
            to="/"
            className="block text-center no-underline py-2 border border-[var(--black)] text-[10px] uppercase tracking-widest hover:bg-[var(--black)] hover:text-[var(--white)]"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Storefront
          </Link>
          <button
            type="button"
            className="w-full py-2 text-[10px] uppercase tracking-widest border border-[var(--border)] bg-transparent cursor-pointer hover:border-[var(--black)]"
            style={{ fontFamily: "'Space Mono', monospace" }}
            onClick={() => logout()}
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
