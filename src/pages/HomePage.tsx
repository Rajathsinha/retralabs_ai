import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Star, MessageCircle, AlertTriangle,
  Shield, FlaskConical, Package, Truck, Headphones,
  CheckCircle2,
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import { fadeUp, staggerMedium } from '../animations/variants';

const TrustpilotSection = lazy(() => import('../components/TrustpilotSection'));

// ── Rotating hero headlines ───────────────────────────────────────────────────
const HERO_HEADLINES = [
  { top: "India's Only Trusted", mid: 'Research Peptide', bot: 'Supplier.' },
  { top: 'We Built RetraLabs', mid: 'Because We Got', bot: 'Scammed.' },
  { top: 'India\'s Peptide Market', mid: 'Was Broken.', bot: 'We Fixed It.' },
];

// ── AnimatedCounter ───────────────────────────────────────────────────────────
function AnimatedCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const elRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      const duration = 1800;
      const startTime = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - startTime) / duration, 1);
        setValue(Math.round((1 - Math.pow(1 - t, 2)) * to));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [to]);
  return <span ref={elRef}>{value}{suffix}</span>;
}

const TESTIMONIALS = [
  {
    name: 'u/Frosty-Ad-9691', initial: 'F',
    gradient: 'from-blue-500 to-cyan-500', rating: 5,
    text: "Not gonna lie, I've seen really mindblowing progress. Dropped tons of fat and health feels much more under control. Sugar levels way better. Friends noticed — one jumped on it too. RetraLabs peps are really genuine.",
    product: 'Retatrutide · via r/retralabs',
  },
  {
    name: 'u/Affectionate_Fox_313', initial: 'A',
    gradient: 'from-emerald-500 to-teal-500', rating: 5,
    text: "I was very skeptical — had already been scammed by a fake online seller (fake vials, wasted ~7k). After checking proof from another user, I took the gamble. Quality is absolutely legit.",
    product: 'Retatrutide · via r/retralabs',
  },
];

const FEATURES = [
  { icon: Shield,      title: 'Verified Sourcing',      desc: 'Direct from GMP-certified manufacturers. No brokers. No grey market. Every compound traced to its origin.',   accent: '#3B82F6' },
  { icon: FlaskConical,title: 'Third-Party Testing',    desc: '99%+ purity guaranteed by independent HPLC analysis. You see the report — every batch, every time.',         accent: '#22D3EE' },
  { icon: Package,     title: 'Discreet Packaging',     desc: 'Plain outer packaging. Zero product markings. Your order arrives looking like any other parcel.',            accent: '#8B5CF6' },
  { icon: Truck,       title: 'Nationwide Delivery',    desc: 'Same-day dispatch before 2PM. 1–2 day express delivery to Mumbai, Delhi, Bangalore & 500+ cities.',         accent: '#10B981' },
  { icon: Headphones,  title: 'Real Human Support',     desc: 'WhatsApp support with people who actually know the products. No bots. Replies usually within an hour.',     accent: '#F59E0B' },
];

const PEPTIDE_ITEMS = [
  { name: 'Retatrutide',      image: '/Retatrutide.jpg',            id: '1'  },
  { name: 'Tirzepatide',      image: '/TIRZEPATIDE.jpg',            id: '2'  },
  { name: 'GHK-Cu',           image: '/GHKCU.jpg',                  id: '3'  },
  { name: 'Semax',            image: '/SEMAX.jpg',                  id: '4'  },
  { name: 'Selank',           image: '/SELANK.jpg',                 id: '5'  },
  { name: 'BPC-157',          image: '/BPC.jpg',                    id: '7'  },
  { name: 'NAD+',             image: '/NAD+.jpg',                   id: '8'  },
  { name: 'TB-500',           image: '/TB500.jpg',                  id: '9'  },
  { name: 'Tesamorelin',      image: '/Tesa.jpg',                   id: '10' },
  { name: 'MOT-C',            image: '/motc.jpg',                   id: '11' },
  { name: 'Klow Blend',       image: '/KLOW.jpg',                   id: '12' },
  { name: 'CJC-1295 + Ipa',  image: '/CJC1295+Ipamorelin.jpg',     id: '13' },
  { name: 'Wolverine Stack',  image: '/THE WOLVERINE STACK.jpg',    id: '14' },
];

const BG = '#040C1E';
const CARD_BG = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(255,255,255,0.08)';

// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHeroIndex(i => (i + 1) % HERO_HEADLINES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: BG, minHeight: '100vh' }}>
      <style>{`
        @keyframes marquee-scroll { from { transform:translateX(0) } to { transform:translateX(-50%) } }
        @keyframes hp-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes hp-pulse { 0%,100%{opacity:.3;transform:scale(1)} 50%{opacity:.8;transform:scale(1.15)} }
        @keyframes hp-spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes hp-glow  { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes hp-shimmer { 0%{background-position:-400% center} 100%{background-position:400% center} }
      `}</style>

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section style={{ background: BG, position: 'relative', overflow: 'hidden', paddingTop: 80, paddingBottom: 0 }}>

        {/* Background radial glows */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:'-10%', left:'20%', width:'55%', height:'70%', background:'radial-gradient(ellipse,rgba(59,130,246,.12) 0%,transparent 65%)', filter:'blur(40px)' }} />
          <div style={{ position:'absolute', top:'20%', right:'5%', width:'35%', height:'50%', background:'radial-gradient(ellipse,rgba(34,211,238,.07) 0%,transparent 65%)', filter:'blur(60px)' }} />
          {/* Grid dots */}
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:.035 }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="#60A5FA" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', position:'relative' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center', minHeight:560 }}>

            {/* ── Left column ── */}
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}
                style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  padding:'6px 14px', borderRadius:99, marginBottom:28,
                  background:'rgba(59,130,246,.1)', border:'1px solid rgba(59,130,246,.25)',
                }}
              >
                <div style={{ width:6, height:6, borderRadius:'50%', background:'#22D3EE', animation:'hp-pulse 2s ease-in-out infinite' }} />
                <span style={{ color:'#93C5FD', fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' }}>
                  India's Most Trusted Peptide Source
                </span>
              </motion.div>

              {/* Rotating headline */}
              <div style={{ minHeight:220, marginBottom:24 }}>
                <AnimatePresence mode="wait">
                  <motion.div key={heroIndex}
                    initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
                    transition={{ duration:.4, ease:'easeInOut' }}
                  >
                    <h1 style={{ fontSize:'clamp(40px,5vw,64px)', fontWeight:800, lineHeight:1.05, letterSpacing:'-0.03em', color:'#EFF6FF', margin:0 }}>
                      {HERO_HEADLINES[heroIndex].top}<br />
                      <span style={{
                        background:'linear-gradient(90deg,#60A5FA,#22D3EE,#60A5FA)',
                        backgroundSize:'200% auto',
                        WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                        animation:'hp-shimmer 4s linear infinite',
                      }}>
                        {HERO_HEADLINES[heroIndex].mid}
                      </span><br />
                      <span style={{ color:'#EFF6FF' }}>{HERO_HEADLINES[heroIndex].bot}</span>
                    </h1>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Sub-copy */}
              <motion.p
                initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:.5, delay:.25 }}
                style={{ color:'rgba(148,163,184,.8)', fontSize:17, lineHeight:1.65, marginBottom:8, maxWidth:460 }}
              >
                No grey market. No compromises. Verified compounds, direct sourcing, and the fastest delivery to your door — anywhere in India.
              </motion.p>
              <motion.p
                initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:.5, delay:.3 }}
                style={{ color:'rgba(148,163,184,.4)', fontSize:13, fontStyle:'italic', marginBottom:36 }}
              >
                That's the whole story. Everything else is just good products at honest prices.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5, delay:.35 }}
                style={{ display:'flex', gap:12, flexWrap:'wrap' }}
              >
                <motion.button
                  type="button" onClick={() => navigate('/catalogue')}
                  style={{
                    display:'flex', alignItems:'center', gap:8,
                    padding:'14px 28px', borderRadius:14, border:'none', cursor:'pointer',
                    background:'linear-gradient(135deg,#3B82F6,#06B6D4)',
                    color:'#fff', fontWeight:700, fontSize:15, letterSpacing:'0.02em',
                    boxShadow:'0 0 32px rgba(59,130,246,.4)',
                  }}
                  whileHover={{ scale:1.04, boxShadow:'0 0 48px rgba(59,130,246,.6)' }}
                  whileTap={{ scale:.97 }}
                  transition={{ duration:.15 }}
                >
                  Shop the Real Stuff <ArrowRight size={16} />
                </motion.button>

                <motion.button
                  type="button" onClick={() => navigate('/proof')}
                  style={{
                    display:'flex', alignItems:'center', gap:8,
                    padding:'14px 24px', borderRadius:14, cursor:'pointer',
                    background:CARD_BG, border:`1px solid ${BORDER}`,
                    color:'rgba(226,232,240,.85)', fontWeight:600, fontSize:15,
                    backdropFilter:'blur(8px)',
                  }}
                  whileHover={{ scale:1.03, borderColor:'rgba(255,255,255,.2)' }}
                  whileTap={{ scale:.97 }}
                  transition={{ duration:.15 }}
                >
                  Read Our Reviews ↗
                </motion.button>
              </motion.div>
            </div>

            {/* ── Right column — visual ── */}
            <motion.div
              initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} transition={{ duration:.7, delay:.2, ease:[.16,1,.3,1] }}
              style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center', height:520 }}
            >
              {/* Outer glow ring */}
              <div style={{
                position:'absolute', width:420, height:420, borderRadius:'50%',
                background:'radial-gradient(ellipse,rgba(59,130,246,.18) 0%,rgba(6,182,212,.06) 50%,transparent 70%)',
                animation:'hp-glow 4s ease-in-out infinite',
              }} />
              {/* Spinning ring */}
              <div style={{
                position:'absolute', width:380, height:380, borderRadius:'50%',
                border:'1px solid rgba(59,130,246,.15)',
                borderTop:'1px solid rgba(96,165,250,.5)',
                animation:'hp-spin 20s linear infinite',
              }} />
              <div style={{
                position:'absolute', width:300, height:300, borderRadius:'50%',
                border:'1px dashed rgba(34,211,238,.1)',
                animation:'hp-spin 14s linear reverse infinite',
              }} />

              {/* Product vial image */}
              <div style={{
                position:'relative', zIndex:2,
                animation:'hp-float 4s ease-in-out infinite',
              }}>
                <div style={{
                  width:220, height:320, borderRadius:24,
                  overflow:'hidden', position:'relative',
                  boxShadow:'0 0 0 1px rgba(96,165,250,.2), 0 32px 80px rgba(0,0,0,.8), 0 0 60px rgba(59,130,246,.25)',
                  background:'#071428',
                }}>
                  <img
                    src="/Retatrutide.jpg"
                    alt="RetraLabs Research Peptide"
                    style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }}
                  />
                  {/* Kill the white bottom of the product image */}
                  <div style={{
                    position:'absolute', bottom:0, left:0, right:0, height:'40%',
                    background:'linear-gradient(to top, #071428 0%, #071428 30%, transparent 100%)',
                    pointerEvents:'none',
                  }} />
                </div>
                {/* Floating badge on vial */}
                <div style={{
                  position:'absolute', bottom:-16, right:-20,
                  background:'rgba(4,12,30,.9)', border:'1px solid rgba(96,165,250,.3)',
                  borderRadius:12, padding:'8px 14px', backdropFilter:'blur(12px)',
                  boxShadow:'0 8px 32px rgba(0,0,0,.6)',
                }}>
                  <div style={{ color:'#22D3EE', fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase' }}>98%+ Purity</div>
                  <div style={{ color:'rgba(148,163,184,.6)', fontSize:10, marginTop:2 }}>HPLC Verified</div>
                </div>
                <div style={{
                  position:'absolute', top:-16, left:-24,
                  background:'rgba(4,12,30,.9)', border:'1px solid rgba(16,185,129,.3)',
                  borderRadius:12, padding:'8px 14px', backdropFilter:'blur(12px)',
                  boxShadow:'0 8px 32px rgba(0,0,0,.6)',
                }}>
                  <div style={{ color:'#10B981', fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase' }}>48h Dispatch</div>
                  <div style={{ color:'rgba(148,163,184,.6)', fontSize:10, marginTop:2 }}>India-wide</div>
                </div>
              </div>

              {/* Molecular dots */}
              {[
                { top:'15%', left:'8%', size:6, color:'#60A5FA', d:'0s' },
                { top:'70%', left:'12%', size:4, color:'#22D3EE', d:'.8s' },
                { top:'25%', right:'10%', size:5, color:'#8B5CF6', d:'1.2s' },
                { top:'75%', right:'8%', size:4, color:'#60A5FA', d:'.4s' },
                { top:'50%', left:'5%', size:3, color:'#22D3EE', d:'1.6s' },
              ].map((d, i) => (
                <div key={i} style={{
                  position:'absolute', top:d.top, left:(d as any).left, right:(d as any).right,
                  width:d.size, height:d.size, borderRadius:'50%', background:d.color,
                  boxShadow:`0 0 8px ${d.color}`,
                  animation:`hp-pulse 3s ease-in-out ${d.d} infinite`,
                }} />
              ))}
            </motion.div>

          </div>
        </div>

        {/* ── Trust bar ── */}
        <div style={{ borderTop:`1px solid ${BORDER}`, borderBottom:`1px solid ${BORDER}`, background:'rgba(255,255,255,.02)', marginTop:40 }}>
          <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:0, overflowX:'auto' }}>
              {[
                { label:'Trustpilot Rating', value:'4.5 ★', color:'#00B67A' },
                { label:'Same-Day Dispatch', value:'Order by 2PM', color:'#60A5FA' },
                { label:'Delivery', value:'India-wide', color:'#22D3EE' },
                { label:'Packaging', value:'100% Discreet', color:'#8B5CF6' },
              ].map((item, i, arr) => (
                <div key={i} style={{
                  flex:'1 0 160px', display:'flex', flexDirection:'column', alignItems:'center',
                  justifyContent:'center', padding:'18px 16px', gap:4,
                  borderRight: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none',
                }}>
                  <span style={{ color:item.color, fontSize:22, fontWeight:800, letterSpacing:'-0.02em' }}>{item.value}</span>
                  <span style={{ color:'rgba(148,163,184,.55)', fontSize:11, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Product ticker ── */}
        <div style={{ position:'relative', overflow:'hidden', borderBottom:`1px solid ${BORDER}` }}>
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:80, background:`linear-gradient(to right,${BG},transparent)`, zIndex:10, pointerEvents:'none' }} />
          <div style={{ position:'absolute', right:0, top:0, bottom:0, width:80, background:`linear-gradient(to left,${BG},transparent)`, zIndex:10, pointerEvents:'none' }} />
          <div style={{ display:'flex', animation:'marquee-scroll 48s linear infinite' }}>
            {[0, 1].map(set => (
              <div key={set} style={{ display:'flex', alignItems:'stretch', flexShrink:0 }} aria-hidden={set === 1}>
                {PEPTIDE_ITEMS.map((item, i) => (
                  <button key={i} type="button" onClick={() => navigate(`/product/${item.id}`)}
                    style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, padding:'16px 24px', background:'transparent', border:'none', cursor:'pointer', outline:'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ width:56, height:56, borderRadius:14, overflow:'hidden', background:'#071428', border:`1px solid ${BORDER}` }}>
                      <img src={item.image} alt={item.name} loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    </div>
                    <span style={{ fontSize:10, fontWeight:600, color:'rgba(148,163,184,.5)', textTransform:'uppercase', letterSpacing:'0.08em', whiteSpace:'nowrap' }}>
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FEATURE SECTION ═══════════════════════ */}
      <section style={{ background:BG, padding:'96px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>

          <AnimatedSection>
            <div style={{ textAlign:'center', marginBottom:56 }}>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:8, marginBottom:20,
                padding:'6px 16px', borderRadius:99,
                background:'rgba(59,130,246,.08)', border:'1px solid rgba(59,130,246,.2)',
              }}>
                <span style={{ color:'#60A5FA', fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' }}>
                  Why Researchers Choose RetraLabs
                </span>
              </div>
              <h2 style={{ color:'#EFF6FF', fontSize:'clamp(32px,4vw,52px)', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.1, margin:'0 0 16px' }}>
                Built for Scientists.<br />
                <span style={{ background:'linear-gradient(90deg,#60A5FA,#22D3EE)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  Not for Compromises.
                </span>
              </h2>
              <p style={{ color:'rgba(148,163,184,.65)', fontSize:16, maxWidth:480, margin:'0 auto', lineHeight:1.65 }}>
                Every decision we make starts with one question: what does a researcher actually need?
              </p>
            </div>
          </AnimatedSection>

          {/* 5-card grid: 2 on top, 3 on bottom */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16, marginBottom:16 }}>
            {FEATURES.slice(0, 2).map((f, i) => (
              <FeatureCard key={i} f={f} delay={i * 0.08} />
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {FEATURES.slice(2).map((f, i) => (
              <FeatureCard key={i} f={f} delay={(i + 2) * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ COD ANNOUNCEMENT ═══════════════════════ */}
      <section style={{ background:BG, padding:'96px 24px', position:'relative', overflow:'hidden' }}>
        {/* Background glow */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:'20%', left:'30%', width:'40%', height:'60%', background:'radial-gradient(ellipse,rgba(245,158,11,.06) 0%,transparent 65%)', filter:'blur(60px)' }} />
        </div>

        <div style={{ maxWidth:1000, margin:'0 auto', position:'relative' }}>
          <motion.div
            initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true, margin:'0px 0px -60px 0px' }}
            transition={{ duration:.6, ease:[.16,1,.3,1] }}
            style={{
              background:'rgba(255,255,255,.03)',
              border:'1px solid rgba(245,158,11,.2)',
              borderRadius:24,
              padding:'64px 56px',
              position:'relative',
              overflow:'hidden',
            }}
          >
            {/* Top edge glow amber */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(245,158,11,.6) 40%,rgba(251,191,36,.5) 60%,transparent)' }} />

            <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:48, alignItems:'center' }}>
              <div>
                {/* New badge */}
                <div style={{
                  display:'inline-flex', alignItems:'center', gap:8, marginBottom:24,
                  padding:'6px 14px', borderRadius:99,
                  background:'rgba(245,158,11,.1)', border:'1px solid rgba(245,158,11,.3)',
                }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:'#F59E0B', animation:'hp-pulse 2s ease-in-out infinite' }} />
                  <span style={{ color:'#FCD34D', fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' }}>
                    New · Product Announcement
                  </span>
                </div>

                <p style={{ color:'rgba(251,191,36,.75)', fontSize:13, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:12 }}>
                  You Asked. We Delivered.
                </p>
                <h2 style={{ color:'#FFFBEB', fontSize:'clamp(28px,4vw,48px)', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.1, margin:'0 0 16px' }}>
                  Cash on Delivery<br />
                  <span style={{
                    background:'linear-gradient(90deg,#FCD34D,#F59E0B,#FCD34D)',
                    backgroundSize:'200% auto',
                    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                    animation:'hp-shimmer 3s linear infinite',
                  }}>
                    Is Now Available.
                  </span>
                </h2>
                <p style={{ color:'rgba(148,163,184,.7)', fontSize:15, lineHeight:1.65, maxWidth:480, marginBottom:32 }}>
                  Order with complete confidence. Pay only when your package arrives at your doorstep — across every city in India. No upfront risk. No questions.
                </p>

                {/* COD fee grid */}
                <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:32 }}>
                  {[
                    { label:'Up to ₹8,000', fee:'₹600 COD fee' },
                    { label:'₹8k – ₹16k',   fee:'₹1,200 COD fee' },
                    { label:'Above ₹16k',   fee:'₹1,500 COD fee' },
                    { label:'Online / UPI',  fee:'Free always' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      padding:'10px 16px', borderRadius:12,
                      background:'rgba(245,158,11,.06)', border:'1px solid rgba(245,158,11,.15)',
                    }}>
                      <div style={{ color:'rgba(252,211,77,.8)', fontSize:11, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase' }}>{item.label}</div>
                      <div style={{ color:'rgba(251,191,36,.6)', fontSize:12, fontWeight:500, marginTop:2 }}>{item.fee}</div>
                    </div>
                  ))}
                </div>

                <motion.button
                  type="button" onClick={() => navigate('/catalogue')}
                  style={{
                    display:'inline-flex', alignItems:'center', gap:8,
                    padding:'14px 28px', borderRadius:14, border:'none', cursor:'pointer',
                    background:'linear-gradient(135deg,#D97706,#F59E0B)',
                    color:'#1C0A00', fontWeight:700, fontSize:15, letterSpacing:'0.02em',
                    boxShadow:'0 0 32px rgba(245,158,11,.3)',
                  }}
                  whileHover={{ scale:1.04, boxShadow:'0 0 48px rgba(245,158,11,.5)' }}
                  whileTap={{ scale:.97 }}
                  transition={{ duration:.15 }}
                >
                  Shop with COD <ArrowRight size={16} />
                </motion.button>
              </div>

              {/* Right visual */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
                <div style={{
                  width:120, height:120, borderRadius:'50%',
                  background:'rgba(245,158,11,.1)', border:'1px solid rgba(245,158,11,.2)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:'0 0 40px rgba(245,158,11,.15)',
                }}>
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <rect x="8" y="18" width="44" height="30" rx="4" fill="rgba(245,158,11,.15)" stroke="rgba(245,158,11,.5)" strokeWidth="1.5"/>
                    <path d="M20 18V14a2 2 0 012-2h16a2 2 0 012 2v4" stroke="rgba(245,158,11,.5)" strokeWidth="1.5"/>
                    <rect x="22" y="30" width="16" height="10" rx="2" fill="rgba(245,158,11,.3)" stroke="rgba(245,158,11,.6)" strokeWidth="1"/>
                    <path d="M27 35l2 2 4-4" stroke="#FCD34D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ color:'#FCD34D', fontSize:13, fontWeight:700 }}>COD Available</div>
                  <div style={{ color:'rgba(148,163,184,.5)', fontSize:11, marginTop:2 }}>Across India</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ SOCIAL PROOF ═══════════════════════ */}
      <section style={{ background:'rgba(255,255,255,.02)', borderTop:`1px solid ${BORDER}`, padding:'96px 24px' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <AnimatedSection>
            <div style={{ textAlign:'center', marginBottom:48 }}>
              <p style={{ color:'rgba(148,163,184,.4)', fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:12 }}>
                Real Researchers. Zero Paid Promotions.
              </p>
              <h2 style={{ color:'#EFF6FF', fontSize:'clamp(28px,3.5vw,44px)', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.1, margin:0 }}>
                Don't Take Our Word For It.
              </h2>
            </div>
          </AnimatedSection>

          <motion.div
            style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}
            initial="hidden" whileInView="visible"
            viewport={{ once:true, margin:'0px 0px -40px 0px' }}
            variants={staggerMedium}
          >
            {TESTIMONIALS.map(t => (
              <motion.div key={t.name} variants={fadeUp}>
                <motion.div
                  style={{
                    background:CARD_BG, border:`1px solid ${BORDER}`,
                    borderRadius:20, padding:28, height:'100%',
                    backdropFilter:'blur(8px)',
                  }}
                  whileHover={{ borderColor:'rgba(255,255,255,.15)', y:-4, boxShadow:'0 20px 48px rgba(0,0,0,.5)' }}
                  transition={{ duration:.2 }}
                >
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                    <div style={{
                      width:36, height:36, borderRadius:'50%',
                      background:`linear-gradient(135deg,${t.gradient.replace('from-','').replace(' to-',',')})`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      color:'#fff', fontWeight:700, fontSize:14, flexShrink:0,
                    }}>
                      {t.initial}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ color:'#EFF6FF', fontSize:13, fontWeight:600 }}>{t.name}</div>
                      <div style={{ display:'flex', gap:2, marginTop:2 }}>
                        {[...Array(t.rating)].map((_, j) => (
                          <Star key={j} size={11} style={{ fill:'#F59E0B', color:'#F59E0B' }} />
                        ))}
                      </div>
                    </div>
                    <div style={{
                      display:'flex', alignItems:'center', gap:5,
                      padding:'4px 10px', borderRadius:99,
                      background:'rgba(255,69,0,.08)', border:'1px solid rgba(255,69,0,.2)',
                    }}>
                      <svg width="10" height="10" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="10" fill="#FF4500"/>
                        <path d="M16.67 10a1.46 1.46 0 00-2.47-1 7.12 7.12 0 00-3.85-1.23l.65-3.08 2.13.45a1 1 0 101.07-1 1 1 0 00-.96.68l-2.38-.5a.16.16 0 00-.19.12l-.73 3.44a7.14 7.14 0 00-3.89 1.23 1.46 1.46 0 10-1.61 2.39 2.87 2.87 0 000 .44c0 2.24 2.61 4.06 5.83 4.06s5.83-1.82 5.83-4.06a2.87 2.87 0 000-.44 1.46 1.46 0 00.47-1.5zM7.5 11a1 1 0 111 1 1 1 0 01-1-1zm5.58 2.71a3.58 3.58 0 01-2.08.56 3.58 3.58 0 01-2.08-.56.19.19 0 01.22-.3 3.24 3.24 0 001.86.49 3.24 3.24 0 001.86-.49.19.19 0 01.22.3zm-.08-1.71a1 1 0 111-1 1 1 0 01-1 1z" fill="white"/>
                      </svg>
                      <span style={{ color:'#FF6534', fontSize:10, fontWeight:700 }}>Reddit</span>
                    </div>
                  </div>
                  <p style={{ color:'rgba(203,213,225,.75)', fontSize:14, lineHeight:1.7, margin:'0 0 16px' }}>"{t.text}"</p>
                  <div style={{ borderTop:`1px solid ${BORDER}`, paddingTop:12 }}>
                    <span style={{ color:'rgba(148,163,184,.4)', fontSize:11 }}>{t.product}</span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <div style={{ textAlign:'center', marginTop:32 }}>
            <motion.button
              type="button" onClick={() => navigate('/proof')}
              style={{
                display:'inline-flex', alignItems:'center', gap:8,
                padding:'12px 24px', borderRadius:12, cursor:'pointer',
                background:CARD_BG, border:`1px solid ${BORDER}`,
                color:'rgba(226,232,240,.7)', fontWeight:600, fontSize:14,
              }}
              whileHover={{ borderColor:'rgba(255,255,255,.2)', color:'rgba(226,232,240,1)' }}
              whileTap={{ scale:.97 }}
              transition={{ duration:.15 }}
            >
              See All Field Reports <ArrowRight size={15} />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TRUSTPILOT ═══════════════════════ */}
      <Suspense fallback={<div style={{ background:'#040812', height:560 }} />}>
        <TrustpilotSection />
      </Suspense>

      {/* ═══════════════════════ DISCLAIMER ═══════════════════════ */}
      <section style={{ background:BG, borderTop:`1px solid ${BORDER}`, padding:'48px 24px' }}>
        <div style={{ maxWidth:720, margin:'0 auto' }}>
          <div style={{
            display:'flex', gap:16, alignItems:'flex-start',
            background:'rgba(245,158,11,.05)', border:'1px solid rgba(245,158,11,.15)',
            borderRadius:16, padding:24,
          }}>
            <div style={{
              width:36, height:36, borderRadius:10, background:'rgba(245,158,11,.1)',
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
            }}>
              <AlertTriangle size={18} style={{ color:'#F59E0B' }} />
            </div>
            <div>
              <p style={{ color:'#FCD34D', fontWeight:700, fontSize:13, marginBottom:6 }}>Research Use Only</p>
              <p style={{ color:'rgba(148,163,184,.6)', fontSize:13, lineHeight:1.65, margin:0 }}>
                All products are intended solely for in vitro research and analytical applications. Not approved for human or veterinary use. By ordering, you confirm you are a qualified researcher operating in compliance with applicable regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

// ── Feature Card ──────────────────────────────────────────────────────────────
function FeatureCard({ f, delay }: { f: typeof FEATURES[0]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:'0px 0px -40px 0px' }}
      transition={{ duration:.5, delay, ease:[.16,1,.3,1] }}
    >
      <motion.div
        style={{
          background: 'rgba(255,255,255,.03)',
          border: '1px solid rgba(255,255,255,.07)',
          borderRadius: 20, padding: 28, height: '100%',
          backdropFilter: 'blur(8px)', position: 'relative', overflow: 'hidden',
        }}
        whileHover={{ borderColor: `${f.accent}33`, boxShadow: `0 0 40px ${f.accent}15`, y: -4 }}
        transition={{ duration: .2 }}
      >
        {/* Accent glow corner */}
        <div style={{ position:'absolute', top:0, left:0, width:120, height:120, background:`radial-gradient(circle at 0% 0%,${f.accent}12,transparent 70%)`, pointerEvents:'none' }} />

        <div style={{
          width:44, height:44, borderRadius:12, marginBottom:20,
          display:'flex', alignItems:'center', justifyContent:'center',
          background:`${f.accent}15`, border:`1px solid ${f.accent}30`,
        }}>
          <f.icon size={20} style={{ color: f.accent }} />
        </div>
        <h3 style={{ color:'#EFF6FF', fontSize:16, fontWeight:700, marginBottom:8, lineHeight:1.3 }}>{f.title}</h3>
        <p style={{ color:'rgba(148,163,184,.65)', fontSize:13, lineHeight:1.65, margin:0 }}>{f.desc}</p>

        <div style={{
          display:'inline-flex', alignItems:'center', gap:6, marginTop:20,
          padding:'4px 12px', borderRadius:99,
          background:`${f.accent}0D`, border:`1px solid ${f.accent}25`,
        }}>
          <CheckCircle2 size={12} style={{ color: f.accent }} />
          <span style={{ color: f.accent, fontSize:11, fontWeight:600, letterSpacing:'0.06em' }}>Verified</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
