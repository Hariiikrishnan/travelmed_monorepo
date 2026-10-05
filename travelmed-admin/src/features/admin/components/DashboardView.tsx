import React, { useMemo } from 'react';
import {
  TrendingUp, ShoppingCart, Clock, Activity, AlertTriangle, MessageSquare,
  Star, ChevronRight, IndianRupee, Package, Stethoscope, BarChart3,
} from 'lucide-react';

export interface AdminStats {
  revenueToday: number;
  revenueTotal: number;
  paidOrdersToday: number;
  paidOrders: number;
  pendingOrders: number;
  unpaidCheckouts: number;
  kitsSold: number;
  openConsultations: number;
  openTickets: number;
  avgOrderValue: number;
}

interface DashboardViewProps {
  stats: AdminStats;
  orders: any[];
  products: any[];
  bookings: any[];
  reviews: any[];
  tickets: any[];
  setActiveTab: (tab: string) => void;
  setSelectedOrder: (order: any) => void;
}

const inr = (n: number) => `₹${Math.round(Number(n) || 0).toLocaleString('en-IN')}`;

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

/** Paid revenue and paid order counts for each of the last 7 days (oldest first). */
export const lastSevenDays = (orders: any[]) => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    return { key: dayKey(d), label: i === 6 ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'short' }), revenue: 0, orders: 0 };
  });
  const index = new Map(days.map((d, i) => [d.key, i]));
  for (const o of orders) {
    if (o.paymentStatus !== 'Paid' || !o.createdAt) continue;
    const i = index.get(dayKey(new Date(o.createdAt)));
    if (i === undefined) continue;
    days[i].orders += 1;
    if (o.status !== 'Cancelled' && o.status !== 'Refunded') days[i].revenue += Number(o.amount) || 0;
  }
  return days;
};

const statusStyle: Record<string, string> = {
  Pending: 'bg-slate-100 text-slate-600 border-slate-200',
  Processing: 'bg-amber-50 text-amber-700 border-amber-200',
  Shipped: 'bg-blue-50 text-blue-700 border-blue-200',
  'Out for Delivery': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cancelled: 'bg-rose-50 text-rose-600 border-rose-200',
  Refunded: 'bg-purple-50 text-purple-700 border-purple-200',
};

function Kpi({ label, value, hint, icon: Icon, tone, onClick }: { label: string; value: string | number; hint?: string; icon: React.ElementType; tone: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200 rounded-2xl p-5 flex justify-between items-start hover:border-slate-300 hover:shadow-sm transition duration-300 group ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="space-y-1 text-left">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <h3 className="text-2xl font-extrabold text-[#172B4D] tracking-tight">{value}</h3>
        {hint && <p className="text-[10px] font-semibold text-slate-400">{hint}</p>}
      </div>
      <div className={`p-2.5 rounded-xl group-hover:scale-110 transition duration-300 ${tone}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}

export default function DashboardView({
  stats,
  orders,
  products,
  bookings,
  reviews,
  tickets,
  setActiveTab,
  setSelectedOrder,
}: DashboardViewProps) {
  const week = useMemo(() => lastSevenDays(orders), [orders]);
  const maxRevenue = Math.max(...week.map((d) => d.revenue), 1);
  const maxOrders = Math.max(...week.map((d) => d.orders), 1);
  const weekRevenue = week.reduce((s, d) => s + d.revenue, 0);
  const weekOrders = week.reduce((s, d) => s + d.orders, 0);

  const lowStockProducts = products.filter((p) => Number(p.stock) <= 10);
  const recentOrders = orders.filter((o) => o.paymentStatus === 'Paid').slice(0, 6);
  const newBookings = bookings.filter((b) => b.status === 'New' || b.status === 'Contacted').slice(0, 4);
  const pendingReviews = reviews.filter((r) => r.status === 'Pending');

  // Revenue line chart geometry (500 × 150 viewBox)
  const points = week.map((d, i) => ({ x: 10 + i * (480 / 6), y: 140 - (d.revenue / maxRevenue) * 120 }));
  const linePath = `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`;
  const areaPath = `${linePath} L ${points[6].x},150 L ${points[0].x},150 Z`;

  return (
    <div className="space-y-6 text-slate-650">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Revenue today" value={inr(stats.revenueToday)} hint={`${stats.paidOrdersToday} paid order${stats.paidOrdersToday === 1 ? '' : 's'} today`} icon={IndianRupee} tone="bg-teal-50 text-teal-600" />
        <Kpi label="Total paid revenue" value={inr(stats.revenueTotal)} hint={`${stats.paidOrders} paid orders · excl. cancelled/refunded`} icon={TrendingUp} tone="bg-blue-50 text-[#0B4F8C]" onClick={() => setActiveTab('orders')} />
        <Kpi label="Kits sold" value={stats.kitsSold} hint="Units in paid orders" icon={Package} tone="bg-sky-50 text-sky-600" onClick={() => setActiveTab('products')} />
        <Kpi label="Open consultations" value={stats.openConsultations} hint="New or contacted bookings" icon={Stethoscope} tone="bg-rose-50 text-rose-600" onClick={() => setActiveTab('teleconsultation')} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'To dispatch', value: stats.pendingOrders, icon: Clock, tab: 'orders', danger: stats.pendingOrders > 0 },
          { label: 'Open support tickets', value: stats.openTickets, icon: MessageSquare, tab: 'support tickets', danger: stats.openTickets > 0 },
          { label: 'Avg paid order value', value: inr(stats.avgOrderValue), icon: IndianRupee, tab: 'analytics', danger: false },
          { label: 'Reviews awaiting approval', value: pendingReviews.length, icon: Star, tab: 'reviews', danger: pendingReviews.length > 0 },
        ].map((k) => (
          <button
            key={k.label}
            type="button"
            onClick={() => setActiveTab(k.tab)}
            className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-slate-300 hover:shadow-sm transition cursor-pointer text-left"
          >
            <div>
              <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">{k.label}</p>
              <p className={`text-lg font-black mt-0.5 ${k.danger ? 'text-rose-600' : 'text-slate-800'}`}>{k.value}</p>
            </div>
            <k.icon className={`h-4 w-4 ${k.danger ? 'text-rose-500' : 'text-slate-400'}`} />
          </button>
        ))}
      </div>

      {/* Charts — last 7 days, paid orders only */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-teal-600" /> Revenue · last 7 days
            </h3>
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">{inr(weekRevenue)}</span>
          </div>
          <div className="h-64 w-full bg-slate-50/50 rounded-xl border border-slate-200/50 flex flex-col justify-end p-4">
            {weekRevenue > 0 ? (
              <svg className="w-full h-[80%] overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="dashRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[30, 75, 120].map((y) => (
                  <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4" />
                ))}
                <path d={areaPath} fill="url(#dashRevGrad)" />
                <path d={linePath} fill="none" stroke="#14B8A6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                {points.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="4.5" fill="#fff" stroke="#14B8A6" strokeWidth="2.5">
                    <title>{`${week[i].label}: ${inr(week[i].revenue)}`}</title>
                  </circle>
                ))}
              </svg>
            ) : (
              <div className="flex h-[80%] items-center justify-center text-xs font-semibold text-slate-400">No paid orders in the last 7 days.</div>
            )}
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-4 px-1 uppercase tracking-wider">
              {week.map((d) => (
                <span key={d.key} className={d.label === 'Today' ? 'text-teal-600 font-extrabold' : ''}>{d.label}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-600" /> Paid orders · last 7 days
            </h3>
            <span className="text-xs font-bold text-[#0B4F8C] bg-blue-50 px-2.5 py-1 rounded-full">{weekOrders} orders</span>
          </div>
          <div className="h-64 w-full bg-slate-50/50 rounded-xl border border-slate-200/50 flex flex-col justify-end p-4">
            <div className="flex items-end justify-between h-[80%] px-2 w-full">
              {week.map((d) => (
                <div key={d.key} className="flex h-full w-8 flex-col items-center justify-end gap-1" title={`${d.label}: ${d.orders} orders`}>
                  <span className="text-[10px] font-bold text-slate-500">{d.orders || ''}</span>
                  <div
                    className={`w-6 rounded-t-lg transition-all duration-500 ${d.label === 'Today' ? 'bg-[#0B4F8C]' : 'bg-[#0B4F8C]/40'}`}
                    style={{ height: `${(d.orders / maxOrders) * 85}%`, minHeight: d.orders ? 4 : 0 }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-4 px-1 uppercase tracking-wider">
              {week.map((d) => (
                <span key={d.key} className={d.label === 'Today' ? 'text-[#0B4F8C] font-extrabold' : ''}>{d.label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders + stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-teal-600" /> Latest paid orders
            </h3>
            <button onClick={() => setActiveTab('orders')} className="text-xs text-[#0B4F8C] font-bold flex items-center gap-0.5 hover:underline cursor-pointer">
              Manage orders <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      setActiveTab('orders');
                    }}
                    className="hover:bg-slate-50/50 transition cursor-pointer"
                  >
                    <td className="py-3 px-4 text-[#0B4F8C] font-bold font-mono">{order.id}</td>
                    <td className="py-3 px-4 font-extrabold text-[#172B4D]">{order.customer}</td>
                    <td className="py-3 px-4 text-slate-500">{order.city}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2.5 py-0.5 text-[9px] font-bold rounded-full border uppercase ${statusStyle[order.status] ?? statusStyle.Pending}`}>{order.status}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-800 font-black">{inr(order.amount)}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400">No paid orders yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="h-4.5 w-4.5 text-rose-500" /> Product stock
          </h3>
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {products.map((p) => {
              const low = Number(p.stock) <= 10;
              return (
                <div key={p.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="space-y-0.5 text-left min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">{p.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{p.sku} · {p.visibility}</p>
                  </div>
                  <span className={`shrink-0 inline-flex px-2 py-0.5 text-[9px] font-bold rounded-full border ${low ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                    {p.stock} in stock
                  </span>
                </div>
              );
            })}
            {products.length === 0 && <div className="text-center py-8 text-slate-400 text-xs font-medium">No products yet.</div>}
          </div>
          {lowStockProducts.length > 0 && (
            <p className="text-[11px] font-semibold text-rose-600">{lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} at 10 units or fewer — restock soon.</p>
          )}
          <button onClick={() => setActiveTab('products')} className="w-full text-center py-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs text-slate-600 font-bold rounded-xl transition cursor-pointer">
            Manage products
          </button>
        </div>
      </div>

      {/* Reviews, tickets, consultations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" /> Recent reviews
            </h3>
            <button onClick={() => setActiveTab('reviews')} className="text-xs text-[#0B4F8C] font-bold hover:underline cursor-pointer">Moderate</button>
          </div>
          <div className="space-y-3.5">
            {reviews.slice(0, 2).map((rev) => (
              <div key={rev.id} className="border-b border-slate-100 pb-3.5 last:border-none last:pb-0 space-y-1.5 text-xs text-left">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-700">{rev.name || 'Anonymous'}</span>
                  <span className="text-amber-400">{'★'.repeat(Math.max(0, Math.min(5, Number(rev.rating) || 0)))}</span>
                </div>
                <p className="text-slate-500 italic line-clamp-2">&ldquo;{rev.quote}&rdquo;</p>
                <p className={`text-[9px] uppercase font-bold ${rev.status === 'Approved' ? 'text-teal-600' : rev.status === 'Rejected' ? 'text-rose-500' : 'text-amber-600'}`}>{rev.status}</p>
              </div>
            ))}
            {reviews.length === 0 && <p className="py-5 text-center text-[11px] font-semibold text-slate-400">No reviews submitted yet.</p>}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-sky-600" /> Support desk
            </h3>
            <button onClick={() => setActiveTab('support tickets')} className="text-xs text-[#0B4F8C] font-bold hover:underline cursor-pointer">Reply</button>
          </div>
          <div className="space-y-3">
            {tickets.filter((t) => t.status !== 'Solved').slice(0, 3).map((t) => (
              <div key={t.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs gap-2">
                <div className="space-y-0.5 text-left min-w-0">
                  <p className="font-bold text-slate-700 truncate">{t.subject}</p>
                  <p className="text-[9px] text-slate-400 font-bold">By {t.user}</p>
                </div>
                <span className="shrink-0 inline-flex px-2 py-0.5 text-[9px] font-bold rounded-full uppercase border bg-white text-slate-600 border-slate-200">{t.status}</span>
              </div>
            ))}
            {tickets.filter((t) => t.status !== 'Solved').length === 0 && (
              <div className="flex flex-col items-center justify-center py-5 text-center text-slate-400">
                <MessageSquare className="h-6 w-6 mb-2 opacity-20" />
                <p className="text-[10px] font-semibold">No open support tickets.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-600" /> Consultation requests
            </h3>
            <button onClick={() => setActiveTab('teleconsultation')} className="text-xs text-[#0B4F8C] font-bold hover:underline cursor-pointer">Open</button>
          </div>
          <div className="space-y-3">
            {newBookings.map((b) => (
              <div key={b.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs gap-2">
                <div className="space-y-0.5 text-left min-w-0">
                  <p className="font-bold text-slate-700 truncate">{b.symptom} · {b.destination}</p>
                  <p className="text-[9px] text-slate-400 font-bold font-mono">{b.orderId} · consult {b.sequence ?? '?'}/{b.consultationsAllowed ?? '?'}</p>
                </div>
                <span className="shrink-0 inline-flex px-2 py-0.5 text-[9px] font-bold rounded-full uppercase border bg-white text-slate-600 border-slate-200">{b.status}</span>
              </div>
            ))}
            {newBookings.length === 0 && (
              <div className="flex flex-col items-center justify-center py-5 text-center text-slate-400">
                <Stethoscope className="h-6 w-6 mb-2 opacity-20" />
                <p className="text-[10px] font-semibold">No open consultation requests.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
