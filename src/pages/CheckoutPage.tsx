import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
} from '@heroui/react';
import { getProductImageUrl, BAC_WATER_IMAGE_URL } from '../utils/imageUrl';
import { Minus, Plus, Trash2, Check, MessageCircle, Tag, ShoppingBag, ArrowRight, LogIn, UserPlus, X, GraduationCap, Zap, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { OrderFormData } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
// import UpiQrModal from '../components/UpiQrModal'; // 💳 UPI QR — commented out, re-enable when ready

const FAST_DELIVERY_CHARGE = 800;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { format, currency } = useCurrency();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getSubtotal,
    getDiscount,
    getDiscountAmount,
    couponCode,
    applyCoupon,
    removeCoupon,
    getCouponAmount,
  } = useCart();

  const [formData, setFormData] = useState<OrderFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    disclaimer_accepted: false,
    age_confirmed: false,
    no_dosing_accepted: false,
    referral_source: '',
    referral_friend_name: '',
    delivery_option: 'normal',
  });

  const deliveryCharge = formData.delivery_option === 'fast' ? FAST_DELIVERY_CHARGE : 0;
  const grandTotal = getTotal() + deliveryCharge;

  /* ── Pre-fill from user profile if signed in ── */
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customer_name:    user.user_metadata?.name    || prev.customer_name,
        customer_email:   user.email                  || prev.customer_email,
        customer_phone:   user.user_metadata?.phone   || prev.customer_phone,
        shipping_address: user.user_metadata?.address || prev.shipping_address,
      }));
    }
  }, [user]);
  const [orderReady, setOrderReady] = useState(false);   // step 2: review screen
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [orderSent,   setOrderSent]   = useState(false); // step 3: done
  const [savedOrderId, setSavedOrderId] = useState<string | null>(null); // Supabase order ID
  // const [showQrModal, setShowQrModal] = useState(false); // 💳 UPI QR — commented out
  const orderSaving = useRef(false); // prevent double-save

  // coupon input state
  const [couponInput,  setCouponInput]  = useState('');
  const [couponStatus, setCouponStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [couponMsg,    setCouponMsg]    = useState('');

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const result = applyCoupon(couponInput);
    setCouponStatus(result.success ? 'success' : 'error');
    setCouponMsg(result.message);
    if (result.success) setCouponInput('');
  };

  /** Step 1 → 2: validate form and build WhatsApp URL, but don't open yet */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!formData.referral_source) {
      document.getElementById('referral-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const lines = cart.map(
      (item) =>
        `• ${item.product.name} (${item.variant.dosage_mg}mg) — ₹${item.variant.price_inr.toLocaleString('en-IN')} × ${item.quantity}`
    );

    const discountText =
      getDiscountAmount() > 0
        ? `\n*Subtotal:* ₹${getSubtotal().toLocaleString('en-IN')}\n*Qty Discount:* -₹${getDiscountAmount().toLocaleString('en-IN')}`
        : '';

    const couponAmt = getCouponAmount();
    const couponText = couponCode && couponAmt > 0
      ? `\n*Coupon (${couponCode}):* -₹${couponAmt.toLocaleString('en-IN')}`
      : '';

    const referralLine = formData.referral_source
      ? `\nFound us via: ${formData.referral_source}${formData.referral_source === 'Friend' && formData.referral_friend_name ? ` (referred by ${formData.referral_friend_name})` : ''}`
      : '';

    const deliveryLine = formData.delivery_option === 'fast'
      ? `\n*Delivery: Fast (1 day) — +₹${FAST_DELIVERY_CHARGE.toLocaleString('en-IN')}*`
      : `\n*Delivery: Standard (3–4 days) — Free*`;

    const message =
      `*New Order — RetraLabs.in*\n\n` +
      `*Customer*\n` +
      `Name: ${formData.customer_name}\n` +
      `Email: ${formData.customer_email}\n` +
      `Phone: ${formData.customer_phone}${referralLine}\n\n` +
      `*Shipping Address*\n${formData.shipping_address}\n\n` +
      `*Items*\n${lines.join('\n')}` +
      `${discountText}` +
      `${couponText}` +
      `${deliveryLine}\n\n` +
      `*Total: ₹${grandTotal.toLocaleString('en-IN')}*` +
      (currency.code !== 'INR' ? ` (~${format(grandTotal)})` : '') +
      `\n\nPayment via UPI preferred (INR).`;

    setWhatsappUrl(`https://wa.me/918217824384?text=${encodeURIComponent(message)}`);
    setOrderReady(true);
  };

  /** Step 2 → 3: side-effects after the <a> tag natively opens WhatsApp */
  const handleSendOnWhatsApp = async () => {
    if (orderSaving.current) return;
    orderSaving.current = true;

    // Snapshot cart before clearing (needed for Supabase insert below)
    const cartSnapshot = cart.map(item => ({ ...item }));

    // WhatsApp is opened by the native <a href> — never blocked by popup blockers.
    clearCart();
    setOrderSent(true);
    setTimeout(() => navigate('/'), 6000);

    // ── Save to Supabase in background (non-blocking) ───────────────────────
    if (isSupabaseConfigured()) {
      try {
        const { data: order, error: orderErr } = await supabase
          .from('orders')
          .insert({
            customer_name:    formData.customer_name,
            customer_email:   formData.customer_email,
            customer_phone:   formData.customer_phone,
            shipping_address: formData.shipping_address,
            total_amount:     grandTotal,
            status:           'pending',
            order_status:     'pending',
            payment_status:   'pending',
          })
          .select('id')
          .single();

        if (!orderErr && order?.id) {
          const shortId = (order.id as string).slice(0, 8).toUpperCase();
          setSavedOrderId(shortId);

          await supabase.from('order_items').insert(
            cartSnapshot.map(item => ({
              order_id:   order.id,
              product_id: item.product.id,
              variant_id: item.variant.id,
              quantity:   item.quantity,
              unit_price: item.variant.price_inr,
            }))
          );
        }
      } catch (_) {
        // Supabase save failed — WhatsApp order already sent, no user impact
      }
    }

    orderSaving.current = false;
  };

  /* 💳 UPI QR handler — commented out, re-enable when QR payment goes live
  const handleQrPaymentConfirmed = async () => {
    if (orderSaving.current) return;
    orderSaving.current = true;
    let fullOrderId: string | null = null;
    let shortId: string | null = null;
    if (isSupabaseConfigured()) {
      try {
        const { data: order, error: orderErr } = await supabase
          .from('orders')
          .insert({
            customer_name:    formData.customer_name,
            customer_email:   formData.customer_email,
            customer_phone:   formData.customer_phone,
            shipping_address: formData.shipping_address,
            total_amount:     grandTotal,
            status:           'pending',
            order_status:     'processing',
            payment_status:   'completed',
          })
          .select('id')
          .single();
        if (!orderErr && order?.id) {
          fullOrderId = order.id as string;
          shortId = fullOrderId.slice(0, 8).toUpperCase();
          setSavedOrderId(shortId);
          await supabase.from('order_items').insert(
            cart.map(item => ({
              order_id:   order.id,
              product_id: item.product.id,
              variant_id: item.variant.id,
              quantity:   item.quantity,
              unit_price: item.variant.price_inr,
            }))
          );
          const rawMsg = decodeURIComponent(whatsappUrl.split('?text=')[1] || '');
          const merchantMsg = `✅ *PAID VIA UPI QR — Order #${shortId}*\n\n` + rawMsg;
          const merchantUrl = `https://wa.me/918217824384?text=${encodeURIComponent(merchantMsg)}`;
          window.open(merchantUrl, '_blank');
        }
      } catch (_) {
        window.open(whatsappUrl, '_blank');
      }
    }
    clearCart();
    orderSaving.current = false;
    if (fullOrderId) {
      navigate(`/payment-success?orderId=${fullOrderId}`);
    } else {
      navigate('/payment-success');
    }
  };
  */

  /* ── Step 3: enquiry sent → prompt sign-in if guest ── */
  if (orderSent) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-sm mx-auto">
          {/* Success tick */}
          <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Enquiry sent!</h2>
          <p className="text-slate-500 mb-1 leading-relaxed">
            Your order details are on WhatsApp. Our team will reply with a UPI payment link within the hour.
          </p>

          {/* Order ID badge */}
          {savedOrderId && (
            <div className="mt-4 mb-2 bg-slate-900 rounded-2xl px-5 py-4 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Your Order ID</p>
              <p className="text-2xl font-black text-white tracking-widest">#{savedOrderId}</p>
              <p className="text-xs text-slate-400 mt-1">Save this to track your order</p>
            </div>
          )}

          {/* Guest: nudge to create account for tracking */}
          {!authLoading && !user && (
            <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-5 text-left">
              <p className="text-sm font-bold text-slate-900 mb-1">Track this order easily</p>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Create a free account to view order history and get faster checkout next time — no re-entering details.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/register')}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-sm transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </button>
                <button
                  onClick={() => navigate('/signin')}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold py-3 rounded-xl text-sm transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              </div>
            </div>
          )}

          <p className="text-sm text-slate-400 mt-6">
            {user ? 'Heading back home in a sec\u2026' : "Or we'll take you home in a moment."}
          </p>
        </div>
      </div>
    );
  }

  /* ── Step 2: order review + WhatsApp send ── */
  if (orderReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Ready to Send</h2>
            <p className="text-slate-500 text-sm">Your order is packed. One tap and we're on it.</p>
          </div>

          {/* Order summary card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Order Summary</p>
            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item.variant.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.product.name}</p>
                    <p className="text-xs text-slate-400">{item.variant.dosage_mg}mg · qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {format(item.variant.price_inr * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            {(getDiscount() > 0 || getCouponAmount() > 0 || deliveryCharge > 0) && (
              <div className="border-t border-slate-100 pt-3 space-y-1.5">
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Qty Discount</span>
                    <span>&minus;{format(getDiscountAmount())}</span>
                  </div>
                )}
                {couponCode && getCouponAmount() > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Coupon ({couponCode.toUpperCase()})</span>
                    <span>&minus;{format(getCouponAmount())}</span>
                  </div>
                )}
                {deliveryCharge > 0 && (
                  <div className="flex justify-between text-sm text-amber-600">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      Fast Delivery (1 day)
                    </span>
                    <span>+{format(deliveryCharge)}</span>
                  </div>
                )}
              </div>
            )}
            <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
              <span className="font-semibold text-slate-700">Total</span>
              <span className="text-xl font-black text-slate-900">{format(grandTotal)}</span>
            </div>
          </div>

          {/* Delivery info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Shipping To</p>
            <p className="text-sm font-semibold text-slate-800">{formData.customer_name}</p>
            <p className="text-sm text-slate-500">{formData.shipping_address}</p>
          </div>

          {/* How it works steps */}
          <div className="bg-slate-900 rounded-2xl p-5 mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">What happens next</p>
            <div className="space-y-2.5">
              {[
                'Tap the green button below',
                'WhatsApp opens with your order pre-filled',
                'Hit SEND — takes 2 seconds',
                'We confirm + send UPI within 1 hour',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 text-[11px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-300">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* THE button — native <a> avoids popup blockers on all browsers/iOS */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleSendOnWhatsApp}
            className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 active:bg-green-600 text-white font-bold text-lg py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-0.5"
            style={{ textDecoration: 'none' }}
          >
            <MessageCircle className="w-6 h-6" />
            Send Order on WhatsApp
          </a>

          {/* 💳 UPI QR button — commented out, re-enable when QR payment goes live
          <button
            onClick={() => setShowQrModal(true)}
            className="w-full flex items-center justify-center gap-3 bg-[#5f259f] hover:bg-[#4e1d84] active:bg-[#3d1668] text-white font-bold text-lg py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-purple-700/30 hover:shadow-purple-700/50 hover:-translate-y-0.5"
          >
            Pay via PhonePe QR
          </button>
          <UpiQrModal
            isOpen={showQrModal}
            onClose={() => setShowQrModal(false)}
            amount={grandTotal}
            onConfirm={handleQrPaymentConfirmed}
            whatsappUrl={whatsappUrl}
          />
          */}

          <button
            onClick={() => setOrderReady(false)}
            className="w-full mt-3 text-sm text-slate-400 hover:text-slate-600 transition-colors py-2"
          >
            ← Go back and edit
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page header */}
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Lock It In.</h1>
        <p className="text-slate-500 mb-8">Review your cart, fill in your details, and we'll sort the rest via WhatsApp. Old school? Yes. Works? Also yes.</p>

        {/* Payment notice */}
        <Card className="mb-4 border border-blue-200 bg-blue-50" shadow="none">
          <CardBody className="flex flex-row items-start gap-4 p-5">
            <div className="p-2 bg-blue-100 rounded-xl flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-blue-900 mb-1">One Thing Before We Ship...</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                Online payment through our website is currently unavailable. At the moment, we
                only accept <strong>UPI payments through WhatsApp</strong>.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Volume discount notice */}
        <Card className="mb-8 border border-emerald-200 bg-emerald-50" shadow="none">
          <CardBody className="flex flex-row items-start gap-4 p-5">
            <div className="p-2 bg-emerald-100 rounded-xl flex-shrink-0">
              <Tag className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-900 mb-3">Buy More of the Same, Pay Less.</h3>
              <div className="flex flex-wrap gap-2">
                <Chip color="success" variant="flat" size="sm">
                  Same peptide ×2 = 10% OFF
                </Chip>
                <Chip color="success" variant="flat" size="sm">
                  Same peptide ×3 = 20% OFF
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Empty cart state */}
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-600 mb-6 text-lg">Your cart is empty. The peptides aren't going to research themselves.</p>
            <button
              type="button"
              onClick={() => navigate('/catalogue')}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white font-bold px-8 py-3 rounded-xl transition-colors text-base"
            >
              Browse Catalogue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left column: Cart items + totals */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-5">Order Summary</h2>

              <div className="space-y-3">
                {cart.map((item) => (
                  <Card
                    key={item.variant.id}
                    shadow="none"
                    className="border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <CardBody className="flex flex-row items-center gap-4 p-4">
                      <img
                        src={getProductImageUrl(item.product.image_url, item.product.name)}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-slate-100"
                        onError={(e) => { (e.target as HTMLImageElement).src = BAC_WATER_IMAGE_URL; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{item.product.name}</p>
                        <p className="text-sm text-slate-500">
                          {item.variant.dosage_mg}mg &mdash; {format(item.variant.price_inr)}
                        </p>
                      </div>
                      {/* Quantity controls */}
                      <div className="flex items-center gap-1.5">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="bordered"
                          aria-label="Decrease quantity"
                          onPress={() => updateQuantity(item.variant.id, item.quantity - 1)}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </Button>
                        <span className="w-7 text-center text-sm font-semibold text-slate-800">
                          {item.quantity}
                        </span>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="bordered"
                          aria-label="Increase quantity"
                          onPress={() => updateQuantity(item.variant.id, item.quantity + 1)}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      {/* Remove button */}
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        aria-label="Remove item"
                        onPress={() => removeFromCart(item.variant.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardBody>
                  </Card>
                ))}
              </div>

              {/* Order totals */}
              <Card shadow="none" className="mt-5 border border-slate-200">
                <CardHeader className="px-5 pt-5 pb-0">
                  <h3 className="text-base font-semibold text-slate-800">Price Breakdown</h3>
                </CardHeader>
                <CardBody className="px-5 pb-5 pt-3 space-y-3">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium">{format(getSubtotal())}</span>
                  </div>

                  {getDiscount() > 0 && (
                    <div className="flex justify-between items-center text-emerald-600">
                      <span className="font-medium">Qty Discount</span>
                      <span className="font-semibold">
                        &minus;{format(getDiscountAmount())}
                      </span>
                    </div>
                  )}

                  {/* ── Coupon row ── */}
                  {couponCode ? (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                            <GraduationCap className="w-3 h-3" />
                            {couponCode.toUpperCase()}
                          </span>
                          <button
                            type="button"
                            onClick={() => { removeCoupon(); setCouponStatus('idle'); setCouponMsg(''); }}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                            aria-label="Remove coupon"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="font-semibold text-emerald-600">
                          &minus;{format(getCouponAmount())}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Coupon code"
                          value={couponInput}
                          onChange={(e) => { setCouponInput(e.target.value); setCouponStatus('idle'); }}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon(); } }}
                          className="flex-1 px-3 py-2 rounded-lg border-2 border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-500 transition-colors bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={!couponInput.trim()}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {couponStatus === 'error' && (
                        <p className="mt-1.5 text-xs text-red-500 font-medium">{couponMsg}</p>
                      )}
                    </div>
                  )}

                  {/* ── Delivery charge row ── */}
                  <div className="flex justify-between items-center">
                    <span className={`flex items-center gap-1.5 text-sm font-medium ${formData.delivery_option === 'fast' ? 'text-amber-600' : 'text-slate-500'}`}>
                      {formData.delivery_option === 'fast'
                        ? <><Zap className="w-3.5 h-3.5" />Fast Delivery (1 day)</>
                        : <><Clock className="w-3.5 h-3.5" />Standard Delivery (3–4 days)</>
                      }
                    </span>
                    <span className={`font-semibold text-sm ${formData.delivery_option === 'fast' ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {formData.delivery_option === 'fast' ? `+${format(FAST_DELIVERY_CHARGE)}` : 'FREE'}
                    </span>
                  </div>

                  <Divider />

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-900">Total</span>
                    <span className="text-2xl font-bold text-slate-900">
                      {format(grandTotal)}
                    </span>
                  </div>

                  {(getDiscount() > 0 || getCouponAmount() > 0) && (
                    <div className="flex items-center gap-2 pt-1">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-emerald-600 font-medium">
                        You saved {format(getDiscountAmount() + getCouponAmount())} in total
                      </span>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>

            {/* Right column: Order form */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-5">Ship It To:</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 transition-colors text-base"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 transition-colors text-base"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 transition-colors text-base"
                  />
                </div>

                {/* Shipping Address */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Shipping Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Full shipping address with PIN code"
                    value={formData.shipping_address}
                    onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 transition-colors text-base resize-none"
                  />
                </div>

                {/* ── Delivery Option ── */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Delivery Speed <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Normal delivery */}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, delivery_option: 'normal' })}
                      className={`relative flex flex-col items-start gap-1.5 p-4 rounded-xl border-2 text-left transition-all ${
                        formData.delivery_option === 'normal'
                          ? 'border-slate-900 bg-slate-900 text-white shadow-lg'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${formData.delivery_option === 'normal' ? 'text-white' : 'text-slate-500'}`} />
                        <span className="text-sm font-bold">Standard</span>
                      </div>
                      <p className={`text-xs ${formData.delivery_option === 'normal' ? 'text-slate-300' : 'text-slate-500'}`}>
                        3–4 business days
                      </p>
                      <span className={`text-base font-black ${formData.delivery_option === 'normal' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        FREE
                      </span>
                      {formData.delivery_option === 'normal' && (
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-slate-900" />
                        </div>
                      )}
                    </button>

                    {/* Fast delivery */}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, delivery_option: 'fast' })}
                      className={`relative flex flex-col items-start gap-1.5 p-4 rounded-xl border-2 text-left transition-all ${
                        formData.delivery_option === 'fast'
                          ? 'border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Zap className={`w-4 h-4 ${formData.delivery_option === 'fast' ? 'text-white' : 'text-amber-500'}`} />
                        <span className="text-sm font-bold">Fast</span>
                      </div>
                      <p className={`text-xs ${formData.delivery_option === 'fast' ? 'text-amber-100' : 'text-slate-500'}`}>
                        1 business day
                      </p>
                      <span className={`text-base font-black ${formData.delivery_option === 'fast' ? 'text-white' : 'text-amber-600'}`}>
                        +{format(FAST_DELIVERY_CHARGE)}
                      </span>
                      {formData.delivery_option === 'fast' && (
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-amber-500" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* ── How did you find us? (mandatory) ── */}
                <div id="referral-section" className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  {/* Card header */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-3.5 flex items-center gap-2.5">
                    <span className="text-base">🔍</span>
                    <p className="font-semibold text-white flex-1">How did you find us?</p>
                    <span className="text-red-400 font-bold">*</span>
                  </div>
                  {/* Card body */}
                  <div className="bg-white px-5 py-4 space-y-3">
                    <p className="text-xs text-slate-400">Required before placing your order</p>
                    <div className="flex flex-wrap gap-2">
                      {['YouTube', 'Instagram', 'Reddit', 'Friend', 'Google', 'Twitter / X', 'TikTok'].map((src) => (
                        <button
                          key={src}
                          type="button"
                          onClick={() => setFormData({ ...formData, referral_source: src, referral_friend_name: src !== 'Friend' ? '' : formData.referral_friend_name })}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                            formData.referral_source === src
                              ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {src}
                        </button>
                      ))}
                    </div>
                    {formData.referral_source === 'Friend' && (
                      <input
                        type="text"
                        placeholder="Friend's name (may qualify for an extra discount 🎉)"
                        value={formData.referral_friend_name}
                        onChange={(e) => setFormData({ ...formData, referral_friend_name: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:border-slate-900 focus:outline-none transition-colors"
                      />
                    )}
                    {!formData.referral_source && (
                      <p className="text-sm text-red-500 flex items-center gap-1.5">
                        <span>⚠</span> Please select how you found us to continue.
                      </p>
                    )}
                  </div>
                </div>

                {/* ── Compliance checkboxes ── */}
                <div className="space-y-3">
                  {/* Research use */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.disclaimer_accepted}
                        onChange={(e) => setFormData({ ...formData, disclaimer_accepted: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-slate-900 cursor-pointer flex-shrink-0"
                      />
                      <span className="text-sm text-slate-600 leading-relaxed">
                        I confirm these products are being purchased for <strong>research purposes only</strong>,
                        in accordance with applicable regulations and institutional guidelines.
                      </span>
                    </label>
                  </div>

                  {/* 18+ age */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.age_confirmed}
                        onChange={(e) => setFormData({ ...formData, age_confirmed: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-slate-900 cursor-pointer flex-shrink-0"
                      />
                      <span className="text-sm text-slate-600 leading-relaxed">
                        I confirm I am <strong>18 years of age or older</strong>.
                      </span>
                    </label>
                  </div>

                  {/* No dosing guidance */}
                  <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.no_dosing_accepted}
                        onChange={(e) => setFormData({ ...formData, no_dosing_accepted: e.target.checked })}
                        className="mt-0.5 w-4 h-4 rounded border-rose-300 accent-rose-700 cursor-pointer flex-shrink-0"
                      />
                      <span className="text-sm text-rose-800 leading-relaxed">
                        I understand that <strong>RetraLabs does not provide dosing guidance, medical advice, or usage instructions</strong> of any kind.
                        I will <strong>not</strong> request dosing information, and I take full responsibility for my research activities.
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!formData.disclaimer_accepted || !formData.age_confirmed || !formData.no_dosing_accepted}
                  className="w-full flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base py-4 rounded-xl transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Continue on WhatsApp for Payment
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
