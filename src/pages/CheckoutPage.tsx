import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { OrderFormData } from '../types';
import { Trash2, Check } from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
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

    setIsSubmitting(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          shipping_address: formData.shipping_address,
          total_amount: getTotal(),
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        variant_id: item.variant.id,
        quantity: item.quantity,
        unit_price: item.variant.price_inr,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paytm-payment/initiate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            orderId: order.id,
            amount: getTotal(),
            customerName: formData.customer_name,
            customerEmail: formData.customer_email,
            customerPhone: formData.customer_phone,
          }),
        }
      );

      const paymentData = await response.json();

      if (!response.ok) {
        throw new Error(paymentData.error || 'Failed to initiate payment');
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paymentData.paytmUrl;

      Object.keys(paymentData.paytmParams).forEach((key) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentData.paytmParams[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      clearCart();
      form.submit();
    } catch (error) {
      console.error('Error submitting order:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'An error occurred while submitting your order. Please try again.'
      );
      setIsSubmitting(false);
    }
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

              <div className="mt-6 p-4 bg-gray-50 border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">Total:</span>
                  <span className="text-2xl font-semibold text-gray-900">
                    ₹{getTotal().toLocaleString('en-IN')}
                  </span>
                </div>
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
                  className="w-full px-6 py-3 bg-blue-700 text-white font-medium hover:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
