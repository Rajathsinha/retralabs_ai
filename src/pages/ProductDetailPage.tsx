import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ProductWithVariants, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { ChevronRight, Star, Check, Package, Truck, Shield, Thermometer, AlertTriangle, MapPin, Phone, Minus, Plus } from 'lucide-react';
import { getViewingCount, getSoldCount } from '../utils/productMetrics';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string) => void;
}

const INDIAN_LOCATIONS = [
  // Major Cities
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
  'Jaipur', 'Lucknow', 'Surat', 'Chandigarh', 'Indore', 'Nagpur', 'Kochi', 'Coimbatore',
  'Visakhapatnam', 'Bhopal', 'Patna', 'Vadodara', 'Gurgaon', 'Noida', 'Thane', 'Navi Mumbai',

  // Tier 2 Cities & Districts
  'Agra', 'Amritsar', 'Aurangabad', 'Bareilly', 'Belgaum', 'Bhilai', 'Bhiwandi', 'Bikaner',
  'Bokaro', 'Cuttack', 'Dehradun', 'Dhanbad', 'Durgapur', 'Erode', 'Faridabad', 'Ghaziabad',
  'Guntur', 'Guwahati', 'Gwalior', 'Hubli', 'Jabalpur', 'Jamshedpur', 'Jodhpur', 'Kannur',
  'Kanpur', 'Kota', 'Kozhikode', 'Madurai', 'Mangalore', 'Meerut', 'Mysore', 'Nashik',
  'Nellore', 'Raipur', 'Rajkot', 'Ranchi', 'Salem', 'Shimla', 'Siliguri', 'Tirupati',
  'Trichy', 'Udaipur', 'Ujjain', 'Varanasi', 'Vijayawada', 'Warangal',

  // Tier 3 Cities & Towns
  'Ajmer', 'Alwar', 'Ambala', 'Anand', 'Bhavnagar', 'Bilaspur', 'Burdwan', 'Daman',
  'Gandhidham', 'Gangtok', 'Haridwar', 'Hisar', 'Jamnagar', 'Jhansi', 'Junagadh', 'Karnal',
  'Kollam', 'Kurnool', 'Mathura', 'Muzaffarpur', 'Panipat', 'Patiala', 'Pondicherry', 'Rourkela',
  'Sangli', 'Shillong', 'Sonipat', 'Thrissur', 'Tirunelveli', 'Tumkur', 'Vellore', 'Vizianagaram',

  // Districts & Smaller Cities
  'Aligarh', 'Allahabad', 'Amravati', 'Anantapur', 'Azamgarh', 'Barabanki', 'Bhagalpur', 'Bharatpur',
  'Bijapur', 'Bulandshahr', 'Chittoor', 'Cuddalore', 'Dhule', 'Dindigul', 'Etawah', 'Firozabad',
  'Gorakhpur', 'Gulbarga', 'Haldwani', 'Hassan', 'Hospet', 'Imphal', 'Jalandhar', 'Jalgaon',
  'Jorhat', 'Karimnagar', 'Khammam', 'Kolhapur', 'Korba', 'Kulti', 'Kumbakonam', 'Latur',
  'Ludhiana', 'Malegaon', 'Malerkotla', 'Mirzapur', 'Moradabad', 'Morena', 'Nanded', 'Navsari',
  'Nizamabad', 'Pali', 'Palakkad', 'Parbhani', 'Pathankot', 'Purnia', 'Raichur', 'Rajahmundry',
  'Rampur', 'Ratlam', 'Rohtak', 'Saharanpur', 'Sambalpur', 'Satara', 'Shahjahanpur', 'Shimoga',
  'Sitapur', 'Solapur', 'Srinagar', 'Sultanpur', 'Thanjavur', 'Tiruppur', 'Tonk', 'Tuticorin',

  // Villages & Rural Areas
  'Khorda', 'Balaghat', 'Balasore', 'Ballia', 'Banswara', 'Barmer', 'Basti', 'Betul', 'Bhind',
  'Churu', 'Darbhanga', 'Deoria', 'Dewas', 'Dhar', 'Dholpur', 'Dumka', 'Dungarpur', 'Ernakulam',
  'Fatehpur', 'Ganjam', 'Gaya', 'Giridih', 'Gonda', 'Hamirpur', 'Hanumangarh', 'Hathras',
  'Hazaribagh', 'Hoshangabad', 'Idukki', 'Jaintia Hills', 'Jalaun', 'Jaunpur', 'Jehanabad',
  'Jhalawar', 'Jhunjhunu', 'Kaithal', 'Kangra', 'Kanniyakumari', 'Kasaragod', 'Katni', 'Kendrapara',
  'Khammam', 'Khargone', 'Kishanganj', 'Kolar', 'Koppal', 'Koraput', 'Kottayam', 'Krishnagiri',
  'Lakhimpur', 'Lakhisarai', 'Latehar', 'Madhepura', 'Madhubani', 'Mahbubnagar', 'Mahasamund',
  'Mahendragarh', 'Mahoba', 'Mainpuri', 'Malappuram', 'Mandi', 'Mandla', 'Mandsaur', 'Mayurbhanj',
  'Medak', 'Mewat', 'Nabarangpur', 'Nagaon', 'Nagapattinam', 'Nainital', 'Nalanda', 'Nalgonda',
  'Namakkal', 'Nandurbar', 'Narsinghpur', 'Nawada', 'Nawanshahr', 'Neemuch', 'Palamu', 'Panchkula',
  'Panchmahal', 'Pauri Garhwal', 'Perambalur', 'Phek', 'Pilibhit', 'Pithoragarh', 'Porbandar',
  'Pratapgarh', 'Pudukkottai', 'Rae Bareli', 'Raisen', 'Ramanathapuram', 'Ramgarh', 'Rewa',
  'Rewari', 'Sabarkantha', 'Sagar', 'Saharsa', 'Samastipur', 'Sangrur', 'Saran', 'Sawai Madhopur',
  'Seoni', 'Shahdol', 'Shajapur', 'Sheikhpura', 'Sheopur', 'Shivpuri', 'Sikar', 'Sirsa',
  'Sivaganga', 'Solan', 'Subarnapur', 'Supaul', 'Surendranagar', 'Tehri Garhwal', 'Theni',
  'Thoothukudi', 'Tikamgarh', 'Tinsukia', 'Tiruvannamalai', 'Tiruvallur', 'Tiruvallur', 'Tonk',
  'Udalguri', 'Udhampur', 'Udupi', 'Umaria', 'Una', 'Unnao', 'Uttara Kannada', 'Valsad',
  'Viluppuram', 'Wardha', 'Wayanad', 'West Champaran', 'Yadgir', 'Yamunanagar', 'Yavatmal'
];

const SAMPLE_PRODUCTS = [
  'HGH 191AA', 'Tirzepatide', 'Retatrutide', 'IGF-1 LR3',
  'GHK-Cu', 'Bacteriostatic Water'
];

export default function ProductDetailPage({ productId, onNavigate }: ProductDetailPageProps) {
  const [product, setProduct] = useState<ProductWithVariants | null>(null);
  const [bacWater, setBacWater] = useState<ProductWithVariants | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [imageZoom, setImageZoom] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [bundleAdded, setBundleAdded] = useState(false);
  const [viewingCount, setViewingCount] = useState(Math.floor(Math.random() * 16));
  const [notificationData, setNotificationData] = useState({
    city: INDIAN_LOCATIONS[Math.floor(Math.random() * INDIAN_LOCATIONS.length)],
    product: SAMPLE_PRODUCTS[Math.floor(Math.random() * SAMPLE_PRODUCTS.length)],
    time: Math.floor(Math.random() * 10) + 1
  });
  const { addToCart } = useCart();

  useEffect(() => {
    const viewingTimer = setInterval(() => {
      setViewingCount(Math.floor(Math.random() * 16));
    }, 10000);

    return () => clearInterval(viewingTimer);
  }, []);

  useEffect(() => {
    const notificationTimer = setInterval(() => {
      setNotificationData({
        city: INDIAN_LOCATIONS[Math.floor(Math.random() * INDIAN_LOCATIONS.length)],
        product: SAMPLE_PRODUCTS[Math.floor(Math.random() * SAMPLE_PRODUCTS.length)],
        time: Math.floor(Math.random() * 10) + 1
      });
    }, 20000);

    return () => clearInterval(notificationTimer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 4000);
    }, 3000);

    const notificationCycle = setInterval(() => {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 4000);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearInterval(notificationCycle);
    };
  }, []);

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
          setBacWater({
            ...bacWaterData,
            variants: bacWaterVariants,
          });
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
      if (bacWaterVariant) {
        addToCart(bacWater, bacWaterVariant);
      }
    }

    onNavigate('checkout');
  };

  const handleAddBundle = () => {
    if (!product || !selectedVariant || !bacWater) return;
    setBundleAdded(true);
  };

  const isFlagship = product?.name === 'Retatrutide' || product?.name === 'Tirzepatide';
  const isBacWater = product?.name === 'Bacteriostatic Water (Pharma Grade)';
  const bacWaterPrice = bacWater?.variants.find(v => v.dosage_mg === 50)?.price_inr || 800;

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

  const basePrice = selectedVariant ? selectedVariant.price_inr * quantity : 0;
  const totalPrice = bundleAdded ? basePrice + bacWaterPrice : basePrice;

  return (
    <div className="min-h-screen bg-white relative">
      {showNotification && (
        <div className="fixed bottom-6 left-6 z-50 animate-slide-up">
          <div className="bg-white border-2 border-emerald-500 rounded-xl shadow-2xl p-4 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900 text-sm">Recent Order</div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Someone from {notificationData.city} purchased <span className="font-semibold">{notificationData.product}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">{notificationData.time} {notificationData.time === 1 ? 'minute' : 'minutes'} ago</div>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <div className="aspect-square relative p-8 cursor-pointer" onClick={() => setImageZoom(!imageZoom)}>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className={`w-full h-full object-contain transition-transform duration-500 ${imageZoom ? 'scale-150' : 'group-hover:scale-105'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {isFlagship && (
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5 animate-pulse">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        FLAGSHIP
                      </div>
                    </div>
                  )}
                  {product.name === 'Retatrutide' && (
                    <div className="absolute top-4 right-4">
                      <div className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-900 text-xs font-bold rounded-lg shadow-lg animate-bounce">
                        🔥 TRENDING
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-semibold text-slate-700">In Stock</span>
                      </div>
                      <span className="text-xs text-slate-600">23 units available</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Shield className="w-6 h-6 text-emerald-600" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-emerald-900 text-lg">99.45% Purity</div>
                    <div className="text-sm text-emerald-700">HPLC Verified • COA Available</div>
                  </div>
                  <button
                    onClick={() => onNavigate('support')}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm whitespace-nowrap hover:underline"
                  >
                    Contact Sales →
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="bg-white border-2 border-slate-200 rounded-xl p-3 text-center hover:border-blue-300 transition-colors">
                  <div className="text-2xl font-bold text-slate-900">24h</div>
                  <div className="text-xs text-slate-600 mt-1">Fast Ship</div>
                </div>
                <div className="bg-white border-2 border-slate-200 rounded-xl p-3 text-center hover:border-blue-300 transition-colors">
                  <div className="text-2xl font-bold text-slate-900">4.8★</div>
                  <div className="text-xs text-slate-600 mt-1">Rating</div>
                </div>
                <div className="bg-white border-2 border-slate-200 rounded-xl p-3 text-center hover:border-blue-300 transition-colors">
                  <div className="text-2xl font-bold text-slate-900">2K+</div>
                  <div className="text-xs text-slate-600 mt-1">Orders</div>
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

              <div className="bg-rose-50 border-l-4 border-rose-400 rounded-r-xl p-5 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-rose-900 leading-relaxed">
                    <strong className="font-bold">RESEARCH USE ONLY</strong> — This product is strictly for laboratory and research purposes. Not for human consumption, medical treatment, or clinical application. By ordering, you confirm you are a qualified researcher or represent a legitimate research institution.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-8">
                {viewingCount > 0 && (
                  <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-red-700">
                      {viewingCount} {viewingCount === 1 ? 'person' : 'people'} viewing now
                    </span>
                  </div>
                )}
                <div className="bg-orange-50 border border-orange-200 px-4 py-2 rounded-lg">
                  <span className="text-sm font-semibold text-orange-700">
                    {getSoldCount(product.id, product.name, product.category)} sold in last 24h
                  </span>
                </div>
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

            {!isBacWater && bacWater && (
              <div className="border-2 border-blue-200 rounded-2xl p-6 mb-6 bg-gradient-to-br from-blue-50 to-white">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Frequently Bought Together
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-slate-900 text-sm">Bacteriostatic Water</div>
                        <div className="text-xs text-slate-600 mt-0.5">50ML - Pharma Grade</div>
                        <div className="text-sm font-bold text-blue-600 mt-1">₹{bacWaterPrice.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                  bundleAdded
                    ? 'bg-emerald-100 border-2 border-emerald-500'
                    : 'bg-emerald-50 border-2 border-emerald-200'
                }`}>
                  <div>
                    <div className="text-sm text-emerald-700">Bundle Price</div>
                    <div className="text-2xl font-bold text-emerald-900">
                      ₹{(basePrice + bacWaterPrice).toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-emerald-600 mt-0.5">Save with bundle</div>
                  </div>
                  <button
                    onClick={bundleAdded ? () => setBundleAdded(false) : handleAddBundle}
                    disabled={!selectedVariant}
                    className={`px-6 py-3 font-bold rounded-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 ${
                      bundleAdded
                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {bundleAdded ? (
                      <>
                        <Check className="w-5 h-5" />
                        Bundle Added
                      </>
                    ) : (
                      'Add Bundle'
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="border-2 border-slate-900 rounded-2xl p-6 mb-6 bg-slate-900 text-white">
              <div className="flex items-baseline justify-between mb-6">
                <span className="text-lg font-medium text-slate-300">Total Amount</span>
                <span className="text-4xl font-extrabold">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>

              {bundleAdded && (
                <div className="bg-emerald-900 border-2 border-emerald-600 rounded-xl p-4 mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-300">Items Included</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        <span className="text-slate-200">{product.name} ({selectedVariant?.dosage_mg}mg)</span>
                      </div>
                      <span className="text-slate-300">₹{basePrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        <span className="text-slate-200">Bacteriostatic Water (50ML)</span>
                      </div>
                      <span className="text-slate-300">₹{bacWaterPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-5">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-bold text-blue-900 text-base">Free Shipping to India</div>
                    <div className="text-sm text-blue-700 mt-0.5">Secure delivery • 5-7 business days or sometimes within a day depends on stocks, contact support / sales for more info</div>
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
                Order Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 p-4 z-40 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-slate-600">Total Price</div>
            <div className="text-2xl font-extrabold text-slate-900">₹{totalPrice.toLocaleString('en-IN')}</div>
            {bundleAdded && (
              <div className="flex items-center gap-1 mt-1">
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-xs text-emerald-700 font-semibold">Bundle Added</span>
              </div>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant}
            className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            <Package className="w-5 h-5" />
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}
