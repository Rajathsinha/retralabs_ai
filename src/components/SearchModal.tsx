import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, FlaskConical, Droplets, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getProductImageUrl, BAC_WATER_IMAGE_URL } from '../utils/imageUrl';
import { useCurrency } from '../context/CurrencyContext';
import { ProductWithVariants } from '../types';

/* ── Fallback data ── */
const DEMO: ProductWithVariants[] = [
  { id: '1',  name: 'Retatrutide',        category: 'research-peptide',  description: 'Triple agonist peptide targeting GLP-1, GIP, and glucagon receptors.', image_url: '/Retatrutide.png', created_at: '', variants: [{ id: '1a', product_id: '1',  dosage_mg: 20,  price_inr: 7000, in_stock: true, created_at: '' }] },
  { id: '2',  name: 'Tirzepatide',        category: 'research-peptide',  description: 'Dual GIP and GLP-1 receptor agonist for metabolic research.',             image_url: '/TIRZEPATIDE.png', created_at: '', variants: [{ id: '2a', product_id: '2',  dosage_mg: 20,  price_inr: 6000, in_stock: true, created_at: '' }] },
  { id: '3',  name: 'GHK-Cu',             category: 'research-peptide',  description: 'Copper peptide for skin regeneration and anti-aging research.',            image_url: '/GHKCU.png',       created_at: '', variants: [{ id: '3a', product_id: '3',  dosage_mg: 100, price_inr: 4000, in_stock: true, created_at: '' }] },
  { id: '4',  name: 'Semax',              category: 'research-peptide',  description: 'Synthetic ACTH analogue nootropic peptide for cognitive research.',        image_url: '/SEMAX.png',       created_at: '', variants: [{ id: '4a', product_id: '4',  dosage_mg: 10,  price_inr: 2000, in_stock: true, created_at: '' }] },
  { id: '5',  name: 'Selank',             category: 'research-peptide',  description: 'Anxiolytic heptapeptide for anti-anxiety and cognitive research.',          image_url: '/SELANK.png',      created_at: '', variants: [{ id: '5a', product_id: '5',  dosage_mg: 10,  price_inr: 2000, in_stock: true, created_at: '' }] },
  { id: '7',  name: 'BPC-157',            category: 'research-peptide',  description: 'Body protection compound for tissue repair and gut health.',                image_url: '/BPC.png',         created_at: '', variants: [{ id: '7a', product_id: '7',  dosage_mg: 10,  price_inr: 3000, in_stock: true, created_at: '' }] },
  { id: '8',  name: 'NAD+',              category: 'research-peptide',  description: 'Coenzyme for cellular energy metabolism and longevity research.',            image_url: '/NAD+.png',        created_at: '', variants: [{ id: '8a', product_id: '8',  dosage_mg: 10,  price_inr: 4500, in_stock: true, created_at: '' }] },
  { id: '9',  name: 'TB-500',             category: 'research-peptide',  description: 'Thymosin Beta-4 analogue for tissue regeneration research.',                image_url: '/TB500.png',       created_at: '', variants: [{ id: '9a', product_id: '9',  dosage_mg: 10,  price_inr: 4000, in_stock: true, created_at: '' }] },
  { id: '10', name: 'Tesamorelin',        category: 'research-peptide',  description: 'GHRH analogue for growth hormone and metabolic regulation research.',       image_url: '/Tesa.png',        created_at: '', variants: [{ id: '10a', product_id: '10', dosage_mg: 10, price_inr: 5500, in_stock: true, created_at: '' }] },
  { id: '11', name: 'MOT-C',             category: 'research-peptide',  description: 'Mitochondrial-derived peptide for metabolic regulation research.',          image_url: '/motc.png',        created_at: '', variants: [{ id: '11a', product_id: '11', dosage_mg: 10, price_inr: 5000, in_stock: true, created_at: '' }] },
  { id: '6',  name: 'Bacteriostatic Water', category: 'Medical Supplies', description: 'Pharmaceutical grade sterile water for reconstituting peptides.',         image_url: '/bac-water.png',   created_at: '', variants: [{ id: '6a', product_id: '6',  dosage_mg: 10,  price_inr: 400,  in_stock: true, created_at: '' }] },
];

interface Props { isOpen: boolean; onClose: () => void; }

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
    if (isOpen) { setQuery(''); setCursor(0); setTimeout(() => inputRef.current?.focus(), 60); }
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[8vh] px-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />

      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80">

        {/* ── Search bar ── */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setCursor(0); }}
            onKeyDown={onKeyDown}
            placeholder="Search peptides, compounds…"
            className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 text-base outline-none font-medium"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* ── Results area ── */}
        <div className="max-h-[62vh] overflow-y-auto">

          {/* Loading */}
          {loading && (
            <div className="px-5 py-12 text-center">
              <div className="inline-flex items-center gap-2 text-slate-400 text-sm">
                <div className="w-4 h-4 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
                Loading products…
              </div>
            </div>
          )}

          {/* No results */}
          {!loading && results.length === 0 && query.trim() && (
            <div className="px-5 py-14 text-center space-y-2">
              <Search className="w-8 h-8 text-slate-200 mx-auto" />
              <p className="text-slate-500 text-sm font-medium">No results for "<span className="text-slate-700">{query}</span>"</p>
              <p className="text-slate-400 text-xs">Try searching for a peptide name or category</p>
            </div>
          )}

          {/* Results list */}
          {!loading && results.length > 0 && (
            <div className="p-3 space-y-0.5">
              {/* Section label */}
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 pb-2 pt-1">
                {query.trim() ? `${results.length} result${results.length !== 1 ? 's' : ''}` : 'All Products'}
              </p>

              {results.map((product, i) => {
                const minPrice   = Math.min(...product.variants.map(v => v.price_inr));
                const isSupply   = product.category.toLowerCase().includes('suppli');
                const isFocused  = i === cursor;

                return (
                  <button
                    key={product.id}
                    type="button"
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => goTo(product.id)}
                    className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-100 text-left group ${
                      isFocused ? 'bg-slate-50 shadow-sm' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Image */}
                    <div className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border ${
                      isFocused ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-slate-50'
                    }`}>
                      <img
                        src={getProductImageUrl(product.image_url, product.name)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = BAC_WATER_IMAGE_URL; }}
                      />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate transition-colors ${
                        isFocused ? 'text-emerald-700' : 'text-slate-900'
                      }`}>
                        {product.name}
                      </p>
                      <p className="text-slate-400 text-xs truncate mt-0.5 leading-relaxed">
                        {product.description}
                      </p>
                      {/* Category badge */}
                      <div className="flex items-center gap-1 mt-1.5">
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          isSupply
                            ? 'bg-cyan-50 text-cyan-600 border border-cyan-100'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                          {isSupply
                            ? <Droplets className="w-2.5 h-2.5" />
                            : <FlaskConical className="w-2.5 h-2.5" />
                          }
                          {isSupply ? 'Medical Supply' : 'Research Peptide'}
                        </div>
                      </div>
                    </div>

                    {/* Price + arrow */}
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className={`text-base font-black tabular-nums transition-colors ${
                        isFocused ? 'text-emerald-600' : 'text-slate-800'
                      }`}>
                        {format(minPrice)}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">from</span>
                    </div>

                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 ${
                      isFocused
                        ? 'bg-emerald-500 text-white scale-100 opacity-100'
                        : 'bg-slate-100 text-slate-300 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100'
                    }`}>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Empty state (no query, no products yet) */}
          {!loading && results.length === 0 && !query.trim() && (
            <div className="px-5 py-14 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-slate-200 mx-auto" />
              <p className="text-slate-400 text-sm">Start typing to search products</p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400 text-xs">
              <kbd className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 text-[10px] font-mono shadow-sm">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 text-xs">
              <kbd className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 text-[10px] font-mono shadow-sm">↵</kbd>
              open
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-slate-400 text-xs">
            <kbd className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 text-[10px] font-mono shadow-sm">esc</kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SearchModal({ isOpen, onClose }: Props) {
  return createPortal(<SearchOverlay isOpen={isOpen} onClose={onClose} />, document.body);
}
