import { Link, useLocation, useSearchParams } from 'react-router';
import { useAuth } from '@/app/context/AuthContext';
import { useCategoriesCatalog } from '@/lib/hooks/useCategoriesCatalog';

function chipClass(active: boolean) {
  return `inline-flex border-[1.5px] border-[var(--black)] px-[18px] py-2 whitespace-nowrap transition-all duration-150 no-underline ${
    active ? 'bg-[var(--black)] text-[var(--white)]' : 'bg-transparent hover:bg-[var(--black)] hover:text-[var(--white)] text-[var(--black)]'
  }`;
}

export default function FilterRow() {
  const { token } = useAuth();
  const { categories, loading } = useCategoriesCatalog(token);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const categoryIdParam = searchParams.get('categoryId');
  const onShop = location.pathname === '/shop';
  const allActive = onShop && !categoryIdParam;

  return (
    <div className="py-4 px-5 lg:py-6 lg:px-[60px] border-b-[1.5px] border-[var(--black)] flex gap-3 items-center overflow-x-auto">
      <span
        className="mr-2 text-[var(--mid)] whitespace-nowrap"
        style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}
      >
        Collections:
      </span>
      <Link
        to="/shop"
        className={chipClass(onShop ? allActive : !categoryIdParam)}
        style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
      >
        All
      </Link>
      {loading && !categories.length ? (
        <span className="text-[var(--mid)] text-[10px]" style={{ fontFamily: "'Space Mono', monospace" }}>
          Loading…
        </span>
      ) : null}
      {categories.map((c) => {
        const active = categoryIdParam === String(c.id);
        return (
          <Link
            key={c.id}
            to={`/shop?categoryId=${c.id}`}
            className={chipClass(active)}
            style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            {c.name}
          </Link>
        );
      })}
    </div>
  );
}
