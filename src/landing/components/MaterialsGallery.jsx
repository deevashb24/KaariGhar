import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MATERIALS = [
  { src: '/material_1.png', name: 'Travertine',       origin: 'Rajasthan Quarries' },
  { src: '/material_2.png', name: 'Aged Brass',        origin: 'Moradabad Foundries' },
  { src: '/material_3.png', name: 'Lime Plaster',      origin: 'Jaisalmer Tradition' },
  { src: '/material_4.png', name: 'Raw Linen',         origin: 'Kutch Weavers' },
  { src: '/material_5.png', name: 'Blackened Steel',   origin: 'Howrah Forge' },
  { src: '/material_6.png', name: 'Dark Basalt',       origin: 'Deccan Plateau' },
];

export default function MaterialsGallery() {
  const sectionRef  = useRef(null);
  const pinnedRef   = useRef(null);
  const colLeftRef  = useRef(null);
  const colRightRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pinned heading reveal
      gsap.fromTo(pinnedRef.current.querySelectorAll('.pin-reveal'),
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 1, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: {
            trigger: pinnedRef.current,
            start: 'top 65%',
          },
        }
      );

      // Left column scrolls up faster (pull-up)
      gsap.to(colLeftRef.current, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end:   'bottom top',
          scrub: 1.8,
        },
      });

      // Right column scrolls down slower (push-down)
      gsap.to(colRightRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end:   'bottom top',
          scrub: 1.8,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const left  = MATERIALS.slice(0, 3);
  const right = MATERIALS.slice(3, 6);

  return (
    <section
      id="materials"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        minHeight: '160vh',
        background: 'hsl(var(--bg))',
      }}
    >
      {/* ── Sticky pinned center text ── */}
      <div
        ref={pinnedRef}
        className="sticky top-0 h-screen flex flex-col items-center justify-center text-center px-6 z-10 pointer-events-none"
      >
        <p className="pin-reveal eyebrow mb-6 opacity-0">Our Palette</p>
        <h2
          className="pin-reveal display-xl mb-8 opacity-0"
          style={{ color: 'hsl(var(--text))' }}
        >
          Material{' '}
          <em style={{ color: 'var(--grad-a)' }}>truth</em>
        </h2>
        <p className="pin-reveal body-lg max-w-sm opacity-0">
          We select every stone, textile and alloy for honesty — what you see
          is what it is, unmasked, uncoated, enduring.
        </p>

        {/* Decorative ring */}
        <div
          className="pin-reveal absolute inset-0 m-auto opacity-0 pointer-events-none"
          style={{
            width: '500px', height: '500px',
            maxWidth: '80vw', maxHeight: '80vw',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.04)',
            zIndex: -1,
          }}
        />
        <div
          className="pin-reveal absolute inset-0 m-auto opacity-0 pointer-events-none"
          style={{
            width: '700px', height: '700px',
            maxWidth: '100vw', maxHeight: '100vw',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.03)',
            zIndex: -1,
          }}
        />
      </div>

      {/* ── Parallax image columns ── */}
      <div className="absolute inset-0 flex items-start justify-between px-6 md:px-16 pt-20 pointer-events-none z-20">
        <div className="w-[27vw] max-w-[320px]" style={{ pointerEvents: 'auto' }}>
          <div ref={colLeftRef} className="flex flex-col gap-6 mt-[10vh]">
            {left.map((m, i) => (
              <MaterialCard key={i} m={m} />
            ))}
          </div>
        </div>

        <div className="w-[27vw] max-w-[320px]" style={{ pointerEvents: 'auto' }}>
          <div ref={colRightRef} className="flex flex-col gap-6 mt-[40vh]">
            {right.map((m, i) => (
              <MaterialCard key={i} m={m} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MaterialCard({ m }) {
  return (
    <div className="group relative img-zoom cursor-default" data-cursor-hover>
      <img
        src={m.src}
        alt={m.name}
        className="w-full aspect-[3/4] object-cover rounded-sm"
        loading="lazy"
      />
      {/* Hover label */}
      <div
        className="absolute inset-x-0 bottom-0 p-5
          translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0
          transition-all duration-400 ease-out"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-0.5"
          style={{ color: 'hsl(var(--text))' }}
        >
          {m.name}
        </p>
        <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {m.origin}
        </p>
      </div>
    </div>
  );
}
