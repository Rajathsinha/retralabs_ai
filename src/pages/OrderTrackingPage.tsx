import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Package, Truck, CheckCircle, Clock, XCircle,
  MapPin, MessageSquare, Copy, Check, ExternalLink, ChevronRight,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getProductImageUrl, BAC_WATER_IMAGE_URL } from '../utils/imageUrl';
import { useAuth } from '../context/AuthContext';

/* ── Carrier config ─────────────────────────────────────────── */
const CARRIERS = [
  {
    id:    'indiapost',
    name:  'India Post',
    short: 'Indiapost',
    logo:  '📮',
    color: 'bg-red-500',
    hint:  'e.g. EE123456789IN',
    /* India Post doesn't support URL deep-link; we open their page + copy number */
    url:   (num: string) =>
      `https://www.indiapost.gov.in/VAS/Pages/trackconsignment.aspx`,
    copyHint: true,
  },
  {
    id:    'dtdc',
    name:  'DTDC',
    short: 'DTDC',
    logo:  '🟡',
    color: 'bg-yellow-500',
    hint:  'e.g. Z12345678',
    url:   (num: string) =>
      `https://tracking.dtdc.com/ctbs-tracking/customerInterface.tr?submitFlag=showTrackingDetails&cno=${encodeURIComponent(num)}`,
    copyHint: false,
  },
  {
    id:    'maruti',
    name:  'Maruti Courier',
    short: 'Maruti',
    logo:  '🚚',
    color: 'bg-blue-600',
    hint:  'e.g. MC1234567890',
    url:   (num: string) =>
      `https://maruticourier.com/tracking?awb=${encodeURIComponent(num)}`,
    copyHint: false,
  },
];

/* ── Order tracking types ───────────────────────────────────── */
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
    product: { name: string; image_url: string };
    variant: { dosage_mg: number };
  }>;
}

const STATUS_STEPS = [
  { id: 'paid',       label: 'Payment Received', icon: CheckCircle },
  { id: 'processing', label: 'Processing',        icon: Package },
  { id: 'shipped',    label: 'Shipped',           icon: Truck },
  { id: 'delivered',  label: 'Delivered',         icon: MapPin },
];

const STATUS_ORDER = ['pending', 'paid', 'processing', 'shipped', 'delivered'];

function getStatusMeta(status: string): { label: string; color: string; bg: string } {
  switch (status) {
    case 'pending':    return { label: 'Payment Pending', color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200' };
    case 'paid':       return { label: 'Payment Received', color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200' };
    case 'processing': return { label: 'Processing',       color: 'text-violet-600', bg: 'bg-violet-50 border-violet-200' };
    case 'shipped':    return { label: 'Shipped',          color: 'text-cyan-600',   bg: 'bg-cyan-50 border-cyan-200' };
    case 'delivered':  return { label: 'Delivered',        color: 'text-emerald-600',bg: 'bg-emerald-50 border-emerald-200' };
    case 'cancelled':  return { label: 'Cancelled',        color: 'text-red-600',    bg: 'bg-red-50 border-red-200' };
    default:           return { label: status,             color: 'text-slate-600',  bg: 'bg-slate-50 border-slate-200' };
  }
}

/* ════════════════════════════════════════════════════════════ */
export default function OrderTrackingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  /* Tab state */
  const [tab, setTab] = useState<'carrier' | 'order'>('carrier');

  /* ── Carrier tracking state ── */
  const [carrier,     setCarrier]     = useState(CARRIERS[0]);
  const [trackingNum, setTrackingNum] = useState('');
  const [copied,      setCopied]      = useState(false);

  /* ── Order lookup state ── */
  const [orderId,      setOrderId]      = useState('');
  const [email,        setEmail]        = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderTrackingDetails | null>(null);
  const [loading,      setLoading]      = useState(false);
  const [orderError,   setOrderError]   = useState('');

  /* ── Auto-fill email from signed-in user ── */
  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user?.email]);

  /* ── Carrier: open tracking ── */
  const handleCarrierTrack = () => {
    const num = trackingNum.trim();
    if (!num) return;
    const url = carrier.url(num);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = async () => {
    if (!trackingNum.trim()) return;
    await navigator.clipboard.writeText(trackingNum.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Order lookup ── */
  const trackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError('');
    setLoading(true);
    setOrderDetails(null);

    try {
      const { data: orderData, error: err1 } = await supabase
        .rpc('get_order_by_id_and_email', {
          order_uuid: orderId.trim(),
          customer_email_param: email.trim().toLowerCase(),
        });

      if (err1) throw err1;
      if (!orderData || orderData.length === 0) {
        setOrderError('Order not found. Please check your Order ID and email.');
        return;
      }

      const order = orderData[0];
      const { data: itemsData, error: err2 } = await supabase
        .rpc('get_order_items_by_order_and_email', {
          order_uuid: orderId.trim(),
          customer_email_param: email.trim().toLowerCase(),
        });
      if (err2) throw err2;

      const enriched = await Promise.all(
        (itemsData || []).map(async (item: any) => {
          const { data: product } = await supabase
            .from('products').select('name, image_url').eq('id', item.product_id).single();
          const { data: variant } = await supabase
            .from('product_variants').select('dosage_mg').eq('id', item.variant_id).single();
          return {
            ...item,
            product: product || { name: 'Unknown', image_url: '' },
            variant: variant || { dosage_mg: 0 },
          };
        })
      );

      setOrderDetails({ ...order, order_items: enriched } as OrderTrackingDetails);
    } catch {
      setOrderError('Failed to retrieve order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepId: string, current: string) => {
    if (current === 'cancelled') return 'cancelled';
    return STATUS_ORDER.indexOf(stepId) <= STATUS_ORDER.indexOf(current) ? 'completed' : 'pending';
  };

  /* ════════════════════════════ RENDER ════════════════════════════ */
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Dark hero header ── */}
      <div className="bg-slate-950 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-5">
            <Package className="w-6 h-6 text-cyan-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            Track Your Package
          </h1>
          <p className="text-slate-400 text-base max-w-lg mx-auto">
            Track your shipment directly with the courier, or look up your RetraLabs order by ID.
          </p>

          {/* Tabs */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setTab('carrier')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                tab === 'carrier'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/8'
              }`}
            >
              <Truck className="w-4 h-4" />
              Track Shipment
            </button>
            <button
              onClick={() => setTab('order')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                tab === 'order'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/8'
              }`}
            >
              <Search className="w-4 h-4" />
              My Order
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ══════════════ CARRIER TRACKING TAB ══════════════ */}
        {tab === 'carrier' && (
          <div className="max-w-2xl mx-auto space-y-5">

            {/* Carrier selector */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Select Courier</p>
              <div className="grid grid-cols-3 gap-3">
                {CARRIERS.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => { setCarrier(c); setTrackingNum(''); setCopied(false); }}
                    className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all duration-200 ${
                      carrier.id === c.id
                        ? 'border-slate-900 bg-white shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <span className="text-3xl leading-none">{c.logo}</span>
                    <span className={`text-sm font-bold ${carrier.id === c.id ? 'text-slate-900' : 'text-slate-500'}`}>
                      {c.short}
                    </span>
                    {carrier.id === c.id && (
                      <span className="w-4 h-1 bg-cyan-400 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tracking input */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                {carrier.name} Tracking
              </p>

              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Tracking / AWB Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={trackingNum}
                  onChange={e => setTrackingNum(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCarrierTrack()}
                  placeholder={carrier.hint}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none text-slate-900 placeholder-slate-400 font-mono text-sm transition-all"
                />
                {carrier.copyHint && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!trackingNum.trim()}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>

              {/* India Post special hint */}
              {carrier.copyHint && (
                <p className="mt-2.5 text-xs text-slate-400 flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5">ℹ</span>
                  India Post doesn't support direct URL tracking — copy your number above, then paste it on their website.
                </p>
              )}

              <button
                type="button"
                onClick={handleCarrierTrack}
                disabled={!trackingNum.trim()}
                className="mt-4 w-full flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Track on {carrier.name} →
              </button>
            </div>

            {/* All carriers quick links */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                Direct Carrier Portals
              </p>
              <div className="space-y-2">
                {[
                  { name: 'India Post', url: 'https://www.indiapost.gov.in/VAS/Pages/trackconsignment.aspx', logo: '📮' },
                  { name: 'DTDC',       url: 'https://tracking.dtdc.com/ctbs-tracking/customerInterface.tr', logo: '🟡' },
                  { name: 'Maruti Courier', url: 'https://maruticourier.com/', logo: '🚚' },
                ].map(link => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                  >
                    <span className="text-xl leading-none">{link.logo}</span>
                    <span className="flex-1 text-sm font-medium text-slate-700">{link.name}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {/* CTA to order tab */}
            <p className="text-center text-sm text-slate-500">
              Don't have a tracking number yet?{' '}
              <button onClick={() => setTab('order')} className="text-slate-900 font-semibold underline underline-offset-2">
                Look up your order
              </button>
            </p>
          </div>
        )}

        {/* ══════════════ MY ORDER TAB ══════════════ */}
        {tab === 'order' && (
          <div className="max-w-2xl mx-auto space-y-5">

            {/* Lookup form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">
                Order Lookup
              </p>
              <form onSubmit={trackOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Order ID</label>
                  <input
                    type="text"
                    required
                    value={orderId}
                    onChange={e => setOrderId(e.target.value)}
                    placeholder="e.g. 3c7b2a1d-..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none text-slate-900 placeholder-slate-400 font-mono text-sm transition-all"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                    {user?.email && (
                      <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        ✓ Auto-filled
                      </span>
                    )}
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 outline-none text-slate-900 placeholder-slate-400 text-sm transition-all"
                  />
                </div>

                {orderError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                    <p className="text-red-700 text-sm mb-3">{orderError}</p>
                    <a
                      href="https://wa.me/918217824384?text=Hello%2C%20I%20need%20help%20tracking%20my%20order%20on%20RetraLabs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat on WhatsApp
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Looking up…
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Track Order
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Empty hint */}
            {!orderDetails && !loading && !orderError && (
              <div className="text-center py-8 text-slate-400">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Enter your Order ID and email above to view status</p>
              </div>
            )}

            {/* ── Order results ── */}
            {orderDetails && (() => {
              const meta = getStatusMeta(orderDetails.order_status);
              return (
                <div className="space-y-5">

                  {/* Status card */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Order Status</p>
                        <p className="text-xs text-slate-400">
                          Placed {new Date(orderDetails.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${meta.bg} ${meta.color}`}>
                        {meta.label}
                      </span>
                    </div>

                    {/* Progress steps */}
                    {!['cancelled', 'pending'].includes(orderDetails.order_status) && (
                      <div className="relative mt-6 mb-2">
                        {/* connector line */}
                        <div className="absolute top-5 left-5 right-5 h-0.5 bg-slate-100" />
                        <div className="relative flex justify-between">
                          {STATUS_STEPS.map(step => {
                            const s = getStepStatus(step.id, orderDetails.order_status);
                            const Icon = step.icon;
                            return (
                              <div key={step.id} className="flex flex-col items-center gap-2 z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                  s === 'completed' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
                                }`}>
                                  <Icon className="w-4.5 h-4.5" />
                                </div>
                                <span className={`text-[10px] font-semibold text-center max-w-[64px] leading-tight ${
                                  s === 'completed' ? 'text-slate-800' : 'text-slate-400'
                                }`}>
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Tracking number — if available, show carrier quick-links */}
                    {orderDetails.tracking_number && (
                      <div className="mt-5 p-4 rounded-xl bg-cyan-50 border border-cyan-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-cyan-600" />
                            <span className="text-xs font-bold uppercase tracking-widest text-cyan-700">Tracking Number</span>
                          </div>
                        </div>
                        <p className="font-mono text-slate-900 font-bold text-sm mb-3">{orderDetails.tracking_number}</p>
                        <div className="flex flex-wrap gap-2">
                          {CARRIERS.map(c => (
                            <button
                              key={c.id}
                              onClick={() => {
                                window.open(c.url(orderDetails.tracking_number!), '_blank', 'noopener,noreferrer');
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-cyan-200 hover:border-cyan-400 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-all"
                            >
                              <span>{c.logo}</span>
                              Track on {c.short}
                              <ExternalLink className="w-3 h-3 opacity-50" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order items */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Items Ordered</p>
                    <div className="space-y-4 divide-y divide-slate-100">
                      {orderDetails.order_items.map((item, i) => (
                        <div key={i} className={`flex gap-4 ${i > 0 ? 'pt-4' : ''}`}>
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                            <img
                              src={getProductImageUrl(item.product.image_url, item.product.name)}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = BAC_WATER_IMAGE_URL; }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 text-sm">{item.product.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{item.variant.dosage_mg}mg · Qty {item.quantity}</p>
                          </div>
                          <p className="font-bold text-slate-900 text-sm tabular-nums">
                            ₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                      <span className="font-semibold text-slate-900">Total</span>
                      <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                        ₹{orderDetails.total_amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Delivery & help */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Shipping To</p>
                      <p className="text-xs text-slate-500">{orderDetails.customer_name}</p>
                      <p className="text-sm text-slate-700 whitespace-pre-line mt-1">{orderDetails.shipping_address}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Need Help?</p>
                      <p className="text-xs text-slate-500 mb-4">Our team is reachable on WhatsApp for any order queries.</p>
                      <div className="mt-auto flex flex-col gap-2">
                        <a
                          href={`https://wa.me/918217824384?text=Hi%2C%20I%20need%20help%20with%20order%20${orderDetails.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          WhatsApp Support
                        </a>
                        <button
                          onClick={() => navigate('/support')}
                          className="flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                        >
                          Contact Support
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
