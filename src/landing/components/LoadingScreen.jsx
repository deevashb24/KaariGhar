import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const WORDS = ['Design.', 'Craft.', 'Endure.'];

export default function LoadingScreen({ onComplete }) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const DURATION = 2700;

  useEffect(() => {
    startRef.current = performance.now();

    const tick = (now) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / DURATION, 1);
      const current = Math.floor(progress * 100);
      setCount(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(onComplete, 250);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    const wordTimer = setInterval(() => {
      setWordIndex((i) => (i + 1) % WORDS.length);
    }, 900);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(wordTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col bg-[hsl(var(--bg))] overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: 'easeInOut' } }}
    >
      {/* Top-left brand label */}
      <motion.div
        className="absolute top-8 left-8 text-xs text-[hsl(var(--muted))] uppercase tracking-[0.3em] font-body"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        KaariGhar
      </motion.div>

      {/* Top-right line decoration */}
      <motion.div
        className="absolute top-8 right-8 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <span className="text-xs text-[hsl(var(--muted))] uppercase tracking-[0.2em]">
          Est. 2024
        </span>
        <div className="w-8 h-px bg-[hsl(var(--stroke))]" />
      </motion.div>

      {/* Center rotating word */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-[hsl(var(--text))]/80 select-none"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {WORDS[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Bottom-right counter */}
      <div className="absolute bottom-12 right-8">
        <span className="loading-counter text-6xl md:text-8xl lg:text-9xl text-[hsl(var(--text))] select-none">
          {String(count).padStart(3, '0')}
        </span>
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[hsl(var(--stroke))]/50">
        <motion.div
          className="h-full accent-gradient origin-left"
          style={{ scaleX: count / 100 }}
          transition={{ ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}
