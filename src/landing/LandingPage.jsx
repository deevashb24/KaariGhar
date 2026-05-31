import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import './index.css';

// Hooks
import { useSmoothScroll } from './hooks/useSmoothScroll';

// Components
import CustomCursor     from './components/CustomCursor';
import LoadingScreen    from './components/LoadingScreen';
import Navbar           from './components/Navbar';
import Hero             from './components/Hero';
import Marquee          from './components/Marquee';
import StatsSection     from './components/StatsSection';
import EditorialSpaces  from './components/EditorialSpaces';
import MaterialsGallery from './components/MaterialsGallery';
import Manifesto        from './components/Manifesto';
import ProcessSection   from './components/ProcessSection';
import ContactFooter    from './components/ContactFooter';

const TICKER_ITEMS = [
  'Interior Architecture',
  'Material Truth',
  'Bespoke Craftsmanship',
  'Handmade Objects',
  'Slow Design',
  'Heritage & Craft',
  'Artisan Alliance',
  'Light as Architecture',
];

function AppShell() {
  useSmoothScroll();

  return (
    <div
      className="grain-overlay"
      style={{ background: 'hsl(var(--bg))', color: 'hsl(var(--text))', minHeight: '100vh' }}
    >
      <CustomCursor />
      <Navbar />

      <main>
        <Hero />
        <Marquee items={TICKER_ITEMS} />
        <StatsSection />
        <Marquee items={TICKER_ITEMS} direction="right" />
        <EditorialSpaces />
        <MaterialsGallery />
        <Manifesto />
        <ProcessSection />
      </main>

      <ContactFooter />
    </div>
  );
}

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loader" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && <AppShell />}
    </>
  );
}
