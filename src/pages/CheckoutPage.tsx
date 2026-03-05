import { useState, useEffect } from 'react';
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
import { Minus, Plus, Trash2, Check, MessageCircle, Tag, ShoppingBag, ArrowRight, LogIn, UserPlus, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { OrderFormData } from '../types';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getSubtotal,
    getDiscount,
    getDiscountAmount,
  } = useCart();

  const [formData, setFormData] = useState<OrderFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    disclaimer_accepted: false,
  });

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
  const [orderSent, setOrderSent] = useState(false);     // step 3: done

  /** Step 1 → 2: validate form and build WhatsApp URL, but don't open yet */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const lines = cart.map(
      (item) =>
        `• ${item.product.name} (${item.variant.dosage_mg}mg) — ₹${item.variant.price_inr.toLocaleString('en-IN')} × ${item.quantity}`
    );

    const discount = getDiscount();
    const discountText =
      discount > 0
        ? `\n*Subtotal:* ₹${getSubtotal().toLocaleString('en-IN')}\n*Discount (${discount}%):* -₹${getDiscountAmount().toLocaleString('en-IN')}`
        : '';

    const message =
      `*New Order — RetraLabs.in*\n\n` +
      `*Customer*\n` +
      `Name: ${formData.customer_name}\n` +
      `Email: ${formData.customer_email}\n` +
      `Phone: ${formData.customer_phone}\n\n` +
      `*Shipping Address*\n${formData.shipping_address}\n\n` +
      `*Items*\n${lines.join('\n')}` +
      `${discountText}\n\n` +
      `*Total: ₹${getTotal().toLocaleString('en-IN')}*\n\n` +
      `Payment via UPI preferred.`;

    setWhatsappUrl(`https://wa.me/918217824384?text=${encodeURIComponent(message)}`);
    setOrderReady(true);
  };

  /** Step 2 → 3: user explicitly taps "Send on WhatsApp" */
  const handleSendOnWhatsApp = () => {
    clearCart();
    window.open(whatsappUrl, '_blank');
    setOrderSent(true);
    setTimeout(() => navigate('/'), 4000);
  };

  /* ── Auth gate: must be signed in to checkout ── */
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm mx-auto text-center">
          {/* Lock icon */}
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-200">
            <Lock className="w-9 h-9 text-slate-500" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Sign in to checkout</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            A RetraLabs account lets us keep your order history, saved address, and makes every future checkout instant.
          </p>

          {/* CTA buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/signin?returnTo=/checkout')}
              className="w-full flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
            <button
              onClick={() => navigate('/register?returnTo=/checkout')}
              className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 text-slate-800 font-semibold py-3.5 rounded-xl transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Create an Account
            </button>
          </div>

          {/* Back link */}
          <button
            onClick={() => navigate(-1)}
            className="mt-6 text-sm text-slate-400 hover:text-slate-700 transition-colors underline underline-offset-2"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  /* ── Step 3: order sent ── */
  if (orderSent) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">You're done!</h2>
          <p className="text-slate-500 mb-1 leading-relaxed">
            Your order details are on WhatsApp. Our team will reply with a UPI QR within the hour.
          </p>
          <p className="text-sm text-slate-400 mt-4">Heading back home in a sec...</p>
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
                    ₹{(item.variant.price_inr * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
              <span className="font-semibold text-slate-700">Total</span>
              <span className="text-xl font-black text-slate-900">₹{getTotal().toLocaleString('en-IN')}</span>
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

          {/* THE button */}
          <button
            onClick={handleSendOnWhatsApp}
            className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 active:bg-green-600 text-white font-bold text-lg py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-0.5"
          >
            <MessageCircle className="w-6 h-6" />
            Send Order on WhatsApp
          </button>

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
              <h3 className="text-base font-bold text-emerald-900 mb-3">The More You Order, The Less You Pay.</h3>
              <div className="flex flex-wrap gap-2">
                <Chip color="success" variant="flat" size="sm">
                  2 items = 20% OFF
                </Chip>
                <Chip color="success" variant="flat" size="sm">
                  3+ items = 25% OFF
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
                          {item.variant.dosage_mg}mg &mdash; ₹{item.variant.price_inr.toLocaleString('en-IN')}
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
                    <span className="font-medium">₹{getSubtotal().toLocaleString('en-IN')}</span>
                  </div>

                  {getDiscount() > 0 && (
                    <div className="flex justify-between items-center text-emerald-600">
                      <span className="font-medium">Discount ({getDiscount()}%)</span>
                      <span className="font-semibold">
                        &minus;₹{getDiscountAmount().toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  <Divider />

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-900">Total</span>
                    <span className="text-2xl font-bold text-slate-900">
                      ₹{getTotal().toLocaleString('en-IN')}
                    </span>
                  </div>

                  {getDiscount() > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-emerald-600 font-medium">
                        You saved ₹{getDiscountAmount().toLocaleString('en-IN')}
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

                {/* Disclaimer checkbox */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.disclaimer_accepted}
                      onChange={(e) => setFormData({ ...formData, disclaimer_accepted: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-slate-900 cursor-pointer flex-shrink-0"
                    />
                    <span className="text-sm text-slate-600 leading-relaxed">
                      I confirm that these products are being purchased for research purposes only,
                      in accordance with applicable regulations and institutional guidelines.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!formData.disclaimer_accepted}
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
