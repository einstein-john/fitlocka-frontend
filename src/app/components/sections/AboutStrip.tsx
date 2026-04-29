export default function AboutStrip() {
  return (
    <section className="py-[100px] px-[60px] grid grid-cols-2 gap-20 items-center border-b-[1.5px] border-[var(--black)] bg-[var(--cream)]">
      <div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '80px', lineHeight: '0.95', letterSpacing: '0.01em' }}>
          LOCKED IN.<br />
          LOCKED <em className="not-italic text-[var(--accent)]">DOWN.</em>
        </div>
        <div className="grid grid-cols-2 gap-6 mt-10">
          <div>
            <div className="text-[var(--accent)] leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px' }}>
              500+
            </div>
            <div className="mt-1 text-[var(--mid)] text-[12px] tracking-[0.05em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Authentic jerseys in stock
            </div>
          </div>
          <div>
            <div className="text-[var(--accent)] leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px' }}>
              12K+
            </div>
            <div className="mt-1 text-[var(--mid)] text-[12px] tracking-[0.05em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Happy customers worldwide
            </div>
          </div>
          <div>
            <div className="text-[var(--accent)] leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px' }}>
              40+
            </div>
            <div className="mt-1 text-[var(--mid)] text-[12px] tracking-[0.05em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Years of sporting history
            </div>
          </div>
          <div>
            <div className="text-[var(--accent)] leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px' }}>
              100%
            </div>
            <div className="mt-1 text-[var(--mid)] text-[12px] tracking-[0.05em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Authenticity guaranteed
            </div>
          </div>
        </div>
      </div>
      <div>
        <p className="text-[15px] leading-[1.8] text-[#3a3630] mb-8">
          FITLOCKA. is where sporting heritage meets streetwear culture. We source and curate authentic retro jerseys from every era, every sport, every legend. Each piece is verified, graded, and ready to wear — or frame.
        </p>
        <p className="text-[15px] leading-[1.8] text-[#3a3630] mb-8">
          From the hardwood floors of the 90s NBA to the green fields of European football's golden era, we've got the threads that tell the story.
        </p>
        <button
          className="bg-[var(--black)] text-[var(--white)] border-none px-9 py-4 cursor-pointer transition-all duration-200 hover:bg-[var(--accent)] hover:-translate-y-0.5"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
        >
          Our Story
        </button>
      </div>
    </section>
  );
}
