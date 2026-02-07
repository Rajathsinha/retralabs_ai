import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { OrderFormData } from '../types';
import { Trash2, Check, MessageCircle, Tag, Minus, Plus, ShoppingBag } from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotal, getSubtotal, getDiscount, getDiscountAmount } = useCart();
  const [formData, setFormData] = useState<OrderFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    disclaimer_accepted: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.disclaimer_accepted) {
      alert('Please accept the research use disclaimer to proceed.');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const orderSummary = cart
      .map(
        (item) =>
          `• ${item.product.name} (${item.variant.dosage_mg}mg) - ₹${item.variant.price_inr.toLocaleString('en-IN')} × ${item.quantity}`
      )
      .join('\n');

    const discount = getDiscount();
    const discountText = discount > 0
      ? `\n*Subtotal:* ₹${getSubtotal().toLocaleString('en-IN')}\n*Discount (${discount}%):* -₹${getDiscountAmount().toLocaleString('en-IN')}`
      : '';

    const message = `*New Order Request*

*Customer Details:*
Name: ${formData.customer_name}
Email: ${formData.customer_email}
Phone: ${formData.customer_phone}

*Shipping Address:*
${formData.shipping_address}

*Order Items:*
${orderSummary}
${discountText}
*Total Amount: ₹${getTotal().toLocaleString('en-IN')}*

I would like to complete payment via UPI.`;

    const whatsappUrl = `https://wa.me/918217824384?text=${encodeURIComponent(message)}`;

    clearCart();
    window.open(whatsappUrl, '_blank');
    setOrderSuccess(true);
    setTimeout(() => onNavigate('home'), 3000);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4 animate-scale-in">
          <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Order Submitted</h2>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Thank you for your order. We will contact you shortly with order
            confirmation and shipping details.
          </p>
          <p className="text-sm text-slate-400">Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="section-heading mb-8">Checkout</h1>

        <div className="bg-blue-50 border border-blue-200 p-6 mb-4 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-xl flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-blue-900 mb-1">Payment Method Notice</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                Online payment through our website is currently unavailable. At the moment, we only accept <strong>UPI payments through WhatsApp</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-6 mb-8 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-emerald-100 rounded-xl flex-shrink-0">
              <Tag className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-900 mb-2">Volume Discounts</h3>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-lg">
                  2 items = 20% OFF
                </span>
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-lg">
                  3+ items = 25% OFF
                </span>
              </div>
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-600 mb-6 text-lg">Your cart is empty.</p>
            <button
              onClick={() => onNavigate('catalogue')}
              className="btn-primary"
            >
              Browse Catalogue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.variant.id}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900">{item.product.name}</h3>
                      <p className="text-sm text-slate-500">
                        {item.variant.dosage_mg}mg - ₹{item.variant.price_inr.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                          className="w-8 h-8 border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5 text-slate-600" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                          className="w-8 h-8 border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 text-slate-600" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.variant.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-5 bg-white border border-slate-200 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{getSubtotal().toLocaleString('en-IN')}</span>
                </div>

                {getDiscount() > 0 && (
                  <div className="flex justify-between items-center text-emerald-600">
                    <span className="font-medium">Discount ({getDiscount()}%)</span>
                    <span className="font-semibold">-₹{getDiscountAmount().toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-lg font-semibold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-slate-900">
                    ₹{getTotal().toLocaleString('en-IN')}
                  </span>
                </div>

                {getDiscount() > 0 && (
                  <div className="flex items-center gap-2 pt-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-emerald-600 font-medium">
                      You saved ₹{getDiscountAmount().toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Shipping Information</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    className="input-field"
                    placeholder="you@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="input-field"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Shipping Address
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.shipping_address}
                    onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                    className="input-field resize-none"
                    placeholder="Full shipping address with PIN code"
                  />
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    id="disclaimer"
                    checked={formData.disclaimer_accepted}
                    onChange={(e) => setFormData({ ...formData, disclaimer_accepted: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <label htmlFor="disclaimer" className="text-sm text-slate-600 leading-relaxed">
                    I confirm that these products are being purchased for research purposes
                    only, in accordance with applicable regulations and institutional guidelines.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !formData.disclaimer_accepted}
                  className="w-full px-6 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all duration-300 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <MessageCircle className="w-5 h-5" />
                  {isSubmitting ? 'Processing...' : 'Continue on WhatsApp for Payment'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
