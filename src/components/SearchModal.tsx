import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, FlaskConical, Droplets, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getProductImageUrl, BAC_WATER_IMAGE_URL } from '../utils/imageUrl';
import { useCurrency } from '../context/CurrencyContext';
import { ProductWithVariants } from '../types';

/* ── Fallback data ── */
const DEMO: ProductWithVariants[] = [
  { id: '1',  name: 'Retatrutide',           category: 'research-peptide',  description: 'Triple agonist peptide targeting GLP-1, GIP, and glucagon receptors.', image_url: '/Retatrutide.png', created_at: '', variants: [{ id: '1s',  product_id: '1',  dosage_mg: 10, price_inr: 3500, in_stock: true, created_at: '' }] },
  { id: '2',  name: 'Tirzepatide',           category: 'research-peptide',  description: 'Dual GIP and GLP-1 receptor agonist for metabolic research.',           image_url: '/TIRZEPATIDE.png', created_at: '', variants: [{ id: '2x',  product_id: '2',  dosage_mg: 10, price_inr: 2500, in_stock: true, created_at: '' }] },
  { id: '3',  name: 'GHK-Cu',               category: 'research-peptide',  description: 'Copper peptide for skin regeneration and anti-aging research.',          image_url: '/GHKCU.png',       created_at: '', variants: [{ id: '3a',  product_id: '3',  dosage_mg: 100, price_inr: 4000, in_stock: true, created_at: '' }] },
  { id: '4',  name: 'Semax',                category: 'research-peptide',  description: 'Synthetic ACTH analogue nootropic peptide for cognitive research.',      image_url: '/SEMAX.png',       created_at: '', variants: [{ id: '4a',  product_id: '4',  dosage_mg: 10, price_inr: 2000, in_stock: true, created_at: '' }] },
  { id: '5',  name: 'Selank',               category: 'research-peptide',  description: 'Anxiolytic heptapeptide for anti-anxiety and cognitive research.',        image_url: '/SELANK.png',      created_at: '', variants: [{ id: '5a',  product_id: '5',  dosage_mg: 10, price_inr: 2000, in_stock: true, created_at: '' }] },
  { id: '7',  name: 'BPC-157',              category: 'research-peptide',  description: 'Body protection compound for tissue repair and gut health.',              image_url: '/BPC.png',         created_at: '', variants: [{ id: '7a',  product_id: '7',  dosage_mg: 10, price_inr: 2500, in_stock: true, created_at: '' }] },
  { id: '8',  name: 'NAD+',                category: 'research-peptide',  description: 'Coenzyme for cellular energy metabolism and longevity research.',          image_url: '/NAD+.png',        created_at: '', variants: [{ id: '8a',  product_id: '8',  dosage_mg: 10, price_inr: 4500, in_stock: true, created_at: '' }] },
  { id: '9',  name: 'TB-500',               category: 'research-peptide',  description: 'Thymosin Beta-4 analogue for tissue regeneration research.',              image_url: '/TB500.png',       created_at: '', variants: [{ id: '9a',  product_id: '9',  dosage_mg: 10, price_inr: 4000, in_stock: true, created_at: '' }] },
  { id: '10', name: 'Tesamorelin',          category: 'research-peptide',  description: 'GHRH analogue for growth hormone and metabolic regulation research.',     image_url: '/Tesa.png',        created_at: '', variants: [{ id: '10a', product_id: '10', dosage_mg: 1,  price_inr: 3000, in_stock: true, created_at: '' }] },
  { id: '11', name: 'MOT-C',               category: 'research-peptide',  description: 'Mitochondrial-derived peptide for metabolic regulation research.',        image_url: '/motc.png',        created_at: '', variants: [{ id: '11a', product_id: '11', dosage_mg: 10, price_inr: 2000, in_stock: true, created_at: '' }] },
  { id: '6',  name: 'Bacteriostatic Water', category: 'Medical Supplies',  description: 'Pharmaceutical grade sterile water for reconstituting peptides.',         image_url: '/bac-water.png',   created_at: '', variants: [{ id: '6a',  product_id: '6',  dosage_mg: 10, price_inr: 400,  in_stock: true, created_at: '' }] },
];

interface Props { isOpen: boolean; onClose: () => void; }

/* ── Text highlight helper ── */
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-transparent text-emerald-400 font-bold not-italic">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

/* ── Motion variants ── */
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, transition: { duration: 0.14, delay: 0.05 } },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0, scale: 0.97, y: 4,
    transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
  },
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } },
};

function SearchOverlay({ isOpen, onClose }: Props) {
  const navigate   = useNavigate();
  const { format } = useCurrency();
  const inputRef   = useRef<HTMLInputElement>(null);

  const [query,    setQuery]    = useState('');
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [cursor,   setCursor]   = useState(0);

  /* Load products on first open */
  useEffect(() => {
    if (!isOpen || products.length > 0) return;
    if (!isSupabaseConfigured()) { setProducts(DEMO); return; }
    setLoading(true);
    Promise.all([
      supabase.from('products').select('*').order('created_at'),
      supabase.from('product_variants').select('*').order('price_inr'),
    ]).then(([{ data: prods }, { data: vars }]) => {
      if (prods && vars) {
        const mapped: ProductWithVariants[] = prods.map(p => ({
          ...p, variants: vars.filter(v => v.product_id === p.id),
        }));
        setProducts(mapped.length ? mapped : DEMO);
      } else { setProducts(DEMO); }
    }).catch(() => setProducts(DEMO)).finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /* Focus + reset on open */
  useEffect(() => {
    if (isOpen) { setQuery(''); setCursor(0); setTimeout(() => inputRef.current?.focus(), 80); }
  }, [isOpen]);

  /* Close on Escape */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  /* Filtered results */
  const results = query.trim().length === 0
    ? products.slice(0, 8)
    : products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);

  /* Keyboard navigation */
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
    else if (e.key === 'Enter' && results[cursor]) { navigate(`/product/${results[cursor].id}`); onClose(); }
  }, [results, cursor, navigate, onClose]);

  const goTo = (id: string) => { navigate(`/product/${id}`); onClose(); };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="search-overlay"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-[8vh] px-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

          {/* Panel */}
          <motion.div
            variants={panelVariants}
            className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(10, 15, 25, 0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset',
            }}
          >
            {/* ── Search bar ── */}
            <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <Search className="w-5 h-5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setCursor(0); }}
                onKeyDown={onKeyDown}
                placeholder="Search peptides, compounds…"
                className="flex-1 bg-transparent text-base outline-none font-medium search-modal-input"
                style={{ color: 'rgba(255,255,255,0.9)', caretColor: '#34d399' }}
              />
              <motion.button
                onClick={query ? () => setQuery('') : onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-7 h-7 flex items-center justify-center rounded-full flex-shrink-0 transition-colors"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* ── Results area ── */}
            <div className="max-h-[62vh] overflow-y-auto scrollbar-hide">

              {/* Loading */}
              {loading && (
                <div className="px-5 py-12 text-center">
                  <div className="inline-flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.12)', borderTopColor: '#34d399' }} />
                    Loading products…
                  </div>
                </div>
              )}

              {/* No results */}
              {!loading && results.length === 0 && query.trim() && (
                <div className="px-5 py-14 text-center space-y-2">
                  <Search className="w-8 h-8 mx-auto" style={{ color: 'rgba(255,255,255,0.12)' }} />
                  <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    No results for "<span style={{ color: 'rgba(255,255,255,0.75)' }}>{query}</span>"
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Try searching for a peptide name or category</p>
                </div>
              )}

              {/* Results list */}
              {!loading && results.length > 0 && (
                <div className="p-3 space-y-0.5">
                  {/* Section label */}
                  <p className="text-[10px] font-bold uppercase tracking-widest px-3 pb-2 pt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    {query.trim() ? `${results.length} result${results.length !== 1 ? 's' : ''}` : 'All Products'}
                  </p>

                  <motion.div variants={listVariants} initial="hidden" animate="visible" key={query}>
                    {results.map((product, i) => {
                      const minPrice  = Math.min(...product.variants.map(v => v.price_inr));
                      const isSupply  = product.category.toLowerCase().includes('suppli');
                      const isFocused = i === cursor;

                      return (
                        <motion.button
                          key={product.id}
                          variants={itemVariants}
                          whileHover={{ y: -2, scale: 1.008 }}
                          whileTap={{ scale: 0.995 }}
                          onMouseEnter={() => setCursor(i)}
                          onClick={() => goTo(product.id)}
                          type="button"
                          className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-left"
                          style={{
                            background: isFocused
                              ? 'rgba(52, 211, 153, 0.08)'
                              : 'transparent',
                            boxShadow: isFocused
                              ? '0 0 0 1.5px rgba(52, 211, 153, 0.35), 0 4px 16px rgba(52, 211, 153, 0.06)'
                              : 'none',
                            transition: 'background 0.12s, box-shadow 0.12s',
                          }}
                        >
                          {/* Image */}
                          <div
                            className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
                            style={{
                              border: isFocused
                                ? '1px solid rgba(52, 211, 153, 0.3)'
                                : '1px solid rgba(255,255,255,0.07)',
                              background: 'rgba(255,255,255,0.04)',
                            }}
                          >
                            <img
                              src={getProductImageUrl(product.image_url, product.name)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = BAC_WATER_IMAGE_URL; }}
                            />
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate" style={{ color: isFocused ? '#6ee7b7' : 'rgba(255,255,255,0.9)', transition: 'color 0.12s' }}>
                              <HighlightMatch text={product.name} query={query} />
                            </p>
                            <p className="text-xs truncate mt-0.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                              <HighlightMatch text={product.description} query={query} />
                            </p>
                            <div className="flex items-center gap-1 mt-1.5">
                              <div
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                                style={isSupply
                                  ? { background: 'rgba(34, 211, 238, 0.1)', color: '#67e8f9', border: '1px solid rgba(34, 211, 238, 0.2)' }
                                  : { background: 'rgba(52, 211, 153, 0.1)', color: '#6ee7b7', border: '1px solid rgba(52, 211, 153, 0.2)' }
                                }
                              >
                                {isSupply ? <Droplets className="w-2.5 h-2.5" /> : <FlaskConical className="w-2.5 h-2.5" />}
                                {isSupply ? 'Medical Supply' : 'Research Peptide'}
                              </div>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className="text-base font-black tabular-nums" style={{ color: isFocused ? '#34d399' : 'rgba(255,255,255,0.85)', transition: 'color 0.12s' }}>
                              {format(minPrice)}
                            </span>
                            <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>from</span>
                          </div>

                          {/* Arrow */}
                          <motion.div
                            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                            whileHover={{ scale: 1.18 }}
                            whileTap={{ scale: 0.88 }}
                            style={{
                              background: isFocused ? '#34d399' : 'rgba(255,255,255,0.07)',
                              color: isFocused ? '#0a0f19' : 'rgba(255,255,255,0.3)',
                              transition: 'background 0.15s, color 0.15s',
                            }}
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </motion.div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </div>
              )}

              {/* Empty state */}
              {!loading && results.length === 0 && !query.trim() && (
                <div className="px-5 py-14 text-center space-y-2">
                  <Sparkles className="w-8 h-8 mx-auto" style={{ color: 'rgba(255,255,255,0.12)' }} />
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Start typing to search products</p>
                </div>
              )}
            </div>

            {/* ── Footer ── */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="flex items-center gap-4">
                {[['↑↓', 'navigate'], ['↵', 'open']].map(([key, label]) => (
                  <span key={key} className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    <kbd
                      className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-mono"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
                    >
                      {key}
                    </kbd>
                    {label}
                  </span>
                ))}
              </div>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                <kbd
                  className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-mono"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
                >
                  esc
                </kbd>
                close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function SearchModal({ isOpen, onClose }: Props) {
  return createPortal(<SearchOverlay isOpen={isOpen} onClose={onClose} />, document.body);
}
