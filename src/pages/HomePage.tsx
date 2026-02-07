import { FlaskConical, ShieldCheck, PackageCheck, Globe, ExternalLink, BadgeCheck, IndianRupee, Sparkles } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-cyan-50 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              <BadgeCheck className="w-4 h-4" />
              Research-Grade Peptides
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
              India's Only Trusted Reseller for{' '}
              <span className="text-blue-700">Chinese Pure Peptides</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              100% genuine research-grade peptides at fair, transparent prices. Sourced directly from verified manufacturers.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <div className="p-1.5 bg-green-100 rounded-full">
                  <BadgeCheck className="w-4 h-4 text-green-600" />
                </div>
                100% Genuine
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <div className="p-1.5 bg-blue-100 rounded-full">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
                99%+ Purity
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <div className="p-1.5 bg-amber-100 rounded-full">
                  <IndianRupee className="w-4 h-4 text-amber-600" />
                </div>
                Fair Pricing
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('catalogue')}
                className="px-8 py-4 bg-blue-700 text-white font-semibold hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                View Catalogue
              </button>
              <button
                onClick={() => onNavigate('support')}
                className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all shadow-md hover:shadow-lg"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-12 text-white shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <Globe className="w-12 h-12 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold text-center mb-6">
            Direct from Trusted Manufacturers
          </h2>
          <p className="text-lg text-slate-300 text-center max-w-3xl mx-auto leading-relaxed">
            At RetraLabs, we source our peptides directly from trusted manufacturers from our partner facilities in China who offer genuine quality at transparent, fair pricing. Our goal is simple: to provide legitimate, research-grade peptides at reasonable prices without scams or shortcuts.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-block px-6 py-3 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-medium border border-cyan-500/30">
              Verified China Reseller • Transparent Sourcing
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition-colors">
                  <FlaskConical className="w-12 h-12 text-blue-700" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Laboratory Grade
              </h3>
              <p className="text-gray-600 leading-relaxed">
                High-purity peptides manufactured to rigorous analytical standards.
              </p>
            </div>

            <div className="text-center group">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition-colors">
                  <ShieldCheck className="w-12 h-12 text-blue-700" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Batch Consistency
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Each batch is tested for purity and consistency to ensure reliable results.
              </p>
            </div>

            <div className="text-center group">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition-colors">
                  <PackageCheck className="w-12 h-12 text-blue-700" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Sterile Packaging
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Supplied in sterile vials to maintain integrity during storage and handling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reddit community section temporarily hidden
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-12 shadow-xl border border-orange-100">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-white rounded-full shadow-md">
              <svg className="w-12 h-12 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Crowdsourced Research
          </h2>
          <p className="text-lg text-gray-700 text-center mb-8 leading-relaxed max-w-3xl mx-auto">
            For real-world laboratory discussions, protocol optimizations, and peer-reviewed dosing analysis, we strongly recommend visiting the Retatrutide research community on Reddit.
          </p>
          <div className="bg-white rounded-xl p-6 mb-6 border-2 border-orange-200">
            <p className="text-sm text-cyan-600 font-semibold uppercase tracking-wide mb-2">
              Target Community
            </p>
            <p className="text-2xl font-bold text-gray-900">r/retralabs</p>
          </div>
          <a
            href="https://www.reddit.com/r/retralabs/"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 bg-orange-600 text-white font-bold text-center rounded-xl hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center justify-center gap-2">
              Visit Community on Reddit
              <ExternalLink className="w-5 h-5" />
            </span>
          </a>
        </div>
      </section>
      */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto bg-slate-100 rounded-2xl p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Research Use Only
          </h2>
          <p className="text-gray-700 leading-relaxed text-center text-lg">
            All products are intended solely for in vitro research and analytical applications.
            These materials are not approved for human or veterinary use. Purchasers must
            be affiliated with recognized research institutions or laboratories and comply
            with all applicable regulations.
          </p>
        </div>
      </section>
    </div>
  );
}
