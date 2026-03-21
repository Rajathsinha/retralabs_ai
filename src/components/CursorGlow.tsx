/**
 * Subtle cursor-following radial glow effect.
 * Uses lerp (linear interpolation) for smooth lag — creates the "light follows" feel.
 * GPU-composited via will-change: transform, renders on top of everything via z-50.
 *
 * Only renders on desktop (pointer: fine) — no effect on touch screens.
 * Automatically hidden on reduced-motion preference.
 */
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const LERP_SPEED = 0.075; // lower = more lag (more dreamy), higher = tighter follow
const GLOW_SIZE  = 420;   // px diameter

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const glow = glowRef.current;
    if (!glow) return;

    // Only activate on pointer devices (not touch)
    const isPointer = window.matchMedia('(pointer: fine)').matches;
    if (!isPointer) return;

    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;
    let glowX  = mouseX;
    let glowY  = mouseY;
    let rafId: number;
    const half = GLOW_SIZE / 2;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      // Lerp toward cursor — produces the smooth lag
      glowX += (mouseX - glowX) * LERP_SPEED;
      glowY += (mouseY - glowY) * LERP_SPEED;
      // translate so the glow is centered on the cursor
      glow.style.transform = `translate3d(${glowX - half}px,${glowY - half}px,0)`;
      rafId = requestAnimationFrame(animate);
    };

    glow.style.opacity = '1';
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top:    0,
        left:   0,
        zIndex: 9999,
        width:  GLOW_SIZE,
        height: GLOW_SIZE,
        borderRadius: '50%',
        pointerEvents: 'none',
        opacity:  0,   // starts hidden, JS fades it in after first mousemove
        willChange: 'transform',
        background: `radial-gradient(
          circle at center,
          rgba(34,211,238,0.13) 0%,
          rgba(34,211,238,0.04) 40%,
          transparent 70%
        )`,
        transition: 'opacity 0.4s ease',
      }}
    />
  );
}
