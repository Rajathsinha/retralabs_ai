import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chip, Button } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductImageUrl, BAC_WATER_IMAGE_URL } from '../utils/imageUrl';
import { ProductWithVariants } from '../types';
import { PRODUCTS } from '../data/products';
import { useCurrency } from '../context/CurrencyContext';
import { useSEO } from '../hooks/useSEO';
import {
  ShieldCheck, FlaskConical, FileCheck, Sparkles,
  ArrowRight, Search, X, ChevronDown, Check,
  Zap, Brain, Activity, Star, LayoutGrid,
} from 'lucide-react';


const PURITY_MAP: Record<string, string> = {
  'Retatrutide': '99.2%',
  'Tirzepatide': '99.4%',
  'GHK-Cu': '99.1%',
  'Semax': '99.1%',
  'Selank': '99.2%',
  'BPC-157': '99.3%',
  'NAD+': '99.0%',
  'TB-500': '99.1%',
  'Tesamorelin': '99.2%',
  'MOT-C': '99.0%',
  'Klow Blend': '99.0%',
  'CJC-1295 + Ipamorelin Stack': '99.1%',
  'The Wolverine Stack': '99.1%',
  'Bacteriostatic Water (Pharma Grade)': 'Pharma',
  'AOD 9604':     '99.1%',
  'Epithalon':    '99.2%',
  'Kisspeptin-10': '99.1%',
  'SS-31':        '99.0%',
};

const BADGE_MAP: Record<string, { label: string; style: string }> = {
  'Retatrutide': { label: 'BESTSELLER', style: 'bg-amber-500/10 text-amber-400 border border-amber-500/25'  },
  'Tirzepatide': { label: 'POPULAR',    style: 'bg-cyan-500/10  text-cyan-400  border border-cyan-500/25'   },
  'BPC-157':     { label: 'NEW',        style: 'bg-white/[0.04] text-slate-500 border border-white/[0.08]'  },
  'NAD+':        { label: 'NEW',        style: 'bg-white/[0.04] text-slate-500 border border-white/[0.08]'  },
  'TB-500':      { label: 'NEW',        style: 'bg-white/[0.04] text-slate-500 border border-white/[0.08]'  },
  'Tesamorelin': { label: 'NEW',        style: 'bg-white/[0.04] text-slate-500 border border-white/[0.08]'  },
  'MOT-C':       { label: 'NEW',        style: 'bg-white/[0.04] text-slate-500 border border-white/[0.08]'  },
  'Klow Blend':                  { label: 'NEW', style: 'bg-white/[0.04] text-slate-500 border border-white/[0.08]' },
  'CJC-1295 + Ipamorelin Stack': { label: 'NEW', style: 'bg-white/[0.04] text-slate-500 border border-white/[0.08]' },
  'The Wolverine Stack':         { label: 'NEW', style: 'bg-white/[0.04] text-slate-500 border border-white/[0.08]' },
  'AOD 9604':     { label: 'NEW', style: 'bg-white/[0.04] text-slate-500 border border-white/[0.08]' },
  'Epithalon':    { label: 'NEW', style: 'bg-white/[0.04] text-slate-500 border border-white/[0.08]' },
  'Kisspeptin-10': { label: 'NEW', style: 'bg-white/[0.04] text-slate-500 border border-white/[0.08]' },
  'SS-31':        { label: 'NEW', style: 'bg-white/[0.04] text-slate-500 border border-white/[0.08]' },
};

const PRODUCT_TAG: Record<string, string> = {
  'Retatrutide':  'metabolic',
  'Tirzepatide':  'metabolic',
  'GHK-Cu':       'longevity',
  'Semax':        'cognitive',
  'Selank':       'cognitive',
  'BPC-157':      'recovery',
  'NAD+':         'longevity',
  'TB-500':       'recovery',
  'Tesamorelin':  'metabolic',
  'MOT-C':        'metabolic',
  'Klow Blend':                  'metabolic',
  'CJC-1295 + Ipamorelin Stack': 'metabolic',
  'The Wolverine Stack':          'recovery',
  'AOD 9604':      'metabolic',
  'Epithalon':     'longevity',
  'Kisspeptin-10': 'metabolic',
  'SS-31':         'longevity',
};

const TAG_STYLE: Record<string, { dot: string; text: string; label: string }> = {
  metabolic: { dot: 'bg-emerald-400', text: 'text-emerald-400', label: 'Metabolic' },
  cognitive:  { dot: 'bg-violet-400',  text: 'text-violet-400',  label: 'Cognitive' },
  recovery:   { dot: 'bg-rose-400',    text: 'text-rose-400',    label: 'Recovery'  },
  longevity:  { dot: 'bg-amber-400',   text: 'text-amber-400',   label: 'Longevity' },
};

const WAS_PRICE_MAP: Record<string, number> = {
  'Retatrutide':                  5500,
  'Tirzepatide':                  4200,
  'GHK-Cu':                       5000,
  'Semax':                        4000,
  'Selank':                       4000,
  'BPC-157':                      4200,
  'NAD+':                         6500,
  'TB-500':                       6000,
  'Tesamorelin':                  6500,
  'MOT-C':                        4200,
  'Klow Blend':                   7500,
  'CJC-1295 + Ipamorelin Stack':  5500,
  'The Wolverine Stack':          5500,
  'AOD 9604':      4200,
  'Epithalon':     2800,
  'Kisspeptin-10': 5500,
  'SS-31':         4200,
};

const GLOW_COLOR: Record<string, string> = {
  metabolic: 'radial-gradient(circle, rgba(52,211,153,0.55) 0%, transparent 70%)',
  cognitive: 'radial-gradient(circle, rgba(167,139,250,0.55) 0%, transparent 70%)',
  recovery:  'radial-gradient(circle, rgba(251,113,133,0.50) 0%, transparent 70%)',
  longevity: 'radial-gradient(circle, rgba(251,191,36,0.50)  0%, transparent 70%)',
  default:   'radial-gradient(circle, rgba(148,163,184,0.35) 0%, transparent 70%)',
};

const RESEARCH_TAGS = [
  { key: 'all',       label: 'All Areas',  Icon: LayoutGrid },
  { key: 'metabolic', label: 'Metabolic',  Icon: Zap        },
  { key: 'cognitive', label: 'Cognitive',  Icon: Brain      },
  { key: 'recovery',  label: 'Recovery',   Icon: Activity   },
  { key: 'longevity', label: 'Longevity',  Icon: Star       },
] as const;

const SORT_OPTIONS = [
  { key: 'default',    label: 'Featured'          },
  { key: 'price-asc',  label: 'Price: Low → High' },
  { key: 'price-desc', label: 'Price: High → Low' },
  { key: 'name-asc',   label: 'Name: A → Z'       },
] as const;

type SortKey    = typeof SORT_OPTIONS[number]['key'];
type FilterType = 'all' | 'peptide' | 'supplies';
type TagKey     = typeof RESEARCH_TAGS[number]['key'];

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-3xl bg-[#080C14] border border-white/[0.06] overflow-hidden">
      <div className="aspect-square bg-[#0d1220] animate-pulse" />
      <div className="px-6 pt-2 pb-6 space-y-4">
        <div className="h-2 w-14 bg-slate-800 rounded-full animate-pulse" />
        <div className="h-5 w-2/3 bg-slate-800 rounded-lg animate-pulse" />
        <div className="flex items-center justify-between pt-1">
          <div className="space-y-1.5">
            <div className="h-2 w-8 bg-slate-800 rounded animate-pulse" />
            <div className="h-6 w-20 bg-slate-800 rounded-lg animate-pulse" />
          </div>
          <div className="h-9 w-24 bg-slate-800 rounded-full animate-pulse" />
        </div>
        <div className="h-px bg-slate-800/60 animate-pulse" />
        <div className="h-2 w-32 bg-slate-800 rounded animate-pulse" />
      </div>
    </div>
  );
}

// ─── Category pill ────────────────────────────────────────────────────────────

type CatPillProps = {
  id: FilterType; label: string; count: number;
  activeFilter: FilterType; onSelect: (id: FilterType) => void;
};

function CatPill({ id, label, count, activeFilter, onSelect }: CatPillProps) {
  const active = activeFilter === id;
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={() => onSelect(id)}
      className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors select-none outline-none ${
        active ? 'text-slate-900' : 'text-slate-400 hover:text-white'
      }`}
    >
      {active && (
        <motion.span
          layoutId="cat-pill-bg"
          className="absolute inset-0 rounded-full bg-white"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
        />
      )}
      <span className="relative z-10">{label}</span>
      <span className={`relative z-10 ml-1.5 text-xs font-bold ${active ? 'text-slate-500' : 'text-slate-600'}`}>
        {count}
      </span>
    </motion.button>
  );
}

// ─── Tag pill ─────────────────────────────────────────────────────────────────

type TagPillProps = {
  tag: typeof RESEARCH_TAGS[number];
  activeTag: TagKey; onSelect: (key: TagKey) => void;
};

function TagPill({ tag, activeTag, onSelect }: TagPillProps) {
  const active = activeTag === tag.key;
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={() => onSelect(active ? 'all' : tag.key)}
      className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors select-none outline-none ${
        active ? 'text-slate-900' : 'text-slate-400 hover:text-white border border-white/10 hover:border-white/20'
      }`}
    >
      {active && (
        <motion.span
          layoutId={`tag-pill-bg-${tag.key}`}
          className="absolute inset-0 rounded-full bg-white"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
        />
      )}
      <tag.Icon className={`relative z-10 w-3 h-3 ${active ? 'text-slate-600' : ''}`} />
      <span className="relative z-10">{tag.label}</span>
    </motion.button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CataloguePage() {
  const navigate = useNavigate();
  const { format } = useCurrency();

  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [loading,  setLoading]  = useState(true);

  const [filter,      setFilter]      = useState<FilterType>('all');
  const [activeTag,   setActiveTag]   = useState<TagKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy,      setSortBy]      = useState<SortKey>('default');
  const [showSort,    setShowSort]    = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);

  const sortRef   = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useSEO({
    title: 'Buy Research Peptides India | Retatrutide, Tirzepatide, GHK-Cu | RetraLabs',
    description: 'Buy research-grade Retatrutide, Tirzepatide, BPC-157, NAD+, TB-500, Tesamorelin & more in India. 98%+ HPLC purity, COA verified. From ₹2,000. India-wide shipping.',
    keywords: 'buy retatrutide india, retatrutide catalogue india, buy tirzepatide india, GHK-Cu india, research peptides india, reta india, peptide catalogue india, buy peptides online india',
    canonical: 'https://retralabs.in/catalogue',
    ogImage: 'https://retralabs.in/retatrutide.jpg',
  });

  useEffect(() => { loadProducts(); }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setShowSort(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault(); searchRef.current?.focus();
      }
      if (e.key === 'Escape') { setShowSort(false); searchRef.current?.blur(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  async function loadProducts() {
    setProducts(PRODUCTS);
    setLoading(false);
  }

  const getStartingPrice = (p: ProductWithVariants) =>
    p.variants.length ? Math.min(...p.variants.map(v => v.price_inr)) : null;

  const handleCatSelect = useCallback((id: FilterType) => {
    setFilter(id); setActiveTag('all');
  }, []);

  const filteredProducts = useMemo(() => {
    let list = products.filter(p => {
      if (p.category !== 'research-peptide') return false;
      if (filter === 'peptide'  && p.category !== 'research-peptide') return false;
      if (activeTag !== 'all' && PRODUCT_TAG[p.name] !== activeTag) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    if (sortBy === 'price-asc')  list = [...list].sort((a, b) => (getStartingPrice(a) ?? 0) - (getStartingPrice(b) ?? 0));
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => (getStartingPrice(b) ?? 0) - (getStartingPrice(a) ?? 0));
    if (sortBy === 'name-asc')   list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, filter, activeTag, searchQuery, sortBy]);

  const peptideCount = products.filter(p => p.category === 'research-peptide').length;
  const activeFilterCount = [
    filter !== 'all', activeTag !== 'all', searchQuery.trim() !== '', sortBy !== 'default',
  ].filter(Boolean).length;

  const clearAll = () => { setFilter('all'); setActiveTag('all'); setSearchQuery(''); setSortBy('default'); };
  const currentSortLabel = SORT_OPTIONS.find(s => s.key === sortBy)?.label ?? 'Featured';

  return (
    <div className="min-h-screen bg-[#080D18]">

      {/* ─── PAGE HEADER ──────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-8 border-b border-slate-700/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">

          {/* Title row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <Chip size="sm" variant="flat" className="mb-4 bg-white/10 text-slate-300 uppercase tracking-wider font-bold text-[11px]">
                Research Catalogue
              </Chip>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                The Real Stuff. All Verified.
              </h1>
              <p className="text-slate-400 max-w-xl leading-relaxed">
                No fake B2B listings. No counterfeit labels. Just compounds that pass HPLC every time.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Chip startContent={<ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />} color="success" variant="flat" classNames={{ base: 'bg-emerald-400/15 border border-emerald-400/25', content: 'text-emerald-300 font-semibold' }}>COA Included</Chip>
              <Chip startContent={<FlaskConical className="w-3.5 h-3.5 text-blue-400" />} color="primary" variant="flat" classNames={{ base: 'bg-blue-400/15 border border-blue-400/25', content: 'text-blue-300 font-semibold' }}>98%+ Purity</Chip>
              <Chip startContent={<FileCheck className="w-3.5 h-3.5 text-amber-400" />} color="warning" variant="flat" classNames={{ base: 'bg-amber-400/15 border border-amber-400/25', content: 'text-amber-300 font-semibold' }}>HPLC Verified</Chip>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-4">
            <div
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-200 ${
                searchFocus
                  ? 'bg-white/14 border-white/40 shadow-[0_0_0_3px_rgba(255,255,255,0.08)]'
                  : 'bg-white/8 border-white/15 hover:border-white/25 hover:bg-white/10'
              }`}
            >
              <Search className={`w-4 h-4 shrink-0 transition-colors duration-200 ${searchFocus ? 'text-white' : 'text-slate-500'}`} />
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setSearchFocus(false)}
                placeholder="Search peptides — try 'BPC', 'cognitive', 'metabolic'…"
                className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm outline-none min-w-0"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.7, rotate: -45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.7, rotate: 45 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}
                    className="shrink-0 w-5 h-5 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </motion.button>
                )}
              </AnimatePresence>
              {!searchFocus && !searchQuery && (
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/8 border border-white/12 text-slate-500 text-[11px] font-mono shrink-0">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Filter + Sort row */}
          <div className="flex flex-wrap items-center gap-2 min-h-[38px]">
            <div className="flex items-center gap-1 bg-white/6 rounded-full px-1 py-1">
              <CatPill id="all"     label="All"      count={peptideCount} activeFilter={filter} onSelect={handleCatSelect} />
              <CatPill id="peptide" label="Peptides" count={peptideCount} activeFilter={filter} onSelect={handleCatSelect} />
            </div>
            <div className="hidden sm:block w-px h-5 bg-white/15 mx-1" />
            <div className="flex flex-wrap items-center gap-1.5">
              {RESEARCH_TAGS.map(t => (
                <TagPill key={t.key} tag={t} activeTag={activeTag} onSelect={setActiveTag} />
              ))}
            </div>
            <div ref={sortRef} className="ml-auto relative">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowSort(s => !s)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all border ${
                  showSort || sortBy !== 'default'
                    ? 'bg-white text-slate-900 border-transparent shadow-lg'
                    : 'bg-white/8 text-slate-400 border-white/12 hover:border-white/25 hover:text-white'
                }`}
              >
                <span>{currentSortLabel}</span>
                <motion.div animate={{ rotate: showSort ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {showSort && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-30 min-w-[180px]"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => { setSortBy(opt.key); setShowSort(false); }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50 ${
                          sortBy === opt.key ? 'text-slate-900 bg-slate-50' : 'text-slate-600'
                        }`}
                      >
                        {opt.label}
                        {sortBy === opt.key && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      {/* ─── PRODUCT GRID ─────────────────────────────────────────────────── */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Results bar */}
        {!loading && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
            <div className="flex items-center gap-3 flex-wrap">
              <motion.p
                key={filteredProducts.length}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-slate-500"
              >
                Showing{' '}
                <span className="font-bold text-white">{filteredProducts.length}</span>
                {' '}of{' '}
                <span className="font-semibold text-slate-400">{products.length}</span> products
              </motion.p>
              <AnimatePresence>
                {searchQuery.trim() && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                    <Chip size="sm" variant="flat" color="primary" onClose={() => setSearchQuery('')} classNames={{ base: 'cursor-default' }}>
                      "{searchQuery}"
                    </Chip>
                  </motion.div>
                )}
                {activeTag !== 'all' && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                    <Chip size="sm" variant="flat" color="secondary" onClose={() => setActiveTag('all')} classNames={{ base: 'cursor-default' }}>
                      {RESEARCH_TAGS.find(t => t.key === activeTag)?.label}
                    </Chip>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {activeFilterCount > 0 && (
                <motion.button
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                  onClick={clearAll}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear all
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((product, index) => {
              const startingPrice = getStartingPrice(product);
              const purity        = PURITY_MAP[product.name] || '98%+';
              const badge         = BADGE_MAP[product.name];
              const isBacWater    = product.name.toLowerCase().includes('bacteriostatic');
              const tagKey        = PRODUCT_TAG[product.name];
              const tag           = tagKey ? TAG_STYLE[tagKey] : null;
              const wasPrice      = WAS_PRICE_MAP[product.name];
              const saving        = wasPrice && startingPrice ? wasPrice - startingPrice : 0;

              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col rounded-3xl overflow-hidden cursor-pointer bg-[#080C14] border border-white/[0.06] transition-all duration-500 ease-out hover:-translate-y-2 hover:border-white/[0.11] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)]"
                  onClick={() => navigate(`/product/${product.id}`)}
                >

                  {/* ── Floating badge ── */}
                  {badge && (
                    <div className="absolute top-4 left-4 z-20">
                      <span className={`px-2.5 py-[5px] rounded-full text-[9px] font-bold tracking-[0.14em] uppercase backdrop-blur-md ${badge.style}`}>
                        {badge.label}
                      </span>
                    </div>
                  )}

                  {/* ── Floating purity chip ── */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="flex items-center gap-1.5 px-2.5 py-[5px] rounded-full bg-black/50 backdrop-blur-md border border-white/[0.09] text-[9px] font-semibold text-slate-400 tracking-wide">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                      {purity}
                    </span>
                  </div>

                  {/* ── Image area ── */}
                  <div className="relative aspect-square overflow-hidden shrink-0 flex items-center justify-center p-7 sm:p-9 bg-[#080C14]">

                    {/* Ambient glow orb — blooms on hover */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                      <div
                        className="w-3/5 h-3/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                        style={{ background: GLOW_COLOR[tagKey ?? 'default'], filter: 'blur(36px)' }}
                      />
                    </div>

                    {/* Product image */}
                    <img
                      src={getProductImageUrl(product.image_url, product.name)}
                      alt={`${product.name} research peptide${isBacWater ? '' : ' vial India'}`}
                      loading={index < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="relative z-10 w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                      style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.65))' }}
                      onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        const n = product.name.toLowerCase();
                        if      (n.includes('retatrutide'))                    t.src = '/Retatrutide.jpg';
                        else if (n.includes('tirzepatide'))                    t.src = '/TIRZEPATIDE.jpg';
                        else if (n.includes('ghk'))                            t.src = '/GHKCU.jpg';
                        else if (n.includes('semax'))                          t.src = '/SEMAX.jpg';
                        else if (n.includes('selank'))                         t.src = '/SELANK.jpg';
                        else if (n.includes('bpc'))                            t.src = '/BPC.jpg';
                        else if (n.includes('nad'))                            t.src = '/NAD+.jpg';
                        else if (n.includes('tb-500') || n.includes('tb500')) t.src = '/TB500.jpg';
                        else if (n.includes('tesamorelin'))                    t.src = '/Tesa.jpg';
                        else if (n.includes('mot'))                            t.src = '/motc.jpg';
                        else                                                    t.src = BAC_WATER_IMAGE_URL;
                      }}
                    />

                    {/* Bottom cinematic fade — bleeds image into text */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-3/5 pointer-events-none z-20"
                      style={{ background: 'linear-gradient(to top, #080C14 30%, transparent 100%)' }}
                    />
                  </div>

                  {/* ── Text section ── */}
                  <div className="flex flex-col px-6 pb-6 -mt-5 relative z-30">

                    {/* Category */}
                    {tag && (
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className={`w-[5px] h-[5px] rounded-full shrink-0 ${tag.dot}`} />
                        <span className={`text-[9px] font-bold tracking-[0.2em] uppercase ${tag.text}`}>
                          {tag.label}
                        </span>
                      </div>
                    )}

                    {/* Name */}
                    <h3 className="text-[19px] font-bold text-white tracking-tight leading-tight mb-5">
                      {product.name}
                    </h3>

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[9px] text-slate-600 uppercase tracking-[0.14em] mb-0.5">From</p>
                        {wasPrice && saving > 0 ? (
                          <div className="flex items-baseline gap-2">
                            <p className="text-[20px] font-bold text-white leading-none tracking-tight">
                              {startingPrice ? format(startingPrice) : '—'}
                            </p>
                            <p className="text-[12px] font-medium text-slate-600 line-through leading-none">
                              {format(wasPrice)}
                            </p>
                          </div>
                        ) : (
                          <p className="text-[20px] font-bold text-white leading-none tracking-tight">
                            {startingPrice ? format(startingPrice) : '—'}
                          </p>
                        )}
                        {saving > 0 && (
                          <p className="text-[9px] font-bold text-emerald-400 tracking-[0.1em] mt-1">
                            SAVE {format(saving)}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
                        className="group/cta shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/[0.18] text-white text-[12px] font-semibold whitespace-nowrap transition-all duration-300 ease-out hover:bg-white hover:text-slate-900 hover:border-transparent active:scale-95"
                      >
                        Order
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
                      </button>
                    </div>

                    {/* Minimal trust row */}
                    <div className="mt-5 pt-4 border-t border-white/[0.05]">
                      <p className="text-[9px] text-slate-700 tracking-[0.12em] uppercase font-medium">
                        {isBacWater ? 'Pharma grade · Sterile · Benzyl alcohol' : 'HPLC verified · COA included · GMP source'}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Search className="w-14 h-14 text-slate-700 mx-auto mb-5" />
            </motion.div>
            <p className="text-white font-bold text-lg mb-2">No results found</p>
            <p className="text-slate-500 text-sm mb-2 max-w-xs mx-auto">
              {searchQuery
                ? `Nothing matches "${searchQuery}". Try a different keyword.`
                : 'No products match the selected filters.'}
            </p>
            <Button
              variant="flat" color="primary"
              onPress={clearAll}
              className="font-semibold mt-4"
              startContent={<X className="w-4 h-4" />}
            >
              Clear filters
            </Button>
          </motion.div>
        )}

        {/* ─── BUNDLE DEAL PANEL ───────────────────────────────────────────── */}
        {!loading && (
          <div className="mt-14 rounded-2xl bg-slate-900 border border-white/[0.08] overflow-hidden">
            <div className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-400 text-sm font-bold uppercase tracking-wider">Bundle Deal</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Order More. Pay Less.</h3>
                  <p className="text-slate-400 leading-relaxed mb-5">
                    Buy the same peptide twice and get 10% off. Buy three and get 20% off. Per peptide, not per cart.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/[0.07] border border-white/[0.1] text-emerald-300 text-xs font-semibold">×2 = 10% off</span>
                    <span className="px-3 py-1 rounded-full bg-white/[0.07] border border-white/[0.1] text-emerald-300 text-xs font-semibold">×3 = 20% off</span>
                    <span className="px-3 py-1 rounded-full bg-white/[0.07] border border-white/[0.1] text-amber-300 text-xs font-semibold">Auto-applied at checkout</span>
                  </div>
                </div>
                <button
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="shrink-0 flex items-center gap-2 px-6 py-3.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors text-sm"
                >
                  Browse the Catalogue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

      </section>
    </div>
  );
}
