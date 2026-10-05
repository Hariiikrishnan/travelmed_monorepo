import React, { useMemo } from 'react';
import { Globe, Activity, Ticket, ListChecks, TrendingUp, Info, Package } from 'lucide-react';
import type { AdminStats } from './DashboardView';
import { lastSevenDays } from './DashboardView';
import { ORDER_STATUSES } from './OrdersView';

interface AnalyticsViewProps {
  stats: AdminStats;
  orders?: any[];
  coupons?: any[];
}

const inr = (n: number) => `₹${Math.round(Number(n) || 0).toLocaleString('en-IN')}`;

function Bar({ label, sub, value, total, color = 'bg-teal-500' }: { label: string; sub: string; value: number; total: number; color?: string }) {
  const perc = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex justify-between items-center gap-3 text-xs">
      <div className="flex flex-col text-left min-w-0">
        <span className="font-bold text-slate-800 truncate">{label}</span>
        <span className="text-[9px] text-slate-450 uppercase font-bold">{sub}</span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-24 sm:w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${perc}%` }} />
        </div>
        <span className="font-black text-slate-700 w-10 text-right">{perc}%</span>
      </div>
    </div>
  );
}

export default function AnalyticsView({ stats, orders = [], coupons = [] }: AnalyticsViewProps) {
  const paid = useMemo(() => orders.filter((o) => o.paymentStatus === 'Paid'), [orders]);
  const week = useMemo(() => lastSevenDays(orders), [orders]);

  const byStatus = useMemo(
    () => ORDER_STATUSES.map((s) => [s, paid.filter((o) => o.status === s).length] as const).filter(([, n]) => n > 0),
    [paid]
  );

  const byCity = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const o of paid) {
      const c = o.city || 'Unknown';
      counts[c] = (counts[c] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [paid]);

  const topCoupons = useMemo(() => {
    const discountByCode: Record<string, number> = {};
    for (const o of paid) if (o.couponCode) discountByCode[o.couponCode] = (discountByCode[o.couponCode] || 0) + (Number(o.discount) || 0);
    return [...coupons]
      .filter((c) => c.usages > 0)
      .sort((a, b) => b.usages - a.usages)
      .slice(0, 8)
      .map((c) => ({ ...c, discountGiven: discountByCode[c.code] || 0 }));
  }, [coupons, paid]);

  // Units and revenue per kit, from paid orders that weren't cancelled or refunded
  const byKit = useMemo(() => {
    const totals = new Map<string, { units: number; revenue: number }>();
    for (const o of paid) {
      if (o.status === 'Cancelled' || o.status === 'Refunded') continue;
      for (const m of o.medicines) {
        const t = totals.get(m.name) ?? { units: 0, revenue: 0 };
        t.units += Number(m.qty) || 0;
        t.revenue += (Number(m.price) || 0) * (Number(m.qty) || 0);
        totals.set(m.name, t);
      }
    }
    return [...totals.entries()].sort((a, b) => b[1].revenue - a[1].revenue);
  }, [paid]);
  const kitRevenue = byKit.reduce((s, [, t]) => s + t.revenue, 0);

  const checkoutCompletion = orders.length ? Math.round((paid.length / orders.length) * 100) : 0;

  return (
    <div className="space-y-6 text-slate-650">
      <div className="border-b border-slate-200 pb-4 text-left">
        <h2 className="text-xl font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
          <Activity className="h-5 w-5 text-teal-650" /> Sales Analytics
        </h2>
        <p className="text-xs text-slate-400 mt-1">Calculated from your real orders and coupons. Only paid orders count as sales.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-left">
        {[
          { label: 'Paid revenue (total)', value: inr(stats.revenueTotal), hint: 'Excludes cancelled & refunded' },
          { label: 'Paid orders', value: stats.paidOrders, hint: `${stats.unpaidCheckouts} checkouts not paid` },
          { label: 'Average order value', value: inr(stats.avgOrderValue), hint: 'Across paid orders' },
          { label: 'Checkout completion', value: `${checkoutCompletion}%`, hint: 'Paid ÷ started checkouts' },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-slate-200 rounded-2xl p-4">
            <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">{k.label}</span>
            <span className="text-lg font-black text-[#172B4D] block mt-1">{k.value}</span>
            <span className="text-[9px] text-slate-455 font-semibold block mt-1">{k.hint}</span>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-left text-xs font-semibold text-slate-600">
        <Info className="h-4 w-4 shrink-0 text-[#0B4F8C]" />
        Visitor and traffic numbers are not tracked here. Connect Google Analytics 4 (set NEXT_PUBLIC_GA_ID on the website) and view traffic and conversion rate there.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <TrendingUp className="h-4 w-4 text-teal-600" /> Revenue by day · last 7 days
          </h3>
          <div className="space-y-3">
            {week.map((d) => (
              <div key={d.key} className="flex items-center justify-between text-xs font-semibold">
                <span className={d.label === 'Today' ? 'font-extrabold text-teal-700' : 'text-slate-600'}>{d.label}</span>
                <span className="text-slate-400">{d.orders} order{d.orders === 1 ? '' : 's'}</span>
                <span className="w-24 text-right font-black text-slate-800">{inr(d.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 lg:col-span-2">
          <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Package className="h-4 w-4 text-teal-600" /> Sales by kit
          </h3>
          {byKit.length > 0 ? (
            <div className="space-y-4">
              {byKit.map(([name, t]) => (
                <Bar key={name} label={name} sub={`${t.units} sold · ${inr(t.revenue)} before coupons`} value={t.revenue} total={kitRevenue} color="bg-[#0B4F8C]" />
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-xs font-medium text-slate-450">No kits sold yet.</p>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <ListChecks className="h-4 w-4 text-[#0B4F8C]" /> Paid orders by status
          </h3>
          {byStatus.length > 0 ? (
            <div className="space-y-4">
              {byStatus.map(([status, n]) => (
                <Bar key={status} label={status} sub={`${n} order${n === 1 ? '' : 's'}`} value={n} total={paid.length} color="bg-[#0B4F8C]" />
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-xs font-medium text-slate-450">No paid orders yet.</p>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe className="h-4 w-4 text-teal-600" /> Top delivery cities
          </h3>
          {byCity.length > 0 ? (
            <div className="space-y-4">
              {byCity.map(([city, n]) => (
                <Bar key={city} label={city} sub={`${n} order${n === 1 ? '' : 's'}`} value={n} total={paid.length} />
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-xs font-medium text-slate-450">Not enough paid orders to show cities.</p>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Ticket className="h-4 w-4 text-amber-500" /> Top coupons
          </h3>
          {topCoupons.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {topCoupons.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2.5 text-xs font-semibold">
                  <span className="font-mono font-bold text-slate-800">{c.code}</span>
                  <span className="text-slate-500">{c.usages} use{c.usages === 1 ? '' : 's'}</span>
                  <span className="w-28 text-right text-emerald-600">-{inr(c.discountGiven)} given</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-xs font-medium text-slate-450">No coupons have been used yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
