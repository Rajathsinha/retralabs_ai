import { FlaskConical, ShieldCheck, PackageCheck, Globe, BadgeCheck, IndianRupee, Sparkles, ArrowRight, Beaker, Truck, Award } from 'lucide-react';
import { Button, Card, CardBody, Chip } from '@heroui/react';
import ScrollReveal from '../components/ScrollReveal';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-dot-pattern bg-dot-sm opacity-[0.04]" />
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Chip
              variant="bordered"
              color="secondary"
              startContent={<div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />}
              className="mb-8 px-4 py-2 border-white/10 bg-white/5 text-secondary-300 animate-fade-in-down"
            >
              Research-Grade Peptides
            </Chip>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1] animate-fade-in-up">
              India's Only Trusted Reseller for{' '}
              <span className="text-gradient">Chinese Pure Peptides</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              100% genuine research-grade peptides at fair, transparent prices. Sourced directly from verified manufacturers.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
              {[
                { icon: BadgeCheck, label: '100% Genuine', color: 'text-emerald-400' },
                { icon: Sparkles, label: '99%+ Purity', color: 'text-secondary-400' },
                { icon: IndianRupee, label: 'Fair Pricing', color: 'text-amber-400' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5 text-sm font-medium text-slate-300">
                  <div className="p-1.5 bg-white/10 rounded-lg">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  {item.label}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '350ms' }}>
              <Button
                color="default"
                size="lg"
                onPress={() => onNavigate('catalogue')}
                endContent={<ArrowRight className="w-4 h-4" />}
                className="bg-white text-slate-900 font-semibold shadow-lg hover:shadow-xl px-8"
              >
                View Catalogue
              </Button>
              <Button
                variant="bordered"
                size="lg"
                onPress={() => onNavigate('support')}
                className="border-white/10 text-white font-semibold bg-white/5 backdrop-blur-sm px-8"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Chip variant="flat" color="default" className="mb-4 uppercase tracking-wider text-xs font-bold">
                Why RetraLabs
              </Chip>
              <h2 className="section-heading">Built on Trust & Quality</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FlaskConical,
                title: 'Laboratory Grade',
                desc: 'High-purity peptides manufactured to rigorous analytical standards with HPLC verification.',
                gradient: 'from-blue-50 to-blue-100',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-700',
              },
              {
                icon: ShieldCheck,
                title: 'Batch Consistency',
                desc: 'Each batch is tested for purity and consistency to ensure reliable research results.',
                gradient: 'from-emerald-50 to-emerald-100',
                iconBg: 'bg-emerald-100',
                iconColor: 'text-emerald-700',
              },
              {
                icon: PackageCheck,
                title: 'Sterile Packaging',
                desc: 'Supplied in sterile vials to maintain integrity during storage and handling.',
                gradient: 'from-amber-50 to-amber-100',
                iconBg: 'bg-amber-100',
                iconColor: 'text-amber-700',
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 120}>
                <Card shadow="none" classNames={{ base: `bg-gradient-to-br ${item.gradient} border border-slate-200/50` }} className="card-hover">
                  <CardBody className="p-8">
                    <div className={`w-14 h-14 ${item.iconBg} rounded-2xl flex items-center justify-center mb-6`}>
                      <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                  </CardBody>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <Card shadow="lg" classNames={{ base: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden rounded-3xl' }}>
              <CardBody className="p-10 md:p-16 relative">
              <div className="absolute inset-0 bg-dot-pattern bg-dot-sm opacity-[0.03]" />
              <div className="absolute top-0 right-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-center mb-8">
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <Globe className="w-10 h-10 text-secondary-400" />
                  </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
                  Direct from Trusted Manufacturers
                </h2>
                <p className="text-lg text-slate-300 text-center max-w-3xl mx-auto leading-relaxed mb-8">
                  We source our peptides directly from trusted manufacturers from our partner facilities in China who offer genuine quality at transparent, fair pricing. Our goal is simple: to provide legitimate, research-grade peptides at reasonable prices without scams or shortcuts.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {['Verified China Reseller', 'Transparent Sourcing', 'COA Available'].map((tag) => (
                    <Chip key={tag} variant="bordered" color="secondary" className="border-white/10 bg-white/5 text-secondary-300">
                      {tag}
                    </Chip>
                  ))}
                </div>
              </div>
              </CardBody>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <Chip variant="flat" color="default" className="mb-4 uppercase tracking-wider text-xs font-bold">
                Our Process
              </Chip>
              <h2 className="section-heading">How It Works</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Beaker, step: '01', title: 'Browse', desc: 'Explore our curated catalogue of verified peptides' },
              { icon: PackageCheck, step: '02', title: 'Order', desc: 'Select your variants and place your order securely' },
              { icon: Award, step: '03', title: 'Verify', desc: 'Receive COA verification for every product' },
              { icon: Truck, step: '04', title: 'Receive', desc: 'Temperature-controlled shipping to your lab' },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 100}>
                <div className="text-center group">
                  <div className="relative inline-block mb-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-slate-200 transition-colors duration-300">
                      <item.icon className="w-7 h-7 text-slate-700" />
                    </div>
                    <Chip size="sm" variant="solid" classNames={{ base: 'absolute -top-2 -right-2 bg-slate-900 text-white min-w-7 h-7' }}>
                      {item.step}
                    </Chip>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <Card shadow="sm" className="max-w-3xl mx-auto">
              <CardBody className="p-10 text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Research Use Only
                </h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  All products are intended solely for in vitro research and analytical applications.
                  These materials are not approved for human or veterinary use. Purchasers must
                  be affiliated with recognized research institutions or laboratories and comply
                  with all applicable regulations.
                </p>
              </CardBody>
            </Card>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
