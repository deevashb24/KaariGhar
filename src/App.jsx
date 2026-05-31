import { useState, useContext } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { t, LANGUAGES } from './i18n';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import FeaturedMakers from './components/FeaturedMakers';
import Footer from './components/Footer';
import AuthTabs from './components/Auth/AuthTabs';
import CustomerDashboard from './components/Customer/CustomerDashboard';
import MakerDashboard from './components/Maker/MakerDashboard';
import ProfileSetup from './components/ProfileSetup';
import NotificationBell from './components/NotificationBell';
import LandingPage from './landing/LandingPage';
import './App.css';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/auth" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;
  return children;
};

// Simplified Navbar for Portals
const AppNavbar = ({ lang, setLang }) => {
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
            <span style={{ color: 'var(--text-light)', marginRight: '8px' }}>Hi, {user.name}</span>
            <NotificationBell />
            <button className="gold-btn" onClick={() => { logout(); navigate('/'); }} style={{ padding: '8px 20px', fontSize: '0.85rem', marginLeft: '8px' }}>
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
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const isLandingPage = location.pathname === '/';

  // Check if profile onboarding is needed
  const needsOnboarding = user && user.isProfileComplete === false;

  const handleStartOrder = () => {
    if (user) {
      navigate(user.role === 'CUSTOMER' ? '/customer' : '/maker');
    } else {
      navigate('/auth');
    }
  };

  const handleViewMakers = () => {
    if (user) {
      navigate('/customer');
    } else {
      navigate('/auth');
    }
  };

  // Landing page gets full screen treatment — no legacy chrome
  if (isLandingPage) {
    return <LandingPage />;
  }

  return (
    <div className="app">
      <AppNavbar lang={lang} setLang={setLang} />

      <main className="app-main">
        <Routes>
          {/* Original Marketplace Home */}
          <Route path="/app" element={
            <>
              <Hero lang={lang} onStartOrder={handleStartOrder} onViewMakers={handleViewMakers} />
              <HowItWorks lang={lang} />
              <FeaturedMakers lang={lang} onViewMaker={handleViewMakers} />
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

      {/* Profile Onboarding Overlay */}
      {needsOnboarding && (
        <ProfileSetup onComplete={() => setShowProfileSetup(false)} />
      )}
    </div>
  );
}
