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

const QUOTE_WORDS = 'A space should outlive its architect, outlast its owners, and reveal new dimensions to every generation that inhabits it.'.split(' ');

export default function Manifesto() {
  const sectionRef = useRef(null);
  const quoteRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Header stagger
      gsap.fromTo('.manifesto-hdr > *',
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0,
          stagger: 0.13, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.manifesto-hdr', start: 'top 78%' },
        }
      );

      // Pillar cards stagger
      gsap.fromTo('.pillar-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          stagger: 0.1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.pillars-grid', start: 'top 75%' },
        }
      );

      // Quote: scrub word opacity
      const words = quoteRef.current?.querySelectorAll('.q-word');
      if (words?.length) {
        gsap.fromTo(words,
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: {
              trigger: quoteRef.current,
              start: 'top 78%',
              end:   'bottom 45%',
              scrub: 0.9,
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      style={{
        background: 'hsl(var(--bg))',
        paddingTop: 'var(--section-y)',
        paddingBottom: 'var(--section-y)',
        overflow: 'hidden',
      }}
    >
      <div className="container">

        {/* ── Section header ── */}
        <div
          className="manifesto-hdr"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            marginBottom: '5rem',
          }}
        >
          <p className="eyebrow" style={{ opacity: 0 }}>Our Philosophy</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <h2 className="display-xl" style={{ opacity: 0, color: 'hsl(var(--text))' }}>
              The Four <em style={{ color: 'var(--grad-a)' }}>Tenets</em>
            </h2>
            <p className="body-lg" style={{ opacity: 0, maxWidth: '44ch' }}>
              Not rules — convictions. Each one forged over a decade of honest
              engagement with space, material, and the people who inhabit both.
            </p>
          </div>
        </div>

        {/* ── Pillars grid ── */}
        <div
          className="pillars-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
            gap: '1px',
            background: 'hsl(var(--stroke))',
            marginBottom: '8rem',
          }}
        >
          {PILLARS.map((p) => (
            <div
              key={p.no}
              className="pillar-card"
              style={{
                opacity: 0,
                background: 'hsl(var(--bg))',
                padding: 'clamp(2rem, 4vw, 3.5rem)',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                cursor: 'default',
                transition: 'background 0.3s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'hsl(var(--surface))'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'hsl(var(--bg))'; }}
              data-cursor-hover
            >
              {/* Number */}
              <span
                style={{
                  fontFamily: 'Instrument Serif, serif',
                  fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                  fontStyle: 'italic',
                  lineHeight: 1,
                  color: 'hsl(var(--stroke))',
                  display: 'block',
                  marginBottom: '2.5rem',
                  transition: 'color 0.3s',
                }}
              >
                {p.no}
              </span>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  color: 'hsl(var(--text))',
                  marginBottom: '1.25rem',
                }}
              >
                {p.title}
              </h3>

              {/* Description */}
              <p className="body-lg" style={{ maxWidth: '32ch' }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── Scroll-reveal quote block ── */}
        <div
          ref={quoteRef}
          style={{
            maxWidth: '52rem',
            margin: '0 auto',
            textAlign: 'center',
            padding: '2rem 0',
          }}
        >
          {/* Top fade line */}
          <div style={{ width: '1px', height: '80px', background: 'linear-gradient(to bottom, hsl(var(--stroke)), transparent)', margin: '0 auto 3rem' }} />

          <blockquote
            className="display-lg"
            style={{
              color: 'hsl(var(--text))',
              lineHeight: 1.5,
              marginBottom: '2.5rem',
            }}
          >
            {QUOTE_WORDS.map((w, i) => (
              <span
                key={i}
                className="q-word"
                style={{
                  display: 'inline-block',
                  marginRight: '0.32em',      /* ← inline style: no Tailwind arbitrary needed */
                  marginBottom: '0.12em',
                }}
              >
                {w}
              </span>
            ))}
          </blockquote>

          <cite
            className="eyebrow"
            style={{
              color: 'hsl(var(--faint))',
              fontStyle: 'normal',
              display: 'block',
              marginBottom: '3rem',
            }}
          >
            — KaariGhar Design Manifesto, 2024
          </cite>

          {/* Bottom fade line */}
          <div style={{ width: '1px', height: '80px', background: 'linear-gradient(to top, hsl(var(--stroke)), transparent)', margin: '0 auto' }} />
        </div>

      </div>
    </section>
  );
}
