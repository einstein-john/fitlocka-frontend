export default function Newsletter() {
  return (
    <section className="py-20 px-[60px] border-b-[1.5px] border-[var(--black)] flex justify-between items-center gap-[60px]">
      <div className="max-w-[480px]">
        <div className="mb-3 text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Stay in the loop
        </div>
        <div className="mb-3 leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '52px' }}>
          FIRST TO<br />THE DROP.
        </div>
        <p className="text-[14px] text-[var(--mid)] leading-[1.7]">
          New arrivals, limited restocks, and exclusive access. No spam — just the good stuff.
        </p>
      </div>
      <div className="flex flex-1 max-w-[480px] border-[1.5px] border-[var(--black)]">
        <input
          type="email"
          placeholder="your@email.com"
          className="flex-1 border-none bg-transparent px-5 py-4 text-[14px] outline-none"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />
        <button
          className="bg-[var(--black)] text-[var(--white)] border-none border-l-[1.5px] border-l-[var(--black)] px-7 py-4 cursor-pointer transition-colors duration-200 hover:bg-[var(--accent)]"
          style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}
        >
          Subscribe
        </button>
      </div>
    </section>
  );
}
