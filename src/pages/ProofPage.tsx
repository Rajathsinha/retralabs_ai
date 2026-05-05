import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, MessageCircle, CheckCircle2 } from 'lucide-react';

// ── Curated screenshots — only clean positive feedback ────────────────────────
// object-position controls which part of the screenshot is shown in the card.
// "top" = skip keyboard/input bar at bottom; percentage tweaks skip the chat header.
const SCREENSHOTS: { file: string; quote: string; tag: string; pos?: string }[] = [
  {
    file: 'IMG_8272.JPG',
    quote: '"The quality is top-notch!"',
    tag: 'Retatrutide',
    pos: '0 0%',
  },
  {
    file: 'IMG_8265.jpg',
    quote: '"Bro the stuff is bomb"',
    tag: 'Retatrutide',
    pos: '0 25%',
  },
  {
    file: 'IMG_8263.jpg',
    quote: '"Down 2 kgs in a week"',
    tag: 'Retatrutide',
    pos: '0 10%',
  },
  {
    file: 'IMG_8254.JPG',
    quote: '"It\'s really effective"',
    tag: 'Retatrutide',
    pos: '0 0%',
  },
  {
    file: 'IMG_8261.JPG',
    quote: '"Food suppression is crazzy bro"',
    tag: 'Retatrutide',
    pos: '0 30%',
  },
  {
    file: 'IMG_8266.jpg',
    quote: '"BPC and TB are doing wonders"',
    tag: 'BPC-157 + TB-500',
    pos: '0 10%',
  },
  {
    file: 'IMG_8269.JPG',
    quote: '"reta is sort of magical now"',
    tag: 'Retatrutide',
    pos: '0 20%',
  },
  {
    file: 'IMG_8274.jpg',
    quote: '"food noise is gone"',
    tag: 'Retatrutide',
    pos: '0 20%',
  },
  {
    file: 'IMG_8264.JPG',
    quote: '"It is actually working pretty great"',
    tag: 'Retatrutide',
    pos: '0 30%',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function ProofPage() {
  const navigate = useNavigate();
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 pt-14 pb-12 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-5">
          <MessageCircle className="w-3.5 h-3.5 text-green-600" />
          <span className="text-xs font-bold uppercase tracking-widest text-green-700">
            Real WhatsApp Chats · Unedited
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4 leading-tight">
          Don't Take Our Word For It.<br />
          <span className="text-gradient">Read Their Texts.</span>
        </h1>

        <p className="text-slate-500 text-base max-w-lg mx-auto mb-2">
          Real customers. Real conversations. Names and numbers blurred for privacy.
          Every message is genuine — zero scripts, zero paid promotions.
        </p>

        {/* Trust chips */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {[
            '3,000+ Orders Shipped',
            '100% Real Customers',
            '0 Paid Promotions',
          ].map(t => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── Screenshot grid ──────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SCREENSHOTS.map((s, i) => (
            <motion.div
              key={s.file}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Card */}
              <div
                className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-zoom-in border border-slate-100"
                onClick={() => setLightboxSrc(`/testimonials/${s.file}`)}
              >
                {/* Screenshot — fixed height, smart crop */}
                <div className="relative h-[340px] overflow-hidden bg-slate-100">
                  <img
                    src={`/testimonials/${s.file}`}
                    alt={s.quote}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    style={{ objectPosition: s.pos ?? '0 15%' }}
                  />
                  {/* Bottom fade — hides the keyboard/input bar cutoff */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                </div>

                {/* Caption */}
                <div className="px-4 py-3 flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-700 leading-snug">{s.quote}</p>
                  <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                    {s.tag}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-8 italic">
          Tap any screenshot to view full size · Names/numbers blurred for privacy
        </p>
      </section>

      {/* ── Lightbox ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-modal bg-black/85 flex items-center justify-center p-4"
            onClick={() => setLightboxSrc(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              src={lightboxSrc}
              alt="WhatsApp chat screenshot"
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              transition={{ duration: 0.2 }}
              className="max-h-[92vh] max-w-full rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 py-16 text-center px-4">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
          Seen enough?
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
          Join 3,000+ Customers<br />Who Already Trust Us
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
      </section>

    </div>
  );
}
