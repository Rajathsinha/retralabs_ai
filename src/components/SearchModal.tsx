import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, FlaskConical, Droplets } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getProductImageUrl, BAC_WATER_IMAGE_URL } from '../utils/imageUrl';
import { useCurrency } from '../context/CurrencyContext';
import { ProductWithVariants } from '../types';

/* ── Fallback data ── */
const DEMO: ProductWithVariants[] = [
  { id: '1',  name: 'Retatrutide',       category: 'research-peptide', description: 'Triple agonist peptide targeting GLP-1, GIP, and glucagon receptors.',          image_url: '/Retatrutide.png', created_at: '', variants: [{ id: '1a',  product_id: '1',  dosage_mg: 20, price_inr: 7000, in_stock: true, created_at: '' }] },
  { id: '2',  name: 'Tirzepatide',       category: 'research-peptide', description: 'Dual GIP and GLP-1 receptor agonist for metabolic research.',                    image_url: '/TIRZEPATIDE.png', created_at: '', variants: [{ id: '2a',  product_id: '2',  dosage_mg: 20, price_inr: 6000, in_stock: true, created_at: '' }] },
  { id: '3',  name: 'GHK-Cu',            category: 'research-peptide', description: 'Copper peptide for skin regeneration and anti-aging research.',                  image_url: '/GHKCU.png',       created_at: '', variants: [{ id: '3a',  product_id: '3',  dosage_mg: 10, price_inr: 2000, in_stock: true, created_at: '' }] },
  { id: '4',  name: 'Semax',             category: 'research-peptide', description: 'Synthetic ACTH analogue nootropic peptide for cognitive function.',               image_url: '/SEMAX.png',       created_at: '', variants: [{ id: '4a',  product_id: '4',  dosage_mg: 10, price_inr: 2000, in_stock: true, created_at: '' }] },
  { id: '5',  name: 'Selank',            category: 'research-peptide', description: 'Anxiolytic heptapeptide derived from tuftsin for anti-anxiety research.',        image_url: '/SELANK.png',      created_at: '', variants: [{ id: '5a',  product_id: '5',  dosage_mg: 10, price_inr: 2000, in_stock: true, created_at: '' }] },
  { id: '7',  name: 'BPC-157',           category: 'research-peptide', description: 'Body protection compound for tissue repair and gut health.',                     image_url: '/BPC.png',         created_at: '', variants: [{ id: '7a',  product_id: '7',  dosage_mg: 10, price_inr: 3000, in_stock: true, created_at: '' }] },
  { id: '8',  name: 'NAD+',              category: 'research-peptide', description: 'Coenzyme for cellular energy metabolism and longevity research.',                 image_url: '/NAD+.png',        created_at: '', variants: [{ id: '8a',  product_id: '8',  dosage_mg: 10, price_inr: 4500, in_stock: true, created_at: '' }] },
  { id: '9',  name: 'TB-500',            category: 'research-peptide', description: 'Thymosin Beta-4 analogue for tissue regeneration and wound healing.',            image_url: '/TB500.png',       created_at: '', variants: [{ id: '9a',  product_id: '9',  dosage_mg: 10, price_inr: 4000, in_stock: true, created_at: '' }] },
  { id: '10', name: 'Tesamorelin',       category: 'research-peptide', description: 'GHRH analogue for growth hormone release and metabolic regulation.',             image_url: '/Tesa.png',        created_at: '', variants: [{ id: '10a', product_id: '10', dosage_mg: 10, price_inr: 5500, in_stock: true, created_at: '' }] },
  { id: '11', name: 'MOT-C',             category: 'research-peptide', description: 'Mitochondrial-derived peptide for metabolic regulation.',                        image_url: '/motc.png',        created_at: '', variants: [{ id: '11a', product_id: '11', dosage_mg: 10, price_inr: 5000, in_stock: true, created_at: '' }] },
  { id: '6',  name: 'Bacteriostatic Water', category: 'Medical Supplies', description: 'Pharmaceutical grade sterile water for reconstituting peptides.',             image_url: '/bac-water.png',   created_at: '', variants: [{ id: '6a',  product_id: '6',  dosage_mg: 10, price_inr: 400,  in_stock: true, created_at: '' }] },
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
          ...p, variants: vars.filter(v => v.product_id === p.id),
        }));
        setProducts(mapped.length ? mapped : DEMO);
      } else { setProducts(DEMO); }
    }).catch(() => setProducts(DEMO)).finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /* ── Focus input on open ── */
  useEffect(() => {
    if (isOpen) { setQuery(''); setCursor(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [isOpen]);

  /* ── Close on Escape ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const results = query.trim().length === 0
    ? products.slice(0, 8)
    : products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown')      { e.preventDefault(); setCursor(c => Math.min(c + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
    else if (e.key === 'Enter' && results[cursor]) { navigate(`/product/${results[cursor].id}`); onClose(); }
  }, [results, cursor, navigate, onClose]);

  const goToProduct = (id: string) => { navigate(`/product/${id}`); onClose(); };

  if (!isOpen) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh', padding: '10vh 1rem 0' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,13,13,0.4)', backdropFilter: 'blur(6px)' }} />

      {/* Panel */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 560,
          background: 'var(--white)',
          border: '1px solid var(--border)',
          borderRadius: '1.25rem',
          boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
          overflow: 'hidden',
        }}
      >
        {/* ── Search input ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
          <Search style={{ width: 16, height: 16, color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setCursor(0); }}
            onKeyDown={onKeyDown}
            placeholder="Search peptides — try 'BPC', 'cognitive', 'metabolic'…"
            style={{
              flex: 1,
              background: 'transparent',
              color: 'var(--text)',
              fontSize: '0.88rem',
              outline: 'none',
              border: 'none',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 300,
            }}
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.2rem' }}
            >
              <X style={{ width: 15, height: 15 }} />
            </button>
          ) : (
            <kbd style={{ padding: '0.15rem 0.5rem', borderRadius: 6, background: 'var(--off-white)', border: '1px solid var(--border)', color: 'var(--text-light)', fontSize: '0.7rem', fontFamily: 'monospace', flexShrink: 0 }}>
              esc
            </kbd>
          )}
        </div>

        {/* ── Results ── */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {loading && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Loading…
            </div>
          )}

          {!loading && results.length === 0 && (
            <div style={{ padding: '2.5rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Nothing found for "<span style={{ color: 'var(--text)' }}>{query}</span>"
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul style={{ listStyle: 'none', padding: '0.5rem 0', margin: 0 }}>
              {!query.trim() && (
                <li style={{ padding: '0.5rem 1.25rem 0.25rem' }}>
                  <span className="section-eyebrow" style={{ fontSize: '0.65rem' }}>All products</span>
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
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.875rem',
                        padding: '0.75rem 1.25rem',
                        background: isFocused ? 'var(--off-white)' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.12s',
                      }}
                    >
                      {/* Thumbnail */}
                      <div style={{ width: 40, height: 40, borderRadius: '0.6rem', overflow: 'hidden', flexShrink: 0, background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                          src={getProductImageUrl(product.image_url, product.name)}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }}
                          onError={(e) => { (e.target as HTMLImageElement).src = BAC_WATER_IMAGE_URL; }}
                        />
                      </div>

                      {/* Name + description */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: 'var(--text)', fontSize: '0.88rem', fontWeight: 400, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {product.name}
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', margin: '0.1rem 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 300 }}>
                          {product.description}
                        </p>
                      </div>

                      {/* Right — tag + price + arrow */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.55rem', borderRadius: 9999, border: '1px solid var(--border)', fontSize: '0.65rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                          {isSupply
                            ? <Droplets style={{ width: 10, height: 10, color: 'var(--accent)' }} />
                            : <FlaskConical style={{ width: 10, height: 10, color: 'var(--accent)' }} />
                          }
                          {isSupply ? 'Supply' : 'Peptide'}
                        </span>
                        <span style={{ color: 'var(--text)', fontSize: '0.88rem', fontWeight: 400, fontVariantNumeric: 'tabular-nums' }}>
                          {format(minPrice)}
                        </span>
                        <ArrowRight style={{ width: 13, height: 13, color: isFocused ? 'var(--accent)' : 'transparent', transition: 'color 0.15s' }} />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ── Footer hints ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.6rem 1.25rem', borderTop: '1px solid var(--border)', background: 'var(--off-white)' }}>
          {[['↑↓', 'navigate'], ['↵', 'open'], ['esc', 'close']].map(([key, label]) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-light)', fontSize: '0.7rem' }}>
              <kbd style={{ padding: '0.15rem 0.4rem', borderRadius: 4, background: 'var(--white)', border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                {key}
              </kbd>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SearchModal({ isOpen, onClose }: Props) {
  return createPortal(<SearchOverlay isOpen={isOpen} onClose={onClose} />, document.body);
}
