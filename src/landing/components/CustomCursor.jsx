import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Custom two-part cursor: a small dot + a trailing ring.
 * Renders nothing on touch devices.
 */
export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (isTouchDevice) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Dot snaps instantly
      gsap.set(dot, { x: mouseX, y: mouseY });

      // Ring lags behind
      gsap.to(ring, {
        x: mouseX,
        y: mouseY,
        duration: 0.55,
        ease: 'expo.out',
      });
    };

    const onEnterHoverable = () => ring.classList.add('is-hovering');
    const onLeaveHoverable = () => ring.classList.remove('is-hovering');

    window.addEventListener('mousemove', onMove);

    // Attach to all interactive elements
    const hoverEls = document.querySelectorAll('a, button, [data-cursor-hover]');
    hoverEls.forEach((el) => {
      el.addEventListener('mouseenter', onEnterHoverable);
      el.addEventListener('mouseleave', onLeaveHoverable);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      hoverEls.forEach((el) => {
        el.removeEventListener('mouseenter', onEnterHoverable);
        el.removeEventListener('mouseleave', onLeaveHoverable);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
