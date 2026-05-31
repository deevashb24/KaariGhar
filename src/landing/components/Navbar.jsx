import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Spaces', href: '#spaces' },
  { label: 'Materials', href: '#materials' },
  { label: 'Manifesto', href: '#manifesto' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
    >
      <div
        className={`
          inline-flex items-center rounded-full backdrop-blur-md border border-white/10
          bg-[hsl(var(--surface))]/80 px-2 py-2 gap-1
          transition-shadow duration-300
          ${scrolled ? 'shadow-[0_8px_32px_rgba(0,0,0,0.6)]' : ''}
        `}
      >
        {/* Logo pill */}
        <a
          href="#home"
          className="flex items-center justify-center w-9 h-9 rounded-full accent-gradient text-white text-xs font-semibold tracking-wider mr-1"
        >
          KG
        </a>

        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Nav links */}
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="px-4 py-2 text-xs text-[hsl(var(--muted))] uppercase tracking-[0.15em] rounded-full
              hover:text-[hsl(var(--text))] hover:bg-white/5 transition-all duration-200"
          >
            {link.label}
          </a>
        ))}

        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Inquire CTA */}
        <a
          href="#contact"
          className="group relative px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-[0.15em]
            text-[hsl(var(--text))] transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-1.5">
            Inquire
            <span className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
          </span>
          {/* Gradient border via box-shadow trick */}
          <span
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(90deg, #8AAFD4, #4E85BF)', padding: '1px' }}
          >
            <span className="absolute inset-0 rounded-full bg-[hsl(var(--surface))]" />
          </span>
          <span className="absolute inset-0 rounded-full border border-white/10 group-hover:border-transparent transition-colors duration-300" />
        </a>
      </div>
    </motion.nav>
  );
}
