import { ExternalLink, Star, Award } from 'lucide-react';

export default function ReviewsPage() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Customer Reviews
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real experiences from our research community verified by Trustpilot
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-12 shadow-xl border border-emerald-200">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-white rounded-full shadow-md">
                <Award className="w-12 h-12 text-emerald-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Verified by Trustpilot
            </h2>
            <p className="text-lg text-gray-700 text-center mb-8 leading-relaxed">
              All reviews are verified by Trustpilot, ensuring authentic feedback from real customers.
            </p>

            <div className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-gray-300">
              <p className="text-gray-600 mb-4">
                View our verified customer reviews on Trustpilot
              </p>
              <a
                href="https://www.trustpilot.com/review/retralabs.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
              >
                View Reviews on Trustpilot
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-12 shadow-xl border border-orange-100">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-white rounded-full shadow-md">
                <svg className="w-12 h-12 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Join the Discussion
            </h2>
            <p className="text-lg text-gray-700 text-center mb-8 leading-relaxed">
              Our community shares real experiences, research results, and protocol discussions on Reddit. Read authentic reviews and join the conversation.
            </p>
            <div className="bg-white rounded-xl p-6 mb-6 border-2 border-orange-200">
              <p className="text-sm text-cyan-600 font-semibold uppercase tracking-wide mb-2">
                Community Hub
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
                Read Reviews on Reddit
                <ExternalLink className="w-5 h-5" />
              </span>
            </a>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                F
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-900">u/Frosty-Ad-9691</h3>
                  <span className="text-sm text-gray-500">9 hours ago</span>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <h4 className="font-bold text-lg mb-3">First order experience with RetraLabs</h4>
                <p className="text-gray-700 leading-relaxed">
                  Not gonna lie, I've seen really mindblowing progress on mine. Dropped tons of fat and my health feels much much more under control now. My sugar levels are way better compared to earlier reports. Friends noticed the change and one of them jumped on it too.. he's already seeing fat loss. Parents are also doing well till now. They absolutely love it. Thought I'd post here since this sub is about real experiences. I am not at all affiliated with retralabs. I do not recommend to anyone everyone's different and may and may not work. Do your research and then get into this but yeah retralabs peps are really genuine.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                R
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-900">u/Rajathsinha6</h3>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <h4 className="font-bold text-lg mb-3">Retralabs is totally vibin, pure Retatrutide without burning a hole in your pocket</h4>
                <p className="text-gray-700 leading-relaxed">
                  Here's the review: My first order landed in just 9 days, but the second one took a chill 22 days. No biggie, though..I had enough stock to keep me going. Now, let's talk quality. Within just 3 hours I felt the reta's magic. Injected at 8 PM and 11 PM I was ready to vommit and I was really glad about the sides cuz that's the real deal. I had tried some random IndianMart seller's reta from Peptide Science total fake, useless piece of junk. I pinned 20mg for 4 weeks, and nada nothing happened just made me despo. I was desperate for the real stuff and Retalabs totally came through. I'm on TRT with Retatrutide, shredded a ton of fat, and my...
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-900">u/Affectionate_Fox_313</h3>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <h4 className="font-bold text-lg mb-3">My Retatrutide order from retralabs.in (India)</h4>
                <p className="text-gray-700 leading-relaxed">
                  Posting this because I know how sketchy this space is, especially in India. I was referred to Retralabs.in by another Reddit user. Honestly, I was very skeptical at first. I had already been scammed earlier via an Indiamart seller (fake Peptide Sciences vials, wasted ~7k), so trusting anyone again wasn't easy. I spoke with the Reddit user who suggested it, checked his proof of purchase and results, and then directly contacted the retralabs number listed on their site. After a proper conversation and clearing my doubts, I decided to take a gamble. I ordered 10mg x 10 vials and split the order with the same Reddit user (5 vials...
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://www.reddit.com/r/retralabs/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            Read More Reviews
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  );
}
