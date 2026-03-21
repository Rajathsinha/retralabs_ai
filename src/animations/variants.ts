/**
 * RetraLabs Motion System v2
 * Identity: Sharp. Confident. Premium.
 *
 * Rules:
 *  — GPU-only: transform + opacity + filter. Never layout-affecting props.
 *  — Every easing is a named cubic-bezier. No 'ease', no 'linear'.
 *  — Depth through blur + scale + perspective — not just y-offset.
 *  — Exits are fast (0.2s). Entrances breathe (0.5–0.7s).
 */

// ── Easing vocabulary ─────────────────────────────────────────────────────────

/** Aggressive ease-out. No ramp-up. Lands with authority. Linear.app style. */
export const EASE_SHARP  = [0.0,  0.0,  0.2,  1   ] as const;

/** Apple-style. Fast start, graceful landing. Most UI elements. */
export const EASE_OUT    = [0.22, 1.0,  0.36, 1   ] as const;

/** iOS spring feel. Snappy with soft settle. For interactive elements. */
export const EASE_SPRING = [0.16, 1.0,  0.3,  1   ] as const;

/** Smooth material-style entrance. Polished, never aggressive. */
export const EASE_SILK   = [0.25, 0.46, 0.45, 0.94] as const;

/** Fast exit. Disappears quickly, doesn't linger. */
export const EASE_IN     = [0.4,  0.0,  1.0,  1   ] as const;

// ── Duration tiers (seconds) ─────────────────────────────────────────────────
export const DUR = {
  micro:    0.12,
  fast:     0.22,
  base:     0.45,
  slow:     0.65,
  dramatic: 0.9,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// ENTRY VARIANTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * RISE — multi-property depth entrance.
 * Scale + blur + lift. Creates physical depth, not flat animation.
 * Use for: hero sections, primary content blocks.
 */
export const RISE = {
  hidden:  { opacity: 0, y: 52, scale: 0.96, filter: 'blur(8px)' },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
    transition: { duration: DUR.slow, ease: EASE_OUT },
  },
};

/**
 * SLASH — kinetic horizontal entry with slight rotation.
 * Enters with momentum, lands precisely. Like a cut.
 * Use for: section labels, eyebrow text, stats.
 */
export const SLASH = {
  hidden:  { opacity: 0, x: -32, rotate: -0.6, filter: 'blur(4px)' },
  visible: {
    opacity: 1, x: 0, rotate: 0, filter: 'blur(0px)',
    transition: { duration: DUR.base, ease: EASE_SHARP },
  },
};

/**
 * SURFACE — 3D lift from a flat plane.
 * rotateX gives the illusion of peeling off a surface.
 * Use for: cards, modals, product images.
 */
export const SURFACE = {
  hidden:  { opacity: 0, y: 28, scale: 0.94, rotateX: 10 },
  visible: {
    opacity: 1, y: 0, scale: 1, rotateX: 0,
    transition: { duration: DUR.slow, ease: EASE_SPRING },
  },
};

/**
 * EMERGE — clean opacity + blur + micro-lift.
 * For body text and supporting elements. No distortion.
 */
export const EMERGE = {
  hidden:  { opacity: 0, y: 16, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
};

/**
 * POP — scale from 70%, spring settle.
 * Use for: badges, chips, icons, tags.
 */
export const POP = {
  hidden:  { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: DUR.base, ease: EASE_SPRING },
  },
};

/**
 * CLIP_REVEAL — horizontal clip-path wipe. (SIGNATURE)
 * Blind sweeps left-to-right revealing content below.
 * Stripe, Linear, Apple all use this for premium feel.
 * Use for: section headers, key phrases, image reveals.
 */
export const CLIP_REVEAL = {
  hidden:  { clipPath: 'inset(0 100% 0 0)' },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: DUR.dramatic, ease: EASE_SHARP },
  },
};

/**
 * CLIP_UP — clip from bottom upward. Text stamps in.
 * Use for: large display numbers, stat values.
 */
export const CLIP_UP = {
  hidden:  { clipPath: 'inset(110% 0 0 0)' },
  visible: {
    clipPath: 'inset(0% 0 0 0)',
    transition: { duration: DUR.slow, ease: EASE_SHARP },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STAGGER CONTAINERS
// ═══════════════════════════════════════════════════════════════════════════════

/** Tight cascade — nav items, tags, small lists */
export const CASCADE = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
};

/** Wave — feature cards, product grids */
export const WAVE = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

/** Drift — hero content, slow dramatic entrances */
export const DRIFT = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.08 } },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE + HERO
// ═══════════════════════════════════════════════════════════════════════════════

export const pageEnter = {
  initial:  { opacity: 0, y: 16, filter: 'blur(6px)' },
  animate:  { opacity: 1, y: 0,  filter: 'blur(0px)',  transition: { duration: DUR.base,  ease: EASE_OUT } },
  exit:     { opacity: 0, y: -12, filter: 'blur(2px)', transition: { duration: DUR.fast,  ease: EASE_IN  } },
};

/** Hero headline word — 3D rotateX + blur. Deep entrance. */
export const heroWord = {
  hidden:  { opacity: 0, y: 40, rotateX: -24, filter: 'blur(10px)' },
  visible: {
    opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
    transition: { duration: DUR.slow, ease: EASE_SPRING },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// INFINITE LOOPS
// ═══════════════════════════════════════════════════════════════════════════════

export const orbFloat = {
  animate: {
    y:     [0, -28, 0],
    scale: [1, 1.05, 1],
    transition: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const orbFloat2 = {
  animate: {
    y:     [0, 22, 0],
    scale: [1, 0.95, 1],
    transition: { duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 },
  },
};

export const PULSE = {
  animate: {
    scale:   [1, 1.06, 1],
    opacity: [0.6, 1, 0.6],
    transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// BACKWARDS-COMPATIBLE ALIASES — all existing imports keep working
// ═══════════════════════════════════════════════════════════════════════════════
export const fadeUp      = RISE;
export const fadeDown    = { hidden: { opacity: 0, y: -22 },       visible: { opacity: 1, y: 0,       transition: { duration: DUR.base,  ease: EASE_OUT   } } };
export const fadeIn      = EMERGE;
export const slideLeft   = SLASH;
export const slideRight  = { hidden: { opacity: 0, x: 36,  filter: 'blur(4px)' }, visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: DUR.base, ease: EASE_SHARP } } };
export const scaleIn     = SURFACE;
export const scaleUp     = RISE;
export const staggerFast   = CASCADE;
export const staggerMedium = WAVE;
export const staggerSlow   = { hidden: {}, visible: { transition: { staggerChildren: 0.2, delayChildren: 0.1 } } };
export const cardHover     = { rest: { scale: 1, y: 0 }, hover: { scale: 1.02, y: -6, transition: { duration: DUR.fast, ease: EASE_OUT } } };
