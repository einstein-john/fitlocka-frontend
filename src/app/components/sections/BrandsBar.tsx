export default function BrandsBar() {
  const brands = ['NBA', 'NFL', 'NHL', 'MLB', 'SOCCER', 'COLLEGE', 'RUGBY', 'MOTORSPORT'];

  return (
    <div className="py-5 px-5 gap-8 lg:py-7 lg:px-[60px] lg:gap-12 border-b-[1.5px] border-[var(--black)] flex items-center overflow-x-auto">
      <span
        className="text-[var(--mid)] whitespace-nowrap flex-shrink-0"
        style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}
      >
        Featured In
      </span>
      {brands.map((brand) => (
        <span
          key={brand}
          className="text-[var(--mid)] whitespace-nowrap transition-colors duration-200 cursor-pointer hover:text-[var(--black)]"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '0.15em' }}
        >
          {brand}
        </span>
      ))}
    </div>
  );
}
