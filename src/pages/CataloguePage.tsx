import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Button,
  Skeleton,
  Divider,
} from '@heroui/react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getProductImageUrl, BAC_WATER_IMAGE_URL } from '../utils/imageUrl';
import { ProductWithVariants } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useSEO } from '../hooks/useSEO';
import { ShieldCheck, FlaskConical, FileCheck, Microscope, Sparkles, ArrowRight, GraduationCap } from 'lucide-react';

const DEMO_PRODUCTS: ProductWithVariants[] = [
  {
    id: '1',
    name: 'Retatrutide',
    description: 'Triple agonist peptide targeting GLP-1, GIP, and glucagon receptors for metabolic and obesity research.',
    category: 'research-peptide',
    image_url: '/Retatrutide.png',
    created_at: new Date().toISOString(),
    variants: [
      { id: '1s', product_id: '1', dosage_mg: 10, price_inr: 4000, in_stock: true, vial_configuration: 'Starter vial', created_at: new Date().toISOString() },
      { id: '1a', product_id: '1', dosage_mg: 20, price_inr: 7000, in_stock: true, vial_configuration: 'Single vial', created_at: new Date().toISOString() },
      { id: '1b', product_id: '1', dosage_mg: 50, price_inr: 13000, in_stock: true, vial_configuration: '10mg x 5 vials', created_at: new Date().toISOString() },
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
      { id: '2a', product_id: '2', dosage_mg: 20, price_inr: 6000, in_stock: true, vial_configuration: 'Single vial', created_at: new Date().toISOString() },
      { id: '2b', product_id: '2', dosage_mg: 50, price_inr: 11000, in_stock: true, vial_configuration: '10mg x 5 vials', created_at: new Date().toISOString() },
      { id: '2c', product_id: '2', dosage_mg: 100, price_inr: 18000, in_stock: true, vial_configuration: '10mg x 10 vials / 20mg x 5 vials', created_at: new Date().toISOString() },
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
      { id: '3a', product_id: '3', dosage_mg: 10, price_inr: 2000, in_stock: true, created_at: new Date().toISOString() },
      { id: '3b', product_id: '3', dosage_mg: 20, price_inr: 3500, in_stock: true, created_at: new Date().toISOString() },
      { id: '3c', product_id: '3', dosage_mg: 50, price_inr: 7500, in_stock: true, created_at: new Date().toISOString() },
      { id: '3d', product_id: '3', dosage_mg: 100, price_inr: 13000, in_stock: true, created_at: new Date().toISOString() },
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
      { id: '4a', product_id: '4', dosage_mg: 10, price_inr: 2000, in_stock: true, created_at: new Date().toISOString() },
      { id: '4b', product_id: '4', dosage_mg: 20, price_inr: 3500, in_stock: true, created_at: new Date().toISOString() },
      { id: '4c', product_id: '4', dosage_mg: 50, price_inr: 7000, in_stock: true, created_at: new Date().toISOString() },
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
      { id: '5a', product_id: '5', dosage_mg: 10, price_inr: 2000, in_stock: true, created_at: new Date().toISOString() },
      { id: '5b', product_id: '5', dosage_mg: 20, price_inr: 3500, in_stock: true, created_at: new Date().toISOString() },
      { id: '5c', product_id: '5', dosage_mg: 50, price_inr: 7000, in_stock: true, created_at: new Date().toISOString() },
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
      { id: '7a', product_id: '7', dosage_mg: 10, price_inr: 3000, in_stock: true, created_at: new Date().toISOString() },
      { id: '7b', product_id: '7', dosage_mg: 20, price_inr: 5500, in_stock: true, created_at: new Date().toISOString() },
      { id: '7c', product_id: '7', dosage_mg: 50, price_inr: 11000, in_stock: true, created_at: new Date().toISOString() },
      { id: '7d', product_id: '7', dosage_mg: 100, price_inr: 18000, in_stock: true, created_at: new Date().toISOString() },
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
      { id: '8a', product_id: '8', dosage_mg: 10, price_inr: 4500, in_stock: true, created_at: new Date().toISOString() },
      { id: '8b', product_id: '8', dosage_mg: 20, price_inr: 8000, in_stock: true, created_at: new Date().toISOString() },
      { id: '8c', product_id: '8', dosage_mg: 50, price_inr: 17000, in_stock: true, created_at: new Date().toISOString() },
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
      { id: '9a', product_id: '9', dosage_mg: 10, price_inr: 4000, in_stock: true, created_at: new Date().toISOString() },
      { id: '9b', product_id: '9', dosage_mg: 20, price_inr: 7000, in_stock: true, created_at: new Date().toISOString() },
      { id: '9c', product_id: '9', dosage_mg: 50, price_inr: 14000, in_stock: true, created_at: new Date().toISOString() },
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
      { id: '10a', product_id: '10', dosage_mg: 10, price_inr: 5500, in_stock: true, created_at: new Date().toISOString() },
      { id: '10b', product_id: '10', dosage_mg: 20, price_inr: 10000, in_stock: true, created_at: new Date().toISOString() },
      { id: '10c', product_id: '10', dosage_mg: 50, price_inr: 22000, in_stock: true, created_at: new Date().toISOString() },
      { id: '10d', product_id: '10', dosage_mg: 100, price_inr: 38000, in_stock: true, created_at: new Date().toISOString() },
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
      { id: '11a', product_id: '11', dosage_mg: 10, price_inr: 5000, in_stock: true, created_at: new Date().toISOString() },
      { id: '11b', product_id: '11', dosage_mg: 20, price_inr: 9000, in_stock: true, created_at: new Date().toISOString() },
      { id: '11c', product_id: '11', dosage_mg: 50, price_inr: 20000, in_stock: true, created_at: new Date().toISOString() },
      { id: '11d', product_id: '11', dosage_mg: 100, price_inr: 35000, in_stock: true, created_at: new Date().toISOString() },
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
      { id: '6a', product_id: '6', dosage_mg: 10, price_inr: 400, in_stock: true, vial_configuration: '1×10ML', created_at: new Date().toISOString() },
      { id: '6b', product_id: '6', dosage_mg: 20, price_inr: 600, in_stock: true, vial_configuration: '2×10ML', created_at: new Date().toISOString() },
      { id: '6c', product_id: '6', dosage_mg: 50, price_inr: 800, in_stock: true, vial_configuration: '5×10ML', created_at: new Date().toISOString() },
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
  'Tirzepatide': { label: 'POPULAR', color: 'primary' },
  'BPC-157': { label: 'NEW', color: 'secondary' },
  'NAD+': { label: 'NEW', color: 'secondary' },
  'TB-500': { label: 'NEW', color: 'secondary' },
  'Tesamorelin': { label: 'NEW', color: 'secondary' },
  'MOT-C': { label: 'NEW', color: 'secondary' },
};

type FilterType = 'all' | 'peptide' | 'supplies';

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

export default function CataloguePage() {
  const navigate = useNavigate();
  const { format } = useCurrency();
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useSEO({
    title: 'Buy Research Peptides India | Retatrutide, Tirzepatide, GHK-Cu | RetraLabs',
    description: 'Buy research-grade Retatrutide, Tirzepatide, BPC-157, NAD+, TB-500, Tesamorelin & more in India. 99%+ HPLC purity, COA verified. From ₹2,000. India-wide shipping.',
    keywords: 'buy retatrutide india, retatrutide catalogue india, buy tirzepatide india, GHK-Cu india, research peptides india, reta india, peptide catalogue india, buy peptides online india',
    canonical: 'https://retralabs.in/catalogue',
    ogImage: 'https://retralabs.in/retatrutide.jpg',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    if (!isSupabaseConfigured()) {
      setProducts(DEMO_PRODUCTS);
      setLoading(false);
      return;
    }

    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) throw productsError;

      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select('*')
        .order('dosage_mg');

      if (variantsError) throw variantsError;

      const productOrder = ['Retatrutide', 'Tirzepatide', 'GHK-Cu', 'BPC-157', 'TB-500', 'NAD+', 'Tesamorelin', 'MOT-C', 'Semax', 'Selank', 'Bacteriostatic Water (Pharma Grade)'];

      const sortedProducts = productsData.sort((a, b) => {
        const indexA = productOrder.indexOf(a.name);
        const indexB = productOrder.indexOf(b.name);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });

      const productsWithVariants = sortedProducts.map((product) => ({
        ...product,
        variants: variantsData.filter((v) => v.product_id === product.id),
      }));

      setProducts(productsWithVariants.length > 0 ? productsWithVariants : DEMO_PRODUCTS);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(DEMO_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }

  const getStartingPrice = (product: ProductWithVariants) => {
    if (product.variants.length === 0) return null;
    return Math.min(...product.variants.map((v) => v.price_inr));
  };

  const filteredProducts = products.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'peptide') return p.category === 'research-peptide';
    if (filter === 'supplies') return p.category !== 'research-peptide';
    return true;
  });

  const peptideCount = products.filter((p) => p.category === 'research-peptide').length;
  const suppliesCount = products.filter((p) => p.category !== 'research-peptide').length;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ─── PAGE HEADER ─── */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <Chip
                size="sm"
                variant="flat"
                className="mb-4 bg-white/10 text-slate-300 uppercase tracking-wider font-bold text-[11px]"
              >
                Research Catalogue
              </Chip>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                The Real Stuff. All Verified.
              </h1>
              <p className="text-slate-400 max-w-xl leading-relaxed">
                No fake B2B listings. No counterfeit Peptide Sciences labels. No "trust me bro" sourcing. Just compounds that pass HPLC every time.
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3">
              <Chip
                startContent={<ShieldCheck className="w-3.5 h-3.5" />}
                color="success"
                variant="flat"
                className="font-semibold"
              >
                COA Included
              </Chip>
              <Chip
                startContent={<FlaskConical className="w-3.5 h-3.5" />}
                color="primary"
                variant="flat"
                className="font-semibold"
              >
                99%+ Purity
              </Chip>
              <Chip
                startContent={<FileCheck className="w-3.5 h-3.5" />}
                color="warning"
                variant="flat"
                className="font-semibold"
              >
                HPLC Verified
              </Chip>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mt-8">
            <Tabs
              size="lg"
              variant="underlined"
              selectedKey={filter}
              onSelectionChange={(key) => setFilter(key as FilterType)}
              classNames={{
                tabList: 'gap-6 border-b border-slate-700',
                cursor: 'bg-white',
                tab: 'text-slate-400 data-[selected=true]:text-white font-semibold',
                tabContent: 'group-data-[selected=true]:text-white',
              }}
            >
              <Tab key="all" title={`All (${products.length})`} />
              <Tab key="peptide" title={`Peptides (${peptideCount})`} />
              <Tab key="supplies" title={`Supplies (${suppliesCount})`} />
            </Tabs>
          </div>
        </div>
      </section>

      {/* ─── PRODUCT GRID ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const startingPrice = getStartingPrice(product);
              const purity = PURITY_MAP[product.name] || '99%+';
              const badge = BADGE_MAP[product.name];
              const isBacWater = product.name.toLowerCase().includes('bacteriostatic');

              return (
                <div
                  key={product.id}
                  className="cursor-pointer group"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                <Card
                  shadow="sm"
                  className="w-full h-full hover:shadow-lg transition-shadow duration-200"
                >
                  <CardBody className="p-0 overflow-hidden">
                    {/* Image container */}
                    <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                      <img
                        src={getProductImageUrl(product.image_url, product.name)}
                        alt={`${product.name} research peptide${isBacWater ? '' : ' vial India'}`}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          const t = e.target as HTMLImageElement;
                          const n = product.name.toLowerCase();
                          if (n.includes('retatrutide'))      t.src = '/Retatrutide.png';
                          else if (n.includes('tirzepatide')) t.src = '/TIRZEPATIDE.png';
                          else if (n.includes('ghk'))         t.src = '/GHKCU.png';
                          else if (n.includes('semax'))       t.src = '/SEMAX.png';
                          else if (n.includes('selank'))      t.src = '/SELANK.png';
                          else if (n.includes('bpc'))         t.src = '/BPC.png';
                          else if (n.includes('nad'))         t.src = '/NAD+.png';
                          else if (n.includes('tb-500') || n.includes('tb500')) t.src = '/TB500.png';
                          else if (n.includes('tesamorelin')) t.src = '/Tesa.png';
                          else if (n.includes('mot'))         t.src = '/motc.png';
                          else                                t.src = BAC_WATER_IMAGE_URL;
                        }}
                      />

                      {/* Top-left: BESTSELLER / POPULAR / PREMIUM badge */}
                      {badge && (
                        <div className="absolute top-3 left-3 z-10">
                          <Chip
                            size="sm"
                            color={badge.color}
                            variant="solid"
                            className="font-bold text-[11px] shadow-md"
                          >
                            {badge.label}
                          </Chip>
                        </div>
                      )}

                      {/* Top-right: purity badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <Chip
                          size="sm"
                          color="success"
                          variant="flat"
                          startContent={<ShieldCheck className="w-3 h-3" />}
                          className="font-bold bg-white/90 backdrop-blur-sm shadow-sm"
                        >
                          {purity}
                        </Chip>
                      </div>

                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Card content */}
                    <div className="px-5 pt-4 pb-2">
                      <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-primary-600 transition-colors duration-200">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3">
                        {product.description}
                      </p>

                      {/* Feature tag chips */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <Chip size="sm" variant="flat" color="success" className="text-[11px] font-medium">
                          <ShieldCheck className="w-3 h-3 mr-1 inline" />
                          Lab verified
                        </Chip>
                        <Chip size="sm" variant="flat" color="primary" className="text-[11px] font-medium">
                          <Microscope className="w-3 h-3 mr-1 inline" />
                          HPLC tested
                        </Chip>
                        {!isBacWater && (
                          <Chip size="sm" variant="flat" color="warning" className="text-[11px] font-medium">
                            <FileCheck className="w-3 h-3 mr-1 inline" />
                            COA included
                          </Chip>
                        )}
                      </div>

                      <Divider className="my-2" />
                    </div>
                  </CardBody>

                  <CardFooter className="px-5 pb-4 pt-2 flex items-center justify-between gap-3">
                    <div>
                      {startingPrice && (
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-slate-400 font-medium">From</span>
                          <span className="text-xl font-bold text-slate-900">
                            {format(startingPrice)}
                          </span>
                        </div>
                      )}
                      <span className="text-xs text-slate-400">
                        {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''} available
                      </span>
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-indigo-500">
                        <GraduationCap className="w-3 h-3" />
                        Student discount available
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 active:bg-slate-800 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
                    >
                      Order <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </CardFooter>
                </Card>
                </div>
              );
            })}
          </div>
        ) : (
          /* ─── EMPTY STATE ─── */
          <div className="text-center py-20">
            <FlaskConical className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium mb-4">No products match the selected filter.</p>
            <Button
              variant="light"
              color="primary"
              onPress={() => setFilter('all')}
              className="font-semibold"
            >
              Show all products
            </Button>
          </div>
        )}

        {/* ─── BUNDLE DEAL PANEL ─── */}
        {!loading && (
          <Card
            shadow="none"
            className="mt-14 bg-gradient-to-br from-slate-900 to-slate-800 border-0 overflow-hidden"
          >
            <CardBody className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-400 text-sm font-bold uppercase tracking-wider">Bundle Deal</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Stack More. Pay Less. Simple Math.
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-5">
                    Order 2 peptides and take 20% off. Order 3 or more and take 25% off. Because loyalty should come with a discount, not a loyalty card.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Chip size="sm" variant="flat" color="success" className="font-semibold bg-white/10 text-emerald-300">
                      20% off 2 items
                    </Chip>
                    <Chip size="sm" variant="flat" color="success" className="font-semibold bg-white/10 text-emerald-300">
                      25% off 3+ items
                    </Chip>
                    <Chip size="sm" variant="flat" color="warning" className="font-semibold bg-white/10 text-amber-300">
                      Auto-applied at checkout
                    </Chip>
                  </div>
                </div>
                <Button
                  size="lg"
                  variant="solid"
                  className="shrink-0 bg-white text-slate-900 font-bold shadow-lg hover:bg-slate-100"
                  endContent={<ArrowRight className="w-4 h-4" />}
                  onPress={() => navigate('/catalogue')}
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
