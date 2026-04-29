export default function Ticker() {
  const items = [
    'FREE SHIPPING ON ORDERS OVER $150',
    '★',
    'AUTHENTIC RETRO JERSEYS',
    '★',
    'EST. 2018',
    '★',
    'WORLDWIDE DELIVERY',
    '★',
    'LIMITED EDITION DROPS',
    '★',
  ];

  return (
    <div className="bg-[var(--black)] text-[var(--white)] overflow-hidden whitespace-nowrap py-2.5" style={{ fontFamily: "'Space Mono', monospace" }}>
      <div className="inline-block animate-ticker">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-12 text-[11px] tracking-[0.08em]">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
