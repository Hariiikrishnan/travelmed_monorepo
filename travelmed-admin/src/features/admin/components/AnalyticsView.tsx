import React from 'react';
import { 
  TrendingUp, Globe, Monitor, Smartphone, Tablet, Activity, Percent 
} from 'lucide-react';

interface AnalyticsViewProps {
  stats: {
    revenueToday: number;
    ordersCount: number;
    visitorsToday: number;
    conversionRate: number;
    avgOrderValue: number;
  };
  orders?: any[];
}

export default function AnalyticsView({ stats, orders = [] }: AnalyticsViewProps) {
  
  const cityCount = orders.reduce((acc, obj) => {
    const c = obj.city || 'Unknown Region';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCities = (Object.entries(cityCount) as [string, number][]).sort((a, b) => b[1] - a[1]);
  
  return (
    <div className="space-y-6 text-slate-650">
      
      {/* HEADER SECTION */}
      <div className="border-b border-slate-200 pb-4 text-left">
        <h2 className="text-xl font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
          <Activity className="h-5 w-5 text-teal-650" /> Executive Analytics & Traffic Funnels
        </h2>
        <p className="text-xs text-slate-400 mt-1">Deep-dive customer behavior analysis, device profiles, and traffic conversions.</p>
      </div>

      {/* METRIC SUMMARIES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-left">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-sm transition">
          <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Gross Sales (Total)</span>
          <span className="text-lg font-black text-[#172B4D] block mt-1">₹{stats.revenueToday.toLocaleString('en-IN')}</span>
          <span className="text-[9px] text-slate-450 font-semibold block mt-1">Total accumulated revenue</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-sm transition">
          <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Total Orders</span>
          <span className="text-lg font-black text-rose-600 block mt-1">{stats.ordersCount}</span>
          <span className="text-[9px] text-slate-455 font-semibold block mt-1">Paid and pending orders</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-sm transition">
          <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Average Order Value</span>
          <span className="text-lg font-black text-slate-800 block mt-1">₹{stats.avgOrderValue.toLocaleString('en-IN')}</span>
          <span className="text-[9px] text-slate-455 font-semibold block mt-1">Derived natively</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-sm transition">
          <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Store Visitors</span>
          <span className="text-lg font-black text-slate-700 block mt-1">{stats.visitorsToday.toLocaleString()}</span>
          <span className="text-[9px] text-slate-455 font-semibold block mt-1">Simulated hit traffic</span>
        </div>
      </div>

      {/* REGIONAL HOTSPOTS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
          <Globe className="h-4 w-4 text-teal-600" /> Regional Shipping Hotspots
        </h3>
        
        {sortedCities.length > 0 ? (
          <div className="space-y-4">
            {sortedCities.map(([city, count]) => {
              const perc = Math.round((count / orders.length) * 100);
              return (
                <div key={city} className="flex justify-between items-center text-xs">
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-slate-800">{city}</span>
                    <span className="text-[9px] text-slate-450 uppercase font-bold">{count} order{count > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 sm:w-48 h-2 bg-slate-100 rounded-full overflow-hidden shrink-0">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: `${perc}%` }}></div>
                    </div>
                    <span className="font-black text-slate-700 w-10 text-right">{perc}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center text-slate-450 font-medium text-xs">
            Not enough regional order data to map shipping hotspots.
          </div>
        )}
      </div>
      
    </div>
  );
}
