/**
 * HomePage — premium motion system v2.
 *
 * Animation layers:
 *  1. HeroParticles  — 55 floating cyan/sky/indigo particles (canvas, GPU)
 *  2. Animated orbs  — infinite float keyframes
 *  3. Hero stagger   — DRIFT container → badge → headline → subtext → CTAs
 *  4. Headline rotation — AnimatePresence blur cross-fade
 *  5. Scroll reveals — AnimatedSection (RISE by default)
 *  6. Stagger cards  — WAVE container with SURFACE item variants
 *  7. Card hovers    — whileHover lift + per-card glow shadow
 *  8. FM counter     — useInView + useSpring (no GSAP dependency)
 *  9. MagneticButton — cursor attraction + ambient glow
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Chip, Button } from '@heroui/react';
import {
  FlaskConical, ShieldCheck, ArrowRight, Star,
  CheckCircle2, MessageCircle, AlertTriangle,
} from 'lucide-react';
import HeroParticles from '../components/HeroParticles';
import AnimatedSection from '../components/AnimatedSection';
import MagneticButton from '../components/MagneticButton';
import SEO from '../components/SEO';
import {
  RISE, EMERGE, SURFACE, WAVE, DRIFT, CASCADE,
  EASE_OUT, EASE_SHARP, EASE_SPRING, DUR,
  fadeDown, orbFloat, orbFloat2,
} from '../animations/variants';

// ── Rotating hero headlines ────────────────────────────────────────────────────
const HERO_HEADLINES = [
  {
    id: 'scam',
    jsx: (
      <>
        We Built RetraLabs<br />
        <span className="text-gradient">Because We Got</span><br />
        <span className="text-gradient">Scammed.</span>
      </>
    ),
  },
  {
    id: 'mess',
    jsx: (
      <>
        India's Peptide Market<br />
        <span className="text-gradient">Was a Mess.</span><br />
        We Fixed It.
        <span className="block text-2xl md:text-3xl text-slate-500 font-normal italic mt-3">
          (You're welcome.)
        </span>
      </>
    ),
  },
  {
    id: 'trusted',
    jsx: (
      <>
        India's Only Trusted<br />
        <span className="text-gradient">Research Peptide</span><br />
        Supplier.
      </>
    ),
  },
];

// ── Framer Motion counter — no GSAP dependency ───────────────────────────────
function AnimatedCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });

  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 38, damping: 18, mass: 1 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) motionVal.set(to);
  }, [isInView, to, motionVal]);

  useEffect(() => {
    return spring.on('change', v => setDisplay(Math.round(v)));
  }, [spring]);

  return (
    <span ref={ref}>
      {display.toLocaleString('en-IN')}{suffix}
    </span>
  );
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
    stat: '99%+ Purity', chipColor: 'primary' as const,
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

// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const [heroIndex, setHeroIndex] = useState(0);

  // Rotate headlines every 5 s
  useEffect(() => {
    const t = setInterval(
      () => setHeroIndex(i => (i + 1) % HERO_HEADLINES.length),
      5000,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <>
    <SEO
      title="Retatrutide Peptide Supplier in India | 99%+ Purity Research Grade | RetraLabs"
      description="India's most trusted research peptide supplier. Buy Retatrutide, Tirzepatide, GHK-Cu, BPC-157 with 99%+ HPLC-verified purity & COA. Starter vial from ₹3,500. Fast India-wide shipping."
      canonical="/"
      schema={[
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "RetraLabs",
          "url": "https://retralabs.in",
          "logo": "https://retralabs.in/favicon.png",
          "description": "India's trusted research peptide supplier. HPLC-verified, COA-backed compounds for laboratory research.",
          "email": "support@retralabs.in",
          "areaServed": "IN",
          "contactPoint": { "@type": "ContactPoint", "contactType": "Customer Support", "email": "support@retralabs.in" }
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "Where can I buy Retatrutide in India?", "acceptedAnswer": { "@type": "Answer", "text": "RetraLabs (retralabs.in) is India's trusted source for research-grade Retatrutide. 99.2% HPLC-verified purity, COA with every order, starter vial from ₹3,500." } },
            { "@type": "Question", "name": "What is the price of Retatrutide in India?", "acceptedAnswer": { "@type": "Answer", "text": "At RetraLabs: 10mg starter vial ₹3,500 · 20mg ₹6,000 · 50mg ₹13,000 · 100mg ₹21,000. All include COA and HPLC report." } },
            { "@type": "Question", "name": "Is Retatrutide available in India?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Retatrutide is available in India for laboratory research through RetraLabs at retralabs.in. GMP-certified source, HPLC-tested, COA included, India-wide shipping." } },
            { "@type": "Question", "name": "Where to buy Tirzepatide in India?", "acceptedAnswer": { "@type": "Answer", "text": "Tirzepatide for research is available at RetraLabs.in. 99.4% HPLC purity, COA included. From ₹2,500 for 10mg, India-wide shipping." } },
            { "@type": "Question", "name": "Are research peptides legal in India?", "acceptedAnswer": { "@type": "Answer", "text": "Research peptides like Retatrutide and Tirzepatide are supplied in India strictly for laboratory and analytical research purposes by RetraLabs. Not for human consumption." } }
          ]
        }
      ]}
    />
    <div className="min-h-screen">

      {/* ════════════════════ HERO ════════════════════ */}
      <section className="relative overflow-hidden bg-slate-950 pt-16 pb-0">

        {/* Rising canvas particles */}
        <HeroParticles />

        {/* Framer Motion floating orbs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-dot-pattern bg-dot-sm opacity-[0.04]" />
          <motion.div
            className="absolute top-1/4 -left-56 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-3xl"
            animate={orbFloat.animate}
          />
          <motion.div
            className="absolute bottom-1/3 -right-56 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl"
            animate={orbFloat2.animate}
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">

          {/* ── Hero content — DRIFT stagger container ── */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={DRIFT}
          >

          {/* Trustpilot badge */}
          <AnimatedSection variants={fadeDown} className="flex justify-center mb-10">
            <a
              href="https://www.trustpilot.com/review/retralabs.in"
              target="_blank" rel="noopener noreferrer"
              className="inline-block"
            >
              <motion.div
                className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-5 py-2.5"
                whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.09)' }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-white/30 text-xs">|</span>
                <span className="text-cyan-300 text-sm font-medium">
                  Verified on Trustpilot · See real reviews →
                </span>
              </motion.div>
            </a>
          </AnimatedSection>

          {/* Rotating headline — AnimatePresence cross-fades with blur */}
          <AnimatedSection variants={RISE} delay={0.1}>
            <div className="min-h-[200px] md:min-h-[280px] flex items-center justify-center mb-4">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={heroIndex}
                  initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0,  filter: 'blur(0px)',
                    transition: { duration: 0.58, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{   opacity: 0, y: -18, filter: 'blur(4px)',
                    transition: { duration: 0.28, ease: 'easeIn' } }}
                  className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05] text-center"
                >
                  {HERO_HEADLINES[heroIndex].jsx}
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Dot indicators — animated width/color */}
            <div className="flex justify-center gap-2 mb-6">
              {HERO_HEADLINES.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  animate={{
                    width:           i === heroIndex ? 24 : 6,
                    backgroundColor: i === heroIndex ? 'rgb(34,211,238)' : 'rgba(255,255,255,0.25)',
                  }}
                  style={{ height: 6, borderRadius: 9999, border: 'none' }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  aria-label={`Headline ${i + 1}`}
                />
              ))}
            </div>
          </AnimatedSection>

          {/* Sub-copy */}
          <AnimatedSection variants={RISE} delay={0.22}>
            <p className="text-lg md:text-xl text-slate-400 mb-4 leading-relaxed max-w-2xl mx-auto">
              Fake vials. Useless compounds. Thousands wasted. We couldn't find a single
              legitimate peptide supplier in India, so we went directly to GMP manufacturers,
              got HPLC testing done, and made it accessible to everyone.
            </p>
            <p className="text-slate-500 text-sm italic mb-10">
              That's the whole story. Everything else is just good products at honest prices.
            </p>
          </AnimatedSection>

          {/* CTAs */}
          <AnimatedSection
            variants={RISE}
            delay={0.34}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-16"
          >
            {/* Primary — magnetic pull toward cursor */}
            <MagneticButton strength={24} glowColor="rgba(34,211,238,0.4)">
              <motion.button
                type="button"
                onClick={() => navigate('/catalogue')}
                className="inline-flex items-center justify-center gap-2 bg-cyan-400 text-slate-900 font-extrabold text-base px-8 py-3.5 rounded-2xl shadow-lg shadow-cyan-400/20"
                whileHover={{
                  scale: 1.04,
                  boxShadow: '0 12px 40px rgba(34,211,238,0.5)',
                  backgroundColor: 'rgb(103,232,249)',
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: DUR.fast, ease: EASE_OUT }}
              >
                Shop the Real Stuff
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: EASE_SPRING }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </motion.button>
            </MagneticButton>

            {/* Secondary */}
            <motion.button
              type="button"
              onClick={() => navigate('/about')}
              className="inline-flex items-center justify-center gap-2 bg-white/8 border border-white/15 text-white font-semibold text-base px-8 py-3.5 rounded-2xl backdrop-blur-sm"
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.13)', borderColor: 'rgba(255,255,255,0.3)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              Read Our Story
            </motion.button>
          </AnimatedSection>

          {/* close DRIFT container */}
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
                  { value: '2,400+', label: 'Orders Shipped' },
                  { value: '99%+',   label: 'Purity Guaranteed' },
                  { value: '★ 4.9',  label: 'On Trustpilot' },
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
            variants={WAVE}
          >
            {FEATURES.map(item => (
              <motion.div key={item.title} variants={SURFACE}>
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
            variants={WAVE}
          >
            {[
              { to: 2400, suffix: '+', label: 'Orders shipped' },
              { to: 99,   suffix: '%+', label: 'Avg purity' },
              { to: 48,   suffix: 'h',  label: 'Avg dispatch' },
              { to: 0,    suffix: '',   label: 'Middlemen' },
            ].map(stat => (
              <motion.div key={stat.label} variants={RISE}>
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
            variants={WAVE}
          >
            {TESTIMONIALS.map(t => (
              <motion.div key={t.name} variants={RISE}>
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
                onPress={() => navigate('/reviews')}
              >
                Read All 5-Star Reviews →
              </Button>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ════════════════ DISCLAIMER ════════════════ */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection variants={SURFACE}>
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
    </>
  );
}
