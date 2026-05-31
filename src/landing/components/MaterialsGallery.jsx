import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const COLUMN_1 = [
  { src: '/material_1.png', label: 'Travertine' },
  { src: '/material_2.png', label: 'Aged Brass' },
  { src: '/material_3.png', label: 'Lime Plaster' },
];

const COLUMN_2 = [
  { src: '/material_4.png', label: 'Raw Linen' },
  { src: '/material_5.png', label: 'Blackened Steel' },
  { src: '/material_6.png', label: 'Dark Basalt' },
];

function ParallaxColumn({ items, ySpeed, side }) {
  const colRef = useRef(null);

  useEffect(() => {
    const el = colRef.current;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: ySpeed,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }, el);
    return () => ctx.revert();
  }, [ySpeed]);

  return (
    <div
      ref={colRef}
      className={`flex flex-col gap-6 ${side === 'right' ? 'mt-32' : ''}`}
    >
      {items.map((item, i) => (
        <div key={i} className="group relative overflow-hidden rounded-sm">
          <img
            src={item.src}
            alt={item.label}
            className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Material label on hover */}
          <div className="absolute inset-0 flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-3 h-px accent-gradient" />
              <span className="text-xs text-white/80 uppercase tracking-[0.25em]">{item.label}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MaterialsGallery() {
  const sectionRef = useRef(null);
  const pinnedRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate pinned text in
      gsap.fromTo(
        '.palette-heading',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pinnedRef.current,
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="materials"
      ref={sectionRef}
      className="relative min-h-[250vh] bg-[hsl(var(--bg))]"
    >
      {/* Pinned Center Text */}
      <div
        ref={pinnedRef}
        className="sticky top-0 z-10 h-screen flex flex-col items-center justify-center text-center px-6 pointer-events-none"
      >
        <p className="palette-heading text-xs text-[hsl(var(--muted))] uppercase tracking-[0.35em] mb-4 opacity-0">
          Our Palette
        </p>
        <h2 className="palette-heading font-display text-5xl md:text-7xl text-[hsl(var(--text))] leading-tight opacity-0">
          Material{' '}
          <em className="italic" style={{ color: '#8AAFD4' }}>truth</em>
        </h2>
        <p className="palette-heading mt-6 text-sm text-[hsl(var(--muted))] max-w-xs leading-relaxed opacity-0">
          We select every stone, textile and alloy for honesty.
          What you see is what it is — unmasked, uncoated, enduring.
        </p>
      </div>

      {/* Parallax columns — positioned absolutely over the sticky section */}
      <div className="absolute inset-0 top-0 z-20 pointer-events-none">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute inset-0 flex items-start justify-between px-6 md:px-16 pt-16 max-w-[1400px] mx-auto left-0 right-0">
            {/* Left column */}
            <div className="w-[28vw] max-w-xs pointer-events-auto">
              <ParallaxColumn items={COLUMN_1} ySpeed={-25} side="left" />
            </div>
            {/* Right column */}
            <div className="w-[28vw] max-w-xs pointer-events-auto">
              <ParallaxColumn items={COLUMN_2} ySpeed={15} side="right" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
