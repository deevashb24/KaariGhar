import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    number: '01',
    title: 'Material Honesty',
    description:
      'We never clad, never fake, never obscure. Every surface you touch is what it claims to be — limestone, timber, hand-cast iron — present in its full, unmediated character.',
  },
  {
    number: '02',
    title: 'Slow Architecture',
    description:
      'We reject the disposable. Our spaces are conceived to be inhabited across generations — designed with the same patience as the forests that grew the wood we select.',
  },
  {
    number: '03',
    title: 'The Artisan Alliance',
    description:
      'Every project partners with master craftspeople — weavers, stone-cutters, plaster workers — whose knowledge lives in the hands. We are translators of ancient skills for contemporary lives.',
  },
  {
    number: '04',
    title: 'Light as Architecture',
    description:
      'We design not just the room but how daylight will move through it across all seasons. Shadow is not absence — it is the counterpart that gives meaning to illumination.',
  },
];

export default function Manifesto() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pillar-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="bg-[hsl(var(--bg))] py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="mb-16 max-w-xl">
          <p className="text-xs text-[hsl(var(--muted))] uppercase tracking-[0.35em] mb-4">
            Our Philosophy
          </p>
          <h2 className="font-display italic text-4xl md:text-5xl text-[hsl(var(--text))] leading-tight">
            The Four Tenets
          </h2>
        </div>

        {/* Pillar cards — horizontal scroll on mobile, grid on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-[hsl(var(--stroke))]">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.number}
              className="pillar-card group flex items-start gap-6 p-8 md:p-10
                bg-[hsl(var(--surface))]/30 hover:bg-[hsl(var(--surface))]
                border-[hsl(var(--stroke))]
                transition-all duration-400 cursor-default opacity-0"
            >
              {/* Number */}
              <span className="font-display italic text-4xl text-[hsl(var(--stroke))] group-hover:text-[#8AAFD4] transition-colors duration-300 shrink-0 leading-none mt-1">
                {pillar.number}
              </span>

              <div>
                <h3 className="font-body font-medium text-sm uppercase tracking-[0.15em] text-[hsl(var(--text))] mb-3">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[hsl(var(--muted))] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quote block */}
        <div className="mt-20 border-l-2 border-[#8AAFD4] pl-8 max-w-2xl">
          <blockquote className="font-display italic text-2xl md:text-3xl text-[hsl(var(--text))]/80 leading-relaxed">
            "A space should outlive its architect, outlast its owners,
            and reveal new dimensions to every generation that inhabits it."
          </blockquote>
          <cite className="block mt-4 text-xs text-[hsl(var(--muted))] uppercase tracking-[0.25em] not-italic">
            — KaariGhar Design Manifesto
          </cite>
        </div>
      </div>
    </section>
  );
}
