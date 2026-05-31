import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const LINKS = [
  { label: 'Spaces',     href: '#spaces' },
  { label: 'Materials',  href: '#materials' },
  { label: 'Manifesto',  href: '#manifesto' },
  { label: 'Journal',    href: '#journal' },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-center py-5 px-6"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <nav
          className={`
            inline-flex items-center gap-1 rounded-full px-2 py-2
            border transition-all duration-500
            ${scrolled
              ? 'border-white/10 bg-black/70 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.5)]'
              : 'border-white/6  bg-white/3  backdrop-blur-md'}
          `}
        >
          {/* Logo mark */}
          <a
            href="#home"
            className="flex items-center justify-center w-9 h-9 rounded-full accent-gradient
              text-white text-[10px] font-semibold tracking-widest shrink-0 mr-2"
          >
            KG
          </a>

          <div className="w-px h-4 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

          {/* Links */}
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="px-4 py-2 rounded-full text-[11px] font-medium uppercase tracking-[0.18em]
                transition-all duration-200 hover:bg-white/6"
              style={{ color: 'hsl(var(--muted))' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--text))'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--muted))'}
            >
              {l.label}
            </a>
          ))}

          <div className="w-px h-4 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

          {/* CTA */}
          <a
            href="#contact"
            className="grad-border group relative px-5 py-2.5 rounded-full
              text-[11px] font-medium uppercase tracking-[0.18em]
              border transition-all duration-300 hover:shadow-[0_0_24px_rgba(138,175,212,0.2)]"
            style={{
              color: 'hsl(var(--text))',
              borderColor: 'rgba(255,255,255,0.1)',
            }}
          >
            Inquire{' '}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </a>
        </nav>
      </motion.header>

      {/* Mobile menu overlay — unused on desktop but future-safe */}
    </>
  );
}
