import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  Chip,
} from '@heroui/react';
import {
  FlaskConical, ShieldCheck, ArrowRight, Star,
  CheckCircle2, MessageCircle, AlertTriangle,
} from 'lucide-react';

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
        <span className="block text-2xl md:text-3xl text-slate-500 font-normal italic mt-3">(You're welcome.)</span>
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

const TESTIMONIALS = [
  {
    name: 'u/Frosty-Ad-9691',
    initial: 'F',
    gradient: 'from-blue-500 to-cyan-500',
    rating: 5,
    text: "Not gonna lie, I've seen really mindblowing progress. Dropped tons of fat and health feels much more under control. Sugar levels way better. Friends noticed — one jumped on it too. RetraLabs peps are really genuine.",
    product: 'Retatrutide',
  },
  {
    name: 'u/Affectionate_Fox_313',
    initial: 'A',
    gradient: 'from-emerald-500 to-teal-500',
    rating: 5,
    text: "I was very skeptical — had already been scammed by a fake online seller (fake vials, wasted ~7k). After checking proof from another user, I took the gamble. Quality is absolutely legit.",
    product: 'Retatrutide',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [heroIndex, setHeroIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setVisible(false);
      setTimeout(() => {
        setHeroIndex(i => (i + 1) % HERO_HEADLINES.length);
        // Fade in
        setVisible(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">

      {/* ─── HERO — The Scam Story ─── */}
      <section className="relative overflow-hidden bg-slate-950 pt-16 pb-0">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-dot-pattern bg-dot-sm opacity-[0.04]" />
          <div className="absolute top-1/4 -left-56 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-1/3 -right-56 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1.2s' }} />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">

          {/* Trustpilot badge */}
          <div className="flex justify-center mb-10 animate-fade-in-down">
            <a
              href="https://www.trustpilot.com/review/retralabs.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 hover:opacity-90 transition-opacity"
            >
              <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/8 transition-colors rounded-full px-5 py-2.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-white/30 text-xs">|</span>
                <span className="text-cyan-300 text-sm font-medium">Verified on Trustpilot · See real reviews →</span>
              </div>
            </a>
          </div>

          {/* Headline — rotating every 5s */}
          <div className="animate-fade-in-up">
            {/* Fixed-height wrapper prevents layout shift during transitions */}
            <div className="min-h-[200px] md:min-h-[280px] flex items-center justify-center mb-4">
              <h1
                key={heroIndex}
                className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05] text-center transition-all duration-500"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0px)' : 'translateY(16px)',
                }}
              >
                {HERO_HEADLINES[heroIndex].jsx}
              </h1>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mb-6">
              {HERO_HEADLINES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setVisible(false); setTimeout(() => { setHeroIndex(i); setVisible(true); }, 300); }}
                  className={`rounded-full transition-all duration-300 ${
                    i === heroIndex
                      ? 'w-6 h-1.5 bg-cyan-400'
                      : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/40'
                  }`}
                  aria-label={`Headline ${i + 1}`}
                />
              ))}
            </div>
            <p className="text-lg md:text-xl text-slate-400 mb-4 leading-relaxed max-w-2xl mx-auto" style={{ animationDelay: '100ms' }}>
              Fake vials. Useless compounds. Thousands wasted. We couldn't find a single legitimate peptide supplier in India, so we went directly to GMP manufacturers, got HPLC testing done, and made it accessible to everyone.
            </p>
            <p className="text-slate-500 text-sm italic mb-10" style={{ animationDelay: '150ms' }}>
              That's the whole story. Everything else is just good products at honest prices.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16" style={{ animationDelay: '200ms' }}>
              <button
                type="button"
                onClick={() => navigate('/catalogue')}
                className="inline-flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 text-slate-900 font-extrabold text-base px-8 py-3.5 rounded-2xl shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                Shop the Real Stuff <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/about')}
                className="inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/14 border border-white/15 hover:border-white/30 text-white font-semibold text-base px-8 py-3.5 rounded-2xl backdrop-blur-sm transition-all duration-200"
              >
                Read Our Story
              </button>
            </div>
          </div>

        </div>

        {/* ── STATS MARQUEE — full bleed ── */}
        <div className="relative mt-10 overflow-hidden py-6">
          {/* Edge fade — left */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
          {/* Edge fade — right */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

          <div
            className="flex"
            style={{ animation: 'marquee-scroll 28s linear infinite' }}
          >
            {/* Render twice for seamless infinite loop */}
            {[0, 1].map((set) => (
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

        {/* Fade to white */}
        <div className="h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ─── WHY IT'S DIFFERENT ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">What makes us different</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Because the Alternative Is Fake, Unverified Junk.</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">Every peptide we sell is HPLC-verified, COA-backed, and sourced directly. Radical concept, we know.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: FlaskConical,
                title: 'HPLC-Verified. Every Batch.',
                desc: 'Independent third-party purity testing on every single batch. Certificate of Analysis included — not on request, just always.',
                stat: '99%+ Purity',
                chipColor: 'primary' as const,
                bg: 'from-blue-50 to-cyan-50',
                border: 'border-blue-100',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-700',
              },
              {
                icon: ShieldCheck,
                title: 'Direct from GMP. No Middlemen.',
                desc: 'We source from certified GMP manufacturing partners. No markup chains. No mystery suppliers. No "trust me bro" sourcing.',
                stat: 'GMP Certified Source',
                chipColor: 'success' as const,
                bg: 'from-emerald-50 to-teal-50',
                border: 'border-emerald-100',
                iconBg: 'bg-emerald-100',
                iconColor: 'text-emerald-700',
              },
              {
                icon: MessageCircle,
                title: 'Real Humans. Fast Replies.',
                desc: 'WhatsApp support with actual people who know the products. No bots. No 5-day email threads. Usually under an hour.',
                stat: '1hr SLA · 9AM–6PM',
                chipColor: 'warning' as const,
                bg: 'from-amber-50 to-orange-50',
                border: 'border-amber-100',
                iconBg: 'bg-amber-100',
                iconColor: 'text-amber-700',
              },
            ].map((item) => (
              <Card
                key={item.title}
                className={`bg-gradient-to-br ${item.bg} border ${item.border} shadow-none h-full`}
              >
                <CardBody className="p-7 flex flex-col gap-0">
                  <div className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                    <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-5 flex-1">{item.desc}</p>
                  <Chip
                    variant="bordered"
                    color={item.chipColor}
                    size="sm"
                    className="self-start text-xs font-bold"
                    startContent={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    {item.stat}
                  </Chip>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products live on /catalogue — not shown here */}

      {/* ─── SOCIAL PROOF ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">The internet agrees</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Don't Take Our Word For It.</h2>
            <p className="text-slate-500 mt-2 text-sm">Real posts. Real researchers. Zero paid promotions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {TESTIMONIALS.map((t) => (
              <Card
                key={t.name}
                className="bg-slate-50 border border-slate-200 shadow-none hover:shadow-sm hover:border-slate-300 transition-all duration-200"
              >
                <CardBody className="p-6">
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
                      size="sm"
                      variant="flat"
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
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              className="bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 px-7"
              endContent={<ArrowRight className="w-4 h-4" />}
              onPress={() => navigate('/reviews')}
            >
              Read All 5-Star Reviews →
            </Button>
          </div>
        </div>
      </section>

      {/* ─── RESEARCH DISCLAIMER ─── */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border border-amber-200 bg-amber-50 shadow-none">
            <CardBody className="flex flex-row items-start gap-4 p-6">
              <div className="p-2 bg-amber-100 rounded-xl flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-amber-900 mb-1.5">Heads Up — Research Use Only.</h3>
                <p className="text-sm text-amber-800 leading-relaxed">
                  All products are intended solely for in vitro research and analytical applications.
                  Not approved for human or veterinary use. By ordering, you confirm you are a qualified researcher
                  operating in compliance with applicable regulations.
                </p>
                <Chip
                  size="sm"
                  variant="flat"
                  color="warning"
                  className="mt-3 text-xs font-bold"
                >
                  Not for Human Use
                </Chip>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

    </div>
  );
}
