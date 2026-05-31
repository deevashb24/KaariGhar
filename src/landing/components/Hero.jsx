import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { AnimatePresence, motion } from 'framer-motion';
import HlsVideo from './HlsVideo';

const ROLES = ['Artisans', 'Curators', 'Narrators', 'Architects'];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.name-reveal',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1 }
      ).fromTo('.blur-in',
        { opacity: 0, filter: 'blur(10px)', y: 20 },
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: 0.1, delay: -0.8 }
      );
    }, heroRef);

    const roleTimer = setInterval(() => {
      setRoleIndex((i) => (i + 1) % ROLES.length);
    }, 2000);

    return () => {
      ctx.revert();
      clearInterval(roleTimer);
    };
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden video-grain"
    >
      {/* HLS Background Video */}
      <HlsVideo className="absolute inset-0 w-full h-full object-cover" />

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/45 z-[1]" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[hsl(var(--bg))] to-transparent z-[2]" />

      {/* Hero Content */}
      <div className="relative z-[3] text-center px-6 max-w-4xl mx-auto">

        {/* Eyebrow */}
        <p className="blur-in text-xs text-[hsl(var(--muted))] uppercase tracking-[0.4em] mb-8">
          Heritage &amp; Craft — Est. 2024
        </p>

        {/* Brand Name */}
        <h1 className="name-reveal font-display italic text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight text-[hsl(var(--text))] mb-6">
          KaariGhar
        </h1>

        {/* Dynamic Role Line */}
        <div className="blur-in flex items-center justify-center gap-2 mb-6 text-lg md:text-xl text-[hsl(var(--muted))]">
          <span>We are</span>
          <span className="relative w-32 md:w-40 overflow-hidden inline-flex justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                className="font-display italic text-[hsl(var(--text))]"
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                {ROLES[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
          <span>of space.</span>
        </div>

        {/* Description */}
        <p className="blur-in text-sm md:text-base text-[hsl(var(--muted))] max-w-md mx-auto mb-12 leading-relaxed">
          Every room we conceive is a conversation between material and memory.
          We build spaces that do not merely shelter — they resonate.
        </p>

        {/* CTA Buttons */}
        <div className="blur-in flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#spaces"
            className="group relative px-8 py-4 rounded-full text-sm font-medium tracking-[0.1em] uppercase
              text-[hsl(var(--bg))] accent-gradient overflow-hidden
              transition-all duration-300 hover:shadow-[0_0_30px_rgba(138,175,212,0.35)]"
          >
            <span className="relative z-10">Explore Collections</span>
          </a>
          <a
            href="#materials"
            className="group px-8 py-4 rounded-full text-sm font-medium tracking-[0.1em] uppercase
              text-[hsl(var(--text))] border border-white/20
              hover:border-[#8AAFD4] transition-all duration-300
              hover:shadow-[0_0_20px_rgba(138,175,212,0.15)]"
          >
            View Materials
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center gap-2">
        <span className="text-[10px] text-[hsl(var(--muted))] uppercase tracking-[0.3em]">Scroll</span>
        <div className="relative w-px h-12 bg-[hsl(var(--stroke))] overflow-hidden rounded-full">
          <div className="absolute top-0 left-0 right-0 h-4 accent-gradient scroll-indicator rounded-full" />
        </div>
      </div>
    </section>
  );
}
