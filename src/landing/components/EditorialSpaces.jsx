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
  const ref    = useRef(null);
  const imgRef = useRef(null);
  const txtRef = useRef(null);
  const isLeft = block.layout === 'img-left';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(imgRef.current,
        { opacity: 0, x: isLeft ? -50 : 50, scale: 0.97 },
        {
          opacity: 1, x: 0, scale: 1,
          duration: 1.4, ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 75%' },
        }
      );
      gsap.fromTo(
        txtRef.current.querySelectorAll('.txt-reveal'),
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 1, ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: ref.current, start: 'top 70%' },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [isLeft]);

  return (
    <article ref={ref} className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: '90vh' }}>
      {/* ── Image pane ── */}
      <div
        ref={imgRef}
        className="img-zoom relative overflow-hidden"
        style={{
          order: isLeft ? 1 : 2,
          minHeight: '50vh',
        }}
        data-cursor-hover
      >
        <img
          src={block.image}
          alt={block.eyebrow}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        {/* Bottom gradient */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: '40%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)',
          }}
        />
        {/* Caption */}
        <div className="absolute bottom-8 left-8">
          <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {block.imageLabel}
          </span>
        </div>
        {/* Index tag */}
        <div className="absolute top-8 right-8">
          <span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
            {String(index + 1).padStart(2, '0')} / 03
          </span>
        </div>
      </div>

      {/* ── Text pane ── */}
      <div
        ref={txtRef}
        style={{
          order: isLeft ? 2 : 1,
          background: 'hsl(var(--bg))',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          /* Generous padding: 64px top/bottom, 80px sides on lg, 128px on xl */
          padding: 'clamp(3rem, 6vw, 5rem) clamp(2.5rem, 5vw, 4rem)',
        }}
      >
        {/* Eyebrow row */}
        <div
          className="txt-reveal"
          style={{
            opacity: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          <div style={{ width: '2.5rem', height: '1px', background: 'linear-gradient(135deg, var(--grad-a), var(--grad-b))', flexShrink: 0 }} />
          <span className="eyebrow">{block.eyebrow}</span>
        </div>

        {/* Heading */}
        <h2
          className="txt-reveal display-xl"
          style={{
            opacity: 0,
            color: 'hsl(var(--text))',
            whiteSpace: 'pre-line',
            marginBottom: '2rem',
          }}
        >
          {block.heading}
        </h2>

        {/* Body copy */}
        <p
          className="txt-reveal body-lg"
          style={{
            opacity: 0,
            maxWidth: '38ch',
            marginBottom: '3rem',
          }}
        >
          {block.body}
        </p>

        {/* CTA link */}
        <a
          href={block.href}
          className="txt-reveal group"
          style={{
            opacity: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem',
            color: 'hsl(var(--text))',
            width: 'fit-content',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--grad-a)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'hsl(var(--text))'; }}
        >
          <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.22em', transition: 'color 0.3s' }}>
            {block.link}
          </span>
          <span
            style={{
              height: '1px',
              width: '2.5rem',
              background: 'currentColor',
              display: 'inline-block',
              transition: 'width 0.4s ease',
            }}
            ref={(el) => {
              if (!el) return;
              const a = el.parentElement;
              a.addEventListener('mouseenter', () => { el.style.width = '4rem'; });
              a.addEventListener('mouseleave', () => { el.style.width = '2.5rem'; });
            }}
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
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0,
          duration: 1, stagger: 0.14, ease: 'power3.out',
          scrollTrigger: { trigger: '.editorial-header', start: 'top 80%' },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="spaces"
      ref={ref}
      style={{ background: 'hsl(var(--bg))' }}
    >
      {/* ── Section header ── */}
      <div className="container" style={{ paddingTop: 'var(--section-y)', paddingBottom: 'var(--section-y)' }}>
        <div
          className="editorial-header"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '3rem',
          }}
        >
          {/* Top row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p className="eyebrow" style={{ opacity: 0 }}>Our Collections</p>
            <h2 className="display-xl" style={{ opacity: 0, color: 'hsl(var(--text))' }}>
              Spaces We <em style={{ color: 'var(--grad-a)' }}>Build</em>
            </h2>
          </div>
          {/* Description */}
          <p className="body-lg" style={{ opacity: 0, maxWidth: '46ch' }}>
            Three approaches to inhabitation. One unwavering commitment to material truth
            — each space a conversation between the made and the found.
          </p>
        </div>
      </div>

      {/* ── Editorial blocks ── */}
      <div style={{ borderTop: '1px solid hsl(var(--stroke))' }}>
        {BLOCKS.map((block, i) => (
          <div
            key={block.id}
            style={{ borderBottom: '1px solid hsl(var(--stroke))' }}
          >
            <Block block={block} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
