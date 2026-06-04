import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Hls from 'hls.js';

gsap.registerPlugin(ScrollTrigger);

const HLS_SRC = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';

const ROLES = ['Artisans', 'Curators', 'Narrators', 'Architects'];

export default function Hero() {
  const sectionRef  = useRef(null);
  const videoRef    = useRef(null);
  const overlayRef  = useRef(null);
  const headlineRef = useRef(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const navigate = useNavigate();

  /* ── HLS video init ── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({ autoStartLoad: true, lowLatencyMode: true });
      hls.loadSource(HLS_SRC);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = HLS_SRC;
      video.play().catch(() => {});
    }
  }, []);

  /* ── Scroll-controlled video scrub & parallax ── */
  useEffect(() => {
    const section = sectionRef.current;
    const video   = videoRef.current;
    const overlay = overlayRef.current;
    if (!section || !video) return;

    // Parallax: video moves upward slower than scroll (parallax depth ~30%)
    const parallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
    parallaxTl.to(video, { yPercent: 20, ease: 'none' });

    // Overlay darkens as user scrolls into content
    parallaxTl.to(overlay, { opacity: 0.85, ease: 'none' }, 0);

    // Removed video sync scrubbing to drastically improve performance
    // HLS video scrubbing on scroll causes massive main-thread blocking.

    // Headline scale down and fade out on scroll
    gsap.fromTo(headlineRef.current,
      { opacity: 1, scale: 1, y: 0 },
      {
        opacity: 0,
        scale: 0.92,
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '40% top',
          scrub: true,
        },
      }
    );

    return () => {
      parallaxTl.scrollTrigger?.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  /* ── GSAP entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 0.15,
        defaults: { ease: 'power4.out' },
      });
      tl.fromTo('.hero-eyebrow',
        { opacity: 0, y: 24, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1 }
      )
      .fromTo('.hero-name',
        { opacity: 0, y: 70 },
        { opacity: 1, y: 0, duration: 1.3 },
        '-=0.7'
      )
      .fromTo('.hero-role-line',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9 },
        '-=0.9'
      )
      .fromTo('.hero-desc',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.7'
      )
      .fromTo('.hero-ctas',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.6'
      )
      .fromTo('.hero-scroll',
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        '-=0.3'
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* ── Role cycling ── */
  useEffect(() => {
    const t = setInterval(() => setRoleIndex(i => (i + 1) % ROLES.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative h-screen overflow-hidden flex flex-col"
    >
      {/* ── Video background ── */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          className="video-cover will-change-transform"
        />
      </div>

      {/* ── Overlays ── */}
      <div ref={overlayRef} className="absolute inset-0 bg-black/40 z-[1]" />
      {/* Vignette edges */}
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(10,10,10,0.6) 100%)'
        }}
      />
      {/* Bottom fade to bg */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[3] pointer-events-none"
        style={{ height: '35vh', background: 'linear-gradient(to top, hsl(var(--bg)) 0%, transparent 100%)' }}
      />

      {/* ── Hero content ── */}
      <div
        ref={headlineRef}
        className="relative z-[4] flex-1 flex flex-col items-center justify-center text-center px-6"
        style={{ paddingTop: '80px' }}
      >
        {/* Eyebrow */}
        <div className="hero-eyebrow flex items-center gap-6 mb-12 opacity-0">
          <div className="w-12 h-px accent-gradient" />
          <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.4em' }}>
            Heritage &amp; Craft — Est. 2024
          </span>
          <div className="w-12 h-px accent-gradient" />
        </div>

        {/* Brand name */}
        <h1 className="hero-name display-hero opacity-0"
          style={{ color: 'hsl(var(--text))', marginBottom: '3.5rem' }}
        >
          KaariGhar
        </h1>

        {/* Dynamic role */}
        <div className="hero-role-line flex items-center justify-center gap-3 opacity-0" style={{ marginBottom: '3rem' }}>
          <span className="text-lg md:text-xl font-light"
            style={{ color: 'hsl(var(--muted))', letterSpacing: '0.05em' }}
          >
            We are
          </span>
          <span
            className="relative overflow-hidden"
            style={{ minWidth: '9rem', display: 'inline-flex', justifyContent: 'center' }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                className="display-lg"
                style={{ fontStyle: 'italic', color: 'hsl(var(--text))' }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0,  opacity: 1 }}
                exit={{ y: -20,   opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              >
                {ROLES[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="text-lg md:text-xl font-light"
            style={{ color: 'hsl(var(--muted))', letterSpacing: '0.05em' }}
          >
            of space.
          </span>
        </div>

        {/* Description */}
        <p className="hero-desc body-lg max-w-lg opacity-0" style={{ marginBottom: '4rem', lineHeight: 1.8 }}>
          Every room we conceive is a dialogue between material and memory.
          We build spaces that do not merely shelter — they resonate.
        </p>

        {/* CTA row */}
        <div className="hero-ctas flex flex-col sm:flex-row items-center gap-5 opacity-0">
          {/* PRIMARY — largest, brightest, most prominent */}
          <button
            id="hero-get-started-btn"
            onClick={() => navigate('/auth')}
            className="btn-magnetic accent-gradient text-white rounded-full
              font-semibold uppercase tracking-[0.18em]
              hover:shadow-[0_0_60px_rgba(138,175,212,0.55)] transition-all duration-300
              hover:scale-[1.06] active:scale-95"
            style={{
              fontSize: '0.85rem',
              padding: '20px 52px',
              letterSpacing: '0.2em',
              boxShadow: '0 8px 40px rgba(78,133,191,0.45), 0 2px 12px rgba(0,0,0,0.4)',
            }}
          >
            Get Started ↗
          </button>

          {/* SECONDARY — clearly outlined, smaller than primary */}
          <button
            id="hero-login-btn"
            onClick={() => navigate('/auth')}
            className="btn-magnetic rounded-full
              font-medium uppercase transition-all duration-300
              hover:bg-white/8 active:scale-95"
            style={{
              fontSize: '0.78rem',
              padding: '18px 40px',
              letterSpacing: '0.18em',
              color: 'rgba(255,255,255,0.75)',
              border: '1.5px solid rgba(255,255,255,0.22)',
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(138,175,212,0.6)';
              e.currentTarget.style.color = 'rgba(255,255,255,1)';
              e.currentTarget.style.background = 'rgba(138,175,212,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            }}
          >
            Login
          </button>

          {/* TERTIARY — text link, lowest emphasis */}
          <button
            onClick={() => {
              const el = document.getElementById('spaces');
              if (!el) return;
              window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
            }}
            className="transition-all duration-200 flex items-center gap-2"
            style={{ color: 'rgba(255,255,255,0.32)', fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(138,175,212,0.75)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.32)'}
          >
            Explore Collections
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 2v8M2 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Scroll cue ── */}
      <div className="hero-scroll absolute bottom-10 left-1/2 -translate-x-1/2 z-[4]
        flex flex-col items-center gap-3 opacity-0"
      >
        <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.3)' }}>Scroll</span>
        <div className="scroll-line" />
      </div>

      {/* ── Corner meta ── */}
      <div className="absolute bottom-10 right-8 z-[4] hidden md:flex flex-col items-end gap-1">
        <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.25)' }}>New Delhi, India</span>
        <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.15)' }}>↗ 28°N 77°E</span>
      </div>
    </section>
  );
}
