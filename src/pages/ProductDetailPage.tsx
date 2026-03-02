import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getProductImageUrl, BAC_WATER_IMAGE_URL } from '../utils/imageUrl';
import { ProductWithVariants, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { Star, Check, Package, Truck, Shield, AlertTriangle, MapPin, Phone, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button, Card, CardBody, Chip, Spinner, Breadcrumbs, BreadcrumbItem } from '@heroui/react';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string) => void;
}

export default function ProductDetailPage({ productId, onNavigate }: ProductDetailPageProps) {
  const [product, setProduct] = useState<ProductWithVariants | null>(null);
  const [bacWater, setBacWater] = useState<ProductWithVariants | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [imageZoom, setImageZoom] = useState(false);
  const [bundleAdded, setBundleAdded] = useState(false);
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

      const productWithVariants = { ...productData, variants: variantsData };
      setProduct(productWithVariants);
      if (variantsData.length > 0) setSelectedVariant(variantsData[0]);

      const { data: bacWaterData, error: bacWaterError } = await supabase
        .from('products')
        .select('*')
        .ilike('name', '%Bacteriostatic Water%')
        .single();

      if (!bacWaterError && bacWaterData) {
        const { data: bacWaterVariants, error: bacWaterVariantsError } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', bacWaterData.id)
          .order('dosage_mg');

        if (!bacWaterVariantsError && bacWaterVariants) {
          setBacWater({ ...bacWaterData, variants: bacWaterVariants });
        }
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
    if (bundleAdded && bacWater) {
      const bacWaterVariant = bacWater.variants.find(v => v.dosage_mg === 50);
      if (bacWaterVariant) addToCart(bacWater, bacWaterVariant);
    }
    onNavigate('checkout');
  };

  const isFlagship = product?.name === 'Retatrutide' || product?.name === 'Tirzepatide';
  const isBacWater = product?.name === 'Bacteriostatic Water (Pharma Grade)';
  const bacWaterPrice = bacWater?.variants.find(v => v.dosage_mg === 50)?.price_inr || 800;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" className="mb-4" />
          <p className="text-slate-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Product not found</p>
          <Button color="primary" variant="light" onPress={() => onNavigate('catalogue')}>
            Back to Catalogue
          </Button>
        </div>
      </div>
    );
  }

  const basePrice = selectedVariant ? selectedVariant.price_inr * quantity : 0;
  const subtotal = bundleAdded ? basePrice + bacWaterPrice : basePrice;
  const discountPercent = isBacWater ? 0 : quantity >= 3 ? 25 : quantity === 2 ? 20 : 0;
  const discountAmount = Math.round((basePrice * discountPercent) / 100);
  const totalPrice = subtotal - discountAmount;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 lg:pb-0">
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs size="sm">
            <BreadcrumbItem onPress={() => onNavigate('home')}>Home</BreadcrumbItem>
            <BreadcrumbItem onPress={() => onNavigate('catalogue')}>Products</BreadcrumbItem>
            <BreadcrumbItem isCurrent>{product.name}</BreadcrumbItem>
          </Breadcrumbs>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Product Images:</strong> Images displayed are AI-generated representations. Actual products are pharmaceutical-grade peptides supplied in sterile vials. All products include Certificates of Analysis.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
                <div className="aspect-square relative p-8 cursor-pointer bg-gradient-to-br from-slate-50 to-white" onClick={() => setImageZoom(!imageZoom)}>
                  <img
                    src={getProductImageUrl(product.image_url, product.name)}
                    alt={product.name}
                    className={`w-full h-full object-contain transition-transform duration-500 ${imageZoom ? 'scale-150' : 'group-hover:scale-105'}`}
                    onError={(e) => {
                      if (product.name.toLowerCase().includes('bacteriostatic water')) {
                        (e.target as HTMLImageElement).src = BAC_WATER_IMAGE_URL;
                      }
                    }}
                  />
                  {isFlagship && (
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                      FLAGSHIP
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-semibold text-slate-700">In Stock</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-bold text-emerald-900">99.45% Purity</div>
                    <div className="text-sm text-emerald-700">HPLC Verified -- COA Available</div>
                  </div>
                  <button onClick={() => onNavigate('support')} className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold whitespace-nowrap">
                    Request COA
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { value: '24h', label: 'Fast Ship' },
                  { value: '2K+', label: 'Orders' },
                  { value: '99%', label: 'Purity' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-slate-900">{stat.value}</div>
                    <div className="text-xs text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div>
              {product.category && (
                <Chip variant="flat" color="default" size="sm" className="mb-3 uppercase tracking-wider text-xs font-bold">
                  {product.category}
                </Chip>
              )}
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">{product.name}</h1>
              <p className="text-lg text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-rose-800">
                  <strong>RESEARCH USE ONLY</strong> -- This product is strictly for laboratory and research purposes. Not for human consumption. By ordering, you confirm you are a qualified researcher.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Chip color="success" variant="flat" size="sm" startContent={<div className="w-2 h-2 bg-emerald-500 rounded-full" />}>
                In Stock
              </Chip>
              <Chip color="primary" variant="flat" size="sm" startContent={<Shield className="w-3.5 h-3.5" />}>
                COA Verified
              </Chip>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-slate-600" />
                Choose Your Variant
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                      selectedVariant?.id === variant.id
                        ? variant.is_recommended
                          ? 'border-emerald-500 bg-emerald-50 shadow-md'
                          : 'border-slate-900 bg-slate-50 shadow-sm'
                        : variant.is_recommended
                        ? 'border-emerald-300 bg-emerald-50/50 hover:border-emerald-400'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {variant.badge_text && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded uppercase tracking-wide shadow-lg whitespace-nowrap">
                        {variant.badge_text}
                      </div>
                    )}
                    {variant.is_recommended && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <Star className="w-3 h-3 text-white fill-current" />
                      </div>
                    )}
                    <div className={`font-bold text-lg mb-0.5 ${
                      selectedVariant?.id === variant.id
                        ? variant.is_recommended ? 'text-emerald-900' : 'text-slate-900'
                        : 'text-slate-700'
                    }`}>
                      ₹{variant.price_inr.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-slate-500 font-medium">
                      {isBacWater ? `${variant.dosage_mg}ML` : `${variant.dosage_mg}mg`}
                    </div>
                    {variant.vial_configuration && (
                      <div className="text-xs text-slate-400 mt-1">{variant.vial_configuration}</div>
                    )}
                    {selectedVariant?.id === variant.id && (
                      <div className="mt-2 flex justify-center">
                        <Check className={`w-4 h-4 ${variant.is_recommended ? 'text-emerald-600' : 'text-slate-900'}`} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <Card shadow="none" classNames={{ base: 'border border-slate-200' }}>
              <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Quantity</h3>
                <Chip size="sm" variant="flat">Per Kit</Chip>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  isIconOnly
                  variant="bordered"
                  size="md"
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  isDisabled={quantity <= 1}
                  className="rounded-xl"
                >
                  <Minus className="w-4 h-4 text-slate-700" />
                </Button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 h-11 text-center border border-slate-200 rounded-xl font-bold text-lg focus:outline-none focus:border-slate-400"
                />
                <Button
                  isIconOnly
                  variant="bordered"
                  size="md"
                  onPress={() => setQuantity(quantity + 1)}
                  className="rounded-xl"
                >
                  <Plus className="w-4 h-4 text-slate-700" />
                </Button>
              </div>

              {quantity > 1 && !isBacWater && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-emerald-800">
                    {discountPercent}% volume discount applied -- saving ₹{discountAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {quantity === 1 && !isBacWater && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="text-sm text-amber-800">Add 1 more item to get <strong>20% OFF</strong></span>
                </div>
              )}
              </CardBody>
            </Card>

            {!isBacWater && bacWater && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Frequently Bought Together</h3>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-4">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center border border-slate-200">
                    <Package className="w-7 h-7 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">Bacteriostatic Water</div>
                    <div className="text-sm text-slate-500">50ML - Pharma Grade</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">₹{bacWaterPrice.toLocaleString('en-IN')}</div>
                  </div>
                </div>
                <Button
                  fullWidth
                  color={bundleAdded ? 'success' : 'default'}
                  variant={bundleAdded ? 'solid' : 'bordered'}
                  isDisabled={!selectedVariant}
                  onPress={() => setBundleAdded(!bundleAdded)}
                  className="font-semibold text-sm"
                >
                  {bundleAdded ? <><Check className="w-4 h-4" /> Bundle Added</> : 'Add to Bundle'}
                </Button>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-5">Order Summary</h3>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">{product.name} ({selectedVariant?.dosage_mg}{isBacWater ? 'ML' : 'mg'}) x {quantity}</span>
                  <span className="font-medium text-slate-900">₹{basePrice.toLocaleString('en-IN')}</span>
                </div>
                {bundleAdded && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Bacteriostatic Water (50ML)</span>
                    <span className="font-medium text-slate-900">₹{bacWaterPrice.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {discountPercent > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span className="font-medium">Volume Discount ({discountPercent}%)</span>
                    <span className="font-semibold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-baseline justify-between mb-6">
                <span className="text-slate-700 font-medium">Total</span>
                <div className="text-right">
                  {discountPercent > 0 && (
                    <span className="text-sm text-slate-400 line-through mr-2">₹{subtotal.toLocaleString('en-IN')}</span>
                  )}
                  <span className="text-3xl font-bold text-slate-900">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {discountPercent > 0 && (
                <div className="mb-5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-emerald-800">
                    You save ₹{discountAmount.toLocaleString('en-IN')} with {discountPercent}% volume discount
                  </span>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-blue-900">Free Shipping to India</span>
                    <p className="text-xs text-blue-700">5-7 business days -- contact support for details</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <Phone className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  <span className="text-sm text-slate-600">
                    <strong>International:</strong> Contact support for availability
                  </span>
                </div>

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

              <Button
                fullWidth
                color="primary"
                size="lg"
                isDisabled={!selectedVariant}
                onPress={handleAddToCart}
                startContent={<ShoppingCart className="w-5 h-5" />}
                className="font-bold text-lg bg-slate-900 shadow-lg hover:shadow-xl"
              >
                Order Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="text-xs text-slate-500 mb-0.5">Total</div>
            <div className="flex items-baseline gap-2">
              {discountPercent > 0 && (
                <span className="text-xs text-slate-400 line-through">₹{subtotal.toLocaleString('en-IN')}</span>
              )}
              <span className="text-xl font-bold text-slate-900">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            {discountPercent > 0 && (
              <span className="text-xs text-emerald-600 font-semibold">{discountPercent}% OFF applied</span>
            )}
          </div>
          <Button
            color="primary"
            size="lg"
            isDisabled={!selectedVariant}
            onPress={handleAddToCart}
            startContent={<ShoppingCart className="w-5 h-5" />}
            className="flex-1 font-bold bg-slate-900"
          >
            Order Now
          </Button>
        </div>
      </div>
    </div>
  );
}
