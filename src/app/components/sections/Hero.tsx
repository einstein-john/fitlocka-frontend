import { Link } from 'react-router';

export default function Hero() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[calc(100vh-110px)] border-b-[1.5px] border-[var(--black)]">
      <div className="px-5 pt-10 pb-8 lg:px-[60px] lg:pt-20 lg:pb-[60px] flex flex-col justify-between border-b-[1.5px] lg:border-b-0 lg:border-r-[1.5px] border-[var(--black)]">
        <div>
          <div
            className="inline-block py-1.5 px-3.5 w-fit mb-8 text-[var(--mid)] border border-[var(--border)]"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}
          >
            New Drop — Summer '24
          </div>
          <div
            className="flex-1 flex flex-col justify-center animate-fadeUp"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(56px, 10vw, 148px)', lineHeight: '0.92', letterSpacing: '-0.01em' }}
          >
            THE<br />
            <em className="not-italic text-[var(--accent)]">CLASSICS</em><br />
            LIVE ON.
          </div>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 lg:gap-6 sm:items-center animate-fadeUp" style={{ animationDelay: '0.15s' }}>
          <Link
            to="/shop"
            className="no-underline bg-[var(--black)] text-[var(--white)] border-none px-9 py-4 cursor-pointer transition-all duration-200 hover:bg-[var(--accent)] hover:-translate-y-0.5"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
          >
            Shop Now
          </Link>
          <Link
            to="/collections"
            className="no-underline bg-transparent text-[var(--black)] border-[1.5px] border-[var(--black)] px-8 py-[15px] cursor-pointer transition-all duration-200 hover:bg-[var(--black)] hover:text-[var(--white)]"
            style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
          >
            View Collection
          </Link>
        </div>
      </div>

      <div className="bg-[var(--cream)] relative overflow-hidden flex items-center justify-center min-h-[320px]">
        <div
          className="absolute pointer-events-none z-[1]"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '300px', color: 'rgba(0,0,0,0.04)', whiteSpace: 'nowrap', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-15deg)' }}
        >
          23
        </div>
        <div className="absolute top-10 right-10 bg-[var(--accent)] text-[var(--white)] w-[90px] h-[90px] rounded-full flex flex-col items-center justify-center text-center leading-[1.2] z-[5]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '13px', letterSpacing: '0.1em' }}>
          NEW<br />DROP<br />2024
        </div>
        <div className="relative z-[2]">
          <div className="w-[340px] h-[420px] bg-[var(--accent2)] relative flex items-center justify-center shadow-[8px_12px_40px_rgba(0,0,0,0.18)]" style={{ clipPath: 'polygon(18% 0%, 82% 0%, 100% 12%, 100% 100%, 0% 100%, 0% 12%)' }}>
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[var(--accent)]" />
            <div className="absolute text-[140px] text-white/[0.12]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              23
            </div>
            <div className="absolute bottom-20 text-[var(--white)]" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '0.15em' }}>
              FITLOCKA
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-10 flex gap-8" style={{ fontFamily: "'Space Mono', monospace" }}>
          <div>
            <span className="block text-[22px] font-bold text-[var(--black)]">500+</span>
            <span className="text-[10px] text-[var(--mid)] tracking-[0.1em]">Jerseys</span>
          </div>
          <div>
            <span className="block text-[22px] font-bold text-[var(--black)]">80s–00s</span>
            <span className="text-[10px] text-[var(--mid)] tracking-[0.1em]">Eras</span>
          </div>
          <div>
            <span className="block text-[22px] font-bold text-[var(--black)]">12+</span>
            <span className="text-[10px] text-[var(--mid)] tracking-[0.1em]">Sports</span>
          </div>
        </div>
      </div>
    </section>
  );
}
