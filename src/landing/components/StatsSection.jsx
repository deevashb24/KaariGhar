import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 140,  suffix: '+', label: 'Projects Completed',  sub: 'Across India & SE Asia' },
  { value: 12,   suffix: '',  label: 'Years of Practice',    sub: 'Est. 2012 in New Delhi' },
  { value: 38,   suffix: '',  label: 'Master Craftspeople',  sub: 'Collaborating artisans' },
  { value: 100,  suffix: '%', label: 'Material Honesty',     sub: 'No cladding. No concealment.' },
];

function Counter({ target, suffix }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      onEnter: () => {
        if (started.current) return;
        started.current = true;
        gsap.to({ v: 0 }, {
          v: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate() { setVal(Math.round(this.targets()[0].v)); },
        });
      },
    });
    return () => st.kill();
  }, [target]);

  return (
    <span ref={ref} className="stat-number">
      {val}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.stat-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 75%',
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="section-pad"
      style={{ background: 'hsl(var(--bg))' }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '5rem' }}>
          <div>
            <p className="eyebrow mb-5">The Numbers</p>
            <h2 className="display-xl" style={{ color: 'hsl(var(--text))' }}>
              A Decade of<br />
              <em style={{ color: 'var(--grad-a)' }}>Deliberate</em> Work
            </h2>
          </div>
          <p className="body-lg max-w-xs pb-1">
            Every figure here represents a decision made with full intention —
            never expedience, always excellence.
          </p>
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: '1px',
            background: 'hsl(var(--stroke))',
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              className="stat-card"
              style={{
                opacity: 0,
                background: 'hsl(var(--bg))',
                padding: 'clamp(2.5rem, 4vw, 3.5rem)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '240px',
              }}
            >
              <div style={{ marginBottom: '3rem' }}>
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'hsl(var(--text))' }}>
                  {s.label}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'hsl(var(--faint))', letterSpacing: '0.05em' }}>
                  {s.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
