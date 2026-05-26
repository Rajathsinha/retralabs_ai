import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Avatar,
  Chip,
  Divider,
  Progress,
} from '@heroui/react';
import {
  FlaskConical, ShieldCheck, Globe, BadgeCheck, ArrowRight,
  CheckCircle2, Users, TrendingUp, Clock, Truck,
  Microscope, Award, Heart, Lightbulb, Target,
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const STATS = [
  { value: '3,000+', label: 'Orders Shipped', icon: Truck, colorClass: 'text-brand-600 bg-brand-50' },
  { value: '98%+', label: 'Avg Purity Verified', icon: FlaskConical, colorClass: 'text-emerald-700 bg-emerald-50' },
  { value: '6', label: 'Premium Compounds', icon: Microscope, colorClass: 'text-accent-700 bg-accent-50' },
];

const TEAM = [
  {
    role: 'Founder & Operations Lead',
    initials: 'RL',
    bio: "Background in biochemistry and supply chain management. Identified the gap in India's research peptide market after personally struggling to source legitimate compounds for research work.",
    gradient: 'from-brand-500 to-accent-500',
  },
  {
    role: 'Quality & Sourcing Head',
    initials: 'QA',
    bio: 'Works directly with GMP-certified manufacturing partners to verify every batch. Oversees HPLC testing protocols and certificate of analysis documentation for all products.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    role: 'Customer Relations',
    initials: 'CR',
    bio: 'Your first point of contact for orders, queries, and support. Handles WhatsApp and email support. Committed to zero-jargon, honest communication with every customer.',
    gradient: 'from-amber-500 to-orange-500',
  },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Radical Transparency',
    desc: "We publish purity data, sourcing details, and pricing rationale openly. No hidden costs, no mystery products.",
    colorClass: 'text-emerald-600 bg-emerald-50',
  },
  {
    icon: Lightbulb,
    title: 'Science First',
    desc: "Every product decision is driven by scientific merit and researcher demand. We don't list anything we can't vouch for.",
    colorClass: 'text-blue-600 bg-blue-50',
  },
  {
    icon: Heart,
    title: 'Community Driven',
    desc: 'The r/retralabs community shaped us. We listen to real researcher feedback and iterate on sourcing, packaging, and service accordingly.',
    colorClass: 'text-rose-600 bg-rose-50',
  },
  {
    icon: Target,
    title: 'Fair Pricing',
    desc: "Margins that are honest and sustainable — not extractive. Our goal is to democratize access to genuine research-grade compounds in India.",
    colorClass: 'text-amber-600 bg-amber-50',
  },
];

const QUALITY_STEPS = [
  { step: '01', title: 'Source Verification', desc: 'Manufacturer credentials, GMP certification, and prior batch records reviewed before any new supplier relationship.' },
  { step: '02', title: 'Batch Testing', desc: 'Each incoming batch is independently HPLC-tested. Batches below 98% threshold are rejected outright — no exceptions.' },
  { step: '03', title: 'COA Issuance', desc: 'Certificate of Analysis documenting purity, molecular weight, and testing methodology issued with every single order.' },
  { step: '04', title: 'Sterile Packaging', desc: 'Lyophilised peptides sealed in pharmaceutical-grade sterile vials. Cold-chain packaging for transit integrity.' },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-slate-950 py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-dot-pattern bg-dot-sm opacity-[0.04]" />
          <div className="absolute top-1/4 -left-40 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <span className="inline-block px-4 py-2 bg-white/5 text-accent-300 text-xs font-bold rounded-full uppercase tracking-wider border border-white/10 mb-6">
            Our Story
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            We Built RetraLabs<br />
            <span className="text-gradient">Because We Got Scammed</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            India's research peptide market is still a mess of counterfeit sellers, fake B2B listings, and zero accountability. We got scammed. Got angry. Built something better. One verified batch at a time.
          </p>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 80}>
                <Card
                  shadow="none"
                  className="border border-slate-100 bg-slate-50 hover:shadow-sm transition-shadow text-center"
                  radius="lg"
                >
                  <CardBody className="p-6 flex flex-col items-center">
                    <div className={`inline-flex p-3 rounded-xl mb-4 ${stat.colorClass}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                  </CardBody>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOUNDING STORY ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div>
                <span className="inline-block px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider mb-6">
                  The Origin
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                  The Scam That<br />Started It All.
                </h2>
                <div className="space-y-5 text-slate-600 leading-relaxed">
                  <p>
                    In 2023, our founder — a researcher chasing GLP-1 compounds — spent months trying to source legitimate Retatrutide in India. Every B2B marketplace seller, every Instagram "peptide shop" was either counterfeit, absurdly overpriced, or just ghosted after payment. Real money. Fake product. No accountability.
                  </p>
                  <p>
                    Then came a direct connection with a GMP-certified facility in China. Properly HPLC-tested. COA included. Night and day. The question wasn't complicated: why doesn't India have a single trustworthy supplier for researchers?
                  </p>
                  <p>
                    So we built one. Real manufacturer relationships. Strict batch testing. No middlemen, no markups, no mystery. We started on Reddit, grew through word of mouth — because when the product is real, the reviews take care of themselves.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <Card shadow="none" className="border border-slate-200 bg-slate-50" radius="xl">
                <CardBody className="p-8">
                  <div className="space-y-6">
                    {/* Before */}
                    <Card shadow="none" className="border border-slate-200 bg-white" radius="lg">
                      <CardBody className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-red-600 font-bold text-sm">✗</span>
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 mb-1">Before RetraLabs</div>
                            <p className="text-sm text-slate-600">Fake online sellers, counterfeit Peptide Sciences vials, no COA, no accountability, ~₹7,000 lost to counterfeit products.</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-emerald-600 rotate-90" />
                      </div>
                    </div>

                    {/* After */}
                    <Card shadow="none" className="border border-emerald-200 bg-emerald-50" radius="lg">
                      <CardBody className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">✓</span>
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 mb-1">With RetraLabs</div>
                            <p className="text-sm text-slate-600">Verified GMP source, HPLC-tested batch, COA included, real effects within hours, 3,000+ researchers served.</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>

                    <div className="pt-2">
                      <div className="text-xs text-slate-400 text-center italic">
                        Real before/after from r/retralabs community posts
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                Our Team
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Small Team, High Standards</h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                We operate lean by design. Every person on the team is directly accountable to the customer.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM.map((member, i) => (
              <ScrollReveal key={member.role} delay={i * 120}>
                <Card
                  shadow="none"
                  className="border border-slate-200 bg-white hover:shadow-md transition-all duration-300"
                  radius="lg"
                >
                  <CardBody className="p-8">
                    <Avatar
                      name={member.initials}
                      classNames={{
                        base: `bg-gradient-to-br ${member.gradient} mb-6 shadow-md`,
                        name: 'text-white font-bold text-lg',
                      }}
                      size="lg"
                      radius="lg"
                    />
                    <h3 className="font-bold text-slate-900 mb-3">{member.role}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{member.bio}</p>
                  </CardBody>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="mt-10 text-center">
              <Chip
                startContent={<Users className="w-4 h-4 text-slate-400 ml-1" />}
                variant="bordered"
                classNames={{
                  base: 'border-slate-200 bg-white px-2 py-5 h-auto',
                  content: 'text-sm text-slate-500',
                }}
              >
                We operate under pseudonymous identities for researcher privacy — a standard practice in this space
              </Chip>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── VALUES ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                Our Values
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">What We Actually Stand For.</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 100}>
                <Card
                  shadow="none"
                  isPressable
                  isHoverable
                  className="border border-slate-200 bg-slate-50 hover:shadow-sm transition-shadow"
                  radius="lg"
                >
                  <CardBody className="p-7">
                    <div className="flex items-start gap-5">
                      <div className={`p-3 rounded-xl flex-shrink-0 ${value.colorClass}`}>
                        <value.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 mb-2">{value.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{value.desc}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── QUALITY PROCESS ─── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                Quality Assurance
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How We Make Sure You Get the Real Thing.</h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                Every single order goes through this process. No shortcuts. No skipping steps. No "it's probably fine."
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {QUALITY_STEPS.map((step, i) => (
              <ScrollReveal key={step.step} delay={i * 100}>
                <Card
                  shadow="none"
                  className="border border-slate-200 bg-white hover:shadow-md hover:border-slate-300 transition-all duration-300"
                  radius="lg"
                >
                  <CardBody className="p-7">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-lg mb-5 shadow-md">
                      {step.step}
                    </div>
                    <h3 className="font-bold text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                  </CardBody>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <Card
              shadow="none"
              className="mt-10 border border-emerald-200 bg-emerald-50 max-w-2xl mx-auto"
              radius="lg"
            >
              <CardBody className="p-7 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-bold text-emerald-900 mb-2">COA with Every Order</h3>
                <p className="text-sm text-emerald-700 leading-relaxed">
                  Every order ships with a full Certificate of Analysis — purity, molecular weight, and HPLC data included. No requests needed.
                </p>
              </CardBody>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── COMMITMENT SECTION ─── */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="p-4 bg-white/10 rounded-2xl inline-block mb-8">
              <Award className="w-10 h-10 text-accent-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">We're In It for the Long Game.</h2>
            <p className="text-slate-400 leading-relaxed text-lg mb-10 max-w-2xl mx-auto">
              If a batch doesn't pass purity, it doesn't ship. If your order arrives damaged, we replace it. If you ask us a question before buying and we don't have what you need, we'll tell you that too. Honest business is just better business.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: BadgeCheck, label: 'COA with Every Order' },
                { icon: Globe, label: 'Verified GMP Source' },
                { icon: TrendingUp, label: '3,000+ Happy Researchers' },
                { icon: Clock, label: 'Fast Support Response' },
              ].map((item) => (
                <Chip
                  key={item.label}
                  startContent={<item.icon className="w-4 h-4 text-accent-400 ml-1" />}
                  variant="bordered"
                  classNames={{
                    base: 'border-white/10 bg-white/5 px-2 py-5 h-auto',
                    content: 'text-white text-sm font-medium',
                  }}
                >
                  {item.label}
                </Chip>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── RESEARCH DISCLAIMER ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <Card
              shadow="none"
              className="border border-amber-200 bg-amber-50"
              radius="lg"
            >
              <CardBody className="p-8">
                <h3 className="font-bold text-amber-900 mb-3">Research Use Only</h3>
                <p className="text-amber-800 text-sm leading-relaxed">
                  All products sold through RetraLabs are strictly for in vitro research and analytical
                  applications. They are not intended for human consumption, medical use, or application
                  outside of controlled laboratory environments. Purchasers must be affiliated with
                  recognized research institutions and comply with all applicable local and national regulations.
                </p>
              </CardBody>
            </Card>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
