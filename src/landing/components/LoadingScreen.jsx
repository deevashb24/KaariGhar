import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

const WORDS   = ['Design.', 'Craft.', 'Endure.', 'Resonate.'];
const DURATION = 2800; // ms for 0→100

export default function LoadingScreen({ onComplete }) {
  const [count,     setCount]     = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const startRef = useRef(null);
  const rafRef   = useRef(null);

  useEffect(() => {
    startRef.current = performance.now();

    const tick = (now) => {
      const elapsed  = now - startRef.current;
      const progress = Math.min(elapsed / DURATION, 1);
      setCount(Math.floor(progress * 100));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(onComplete, 300);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    const wordTimer = setInterval(
      () => setWordIndex((i) => (i + 1) % WORDS.length),
      900
    );

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(wordTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col overflow-hidden"
      style={{ background: 'hsl(var(--bg))' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-8 md:px-14 pt-8">
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          KaariGhar
        </motion.span>

        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <span className="eyebrow">Est. 2024</span>
          <div className="w-8 h-px" style={{ background: 'hsl(var(--stroke))' }} />
        </motion.div>
      </div>

      {/* ── Centre rotating word ── */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={wordIndex}
            className="display-hero text-center select-none"
            style={{ color: 'hsl(var(--text) / 0.7)' }}
            initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -28, filter: 'blur(8px)' }}
            transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
          >
            {WORDS[wordIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── Bottom row ── */}
      <div className="flex items-end justify-between px-8 md:px-14 pb-8">
        {/* Left: tagline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="hidden md:block"
        >
          <p className="eyebrow mb-1">Heritage & Craft</p>
          <p className="text-xs" style={{ color: 'hsl(var(--faint))' }}>
            Premium Interior Architecture
          </p>
        </motion.div>

        {/* Right: counter */}
        <motion.div
          className="ml-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <span
            className="select-none"
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: 'clamp(5rem, 14vw, 10rem)',
              lineHeight: 1,
              color: 'hsl(var(--text))',
              fontVariantNumeric: 'tabular-nums',
              fontStyle: 'italic',
            }}
          >
            {String(count).padStart(3, '0')}
          </span>
        </motion.div>
      </div>

      {/* ── Progress bar ── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '2px', background: 'hsl(var(--stroke) / 0.4)' }}
      >
        <motion.div
          className="h-full origin-left accent-gradient"
          style={{ scaleX: count / 100 }}
        />
      </div>
    </motion.div>
  );
}
