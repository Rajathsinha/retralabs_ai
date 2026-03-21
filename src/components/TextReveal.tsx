/**
 * TextReveal — Signature animation.
 *
 * Each word (or char) lives inside an overflow:hidden container.
 * The inner span slides up from y:"110%" into y:"0%".
 * This creates the venetian-blind stamp effect used by Stripe, Linear, Apple.
 *
 * It LOOKS like the text is being revealed from behind a mask — because it is.
 * No opacity trick. The word physically rises into view.
 *
 * Usage:
 *   <TextReveal text="Purity You Can Trust." className="text-5xl font-bold" />
 *   <TextReveal text="Results That Speak." delay={0.3} stagger={0.08} />
 */
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { EASE_SHARP, DUR } from '../animations/variants';

interface TextRevealProps {
  text: string;
  className?: string;
  /** Initial delay before first word animates (seconds) */
  delay?: number;
  /** Delay between each word/char (seconds) */
  stagger?: number;
  /** Split by words (default) or individual characters */
  splitBy?: 'words' | 'chars';
  /** Semantic tag for the wrapper */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  /** Trigger once (default) or every time it enters viewport */
  once?: boolean;
}

export default function TextReveal({
  text,
  className = '',
  delay = 0,
  stagger = 0.065,
  splitBy = 'words',
  as: Tag = 'span',
  once = true,
}: TextRevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  const units = splitBy === 'chars' ? text.split('') : text.split(' ');

  return (
    <Tag
      className={className}
      aria-label={text}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: splitBy === 'words' ? '0.3em' : '0',
      }}
    >
      {units.map((unit, i) => (
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
          aria-hidden="true"
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '115%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once, margin: '0px 0px -10px 0px' }}
            transition={{
              duration: DUR.slow,
              ease: EASE_SHARP,
              delay: delay + i * stagger,
            }}
          >
            {unit}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
