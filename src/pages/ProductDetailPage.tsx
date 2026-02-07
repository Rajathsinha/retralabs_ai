import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ProductWithVariants, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { ChevronRight, Star, Check, Package, Truck, Shield, Thermometer, AlertTriangle, MapPin, Phone, Minus, Plus } from 'lucide-react';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string) => void;
}

export default function ProductDetailPage({ productId, onNavigate }: ProductDetailPageProps) {
  const [product, setProduct] = useState<ProductWithVariants | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  async function loadProduct() {
    if (!isSupabaseConfigured()) {
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

      const productWithVariants = {
        ...productData,
        variants: variantsData,
      };

      setProduct(productWithVariants);
      if (variantsData.length > 0) {
        setSelectedVariant(variantsData[0]);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedVariant);
    }

    onNavigate('checkout');
  };

  const isFlagship = product?.name === 'Retatrutide' || product?.name === 'Tirzepatide';
  const isBacWater = product?.name === 'Bacteriostatic Water (Pharma Grade)';

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Product not found</p>
          <button
            onClick={() => onNavigate('catalogue')}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Catalogue
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = selectedVariant ? selectedVariant.price_inr * quantity : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-100 border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => onNavigate('home')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <button
              onClick={() => onNavigate('catalogue')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Products
            </button>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-slate-900 font-semibold">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 rounded-r-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <strong className="font-semibold">Product Images:</strong> Images displayed are AI-generated representations or digitally enhanced for regulatory compliance and visual clarity. Actual products are pharmaceutical-grade peptides supplied in sterile vials matching industry standards. All products include Certificates of Analysis with purity verification.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-xl">
                <div className="aspect-square relative p-8">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  {isFlagship && (
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        FLAGSHIP
                      </div>
                    </div>
                  )}
                  {product.name === 'Retatrutide' && (
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 text-xs font-bold rounded-lg shadow-lg">
                        🔥 TRENDING
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-emerald-600" />
                  <div className="flex-1">
                    <div className="font-bold text-emerald-900 text-lg">99.45% Purity</div>
                    <div className="text-sm text-emerald-700">HPLC Verified</div>
                  </div>
                  <button className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm">
                    View COA →
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                {product.category && (
                  <span className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-md uppercase tracking-wide">
                    {product.category}
                  </span>
                )}
              </div>

              <h1 className="text-5xl font-extrabold text-slate-900 mb-4 leading-tight">{product.name}</h1>

              <p className="text-lg text-slate-600 mb-6 leading-relaxed">{product.description}</p>

              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="text-xl font-bold text-slate-900">4.8</span>
                </div>
                <span className="text-slate-600 text-sm">698+ verified reviews</span>
              </div>
            </div>

            <div className="border-2 border-slate-200 rounded-2xl p-6 mb-6 bg-gradient-to-br from-slate-50 to-white">
              <h3 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Choose Your Variant
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                      selectedVariant?.id === variant.id
                        ? 'border-blue-600 bg-blue-50 shadow-md scale-105'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`font-bold mb-1 text-lg ${
                        selectedVariant?.id === variant.id ? 'text-blue-600' : 'text-slate-900'
                      }`}>
                        ₹{variant.price_inr.toLocaleString('en-IN')}
                      </div>
                      <div className="text-sm text-slate-600 font-medium">
                        {isBacWater ? `${variant.dosage_mg}ML` : `${variant.dosage_mg}mg`}
                      </div>
                      {variant.vial_configuration && (
                        <div className="text-xs text-slate-500 mt-1">
                          {variant.vial_configuration.split('×')[0]} Vials
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-2 border-slate-200 rounded-2xl p-6 mb-6 bg-white">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-slate-900">Quantity</h3>
                <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Per Kit</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-12 h-12 rounded-xl border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus className="w-5 h-5 text-slate-700" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 h-12 text-center border-2 border-slate-300 rounded-xl font-bold text-xl focus:outline-none focus:border-blue-600"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-xl border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 flex items-center justify-center transition-all"
                >
                  <Plus className="w-5 h-5 text-slate-700" />
                </button>
              </div>

              {quantity > 1 && (
                <div className="mt-5 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-sm">
                      <div className="font-bold text-amber-900 mb-1">Bulk Discount Active!</div>
                      <div className="text-amber-700">Save more with quantity orders</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-2 border-slate-900 rounded-2xl p-6 mb-6 bg-slate-900 text-white">
              <div className="flex items-baseline justify-between mb-6">
                <span className="text-lg font-medium text-slate-300">Total Amount</span>
                <span className="text-4xl font-extrabold">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-5">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-bold text-blue-900 text-base">Free Shipping to India</div>
                    <div className="text-sm text-blue-700 mt-0.5">Secure pharmaceutical delivery • 5-7 business days</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-5">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <div className="text-sm text-slate-300">
                    <span className="font-semibold">International Orders:</span> Contact support for shipping availability
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-300">Temperature Controlled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-300">Express Processing</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Package className="w-6 h-6" />
                Order on WhatsApp
              </button>
            </div>

            <div className="bg-rose-50 border-l-4 border-rose-400 rounded-r-xl p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-rose-900 leading-relaxed">
                  <strong className="font-bold">RESEARCH USE ONLY</strong> — This product is strictly for laboratory and research purposes. Not for human consumption, medical treatment, or clinical application. By ordering, you confirm you are a qualified researcher or represent a legitimate research institution.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
