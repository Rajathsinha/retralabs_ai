import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0;
    const particles: Particle[] = [];
    const PARTICLE_COUNT = 80;
    const mouse = { x: -999, y: -999 };

    function resize() {
      W = canvas!.width  = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }

    function makeParticle(): Particle {
      return {
        x:       Math.random() * W,
        y:       Math.random() * H,
        vx:      (Math.random() - 0.5) * 0.3,
        vy:      (Math.random() - 0.5) * 0.3,
        size:    Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      };
    }

    function resetParticle(p: Particle) {
      p.x       = Math.random() * W;
      p.y       = Math.random() * H;
      p.vx      = (Math.random() - 0.5) * 0.3;
      p.vy      = (Math.random() - 0.5) * 0.3;
      p.size    = Math.random() * 1.5 + 0.5;
      p.opacity = Math.random() * 0.4 + 0.1;
    }

    function updateParticle(p: Particle) {
      p.x += p.vx;
      p.y += p.vy;

      // Mouse repulsion
      const dx   = p.x - mouse.x;
      const dy   = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = 0.5;
        p.vx += (dx / dist) * force * 0.02;
        p.vy += (dy / dist) * force * 0.02;
      }

      // Dampen velocity
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Reset if out of bounds
      if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) resetParticle(p);
    }

    function drawParticle(p: Particle) {
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(0,0,0,${p.opacity})`;
      ctx!.fill();
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(26,107,74,${0.08 * (1 - dist / 100)})`;
            ctx!.lineWidth   = 0.5;
            ctx!.stroke();
          }
        }
      }
    }

    let animId: number;
    function animate() {
      ctx!.clearRect(0, 0, W, H);
      particles.forEach(p => { updateParticle(p); drawParticle(p); });
      drawConnections();
      animId = requestAnimationFrame(animate);
    }

    // Init
    resize();
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(makeParticle());
    animate();

    // Events
    const onResize = () => resize();
    const onMouse  = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave  = () => { mouse.x = -999; mouse.y = -999; };

    window.addEventListener('resize',    onResize);
    window.addEventListener('mousemove', onMouse);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize',    onResize);
      window.removeEventListener('mousemove', onMouse);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        inset:         0,
        pointerEvents: 'none',
        zIndex:        0,
        opacity:       0.6,
      }}
    />
  );
}
