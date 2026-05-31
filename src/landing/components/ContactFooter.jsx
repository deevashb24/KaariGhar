import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hls from 'hls.js';

gsap.registerPlugin(ScrollTrigger);

const HLS_SRC = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com/kaarighar' },
  { label: 'Pinterest',  href: 'https://pinterest.com/kaarighar' },
  { label: 'LinkedIn',   href: 'https://linkedin.com/company/kaarighar' },
];

export default function ContactFooter() {
  const sectionRef = useRef(null);
  const videoRef   = useRef(null);

  /* ── HLS video ── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (Hls.isSupported()) {
      const hls = new Hls({ autoStartLoad: true });
      hls.loadSource(HLS_SRC);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
      return () => hls.destroy();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = HLS_SRC;
      video.play().catch(() => {});
    }
  }, []);

  /* ── Entrance animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.footer-reveal',
        { opacity: 0, y: 48 },
        {
          opacity: 1, y: 0,
          stagger: 0.12, duration: 1.1, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden border-t"
      style={{ background: 'hsl(var(--bg))', borderColor: 'hsl(var(--stroke))' }}
    >
      {/* ── Flipped background video ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          className="video-cover"
          style={{ transform: 'scaleY(-1)' }}
        />
        {/* Heavy overlay */}
        <div className="absolute inset-0 bg-black/78" />
        {/* Top fade from bg */}
        <div
          className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, hsl(var(--bg)), transparent)' }}
        />
        {/* Bottom fade to bg */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to top, hsl(var(--bg)), transparent)' }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 container section-pad">

        {/* CTA block */}
        <div className="text-center" style={{ marginBottom: '10rem' }}>
          <p className="footer-reveal eyebrow opacity-0" style={{ marginBottom: '3rem' }}>
            Begin Something Enduring
          </p>

          <h2
            className="footer-reveal display-hero opacity-0"
            style={{ color: 'hsl(var(--text))', marginBottom: '3rem' }}
          >
            Begin your<br />
            <em style={{ color: 'var(--grad-a)' }}>journey.</em>
          </h2>

          <p className="footer-reveal body-lg max-w-sm mx-auto opacity-0" style={{ marginBottom: '4.5rem' }}>
            Every extraordinary space begins with a single conversation.
            Tell us about your vision and we will answer with possibility.
          </p>

          {/* Email pill */}
          <div className="footer-reveal opacity-0">
            <a
              href="mailto:contact@kaarighar.com"
              className="group grad-border relative inline-flex items-center gap-3
                px-10 py-5 rounded-full border text-sm font-medium uppercase tracking-[0.2em]
                transition-all duration-400 hover:shadow-[0_0_50px_rgba(138,175,212,0.2)]"
              style={{
                color: 'hsl(var(--text))',
                borderColor: 'rgba(255,255,255,0.12)',
              }}
              data-cursor-hover
            >
              <span>contact@kaarighar.com</span>
              <span
                className="text-base transition-transform duration-200
                  group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                ↗
              </span>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="hr-subtle" style={{ marginBottom: '3.5rem' }} />

        {/* Footer bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span
              style={{
                fontFamily: 'Instrument Serif, serif',
                fontStyle: 'italic',
                fontSize: '1.25rem',
                color: 'hsl(var(--text))',
              }}
            >
              KaariGhar
            </span>
            <span style={{ color: 'hsl(var(--faint))' }}>·</span>
            <span className="eyebrow">© 2024</span>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: '#34D399',
                animation: 'pulse-ring 2.5s ease-in-out infinite',
                display: 'block',
              }}
            />
            <span className="eyebrow" style={{ color: 'hsl(var(--muted))' }}>
              Currently accepting commissions
            </span>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-8">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="eyebrow transition-colors duration-200"
                style={{ color: 'hsl(var(--faint))' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--text))'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--faint))'}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
