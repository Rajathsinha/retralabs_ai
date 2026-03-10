/**
 * Lightweight canvas particle system for the hero background.
 * Uses only Canvas 2D API — no Three.js dependency, ~60 particles, 60fps.
 * GPU-composited via CSS `will-change: transform`.
 *
 * Particles rise slowly, fade in/out over their lifetime.
 * Cyan color matches the site's accent palette.
 *
 * Automatically stops on prefers-reduced-motion.
 */
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

const PARTICLE_COUNT = 55;
const COLORS = [
  'rgba(34,211,238,',   // cyan-400
  'rgba(56,189,248,',   // sky-400
  'rgba(99,102,241,',   // indigo-500
];

function createParticle(w: number, h: number): Particle {
  return {
    x:       Math.random() * w,
    y:       h + Math.random() * 40,          // start below visible area
    vx:      (Math.random() - 0.5) * 0.25,
    vy:      -(Math.random() * 0.45 + 0.15),  // always drifts upward
    size:    Math.random() * 1.8 + 0.4,
    opacity: Math.random() * 0.55 + 0.1,
    life:    0,
    maxLife: 140 + Math.random() * 120,
  };
}

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Size canvas to container
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Seed particles spread across the canvas
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const p = createParticle(canvas.width, canvas.height);
      p.y    = Math.random() * canvas.height; // scatter vertically on init
      p.life = Math.random() * p.maxLife;     // stagger lifetimes
      return p;
    });

    let rafId: number;

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      particles.forEach((p, i) => {
        p.x    += p.vx;
        p.y    += p.vy;
        p.life += 1;

        const progress = p.life / p.maxLife;
        // Ease-in first 10%, steady, ease-out last 25%
        const alpha =
          progress < 0.1  ? (progress / 0.1)  * p.opacity :
          progress > 0.75 ? ((1 - progress) / 0.25) * p.opacity :
          p.opacity;

        const color = COLORS[i % COLORS.length];
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `${color}${alpha.toFixed(2)})`;
        ctx!.fill();

        // Recycle when lifetime ends or drifts out of view
        if (p.life >= p.maxLife || p.y < -10) {
          particles[i] = createParticle(canvas!.width, canvas!.height);
        }
      });

      rafId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7, willChange: 'transform' }}
    />
  );
}
