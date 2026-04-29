import SeoHead, { defaultJsonLdOrganization } from '@/app/components/SeoHead';

export default function About() {
  return (
    <>
      <SeoHead
        title="About — FITLOCKA"
        description="Where sporting heritage meets streetwear culture. Authenticity, curation, and the stories behind every jersey."
        canonicalPath="/about"
        jsonLd={defaultJsonLdOrganization()}
      />
      <section className="min-h-screen">
      <div className="py-[120px] px-[60px] border-b-[1.5px] border-[var(--black)] bg-[var(--cream)]">
        <div className="max-w-[900px] mx-auto text-center">
          <div className="mb-4 text-[var(--mid)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Est. 2018
          </div>
          <div className="mb-10" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(64px, 8vw, 108px)', lineHeight: '0.95', letterSpacing: '0.01em' }}>
            WHERE SPORTING<br />
            HERITAGE MEETS<br />
            <span className="text-[var(--accent)]">STREETWEAR CULTURE</span>
          </div>
          <p className="text-[17px] leading-[1.9] text-[#3a3630] max-w-[720px] mx-auto">
            FITLOCKA. was born from a passion for authentic sports memorabilia and the culture that surrounds it. We're not just selling jerseys—we're preserving pieces of sporting history.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 border-b-[1.5px] border-[var(--black)]">
        <div className="px-[60px] py-20 border-r-[1.5px] border-[var(--black)]">
          <div className="mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', letterSpacing: '0.02em' }}>
            OUR MISSION
          </div>
          <p className="text-[15px] leading-[1.8] text-[#3a3630] mb-5">
            To source, authenticate, and deliver the most iconic retro sports jerseys from across the globe. Every piece tells a story—a championship moment, a career-defining game, an era that shaped the sports we love.
          </p>
          <p className="text-[15px] leading-[1.8] text-[#3a3630]">
            We work with collectors, vintage dealers, and authentication experts to ensure every jersey meets our strict standards for quality and authenticity.
          </p>
        </div>

        <div className="px-[60px] py-20">
          <div className="mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', letterSpacing: '0.02em' }}>
            WHY RETRO
          </div>
          <p className="text-[15px] leading-[1.8] text-[#3a3630] mb-5">
            There's something special about vintage sports apparel. The bold designs, the authentic stitching, the history woven into every thread. Modern replicas just don't capture that magic.
          </p>
          <p className="text-[15px] leading-[1.8] text-[#3a3630]">
            Whether you're a die-hard collector, a fashion enthusiast, or someone who wants to rep their favorite player from back in the day—we've got you covered.
          </p>
        </div>
      </div>

      <div className="py-20 px-[60px] bg-[var(--black)] text-[var(--white)]">
        <div className="text-center max-w-[900px] mx-auto">
          <div className="mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '64px', letterSpacing: '0.02em', lineHeight: '1' }}>
            BY THE NUMBERS
          </div>
          <div className="grid grid-cols-4 gap-10 mt-12">
            <div>
              <div className="text-[var(--accent)] leading-none mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '56px' }}>
                500+
              </div>
              <div className="text-white/60 text-[13px] tracking-[0.05em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Jerseys in Stock
              </div>
            </div>
            <div>
              <div className="text-[var(--accent)] leading-none mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '56px' }}>
                12K+
              </div>
              <div className="text-white/60 text-[13px] tracking-[0.05em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Happy Customers
              </div>
            </div>
            <div>
              <div className="text-[var(--accent)] leading-none mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '56px' }}>
                40+
              </div>
              <div className="text-white/60 text-[13px] tracking-[0.05em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Years of History
              </div>
            </div>
            <div>
              <div className="text-[var(--accent)] leading-none mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '56px' }}>
                100%
              </div>
              <div className="text-white/60 text-[13px] tracking-[0.05em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Authenticated
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
