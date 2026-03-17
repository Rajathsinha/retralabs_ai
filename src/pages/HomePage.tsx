/**
 * HomePage — Luxury minimal redesign.
 *
 * Design tokens: Cormorant Garamond (serif headings) + Outfit (body copy)
 * Accent: #1a6b4a (deep emerald)
 * Palette: --off-white, --cream, --text, --text-muted
 *
 * Sections:
 *  1. Hero          — particle canvas, serif headline, animated entrance
 *  2. Trust Bar     — 4 stats with IntersectionObserver count-up
 *  3. Products      — 3-col TiltCard grid
 *  4. How It Works  — 3-step process
 *  5. Why Us        — 2-col feature list
 *  6. Testimonials  — dark bg, 3 review cards
 *  7. CTA           — cream bg, centred serif headline
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Check, ShieldCheck, FlaskConical, Truck, MessageCircle } from 'lucide-react';
import ParticleCanvas from '../components/ParticleCanvas';
import TiltCard from '../components/TiltCard';

// ── DEMO_PRODUCTS (first 6 for home page feature) ──────────────────────────
// Imported inline to avoid circular deps — just use the catalogue products
const FEATURED_PRODUCTS = [
  { id: '1', name: 'Retatrutide', purity: '99.2%', from: 3500, image: '/Retatrutide.png', tag: 'Best Seller' },
  { id: '2', name: 'Tirzepatide', purity: '99.4%', from: 2500, image: '/TIRZEPATIDE.png', tag: 'Popular' },
  { id: '3', name: 'GHK-Cu',      purity: '99.1%', from: 4000, image: '/GHKCU.png',       tag: 'Longevity' },
  { id: '7', name: 'Semax',       purity: '99.1%', from: 2500, image: '/SEMAX.png',       tag: 'Cognitive' },
  { id: '8', name: 'BPC-157',     purity: '99.3%', from: 2000, image: '/BPC.png',         tag: 'Recovery' },
  { id: '9', name: 'TB-500',      purity: '99.0%', from: 4000, image: '/TB500.png',       tag: 'Recovery' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Choose Your Peptide', desc: 'Browse HPLC-verified peptides sourced directly from GMP manufacturers. Every batch has a COA.' },
  { step: '02', title: 'Order via WhatsApp', desc: 'No account needed. Review your order, confirm via WhatsApp. We reply within the hour.' },
  { step: '03', title: 'Swift Dispatch', desc: 'Cold-chain packed and shipped within 48h. Track your order at retralabs.in/track-order.' },
];

const WHY_FEATURES = [
  'HPLC-verified purity on every single batch',
  'Certificate of Analysis included — always',
  'GMP-certified manufacturing partners',
  'No middlemen. No markup chains.',
  'WhatsApp support — real humans, <1 hr SLA',
  'Cold-chain packaging for peptide integrity',
];

const TESTIMONIALS = [
  {
    name: 'u/Frosty-Ad-9691',
    initial: 'F',
    rating: 5,
    text: "Not gonna lie, I've seen really mindblowing progress. Dropped tons of fat and health feels much more under control. Sugar levels way better. Friends noticed. RetraLabs peps are really genuine.",
    product: 'Retatrutide',
  },
  {
    name: 'u/Affectionate_Fox_313',
    initial: 'A',
    rating: 5,
    text: "I was very skeptical — had already been scammed by a fake seller (fake vials, wasted ~7k). After checking proof from another user, I took the gamble. Quality is absolutely legit.",
    product: 'Retatrutide',
  },
  {
    name: 'u/Delhi_Research_2024',
    initial: 'D',
    rating: 5,
    text: "The CoA and HPLC reports are real. Reached out on WhatsApp and got a response in 20 minutes. This is what every peptide supplier should look like.",
    product: 'BPC-157',
  },
];

// ── Scroll counter hook ────────────────────────────────────────────────────
function useCounter(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  const ref               = useRef<HTMLSpanElement>(null);
  const fired             = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          const start = performance.now();
          function tick(now: number) {
            const progress = Math.min((now - start) / duration, 1);
            setValue(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(tick);
            else setValue(target);
          }
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return { value, ref };
}

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const { value, ref } = useCounter(target);
  return (
    <span className="section-heading" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
      <span ref={ref}>{value}</span>{suffix}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const [heroIndex, setHeroIndex] = useState(0);

  const heroHeadlines = [
    <>Pure Science.<br /><em>Delivered.</em></>,
    <>India's Only Verified<br /><em>Peptide Source.</em></>,
    <>Research Grade.<br /><em>Zero Compromise.</em></>,
  ];

  // Rotate headlines every 5 s
  useEffect(() => {
    const t = setInterval(
      () => setHeroIndex(i => (i + 1) % heroHeadlines.length),
      5000,
    );
    return () => clearInterval(t);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll('.scroll-reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const siblings = [...(el.parentElement?.children ?? [])];
            const idx = siblings.indexOf(el);
            el.style.transitionDelay = `${idx * 0.1}s`;
            el.classList.add('revealed');
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach(el => { el.classList.add('reveal'); io.observe(el); });
    return () => io.disconnect();
  }, []);

  return (
    <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 300 }}>

      {/* ══════════ HERO ══════════ */}
      <section
        style={{
          minHeight: '100vh',
          background: 'var(--off-white)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '80px',
        }}
      >
        {/* Particle canvas — behind everything */}
        <ParticleCanvas />

        <div className="max-w-4xl mx-auto px-6 text-center" style={{ position: 'relative', zIndex: 1 }}>

          {/* Eyebrow */}
          <motion.p
            className="section-eyebrow mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Premium Research Peptides · India
          </motion.p>

          {/* Rotating serif headline */}
          <div style={{ minHeight: 'clamp(180px, 20vw, 340px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
              <motion.h1
                key={heroIndex}
                className="section-heading"
                style={{ fontSize: 'clamp(52px, 9vw, 120px)', textAlign: 'center' }}
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
                exit={{   opacity: 0, y: -20, filter: 'blur(4px)' }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                {heroHeadlines[heroIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Headline dots */}
          <div className="flex justify-center gap-2 mb-8 mt-4">
            {heroHeadlines.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setHeroIndex(i)}
                animate={{
                  width:           i === heroIndex ? 24 : 6,
                  backgroundColor: i === heroIndex ? 'var(--accent)' : 'rgba(0,0,0,0.2)',
                }}
                style={{ height: 6, borderRadius: 9999, border: 'none', cursor: 'pointer', padding: 0 }}
                transition={{ duration: 0.3 }}
                aria-label={`Headline ${i + 1}`}
              />
            ))}
          </div>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.75 }}
          >
            HPLC-verified, GMP-sourced research peptides shipped across India.
            Real COAs. Zero middlemen. Actual humans on WhatsApp.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button className="btn-dark" onClick={() => navigate('/catalogue')}>
              Shop Peptides <ArrowRight size={16} />
            </button>
            <button className="btn-ghost" onClick={() => navigate('/about')}>
              Our Story
            </button>
          </motion.div>
        </div>
      </section>

      {/* ══════════ TRUST BAR ══════════ */}
      <section style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div
          className="max-w-5xl mx-auto"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}
        >
          {[
            { target: 99, suffix: '.2%', label: 'Avg purity', sub: 'HPLC-verified' },
            { target: 2400, suffix: '+',  label: 'Orders shipped', sub: 'Across India' },
            { target: 48, suffix: 'h',   label: 'Dispatch time', sub: 'Cold-chain packed' },
            { target: 5, suffix: '+',    label: 'Peptides stocked', sub: 'GMP source' },
          ].map((item, i) => (
            <div
              key={item.label}
              className="scroll-reveal"
              style={{
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                borderRight: i < 3 ? '1px solid var(--border)' : 'none',
              }}
            >
              <Counter target={item.target} suffix={item.suffix} />
              <p style={{ color: 'var(--text)', fontSize: '0.8rem', fontWeight: 500, marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                {item.label}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ PRODUCTS ══════════ */}
      <section style={{ background: 'var(--white)', padding: '6rem 0' }}>
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-14">
            <p className="section-eyebrow mb-3 scroll-reveal">Our Catalogue</p>
            <h2 className="section-heading scroll-reveal" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
              Researched. Verified. Ready.
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {FEATURED_PRODUCTS.map((p) => (
              <TiltCard key={p.id} className="scroll-reveal">
                <Link
                  to={`/product/${p.id}`}
                  style={{ display: 'block', textDecoration: 'none' }}
                >
                  <div
                    style={{
                      background: 'var(--white)',
                      border: '1px solid var(--border)',
                      borderRadius: '1rem',
                      padding: '2rem',
                      cursor: 'pointer',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Tag */}
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.65rem',
                        fontWeight: 500,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--accent)',
                        background: 'var(--accent-light)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 999,
                        marginBottom: '1.25rem',
                      }}
                    >
                      {p.tag}
                    </span>

                    {/* Product image */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ height: 140, width: 'auto', objectFit: 'contain' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-peptide.png'; }}
                      />
                    </div>

                    {/* Name */}
                    <h3
                      className="section-heading"
                      style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text)' }}
                    >
                      {p.name}
                    </h3>

                    {/* Purity */}
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      {p.purity} purity · HPLC-verified
                    </p>

                    {/* Price + CTA */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        From <strong style={{ color: 'var(--text)', fontWeight: 500 }}>
                          ₹{p.from.toLocaleString('en-IN')}
                        </strong>
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 500 }}>
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="btn-ghost" onClick={() => navigate('/catalogue')}>
              View Full Catalogue <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section style={{ background: 'var(--off-white)', padding: '6rem 0' }}>
        <div className="max-w-5xl mx-auto px-6">

          <div className="text-center mb-14">
            <p className="section-eyebrow mb-3 scroll-reveal">Process</p>
            <h2 className="section-heading scroll-reveal" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
              How It Works
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="scroll-reveal">
                <span
                  className="section-heading"
                  style={{ fontSize: '3.5rem', color: 'var(--border-strong)', display: 'block', marginBottom: '1rem' }}
                >
                  {step.step}
                </span>
                <h3
                  className="section-heading"
                  style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}
                >
                  {step.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.75, fontSize: '0.9rem' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ WHY US ══════════ */}
      <section style={{ background: 'var(--white)', padding: '6rem 0' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}
               className="flex-col md:grid">

            {/* Left — text */}
            <div>
              <p className="section-eyebrow mb-4 scroll-reveal">Why RetraLabs</p>
              <h2
                className="section-heading scroll-reveal"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: '1.25rem' }}
              >
                Built Because We Got Scammed First.
              </h2>
              <p
                className="scroll-reveal"
                style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '2rem' }}
              >
                Fake vials. Useless compounds. Thousands wasted. We couldn't find a single legitimate
                peptide supplier in India, so we went directly to GMP manufacturers, got HPLC testing
                done, and made it accessible to every researcher.
              </p>
              <button className="btn-dark scroll-reveal" onClick={() => navigate('/about')}>
                Read Our Story <ArrowRight size={15} />
              </button>
            </div>

            {/* Right — feature list */}
            <div>
              {WHY_FEATURES.map((feat) => (
                <div
                  key={feat}
                  className="scroll-reveal"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1rem 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span
                    style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'var(--accent-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: 2,
                    }}
                  >
                    <Check size={12} color="var(--accent)" strokeWidth={2.5} />
                  </span>
                  <span style={{ color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS (dark) ══════════ */}
      <section style={{ background: 'var(--text)', padding: '6rem 0' }}>
        <div className="max-w-5xl mx-auto px-6">

          <div className="text-center mb-14">
            <p className="section-eyebrow mb-3 scroll-reveal" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Social Proof
            </p>
            <h2
              className="section-heading scroll-reveal"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: 'var(--white)' }}
            >
              Real Researchers. Real Results.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {TESTIMONIALS.map((t) => (
              <TiltCard key={t.name} className="scroll-reveal">
                <div
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    height: '100%',
                  }}
                >
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: 3, marginBottom: '1.25rem' }}>
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                    "{t.text}"
                  </p>

                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'var(--accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '0.85rem', fontWeight: 500, flexShrink: 0,
                      }}
                    >
                      {t.initial}
                    </div>
                    <div>
                      <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem', fontWeight: 500 }}>{t.name}</p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>{t.product} · via Reddit</p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              className="btn-ghost scroll-reveal"
              onClick={() => navigate('/reviews')}
              style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}
            >
              Read All Reviews <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section style={{ background: 'var(--cream)', padding: '7rem 0', textAlign: 'center' }}>
        <div className="max-w-2xl mx-auto px-6">
          <p className="section-eyebrow mb-4 scroll-reveal">Get Started</p>
          <h2
            className="section-heading scroll-reveal"
            style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', marginBottom: '1.5rem' }}
          >
            Research Without Compromise.
          </h2>
          <p
            className="scroll-reveal"
            style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '2.5rem' }}
          >
            Join 2,400+ researchers who trust RetraLabs for verified, GMP-sourced peptides
            delivered across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center scroll-reveal">
            <button className="btn-dark" onClick={() => navigate('/catalogue')}>
              Shop Peptides <ArrowRight size={15} />
            </button>
            <button className="btn-ghost" onClick={() => navigate('/contact')}>
              Contact Us
            </button>
          </div>

          {/* Research disclaimer */}
          <p
            className="scroll-reveal"
            style={{ color: 'var(--text-light)', fontSize: '0.72rem', marginTop: '2.5rem', letterSpacing: '0.05em' }}
          >
            All products are for in vitro research use only. Not approved for human or veterinary use.
          </p>
        </div>
      </section>

    </div>
  );
}
