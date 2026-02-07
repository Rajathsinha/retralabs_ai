import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ProductWithVariants, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { ChevronRight, Star, Check, Package, Truck, Shield, Thermometer, AlertTriangle } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-50 border-b border-blue-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => onNavigate('home')}
              className="text-gray-600 hover:text-gray-900"
            >
              Home
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <button
              onClick={() => onNavigate('catalogue')}
              className="text-gray-600 hover:text-gray-900"
            >
              Products
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <strong>Product Images:</strong> Images displayed are AI-generated representations or digitally enhanced for regulatory compliance and visual clarity. Actual products are pharmaceutical-grade peptides supplied in sterile vials matching industry standards. All products include Certificates of Analysis with purity verification.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain p-12"
              />
              {isFlagship && (
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                    <Star className="w-4 h-4 fill-current" />
                    FLAGSHIP
                  </span>
                </div>
              )}
              {product.name === 'Retatrutide' && (
                <div className="absolute top-6 right-6">
                  <span className="px-4 py-2 bg-yellow-400 text-gray-900 text-sm font-bold rounded-full shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              {product.category && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase">
                  {product.category}
                </span>
              )}
              {product.name === 'Retatrutide' && (
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                  Most Popular
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

            <p className="text-lg text-gray-600 mb-6">{product.description}</p>

            <div className="flex items-center gap-2 mb-8">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-xl font-bold text-gray-900">4.8+</span>
              </div>
              <span className="text-gray-600">based on 698+ reviews — Tap to see all</span>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Select Specification</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedVariant?.id === variant.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-bold text-gray-900 mb-1">
                        ₹{variant.price_inr.toLocaleString('en-IN')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {isBacWater ? `${variant.dosage_mg}ML` : `${variant.dosage_mg}mg`}
                        {variant.vial_configuration && (
                          <span className="text-xs block">*{variant.vial_configuration.split('×')[0]}Vials</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Select Quantity</h3>
                <span className="text-sm text-gray-600">1 Kit</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center text-xl font-bold"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 h-10 text-center border-2 border-gray-300 rounded-lg font-bold"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center text-xl font-bold"
                >
                  +
                </button>
              </div>

              {quantity > 1 && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
                  <Package className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-800">
                    <strong>Add 1 more kit</strong>
                    <br />
                    <span className="text-orange-600">Unlock 2+ kits at ₹{(selectedVariant?.price_inr || 0).toLocaleString('en-IN')}/kit</span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between text-2xl font-bold mb-6">
                <span className="text-gray-900">Total Price</span>
                <span className="text-blue-600">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-900 font-bold">FREE WORLDWIDE SHIPPING</span>
                </div>
                <p className="text-sm text-green-700">Premium pharmaceutical delivery</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-2">
                  <Truck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-bold text-gray-900">Express Delivery</div>
                    <div className="text-gray-600">7-14 Days</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Package className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-bold text-gray-900">Ships To</div>
                    <div className="text-gray-600">190+ Countries</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-bold text-gray-900">Customs Handled</div>
                    <div className="text-gray-600">$0 Extra Fees</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Thermometer className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-bold text-gray-900">Temperature</div>
                    <div className="text-gray-600">Controlled</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Package className="w-5 h-5" />
                Order on WhatsApp
              </button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-bold text-green-900">99.45% Purity Verified</div>
                    <div className="text-sm text-green-700">HPLC Tested</div>
                  </div>
                </div>
                <button className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1">
                  View Report
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-900">
                  <strong>FOR RESEARCH PURPOSES ONLY</strong> — This product is strictly for laboratory and research use. Not for human consumption, medical treatment, or any clinical application. By ordering, you confirm you are a qualified researcher or represent a legitimate research institution.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
