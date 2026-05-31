import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BLOCKS = [
  {
    id: 'block-1',
    layout: 'image-left',
    image: '/editorial_1.png',
    eyebrow: 'The Living Space',
    heading: 'The Art of\nPresence',
    body: 'We do not design rooms — we cultivate atmospheres. Each surface chosen for the story it carries, each proportion measured against the quality of light that will touch it at dusk. Material truth is our only compass.',
    link: { label: 'View Living Collections', href: '#spaces' },
  },
  {
    id: 'block-2',
    layout: 'text-left',
    image: '/editorial_2.png',
    eyebrow: 'Threshold & Passage',
    heading: 'Where Light\nBecomes Form',
    body: 'A corridor is not merely passage — it is anticipation made architectural. We design the spaces between spaces with the same rigour we bring to the grand salon. In the threshold lives the soul of the home.',
    link: { label: 'Explore Our Process', href: '#manifesto' },
  },
  {
    id: 'block-3',
    layout: 'image-left',
    image: '/editorial_3.png',
    eyebrow: 'The Private Retreat',
    heading: 'Stillness,\nCrafted',
    body: 'The bedroom is the first and last room of the day — a space that demands tenderness in every decision. Natural fibres, handmade objects, and the absence of excess. Rest as a considered act.',
    link: { label: 'See Retreat Spaces', href: '#spaces' },
  },
];

function EditorialBlock({ block, index }) {
  const blockRef = useRef(null);
  const isImageLeft = block.layout === 'image-left';

  useEffect(() => {
    const el = blockRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={blockRef}
      className={`group grid grid-cols-1 lg:grid-cols-2 gap-0 ${
        isImageLeft ? '' : 'lg:[direction:rtl]'
      }`}
    >
      {/* Image side */}
      <div className="editorial-image aspect-[4/5] lg:aspect-auto lg:min-h-[600px] overflow-hidden relative">
        <img
          src={block.image}
          alt={block.eyebrow}
          className="w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.04]"
          loading="lazy"
        />
        {/* Image number */}
        <div className="absolute top-6 left-6 text-[10px] text-white/40 uppercase tracking-[0.3em] font-body">
          {String(index + 1).padStart(2, '0')} / {String(BLOCKS.length).padStart(2, '0')}
        </div>
      </div>

      {/* Text side */}
      <div
        className={`flex flex-col justify-center px-10 py-16 lg:px-20 lg:py-24 bg-[hsl(var(--bg))] ${
          isImageLeft ? '' : '[direction:ltr]'
        }`}
      >
        {/* Separator + eyebrow */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-8 h-px accent-gradient" />
          <span className="text-xs text-[hsl(var(--muted))] uppercase tracking-[0.3em]">
            {block.eyebrow}
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-display italic text-4xl md:text-5xl xl:text-6xl leading-[1.05] text-[hsl(var(--text))] mb-8 whitespace-pre-line">
          {block.heading}
        </h2>

        {/* Body */}
        <p className="text-sm md:text-base text-[hsl(var(--muted))] leading-relaxed mb-10 max-w-sm">
          {block.body}
        </p>

        {/* Link */}
        <a
          href={block.link.href}
          className="group/link inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[hsl(var(--text))] hover:text-[#8AAFD4] transition-colors duration-300"
        >
          <span>{block.link.label}</span>
          <span className="w-6 h-px bg-current transition-all duration-300 group-hover/link:w-10" />
        </a>
      </div>
    </div>
  );
}

export default function EditorialSpaces() {
  return (
    <section id="spaces" className="bg-[hsl(var(--bg))] py-24 md:py-32 overflow-hidden">
      {/* Section header */}
      <div className="max-w-[1400px] mx-auto px-6 mb-20">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <p className="text-xs text-[hsl(var(--muted))] uppercase tracking-[0.35em] mb-4">
              Our Collections
            </p>
            <h2 className="font-display italic text-3xl md:text-4xl text-[hsl(var(--text))]">
              The Spaces We Build
            </h2>
          </div>
          <p className="text-sm text-[hsl(var(--muted))] max-w-xs leading-relaxed">
            Three approaches to inhabitation. One unwavering commitment to material truth.
          </p>
        </div>
      </div>

      {/* Editorial blocks */}
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col gap-2">
          {BLOCKS.map((block, i) => (
            <EditorialBlock key={block.id} block={block} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
