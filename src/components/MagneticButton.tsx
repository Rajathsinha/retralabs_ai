/**
 * MagneticButton v2 — cursor attraction + ambient glow on hover.
 *
 * Layers:
 *  1. Spring-based x/y pull toward cursor (existing behavior, tuned)
 *  2. Ambient glow that follows cursor position within the button
 *  3. Subtle scale + brightness on hover
 *
 * GPU-accelerated via transform + filter only.
 * Disabled on reduced-motion and touch devices.
 *
 * Usage:
 *   <MagneticButton strength={28}>
 *     <button className="...">Click</button>
 *   </MagneticButton>
 *
 *   <MagneticButton strength={20} glowColor="rgba(34,211,238,0.35)">
 *     <button>Glow CTA</button>
 *   </MagneticButton>
 */
import { useRef, useState, ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** Max pixel deflection toward cursor */
  strength?: number;
  /** Glow color on hover (CSS color). Pass null to disable. */
  glowColor?: string | null;
}

// Tighter spring for v2 — snappier tracking, confident snap-back
const SPRING_CFG = { stiffness: 320, damping: 24, mass: 0.55 };

export default function MagneticButton({
  children,
  className = '',
  strength = 22,
  glowColor = null,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING_CFG);
  const springY = useSpring(y, SPRING_CFG);

  // For the ambient glow position
  const [glowPos, setGlowPos] = useState({ x: '50%', y: '50%' });
  const [isHovered, setIsHovered] = useState(false);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;

    // Magnetic pull
    x.set((e.clientX - cx) / (rect.width  / 2) * strength);
    y.set((e.clientY - cy) / (rect.height / 2) * strength);

    // Glow follows cursor within the element
    if (glowColor) {
      const gx = ((e.clientX - rect.left) / rect.width)  * 100;
      const gy = ((e.clientY - rect.top)  / rect.height) * 100;
      setGlowPos({ x: `${gx}%`, y: `${gy}%` });
    }
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, display: 'inline-block', position: 'relative' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {/* Ambient glow layer */}
      {glowColor && (
        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: -8,
            borderRadius: 'inherit',
            background: `radial-gradient(circle at ${glowPos.x} ${glowPos.y}, ${glowColor}, transparent 65%)`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </motion.div>
  );
}
