import { useState, useEffect } from 'react';
import { t, LANGUAGES } from './i18n';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import FeaturedMakers from './components/FeaturedMakers';
import RequestFlow from './components/RequestFlow';
import OrdersPage from './components/OrdersPage';
import Chat from './components/Chat';
import MakerDashboard from './components/MakerDashboard';
import Footer from './components/Footer';
import './App.css';

const PAGES = ['home', 'orders', 'chat', 'dashboard'];

function getPageFromHash() {
  const hash = window.location.hash.slice(1) || 'home';
  return PAGES.includes(hash) ? hash : 'home';
}

export default function App() {
  const [page, setPage] = useState(getPageFromHash);
  const [lang, setLang] = useState('en');
  const [showRequestFlow, setShowRequestFlow] = useState(false);
  const [chatMaker, setChatMaker] = useState(null);

  useEffect(() => {
    const onHash = () => setPage(getPageFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (p) => {
    window.location.hash = p;
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartOrder = () => setShowRequestFlow(true);
  const handleViewMakers = () => {
    if (page === 'home') {
      document.getElementById('makers')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('home');
      setTimeout(() => document.getElementById('makers')?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const handleOpenChat = (maker) => {
    setChatMaker(maker);
    navigate('chat');
  };

  return (
    <div className="app">
      {/* ─── Top Navigation ─── */}
      <nav className="app-nav">
        <div className="app-nav__logo" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M3 12L12 3L21 12V21H3V12Z" stroke="var(--gold)" strokeWidth="2" strokeLinejoin="round" />
            <path d="M9 21V15H15V21" stroke="var(--gold)" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          KaariGhar
        </div>

        <ul className="app-nav__links">
          <li><a href="#home" className={page === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigate('home'); }}>{t('nav_home', lang)}</a></li>
          <li><a href="#orders" className={page === 'orders' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigate('orders'); }}>{t('nav_orders', lang)}</a></li>
          <li><a href="#chat" className={page === 'chat' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigate('chat'); }}>{t('nav_chat', lang)}</a></li>
          <li><a href="#dashboard" className={page === 'dashboard' ? 'active' : ''} onClick={(e) => { e.preventDefault(); navigate('dashboard'); }}>{t('nav_dashboard', lang)}</a></li>
        </ul>

        <div className="app-nav__actions">
          <div className="lang-toggle">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                className={lang === l.code ? 'active' : ''}
                onClick={() => setLang(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button className="gold-btn" onClick={handleStartOrder} style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            {t('hero_cta', lang)}
          </button>
        </div>
      </nav>

      {/* ─── Main Content ─── */}
      <main className="app-main">
        {page === 'home' && (
          <>
            <Hero lang={lang} onStartOrder={handleStartOrder} onViewMakers={handleViewMakers} />
            <HowItWorks lang={lang} />
            <FeaturedMakers lang={lang} onViewMaker={handleOpenChat} />
          </>
        )}

        {page === 'orders' && (
          <OrdersPage lang={lang} onChat={handleOpenChat} />
        )}

        {page === 'chat' && (
          <Chat lang={lang} maker={chatMaker} />
        )}

        {page === 'dashboard' && (
          <MakerDashboard lang={lang} />
        )}
      </main>

      {/* ─── Footer (not on chat page) ─── */}
      {page !== 'chat' && <Footer lang={lang} />}

      {/* ─── Request Flow Modal ─── */}
      {showRequestFlow && (
        <RequestFlow
          lang={lang}
          onClose={() => setShowRequestFlow(false)}
          onSubmit={() => { }}
        />
      )}

      {/* ─── Mobile Bottom Nav ─── */}
      <div className="mobile-nav">
        <ul className="mobile-nav__items">
          <li>
            <button className={page === 'home' ? 'active' : ''} onClick={() => navigate('home')}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
              {t('nav_home', lang)}
            </button>
          </li>
          <li>
            <button className={page === 'orders' ? 'active' : ''} onClick={() => navigate('orders')}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              {t('nav_orders', lang)}
            </button>
          </li>
          <li>
            <button className="mobile-nav__center-btn" onClick={handleStartOrder}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
          </li>
          <li>
            <button className={page === 'chat' ? 'active' : ''} onClick={() => navigate('chat')}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              {t('nav_chat', lang)}
            </button>
          </li>
          <li>
            <button className={page === 'dashboard' ? 'active' : ''} onClick={() => navigate('dashboard')}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              {t('nav_dashboard', lang)}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
