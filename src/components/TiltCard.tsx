import { useRef, ReactNode } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number; // default 10°
}

/**
 * 3D tilt card wrapper.
 * Applies perspective rotate based on cursor position.
 * Has a radial-gradient glow overlay that follows the cursor.
 * Auto-disabled on touch devices.
 */
export default function TiltCard({ children, className = '', intensity = 10 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (isTouch) return;
    const card = cardRef.current;
    if (!card) return;

    const r  = card.getBoundingClientRect();
    const x  = e.clientX - r.left;
    const y  = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * intensity;
    const ry = ((x / r.width)  - 0.5) * -intensity;

    card.style.transform  = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.01)`;
    card.style.transition = 'none';
    card.style.setProperty('--mx', x + 'px');
    card.style.setProperty('--my', y + 'px');
  }

  function handleMouseLeave() {
    if (isTouch) return;
    const card = cardRef.current;
    if (!card) return;
    card.style.transform  = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
  }

  return (
    <div
      ref={cardRef}
      className={`tilt-card-wrapper relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {/* Glow overlay — positioned by --mx/--my CSS vars set on mousemove */}
      <div className="tilt-glow-overlay" aria-hidden="true" />
      {children}
    </div>
  );
}
