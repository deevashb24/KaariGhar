import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import '../landing/index.css';
import LoadingScreen from '../landing/components/LoadingScreen';
import Navbar from '../landing/components/Navbar';
import Hero from '../landing/components/Hero';
import EditorialSpaces from '../landing/components/EditorialSpaces';
import MaterialsGallery from '../landing/components/MaterialsGallery';
import Manifesto from '../landing/components/Manifesto';
import ContactFooter from '../landing/components/ContactFooter';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loader" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <div className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--text))] font-body">
          <Navbar />
          <main>
            <Hero />
            <EditorialSpaces />
            <MaterialsGallery />
            <Manifesto />
          </main>
          <ContactFooter />
        </div>
      )}
    </>
  );
}
