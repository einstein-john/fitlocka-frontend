export default function PromoSplit() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 border-b-[1.5px] border-[var(--black)]">
      <div className="px-5 py-14 lg:px-[60px] lg:py-20 relative overflow-hidden min-h-[360px] lg:min-h-[460px] flex flex-col justify-end bg-[var(--black)] text-[var(--white)] border-b-[1.5px] lg:border-b-0 lg:border-r-[1.5px] border-[var(--black)]">
        <div
          className="absolute -top-5 -right-2.5 opacity-[0.08] leading-none pointer-events-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '260px' }}
        >
          90s
        </div>
        <div className="mb-3.5 opacity-60" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          The Era Collection
        </div>
        <div className="mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '64px', lineHeight: '0.95', letterSpacing: '0.02em' }}>
          THE 90s<br />VAULT
        </div>
        <button
          className="bg-[var(--white)] text-[var(--black)] border-none px-8 py-3.5 cursor-pointer inline-block transition-opacity duration-200 w-fit hover:opacity-85"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
        >
          Shop The 90s
        </button>
      </div>

      <div className="px-5 py-14 lg:px-[60px] lg:py-20 relative overflow-hidden min-h-[360px] lg:min-h-[460px] flex flex-col justify-end bg-[var(--accent)] text-[var(--white)]">
        <div
          className="absolute -top-5 -right-2.5 opacity-[0.08] leading-none pointer-events-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '260px' }}
        >
          ★
        </div>
        <div className="mb-3.5 opacity-60" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Limited Supply
        </div>
        <div className="mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '64px', lineHeight: '0.95', letterSpacing: '0.02em' }}>
          GAME<br />WORN<br />GRAILS
        </div>
        <button
          className="bg-[var(--white)] text-[var(--black)] border-none px-8 py-3.5 cursor-pointer inline-block transition-opacity duration-200 w-fit hover:opacity-85"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
        >
          View Grails
        </button>
      </div>
    </div>
  );
}
