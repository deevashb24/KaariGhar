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
      gsap.fromTo('.proc-header > *',
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
        <div className="proc-header flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-20">
          <div>
            <p className="eyebrow mb-5 opacity-0">How We Work</p>
            <h2 className="display-xl opacity-0" style={{ color: 'hsl(var(--text))' }}>
              The Process<br />
              <em style={{ color: 'var(--grad-a)' }}>Behind</em> the Space
            </h2>
          </div>
          <p className="body-lg max-w-xs pb-1 opacity-0">
            Four deliberate phases. No shortcuts. No compromises.
          </p>
        </div>

        {/* Cards */}
        <div className="proc-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ background: 'hsl(var(--stroke))' }}
        >
          {STEPS.map((s, i) => (
            <div
              key={s.no}
              className="proc-card group flex flex-col p-10 opacity-0
                transition-colors duration-300 cursor-default"
              style={{ background: 'hsl(var(--bg))' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'hsl(var(--surface))'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'hsl(var(--bg))'; }}
              data-cursor-hover
            >
              {/* Phase tag */}
              <div className="flex items-center gap-3 mb-12">
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.3em]"
                  style={{ color: 'hsl(var(--faint))' }}
                >
                  {s.no}
                </span>
                <div className="flex-1 h-px" style={{ background: 'hsl(var(--stroke))' }} />
                <span className="eyebrow" style={{ color: 'hsl(var(--faint))' }}>
                  {s.phase}
                </span>
              </div>

              {/* Heading */}
              <h3
                className="display-lg mb-6 whitespace-pre-line"
                style={{ color: 'hsl(var(--text))' }}
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
