/**
 * Lerp-ring cursor — RetraLabs redesign.
 *
 * A small dot snaps exactly to the mouse.
 * A larger ring lags behind with linear interpolation (speed = 0.11).
 * Both elements are CSS-only divs (#retra-cursor, #retra-cursor-ring)
 * and are hidden on touch/reduced-motion devices.
 */
import { useEffect } from 'react';

export default function CursorGlow() {
  useEffect(() => {
    // Only activate on true pointer devices
    const isPointer = window.matchMedia('(pointer: fine)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isPointer || isReduced) return;

    const dot  = document.getElementById('retra-cursor');
    const ring = document.getElementById('retra-cursor-ring');
    if (!dot || !ring) return;

    // Show elements
    dot.style.display  = 'block';
    ring.style.display = 'block';

    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let rx = cx;
    let ry = cy;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      dot.style.left = cx + 'px';
      dot.style.top  = cy + 'px';
    };

    function lerpRing() {
      rx += (cx - rx) * 0.11;
      ry += (cy - ry) * 0.11;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      rafId = requestAnimationFrame(lerpRing);
    }

    lerpRing();
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Hover state — expand ring + tint dot
    const hoverTargets = 'button, a, .tilt-card-wrapper, [role="button"], input, select, textarea, label';
    function addHover() { document.body.classList.add('cursor-hovering'); }
    function removeHover() { document.body.classList.remove('cursor-hovering'); }

    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', removeHover);
    });

    // Also handle dynamically added elements via delegation
    document.addEventListener('mouseenter', (e) => {
      if ((e.target as Element)?.matches?.(hoverTargets)) addHover();
    }, true);
    document.addEventListener('mouseleave', (e) => {
      if ((e.target as Element)?.matches?.(hoverTargets)) removeHover();
    }, true);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      document.body.classList.remove('cursor-hovering');
      if (dot)  dot.style.display  = 'none';
      if (ring) ring.style.display = 'none';
    };
  }, []);

  return (
    <>
      <div id="retra-cursor"      aria-hidden="true" style={{ display: 'none' }} />
      <div id="retra-cursor-ring" aria-hidden="true" style={{ display: 'none' }} />
    </>
  );
}
