import { useState, useContext } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { t, LANGUAGES } from './i18n';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import FeaturedMakers from './components/FeaturedMakers';
import Footer from './components/Footer';
import AuthTabs from './components/Auth/AuthTabs';
import CustomerDashboard from './components/Customer/CustomerDashboard';
import MakerDashboard from './components/Maker/MakerDashboard';
import './App.css';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/auth" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;
  return children;
};

// Simplified Navbar for Portals
const Navbar = ({ lang, setLang }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="app-nav">
      <div className="app-nav__logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M3 12L12 3L21 12V21H3V12Z" stroke="var(--gold)" strokeWidth="2" strokeLinejoin="round" />
          <path d="M9 21V15H15V21" stroke="var(--gold)" strokeWidth="2" strokeLinejoin="round" />
        </svg>
        KaariGhar
      </div>
      <div className="app-nav__actions">
        {user ? (
          <>
            <span style={{ color: 'var(--text-light)', marginRight: '15px' }}>Hi, {user.name}</span>
            <button className="gold-btn" onClick={() => { logout(); navigate('/'); }} style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
              Logout
            </button>
          </>
        ) : (
          <button className="gold-btn" onClick={() => navigate('/auth')} style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
            Login / Get Started
          </button>
        )}
      </div>
    </nav>
  );
};

export default function App() {
  const [lang, setLang] = useState('en');

  return (
    <div className="app">
      <Navbar lang={lang} setLang={setLang} />

      <main className="app-main">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Hero lang={lang} onStartOrder={() => window.location.href = '/auth'} onViewMakers={() => window.location.href = '/auth'} />
              <HowItWorks lang={lang} />
              <FeaturedMakers lang={lang} onViewMaker={() => window.location.href = '/auth'} />
              <Footer lang={lang} />
            </>
          } />
          <Route path="/auth" element={<AuthTabs />} />

          {/* Customer Portal */}
          <Route path="/customer/*" element={
            <ProtectedRoute allowedRole="CUSTOMER">
              <CustomerDashboard />
            </ProtectedRoute>
          } />

          {/* Maker Portal */}
          <Route path="/maker/*" element={
            <ProtectedRoute allowedRole="MAKER">
              <MakerDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

