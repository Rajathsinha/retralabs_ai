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
import TiltCard from '../components/TiltCard';
// Products are static (DEMO_PRODUCTS) — Supabase is used for orders only
import { getProductImageUrl, BAC_WATER_IMAGE_URL } from '../utils/imageUrl';
import { ProductWithVariants } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useSEO } from '../hooks/useSEO';
import {
  ShieldCheck, FlaskConical, FileCheck, Microscope, Sparkles,
  ArrowRight, GraduationCap, Search, X, ChevronDown, Check,
  Zap, Brain, Activity, Star, LayoutGrid,
} from 'lucide-react';

// ─── Demo data ────────────────────────────────────────────────────────────────

const DEMO_PRODUCTS: ProductWithVariants[] = [
  {
    id: '1',
    name: 'Retatrutide',
    description: 'Triple agonist peptide targeting GLP-1, GIP, and glucagon receptors for metabolic and obesity research.',
    category: 'research-peptide',
    image_url: '/Retatrutide.png',
    created_at: new Date().toISOString(),
    variants: [
      { id: '1s', product_id: '1', dosage_mg: 10,  price_inr: 3500,  in_stock: true, vial_configuration: 'Starter vial',               created_at: new Date().toISOString() },
      { id: '1a', product_id: '1', dosage_mg: 20,  price_inr: 6000,  in_stock: true, vial_configuration: 'Single vial',                created_at: new Date().toISOString() },
      { id: '1b', product_id: '1', dosage_mg: 50,  price_inr: 13000, in_stock: true, vial_configuration: '10mg x 5 vials',             created_at: new Date().toISOString() },
      { id: '1c', product_id: '1', dosage_mg: 100, price_inr: 21000, in_stock: true, vial_configuration: '10mg x 10 vials / 20mg x 5 vials', created_at: new Date().toISOString() },
    ],
  },
  {
    id: '2',
    name: 'Tirzepatide',
    description: 'Dual GIP and GLP-1 receptor agonist for metabolic research and analytical applications.',
    category: 'research-peptide',
    image_url: '/TIRZEPATIDE.png',
    created_at: new Date().toISOString(),
    variants: [
      { id: '2x', product_id: '2', dosage_mg: 10,  price_inr: 2500,  in_stock: true, vial_configuration: 'Single vial', created_at: new Date().toISOString() },
      { id: '2a', product_id: '2', dosage_mg: 20,  price_inr: 4000,  in_stock: true, vial_configuration: '2 vials',     created_at: new Date().toISOString() },
      { id: '2b', product_id: '2', dosage_mg: 50,  price_inr: 9000,  in_stock: true, vial_configuration: '5 vials',     created_at: new Date().toISOString() },
      { id: '2c', product_id: '2', dosage_mg: 100, price_inr: 16000, in_stock: true, vial_configuration: '10 vials',    created_at: new Date().toISOString() },
    ],
  },
  {
    id: '3',
    name: 'GHK-Cu',
    description: 'Copper peptide complex for skin regeneration, wound healing, and anti-aging research applications.',
    category: 'research-peptide',
    image_url: '/GHKCU.png',
    created_at: new Date().toISOString(),
    variants: [
      { id: '3a', product_id: '3', dosage_mg: 100,  price_inr: 4000,  in_stock: true, vial_configuration: '1×100mg',        created_at: new Date().toISOString() },
      { id: '3b', product_id: '3', dosage_mg: 200,  price_inr: 6000,  in_stock: true, vial_configuration: '2×100mg',        created_at: new Date().toISOString() },
      { id: '3c', product_id: '3', dosage_mg: 300,  price_inr: 8000,  in_stock: true, vial_configuration: '3×100mg',        created_at: new Date().toISOString() },
      { id: '3d', product_id: '3', dosage_mg: 500,  price_inr: 11000, in_stock: true, vial_configuration: '5×100mg',        created_at: new Date().toISOString() },
      { id: '3e', product_id: '3', dosage_mg: 1000, price_inr: 20000, in_stock: true, vial_configuration: 'Full Kit 10×100mg', created_at: new Date().toISOString() },
    ],
  },
  {
    id: '4',
    name: 'Semax',
    description: 'Synthetic ACTH analogue nootropic peptide for cognitive function, neuroprotection, and CNS research.',
    category: 'research-peptide',
    image_url: '/SEMAX.png',
    created_at: new Date().toISOString(),
    variants: [
      { id: '4a', product_id: '4', dosage_mg: 10,  price_inr: 2000,  in_stock: true, created_at: new Date().toISOString() },
      { id: '4b', product_id: '4', dosage_mg: 20,  price_inr: 3500,  in_stock: true, created_at: new Date().toISOString() },
      { id: '4c', product_id: '4', dosage_mg: 50,  price_inr: 7000,  in_stock: true, created_at: new Date().toISOString() },
      { id: '4d', product_id: '4', dosage_mg: 100, price_inr: 12000, in_stock: true, created_at: new Date().toISOString() },
    ],
  },
  {
    id: '5',
    name: 'Selank',
    description: 'Anxiolytic and nootropic heptapeptide derived from tuftsin, researched for anti-anxiety and cognitive enhancement.',
    category: 'research-peptide',
    image_url: '/SELANK.png',
    created_at: new Date().toISOString(),
    variants: [
      { id: '5a', product_id: '5', dosage_mg: 10,  price_inr: 2000,  in_stock: true, created_at: new Date().toISOString() },
      { id: '5b', product_id: '5', dosage_mg: 20,  price_inr: 3500,  in_stock: true, created_at: new Date().toISOString() },
      { id: '5c', product_id: '5', dosage_mg: 50,  price_inr: 7000,  in_stock: true, created_at: new Date().toISOString() },
      { id: '5d', product_id: '5', dosage_mg: 100, price_inr: 12000, in_stock: true, created_at: new Date().toISOString() },
    ],
  },
  {
    id: '7',
    name: 'BPC-157',
    description: 'Body protection compound derived from human gastric juice, researched for tissue repair, gut health, and injury recovery.',
    category: 'research-peptide',
    image_url: '/BPC.png',
    created_at: new Date().toISOString(),
    variants: [
      { id: '7a', product_id: '7', dosage_mg: 10,  price_inr: 2500,  in_stock: true, created_at: new Date().toISOString() },
      { id: '7b', product_id: '7', dosage_mg: 20,  price_inr: 4000,  in_stock: true, created_at: new Date().toISOString() },
      { id: '7c', product_id: '7', dosage_mg: 50,  price_inr: 7000,  in_stock: true, created_at: new Date().toISOString() },
      { id: '7d', product_id: '7', dosage_mg: 100, price_inr: 13000, in_stock: true, created_at: new Date().toISOString() },
    ],
  },
  {
    id: '8',
    name: 'NAD+',
    description: 'Nicotinamide adenine dinucleotide coenzyme for cellular energy metabolism, DNA repair, and longevity research.',
    category: 'research-peptide',
    image_url: '/NAD+.png',
    created_at: new Date().toISOString(),
    variants: [
      { id: '8a', product_id: '8', dosage_mg: 10,  price_inr: 4500,  in_stock: true, created_at: new Date().toISOString() },
      { id: '8b', product_id: '8', dosage_mg: 20,  price_inr: 8000,  in_stock: true, created_at: new Date().toISOString() },
      { id: '8c', product_id: '8', dosage_mg: 50,  price_inr: 17000, in_stock: true, created_at: new Date().toISOString() },
      { id: '8d', product_id: '8', dosage_mg: 100, price_inr: 30000, in_stock: true, created_at: new Date().toISOString() },
    ],
  },
  {
    id: '9',
    name: 'TB-500',
    description: 'Synthetic analogue of Thymosin Beta-4, studied for tissue regeneration, wound healing, and inflammation modulation.',
    category: 'research-peptide',
    image_url: '/TB500.png',
    created_at: new Date().toISOString(),
    variants: [
      { id: '9a', product_id: '9', dosage_mg: 10,  price_inr: 4000,  in_stock: true, created_at: new Date().toISOString() },
      { id: '9b', product_id: '9', dosage_mg: 20,  price_inr: 7000,  in_stock: true, created_at: new Date().toISOString() },
      { id: '9c', product_id: '9', dosage_mg: 50,  price_inr: 14000, in_stock: true, created_at: new Date().toISOString() },
      { id: '9d', product_id: '9', dosage_mg: 100, price_inr: 24000, in_stock: true, created_at: new Date().toISOString() },
    ],
  },
  {
    id: '10',
    name: 'Tesamorelin',
    description: 'GHRH analogue that stimulates growth hormone release, researched for metabolic regulation and body composition studies.',
    category: 'research-peptide',
    image_url: '/Tesa.png',
    created_at: new Date().toISOString(),
    variants: [
      { id: '10a', product_id: '10', dosage_mg: 1,  price_inr: 3000,  in_stock: true, vial_configuration: '1×1000mcg',  created_at: new Date().toISOString() },
      { id: '10b', product_id: '10', dosage_mg: 2,  price_inr: 5000,  in_stock: true, vial_configuration: '2×1000mcg',  created_at: new Date().toISOString() },
      { id: '10c', product_id: '10', dosage_mg: 5,  price_inr: 12000, in_stock: true, vial_configuration: '5×1000mcg',  created_at: new Date().toISOString() },
      { id: '10d', product_id: '10', dosage_mg: 10, price_inr: 22000, in_stock: true, vial_configuration: '10×1000mcg', created_at: new Date().toISOString() },
    ],
  },
  {
    id: '11',
    name: 'MOT-C',
    description: 'MOTS-c mitochondrial-derived peptide studied for metabolic regulation, insulin sensitivity, and cellular homeostasis.',
    category: 'research-peptide',
    image_url: '/motc.png',
    created_at: new Date().toISOString(),
    variants: [
      { id: '11a', product_id: '11', dosage_mg: 10,  price_inr: 2000,  in_stock: true, created_at: new Date().toISOString() },
      { id: '11b', product_id: '11', dosage_mg: 20,  price_inr: 3000,  in_stock: true, created_at: new Date().toISOString() },
      { id: '11c', product_id: '11', dosage_mg: 50,  price_inr: 6000,  in_stock: true, created_at: new Date().toISOString() },
      { id: '11d', product_id: '11', dosage_mg: 100, price_inr: 11000, in_stock: true, created_at: new Date().toISOString() },
    ],
  },
  {
    id: '6',
    name: 'Bacteriostatic Water (Pharma Grade)',
    description: 'Pharmaceutical grade bacteriostatic water for reconstituting peptides. Sterile, 0.9% benzyl alcohol preservation.',
    category: 'Medical Supplies',
    image_url: '/bac-water.png',
    created_at: new Date().toISOString(),
    variants: [
      { id: '6a', product_id: '6', dosage_mg: 10,  price_inr: 400,  in_stock: true, vial_configuration: '1×10ML',  created_at: new Date().toISOString() },
      { id: '6b', product_id: '6', dosage_mg: 20,  price_inr: 600,  in_stock: true, vial_configuration: '2×10ML',  created_at: new Date().toISOString() },
      { id: '6c', product_id: '6', dosage_mg: 50,  price_inr: 800,  in_stock: true, vial_configuration: '5×10ML',  created_at: new Date().toISOString() },
      { id: '6d', product_id: '6', dosage_mg: 100, price_inr: 1500, in_stock: true, vial_configuration: '10×10ML', created_at: new Date().toISOString() },
    ],
  },
];

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
    // Catalogue is managed in-code (DEMO_PRODUCTS) — Supabase products table
    // may have different category values or be missing entries, so we always
    // use the authoritative local list here. Supabase is used for orders only.
    setProducts(DEMO_PRODUCTS);
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
      style={{
        position: 'relative',
        padding: '0.4rem 1rem',
        borderRadius: 9999,
        fontSize: '0.78rem',
        fontWeight: filter === id ? 500 : 300,
        background: filter === id ? 'var(--text)' : 'transparent',
        color: filter === id ? 'var(--white)' : 'var(--text-muted)',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s',
        outline: 'none',
        userSelect: 'none',
      }}
    >
      {label}
      <span style={{ marginLeft: '0.3rem', fontSize: '0.68rem', opacity: 0.65 }}>{count}</span>
    </motion.button>
  );

  // ── Tag pill ───────────────────────────────────────────────────────────────
  const TagPill = ({ tag }: { tag: typeof RESEARCH_TAGS[number] }) => {
    const active = activeTag === tag.key;
    return (
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={() => setActiveTag(active ? 'all' : tag.key)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          padding: '0.3rem 0.75rem',
          borderRadius: 9999,
          fontSize: '0.72rem',
          fontWeight: active ? 500 : 300,
          background: active ? 'var(--accent-light)' : 'transparent',
          color: active ? 'var(--accent)' : 'var(--text-muted)',
          border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
          cursor: 'pointer',
          transition: 'all 0.2s',
          outline: 'none',
          userSelect: 'none',
        }}
      >
        <tag.Icon style={{ width: 11, height: 11, color: active ? 'var(--accent)' : 'var(--text-light)' }} />
        <span>{tag.label}</span>
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--white)' }}>

      {/* ─── PAGE HEADER ──────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--off-white)', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">

          {/* Title row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <p className="section-eyebrow mb-4">Research Catalogue</p>
              <h1 className="section-heading" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '0.75rem' }}>
                The Real Stuff. All Verified.
              </h1>
              <p style={{ color: 'var(--text-muted)', maxWidth: 480, lineHeight: 1.75, fontSize: '0.9rem' }}>
                No fake B2B listings. No counterfeit labels. Just compounds that pass HPLC every time.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Chip startContent={<ShieldCheck className="w-3.5 h-3.5" />} color="success" variant="flat" className="font-semibold">COA Included</Chip>
              <Chip startContent={<FlaskConical className="w-3.5 h-3.5" />} color="primary" variant="flat" className="font-semibold">99%+ Purity</Chip>
              <Chip startContent={<FileCheck className="w-3.5 h-3.5" />}   color="warning" variant="flat" className="font-semibold">HPLC Verified</Chip>
            </div>
          </div>

          {/* ── Search bar ─────────────────────────────────────────────────── */}
          <div className="relative mb-4">
            <motion.div
              animate={searchFocus ? { scale: 1.01 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                border: `1px solid ${searchFocus ? 'var(--border-strong)' : 'var(--border)'}`,
                background: 'var(--white)',
                boxShadow: searchFocus ? '0 0 0 3px rgba(26,107,74,0.08)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <Search style={{ flexShrink: 0, color: searchFocus ? 'var(--accent)' : 'var(--text-muted)', width: 16, height: 16 }} />
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setSearchFocus(false)}
                placeholder="Search peptides — try 'BPC', 'cognitive', 'metabolic'…"
                style={{ flex: 1, background: 'transparent', color: 'var(--text)', fontSize: '0.85rem', outline: 'none', border: 'none', minWidth: 0 }}
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.7, rotate: -45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.7, rotate: 45 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}
                    style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: 'var(--border)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.15s' }}
                  >
                    <X style={{ width: 12, height: 12, color: 'var(--text-muted)' }} />
                  </motion.button>
                )}
              </AnimatePresence>
              {/* Keyboard hint */}
              {!searchFocus && !searchQuery && (
                <kbd style={{ padding: '0.1rem 0.4rem', borderRadius: 4, background: 'var(--off-white)', border: '1px solid var(--border)', color: 'var(--text-light)', fontSize: '0.68rem', fontFamily: 'monospace', flexShrink: 0 }}>
                  /
                </kbd>
              )}
            </motion.div>
          </div>

          {/* ── Filter + Sort row ───────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-2 min-h-[38px]">

            {/* Category pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--cream)', borderRadius: 9999, padding: '0.2rem' }}>
              <CatPill id="all"      label="All"      count={products.length} />
              <CatPill id="peptide"  label="Peptides" count={peptideCount}    />
              <CatPill id="supplies" label="Supplies" count={suppliesCount}   />
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-5 mx-1" style={{ background: 'var(--border-strong)' }} />

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
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.4rem 0.875rem',
                  borderRadius: 9999,
                  fontSize: '0.75rem',
                  fontWeight: showSort || sortBy !== 'default' ? 500 : 300,
                  background: showSort || sortBy !== 'default' ? 'var(--text)' : 'transparent',
                  color: showSort || sortBy !== 'default' ? 'var(--white)' : 'var(--text-muted)',
                  border: `1px solid ${showSort || sortBy !== 'default' ? 'var(--text)' : 'var(--border-strong)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
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
                    style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: 'var(--white)', borderRadius: '1rem', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', overflow: 'hidden', zIndex: 30, minWidth: 180 }}
                  >
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => { setSortBy(opt.key); setShowSort(false); }}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '0.625rem 1rem',
                          fontSize: '0.82rem',
                          fontWeight: sortBy === opt.key ? 500 : 300,
                          color: sortBy === opt.key ? 'var(--text)' : 'var(--text-muted)',
                          background: sortBy === opt.key ? 'var(--off-white)' : 'transparent',
                          border: 'none', cursor: 'pointer', transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { if (sortBy !== opt.key) (e.currentTarget.style.background = 'var(--off-white)'); }}
                        onMouseLeave={e => { if (sortBy !== opt.key) (e.currentTarget.style.background = 'transparent'); }}
                      >
                        {opt.label}
                        {sortBy === opt.key && <Check style={{ width: 12, height: 12, color: 'var(--accent)' }} />}
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
                style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}
              >
                Showing{' '}
                <span style={{ fontWeight: 500, color: 'var(--text)' }}>{filteredProducts.length}</span>
                {' '}of{' '}
                <span style={{ fontWeight: 400 }}>{products.length}</span> products
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
                  style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                  className=""
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
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredProducts.map((product, index) => {
                const startingPrice = getStartingPrice(product);
                const purity        = PURITY_MAP[product.name] || '99%+';
                const badge         = BADGE_MAP[product.name];
                const isBacWater    = product.name.toLowerCase().includes('bacteriostatic');

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
                  >
                    <TiltCard className="cursor-pointer group h-full" intensity={8}>
                      <div
                        onClick={() => navigate(`/product/${product.id}`)}
                        style={{
                          background: 'var(--white)',
                          border: '1px solid var(--border)',
                          borderRadius: '1rem',
                          overflow: 'hidden',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'box-shadow 0.3s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)')}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                      >
                        {/* Image */}
                        <div style={{ position: 'relative', background: 'var(--off-white)', overflow: 'hidden', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img
                            src={getProductImageUrl(product.image_url, product.name)}
                            alt={`${product.name} research peptide${isBacWater ? '' : ' vial India'}`}
                            style={{ height: '75%', width: 'auto', objectFit: 'contain', transition: 'transform 0.6s ease' }}
                            className="group-hover:scale-105"
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
                            <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  fontSize: '0.6rem',
                                  fontWeight: 500,
                                  letterSpacing: '0.12em',
                                  textTransform: 'uppercase',
                                  color: 'var(--accent)',
                                  background: 'var(--accent-light)',
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: 9999,
                                }}
                              >
                                {badge.label}
                              </span>
                            </div>
                          )}

                          {/* Purity badge */}
                          <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
                            <span
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                                fontSize: '0.65rem', fontWeight: 500,
                                color: 'var(--accent)',
                                background: 'rgba(255,255,255,0.9)',
                                border: '1px solid var(--border)',
                                padding: '0.2rem 0.5rem',
                                borderRadius: 9999,
                                backdropFilter: 'blur(8px)',
                              }}
                            >
                              <ShieldCheck style={{ width: 10, height: 10 }} />
                              {purity}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '1.25rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          {/* Research tag */}
                          {PRODUCT_TAG[product.name] && (
                            <span
                              style={{
                                display: 'inline-block',
                                fontSize: '0.6rem',
                                fontWeight: 500,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                color: 'var(--text-light)',
                                marginBottom: '0.5rem',
                              }}
                            >
                              {RESEARCH_TAGS.find(r => r.key === PRODUCT_TAG[product.name])?.label}
                            </span>
                          )}

                          <h3
                            className="section-heading group-hover:text-[var(--accent)] transition-colors"
                            style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: 'var(--text)' }}
                          >
                            {product.name}
                          </h3>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1rem', flex: 1 }}>
                            {product.description}
                          </p>

                          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                              {startingPrice && (
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                  From <strong style={{ color: 'var(--text)', fontSize: '1rem', fontWeight: 400 }}>{format(startingPrice)}</strong>
                                </div>
                              )}
                              <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', marginTop: '0.15rem' }}>
                                {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={e => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                                padding: '0.45rem 0.9rem',
                                borderRadius: 9999,
                                border: '1px solid var(--text)',
                                background: 'var(--text)',
                                color: 'var(--white)',
                                fontSize: '0.75rem',
                                fontWeight: 400,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                flexShrink: 0,
                              }}
                              onMouseEnter={e => { (e.currentTarget.style.background = 'var(--accent)'); (e.currentTarget.style.borderColor = 'var(--accent)'); }}
                              onMouseLeave={e => { (e.currentTarget.style.background = 'var(--text)'); (e.currentTarget.style.borderColor = 'var(--text)'); }}
                            >
                              View <ArrowRight style={{ width: 12, height: 12 }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </TiltCard>
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
              <Search className="w-14 h-14 mx-auto mb-5" style={{ color: 'var(--border-strong)' }} />
            </motion.div>
            <p style={{ color: 'var(--text)', fontWeight: 500, fontSize: '1.1rem', marginBottom: '0.5rem' }}>No results found</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', maxWidth: '20rem', margin: '0 auto 0.5rem' }}>
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
          <div
            style={{
              marginTop: '3.5rem',
              background: 'var(--text)',
              borderRadius: '1.25rem',
              overflow: 'hidden',
              padding: '2.5rem',
            }}
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Sparkles style={{ width: 18, height: 18, color: '#f59e0b' }} />
                  <span className="section-eyebrow" style={{ color: '#f59e0b' }}>Bundle Deal</span>
                </div>
                <h3 className="section-heading" style={{ fontSize: '1.75rem', color: 'var(--white)', marginBottom: '0.75rem' }}>Order More of the Same. Pay Less.</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: '1.25rem', fontSize: '0.88rem' }}>
                  Buy the same peptide twice and get 10% off it. Buy three and get 20% off. Per peptide, not per cart.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <Chip size="sm" variant="flat" color="success" className="font-semibold bg-white/10 text-emerald-300">Same peptide ×2 = 10% off</Chip>
                  <Chip size="sm" variant="flat" color="success" className="font-semibold bg-white/10 text-emerald-300">Same peptide ×3 = 20% off</Chip>
                  <Chip size="sm" variant="flat" color="warning" className="font-semibold bg-white/10 text-amber-300">Auto-applied at checkout</Chip>
                </div>
              </div>
              <button
                className="btn-ghost"
                style={{ flexShrink: 0, color: 'var(--white)', borderColor: 'rgba(255,255,255,0.25)' }}
                onMouseEnter={e => { (e.currentTarget.style.borderColor = 'var(--accent)'); (e.currentTarget.style.color = 'var(--accent)'); }}
                onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'); (e.currentTarget.style.color = 'var(--white)'); }}
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                Browse the Catalogue <ArrowRight style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>
        )}

      </section>
    </div>
  );
}
