import React, { useState, useMemo } from 'react';
import {
  ShoppingCart, Search, Printer, X, MapPin, User, Truck, CreditCard, Copy, Check, Mail, Phone,
  Stethoscope, Tag, Loader2, AlertTriangle,
} from 'lucide-react';
import { generateInvoice, generateLabel } from '../utils/pdfGenerator';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Refunded'] as const;

/** Maps an API order to the admin view model (also used by the dashboard and PDF generator). */
export const toOrderView = (o: any) => ({
  id: o.orderId,
  customer: o.shippingFullName,
  email: o.shippingEmail || '',
  phone: o.shippingPhone || '',
  country: o.shippingCountry,
  city: o.shippingCity,
  shippingAddress: `${o.shippingAddress}, ${o.shippingCity}, ${o.shippingCountry} - ${o.shippingZipCode}`,
  payment: o.paymentStatus === 'Paid' ? `Razorpay${o.paymentId ? ` · ${o.paymentId}` : ''}` : 'Awaiting payment',
  paymentStatus: o.paymentStatus,
  paymentId: o.paymentId,
  shipping: o.shippingCost ? `Standard shipping (₹${o.shippingCost})` : 'Free shipping',
  status: o.status,
  tracking: o.trackingNumber,
  estimatedDelivery: o.estimatedDelivery,
  subtotal: o.subtotal,
  discount: o.discount ?? 0,
  couponCode: o.couponCode,
  shippingCost: o.shippingCost,
  amount: o.total,
  createdAt: o.createdAt,
  consultationsUsed: o.consultationsUsed ?? 0,
  consultationsRemaining: o.consultationsRemaining ?? 0,
  medicines: (o.items ?? []).map((item: any) => ({ name: item.name, qty: item.quantity, price: item.price })),
});

interface OrdersViewProps {
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  addActivityLog: (action: string, changes: string) => void;
  selectedOrder: any;
  setSelectedOrder: (order: any) => void;
  /** Consultation bookings — used to show each order's teleconsultation usage */
  bookings?: any[];
}

const statusStyle: Record<string, string> = {
  Pending: 'bg-slate-100 text-slate-600 border-slate-200',
  Processing: 'bg-amber-50 text-amber-700 border-amber-200',
  Shipped: 'bg-blue-50 text-blue-700 border-blue-200',
  'Out for Delivery': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-rose-50 text-rose-600 border-rose-200',
  Refunded: 'bg-purple-50 text-purple-700 border-purple-200',
};

const inr = (n: number) => `₹${Math.round(Number(n) || 0).toLocaleString('en-IN')}`;
const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

export default function OrdersView({
  orders,
  setOrders,
  addActivityLog,
  selectedOrder,
  setSelectedOrder,
  bookings = [],
}: OrdersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'Paid' | 'Pending'>('Paid');
  const [copied, setCopied] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const filteredOrders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesSearch =
        !q ||
        String(o.id).toLowerCase().includes(q) ||
        String(o.customer).toLowerCase().includes(q) ||
        String(o.email).toLowerCase().includes(q) ||
        String(o.phone).includes(q) ||
        String(o.city).toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || (paymentFilter === 'Paid' ? o.paymentStatus === 'Paid' : o.paymentStatus !== 'Paid');
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const orderBookings = useMemo(
    () => (selectedOrder ? bookings.filter((b) => b.orderId === selectedOrder.id) : []),
    [bookings, selectedOrder]
  );

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (newStatus === 'Refunded' && !confirm('Mark this order as Refunded? Make sure you have already issued the refund in your Razorpay dashboard.')) return;
    setUpdating(true);
    setError('');
    try {
      const token = localStorage.getItem('travelmed_admin_token');
      const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ status: newStatus }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || 'Failed to update order status.');
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
      if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status: newStatus });
      addActivityLog('Order Status Updated', `Order ${id} → ${newStatus}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 relative text-slate-650">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div className="text-left">
          <h2 className="text-xl font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-teal-650" /> Orders
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {orders.filter((o) => o.paymentStatus === 'Paid').length} paid orders · {orders.filter((o) => o.paymentStatus !== 'Paid').length} checkouts awaiting payment
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between text-xs">
        <div className="flex-1 max-w-sm relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search order ID, name, email, phone, city…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value as 'all' | 'Paid' | 'Pending')} className="bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700">
            <option value="Paid">Paid orders</option>
            <option value="Pending">Awaiting payment</option>
            <option value="all">All checkouts</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700">
            <option value="all">All statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* List */}
        <div className={`${selectedOrder ? 'xl:col-span-5' : 'xl:col-span-12'} bg-white border border-slate-200 rounded-2xl overflow-hidden`}>
          <div className="divide-y divide-slate-100">
            {filteredOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => {
                  setSelectedOrder(order);
                  setError('');
                }}
                className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 transition cursor-pointer ${selectedOrder?.id === order.id ? 'bg-[#EEF6FF] border-l-2 border-[#0B4F8C]' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-bold text-[#0B4F8C]">{order.id}</p>
                    <p className="mt-0.5 truncate text-sm font-extrabold text-[#172B4D]">{order.customer}</p>
                    <p className="text-[11px] text-slate-400 font-semibold">{fmtDate(order.createdAt)} · {order.city}</p>
                  </div>
                  <div className="shrink-0 text-right space-y-1">
                    <p className="text-sm font-black text-slate-800">{inr(order.amount)}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase ${statusStyle[order.status] ?? statusStyle.Pending}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                {order.paymentStatus === 'Paid' && (
                  <span
                    className={`mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                      order.consultationsRemaining === 0 ? 'border-slate-200 bg-slate-50 text-slate-500' : 'border-teal-200 bg-teal-50 text-teal-700'
                    }`}
                  >
                    <Stethoscope className="h-3 w-3" /> Consults {order.consultationsUsed}/{order.consultationsUsed + order.consultationsRemaining}
                  </span>
                )}
              </button>
            ))}
            {filteredOrders.length === 0 && <div className="py-12 text-center text-sm text-slate-400">No orders match these filters.</div>}
          </div>
        </div>

        {/* Detail */}
        {selectedOrder && (
          <div className="xl:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 text-left text-xs">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <p className="text-base font-extrabold text-[#172B4D]">Order {selectedOrder.id}</p>
                <p className="mt-0.5 text-[11px] font-semibold text-slate-400">Placed {fmtDate(selectedOrder.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${statusStyle[selectedOrder.status] ?? statusStyle.Pending}`}>{selectedOrder.status}</span>
                <button onClick={() => setSelectedOrder(null)} aria-label="Close" className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {selectedOrder.paymentStatus !== 'Paid' && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 font-semibold text-amber-800">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Payment was not completed for this checkout. Do not dispatch — it can only be kept Pending or Cancelled.
              </div>
            )}

            {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 font-semibold text-rose-600">{error}</div>}

            {/* Status */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Update status</p>
              <div className="flex flex-wrap gap-2">
                {ORDER_STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={updating || selectedOrder.status === s}
                    onClick={() => handleUpdateStatus(selectedOrder.id, s)}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold transition cursor-pointer disabled:cursor-default ${
                      selectedOrder.status === s ? statusStyle[s] : 'bg-white border-slate-200 text-slate-600 hover:border-[#0B4F8C] hover:text-[#0B4F8C]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
                {updating && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
              </div>
              <p className="text-[11px] text-slate-400">The customer receives an SMS when the status changes (if a phone number was given).</p>
            </div>

            {/* Customer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 font-semibold">
              <p className="flex items-center gap-2 text-slate-800"><User className="h-4 w-4 text-slate-400" /> {selectedOrder.customer}</p>
              {selectedOrder.email ? (
                <a href={`mailto:${selectedOrder.email}`} className="flex items-center gap-2 text-[#0B4F8C] hover:underline truncate"><Mail className="h-4 w-4 shrink-0" /> {selectedOrder.email}</a>
              ) : (
                <p className="flex items-center gap-2 text-slate-400"><Mail className="h-4 w-4" /> No email on file</p>
              )}
              {selectedOrder.phone ? (
                <a href={`tel:${selectedOrder.phone}`} className="flex items-center gap-2 text-slate-800 hover:underline"><Phone className="h-4 w-4 text-slate-400" /> {selectedOrder.phone}</a>
              ) : (
                <p className="flex items-center gap-2 text-slate-400"><Phone className="h-4 w-4" /> No phone on file</p>
              )}
              <p className="flex items-start gap-2 text-slate-800 sm:col-span-2"><MapPin className="h-4 w-4 shrink-0 text-slate-400" /> {selectedOrder.shippingAddress}</p>
            </div>

            {/* Items & totals */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Items</p>
              <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                {selectedOrder.medicines.map((m: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-2.5 font-semibold">
                    <span className="text-slate-800">{m.qty} × {m.name}</span>
                    <span className="text-slate-700">{inr(m.price * m.qty)}</span>
                  </div>
                ))}
              </div>
              <dl className="space-y-1.5 pt-2 font-semibold">
                <div className="flex justify-between text-slate-500"><dt>Subtotal</dt><dd>{inr(selectedOrder.subtotal)}</dd></div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600"><dt className="flex items-center gap-1"><Tag className="h-3.5 w-3.5" /> Coupon {selectedOrder.couponCode}</dt><dd>-{inr(selectedOrder.discount)}</dd></div>
                )}
                <div className="flex justify-between text-slate-500"><dt>Shipping</dt><dd>{selectedOrder.shippingCost ? inr(selectedOrder.shippingCost) : 'FREE'}</dd></div>
                <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-black text-[#0B4F8C]"><dt>Total</dt><dd>{inr(selectedOrder.amount)}</dd></div>
              </dl>
            </div>

            {/* Payment & shipping */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-semibold">
              <div className="rounded-xl border border-slate-100 p-3">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400"><CreditCard className="h-3.5 w-3.5" /> Payment</p>
                <p className={`mt-1 ${selectedOrder.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}`}>{selectedOrder.paymentStatus}</p>
                {selectedOrder.paymentId && <p className="mt-0.5 break-all font-mono text-[10px] text-slate-400">{selectedOrder.paymentId}</p>}
              </div>
              <div className="rounded-xl border border-slate-100 p-3">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400"><Truck className="h-3.5 w-3.5" /> Tracking</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-mono text-slate-800">{selectedOrder.tracking}</span>
                  <button type="button" onClick={() => handleCopy(selectedOrder.tracking)} aria-label="Copy tracking number" className="text-slate-400 hover:text-[#0B4F8C] cursor-pointer">
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <p className="mt-0.5 text-[10px] text-slate-400">Est. {selectedOrder.estimatedDelivery}</p>
              </div>
            </div>

            {/* Teleconsultation usage */}
            {selectedOrder.paymentStatus === 'Paid' && (
              <div className="rounded-xl border border-teal-100 bg-teal-50/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-700"><Stethoscope className="h-3.5 w-3.5" /> Teleconsultations</p>
                  <p className="font-extrabold text-[#172B4D]">
                    {selectedOrder.consultationsUsed} of {selectedOrder.consultationsUsed + selectedOrder.consultationsRemaining} used · {selectedOrder.consultationsRemaining} remaining
                  </p>
                </div>
                {orderBookings.length > 0 ? (
                  <ul className="divide-y divide-teal-100 rounded-lg border border-teal-100 bg-white">
                    {orderBookings.map((b) => (
                      <li key={b.id} className="flex items-center justify-between gap-3 px-3 py-2 font-semibold">
                        <span className="min-w-0 truncate text-slate-700">
                          {b.sequence ? `#${b.sequence} · ` : ''}{b.symptom} · {b.destination}
                        </span>
                        <span className="shrink-0 text-[10px] font-bold uppercase text-slate-500">{b.status}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 font-semibold">No consultations requested yet.</p>
                )}
              </div>
            )}

            {/* Documents */}
            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              <button type="button" onClick={() => generateInvoice(selectedOrder)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold text-slate-700 hover:border-[#0B4F8C] hover:text-[#0B4F8C] cursor-pointer">
                <Printer className="h-3.5 w-3.5" /> Invoice PDF
              </button>
              <button type="button" onClick={() => generateLabel(selectedOrder)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold text-slate-700 hover:border-[#0B4F8C] hover:text-[#0B4F8C] cursor-pointer">
                <Printer className="h-3.5 w-3.5" /> Shipping label
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
