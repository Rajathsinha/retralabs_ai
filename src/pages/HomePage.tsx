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
      <section className="relative overflow-hidden pt-16 pb-0" style={{ background: '#03060f', minHeight: '100vh' }}>

        <HeroParticles />

        {/* ── Hard visible background glows ── */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {/* Strong top-center burst */}
          <div style={{
            position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
            width: '100vw', height: '80vh',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(34,211,238,0.18) 0%, rgba(34,211,238,0.04) 45%, transparent 70%)',
          }} />
          {/* Bottom-left indigo pool */}
          <div style={{
            position: 'absolute', bottom: '10%', left: '-5%',
            width: '55vw', height: '55vw', maxWidth: 700,
            background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 65%)',
            borderRadius: '50%', filter: 'blur(10px)',
          }} />
          {/* Top-right accent */}
          <div style={{
            position: 'absolute', top: '5%', right: '5%',
            width: '30vw', height: '30vw', maxWidth: 400,
            background: 'radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(8px)',
          }} />
          {/* Horizontal glow line across mid */}
          <div style={{
            position: 'absolute', top: '42%', left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.12) 30%, rgba(34,211,238,0.22) 50%, rgba(34,211,238,0.12) 70%, transparent 100%)',
          }} />
        </div>

        {/* ── SPLIT LAYOUT: left text · right card ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 1 }}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16 min-h-[calc(100vh-64px)] py-16">

            {/* ── LEFT: headline + copy + CTAs ── */}
            <div className="flex-1 min-w-0">
              <motion.div initial="hidden" animate="visible" variants={DRIFT}>

                {/* Trustpilot eyebrow */}
                <AnimatedSection variants={fadeDown} className="mb-8">
                  <a
                    href="https://www.trustpilot.com/review/retralabs.in"
                    target="_blank" rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <motion.div
                      className="inline-flex items-center gap-2.5 backdrop-blur-sm rounded-full px-4 py-2"
                      style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)' }}
                      whileHover={{ scale: 1.04, backgroundColor: 'rgba(34,211,238,0.13)' }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span style={{ width: 1, height: 14, background: 'rgba(34,211,238,0.25)', display: 'inline-block' }} />
                      <span className="text-cyan-300 text-sm font-medium">
                        Verified on Trustpilot · See real reviews →
                      </span>
                    </motion.div>
                  </a>
                </AnimatedSection>

                {/* Rotating headline */}
                <AnimatedSection variants={RISE} delay={0.1}>
                  <div className="mb-2" style={{ minHeight: 'clamp(220px, 30vw, 380px)', display: 'flex', alignItems: 'center' }}>
                    <AnimatePresence mode="wait">
                      <motion.h1
                        key={heroIndex}
                        initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(12px)' }}
                        animate={{ opacity: 1, y: 0,  scale: 1,    filter: 'blur(0px)',
                          transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }}
                        exit={{   opacity: 0, y: -30, scale: 0.97, filter: 'blur(8px)',
                          transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } }}
                        style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.02em', color: '#fff' }}
                      >
                        {HERO_HEADLINES[heroIndex].jsx}
                      </motion.h1>
                    </AnimatePresence>
                  </div>

                  {/* Dots */}
                  <div className="flex gap-2 mb-8">
                    {HERO_HEADLINES.map((_, i) => (
                      <motion.button
                        key={i}
                        onClick={() => setHeroIndex(i)}
                        animate={{
                          width:           i === heroIndex ? 32 : 6,
                          backgroundColor: i === heroIndex ? 'rgb(34,211,238)' : 'rgba(255,255,255,0.18)',
                          boxShadow:       i === heroIndex ? '0 0 16px rgba(34,211,238,0.8)' : 'none',
                        }}
                        style={{ height: 5, borderRadius: 9999, border: 'none', cursor: 'pointer', padding: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        aria-label={`Headline ${i + 1}`}
                      />
                    ))}
                  </div>
                </AnimatedSection>

                {/* Sub-copy */}
                <AnimatedSection variants={RISE} delay={0.22}>
                  <p style={{ color: 'rgba(148,163,184,1)', fontSize: '1.1rem', lineHeight: 1.75, maxWidth: 520, marginBottom: '0.75rem' }}>
                    Fake vials. Useless compounds. Thousands wasted. We couldn't find a single
                    legitimate peptide supplier in India, so we went directly to GMP manufacturers,
                    got HPLC testing done, and made it accessible to everyone.
                  </p>
                  <p style={{ color: 'rgba(100,116,139,1)', fontSize: '0.875rem', fontStyle: 'italic', marginBottom: '2.5rem' }}>
                    That's the whole story. Everything else is just good products at honest prices.
                  </p>
                </AnimatedSection>

                {/* CTAs */}
                <AnimatedSection variants={RISE} delay={0.34}>
                  <div className="flex flex-wrap gap-3">
                    <MagneticButton strength={24} glowColor="rgba(34,211,238,0.5)">
                      <motion.button
                        type="button"
                        onClick={() => navigate('/catalogue')}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                          padding: '1rem 2.25rem',
                          background: 'rgb(34,211,238)',
                          color: '#03060f', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.01em',
                          border: 'none', borderRadius: '9999px', cursor: 'pointer',
                          boxShadow: '0 0 28px rgba(34,211,238,0.45), 0 4px 20px rgba(0,0,0,0.5)',
                        }}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: '0 0 0 4px rgba(34,211,238,0.25), 0 0 48px rgba(34,211,238,0.65)',
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

                    <motion.button
                      type="button"
                      onClick={() => navigate('/about')}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '1rem 2rem',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.8)', fontWeight: 500, fontSize: '0.95rem',
                        border: '1px solid rgba(255,255,255,0.14)', borderRadius: '9999px', cursor: 'pointer',
                      }}
                      whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.28)' }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                    >
                      Read Our Story
                    </motion.button>
                  </div>
                </AnimatedSection>

              </motion.div>
            </div>

            {/* ── RIGHT: floating stats card ── */}
            <AnimatedSection variants={EMERGE} delay={0.3} className="hidden lg:block flex-shrink-0 w-80 xl:w-96">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(34,211,238,0.18)',
                  borderRadius: '1.5rem',
                  padding: '1.75rem',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 0 60px rgba(34,211,238,0.07), 0 32px 64px rgba(0,0,0,0.5)',
                }}>
                  {/* Card header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div style={{
                      width: 40, height: 40, borderRadius: '0.75rem',
                      background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <FlaskConical className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>
                        Retatrutide 10mg
                      </p>
                      <p style={{ color: 'rgba(34,211,238,0.8)', fontSize: '0.75rem', marginTop: 2 }}>
                        Latest batch · COA included
                      </p>
                    </div>
                    <div style={{
                      marginLeft: 'auto', padding: '0.25rem 0.75rem',
                      background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
                      borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700,
                      color: 'rgb(134,239,172)', letterSpacing: '0.05em',
                    }}>
                      IN STOCK
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: '1.25rem' }} />

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                      { label: 'HPLC Purity', value: '99.2%', color: 'rgba(34,211,238,1)' },
                      { label: 'Starter Vial', value: '₹3,500', color: '#fff' },
                      { label: 'Orders Shipped', value: '2,400+', color: '#fff' },
                      { label: 'Avg Dispatch', value: '48h', color: 'rgba(34,211,238,1)' },
                    ].map(stat => (
                      <div key={stat.label} style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '0.875rem', padding: '0.875rem',
                      }}>
                        <p style={{ color: stat.color, fontWeight: 800, fontSize: '1.25rem', lineHeight: 1 }}>
                          {stat.value}
                        </p>
                        <p style={{ color: 'rgba(100,116,139,1)', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Purity bar */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span style={{ color: 'rgba(100,116,139,1)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Purity Score</span>
                      <span style={{ color: 'rgba(34,211,238,1)', fontSize: '0.72rem', fontWeight: 700 }}>99.2 / 100</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 9999, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '99.2%' }}
                        transition={{ duration: 1.4, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          height: '100%', borderRadius: 9999,
                          background: 'linear-gradient(90deg, rgba(34,211,238,0.8), rgba(34,211,238,1))',
                          boxShadow: '0 0 10px rgba(34,211,238,0.6)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>

          </div>
        </div>

        {/* ── Stats marquee ── */}
        <div className="relative overflow-hidden py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#03060f] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#03060f] to-transparent z-10 pointer-events-none" />
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
