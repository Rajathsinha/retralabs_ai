/**
 * HomePage — animated with Framer Motion, pure-React scroll counters.
 *
 * Animation layers:
 *  1. Hero stagger      — headline → subtext → CTAs fade up on mount (no scroll trigger)
 *  2. Headline rotation — AnimatePresence opacity cross-fade between 3 headlines
 *  3. Scroll reveals    — AnimatedSection (whileInView) for below-fold content blocks
 *  4. Stagger cards     — motion.div staggerChildren for feature + testimonial cards
 *  5. Card hovers       — whileHover lift + per-card glow shadow
 *  6. RAF counter       — AnimatedCounter via IntersectionObserver + rAF (no GSAP needed)
 */
import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Chip } from '@heroui/react';
import {
  FlaskConical, ShieldCheck, ArrowRight, Star,
  CheckCircle2, MessageCircle, AlertTriangle,
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import {
  fadeUp, scaleIn, staggerMedium, staggerFast,
} from '../animations/variants';

// Below-the-fold section — lazy loaded so it never blocks initial render
const TrustpilotSection = lazy(() => import('../components/TrustpilotSection'));

// ── Rotating hero headlines ────────────────────────────────────────────────────
const HERO_HEADLINES = [
  <>
    We Built RetraLabs<br />
    <span className="text-gradient">Because We Got</span><br />
    <span className="text-gradient">Scammed.</span>
  </>,
  <>
    India's Peptide Market<br />
    <span className="text-gradient">Was a Mess.</span><br />
    We Fixed It.
    <span className="block text-2xl md:text-3xl text-slate-500 font-normal italic mt-3">(You're welcome.)</span>
  </>,
  <>
    India's Only Trusted<br />
    <span className="text-gradient">Research Peptide</span><br />
    Supplier.
  </>,
];

// ── Pure-React counter — IntersectionObserver + rAF, no GSAP needed ──────────
function AnimatedCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const elRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const duration = 1800;
        const startTime = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 2); // power2.out
          setValue(Math.round(eased * to));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to]);

  return <span ref={elRef}>{value}{suffix}</span>;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: 'u/Frosty-Ad-9691', initial: 'F',
    gradient: 'from-blue-500 to-cyan-500', rating: 5,
    text: "Not gonna lie, I've seen really mindblowing progress. Dropped tons of fat and health feels much more under control. Sugar levels way better. Friends noticed — one jumped on it too. RetraLabs peps are really genuine.",
    product: 'Retatrutide',
  },
  {
    name: 'u/Affectionate_Fox_313', initial: 'A',
    gradient: 'from-emerald-500 to-teal-500', rating: 5,
    text: "I was very skeptical — had already been scammed by a fake online seller (fake vials, wasted ~7k). After checking proof from another user, I took the gamble. Quality is absolutely legit.",
    product: 'Retatrutide',
  },
];

const FEATURES = [
  {
    icon: FlaskConical, title: 'HPLC-Verified. Every Batch.',
    desc: 'Independent third-party purity testing on every single batch. COA included — not on request, just always.',
    stat: '98%+ Purity', chipColor: 'primary' as const,
    bg: 'from-blue-50 to-cyan-50', border: 'border-blue-100',
    iconBg: 'bg-blue-100', iconColor: 'text-blue-700',
    glow: 'rgba(59,130,246,0.1)',
  },
  {
    icon: ShieldCheck, title: 'Direct from GMP. No Middlemen.',
    desc: 'Certified GMP manufacturing partners. No markup chains. No mystery suppliers. No "trust me bro" sourcing.',
    stat: 'GMP Certified Source', chipColor: 'success' as const,
    bg: 'from-emerald-50 to-teal-50', border: 'border-emerald-100',
    iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700',
    glow: 'rgba(16,185,129,0.1)',
  },
  {
    icon: MessageCircle, title: 'Real Humans. Fast Replies.',
    desc: 'WhatsApp support with actual people who know the products. No bots. No 5-day email threads. Usually under an hour.',
    stat: '1hr SLA · 9AM–6PM', chipColor: 'warning' as const,
    bg: 'from-amber-50 to-orange-50', border: 'border-amber-100',
    iconBg: 'bg-amber-100', iconColor: 'text-amber-700',
    glow: 'rgba(245,158,11,0.1)',
  },
];

const PEPTIDE_ITEMS = [
  { name: 'Retatrutide',         image: '/Retatrutide.jpg',             id: '1'  },
  { name: 'Tirzepatide',         image: '/TIRZEPATIDE.jpg',             id: '2'  },
  { name: 'GHK-Cu',              image: '/GHKCU.jpg',                   id: '3'  },
  { name: 'Semax',               image: '/SEMAX.jpg',                   id: '4'  },
  { name: 'Selank',              image: '/SELANK.jpg',                  id: '5'  },
  { name: 'BPC-157',             image: '/BPC.jpg',                     id: '7'  },
  { name: 'NAD+',                image: '/NAD+.jpg',                    id: '8'  },
  { name: 'TB-500',              image: '/TB500.jpg',                   id: '9'  },
  { name: 'Tesamorelin',         image: '/Tesa.jpg',                    id: '10' },
  { name: 'MOT-C',               image: '/motc.jpg',                    id: '11' },
  { name: 'Klow Blend',          image: '/KLOW.jpg',                    id: '12' },
  { name: 'CJC-1295 + Ipa',     image: '/CJC1295+Ipamorelin.jpg',      id: '13' },
  { name: 'Wolverine Stack',     image: '/THE WOLVERINE STACK.jpg',     id: '14' },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHeroIndex(i => (i + 1) % HERO_HEADLINES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen">

      {/* ════════════════════ HERO ════════════════════ */}
      <section className="relative overflow-hidden bg-slate-950 pt-16 pb-0">

        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-dot-pattern bg-dot-sm opacity-[0.04]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">

          {/* Rotating headline — clean cross-fade, no position shift */}
          <div className="min-h-[200px] md:min-h-[260px] flex items-center justify-center mb-8">
            <AnimatePresence mode="wait">
              <motion.h1
                key={heroIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05] text-center"
              >
                {HERO_HEADLINES[heroIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Sub-copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-lg md:text-xl text-slate-400 mb-4 leading-relaxed max-w-2xl mx-auto">
              Fake vials. Useless compounds. Thousands wasted. We couldn't find a single
              legitimate peptide supplier in India, so we went directly to GMP manufacturers,
              got HPLC testing done, and made it accessible to everyone.
            </p>
            <p className="text-slate-500 text-sm italic mb-10">
              That's the whole story. Everything else is just good products at honest prices.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
          >
            {/* Primary CTA */}
            <motion.button
              type="button"
              onClick={() => navigate('/catalogue')}
              className="inline-flex items-center justify-center gap-2 bg-cyan-400 text-slate-900 font-extrabold text-base px-8 py-3.5 rounded-2xl shadow-lg shadow-cyan-400/20"
              whileHover={{ scale: 1.05, boxShadow: '0 8px 36px rgba(34,211,238,0.45)', backgroundColor: 'rgb(103,232,249)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              Shop the Real Stuff
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            {/* Secondary */}
            <motion.button
              type="button"
              onClick={() => window.open('https://www.trustpilot.com/review/retralabs.in', '_blank', 'noopener,noreferrer')}
              className="inline-flex items-center justify-center gap-2 bg-white/8 border border-white/15 text-white font-semibold text-base px-8 py-3.5 rounded-2xl backdrop-blur-sm"
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.13)', borderColor: 'rgba(255,255,255,0.3)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              Read Our Reviews ↗
            </motion.button>
          </motion.div>

        </div>

        {/* ── Stats marquee ── */}
        <div className="relative mt-10 overflow-hidden py-6">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
          <div className="flex" style={{ animation: 'marquee-scroll 28s linear infinite' }}>
            {[0, 1].map(set => (
              <div key={set} className="flex items-center flex-shrink-0">
                {[
                  { value: '3,000+', label: 'Orders Shipped' },
                  { value: '98%+',   label: 'Purity Guaranteed' },
                  { value: '48h',    label: 'Avg Dispatch' },
                  { value: 'GMP',    label: 'Certified Source' },
                  { value: '100%',   label: 'HPLC-Tested' },
                  { value: '0',      label: 'Middlemen. Ever.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center">
                    <div className="px-8 flex items-baseline gap-3 whitespace-nowrap">
                      <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
                        {item.value}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-cyan-500/25 text-sm select-none">◆</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── Peptide image ticker ─────────────────────────────────────── */}
        <div
          className="relative overflow-hidden group"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Edge fades */}
          <div className="absolute left-0 inset-y-0 w-20 sm:w-36 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-20 sm:w-36 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

          <div
            className="flex will-change-transform group-hover:[animation-play-state:paused]"
            style={{ animation: 'marquee-scroll 48s linear infinite' }}
          >
            {[0, 1].map(set => (
              <div key={set} className="flex items-stretch shrink-0" aria-hidden={set === 1}>
                {PEPTIDE_ITEMS.map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="flex flex-col items-center justify-center gap-2.5 px-6 py-5 whitespace-nowrap group/card hover:bg-white/[0.03] transition-colors duration-200 outline-none"
                  >
                    {/* Product image */}
                    <div className="relative w-[62px] h-[62px] rounded-2xl overflow-hidden bg-slate-900 border border-white/[0.08] shrink-0 group-hover/card:border-white/[0.18] group-hover/card:scale-105 transition-all duration-300">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      {/* Subtle inner glow on hover */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
                        style={{ boxShadow: 'inset 0 0 12px rgba(34,211,238,0.15)' }}
                      />
                    </div>
                    {/* Name */}
                    <span className="text-[10.5px] font-semibold tracking-[0.08em] text-slate-500 group-hover/card:text-slate-300 transition-colors duration-200 uppercase">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee-scroll {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
        `}</style>

        <div className="h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ════════════════ WHY IT'S DIFFERENT ════════════════ */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              What makes us different
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Because the Alternative Is Fake, Unverified Junk.
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              Every peptide we sell is HPLC-verified, COA-backed, and sourced directly.
              Radical concept, we know.
            </p>
          </AnimatedSection>

          {/* Staggered feature cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px -60px 0px' }}
            variants={staggerFast}
          >
            {FEATURES.map(item => (
              <motion.div key={item.title} variants={scaleIn}>
                <motion.div
                  className={`bg-gradient-to-br ${item.bg} border ${item.border} rounded-2xl h-full`}
                  whileHover={{
                    y: -6,
                    boxShadow: `0 20px 48px ${item.glow}`,
                    transition: { duration: 0.22, ease: 'easeOut' },
                  }}
                >
                  <div className="p-7 flex flex-col h-full">
                    <motion.div
                      className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center mb-5`}
                      whileHover={{ rotate: [0, -10, 8, 0], transition: { duration: 0.45 } }}
                    >
                      <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                    </motion.div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-5 flex-1">{item.desc}</p>
                    <Chip
                      variant="bordered" color={item.chipColor} size="sm"
                      className="self-start text-xs font-bold"
                      startContent={<CheckCircle2 className="w-3.5 h-3.5" />}
                    >
                      {item.stat}
                    </Chip>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ LIVE STATS (GSAP counters) ════════════════ */}
      <section className="py-16 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-dot-pattern bg-dot-sm opacity-[0.03]" />
          {/* Ambient glow behind stats */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(34,211,238,0.07), transparent)',
            }}
          />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
            variants={staggerMedium}
          >
            {[
              { to: 3000, suffix: '+', label: 'Orders shipped' },
              { to: 99,   suffix: '%+', label: 'Avg purity' },
              { to: 48,   suffix: 'h',  label: 'Avg dispatch' },
              { to: 0,    suffix: '',   label: 'Middlemen' },
            ].map(stat => (
              <motion.div key={stat.label} variants={fadeUp}>
                <p className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  <AnimatedCounter to={stat.to} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mt-2">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ SOCIAL PROOF ════════════════ */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              The internet agrees
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Don't Take Our Word For It.
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              Real posts. Real researchers. Zero paid promotions.
            </p>
          </AnimatedSection>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
            variants={staggerMedium}
          >
            {TESTIMONIALS.map(t => (
              <motion.div key={t.name} variants={fadeUp}>
                <motion.div
                  className="bg-slate-50 border border-slate-200 rounded-2xl h-full"
                  whileHover={{
                    y: -5,
                    borderColor: 'rgb(203,213,225)',
                    boxShadow: '0 12px 36px rgba(0,0,0,0.07)',
                    transition: { duration: 0.22, ease: 'easeOut' },
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {t.initial}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                        <div className="flex gap-0.5 mt-0.5">
                          {[...Array(t.rating)].map((_, j) => (
                            <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <Chip
                        size="sm" variant="flat"
                        className="ml-auto text-xs text-orange-600 bg-orange-50 border border-orange-100 font-semibold"
                        startContent={<MessageCircle className="w-3 h-3" />}
                      >
                        Reddit
                      </Chip>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">"{t.text}"</p>
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <span className="text-xs text-slate-400">{t.product} · via r/retralabs</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <AnimatedSection className="text-center" delay={0.1}>
            <motion.div
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="inline-block"
            >
              <Button
                className="bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 px-7"
                endContent={<ArrowRight className="w-4 h-4" />}
                onPress={() => navigate('/proof')}
              >
                See Field Reports →
              </Button>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ════════════════ TRUSTPILOT REVIEWS ════════════════ */}
      <Suspense fallback={<div className="py-24 bg-[#040812]" />}>
        <TrustpilotSection />
      </Suspense>

      {/* ════════════════ DISCLAIMER ════════════════ */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection variants={scaleIn}>
            <motion.div
              className="border border-amber-200 bg-amber-50 rounded-2xl"
              whileHover={{ boxShadow: '0 8px 24px rgba(245,158,11,0.1)', transition: { duration: 0.2 } }}
            >
              <div className="flex flex-row items-start gap-4 p-6">
                <div className="p-2 bg-amber-100 rounded-xl flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 mb-1.5">Heads Up — Research Use Only.</h3>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    All products are intended solely for in vitro research and analytical applications.
                    Not approved for human or veterinary use. By ordering, you confirm you are a qualified
                    researcher operating in compliance with applicable regulations.
                  </p>
                  <Chip size="sm" variant="flat" color="warning" className="mt-3 text-xs font-bold">
                    Not for Human Use
                  </Chip>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

    </div>
  );
}
