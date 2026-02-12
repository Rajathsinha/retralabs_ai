import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getProductImageUrl, BAC_WATER_IMAGE_URL } from '../utils/imageUrl';
import { ProductWithVariants } from '../types';
import { ShieldCheck, Microscope, ArrowRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const DEMO_PRODUCTS: ProductWithVariants[] = [
  {
    id: '1',
    name: 'Retatrutide',
    description: 'Triple agonist peptide targeting GLP-1, GIP, and glucagon receptors for metabolic research.',
    category: 'research-peptide',
    image_url: '/retatrutide.jpg',
    created_at: new Date().toISOString(),
    variants: [
      { id: '1a', product_id: '1', dosage_mg: 20, price_inr: 7000, in_stock: true, vial_configuration: 'Single vial', created_at: new Date().toISOString() },
      { id: '1b', product_id: '1', dosage_mg: 50, price_inr: 13000, in_stock: true, vial_configuration: '10mg x 5 vials', created_at: new Date().toISOString() },
      { id: '1c', product_id: '1', dosage_mg: 100, price_inr: 21000, in_stock: true, vial_configuration: '10mg x 10 vials / 20mg x 5 vials', created_at: new Date().toISOString() },
    ]
  },
  {
    id: '2',
    name: 'Tirzepatide',
    description: 'Research-grade tirzepatide for analytical purposes.',
    category: 'research-peptide',
    image_url: '/tirzepatide.jpg',
    created_at: new Date().toISOString(),
    variants: [
      { id: '2a', product_id: '2', dosage_mg: 20, price_inr: 6000, in_stock: true, vial_configuration: 'Single vial', created_at: new Date().toISOString() },
      { id: '2b', product_id: '2', dosage_mg: 50, price_inr: 11000, in_stock: true, vial_configuration: '10mg x 5 vials', created_at: new Date().toISOString() },
      { id: '2c', product_id: '2', dosage_mg: 100, price_inr: 18000, in_stock: true, vial_configuration: '10mg x 10 vials / 20mg x 5 vials', created_at: new Date().toISOString() },
    ]
  },
  {
    id: '3',
    name: 'GHK-Cu',
    description: 'Copper peptide complex for skin regeneration and wound healing research applications.',
    category: 'research-peptide',
    image_url: '/ghk-cu.jpg',
    created_at: new Date().toISOString(),
    variants: [
      { id: '3a', product_id: '3', dosage_mg: 50, price_inr: 4000, in_stock: true, created_at: new Date().toISOString() },
      { id: '3b', product_id: '3', dosage_mg: 100, price_inr: 7000, in_stock: true, created_at: new Date().toISOString() },
      { id: '3c', product_id: '3', dosage_mg: 150, price_inr: 10000, in_stock: true, created_at: new Date().toISOString() },
      { id: '3d', product_id: '3', dosage_mg: 200, price_inr: 13000, in_stock: true, created_at: new Date().toISOString() },
      { id: '3e', product_id: '3', dosage_mg: 250, price_inr: 16500, in_stock: true, created_at: new Date().toISOString() },
    ]
  },
  {
    id: '4',
    name: 'IGF-1 LR3',
    description: 'Insulin-like growth factor for cellular research applications.',
    category: 'research-peptide',
    image_url: '/igf-1-lr3.jpg',
    created_at: new Date().toISOString(),
    variants: [
      { id: '4a', product_id: '4', dosage_mg: 1, price_inr: 5000, in_stock: true, created_at: new Date().toISOString() },
      { id: '4b', product_id: '4', dosage_mg: 5, price_inr: 20000, in_stock: true, created_at: new Date().toISOString() },
      { id: '4c', product_id: '4', dosage_mg: 10, price_inr: 35000, in_stock: true, created_at: new Date().toISOString() },
    ]
  },
  {
    id: '5',
    name: 'HGH 191AA',
    description: 'Human growth hormone (Somatropin) for laboratory analysis.',
    category: 'research-peptide',
    image_url: '/hgh-191aa.jpg',
    created_at: new Date().toISOString(),
    variants: [
      { id: '5a', product_id: '5', dosage_mg: 50, price_inr: 7000, in_stock: true, vial_configuration: '10IU x 5 vials', created_at: new Date().toISOString() },
      { id: '5b', product_id: '5', dosage_mg: 100, price_inr: 11000, in_stock: true, vial_configuration: '10IU x 10 vials', created_at: new Date().toISOString() },
      { id: '5g', product_id: '5', dosage_mg: 120, price_inr: 13000, in_stock: true, vial_configuration: '24IU x 5 vials', created_at: new Date().toISOString() },
      { id: '5h', product_id: '5', dosage_mg: 240, price_inr: 18000, in_stock: true, vial_configuration: '24IU x 10 vials', created_at: new Date().toISOString() },
    ]
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
    ]
  },
];

interface CataloguePageProps {
  onNavigate: (page: string, productId?: string) => void;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-6 space-y-4">
        <div className="h-7 skeleton w-3/4" />
        <div className="space-y-2">
          <div className="h-4 skeleton w-full" />
          <div className="h-4 skeleton w-2/3" />
        </div>
        <div className="pt-4 border-t border-slate-100 flex justify-between">
          <div className="h-5 skeleton w-24" />
          <div className="h-5 skeleton w-20" />
        </div>
      </div>
    </div>
  );
}

export default function CataloguePage({ onNavigate }: CataloguePageProps) {
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [loading, setLoading] = useState(true);

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

      const productOrder = ['Retatrutide', 'Tirzepatide', 'GHK-Cu', 'IGF-1 LR3', 'HGH 191AA', 'Bacteriostatic Water (Pharma Grade)'];

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

      if (productsWithVariants.length === 0) {
        setProducts(DEMO_PRODUCTS);
      } else {
        setProducts(productsWithVariants);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(DEMO_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }

  const getStartingPrice = (product: ProductWithVariants) => {
    if (product.variants.length === 0) return null;
    return Math.min(...product.variants.map(v => v.price_inr));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16 text-center">
          <ScrollReveal>
            <span className="inline-block mb-4 px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
              Research Catalog
            </span>
            <h1 className="section-heading mb-6">Premium Peptides</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Laboratory-grade compounds for advanced research applications
            </p>
          </ScrollReveal>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => {
              const startingPrice = getStartingPrice(product);
              return (
                <ScrollReveal key={product.id} delay={index * 100}>
                  <div
                    onClick={() => onNavigate('product', product.id)}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200 card-hover cursor-pointer"
                  >
                    <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                      <img
                        src={getProductImageUrl(product.image_url, product.name)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          if (product.name.toLowerCase().includes('bacteriostatic water')) {
                            (e.target as HTMLImageElement).src = BAC_WATER_IMAGE_URL;
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        VERIFIED
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2.5 flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-900">View Details</span>
                          <ArrowRight className="w-4 h-4 text-slate-600" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-brand-700 transition-colors duration-200">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-500 mb-5 leading-relaxed line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          Batch verified
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Microscope className="w-3.5 h-3.5 text-blue-500" />
                          Sterile sealed
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          {startingPrice && (
                            <div className="flex items-baseline gap-1">
                              <span className="text-xs text-slate-400 font-medium">From</span>
                              <span className="text-lg font-bold text-slate-900">
                                ₹{startingPrice.toLocaleString('en-IN')}
                              </span>
                            </div>
                          )}
                          <span className="text-xs text-slate-400">
                            {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:gap-2 transition-all duration-200">
                          Details
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>

                      <div className="mt-5 pt-5 border-t border-slate-100">
                        <p className="text-[11px] text-slate-400 text-center uppercase tracking-wider">
                          Research use only
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No products available at the moment.</p>
          </div>
        )}
      </section>
    </div>
  );
}
