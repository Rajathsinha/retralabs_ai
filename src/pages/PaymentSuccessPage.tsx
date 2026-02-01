import { useEffect, useState } from 'react';
import { Check, Copy, Package, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PaymentSuccessPageProps {
  onNavigate: (page: string) => void;
}

interface OrderDetails {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  created_at: string;
  order_items: Array<{
    quantity: number;
    unit_price: number;
    product: {
      name: string;
    };
    variant: {
      dosage_mg: number;
    };
  }>;
}

export default function PaymentSuccessPage({ onNavigate }: PaymentSuccessPageProps) {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('orderId');

      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            customer_name,
            customer_email,
            total_amount,
            order_status,
            payment_status,
            created_at,
            order_items (
              quantity,
              unit_price,
              product:products (name),
              variant:product_variants (dosage_mg)
            )
          `)
          .eq('id', orderId)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setOrderDetails(data as OrderDetails);

          if (data.payment_status === 'completed' && data.order_status === 'pending') {
            await supabase
              .from('orders')
              .update({ order_status: 'paid' })
              .eq('id', orderId);
          }
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  const copyOrderId = () => {
    if (orderDetails) {
      navigator.clipboard.writeText(orderDetails.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-light text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find your order. Please check your email for order confirmation.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 bg-blue-700 text-white font-medium hover:bg-blue-800 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-green-50 border-b border-green-100 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-light text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">
              Thank you for your order, {orderDetails.customer_name}
            </p>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Your Order ID</label>
                <button
                  onClick={copyOrderId}
                  className="flex items-center gap-1 text-sm text-blue-700 hover:text-blue-800"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 font-mono text-sm">
                <Package className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-900 break-all">{orderDetails.id}</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Save this Order ID to track your shipment
              </p>
            </div>

            <div className="mb-8 p-4 bg-blue-50 border border-blue-100">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 mb-1">What's Next?</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• We're preparing your order for shipment</li>
                    <li>• You'll receive tracking information via email within 24-48 hours</li>
                    <li>• Use your Order ID to check status anytime</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                {orderDetails.order_items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div>
                      <span className="text-gray-900">{item.product.name}</span>
                      <span className="text-gray-500"> ({item.variant.dosage_mg}mg)</span>
                      <span className="text-gray-500"> × {item.quantity}</span>
                    </div>
                    <span className="text-gray-900 font-medium">
                      ₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                <span className="font-medium text-gray-900">Total Amount</span>
                <span className="text-xl font-medium text-gray-900">
                  ₹{orderDetails.total_amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate('track-order')}
                className="flex-1 px-6 py-3 bg-blue-700 text-white font-medium hover:bg-blue-800 transition-colors text-center"
              >
                Track Your Order
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-center"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Order confirmation has been sent to {orderDetails.customer_email}</p>
        </div>
      </div>
    </div>
  );
}
