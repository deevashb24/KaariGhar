import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    no: '01',
    phase: 'Discovery',
    heading: 'Listen\nbefore we draw',
    body: 'Every project begins with a deep listening — understanding how you move, what you treasure, which light you love. We spend weeks before a line is drawn.',
  },
  {
    no: '02',
    phase: 'Concept',
    heading: 'Vision\nfound in material',
    body: 'We select materials before spaces are finalised. The stone, the timber, the textile — they precede the plan and guide every proportion that follows.',
  },
  {
    no: '03',
    phase: 'Craft',
    heading: 'Made by\nhuman hands',
    body: 'Our network of master artisans translates each drawing into something alive. No factory finish. Every surface carries the mark of its making.',
  },
  {
    no: '04',
    phase: 'Inhabitation',
    heading: 'Handed over,\nnever abandoned',
    body: 'We remain present long after handover. Spaces evolve with their inhabitants — and we continue to consult, refine, and advise as your life changes.',
  },
];

export default function ProcessSection() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.proc-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          stagger: 0.14, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.proc-grid', start: 'top 75%' },
        }
      );
      gsap.fromTo('.proc-header .reveal-target',
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0,
          stagger: 0.1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.proc-header', start: 'top 80%' },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="journal"
      ref={ref}
      className="section-pad border-t"
      style={{ background: 'hsl(var(--bg))', borderColor: 'hsl(var(--stroke))' }}
    >
      <div className="container">

        {/* Header */}
        <div className="proc-header" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '5rem' }}>
          <div>
            <p className="eyebrow-accent mb-5 reveal-target" style={{ opacity: 0 }}>How We Work</p>
            <h2 className="display-xl reveal-target" style={{ opacity: 0, color: 'hsl(var(--text))' }}>
              The Process<br />
              <em style={{ color: 'var(--grad-a)' }}>Behind</em> the Space
            </h2>
          </div>
          <p className="body-lg reveal-target" style={{ opacity: 0, maxWidth: '44ch' }}>
            Four deliberate phases. No shortcuts. No compromises.
          </p>
        </div>

        {/* Cards */}
        <div
          className="proc-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: '1px',
            background: 'hsl(var(--stroke))',
          }}
        >
          {STEPS.map((s) => (
            <div
              key={s.no}
              className="proc-card group"
              style={{
                opacity: 0,
                background: 'hsl(var(--bg))',
                padding: 'clamp(3rem, 5vw, 4rem)',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'default',
                transition: 'background 0.3s',
                minHeight: '400px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'hsl(var(--surface))'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'hsl(var(--bg))'; }}
              data-cursor-hover
            >
              {/* Phase tag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
                <span
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.3em',
                    color: 'hsl(var(--faint))',
                  }}
                >
                  {s.no}
                </span>
                <div style={{ flex: 1, height: '1px', background: 'hsl(var(--stroke))' }} />
                <span className="eyebrow" style={{ color: 'hsl(var(--faint))' }}>
                  {s.phase}
                </span>
              </div>

              {/* Heading */}
              <h3
                className="display-lg"
                style={{ color: 'hsl(var(--text))', whiteSpace: 'pre-line', marginBottom: '2.5rem' }}
              >
                {s.heading}
              </h3>

              {/* Body */}
              <p className="body-lg mt-auto text-sm" style={{ fontSize: '0.875rem' }}>
                {s.body}
              </p>

              {/* Hover accent line */}
              <div
                className="mt-10 h-px transition-all duration-500 accent-gradient origin-left"
                style={{
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                }}
                ref={(el) => {
                  if (!el) return;
                  const card = el.parentElement;
                  card.addEventListener('mouseenter', () => { el.style.transform = 'scaleX(1)'; });
                  card.addEventListener('mouseleave', () => { el.style.transform = 'scaleX(0)'; });
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
