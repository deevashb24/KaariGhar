import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LINKS = [
  { label: 'Spaces',    href: 'spaces' },
  { label: 'Materials', href: 'materials' },
  { label: 'Manifesto', href: 'manifesto' },
  { label: 'Process',   href: 'process' },
];

/* Smooth scroll to a section with navbar offset */
function scrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = 72; // navbar height
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

export default function Navbar() {
  const [scrolled,      setScrolled]      = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const navigate = useNavigate();

  /* ── Scroll depth ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Active section via IntersectionObserver ── */
  useEffect(() => {
    const observers = LINKS.map(({ href }) => {
      const el = document.getElementById(href);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(href); },
        { threshold: 0.25, rootMargin: '-72px 0px 0px 0px' }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  /* ── Close mobile menu on resize ── */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navBg = scrolled
    ? 'rgba(0,0,0,0.85)'
    : 'rgba(8,8,8,0.5)';
  const navBorder = scrolled
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(255,255,255,0.06)';

  return (
    <>
      <motion.header
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 200,
          height: '72px',
          background: navBg,
          borderBottom: `1px solid ${navBorder}`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: scrolled ? '0 8px 48px rgba(0,0,0,0.55)' : 'none',
          transition: 'background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 clamp(1rem, 3vw, 2.5rem)',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}>

          {/* ── Wordmark logo (no icon) ── */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              flexShrink: 0,
              cursor: 'pointer',
            }}
          >
            <span style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              fontSize: '1.25rem',
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}>
              KaariGhar
            </span>
            <span style={{
              width: '4px', height: '4px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #8AAFD4, #4E85BF)',
              flexShrink: 0,
              marginBottom: '2px',
            }} />
          </a>

          {/* ── Desktop Nav Links ── */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              flex: 1,
              justifyContent: 'center',
            }}
            className="hidden md:flex"
          >
            {LINKS.map(({ label, href }) => {
              const isActive = activeSection === href;
              return (
                <button
                  key={href}
                  onClick={() => scrollTo(href)}
                  style={{
                    position: 'relative',
                    padding: '10px 20px',
                    borderRadius: '99px',
                    fontSize: '11.5px',
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.48)',
                    background: isActive ? 'rgba(138,175,212,0.1)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.22s ease',
                    fontFamily: 'Inter, sans-serif',
                    whiteSpace: 'nowrap',
                    outline: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.82)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.48)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {label}
                  {isActive && (
                    <span style={{
                      position: 'absolute',
                      bottom: '5px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '16px',
                      height: '2px',
                      borderRadius: '2px',
                      background: 'linear-gradient(135deg, #8AAFD4, #4E85BF)',
                    }} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── Right: Auth buttons ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Login — ghost */}
            <button
              id="nav-login-btn"
              onClick={() => navigate('/auth')}
              style={{
                padding: '9px 20px',
                borderRadius: '99px',
                fontSize: '11.5px',
                fontWeight: 500,
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.55)',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.12)',
                cursor: 'pointer',
                transition: 'all 0.22s ease',
                fontFamily: 'Inter, sans-serif',
                whiteSpace: 'nowrap',
                outline: 'none',
              }}
              className="hidden sm:block"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Login
            </button>

            {/* Get Started — solid gradient */}
            <button
              id="nav-signup-btn"
              onClick={() => navigate('/auth')}
              style={{
                padding: '10px 26px',
                borderRadius: '99px',
                fontSize: '11.5px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#fff',
                background: 'linear-gradient(135deg, #8AAFD4 0%, #4E85BF 100%)',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 20px rgba(78,133,191,0.45)',
                whiteSpace: 'nowrap',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 36px rgba(78,133,191,0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(78,133,191,0.45)';
              }}
            >
              Get Started ↗
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Menu"
              className="md:hidden"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '9px 11px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                outline: 'none',
              }}
            >
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: 'block',
                  width: i === 1 ? '12px' : '18px',
                  height: '1.5px',
                  background: 'rgba(255,255,255,0.65)',
                  borderRadius: '2px',
                  marginLeft: i === 1 ? '3px' : 0,
                }} />
              ))}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile dropdown ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            style={{ position: 'fixed', inset: 0, zIndex: 199 }}
            className="md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {/* Backdrop */}
            <div
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)' }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              style={{
                position: 'absolute',
                top: '80px',
                left: '12px', right: '12px',
                background: 'rgba(8,8,8,0.96)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '18px',
                padding: '10px',
                backdropFilter: 'blur(24px)',
              }}
              initial={{ y: -16, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -16, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {LINKS.map(({ label, href }) => (
                <button
                  key={href}
                  onClick={() => { scrollTo(href); setMobileOpen(false); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '15px 18px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.65)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    fontFamily: 'Inter, sans-serif',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
                >
                  {label}
                  <span style={{ opacity: 0.3, fontSize: '16px' }}>↓</span>
                </button>
              ))}

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '6px 4px' }} />

              <div style={{ display: 'flex', gap: '8px', padding: '6px 4px 2px' }}>
                <button
                  onClick={() => { navigate('/auth'); setMobileOpen(false); }}
                  style={{
                    flex: 1, padding: '13px', borderRadius: '10px',
                    fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => { navigate('/auth'); setMobileOpen(false); }}
                  style={{
                    flex: 1, padding: '13px', borderRadius: '10px',
                    fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: '#fff', background: 'linear-gradient(135deg, #8AAFD4, #4E85BF)',
                    border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
