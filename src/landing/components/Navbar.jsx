import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LINKS = [
  { label: 'Spaces',     href: '#spaces' },
  { label: 'Materials',  href: '#materials' },
  { label: 'Manifesto',  href: '#manifesto' },
  { label: 'Process',    href: '#process' },
];

export default function Navbar() {
  const [scrolled,      setScrolled]      = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const navigate = useNavigate();

  /* ── Track scroll depth ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Active section via IntersectionObserver ── */
  useEffect(() => {
    const ids = LINKS.map(l => l.href.replace('#', ''));
    const observers = ids.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  const navBase = scrolled
    ? 'bg-black/80 backdrop-blur-2xl border-white/10 shadow-[0_8px_48px_rgba(0,0,0,0.6)]'
    : 'bg-white/4 backdrop-blur-lg border-white/8';

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-[200] border-b transition-all duration-500 ${navBase}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ height: '72px' }}
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

          {/* ── Logo ── */}
          <a
            href="#home"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8AAFD4 0%, #4E85BF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '0.1em',
              flexShrink: 0,
            }}>
              KG
            </div>
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.85)',
              fontFamily: 'Inter, sans-serif',
            }}>
              KaariGhar
            </span>
          </a>

          {/* ── Desktop Nav Links ── */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flex: 1,
            justifyContent: 'center',
          }}
            className="hidden md:flex"
          >
            {LINKS.map((l) => {
              const isActive = activeSection === l.href.replace('#', '');
              return (
                <a
                  key={l.label}
                  href={l.href}
                  style={{
                    position: 'relative',
                    padding: '10px 18px',
                    borderRadius: '99px',
                    fontSize: '12px',
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                    background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.25s ease',
                    fontFamily: 'Inter, sans-serif',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {l.label}
                  {/* Active dot indicator */}
                  {isActive && (
                    <span style={{
                      position: 'absolute',
                      bottom: '6px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #8AAFD4, #4E85BF)',
                    }} />
                  )}
                </a>
              );
            })}
          </nav>

          {/* ── Auth buttons ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              id="nav-login-btn"
              onClick={() => navigate('/auth')}
              style={{
                padding: '10px 22px',
                borderRadius: '99px',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.12)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                fontFamily: 'Inter, sans-serif',
                whiteSpace: 'nowrap',
              }}
              className="hidden sm:block"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Login
            </button>

            <button
              id="nav-signup-btn"
              onClick={() => navigate('/auth')}
              style={{
                padding: '11px 28px',
                borderRadius: '99px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#fff',
                background: 'linear-gradient(135deg, #8AAFD4 0%, #4E85BF 100%)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 24px rgba(78,133,191,0.45)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 40px rgba(78,133,191,0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(78,133,191,0.45)';
              }}
            >
              Get Started ↗
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                padding: '10px 12px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
              }}
            >
              {[0,1,2].map(i => (
                <span key={i} style={{
                  display: 'block',
                  width: i === 1 ? '14px' : '20px',
                  height: '1.5px',
                  background: 'rgba(255,255,255,0.7)',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease',
                  marginLeft: i === 1 ? '3px' : '0',
                }} />
              ))}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[199] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              style={{
                position: 'absolute',
                top: '80px',
                left: '16px',
                right: '16px',
                background: 'rgba(10,10,10,0.95)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '16px',
                backdropFilter: 'blur(24px)',
              }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0,   opacity: 1 }}
              exit={{ y: -20,    opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                >
                  {l.label}
                  <span style={{ fontSize: '18px', opacity: 0.3 }}>→</span>
                </a>
              ))}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />
              <div style={{ display: 'flex', gap: '10px', padding: '8px' }}>
                <button
                  onClick={() => { navigate('/auth'); setMobileOpen(false); }}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '12px', fontSize: '12px',
                    fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => { navigate('/auth'); setMobileOpen(false); }}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '12px', fontSize: '12px',
                    fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: '#fff', background: 'linear-gradient(135deg, #8AAFD4, #4E85BF)',
                    border: 'none', cursor: 'pointer',
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
