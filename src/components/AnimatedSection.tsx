/**
 * AnimatedSection — scroll-triggered animation wrapper. v2.
 *
 * Defaults upgraded from basic fadeUp to multi-property RISE.
 * Supports perspective for 3D depth on child elements.
 * GPU-accelerated, reduced-motion safe.
 *
 * Usage:
 *   <AnimatedSection>content</AnimatedSection>
 *   <AnimatedSection variants={SURFACE} delay={0.1}>card</AnimatedSection>
 *   <AnimatedSection perspective>3D content</AnimatedSection>
 */
import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';
import { RISE } from '../animations/variants';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface AnimatedSectionProps {
  children: ReactNode;
  variants?: Variants;
  delay?: number;
  className?: string;
  /** Viewport margin — how early to trigger (default: 80px from bottom) */
  margin?: string;
  /** Animate only once (default: true) */
  once?: boolean;
  /** Semantic tag */
  as?: 'div' | 'section' | 'article' | 'li' | 'span';
  /** Add CSS perspective for 3D child animations */
  perspective?: boolean;
}

export default function AnimatedSection({
  children,
  variants,
  delay = 0,
  className = '',
  margin = '0px 0px -80px 0px',
  once = true,
  as = 'div',
  perspective = false,
}: AnimatedSectionProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  const base = variants ?? RISE;

  const appliedVariants: Variants = {
    hidden: base.hidden,
    visible: {
      ...(base.visible as object),
      transition: {
        ...((base.visible as { transition?: object }).transition ?? {}),
        delay,
      },
    },
  };

  if (reduced) {
    const Tag = as as keyof JSX.IntrinsicElements;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      style={perspective ? { perspective: '1200px' } : undefined}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      variants={appliedVariants}
    >
      {children}
    </MotionTag>
  );
}
