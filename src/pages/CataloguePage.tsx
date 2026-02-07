import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ProductWithVariants } from '../types';
import { ShieldCheck, Microscope } from 'lucide-react';

// Demo products for when Supabase isn't configured
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
      { id: '1b', product_id: '1', dosage_mg: 50, price_inr: 13000, in_stock: true, vial_configuration: '10mg × 5 vials', created_at: new Date().toISOString() },
      { id: '1c', product_id: '1', dosage_mg: 100, price_inr: 21000, in_stock: true, vial_configuration: '10mg × 10 vials / 20mg × 5 vials', created_at: new Date().toISOString() },
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
      { id: '2b', product_id: '2', dosage_mg: 50, price_inr: 11000, in_stock: true, vial_configuration: '10mg × 5 vials', created_at: new Date().toISOString() },
      { id: '2c', product_id: '2', dosage_mg: 100, price_inr: 18000, in_stock: true, vial_configuration: '10mg × 10 vials / 20mg × 5 vials', created_at: new Date().toISOString() },
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
      { id: '5a', product_id: '5', dosage_mg: 50, price_inr: 6000, in_stock: true, vial_configuration: '10IU × 5 vials', created_at: new Date().toISOString() },
      { id: '5b', product_id: '5', dosage_mg: 100, price_inr: 10000, in_stock: true, vial_configuration: '10IU × 10 vials', created_at: new Date().toISOString() },
      { id: '5c', product_id: '5', dosage_mg: 60, price_inr: 7000, in_stock: true, vial_configuration: '12IU × 5 vials', created_at: new Date().toISOString() },
      { id: '5d', product_id: '5', dosage_mg: 120, price_inr: 11000, in_stock: true, vial_configuration: '12IU × 10 vials', created_at: new Date().toISOString() },
      { id: '5e', product_id: '5', dosage_mg: 75, price_inr: 8000, in_stock: true, vial_configuration: '15IU × 5 vials', created_at: new Date().toISOString() },
      { id: '5f', product_id: '5', dosage_mg: 150, price_inr: 14000, in_stock: true, vial_configuration: '15IU × 10 vials', created_at: new Date().toISOString() },
      { id: '5g', product_id: '5', dosage_mg: 120, price_inr: 16000, in_stock: true, vial_configuration: '24IU × 5 vials', created_at: new Date().toISOString() },
      { id: '5h', product_id: '5', dosage_mg: 240, price_inr: 21000, in_stock: true, vial_configuration: '24IU × 10 vials', created_at: new Date().toISOString() },
    ]
  },
];

interface CataloguePageProps {
  onNavigate: (page: string, productId?: string) => void;
}

export default function CataloguePage({ onNavigate }: CataloguePageProps) {
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    // Use demo products if Supabase isn't configured
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

      // Fall back to demo products if database is empty
      if (productsWithVariants.length === 0) {
        setProducts(DEMO_PRODUCTS);
      } else {
        setProducts(productsWithVariants);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // Fall back to demo products on error
      setProducts(DEMO_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }

  const handleProductClick = (product: ProductWithVariants) => {
    onNavigate('product', product.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mb-4"></div>
          <p className="text-gray-600">Loading catalogue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-bold rounded-full">
            RESEARCH CATALOG
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Premium Peptides
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Laboratory-grade compounds for advanced research applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300 group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-cyan-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20">
                  VERIFIED
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-cyan-500 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  {product.description}
                </p>

                <div className="flex items-start gap-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Batch verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Microscope className="w-4 h-4" />
                      <span>Sterile sealed</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {product.variants.length} dosage option{product.variants.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-sm font-semibold text-cyan-500">
                      View Details →
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Research use only • Not for human consumption
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No products available at the moment.</p>
          </div>
        )}
      </section>
    </div>
  );
}
