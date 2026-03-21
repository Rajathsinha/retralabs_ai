/**
 * SmoothScroll — lightweight scroll behaviour provider.
 *
 * Replaced Lenis with a pure CSS + Framer Motion approach.
 * CSS scroll-behavior handles anchor links and programmatic scrollTo.
 * momentum-scroll class enables -webkit-overflow-scrolling on iOS.
 *
 * This removes ~24KB (Lenis) from the bundle.
 * Reduced-motion: scroll-behavior set to 'auto'.
 */
import { useEffect, ReactNode } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const html = document.documentElement;
    html.style.scrollBehavior = reduced ? 'auto' : 'smooth';
    return () => { html.style.scrollBehavior = 'auto'; };
  }, [reduced]);

  return <>{children}</>;
}
