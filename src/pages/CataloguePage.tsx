import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardFooter,
  Chip,
  Button,
  Skeleton,
  Divider,
} from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';
// Products are static — Supabase is used for orders only
import { getProductImageUrl, BAC_WATER_IMAGE_URL } from '../utils/imageUrl';
import { ProductWithVariants } from '../types';
import { PRODUCTS } from '../data/products';
import { useCurrency } from '../context/CurrencyContext';
import { useSEO } from '../hooks/useSEO';
import {
  ShieldCheck, FlaskConical, FileCheck, Microscope, Sparkles,
  ArrowRight, GraduationCap, Search, X, ChevronDown, Check,
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
};

const BADGE_MAP: Record<string, { label: string; color: 'warning' | 'primary' | 'secondary' }> = {
  'Retatrutide': { label: 'BESTSELLER', color: 'warning' },
  'Tirzepatide': { label: 'POPULAR',    color: 'primary' },
  'BPC-157':     { label: 'NEW',        color: 'secondary' },
  'NAD+':        { label: 'NEW',        color: 'secondary' },
  'TB-500':      { label: 'NEW',        color: 'secondary' },
  'Tesamorelin': { label: 'NEW',        color: 'secondary' },
  'MOT-C':       { label: 'NEW',        color: 'secondary' },
  'Klow Blend':                  { label: 'NEW', color: 'secondary' },
  'CJC-1295 + Ipamorelin Stack': { label: 'NEW', color: 'secondary' },
  'The Wolverine Stack':          { label: 'NEW', color: 'secondary' },
};

// Research-area tag for each peptide (single tag per product for simplicity)
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
};

const RESEARCH_TAGS = [
  { key: 'all',       label: 'All Areas',  Icon: LayoutGrid },
  { key: 'metabolic', label: 'Metabolic',  Icon: Zap        },
  { key: 'cognitive', label: 'Cognitive',  Icon: Brain      },
  { key: 'recovery',  label: 'Recovery',   Icon: Activity   },
  { key: 'longevity', label: 'Longevity',  Icon: Star       },
] as const;

const SORT_OPTIONS = [
  { key: 'default',    label: 'Featured'         },
  { key: 'price-asc',  label: 'Price: Low → High' },
  { key: 'price-desc', label: 'Price: High → Low' },
  { key: 'name-asc',   label: 'Name: A → Z'      },
] as const;

type SortKey    = typeof SORT_OPTIONS[number]['key'];
type FilterType = 'all' | 'peptide' | 'supplies';
type TagKey     = typeof RESEARCH_TAGS[number]['key'];

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <Card shadow="sm" className="w-full">
      <CardBody className="p-0">
        <Skeleton className="w-full aspect-[4/3] rounded-none rounded-t-xl" />
        <div className="p-5 space-y-3">
          <Skeleton className="h-6 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-2/3 rounded-lg" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </CardBody>
      <CardFooter className="flex justify-between items-center px-5 pb-5 pt-0">
        <Skeleton className="h-7 w-28 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </CardFooter>
    </Card>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CataloguePage() {
  const navigate = useNavigate();
  const { format } = useCurrency();

  // Data
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [loading,  setLoading]  = useState(true);

  // Filters
  const [filter,       setFilter]       = useState<FilterType>('all');
  const [activeTag,    setActiveTag]    = useState<TagKey>('all');
  const [searchQuery,  setSearchQuery]  = useState('');
  const [sortBy,       setSortBy]       = useState<SortKey>('default');
  const [showSort,     setShowSort]     = useState(false);
  const [searchFocus,  setSearchFocus]  = useState(false);

  const sortRef    = useRef<HTMLDivElement>(null);
  const searchRef  = useRef<HTMLInputElement>(null);

  useSEO({
    title: 'Buy Research Peptides India | Retatrutide, Tirzepatide, GHK-Cu | RetraLabs',
    description: 'Buy research-grade Retatrutide, Tirzepatide, BPC-157, NAD+, TB-500, Tesamorelin & more in India. 99%+ HPLC purity, COA verified. From ₹2,000. India-wide shipping.',
    keywords: 'buy retatrutide india, retatrutide catalogue india, buy tirzepatide india, GHK-Cu india, research peptides india, reta india, peptide catalogue india, buy peptides online india',
    canonical: 'https://retralabs.in/catalogue',
    ogImage: 'https://retralabs.in/retatrutide.jpg',
  });

  useEffect(() => { loadProducts(); }, []);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSort(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard shortcut: "/" focuses search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowSort(false);
        searchRef.current?.blur();
      }
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

  // ── Derived lists ──────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let list = products.filter(p => {
      // Category
      if (filter === 'peptide'  && p.category !== 'research-peptide') return false;
      if (filter === 'supplies' && p.category === 'research-peptide')  return false;
      // Research area tag
      if (activeTag !== 'all' && PRODUCT_TAG[p.name] !== activeTag) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    // Sort
    if (sortBy === 'price-asc')  list = [...list].sort((a, b) => (getStartingPrice(a) ?? 0) - (getStartingPrice(b) ?? 0));
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => (getStartingPrice(b) ?? 0) - (getStartingPrice(a) ?? 0));
    if (sortBy === 'name-asc')   list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [products, filter, activeTag, searchQuery, sortBy]);

  const peptideCount  = products.filter(p => p.category === 'research-peptide').length;
  const suppliesCount = products.filter(p => p.category !== 'research-peptide').length;
  const activeFilterCount = [
    filter !== 'all', activeTag !== 'all', searchQuery.trim() !== '', sortBy !== 'default',
  ].filter(Boolean).length;

  const clearAll = () => {
    setFilter('all');
    setActiveTag('all');
    setSearchQuery('');
    setSortBy('default');
  };

  const currentSortLabel = SORT_OPTIONS.find(s => s.key === sortBy)?.label ?? 'Featured';

  // ── Category pill ──────────────────────────────────────────────────────────
  const CatPill = ({ id, label, count }: { id: FilterType; label: string; count: number }) => (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={() => { setFilter(id); setActiveTag('all'); }}
      className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-colors select-none outline-none ${
        filter === id
          ? 'text-slate-900'
          : 'text-slate-400 hover:text-white'
      }`}
    >
      {filter === id && (
        <motion.span
          layoutId="cat-pill-bg"
          className="absolute inset-0 rounded-full bg-white"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
        />
      )}
      <span className="relative z-10">{label}</span>
      <span className={`relative z-10 ml-1.5 text-xs font-bold ${filter === id ? 'text-slate-500' : 'text-slate-600'}`}>
        {count}
      </span>
    </motion.button>
  );

  // ── Tag pill ───────────────────────────────────────────────────────────────
  const TagPill = ({ tag }: { tag: typeof RESEARCH_TAGS[number] }) => {
    const active = activeTag === tag.key;
    return (
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={() => setActiveTag(active ? 'all' : tag.key)}
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
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ─── PAGE HEADER ──────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-8 border-b border-slate-700">
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
              <Chip startContent={<FlaskConical className="w-3.5 h-3.5 text-blue-400" />} color="primary" variant="flat" classNames={{ base: 'bg-blue-400/15 border border-blue-400/25', content: 'text-blue-300 font-semibold' }}>99%+ Purity</Chip>
              <Chip startContent={<FileCheck className="w-3.5 h-3.5 text-amber-400" />} color="warning" variant="flat" classNames={{ base: 'bg-amber-400/15 border border-amber-400/25', content: 'text-amber-300 font-semibold' }}>HPLC Verified</Chip>
            </div>
          </div>

          {/* ── Search bar ─────────────────────────────────────────────────── */}
          <div className="relative mb-4">
            <motion.div
              animate={searchFocus ? { scale: 1.01 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
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
              {/* Keyboard hint */}
              {!searchFocus && !searchQuery && (
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/8 border border-white/12 text-slate-500 text-[11px] font-mono shrink-0">
                  /
                </kbd>
              )}
            </motion.div>
          </div>

          {/* ── Filter + Sort row ───────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-2 min-h-[38px]">

            {/* Category pills */}
            <div className="flex items-center gap-1 bg-white/6 rounded-full px-1 py-1">
              <CatPill id="all"      label="All"      count={products.length} />
              <CatPill id="peptide"  label="Peptides" count={peptideCount}    />
              <CatPill id="supplies" label="Supplies" count={suppliesCount}   />
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-5 bg-white/15 mx-1" />

            {/* Research-area tags (only visible for peptide / all) */}
            <AnimatePresence>
              {filter !== 'supplies' && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-wrap items-center gap-1.5"
                >
                  {RESEARCH_TAGS.map(t => <TagPill key={t.key} tag={t} />)}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sort dropdown — pushed to the right */}
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
                    animate={{ opacity: 1, y: 0,  scale: 1    }}
                    exit={{ opacity: 0,    y: -6, scale: 0.96 }}
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

        {/* Results / active filters bar */}
        {!loading && (
          <motion.div
            layout
            className="flex flex-wrap items-center justify-between gap-3 mb-7"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <motion.p
                key={filteredProducts.length}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1,  y: 0  }}
                className="text-sm text-slate-500"
              >
                Showing{' '}
                <span className="font-bold text-slate-900">{filteredProducts.length}</span>
                {' '}of{' '}
                <span className="font-semibold">{products.length}</span> products
              </motion.p>

              {/* Active filter pills */}
              <AnimatePresence>
                {searchQuery.trim() && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                    <Chip
                      size="sm" variant="flat" color="primary"
                      onClose={() => setSearchQuery('')}
                      classNames={{ base: 'cursor-default' }}
                    >
                      "{searchQuery}"
                    </Chip>
                  </motion.div>
                )}
                {activeTag !== 'all' && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                    <Chip
                      size="sm" variant="flat" color="secondary"
                      onClose={() => setActiveTag('all')}
                      classNames={{ base: 'cursor-default' }}
                    >
                      {RESEARCH_TAGS.find(t => t.key === activeTag)?.label}
                    </Chip>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Clear all button */}
            <AnimatePresence>
              {activeFilterCount > 0 && (
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0  }}
                  exit={{ opacity: 0,   x: 10  }}
                  onClick={clearAll}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear all
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="sync" initial={false}>
              {filteredProducts.map((product, index) => {
                const startingPrice = getStartingPrice(product);
                const purity        = PURITY_MAP[product.name] || '99%+';
                const badge         = BADGE_MAP[product.name];
                const isBacWater    = product.name.toLowerCase().includes('bacteriostatic');

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    exit={{ opacity: 0, transition: { duration: 0.18 } }}
                    className="cursor-pointer group"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <Card shadow="sm" className="w-full h-full hover:shadow-xl transition-shadow duration-300">
                      <CardBody className="p-0 overflow-hidden">

                        {/* Image */}
                        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                          <img
                            src={getProductImageUrl(product.image_url, product.name)}
                            alt={`${product.name} research peptide${isBacWater ? '' : ' vial India'}`}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                            onError={(e) => {
                              const t = e.target as HTMLImageElement;
                              const n = product.name.toLowerCase();
                              if      (n.includes('retatrutide'))                  t.src = '/Retatrutide.png';
                              else if (n.includes('tirzepatide'))                  t.src = '/TIRZEPATIDE.png';
                              else if (n.includes('ghk'))                          t.src = '/GHKCU.png';
                              else if (n.includes('semax'))                        t.src = '/SEMAX.png';
                              else if (n.includes('selank'))                       t.src = '/SELANK.png';
                              else if (n.includes('bpc'))                          t.src = '/BPC.png';
                              else if (n.includes('nad'))                          t.src = '/NAD+.png';
                              else if (n.includes('tb-500') || n.includes('tb500')) t.src = '/TB500.png';
                              else if (n.includes('tesamorelin'))                  t.src = '/Tesa.png';
                              else if (n.includes('mot'))                          t.src = '/motc.png';
                              else                                                  t.src = BAC_WATER_IMAGE_URL;
                            }}
                          />

                          {/* BESTSELLER / POPULAR / NEW badge */}
                          {badge && (
                            <div className="absolute top-3 left-3 z-10">
                              <Chip size="sm" color={badge.color} variant="solid" className="font-bold text-[11px] shadow-md">
                                {badge.label}
                              </Chip>
                            </div>
                          )}

                          {/* Research-area tag badge — hidden on mobile to avoid badge collision */}
                          {PRODUCT_TAG[product.name] && (
                            <div className="hidden sm:block absolute bottom-3 left-3 z-10">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wide">
                                {(() => {
                                  const t = RESEARCH_TAGS.find(r => r.key === PRODUCT_TAG[product.name]);
                                  return t ? <><t.Icon className="w-2.5 h-2.5" />{t.label}</> : null;
                                })()}
                              </span>
                            </div>
                          )}

                          {/* Purity badge */}
                          <div className="absolute top-3 right-3 z-10">
                            <Chip
                              size="sm" color="success" variant="flat"
                              startContent={<ShieldCheck className="w-3 h-3" />}
                              className="font-bold bg-white/90 backdrop-blur-sm shadow-sm"
                            >
                              {purity}
                            </Chip>
                          </div>

                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Content */}
                        <div className="px-5 py-4">
                          {/* Highlight matching search text in name */}
                          <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-primary-600 transition-colors duration-200">
                            {product.name}
                          </h3>
                          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3">
                            {product.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            <Chip size="sm" variant="flat" color="success"  className="text-[11px] font-medium">
                              <ShieldCheck className="w-3 h-3 mr-1 inline" />Lab verified
                            </Chip>
                            <Chip size="sm" variant="flat" color="primary"  className="text-[11px] font-medium">
                              <Microscope className="w-3 h-3 mr-1 inline" />HPLC tested
                            </Chip>
                            {!isBacWater && (
                              <Chip size="sm" variant="flat" color="warning" className="text-[11px] font-medium">
                                <FileCheck className="w-3 h-3 mr-1 inline" />COA included
                              </Chip>
                            )}
                          </div>
                          <Divider className="my-2" />
                        </div>
                      </CardBody>

                      <CardFooter className="px-5 pb-4 pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                        <div>
                          {startingPrice && (
                            <div className="flex items-baseline gap-1">
                              <span className="text-xs text-slate-400 font-medium">From</span>
                              <span className="text-xl font-bold text-slate-900">{format(startingPrice)}</span>
                            </div>
                          )}
                          {(() => {
                            if (product.variants.length < 2) return null;
                            const base = Math.min(...product.variants.map(v => v.price_inr));
                            const baseDosage = product.variants.find(v => v.price_inr === base)?.dosage_mg ?? 1;
                            const maxSaving = Math.max(...product.variants.map(v => {
                              const units = Math.round(v.dosage_mg / baseDosage);
                              return units > 1 ? (base * units) - v.price_inr : 0;
                            }));
                            return maxSaving > 0 ? (
                              <span className="inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 mt-1">
                                Save up to {format(maxSaving)} on bundles
                              </span>
                            ) : null;
                          })()}
                          <span className="flex items-center gap-1 mt-1 text-[10px] font-semibold text-indigo-500">
                            <GraduationCap className="w-3 h-3" />Student discount available
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
                          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 active:bg-slate-800 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
                        >
                          Order <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

        ) : (
          /* ── Animated empty state ── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1,  y: 0  }}
            className="text-center py-24"
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Search className="w-14 h-14 text-slate-200 mx-auto mb-5" />
            </motion.div>
            <p className="text-slate-800 font-bold text-lg mb-2">No results found</p>
            <p className="text-slate-400 text-sm mb-2 max-w-xs mx-auto">
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
          <Card shadow="none" className="mt-14 bg-gradient-to-br from-slate-900 to-slate-800 border-0 overflow-hidden">
            <CardBody className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-400 text-sm font-bold uppercase tracking-wider">Bundle Deal</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Order More of the Same. Pay Less.</h3>
                  <p className="text-slate-400 leading-relaxed mb-5">
                    Buy the same peptide twice and get 10% off it. Buy three and get 20% off. Per peptide, not per cart.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Chip size="sm" variant="flat" color="success" className="font-semibold bg-white/10 text-emerald-300">Same peptide ×2 = 10% off</Chip>
                    <Chip size="sm" variant="flat" color="success" className="font-semibold bg-white/10 text-emerald-300">Same peptide ×3 = 20% off</Chip>
                    <Chip size="sm" variant="flat" color="warning" className="font-semibold bg-white/10 text-amber-300">Auto-applied at checkout</Chip>
                  </div>
                </div>
                <Button
                  size="lg" variant="solid"
                  className="shrink-0 bg-white text-slate-900 font-bold shadow-lg hover:bg-slate-100"
                  endContent={<ArrowRight className="w-4 h-4" />}
                  onPress={() =>
                    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                >
                  Browse the Catalogue →
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

      </section>
    </div>
  );
}
