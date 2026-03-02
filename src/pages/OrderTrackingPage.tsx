import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, MapPin, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getProductImageUrl, BAC_WATER_IMAGE_URL } from '../utils/imageUrl';
import { Button, Card, CardBody, Input, Chip } from '@heroui/react';

interface OrderTrackingPageProps {
  onNavigate: (page: string) => void;
}

interface OrderTrackingDetails {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  tracking_number: string | null;
  created_at: string;
  payment_completed_at: string | null;
  order_items: Array<{
    quantity: number;
    unit_price: number;
    product: {
      name: string;
      image_url: string;
    };
    variant: {
      dosage_mg: number;
    };
  }>;
}

export default function OrderTrackingPage({ onNavigate }: OrderTrackingPageProps) {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderTrackingDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setOrderDetails(null);

    try {
      const { data: orderData, error: orderError } = await supabase
        .rpc('get_order_by_id_and_email', {
          order_uuid: orderId.trim(),
          customer_email_param: email.trim().toLowerCase()
        });

      if (orderError) throw orderError;

      if (!orderData || orderData.length === 0) {
        setError('Order not found. Please check your Order ID and email address.');
        return;
      }

      const order = orderData[0];

      const { data: itemsData, error: itemsError } = await supabase
        .rpc('get_order_items_by_order_and_email', {
          order_uuid: orderId.trim(),
          customer_email_param: email.trim().toLowerCase()
        });

      if (itemsError) throw itemsError;

      const enrichedItems = await Promise.all(
        (itemsData || []).map(async (item: any) => {
          const { data: product } = await supabase
            .from('products')
            .select('name, image_url')
            .eq('id', item.product_id)
            .single();

          const { data: variant } = await supabase
            .from('product_variants')
            .select('dosage_mg')
            .eq('id', item.variant_id)
            .single();

          return {
            ...item,
            product: product || { name: 'Unknown Product', image_url: '' },
            variant: variant || { dosage_mg: 0 }
          };
        })
      );

      setOrderDetails({
        ...order,
        order_items: enrichedItems
      } as OrderTrackingDetails);
    } catch (err) {
      console.error('Error tracking order:', err);
      setError('Failed to retrieve order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Payment Pending';
      case 'paid':
        return 'Payment Received';
      case 'processing':
        return 'Processing Order';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const orderSteps = [
    { id: 'paid', label: 'Payment Received', icon: CheckCircle },
    { id: 'processing', label: 'Processing', icon: Package },
    { id: 'shipped', label: 'Shipped', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: MapPin },
  ];

  const getStepStatus = (stepId: string, currentStatus: string) => {
    const statusOrder = ['pending', 'paid', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepId);

    if (currentStatus === 'cancelled') return 'cancelled';
    if (stepIndex <= currentIndex) return 'completed';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-8 h-8 text-blue-700" />
            <h1 className="text-3xl font-light text-gray-900">Track Your Order</h1>
          </div>

          <form onSubmit={trackOrder} className="max-w-2xl">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <Input
                type="text"
                label="Order ID"
                value={orderId}
                onValueChange={setOrderId}
                placeholder="Enter your order ID"
                variant="bordered"
                isRequired
              />
              <Input
                type="email"
                label="Email Address"
                value={email}
                onValueChange={setEmail}
                placeholder="Enter your email"
                variant="bordered"
                isRequired
              />
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm">
                <p className="text-red-700 mb-2">{error}</p>
                <p className="text-red-600 mb-3">Please contact Support for assistance.</p>
                <Button
                  as="a"
                  href="https://wa.me/918217824384?text=Hello%2C%20I%20need%20help%20tracking%20my%20order%20on%20RetraLabs"
                  target="_blank"
                  color="success"
                  size="sm"
                  startContent={<MessageSquare className="w-4 h-4" />}
                  className="font-semibold"
                >
                  Chat on WhatsApp
                </Button>
              </div>
            )}

            <Button
              type="submit"
              color="primary"
              isDisabled={loading}
              isLoading={loading}
              startContent={!loading && <Search className="w-5 h-5" />}
              className="font-medium"
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </Button>
          </form>
        </div>
      </div>

      {orderDetails && (
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-medium text-gray-900 mb-1">Order Status</h2>
                    <p className="text-sm text-gray-500">
                      Order placed on {new Date(orderDetails.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <Chip variant="flat" className={getStatusColor(orderDetails.order_status)}>
                    {getStatusText(orderDetails.order_status)}
                  </Chip>
                </div>

                {orderDetails.order_status !== 'cancelled' && orderDetails.order_status !== 'pending' && (
                  <div className="relative">
                    <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200" />
                    <div className="relative flex justify-between">
                      {orderSteps.map((step, index) => {
                        const stepStatus = getStepStatus(step.id, orderDetails.order_status);
                        const Icon = step.icon;
                        return (
                          <div key={step.id} className="flex flex-col items-center">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                                stepStatus === 'completed'
                                  ? 'bg-blue-700 text-white'
                                  : stepStatus === 'pending'
                                  ? 'bg-gray-100 text-gray-400'
                                  : 'bg-red-100 text-red-500'
                              } relative z-10`}
                            >
                              <Icon className="w-6 h-6" />
                            </div>
                            <span className={`text-xs text-center font-medium max-w-[80px] ${
                              stepStatus === 'completed' ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {orderDetails.tracking_number && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="w-5 h-5 text-blue-700" />
                      <span className="font-medium text-blue-900">Tracking Number</span>
                    </div>
                    <p className="text-blue-800 font-mono text-sm">{orderDetails.tracking_number}</p>
                  </div>
                )}

                {orderDetails.order_status === 'pending' && orderDetails.payment_status === 'pending' && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100">
                    <p className="text-yellow-800 text-sm">
                      Your payment is pending. Please complete the payment to process your order.
                    </p>
                  </div>
                )}
              </div>

              <Card shadow="sm">
                <CardBody className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
                <div className="space-y-4">
                  {orderDetails.order_items.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                      <div className="w-20 h-20 bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {item.product.image_url ? (
                          <img
                            src={getProductImageUrl(item.product.image_url, item.product.name)}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              if (item.product.name.toLowerCase().includes('bacteriostatic water')) {
                                (e.target as HTMLImageElement).src = BAC_WATER_IMAGE_URL;
                              }
                            }}
                          />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">
                          Dosage: {item.variant.dosage_mg}mg
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">Total</span>
                  <span className="text-2xl font-medium text-gray-900">
                    ₹{orderDetails.total_amount.toLocaleString('en-IN')}
                  </span>
                </div>
                </CardBody>
              </Card>
            </div>

            <div className="space-y-6">
              <Card shadow="sm">
                <CardBody className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Details</h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500 block">Name</span>
                    <span className="text-gray-900 font-medium">{orderDetails.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Email</span>
                    <span className="text-gray-900 font-medium">{orderDetails.customer_email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Phone</span>
                    <span className="text-gray-900 font-medium">{orderDetails.customer_phone}</span>
                  </div>
                </div>
                </CardBody>
              </Card>

              <Card shadow="sm">
                <CardBody className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {orderDetails.shipping_address}
                  </p>
                </CardBody>
              </Card>

              <Card shadow="sm">
                <CardBody className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Contact our support team for assistance with your order.
                  </p>
                  <Button
                    fullWidth
                    variant="bordered"
                    onPress={() => onNavigate('support')}
                    className="font-medium"
                  >
                    Contact Support
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      )}

      {!orderDetails && !loading && (
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-light text-gray-600 mb-2">Track Your Package</h2>
          <p className="text-gray-500">
            Enter your Order ID and email address above to view your order status
          </p>
        </div>
      )}
    </div>
  );
}
