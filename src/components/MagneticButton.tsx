/**
 * Magnetic button — element gently pulls toward the cursor on hover.
 * Uses Framer Motion springs for smooth snap-back on mouse leave.
 * GPU-accelerated via transform only.
 *
 * Usage:
 *   <MagneticButton strength={30}>
 *     <button>Click me</button>
 *   </MagneticButton>
 */
import { useRef, ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** How many pixels the element moves toward the cursor at full deflection */
  strength?: number;
}

const SPRING_CONFIG = { stiffness: 280, damping: 22, mass: 0.6 };

export default function MagneticButton({
  children,
  className = '',
  strength = 22,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING_CONFIG);
  const springY = useSpring(y, SPRING_CONFIG);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    // Normalize to [-1, 1], scale by strength
    x.set((e.clientX - cx) / (rect.width  / 2) * strength);
    y.set((e.clientY - cy) / (rect.height / 2) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, display: 'inline-block' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}
