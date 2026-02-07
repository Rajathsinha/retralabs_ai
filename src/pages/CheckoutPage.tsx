import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { OrderFormData } from '../types';
import { Trash2, Check, AlertTriangle, MessageCircle, Tag } from 'lucide-react';

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

    const whatsappUrl = `https://wa.me/919137218533?text=${encodeURIComponent(message)}`;

    clearCart();
    window.open(whatsappUrl, '_blank');
    setOrderSuccess(true);
    setTimeout(() => onNavigate('home'), 3000);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Order Submitted</h2>
          <p className="text-gray-600 mb-4">
            Thank you for your order. We will contact you shortly with order
            confirmation and shipping details.
          </p>
          <p className="text-sm text-gray-500">Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-light text-gray-900 mb-8">Checkout</h1>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-4 rounded-r-xl shadow-sm">
          <div className="flex items-start gap-4">
            <MessageCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">Payment Method Notice</h3>
              <p className="text-blue-800 mb-3 leading-relaxed">
                <strong>Online payment through our website is currently unavailable.</strong> We are working to improve this feature. At the moment, we only accept <strong>UPI payments through WhatsApp</strong>.
              </p>
              <p className="text-sm text-blue-700 italic">
                We know this isn't ideal, but unfortunately there are no other payment options available at the moment. Thank you for your understanding.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 mb-8 rounded-r-xl shadow-sm">
          <div className="flex items-start gap-4">
            <Tag className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-green-900 mb-2">Volume Discounts Available</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <p className="text-green-800 font-medium">
                    Buy 2 items: Get <strong>20% OFF</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <p className="text-green-800 font-medium">
                    Buy 3+ items: Get <strong>25% OFF</strong>
                  </p>
                </div>
              </div>
              <p className="text-sm text-green-700 mt-3 italic">
                Discount automatically applied at checkout based on total quantity.
              </p>
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">Your cart is empty.</p>
            <button
              onClick={() => onNavigate('catalogue')}
              className="px-6 py-3 bg-blue-700 text-white font-medium hover:bg-blue-800 transition-colors"
            >
              Browse Catalogue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-medium text-gray-900 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.variant.id}
                    className="flex items-start justify-between p-4 border border-gray-200"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.variant.dosage_mg} mg
                      </p>
                      <p className="text-sm text-gray-900 mt-2">
                        ₹{item.variant.price_inr.toLocaleString('en-IN')} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.variant.id, item.quantity - 1)
                          }
                          className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.variant.id, item.quantity + 1)
                          }
                          className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.variant.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex justify-between items-center text-gray-700">
                  <span className="text-base">Subtotal:</span>
                  <span className="text-base font-medium">
                    ₹{getSubtotal().toLocaleString('en-IN')}
                  </span>
                </div>

                {getDiscount() > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span className="text-base font-medium">
                      Discount ({getDiscount()}%):
                    </span>
                    <span className="text-base font-semibold">
                      -₹{getDiscountAmount().toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-300 flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{getTotal().toLocaleString('en-IN')}
                  </span>
                </div>

                {getDiscount() > 0 && (
                  <div className="pt-2 text-sm text-green-600 font-medium">
                    You saved ₹{getDiscountAmount().toLocaleString('en-IN')}!
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-medium text-gray-900 mb-6">
                Shipping Information
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.customer_email}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.customer_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Address *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.shipping_address}
                    onChange={(e) =>
                      setFormData({ ...formData, shipping_address: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="disclaimer"
                    checked={formData.disclaimer_accepted}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        disclaimer_accepted: e.target.checked,
                      })
                    }
                    className="mt-1"
                  />
                  <label htmlFor="disclaimer" className="text-sm text-gray-700">
                    I confirm that these products are being purchased for research purposes
                    only, in accordance with applicable regulations and institutional
                    guidelines.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !formData.disclaimer_accepted}
                  className="w-full px-6 py-3 bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
