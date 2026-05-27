/**
 * TrustpilotSection — premium custom review showcase.
 *
 * Design: Apple testimonials × Linear UI × luxury biotech.
 * Two bidirectional auto-scrolling rows, glassmorphism cards,
 * ambient glow, hover pause + lift, Framer Motion entrance.
 *
 * NOTE: Update REVIEWS array with your actual Trustpilot review text.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';

// ── Trustpilot brand star (exact SVG shape) ───────────────────────────────────
function TpStar({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 105 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M52.5 0L64.6 36.5H103.1L71.8 59.1L83.9 95.5L52.5 72.9L21.1 95.5L33.2 59.1L1.9 36.5H40.4L52.5 0Z"
        fill="#00b67a"
      />
    </svg>
  );
}

// ── Review data ───────────────────────────────────────────────────────────────
// Replace these with your actual Trustpilot review text and reviewer details.
const REVIEWS = [
  {
    id: 1,
    name: 'Rohit M.',
    location: 'Mumbai',
    text: "First legitimate source I've found in India. COA matched the batch number exactly — that traceability doesn't exist anywhere else here.",
    product: 'Retatrutide',
    date: 'May 2026',
    initial: 'R',
    gradient: 'from-cyan-400 to-blue-500',
  },
  {
    id: 2,
    name: 'Arjun S.',
    location: 'Bangalore',
    text: "Had been burned twice before. Took a chance on RetraLabs and I'm genuinely impressed. The quality is exactly what the HPLC report says.",
    product: 'BPC-157',
    date: 'Apr 2026',
    initial: 'A',
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    id: 3,
    name: 'Kiran P.',
    location: 'Hyderabad',
    text: "Clean packaging, real documentation, fast shipping. The compound quality is immediately obvious. This is what the Indian market has been missing.",
    product: 'GHK-Cu',
    date: 'Apr 2026',
    initial: 'K',
    gradient: 'from-violet-400 to-purple-500',
  },
  {
    id: 4,
    name: 'Vikram R.',
    location: 'Delhi',
    text: "Shipped same day, arrived cold-packed. HPLC report was detailed and matched perfectly. No games, no mystery sourcing.",
    product: 'Tirzepatide',
    date: 'Mar 2026',
    initial: 'V',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 5,
    name: 'Deepak N.',
    location: 'Chennai',
    text: "Professional service from start to finish. COA with every order, not on request. That alone puts them ahead of every other supplier I've tried.",
    product: 'NAD+',
    date: 'Mar 2026',
    initial: 'D',
    gradient: 'from-rose-400 to-pink-500',
  },
  {
    id: 6,
    name: 'Ananya T.',
    location: 'Pune',
    text: "Finally a supplier that treats researchers with respect. Support team actually understands the compounds they're selling. Rare in India.",
    product: 'Semax',
    date: 'Feb 2026',
    initial: 'A',
    gradient: 'from-sky-400 to-indigo-500',
  },
  {
    id: 7,
    name: 'Sahil K.',
    location: 'Gurgaon',
    text: "No fake listings, no counterfeit vials. Just quality compounds with real testing data. Exactly what the India market needed.",
    product: 'Selank',
    date: 'Jan 2026',
    initial: 'S',
    gradient: 'from-teal-400 to-emerald-500',
  },
];

type Review = typeof REVIEWS[number];

// ── Individual review card ────────────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  return (
    <motion.div
      className="relative flex-shrink-0 w-[288px] rounded-2xl p-5 cursor-default"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        willChange: 'transform',
      }}
      whileHover={{
        y: -8,
        scale: 1.025,
        background: 'rgba(255,255,255,0.05)',
        borderColor: 'rgba(255,255,255,0.14)',
        boxShadow:
          '0 28px 56px rgba(0,0,0,0.65), 0 0 0 1px rgba(0,182,122,0.13)',
        transition: { duration: 0.22, ease: 'easeOut' },
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px rounded-t-2xl pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 10%, rgba(0,182,122,0.35) 50%, transparent 90%)',
        }}
      />

      {/* Stars */}
      <div className="flex gap-[3px] mb-3">
        {[1, 2, 3, 4, 5].map(i => (
          <TpStar key={i} className="w-[14px] h-[14px]" />
        ))}
      </div>

      {/* Review text */}
      <p
        className="text-[13px] text-slate-300/90 leading-relaxed mb-4 line-clamp-3"
      >
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Reviewer row */}
      <div className="flex items-center gap-2.5">
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full bg-gradient-to-br ${review.gradient} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}
        >
          {review.initial}
        </div>

        {/* Name + location */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-[12px] font-semibold text-white leading-none truncate">
              {review.name}
            </span>
            <BadgeCheck className="w-3 h-3 text-emerald-400 shrink-0" />
          </div>
          <span className="text-[10px] text-slate-600 leading-none mt-0.5 block">
            {review.location}
          </span>
        </div>

        {/* Date */}
        <span className="text-[9px] text-slate-700 shrink-0 font-medium">
          {review.date}
        </span>
      </div>

      {/* Purchase indicator */}
      <div className="mt-3 pt-3 border-t border-white/[0.04]">
        <span className="text-[9px] text-slate-700 uppercase tracking-[0.1em] font-medium">
          ✓ Verified · {review.product}
        </span>
      </div>
    </motion.div>
  );
}

// ── Bidirectional scrolling row ───────────────────────────────────────────────
function ScrollRow({ reverse = false }: { reverse?: boolean }) {
  const [paused, setPaused] = useState(false);
  const doubled = [...REVIEWS, ...REVIEWS];
  const duration = reverse ? 48 : 36;
  const animName = reverse ? 'tp-right' : 'tp-left';

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex gap-4 py-2"
        style={{
          animation: `${animName} ${duration}s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
          willChange: 'transform',
        }}
      >
        {doubled.map((r, i) => (
          <ReviewCard key={`${r.id}-${i}`} review={r} />
        ))}
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function TrustpilotSection() {
  return (
    <section className="relative py-24 bg-[#040812] overflow-hidden">
      {/* Keyframes */}
      <style>{`
        @keyframes tp-left  { from { transform: translateX(0);    } to { transform: translateX(-50%); } }
        @keyframes tp-right { from { transform: translateX(-50%); } to { transform: translateX(0);    } }
      `}</style>

      {/* ── Ambient background ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Emerald top glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[380px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(0,182,122,0.13) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Cyan bottom-right glow */}
        <div
          className="absolute bottom-0 right-1/3 w-[500px] h-[280px]"
          style={{
            background:
              'radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.85) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      {/* ── Section header ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -80px 0px' }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative text-center px-4 mb-14"
      >
        {/* Trustpilot label */}
        <div className="flex items-center justify-center gap-1.5 mb-5">
          <TpStar className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold text-slate-600 tracking-[0.2em] uppercase">
            Trustpilot
          </span>
        </div>

        {/* 5 large stars */}
        <div className="flex justify-center gap-2 mb-5">
          {[1, 2, 3, 4, 5].map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.1 + i * 0.06,
                duration: 0.4,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              <TpStar className="w-9 h-9" />
            </motion.div>
          ))}
        </div>

        {/* "Excellent" heading */}
        <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-none mb-3">
          Excellent
        </h2>

        {/* Score · count · link */}
        <p className="text-sm text-slate-600">
          <span className="text-slate-300 font-semibold tabular-nums">5.0</span>
          <span className="mx-2 text-slate-800">·</span>
          <a
            href="https://www.trustpilot.com/review/retralabs.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-400 transition-colors duration-200"
          >
            7 verified reviews on Trustpilot ↗
          </a>
        </p>
      </motion.div>

      {/* ── Review rows ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '0px 0px -40px 0px' }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col gap-5"
      >
        <ScrollRow reverse={false} />
        <ScrollRow reverse={true} />
      </motion.div>

      {/* Edge fade masks */}
      <div
        className="absolute inset-y-0 left-0 w-28 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to right, #040812 10%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-28 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to left, #040812 10%, transparent 100%)',
        }}
      />
    </section>
  );
}
