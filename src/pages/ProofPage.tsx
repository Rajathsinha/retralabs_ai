import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

// ── Curated screenshots — real WhatsApp conversations ─────────────────────────
// Images are served from /public/testimonials/
const SCREENSHOTS = [
  {
    file: 'IMG_8272.JPG',
    tag: 'Retatrutide',
    highlight: '"The quality is top-notch!"',
  },
  {
    file: 'IMG_8265.jpg',
    tag: 'Retatrutide',
    highlight: '"Bro the stuff is bomb"',
  },
  {
    file: 'IMG_8269.JPG',
    tag: 'Retatrutide',
    highlight: '"reta is sort of magical now"',
  },
  {
    file: 'IMG_8263.jpg',
    tag: 'Retatrutide',
    highlight: '"Down 2 kgs in a week"',
  },
  {
    file: 'IMG_8254.JPG',
    tag: 'Retatrutide',
    highlight: '"It\'s really effective"',
  },
  {
    file: 'IMG_8261.JPG',
    tag: 'Retatrutide',
    highlight: '"Food suppression is crazzy bro"',
  },
  {
    file: 'IMG_8256.JPG',
    tag: 'Retatrutide',
    highlight: '"Dude it works like a charm"',
  },
  {
    file: 'IMG_8266.jpg',
    tag: 'BPC-157 + TB-500',
    highlight: '"BPC and TB are doing wonders"',
  },
  {
    file: 'IMG_8264.JPG',
    tag: 'Retatrutide',
    highlight: '"It is actually working pretty great"',
  },
  {
    file: 'IMG_8274.jpg',
    tag: 'Retatrutide',
    highlight: '"food noise is gone"',
  },
  {
    file: 'IMG_8271.jpg',
    tag: 'Retatrutide',
    highlight: '"reta is anyway a long journey"',
  },
  {
    file: 'IMG_8262.jpg',
    tag: 'Retatrutide',
    highlight: '"I don\'t feel that hungry"',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function ProofPage() {
  const navigate = useNavigate();
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950">

      {/* ── Hero ── */}
      <section className="pt-16 pb-12 px-4 text-center">
        <AnimatedSection>
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
            <MessageCircle className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Real WhatsApp Conversations
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4 max-w-3xl mx-auto leading-tight">
            We Don't Ask You to<br />
            <span className="text-gradient">Trust Us. Read This.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-3">
            Unedited WhatsApp screenshots from real customers.
            No actors, no scripts, no paid promotions.
          </p>
          <p className="text-slate-600 text-sm italic">
            Names and numbers blurred for privacy. Messages are real.
          </p>
        </AnimatedSection>
      </section>

      {/* ── Stats strip ── */}
      <AnimatedSection>
        <div className="max-w-3xl mx-auto px-4 mb-14">
          <div className="grid grid-cols-3 gap-4 text-center border border-white/8 rounded-2xl bg-white/3 py-6">
            {[
              { val: '3,000+', label: 'Orders shipped' },
              { val: '100%',   label: 'Real customers' },
              { val: '0',      label: 'Paid reviews' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl md:text-3xl font-black text-white">{s.val}</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ── Masonry grid ── */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div
          className="columns-1 sm:columns-2 lg:columns-3 gap-4"
          style={{ columnFill: 'balance' }}
        >
          {SCREENSHOTS.map((s, i) => (
            <motion.div
              key={s.file}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="break-inside-avoid mb-4"
            >
              <div
                className="relative group cursor-zoom-in rounded-2xl overflow-hidden border border-white/8 shadow-xl"
                onClick={() => setLightboxSrc(`/testimonials/${s.file}`)}
              >
                <img
                  src={`/testimonials/${s.file}`}
                  alt={s.highlight}
                  className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />
                {/* hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end">
                  <div className="p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-block bg-green-500/90 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-1.5">
                      {s.tag}
                    </span>
                    <p className="text-white text-sm font-semibold leading-snug drop-shadow">
                      {s.highlight}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-modal bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxSrc(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              onClick={() => setLightboxSrc(null)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              src={lightboxSrc}
              alt="Screenshot"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="max-h-[90vh] max-w-full rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CTA ── */}
      <section className="py-16 bg-slate-900 border-t border-white/8 text-center px-4">
        <AnimatedSection>
          <p className="text-slate-400 text-sm uppercase tracking-widest font-bold mb-3">
            Seen enough?
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join 3,000+ Researchers Who Already Trust Us
          </h2>
          <motion.button
            type="button"
            onClick={() => navigate('/catalogue')}
            className="inline-flex items-center gap-2 bg-cyan-400 text-slate-900 font-extrabold text-base px-8 py-3.5 rounded-2xl shadow-lg shadow-cyan-400/20"
            whileHover={{ scale: 1.05, boxShadow: '0 8px 36px rgba(34,211,238,0.45)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            Shop Now
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </AnimatedSection>
      </section>

    </div>
  );
}
