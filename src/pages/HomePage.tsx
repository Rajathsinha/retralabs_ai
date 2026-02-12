import { FlaskConical, ShieldCheck, PackageCheck, Globe, BadgeCheck, IndianRupee, Sparkles, ArrowRight, Beaker, Truck, Award } from 'lucide-react';
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
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 bg-white/5 text-accent-300 text-sm font-medium rounded-full border border-white/10 backdrop-blur-sm animate-fade-in-down">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Research-Grade Peptides
            </div>

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
                { icon: Sparkles, label: '99%+ Purity', color: 'text-accent-400' },
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
              <button
                onClick={() => onNavigate('catalogue')}
                className="group px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                View Catalogue
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('support')}
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      <section className="py-32 bg-gradient-to-b from-white via-slate-50/30 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern bg-dot-sm opacity-[0.02]" />

        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '2s' }} />

        <div className="absolute top-40 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-float" />
        <div className="absolute top-60 right-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-float-delayed" />
        <div className="absolute bottom-40 left-1/3 w-2.5 h-2.5 bg-amber-400 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-300 rounded-full animate-float-delayed" style={{ animationDelay: '2.5s' }} />
        <div className="absolute bottom-1/3 right-1/5 w-3 h-3 bg-emerald-300 rounded-full animate-float" style={{ animationDelay: '3s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollReveal>
            <div className="text-center mb-24">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-50 via-emerald-50 to-amber-50 text-slate-700 text-xs font-bold rounded-full uppercase tracking-wider mb-8 border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce-subtle relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/40 to-blue-400/0 animate-shimmer" />
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />
                <span className="relative z-10">Why RetraLabs</span>
                <Sparkles className="w-4 h-4 text-blue-500 animate-spin" style={{ animationDuration: '4s' }} />
              </div>

              <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Built on Trust &{' '}
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-emerald-600 to-amber-600 animate-gradient-shift">
                    Quality
                  </span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-emerald-600 to-amber-600 opacity-20 blur-xl animate-gradient-shift" />
                </span>
              </h2>

              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Every product meets the highest standards for research excellence
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: FlaskConical,
                title: 'Laboratory Grade',
                desc: 'High-purity peptides manufactured to rigorous analytical standards with HPLC verification.',
                gradient: 'from-blue-100 via-blue-50 to-white',
                iconBg: 'from-blue-500 to-blue-600',
                iconColor: 'text-white',
                borderColor: 'border-blue-200',
                glowColor: 'shadow-blue-300/60',
                decoration: 'bg-blue-400/30',
                particleColor: 'bg-blue-400',
              },
              {
                icon: ShieldCheck,
                title: 'Batch Consistency',
                desc: 'Each batch is tested for purity and consistency to ensure reliable research results.',
                gradient: 'from-emerald-100 via-emerald-50 to-white',
                iconBg: 'from-emerald-500 to-emerald-600',
                iconColor: 'text-white',
                borderColor: 'border-emerald-200',
                glowColor: 'shadow-emerald-300/60',
                decoration: 'bg-emerald-400/30',
                particleColor: 'bg-emerald-400',
              },
              {
                icon: PackageCheck,
                title: 'Sterile Packaging',
                desc: 'Supplied in sterile vials to maintain integrity during storage and handling.',
                gradient: 'from-amber-100 via-amber-50 to-white',
                iconBg: 'from-amber-500 to-amber-600',
                iconColor: 'text-white',
                borderColor: 'border-amber-200',
                glowColor: 'shadow-amber-300/60',
                decoration: 'bg-amber-400/30',
                particleColor: 'bg-amber-400',
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 150}>
                <div
                  className={`group relative p-10 rounded-[2rem] bg-gradient-to-br ${item.gradient} border-2 ${item.borderColor} transition-all duration-700 hover:scale-110 hover:-translate-y-4 shadow-xl hover:shadow-2xl ${item.glowColor} cursor-pointer perspective-1000`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700`} />

                  <div className="absolute -inset-0.5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-r ${item.iconBg} opacity-20 animate-rotate-border blur-sm`} />
                  </div>

                  <div className={`absolute -top-4 -right-4 w-32 h-32 ${item.decoration} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-scale-pulse`} />
                  <div className={`absolute -bottom-3 -left-3 w-28 h-28 ${item.decoration} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-scale-pulse`} style={{ animationDelay: '0.5s' }} />
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 ${item.decoration} rounded-full blur-3xl opacity-0 group-hover:opacity-80 transition-all duration-700`} />

                  <div className={`absolute top-6 right-6 w-1.5 h-1.5 ${item.particleColor} rounded-full animate-float opacity-60`} />
                  <div className={`absolute bottom-10 left-8 w-1 h-1 ${item.particleColor} rounded-full animate-float-delayed opacity-60`} />
                  <div className={`absolute top-1/3 right-12 w-1 h-1 ${item.particleColor} rounded-full animate-float opacity-40`} style={{ animationDelay: '1s' }} />

                  <div className="relative" style={{ transform: 'translateZ(20px)' }}>
                    <div className="relative mb-8 inline-block">
                      <div className={`w-20 h-20 bg-gradient-to-br ${item.iconBg} rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-white/30 rounded-3xl blur-md animate-pulse" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/50 to-white/0 animate-shimmer" />
                        <item.icon className={`w-10 h-10 ${item.iconColor} relative z-10 group-hover:scale-110 transition-transform duration-500`} />
                      </div>
                      <div className={`absolute -inset-2 bg-gradient-to-br ${item.iconBg} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-700 animate-pulse`} />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-5 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:via-slate-700 group-hover:to-slate-900 transition-all duration-500 group-hover:scale-105">
                      {item.title}
                    </h3>

                    <p className="text-slate-600 leading-relaxed text-[15.5px] group-hover:text-slate-800 transition-all duration-500 mb-6">
                      {item.desc}
                    </p>

                    <div className="flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-slate-700 transition-all duration-500 group-hover:gap-3">
                      <span className="relative">
                        Learn more
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-slate-700 to-transparent group-hover:w-full transition-all duration-500" />
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 group-hover:scale-125 transition-all duration-500" />
                    </div>
                  </div>

                  <div className="absolute inset-0 rounded-[2rem] border-2 border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-dot-pattern bg-dot-sm opacity-[0.03]" />
              <div className="absolute top-0 right-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-center mb-8">
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                    <Globe className="w-10 h-10 text-accent-400" />
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
                    <span key={tag} className="px-5 py-2.5 bg-white/5 text-accent-300 rounded-full text-sm font-medium border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                Our Process
              </span>
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
                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center justify-center">
                      {item.step}
                    </span>
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
            <div className="max-w-3xl mx-auto bg-white rounded-2xl p-10 border border-slate-200 shadow-sm">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
                Research Use Only
              </h2>
              <p className="text-slate-600 leading-relaxed text-center text-lg">
                All products are intended solely for in vitro research and analytical applications.
                These materials are not approved for human or veterinary use. Purchasers must
                be affiliated with recognized research institutions or laboratories and comply
                with all applicable regulations.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
