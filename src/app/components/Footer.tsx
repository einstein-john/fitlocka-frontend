import { Link } from 'react-router';
import { useAuth } from '@/app/context/AuthContext';
import { useCategoriesCatalog } from '@/lib/hooks/useCategoriesCatalog';

export default function Footer() {
  const { token } = useAuth();
  const { categories } = useCategoriesCatalog(token);

  return (
    <footer className="bg-[var(--black)] text-[var(--white)] px-5 pt-10 pb-20 lg:px-[60px] lg:pt-[60px] lg:pb-8">
      <div className="grid grid-cols-1 gap-8 mb-10 pb-8 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-[60px] lg:mb-[60px] lg:pb-12 border-b border-white/10">
        <div>
          <div className="mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '40px', letterSpacing: '0.05em' }}>
            FITL<span className="text-[var(--accent)]">O</span>CKA.
          </div>
          <p className="text-[13px] leading-[1.8] text-white/50 max-w-[260px]">
            Authentic retro jerseys from the eras that defined sport. Sourced globally, delivered worldwide.
          </p>
        </div>

        <div>
          <div className="mb-5 text-white/40" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Shop
          </div>
          <ul className="list-none flex flex-col gap-3">
            {['Basketball', 'Football', 'Soccer', 'Hockey', 'Baseball'].map((sport) => (
              <li key={sport}>
                <a href="#" className="no-underline text-white/70 text-[13px] transition-colors duration-200 hover:text-white">
                  {sport}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-5 text-white/40" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Collections
          </div>
          <ul className="list-none flex flex-col gap-3">
            <li>
              <Link to="/collections" className="no-underline text-white/70 text-[13px] transition-colors duration-200 hover:text-white">
                All collections
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/shop?categoryId=${c.id}`}
                  className="no-underline text-white/70 text-[13px] transition-colors duration-200 hover:text-white"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-5 text-white/40" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Info
          </div>
          <ul className="list-none flex flex-col gap-3">
            <li>
              <Link to="/about" className="no-underline text-white/70 text-[13px] transition-colors duration-200 hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/sitemap" className="no-underline text-white/70 text-[13px] transition-colors duration-200 hover:text-white">
                Sitemap
              </Link>
            </li>
            <li>
              <Link to="/authenticity" className="no-underline text-white/70 text-[13px] transition-colors duration-200 hover:text-white">
                Authenticity
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="no-underline text-white/70 text-[13px] transition-colors duration-200 hover:text-white">
                Shipping
              </Link>
            </li>
            <li>
              <Link to="/returns" className="no-underline text-white/70 text-[13px] transition-colors duration-200 hover:text-white">
                Returns
              </Link>
            </li>
            <li>
              <a href="#" className="no-underline text-white/70 text-[13px] transition-colors duration-200 hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-2 lg:flex-row lg:justify-between lg:items-center text-white/30 text-[10px] tracking-[0.08em]" style={{ fontFamily: "'Space Mono', monospace" }}>
        <span>© 2024 FITLOCKA. All rights reserved.</span>
        <span>Designed with ❤ for the culture</span>
      </div>
    </footer>
  );
}
