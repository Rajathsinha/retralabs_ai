import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Progress,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Chip,
  Accordion,
  AccordionItem,
  Divider,
  Skeleton,
} from '@heroui/react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getProductImageUrl, BAC_WATER_IMAGE_URL } from '../utils/imageUrl';
import { ProductWithVariants, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useSEO } from '../hooks/useSEO';
import {
  ChevronLeft,
  Star,
  Check,
  Package,
  Truck,
  Shield,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Phone,
  FlaskConical,
  FileCheck,
  BadgeCheck,
  MessageCircle,
  Clock,
  ShoppingCart,
  GraduationCap,
  X,
} from 'lucide-react';

// Demo products fallback (when Supabase not configured)
const DEMO_PRODUCTS: ProductWithVariants[] = [
  {
    id: '1',
    name: 'Retatrutide',
    description: 'Triple agonist peptide targeting GLP-1, GIP, and glucagon receptors for metabolic and obesity research.',
    category: 'research-peptide',
    image_url: '/Retatrutide.png',
    created_at: new Date().toISOString(),
    variants: [
      { id: '1s', product_id: '1', dosage_mg: 10, price_inr: 3500, in_stock: true, vial_configuration: 'Starter vial', created_at: new Date().toISOString() },
      { id: '1a', product_id: '1', dosage_mg: 20, price_inr: 6000, in_stock: true, vial_configuration: 'Single vial', created_at: new Date().toISOString() },
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
      { id: '2x', product_id: '2', dosage_mg: 10, price_inr: 2500, in_stock: true, vial_configuration: 'Single vial', created_at: new Date().toISOString() },
      { id: '2a', product_id: '2', dosage_mg: 20, price_inr: 4000, in_stock: true, vial_configuration: '2 vials', created_at: new Date().toISOString() },
      { id: '2b', product_id: '2', dosage_mg: 50, price_inr: 9000, in_stock: true, vial_configuration: '5 vials', created_at: new Date().toISOString() },
      { id: '2c', product_id: '2', dosage_mg: 100, price_inr: 16000, in_stock: true, vial_configuration: '10 vials', created_at: new Date().toISOString() },
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
      { id: '3a', product_id: '3', dosage_mg: 100,  price_inr: 4000,  in_stock: true, vial_configuration: '1×100mg',           created_at: new Date().toISOString() },
      { id: '3b', product_id: '3', dosage_mg: 200,  price_inr: 6000,  in_stock: true, vial_configuration: '2×100mg',           created_at: new Date().toISOString() },
      { id: '3c', product_id: '3', dosage_mg: 300,  price_inr: 8000,  in_stock: true, vial_configuration: '3×100mg',           created_at: new Date().toISOString() },
      { id: '3d', product_id: '3', dosage_mg: 500,  price_inr: 11000, in_stock: true, vial_configuration: '5×100mg',           created_at: new Date().toISOString() },
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
      { id: '10a', product_id: '10', dosage_mg: 1,  price_inr: 3000,  in_stock: true, vial_configuration: '1×1000mcg', created_at: new Date().toISOString() },
      { id: '10b', product_id: '10', dosage_mg: 2,  price_inr: 5000,  in_stock: true, vial_configuration: '2×1000mcg', created_at: new Date().toISOString() },
      { id: '10c', product_id: '10', dosage_mg: 5,  price_inr: 12000, in_stock: true, vial_configuration: '5×1000mcg', created_at: new Date().toISOString() },
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
    description: 'Pharmaceutical grade bacteriostatic water for reconstituting peptides. Sterile, 0.9% benzyl alcohol.',
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

const DEMO_BAC_WATER = DEMO_PRODUCTS.find((p) => p.name.includes('Bacteriostatic'))!;

const PURITY_MAP: Record<string, string> = {
  'Retatrutide': '99.2',
  'Tirzepatide': '99.4',
  'GHK-Cu': '99.1',
  'Semax': '99.1',
  'Selank': '99.2',
  'BPC-157': '99.3',
  'NAD+': '99.0',
  'TB-500': '99.1',
  'Tesamorelin': '99.2',
  'MOT-C': '99.0',
};

const FAQ_MAP: Record<string, { q: string; a: string }[]> = {
  'Retatrutide': [
    { q: 'What is Retatrutide?', a: 'Retatrutide (LY3437943) is a triple agonist targeting GLP-1, GIP, and glucagon receptors. It is being researched for its potential in metabolic conditions and obesity management in controlled laboratory settings.' },
    { q: 'What is included with my order?', a: 'Every order includes the peptide in a sterile lyophilised vial along with a Certificate of Analysis (COA) detailing purity, molecular weight, and HPLC testing results.' },
    { q: 'Do you ship across India?', a: 'Yes, we ship pan-India. Standard delivery is 3–4 business days (standard, free) or 1 day (fast, +₹800). All peptides are shipped with temperature-controlled packaging to maintain stability.' },
    { q: 'How do I reconstitute the peptide?', a: 'Use the Reconstitution Calculator (available in the header) to determine the exact volume of Bacteriostatic Water required for your desired concentration. Standard practice is to add BAC water slowly along the vial wall.' },
  ],
  'Tirzepatide': [
    { q: 'What is Tirzepatide?', a: 'Tirzepatide is a dual GIP/GLP-1 receptor agonist. It is supplied for in vitro research and analytical applications only.' },
    { q: 'What purity can I expect?', a: 'Our Tirzepatide is HPLC-verified at 99.4% purity. The COA with full testing data is included with every order.' },
    { q: 'Do you ship across India?', a: 'Yes, we ship pan-India. Standard delivery is 3–4 business days (standard, free) or 1 day (fast, +₹800) with temperature-controlled packaging.' },
    { q: 'Can I get a COA before ordering?', a: "Yes. Contact our support team via WhatsApp or email and we'll send you the batch COA within 24 hours." },
  ],
  'default': [
    { q: 'What purity can I expect?', a: 'All our peptides are HPLC-verified with purity exceeding 99%. A Certificate of Analysis is included with every order.' },
    { q: 'What is included with my order?', a: 'Every order includes the compound in a sterile vial along with a Certificate of Analysis (COA) detailing purity and testing results.' },
    { q: 'Do you ship across India?', a: 'Yes, we ship pan-India. Standard delivery is 3–4 business days (standard, free) or 1 day (fast, +₹800). All peptides are shipped with temperature-controlled packaging.' },
    { q: 'Can I get a COA before ordering?', a: "Yes. Contact our support team via WhatsApp or email and we'll send you the batch COA within 24 hours." },
    { q: 'What is your refund policy?', a: 'If your order arrives damaged or the product does not match the COA specifications, we offer a replacement. Contact support within 48 hours of receipt.' },
  ],
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductWithVariants | null>(null);
  const [bacWater, setBacWater] = useState<ProductWithVariants | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [bundleAdded, setBundleAdded] = useState(false);
  const { addToCart } = useCart();
  const { format } = useCurrency();

  // ── Per-product SEO ──────────────────────────────────────────────────────
  const seoPurity = product ? (PURITY_MAP[product.name] ?? '99+') : '99+';
  const lowestPrice = product ? Math.min(...product.variants.map(v => v.price_inr)) : 0;
  const seoTitle = product
    ? `Buy ${product.name} India | ${seoPurity}% Purity | ₹${lowestPrice.toLocaleString('en-IN')} | RetraLabs`
    : 'Research Peptides India | RetraLabs';
  const seoDesc = product
    ? `Buy ${product.name} in India for laboratory research. ${seoPurity}% HPLC-verified purity, Certificate of Analysis included. From ₹${lowestPrice.toLocaleString('en-IN')}. ${product.description} India-wide shipping, temperature-controlled packaging.`
    : 'Research-grade peptides for laboratory use in India. HPLC verified, COA included.';
  const seoKeywords = product
    ? `buy ${product.name.toLowerCase()} india, ${product.name.toLowerCase()} india, ${product.name.toLowerCase()} price india, ${product.name.toLowerCase()} buy online india, ${product.name.toLowerCase()} for sale india, research peptides india`
    : 'research peptides india';
  const seoImage = product ? `https://retralabs.in${product.image_url}` : 'https://retralabs.in/retatrutide.jpg';
  const seoCanonical = product ? `https://retralabs.in/product/${product.id}` : undefined;

  const productSchema = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.name} (Research Grade) India`,
    description: `${product.description} HPLC-verified ${seoPurity}% purity. For laboratory research use only.`,
    image: seoImage,
    brand: { '@type': 'Brand', name: 'RetraLabs' },
    url: seoCanonical,
    offers: product.variants.map(v => ({
      '@type': 'Offer',
      price: v.price_inr,
      priceCurrency: 'INR',
      availability: v.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: seoCanonical,
      seller: { '@type': 'Organization', name: 'RetraLabs' },
    })),
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'HPLC Purity', value: `${seoPurity}%` },
      { '@type': 'PropertyValue', name: 'COA Included', value: 'Yes' },
      { '@type': 'PropertyValue', name: 'Country of Availability', value: 'India' },
    ],
  } : null;

  useSEO({
    title: seoTitle,
    description: seoDesc,
    keywords: seoKeywords,
    canonical: seoCanonical,
    ogImage: seoImage,
    schema: productSchema ? [productSchema] : undefined,
  });
  // ────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (id) loadProduct(id);
  }, [id]);

  async function loadProduct(productId: string) {
    setLoading(true);

    // Demo fallback: if Supabase is not configured, use local DEMO_PRODUCTS
    if (!isSupabaseConfigured()) {
      const demoProduct = DEMO_PRODUCTS.find((p) => p.id === productId);
      if (demoProduct) {
        setProduct(demoProduct);
        if (demoProduct.variants.length > 0) setSelectedVariant(demoProduct.variants[0]);
        if (!demoProduct.name.toLowerCase().includes('bacteriostatic')) {
          setBacWater(DEMO_BAC_WATER);
        }
      }
      setLoading(false);
      return;
    }

    try {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (productError) throw productError;

      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId)
        .order('dosage_mg');

      if (variantsError) throw variantsError;

      const productWithVariants = { ...productData, variants: variantsData };
      setProduct(productWithVariants);
      if (variantsData.length > 0) setSelectedVariant(variantsData[0]);

      const { data: bacWaterData, error: bacWaterError } = await supabase
        .from('products')
        .select('*')
        .ilike('name', '%Bacteriostatic Water%')
        .single();

      if (!bacWaterError && bacWaterData) {
        const { data: bacWaterVariants } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', bacWaterData.id)
          .order('dosage_mg');

        if (bacWaterVariants) setBacWater({ ...bacWaterData, variants: bacWaterVariants });
      }
    } catch (error) {
      console.error('Error loading product:', error);
      // Fallback to demo on error too
      const demoProduct = DEMO_PRODUCTS.find((p) => p.id === productId);
      if (demoProduct) {
        setProduct(demoProduct);
        if (demoProduct.variants.length > 0) setSelectedVariant(demoProduct.variants[0]);
        setBacWater(DEMO_BAC_WATER);
      }
    } finally {
      setLoading(false);
    }
  }

  const [cartAdded, setCartAdded] = useState(false);

  // ── Referral popup ────────────────────────────────────────────────────────
  const [referralOpen, setReferralOpen] = useState(false);
  const [referralSource, setReferralSource] = useState('');
  const [friendName, setFriendName] = useState('');
  const [pendingWhatsAppUrl, setPendingWhatsAppUrl] = useState('');

  const REFERRAL_OPTIONS = ['Reddit', 'Google', 'Friend', 'Instagram', 'YouTube', 'Other'];

  const openWithReferral = (baseUrl: string) => {
    setPendingWhatsAppUrl(baseUrl);
    setReferralSource('');
    setFriendName('');
    setReferralOpen(true);
  };

  const submitReferral = () => {
    if (!referralSource) return;
    const referralLine = referralSource === 'Friend' && friendName
      ? `%0A%0AFound you via: Friend (referred by ${encodeURIComponent(friendName)})`
      : `%0A%0AFound you via: ${encodeURIComponent(referralSource)}`;
    const finalUrl = pendingWhatsAppUrl + referralLine;
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
    setReferralOpen(false);
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedVariant);
    }
    if (bundleAdded && bacWater) {
      const bacWaterVariant = bacWater.variants.find((v) => v.dosage_mg === 50);
      if (bacWaterVariant) addToCart(bacWater, bacWaterVariant);
    }
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  };

  const handleOrderNow = () => {
    if (!product || !selectedVariant) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedVariant);
    }
    if (bundleAdded && bacWater) {
      const bacWaterVariant = bacWater.variants.find((v) => v.dosage_mg === 50);
      if (bacWaterVariant) addToCart(bacWater, bacWaterVariant);
    }
    navigate('/checkout');
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pb-24 lg:pb-0">
        {/* Breadcrumb skeleton */}
        <div className="bg-white border-b border-slate-200 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-4 w-48 rounded-lg" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Image skeleton */}
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="w-full aspect-square rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <div className="grid grid-cols-3 gap-3">
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
                <Skeleton className="h-16 rounded-xl" />
              </div>
            </div>
            {/* Content skeleton */}
            <div className="lg:col-span-3 space-y-5">
              <div className="space-y-3">
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-12 w-3/4 rounded-xl" />
                <Skeleton className="h-5 w-full rounded-lg" />
                <Skeleton className="h-5 w-5/6 rounded-lg" />
              </div>
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-40 w-full rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <FlaskConical className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 mb-6">Product not found</p>
          <Button
            color="primary"
            variant="flat"
            onPress={() => navigate('/catalogue')}
            startContent={<ChevronLeft className="w-4 h-4" />}
          >
            Back to Catalogue
          </Button>
        </div>
      </div>
    );
  }

  // ── Derived state ─────────────────────────────────────────────────────────
  const isFlagship = product.name === 'Retatrutide' || product.name === 'Tirzepatide';
  const isBacWater = product.name?.includes('Bacteriostatic');
  const isNonDiscountable = isBacWater || product.name?.includes('GHK');
  const bacWaterPrice = bacWater?.variants.find((v) => v.dosage_mg === 50)?.price_inr || 800;
  const purity = PURITY_MAP[product.name] || '99';
  const purityNum = parseFloat(purity);
  const faqs = FAQ_MAP[product.name] || FAQ_MAP['default'];

  const basePrice = selectedVariant ? selectedVariant.price_inr * quantity : 0;
  const subtotal = bundleAdded ? basePrice + bacWaterPrice : basePrice;
  const discountPercent = isNonDiscountable ? 0 : quantity >= 3 ? 20 : quantity === 2 ? 10 : 0;
  const discountAmount = Math.round((basePrice * discountPercent) / 100);
  const totalPrice = subtotal - discountAmount;

  const whatsappMsg = encodeURIComponent(
    `Hi! I'd like to order ${product.name}${selectedVariant ? ` — ${selectedVariant.dosage_mg}${isBacWater ? 'ML' : 'mg'} (${format(selectedVariant.price_inr)})` : ''}. Can you help me complete my order?`
  );

  return (
    <>
    <div className="min-h-screen bg-slate-50 pb-24 lg:pb-0">

      {/* ── Hero / Breadcrumb ─────────────────────────────────────────────── */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <button
              onClick={() => navigate('/catalogue')}
              className="flex items-center gap-1 hover:text-white transition-colors font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Catalogue
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300 truncate">{product.name}</span>
          </div>

          {/* Product name + badges */}
          <div className="flex flex-wrap items-start gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-3">
                {product.name}
              </h1>
              <div className="flex flex-wrap gap-2">
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-emerald-900/60 text-emerald-300 border border-emerald-700"
                  startContent={<div className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />}
                >
                  In Stock
                </Chip>
                {!isBacWater && (
                  <>
                    <Chip
                      size="sm"
                      variant="flat"
                      className="bg-blue-900/60 text-blue-300 border border-blue-700"
                      startContent={<Shield className="w-3 h-3 ml-1" />}
                    >
                      COA Verified
                    </Chip>
                    <Chip
                      size="sm"
                      variant="flat"
                      className="bg-amber-900/60 text-amber-300 border border-amber-700"
                      startContent={<FlaskConical className="w-3 h-3 ml-1" />}
                    >
                      HPLC Tested
                    </Chip>
                    <Chip
                      size="sm"
                      variant="flat"
                      className="bg-slate-700/60 text-slate-300 border border-slate-600"
                      startContent={<FileCheck className="w-3 h-3 ml-1" />}
                    >
                      GMP Source
                    </Chip>
                  </>
                )}
                {isFlagship && (
                  <Chip
                    size="sm"
                    variant="flat"
                    className="bg-gradient-to-r from-amber-700/60 to-orange-700/60 text-amber-200 border border-amber-600"
                    startContent={<Star className="w-3 h-3 fill-current ml-1" />}
                  >
                    Flagship
                  </Chip>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Image disclaimer ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Product Images:</strong> Images displayed are representative. Actual products are pharmaceutical-grade peptides supplied in sterile lyophilised vials. All orders include Certificates of Analysis.
            </p>
          </div>
        </div>
      </div>

      {/* ── Main 2-col layout ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ── LEFT: Image + stats ───────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">

              {/* Product image */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="aspect-square relative p-8 bg-gradient-to-br from-slate-50 to-white">
                  <img
                    src={getProductImageUrl(product.image_url, product.name)}
                    alt={`${product.name} research peptide${isBacWater ? '' : ' vial India'}`}
                    className="w-full h-full object-contain"
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
                  {isFlagship && (
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 z-10">
                      <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                      FLAGSHIP
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl p-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-xs font-semibold text-slate-700">In Stock · Ready to Ship</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purity Progress bar */}
              {!isBacWater && (
                <Card className="border border-emerald-200 bg-emerald-50 shadow-none">
                  <CardBody className="p-4 gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="font-bold text-emerald-900 text-sm">{purity}% Purity Verified</p>
                          <p className="text-xs text-emerald-700">HPLC Tested — COA Available</p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/support')}
                        className="text-emerald-600 hover:text-emerald-700 text-xs font-semibold whitespace-nowrap"
                      >
                        Request COA
                      </button>
                    </div>
                    <Progress
                      value={purityNum}
                      color="success"
                      label="Purity"
                      showValueLabel
                      size="lg"
                      classNames={{
                        base: 'w-full',
                        label: 'text-emerald-800 font-semibold text-xs',
                        value: 'text-emerald-900 font-bold text-xs',
                        track: 'bg-emerald-200',
                        indicator: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
                      }}
                    />
                  </CardBody>
                </Card>
              )}

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: '48h', label: 'Dispatch' },
                  { value: '2K+', label: 'Orders' },
                  { value: `${purity}%`, label: 'Purity' },
                ].map((stat) => (
                  <Card key={stat.label} className="border border-slate-200 shadow-none">
                    <CardBody className="p-3 text-center gap-0">
                      <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                      <p className="text-xs text-slate-500">{stat.label}</p>
                    </CardBody>
                  </Card>
                ))}
              </div>

              {/* WhatsApp support */}
              <button
                onClick={() => openWithReferral(`https://wa.me/918217824384?text=${encodeURIComponent(`Hi! I'd like to know more about ${product.name} before ordering. Can you help?`)}`)}
                className="flex items-center gap-3 p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors w-full text-left"
              >
                <MessageCircle className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-sm">Ask on WhatsApp</p>
                  <p className="text-xs text-emerald-100">Get answers before you order</p>
                </div>
              </button>
            </div>
          </div>

          {/* ── RIGHT: Product info + ordering ───────────────────────────── */}
          <div className="lg:col-span-3 space-y-5">

            {/* Description */}
            <div>
              {product.category && (
                <Chip variant="flat" color="default" size="sm" className="mb-3 uppercase tracking-wider text-xs font-bold">
                  {product.category}
                </Chip>
              )}
              <p className="text-lg text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Research use warning */}
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-rose-800">
                  <strong>RESEARCH USE ONLY</strong> — This product is strictly for laboratory and analytical purposes. Not for human consumption. By ordering, you confirm you are a qualified researcher.
                </p>
              </div>
            </div>

            {/* ── Variant selector ─────────────────────────────────────── */}
            <Card className="border border-slate-200 shadow-none">
              <CardBody className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Package className="w-5 h-5 text-slate-600" />
                  <h3 className="text-lg font-bold text-slate-900">Choose Your Variant</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={[
                          'relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 w-full text-left',
                          isSelected
                            ? variant.is_recommended
                              ? 'border-emerald-500 bg-emerald-50 shadow-md'
                              : 'border-slate-900 bg-slate-50 shadow-sm'
                            : variant.is_recommended
                            ? 'border-emerald-300 bg-emerald-50/50 hover:border-emerald-400'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
                        ].join(' ')}
                      >
                        {variant.badge_text && (
                          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded uppercase tracking-wide shadow-lg whitespace-nowrap">
                            {variant.badge_text}
                          </div>
                        )}
                        {variant.is_recommended && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                            <Star className="w-3 h-3 text-white fill-current" />
                          </div>
                        )}
                        <p className={`font-bold text-xl mb-0.5 ${isSelected ? (variant.is_recommended ? 'text-emerald-900' : 'text-slate-900') : 'text-slate-700'}`}>
                          {format(variant.price_inr)}
                        </p>
                        <p className="text-sm text-slate-500 font-medium">
                          {isBacWater ? `${variant.dosage_mg}ML` : `${variant.dosage_mg}mg`}
                        </p>
                        {variant.vial_configuration && (
                          <p className="text-xs text-slate-400 mt-1">{variant.vial_configuration}</p>
                        )}
                        {isSelected && (
                          <div className="mt-2 flex items-center gap-1">
                            <Check className={`w-4 h-4 ${variant.is_recommended ? 'text-emerald-600' : 'text-slate-900'}`} />
                            <span className={`text-xs font-semibold ${variant.is_recommended ? 'text-emerald-700' : 'text-slate-700'}`}>Selected</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardBody>
            </Card>

            {/* ── Quantity selector ─────────────────────────────────────── */}
            <Card className="border border-slate-200 shadow-none">
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">Quantity</h3>
                  <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Per Kit</span>
                </div>
                <div className="flex items-center gap-3">
                  <ButtonGroup>
                    <Button
                      isIconOnly
                      size="lg"
                      variant="bordered"
                      onPress={() => setQuantity(Math.max(1, quantity - 1))}
                      isDisabled={quantity <= 1}
                      className="border-slate-200 text-slate-700 hover:bg-slate-50"
                      aria-label="Decrease quantity"
                    >
                      <span className="text-lg font-bold leading-none">−</span>
                    </Button>
                    <div className="flex items-center justify-center w-16 h-10 border-y border-slate-200 bg-white font-bold text-lg text-slate-900 select-none">
                      {quantity}
                    </div>
                    <Button
                      isIconOnly
                      size="lg"
                      variant="bordered"
                      onPress={() => setQuantity(quantity + 1)}
                      className="border-slate-200 text-slate-700 hover:bg-slate-50"
                      aria-label="Increase quantity"
                    >
                      <span className="text-lg font-bold leading-none">+</span>
                    </Button>
                  </ButtonGroup>
                </div>

                {quantity > 1 && !isBacWater && (
                  <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-emerald-800">
                      {discountPercent}% volume discount applied — saving {format(discountAmount)}
                    </span>
                  </div>
                )}
                {quantity === 1 && !isNonDiscountable && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span className="text-sm text-amber-800">
                      Add 1 more to get <strong>10% OFF</strong> · Add 2 more for <strong>20% OFF</strong>
                    </span>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* ── Bundle / Frequently bought together ──────────────────── */}
            {!isBacWater && bacWater && (
              <Card className="border border-slate-200 shadow-none">
                <CardBody className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BadgeCheck className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-900">Frequently Bought Together</h3>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-4">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center border border-slate-200 flex-shrink-0">
                      <Package className="w-7 h-7 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900">Bacteriostatic Water</p>
                      <p className="text-sm text-slate-500">50ML — Pharma Grade · Required for reconstitution</p>
                    </div>
                    <p className="font-bold text-slate-900 flex-shrink-0">{format(bacWaterPrice)}</p>
                  </div>
                  <Button
                    fullWidth
                    color="default"
                    variant="solid"
                    isDisabled={!selectedVariant}
                    onPress={() => setBundleAdded(!bundleAdded)}
                    startContent={bundleAdded ? <Check className="w-4 h-4" /> : null}
                    endContent={bundleAdded ? <X className="w-3.5 h-3.5 opacity-80" /> : null}
                    className={bundleAdded
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold'
                      : 'bg-slate-100 border border-slate-200 text-slate-700 font-semibold hover:bg-slate-200'}
                  >
                    {bundleAdded ? 'Bac Water Added — Remove' : 'Add Bacteriostatic Water to Bundle'}
                  </Button>
                </CardBody>
              </Card>
            )}

            {/* ── Order summary ─────────────────────────────────────────── */}
            <Card className="border border-slate-200 shadow-none">
              <CardBody className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-5">Order Summary</h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      {product.name} ({selectedVariant?.dosage_mg}{isBacWater ? 'ML' : 'mg'}) × {quantity}
                    </span>
                    <span className="font-medium text-slate-900">{format(basePrice)}</span>
                  </div>
                  {bundleAdded && (
                    <>
                      <Divider />
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Bacteriostatic Water (50ML)</span>
                        <span className="font-medium text-slate-900">{format(bacWaterPrice)}</span>
                      </div>
                    </>
                  )}
                  {discountPercent > 0 && (
                    <>
                      <Divider />
                      <div className="flex justify-between text-sm text-emerald-600">
                        <span className="font-medium">Volume Discount ({discountPercent}%)</span>
                        <span className="font-semibold">−{format(discountAmount)}</span>
                      </div>
                    </>
                  )}
                </div>

                <Divider className="my-4" />

                <div className="flex items-baseline justify-between mb-5">
                  <span className="text-slate-700 font-medium">Total</span>
                  <div className="text-right">
                    {discountPercent > 0 && (
                      <span className="text-sm text-slate-400 line-through mr-2">{format(subtotal)}</span>
                    )}
                    <span className="text-3xl font-bold text-slate-900">{format(totalPrice)}</span>
                  </div>
                </div>

                {discountPercent > 0 && (
                  <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-emerald-800">
                      You save {format(discountAmount)} with {discountPercent}% volume discount
                    </span>
                  </div>
                )}

                {/* Shipping cards */}
                <div className="space-y-3 mb-6">
                  <Card className="border border-blue-200 bg-blue-50 shadow-none">
                    <CardBody className="p-3 flex-row items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Free Shipping Across India</p>
                        <p className="text-xs text-blue-700 mt-0.5">Standard 3–4 days (free) · Fast 1-day (+₹800) · Temperature-controlled packaging</p>
                      </div>
                    </CardBody>
                  </Card>
                  <Card className="border border-slate-200 bg-slate-50 shadow-none">
                    <CardBody className="p-3 flex-row items-center gap-3">
                      <Clock className="w-5 h-5 text-slate-500 flex-shrink-0" />
                      <p className="text-sm text-slate-600">
                        <strong>Avg dispatch:</strong> 48 hours after order confirmation
                      </p>
                    </CardBody>
                  </Card>
                  <Card className="border border-slate-200 bg-slate-50 shadow-none">
                    <CardBody className="p-3 flex-row items-center gap-3">
                      <Phone className="w-5 h-5 text-slate-500 flex-shrink-0" />
                      <p className="text-sm text-slate-600">
                        <strong>International:</strong> Contact support for availability and shipping rates
                      </p>
                    </CardBody>
                  </Card>
                  <div className="flex gap-4 px-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Shield className="w-3.5 h-3.5 text-emerald-500" />
                      Temperature Controlled
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Truck className="w-3.5 h-3.5 text-emerald-500" />
                      Express Processing
                    </div>
                  </div>
                </div>

                {/* ── Student discount notice ── */}
                <button
                  onClick={() => openWithReferral(`https://wa.me/918217824384?text=${encodeURIComponent("Hi, I'm a student and would like to enquire about the student discount.")}`)}
                  className="flex items-center gap-2 w-full bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-colors rounded-xl px-4 py-2.5 group"
                >
                  <GraduationCap className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="text-xs font-semibold text-indigo-700">Student discount available</span>
                  <span className="ml-auto text-[10px] text-indigo-400 group-hover:text-indigo-600 font-medium transition-colors">Ask on WhatsApp →</span>
                </button>

                {/* ── CTAs ── */}
                {/* Order Now */}
                <button
                  disabled={!selectedVariant}
                  onClick={handleOrderNow}
                  className="w-full flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-xl transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Order Now
                </button>

                {/* Add to Cart + WhatsApp side by side */}
                <div className="flex gap-3">
                  <button
                    disabled={!selectedVariant}
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      cartAdded
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                        : 'bg-white border-slate-200 hover:border-slate-900 text-slate-800'
                    }`}
                  >
                    {cartAdded ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                    {cartAdded ? 'Added!' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => openWithReferral(`https://wa.me/918217824384?text=${whatsappMsg}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-400 text-emerald-700 font-semibold text-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </button>
                </div>
              </CardBody>
            </Card>

            {/* ── FAQ section ──────────────────────────────────────────── */}
            <Card className="border border-slate-200 shadow-none">
              <CardBody className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-5">Frequently Asked Questions</h3>
                <Accordion
                  variant="splitted"
                  selectionMode="multiple"
                  className="px-0 gap-3"
                  itemClasses={{
                    base: 'border border-slate-200 rounded-xl shadow-none bg-white',
                    title: 'font-semibold text-slate-900 text-sm',
                    content: 'text-slate-600 text-sm leading-relaxed pb-4',
                    trigger: 'px-5 py-4 hover:bg-slate-50 rounded-xl',
                    indicator: 'text-slate-400',
                  }}
                >
                  {faqs.map((faq) => (
                    <AccordionItem
                      key={faq.q}
                      aria-label={faq.q}
                      title={faq.q}
                    >
                      {faq.a}
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardBody>
            </Card>

            {/* ── Why RetraLabs ─────────────────────────────────────────── */}
            <div className="bg-slate-900 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">Why Buy from RetraLabs?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: ShieldCheck, label: 'COA with every order', color: 'text-emerald-400' },
                  { icon: FlaskConical, label: '99%+ HPLC verified purity', color: 'text-blue-400' },
                  { icon: Truck, label: 'Pan-India free shipping', color: 'text-amber-400' },
                  { icon: MessageCircle, label: 'WhatsApp support always on', color: 'text-green-400' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 text-sm text-slate-300">
                    <item.icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom bar ──────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.10)] rounded-t-2xl">
        <Card className="rounded-none rounded-t-2xl bg-white shadow-none border-none">
          <CardBody className="px-4 py-3 flex-row items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-slate-500 mb-0.5">Total</p>
              <div className="flex items-baseline gap-2">
                {discountPercent > 0 && (
                  <span className="text-xs text-slate-400 line-through">{format(subtotal)}</span>
                )}
                <span className="text-xl font-bold text-slate-900">{format(totalPrice)}</span>
              </div>
              {discountPercent > 0 && (
                <span className="text-xs text-emerald-600 font-semibold">{discountPercent}% OFF applied</span>
              )}
            </div>
            {/* Add to Cart — icon only */}
            <button
              disabled={!selectedVariant}
              onClick={handleAddToCart}
              aria-label="Add to cart"
              className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 ${
                cartAdded
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-900'
              }`}
            >
              {cartAdded ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
            </button>
            {/* Order Now */}
            <button
              disabled={!selectedVariant}
              onClick={handleOrderNow}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-700 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Order Now
            </button>
          </CardBody>
        </Card>
      </div>

    </div>

      {/* ── Referral popup ────────────────────────────────────────────────── */}
      {referralOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setReferralOpen(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Before we chat</p>
                <h3 className="text-lg font-bold text-slate-900">How did you find us? <span className="text-red-500">*</span></h3>
              </div>
              <button onClick={() => setReferralOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors mt-0.5">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {REFERRAL_OPTIONS.map(src => (
                <button
                  key={src}
                  onClick={() => setReferralSource(src)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                    referralSource === src
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {src}
                </button>
              ))}
            </div>

            {referralSource === 'Friend' && (
              <input
                type="text"
                placeholder="Friend's name (optional)"
                value={friendName}
                onChange={e => setFriendName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-slate-400"
              />
            )}

            <button
              onClick={submitReferral}
              disabled={!referralSource}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Continue to WhatsApp
            </button>
          </div>
        </div>
      )}
    </>
  );
}
