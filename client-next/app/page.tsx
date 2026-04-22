"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import LenisProvider from "@/components/LenisProvider";
import CanvasBackground from "@/components/CanvasBackground";
import FluidCursor from "@/components/FluidCursor";
import Image from "next/image";

export default function LandingPage() {
  const textRefs = useRef<(HTMLHeadingElement | null)[]>([]);

  useEffect(() => {
    // Parallax background using GSAP
    gsap.utils.toArray(".parallax-bg").forEach((bg: any) => {
      gsap.to(bg, {
        backgroundPosition: "50% 100%",
        ease: "none",
        scrollTrigger: {
          trigger: bg,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    // Typography kinetic reveal animation
    textRefs.current.forEach((text) => {
      if (!text) return;
      gsap.fromTo(
        text,
        { y: 100, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: text,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

  }, []);

  const addToRefs = (el: HTMLHeadingElement | null) => {
    if (el && !textRefs.current.includes(el)) {
      textRefs.current.push(el);
    }
  };

  return (
    <LenisProvider>
      <FluidCursor />

      {/* TopNavBar component */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/15 bg-black/10 backdrop-blur-[20px]">
        <div className="flex justify-between items-center px-[5vw] py-6 w-full">
          <div className="text-2xl font-black tracking-tighter text-[#d4af37]">KaariGhar</div>
          <div className="hidden md:flex gap-8">
            <a className="font-['Epilogue'] uppercase tracking-widest text-[12px] font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300 scale-95 active:scale-90" href="#">Collections</a>
            <a className="font-['Epilogue'] uppercase tracking-widest text-[12px] font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300 scale-95 active:scale-90" href="#">Artisans</a>
            <a className="font-['Epilogue'] uppercase tracking-widest text-[12px] font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300 scale-95 active:scale-90" href="#">Process</a>
            <a className="font-['Epilogue'] uppercase tracking-widest text-[12px] font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300 scale-95 active:scale-90" href="#">Contact</a>
          </div>
          <Link href="/login" className="font-label-caps text-label-caps text-on-primary bg-primary-container px-6 py-3 rounded-full hover:bg-primary-fixed-dim transition-colors">
            Login / Sign Up
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {/* Section 1: The Mission */}
        <section className="parallax-bg min-h-screen relative flex items-center justify-center bg-fixed-parallax pt-[100px] overflow-hidden" style={{ backgroundImage: "linear-gradient(rgba(15, 15, 15, 0.7), rgba(15, 15, 15, 0.85)), url('https://lh3.googleusercontent.com/aida/ADBb0ujUBiAnY1BbJd04NAX89rDMXYir9AX0pc7YOWXDzs0NQ3hFgFvQvMcZfxyW8T9-WAmyuWqjd0Qqse2IM8mX22XV9_oNsgoeT4YCIcxKKjqq36uy7AUlOiseAK-VRZN44X4JE6NJMWNEbpMtTxYMek5YRp10e00ATtWIAZceRaTJy0XMyDil-FeLKL1n1N8hycOCqSfNAWT4iV-8XvNgPs2GuKNp-5sILeae4gvpBa2q67HUKCgFVn1vd51RoC2lHTfcoxwHKnYjbyI')" }}>
          <CanvasBackground />
          <div className="relative z-10 px-container-margin w-full max-w-[1400px] mx-auto py-section-gap grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 flex flex-col gap-stack-lg">
              <h1 ref={addToRefs} className="font-display-giant text-display-giant text-[#d4af37] drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] uppercase break-words">
                RECLAIMING TRUST IN CRAFT
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                Bridging the gap between discerning connoisseurs and master artisans. We authenticate every maker, curating a private gallery of bespoke furniture where raw materials are transformed into legacy pieces.
              </p>
            </div>
            <div className="lg:col-span-4 w-full">
              <div className="bg-white/10 backdrop-blur-[20px] border border-white/15 rounded-xl p-8 flex flex-col gap-stack-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="flex items-center gap-unit mb-2">
                  <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Verified Maker Discovery</h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Our rigorous vetting process ensures only the most skilled craftsmen join our ecosystem, bringing transparency and prestige to custom commissions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Customer Experience */}
        <section className="parallax-bg min-h-screen relative flex items-center justify-center bg-fixed-parallax overflow-hidden" style={{ backgroundImage: "linear-gradient(rgba(15, 15, 15, 0.7), rgba(15, 15, 15, 0.85)), url('https://lh3.googleusercontent.com/aida/ADBb0ugIugo87bIBPI9DVUee2lksjkI9EWkj7DeQoOutFWnVShLcid7i6agPwXNnRPZfFBZ_VwWhxLyTsAEhNNjLVAG6aJAkxLre81JQ1LSoB3t1ndaatd7J006h3Jm3BuYvi8RZVQF_KJlD6E482IyvAhpr1F3f4OSM-BSEu5n4ZlBtjaDj7KZolfHPva5CZCRqSxJmYLcRZ_MS1j6QDCrNoXZTASIFvCIV-MvqTr6XudUUgYgzLTKSFI9tOOemGzE-U2ara0LqBPEd8A')" }}>
          <CanvasBackground />
          <div className="relative z-10 px-container-margin w-full max-w-[1400px] mx-auto py-section-gap grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col gap-stack-lg">
              <h2 ref={addToRefs} className="font-display-giant text-display-giant text-[#d4af37] drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] leading-[0.85] uppercase break-words">
                DESIGN<br />YOUR<br />PIECE
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Translate your vision into exacting specifications. Our structured creation tool empowers you to define every curve, joint, and finish, bridging the gap between imagination and artisan execution.
              </p>
            </div>
            <div className="lg:col-span-5 w-full">
              <div className="bg-surface-container-high/80 backdrop-blur-[20px] border border-white/5 rounded-xl p-8 flex flex-col gap-stack-md">
                <h4 className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest border-b border-white/10 pb-4">Commission Specs</h4>
                <div className="flex flex-col gap-unit">
                  <div className="flex justify-between items-end mb-1">
                    <label className="font-body-sm text-body-sm text-on-surface-variant">Height</label>
                    <span className="font-label-caps text-label-caps text-primary-container">120cm</span>
                  </div>
                  <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
                    <div className="bg-primary-container h-full w-[60%]"></div>
                  </div>
                </div>
                <div className="flex flex-col gap-unit">
                  <div className="flex justify-between items-end mb-1">
                    <label className="font-body-sm text-body-sm text-on-surface-variant">Width</label>
                    <span className="font-label-caps text-label-caps text-primary-container">240cm</span>
                  </div>
                  <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
                    <div className="bg-primary-container h-full w-[85%]"></div>
                  </div>
                </div>
                <div className="flex flex-col gap-stack-sm mt-4">
                  <label className="font-body-sm text-body-sm text-on-surface-variant">Wood Finish</label>
                  <div className="grid grid-cols-3 gap-unit">
                    <div className="h-12 rounded bg-[#3e2723] border-2 border-primary-container cursor-pointer flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[16px]">check</span>
                    </div>
                    <div className="h-12 rounded bg-[#5d4037] border border-white/10 cursor-pointer hover:border-white/30 transition-colors"></div>
                    <div className="h-12 rounded bg-[#8d6e63] border border-white/10 cursor-pointer hover:border-white/30 transition-colors"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Maker Experience */}
        <section className="parallax-bg min-h-screen relative flex items-center justify-center bg-fixed-parallax overflow-hidden" style={{ backgroundImage: "linear-gradient(rgba(15, 15, 15, 0.7), rgba(15, 15, 15, 0.85)), url('https://lh3.googleusercontent.com/aida/ADBb0ui10vIzbtq0RoekIvw58RqxRu51jXQUDCGJCRJWZrFSydvZRhvygCcR8qWIRsfyIUrk2YLXY1X-LYL2YZcOiaGyH3CfUcEZCyHqog4G4S-XlTVBnn_LD1h0PvD7bcNCTEuiMaiecRFaNv_fagBizsRB3DQ_WTwIzDOBhUwDfM1QC_024jiWI7hx2p9i0Rwi-FQmE2ieLRzcarWSAgltjO2fP-ePZN-GMWBhoYfzjKFKNs0FNW-yfXmJvqOmsL5m_wxFdVWYnobgA00')" }}>
          <CanvasBackground />
          <div className="relative z-10 px-container-margin w-full max-w-[1400px] mx-auto py-section-gap flex flex-col items-center text-center gap-stack-lg">
            <h2 ref={addToRefs} className="font-display-giant text-display-giant text-[#d4af37] drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] uppercase max-w-5xl mx-auto break-words">
              SHOWCASE YOUR MASTERY
            </h2>
            <div className="flex gap-4 justify-center items-center mb-stack-sm">
              <span className="px-4 py-1.5 rounded-full border border-primary-container text-primary-container font-label-caps text-label-caps bg-primary-container/10">Category: Custom Bed</span>
            </div>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Connect with clients who value true craftsmanship. Manage high-quality leads, refine proposals, and utilize our intelligent tools to streamline the commission process from sketch to delivery.
            </p>
            <button className="mt-stack-md flex items-center gap-2 px-8 py-4 rounded-full bg-secondary/10 border border-secondary text-secondary font-label-caps text-label-caps hover:bg-secondary/20 transition-all duration-300 backdrop-blur-md relative overflow-hidden group">
              <span className="absolute inset-0 bg-secondary/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></span>
              <span className="relative z-10">✨ GET AI HELP</span>
            </button>
          </div>
        </section>

        {/* Section 4: Final CTA */}
        <section className="parallax-bg min-h-[716px] flex flex-col items-center justify-center px-container-margin text-center gap-stack-lg border-t border-white/5 bg-fixed-parallax" style={{ backgroundImage: "linear-gradient(rgba(15, 15, 15, 0.7), rgba(15, 15, 15, 0.85)), url('https://lh3.googleusercontent.com/aida/ADBb0ujp8veuEveE2o5Gc6cE1BhyJMX8Ss0eLZGNIWg3PGeRFvcgzxPo7Y_R7wNSPQDVRDv9kkH6trVXxDi4ZID2l330ga0spfXnJDkQAVJxnfvkqy-Igdb8L-2VKo0iWGH4qzQEPHefVYm5qIuWe5Yf9VcEZq7mb9pKsQwSceSAWU-yZMwS-xLQhwWpzClRRCP1hmTiClE1mmDAR2S94X-Fzd043EneYU4mt6EuRF6KTf1DLTt3K9DyyiYpENVB7RxcsaCqDxdLE6XXiPA')" }}>
          <h2 ref={addToRefs} className="font-headline-lg text-headline-lg text-on-surface uppercase font-black tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            START YOUR JOURNEY
          </h2>
          <div className="flex flex-col items-center gap-stack-md">
            <a className="px-12 py-5 rounded-full bg-primary-container text-on-primary-container font-label-caps text-label-caps hover:bg-primary-fixed-dim transition-colors shadow-[0_0_30px_rgba(212,175,55,0.2)]" href="#">Explore Now</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant underline underline-offset-4 hover:text-white transition-colors" href="#">Skip for now</a>
          </div>
        </section>
      </main>

      {/* Footer component */}
      <footer className="relative z-20 w-full py-20 px-[5vw] border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-12 items-end bg-black/80 backdrop-blur-xl">
        <div className="flex flex-col gap-4">
          <div className="text-xl font-bold text-[#d4af37]">KaariGhar</div>
          <p className="font-['Epilogue'] text-sm tracking-tight text-white/40">© 2024 KaariGhar. Crafted for the Connoisseur.</p>
        </div>
        <div className="flex flex-wrap gap-8 md:justify-end">
          <a className="font-['Epilogue'] text-sm tracking-tight text-white/40 hover:text-[#d4af37] transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
          <a className="font-['Epilogue'] text-sm tracking-tight text-white/40 hover:text-[#d4af37] transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
          <a className="font-['Epilogue'] text-sm tracking-tight text-white/40 hover:text-[#d4af37] transition-colors opacity-80 hover:opacity-100" href="#">Sustainability</a>
          <a className="font-['Epilogue'] text-sm tracking-tight text-white/40 hover:text-[#d4af37] transition-colors opacity-80 hover:opacity-100" href="#">Global Shipping</a>
        </div>
      </footer>
    </LenisProvider>
  );
}
