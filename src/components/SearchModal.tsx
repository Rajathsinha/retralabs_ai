import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, FlaskConical, Droplets, Command } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getProductImageUrl, BAC_WATER_IMAGE_URL } from '../utils/imageUrl';
import { useCurrency } from '../context/CurrencyContext';
import { ProductWithVariants } from '../types';

/* ── Fallback data (shown when Supabase isn't configured) ── */
const DEMO: ProductWithVariants[] = [
  {
    id: '1', name: 'Retatrutide', category: 'research-peptide',
    description: 'Triple agonist peptide targeting GLP-1, GIP, and glucagon receptors.',
    image_url: '/retatrutide.jpg', created_at: '',
    variants: [{ id: '1a', product_id: '1', dosage_mg: 20, price_inr: 7000, in_stock: true, created_at: '' }],
  },
  {
    id: '2', name: 'Tirzepatide', category: 'research-peptide',
    description: 'Dual GIP and GLP-1 receptor agonist for metabolic research.',
    image_url: '/tirzepatide.jpg', created_at: '',
    variants: [{ id: '2a', product_id: '2', dosage_mg: 20, price_inr: 6000, in_stock: true, created_at: '' }],
  },
  {
    id: '3', name: 'GHK-Cu', category: 'research-peptide',
    description: 'Copper peptide for skin regeneration and anti-aging research.',
    image_url: '/ghk-cu.jpg', created_at: '',
    variants: [{ id: '3a', product_id: '3', dosage_mg: 50, price_inr: 4000, in_stock: true, created_at: '' }],
  },
  {
    id: '4', name: 'IGF-1 LR3', category: 'research-peptide',
    description: 'Long R3 insulin-like growth factor for cellular proliferation research.',
    image_url: '/igf-1-lr3.jpg', created_at: '',
    variants: [{ id: '4a', product_id: '4', dosage_mg: 1, price_inr: 5000, in_stock: true, created_at: '' }],
  },
  {
    id: '5', name: 'HGH 191AA', category: 'research-peptide',
    description: 'Human growth hormone 191 amino acid sequence for laboratory research.',
    image_url: '/hgh-191aa.jpg', created_at: '',
    variants: [{ id: '5a', product_id: '5', dosage_mg: 50, price_inr: 7000, in_stock: true, created_at: '' }],
  },
  {
    id: '6', name: 'Bacteriostatic Water', category: 'Medical Supplies',
    description: 'Pharmaceutical grade sterile water for reconstituting peptides.',
    image_url: '/bac-water.png', created_at: '',
    variants: [{ id: '6a', product_id: '6', dosage_mg: 10, price_inr: 400, in_stock: true, created_at: '' }],
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function SearchOverlay({ isOpen, onClose }: Props) {
  const navigate   = useNavigate();
  const { format } = useCurrency();
  const inputRef   = useRef<HTMLInputElement>(null);

  const [query,    setQuery]    = useState('');
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [cursor,   setCursor]   = useState(0);

  /* ── Load products on first open ── */
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
          ...p,
          variants: vars.filter(v => v.product_id === p.id),
        }));
        setProducts(mapped.length ? mapped : DEMO);
      } else {
        setProducts(DEMO);
      }
    }).catch(() => setProducts(DEMO)).finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /* ── Focus input on open ── */
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  /* ── Close on Escape ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  /* ── Filtered results ── */
  const results = query.trim().length === 0
    ? products.slice(0, 8)
    : products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);

  /* ── Keyboard navigation ── */
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor(c => Math.min(c + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor(c => Math.max(c - 1, 0));
    } else if (e.key === 'Enter' && results[cursor]) {
      navigate(`/product/${results[cursor].id}`);
      onClose();
    }
  }, [results, cursor, navigate, onClose]);

  const goToProduct = (id: string) => {
    navigate(`/product/${id}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] px-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative w-full max-w-xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

        {/* Search input row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8">
          <Search className="w-4.5 h-4.5 text-white/40 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setCursor(0); }}
            onKeyDown={onKeyDown}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-white placeholder-white/30 text-sm outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-white/30 hover:text-white/60 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/30 text-xs font-mono">
            esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="px-4 py-8 text-center text-white/30 text-sm">Loading products…</div>
          )}

          {!loading && results.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-white/30 text-sm">No products found for "<span className="text-white/50">{query}</span>"</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul className="py-2">
              {!query.trim() && (
                <li className="px-4 py-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/25">All products</span>
                </li>
              )}
              {results.map((product, i) => {
                const minPrice = Math.min(...product.variants.map(v => v.price_inr));
                const isSupply = product.category.toLowerCase().includes('suppli');
                const isFocused = i === cursor;

                return (
                  <li key={product.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => goToProduct(product.id)}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 transition-colors text-left ${
                        isFocused ? 'bg-white/8' : 'hover:bg-white/5'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800">
                        <img
                          src={getProductImageUrl(product.image_url, product.name)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = BAC_WATER_IMAGE_URL; }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{product.name}</p>
                        <p className="text-white/40 text-xs truncate mt-0.5">{product.description}</p>
                      </div>

                      {/* Right */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/6 border border-white/8">
                          {isSupply
                            ? <Droplets className="w-2.5 h-2.5 text-cyan-400" />
                            : <FlaskConical className="w-2.5 h-2.5 text-emerald-400" />
                          }
                          <span className="text-[10px] font-semibold text-white/50">
                            {isSupply ? 'Supply' : 'Peptide'}
                          </span>
                        </div>
                        <span className="text-white/80 text-sm font-bold tabular-nums">
                          {format(minPrice)}
                        </span>
                        <ArrowRight className={`w-3.5 h-3.5 transition-opacity ${isFocused ? 'text-cyan-400 opacity-100' : 'text-white/20 opacity-0'}`} />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-white/8 bg-slate-950/40">
          <span className="flex items-center gap-1.5 text-white/25 text-[11px]">
            <kbd className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/8 border border-white/10 font-mono text-[10px]">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1.5 text-white/25 text-[11px]">
            <kbd className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/8 border border-white/10 font-mono text-[10px]">↵</kbd>
            open
          </span>
          <span className="flex items-center gap-1.5 text-white/25 text-[11px]">
            <kbd className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/8 border border-white/10 font-mono text-[10px]">esc</kbd>
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
