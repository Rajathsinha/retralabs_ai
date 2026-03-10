/**
 * Lenis ultra-smooth scroll provider.
 * Wraps the entire app — all scroll events go through Lenis's RAF loop.
 * Uses GPU-accelerated scroll with natural physics easing.
 *
 * Automatically disabled when prefers-reduced-motion is set.
 */
import { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      // Expo-out easing — fast start, buttery stop (like iOS momentum)
      easing: (t: number) => 1 - Math.pow(2, -10 * t),
      smoothWheel: true,
      syncTouch: false, // Let native touch handle mobile (already smooth)
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  return <>{children}</>;
}
