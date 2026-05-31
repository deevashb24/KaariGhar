import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BLOCKS = [
  {
    id: 'b1',
    layout: 'img-left',
    eyebrow: '01 — Living',
    heading: 'The Art\nof Presence',
    body: 'We do not design rooms — we cultivate atmospheres. Each surface chosen for the story it carries, each proportion measured against the quality of light that will touch it at dusk. Material truth is our only compass.',
    link: 'View Living Collection',
    href: '#spaces',
    image: '/editorial_1.png',
    imageLabel: 'Concrete & Timber Residence, 2023',
  },
  {
    id: 'b2',
    layout: 'img-right',
    eyebrow: '02 — Threshold',
    heading: 'Where Light\nBecomes Form',
    body: 'A corridor is not merely passage — it is anticipation made architectural. We design the spaces between spaces with the same rigour we bring to the grand salon. In the threshold lives the soul of the home.',
    link: 'Explore Our Process',
    href: '#manifesto',
    image: '/editorial_2.png',
    imageLabel: 'Stone & Brass Corridor, Rajasthan 2022',
  },
  {
    id: 'b3',
    layout: 'img-left',
    eyebrow: '03 — Retreat',
    heading: 'Stillness,\nCrafted',
    body: 'The bedroom is the first and last room of every day — a space demanding tenderness in every decision. Natural fibres, handmade objects, the deliberate absence of excess. Rest as a considered act.',
    link: 'See Retreat Spaces',
    href: '#spaces',
    image: '/editorial_3.png',
    imageLabel: 'Woven Linen Suite, Himachal 2024',
  },
];

function Block({ block, index }) {
  const ref   = useRef(null);
  const imgRef = useRef(null);
  const txtRef = useRef(null);
  const isLeft = block.layout === 'img-left';

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image slides in from its side
      gsap.fromTo(imgRef.current,
        { opacity: 0, x: isLeft ? -60 : 60, scale: 0.97 },
        {
          opacity: 1, x: 0, scale: 1,
          duration: 1.3, ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 72%',
          },
        }
      );

      // Text stagger
      gsap.fromTo(txtRef.current.querySelectorAll('.txt-reveal'),
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0,
          duration: 0.9, ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 68%',
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [isLeft]);

  return (
    <article ref={ref} className="grid grid-cols-1 lg:grid-cols-2 min-h-[85vh]">
      {/* ── Image pane ── */}
      <div
        ref={imgRef}
        className={`img-zoom relative overflow-hidden ${isLeft ? 'lg:order-first' : 'lg:order-last'}`}
        style={{ minHeight: '55vw', maxHeight: '80vh', height: 'auto' }}
        data-cursor-hover
      >
        <img
          src={block.image}
          alt={block.eyebrow}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        {/* Inner gradient at bottom of image */}
        <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)' }}
        />
        {/* Image caption */}
        <div className="absolute bottom-6 left-6">
          <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {block.imageLabel}
          </span>
        </div>
        {/* Index */}
        <div className="absolute top-6 right-6">
          <span
            className="text-[10px] font-medium tabular-nums"
            style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}
          >
            {String(index + 1).padStart(2, '0')} / 03
          </span>
        </div>
      </div>

      {/* ── Text pane ── */}
      <div
        ref={txtRef}
        className={`flex flex-col justify-center px-10 py-20 lg:px-20 xl:px-28 ${
          isLeft ? 'lg:order-last' : 'lg:order-first'
        }`}
        style={{ background: 'hsl(var(--bg))' }}
      >
        {/* Eyebrow */}
        <div className="txt-reveal flex items-center gap-4 mb-10 opacity-0">
          <div className="w-10 h-px accent-gradient shrink-0" />
          <span className="eyebrow">{block.eyebrow}</span>
        </div>

        {/* Heading */}
        <h2
          className="txt-reveal display-xl mb-10 opacity-0 whitespace-pre-line"
          style={{ color: 'hsl(var(--text))' }}
        >
          {block.heading}
        </h2>

        {/* Body copy */}
        <p className="txt-reveal body-lg mb-12 max-w-sm opacity-0">
          {block.body}
        </p>

        {/* Text link */}
        <a
          href={block.href}
          className="txt-reveal group inline-flex items-center gap-4 opacity-0 w-fit"
          style={{ color: 'hsl(var(--text))' }}
        >
          <span
            className="text-xs font-semibold uppercase tracking-[0.22em] transition-colors duration-300 group-hover:text-[var(--grad-a)]"
          >
            {block.link}
          </span>
          <span
            className="h-px transition-all duration-400 group-hover:w-14"
            style={{ width: '2.5rem', background: 'currentColor' }}
          />
        </a>
      </div>
    </article>
  );
}

export default function EditorialSpaces() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.editorial-header > *',
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0,
          duration: 1, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: {
            trigger: '.editorial-header',
            start: 'top 80%',
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="spaces" ref={ref} style={{ background: 'hsl(var(--bg))' }}>
      {/* Section header */}
      <div className="container section-pad">
        <div className="editorial-header flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p className="eyebrow mb-5 opacity-0">Our Collections</p>
            <h2 className="display-xl opacity-0" style={{ color: 'hsl(var(--text))' }}>
              Spaces We<br />
              <em style={{ color: 'var(--grad-a)' }}>Build</em>
            </h2>
          </div>
          <p className="body-lg max-w-xs pb-1 opacity-0">
            Three approaches to inhabitation. One unwavering commitment to material truth.
          </p>
        </div>
      </div>

      {/* Editorial blocks separated by hairline */}
      <div
        className="border-t"
        style={{ borderColor: 'hsl(var(--stroke))' }}
      >
        {BLOCKS.map((block, i) => (
          <div
            key={block.id}
            className="border-b"
            style={{ borderColor: 'hsl(var(--stroke))' }}
          >
            <Block block={block} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
