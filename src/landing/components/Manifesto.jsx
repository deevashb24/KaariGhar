import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    no: '01',
    title: 'Material Honesty',
    desc: 'We never clad, never fake. Every surface you touch is what it claims — limestone, timber, iron — present in its full, unmediated character.',
  },
  {
    no: '02',
    title: 'Slow Architecture',
    desc: 'Our spaces are conceived to be inhabited across generations. Designed with the same patience as the forests that grew the wood we select.',
  },
  {
    no: '03',
    title: 'The Artisan Alliance',
    desc: 'Every project partners with master craftspeople whose knowledge lives in the hands — weavers, stone-cutters, plaster workers.',
  },
  {
    no: '04',
    title: 'Light as Architecture',
    desc: 'We design not just the room but how daylight moves through it across all seasons. Shadow is the counterpart that gives meaning to illumination.',
  },
];

export default function Manifesto() {
  const sectionRef = useRef(null);
  const quoteRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
      gsap.fromTo('.manifesto-header > *',
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0,
          stagger: 0.12, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.manifesto-header', start: 'top 78%' },
        }
      );

      // Pillars
      gsap.fromTo('.pillar',
        { opacity: 0, y: 48 },
        {
          opacity: 1, y: 0,
          stagger: 0.1, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: '.pillars-grid', start: 'top 75%' },
        }
      );

      // Quote word-by-word reveal (split by spaces)
      const words = quoteRef.current?.querySelectorAll('.word');
      if (words?.length) {
        gsap.fromTo(words,
          { opacity: 0.15 },
          {
            opacity: 1,
            stagger: 0.04,
            ease: 'none',
            scrollTrigger: {
              trigger: quoteRef.current,
              start: 'top 75%',
              end:   'bottom 50%',
              scrub: 0.8,
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Split quote into word spans for scrubbed reveal
  const QUOTE = "A space should outlive its architect, outlast its owners, and reveal new dimensions to every generation that inhabits it.";
  const words = QUOTE.split(' ');

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="section-pad overflow-hidden"
      style={{ background: 'hsl(var(--bg))' }}
    >
      <div className="container">

        {/* ── Section header ── */}
        <div className="manifesto-header flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-24">
          <div>
            <p className="eyebrow mb-5 opacity-0">Our Philosophy</p>
            <h2 className="display-xl opacity-0" style={{ color: 'hsl(var(--text))' }}>
              The Four<br />
              <em style={{ color: 'var(--grad-a)' }}>Tenets</em>
            </h2>
          </div>
          <p className="body-lg max-w-xs pb-1 opacity-0">
            Not rules but convictions. Each one forged over a decade of
            honest engagement with space and material.
          </p>
        </div>

        {/* ── Pillars grid ── */}
        <div
          className="pillars-grid grid grid-cols-1 md:grid-cols-2 gap-px mb-32"
          style={{ background: 'hsl(var(--stroke))' }}
        >
          {PILLARS.map((p) => (
            <div
              key={p.no}
              className="pillar group flex gap-8 p-10 xl:p-14 opacity-0
                transition-colors duration-300 cursor-default"
              style={{ background: 'hsl(var(--bg))' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'hsl(var(--surface))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'hsl(var(--bg))';
              }}
              data-cursor-hover
            >
              {/* Number */}
              <span
                className="shrink-0 mt-0.5 transition-colors duration-300"
                style={{
                  fontFamily: 'Instrument Serif, serif',
                  fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                  fontStyle: 'italic',
                  lineHeight: 1,
                  color: 'hsl(var(--stroke))',
                }}
                data-no={p.no}
              >
                {p.no}
              </span>

              <div>
                <h3
                  className="text-sm font-semibold uppercase tracking-[0.18em] mb-4
                    transition-colors duration-300"
                  style={{ color: 'hsl(var(--text))' }}
                >
                  {p.title}
                </h3>
                <p className="body-lg" style={{ maxWidth: '30ch' }}>
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Scroll-reveal quote ── */}
        <div
          ref={quoteRef}
          className="max-w-4xl mx-auto text-center py-8"
        >
          <div
            className="mb-8 mx-auto"
            style={{
              width: '1px', height: '60px',
              background: 'linear-gradient(to bottom, hsl(var(--stroke)), transparent)',
            }}
          />
          <blockquote
            className="display-lg mb-8 leading-relaxed"
            style={{ color: 'hsl(var(--text))', maxWidth: '34ch', margin: '0 auto 2rem' }}
          >
            {words.map((w, i) => (
              <span key={i} className="word inline-block mr-[0.35em]">
                {w}
              </span>
            ))}
          </blockquote>
          <cite className="eyebrow not-italic" style={{ color: 'hsl(var(--faint))' }}>
            — KaariGhar Design Manifesto, 2024
          </cite>
          <div
            className="mt-8 mx-auto"
            style={{
              width: '1px', height: '60px',
              background: 'linear-gradient(to top, hsl(var(--stroke)), transparent)',
            }}
          />
        </div>

      </div>
    </section>
  );
}
