import React from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Clock, 
  Activity, Users, Percent, Pill, AlertTriangle, MessageSquare, 
  Star, ArrowRight, ShieldAlert, Award, ChevronRight, CheckCircle2
} from 'lucide-react';

interface DashboardViewProps {
  stats: {
    revenueToday: number;
    ordersCount: number;
    pendingOrders: number;
    medicinesSold: number;
    activeConsultations: number;
    visitorsToday: number;
    conversionRate: number;
    avgOrderValue: number;
  };
  orders: any[];
  medicines: any[];
  reviews: any[];
  tickets: any[];
  setActiveTab: (tab: string) => void;
  setSelectedOrder: (order: any) => void;
}

export default function DashboardView({
  stats,
  orders,
  medicines,
  reviews,
  tickets,
  setActiveTab,
  setSelectedOrder,
}: DashboardViewProps) {
  
  // Calculate low stock items
  const lowStockItems = medicines.filter(m => m.stock < 10);
  
  // Custom SVG Sparkline for KPI cards
  const renderSparkline = (points: number[], color: string) => {
    const width = 100;
    const height = 30;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;
    
    const coordinates = points.map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * height;
      return `${x},${y}`;
    });
    
    const pathData = `M ${coordinates.join(' L ')}`;
    const areaData = `${pathData} L ${width},${height} L 0,${height} Z`;
    
    return (
      <svg className="w-24 h-8 shrink-0 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`sparkGrad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaData} fill={`url(#sparkGrad-${color.replace('#', '')})`} />
        <path d={pathData} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  return (
    <div className="space-y-6 text-slate-650">
      
      {/* ── KPI METRICS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Revenue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition duration-300 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Revenue Today</span>
              <h3 className="text-2xl font-extrabold text-[#172B4D] tracking-tight">₹{stats.revenueToday.toLocaleString()}</h3>
            </div>
            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl group-hover:scale-110 transition duration-300">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition duration-300 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Orders Today</span>
              <h3 className="text-2xl font-extrabold text-[#172B4D] tracking-tight">{stats.ordersCount}</h3>
            </div>
            <div className="p-2.5 bg-blue-50 text-[#0B4F8C] rounded-xl group-hover:scale-110 transition duration-300">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Medicines Sold */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition duration-300 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Medicines Sold</span>
              <h3 className="text-2xl font-extrabold text-[#172B4D] tracking-tight">{stats.medicinesSold}</h3>
            </div>
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl group-hover:scale-110 transition duration-300">
              <Pill className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Active Teleconsultations */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition duration-300 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Bookings</span>
              <h3 className="text-2xl font-extrabold text-[#172B4D] tracking-tight">{stats.activeConsultations}</h3>
            </div>
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl group-hover:scale-110 transition duration-300">
              <Activity className="h-5 w-5" />
            </div>
          </div>
        </div>

      </div>

      {/* ── ADDITIONAL SUB-KPI ROW ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div onClick={() => setActiveTab('support tickets')} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-slate-300 hover:shadow-sm transition cursor-pointer">
          <div className="text-left">
            <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Open Support Tickets</p>
            <p className="text-lg font-black text-slate-800 mt-0.5">{tickets.filter(t => t.status === 'Open').length}</p>
          </div>
          <MessageSquare className="h-4 w-4 text-slate-400" />
        </div>
        <div onClick={() => setActiveTab('inventory')} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-slate-300 hover:shadow-sm transition cursor-pointer">
          <div className="text-left">
            <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Low Stock Alerts</p>
            <p className="text-lg font-black text-rose-600 mt-0.5">{medicines.filter(m => m.stock < 25).length}</p>
          </div>
          <AlertTriangle className="h-4 w-4 text-rose-500" />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-slate-300 transition">
          <div className="text-left">
            <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Avg Order Value</p>
            <p className="text-lg font-black text-slate-800 mt-0.5">₹{stats.avgOrderValue.toLocaleString()}</p>
          </div>
          <DollarSign className="h-4 w-4 text-slate-400" />
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-slate-300 transition">
          <div className="text-left">
            <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Pending Orders</p>
            <p className="text-lg font-black text-rose-600 mt-0.5">{stats.pendingOrders}</p>
          </div>
          <Clock className="h-4 w-4 text-rose-500 animate-pulse" />
        </div>
      </div>

      {/* ── CHARTS SECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-teal-600" /> Weekly Revenue Trend
            </h3>
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
              Avg ₹{stats.avgOrderValue.toLocaleString('en-IN')} / Order
            </span>
          </div>
          <div className="h-64 w-full bg-slate-50/50 rounded-xl border border-slate-200/50 relative flex flex-col justify-end p-4">
            <svg className="w-full h-[80%] overflow-visible" viewBox="0 0 500 150">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Horizontal gridlines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4" />

              {/* Path coordinates */}
              <path 
                d="M 10,120 L 90,110 L 170,125 L 250,90 L 330,60 L 410,75 L 490,40 L 490,150 L 10,150 Z" 
                fill="url(#chartGrad)" 
              />
              <path 
                d="M 10,120 L 90,110 L 170,125 L 250,90 L 330,60 L 410,75 L 490,40" 
                fill="none" 
                stroke="#14B8A6" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              {/* Interactive Dots */}
              <circle cx="10" cy="120" r="4.5" fill="#ffffff" stroke="#14B8A6" strokeWidth="2.5" />
              <circle cx="90" cy="110" r="4.5" fill="#ffffff" stroke="#14B8A6" strokeWidth="2.5" />
              <circle cx="170" cy="125" r="4.5" fill="#ffffff" stroke="#14B8A6" strokeWidth="2.5" />
              <circle cx="250" cy="90" r="4.5" fill="#ffffff" stroke="#14B8A6" strokeWidth="2.5" />
              <circle cx="330" cy="60" r="4.5" fill="#ffffff" stroke="#14B8A6" strokeWidth="2.5" />
              <circle cx="410" cy="75" r="4.5" fill="#ffffff" stroke="#14B8A6" strokeWidth="2.5" />
              <circle cx="490" cy="40" r="5" fill="#14B8A6" stroke="#ffffff" strokeWidth="2" />
            </svg>
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-4 px-2 uppercase tracking-wider">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span className="text-teal-600 font-extrabold">Today</span>
            </div>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-blue-600" /> Weekly Order Frequency
            </h3>
            <span className="text-xs font-bold text-[#0B4F8C] bg-blue-50 px-2.5 py-1 rounded-full">
              {stats.ordersCount} Total Orders
            </span>
          </div>
          <div className="h-64 w-full bg-slate-50/50 rounded-xl border border-slate-200/50 relative flex flex-col justify-end p-4">
            <div className="flex items-end justify-between h-[80%] px-4 w-full relative">
              <div className="absolute inset-x-0 top-0 border-t border-slate-200/50 border-dashed w-full" />
              <div className="absolute inset-x-0 top-1/2 border-t border-slate-200/50 border-dashed w-full" />

              {/* Bars */}
              <div className="flex flex-col items-center w-8">
                <div className="w-6 bg-slate-200 rounded-t-lg transition-all duration-500 hover:bg-slate-300" style={{ height: '70px' }} />
              </div>
              <div className="flex flex-col items-center w-8">
                <div className="w-6 bg-slate-200 rounded-t-lg transition-all duration-500 hover:bg-slate-300" style={{ height: '90px' }} />
              </div>
              <div className="flex flex-col items-center w-8">
                <div className="w-6 bg-slate-200 rounded-t-lg transition-all duration-500 hover:bg-slate-300" style={{ height: '80px' }} />
              </div>
              <div className="flex flex-col items-center w-8">
                <div className="w-6 bg-slate-200 rounded-t-lg transition-all duration-500 hover:bg-slate-300" style={{ height: '110px' }} />
              </div>
              <div className="flex flex-col items-center w-8">
                <div className="w-6 bg-[#0B4F8C]/40 rounded-t-lg transition-all duration-500 hover:bg-[#0B4F8C]/60" style={{ height: '130px' }} />
              </div>
              <div className="flex flex-col items-center w-8">
                <div className="w-6 bg-[#0B4F8C]/60 rounded-t-lg transition-all duration-500 hover:bg-[#0B4F8C]/80" style={{ height: '125px' }} />
              </div>
              <div className="flex flex-col items-center w-8">
                <div className="w-6 bg-[#0B4F8C] rounded-t-lg shadow-sm" style={{ height: '145px' }} />
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-4 px-2 uppercase tracking-wider">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span className="text-[#0B4F8C] font-extrabold">Today</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── LOWER CONTENT GRID: ORDERS & LOGISTICS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Latest Orders */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-teal-600" /> Recent Activity Logs
            </h3>
            <button 
              onClick={() => setActiveTab('orders')}
              className="text-xs text-[#0B4F8C] font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
            >
              Manage Orders <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Country</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                {orders.slice(0, 5).map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => {
                      setSelectedOrder(order);
                      setActiveTab('orders');
                    }}
                    className="hover:bg-slate-50/50 transition cursor-pointer"
                  >
                    <td className="py-3 px-4 text-[#0B4F8C] font-bold">#{order.id}</td>
                    <td className="py-3 px-4 font-extrabold text-[#172B4D]">{order.customer}</td>
                    <td className="py-3 px-4 text-slate-500">{order.country}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2.5 py-0.5 text-[9px] font-bold rounded-full border uppercase ${
                        order.status === 'Delivered' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : order.status === 'Pending'
                          ? 'bg-amber-55/60 text-amber-600 border-amber-200/60'
                          : 'bg-rose-50 text-rose-600 border-rose-200'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-800 font-black">₹{order.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="h-4.5 w-4.5 text-rose-500" /> Critical Stock Items
          </h3>
          
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {lowStockItems.length > 0 ? (
              lowStockItems.map((med) => (
                <div key={med.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="space-y-0.5 text-left">
                    <p className="text-xs font-bold text-slate-700">{med.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{med.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex px-2 py-0.5 text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-200 rounded-full">
                      {med.stock} left
                    </span>
                    <p className="text-[9px] text-slate-400 font-bold mt-1">Exp: {med.expiry}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs font-medium">
                No low stock alerts today.
              </div>
            )}
          </div>
          <button 
            onClick={() => setActiveTab('inventory')}
            className="w-full text-center py-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs text-slate-600 font-bold rounded-xl transition cursor-pointer"
          >
            Review Inventory Registers
          </button>
        </div>

      </div>

      {/* ── LAST ROW: REVIEWS, NOTIFICATIONS & TICKETS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Recent Reviews */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" /> Recent User Reviews
            </h3>
            <button 
              onClick={() => setActiveTab('reviews')}
              className="text-xs text-[#0B4F8C] font-bold hover:underline cursor-pointer"
            >
              Moderate
            </button>
          </div>
          <div className="space-y-3.5">
            {reviews.slice(0, 2).map((rev) => (
              <div key={rev.id} className="border-b border-slate-100 pb-3.5 last:border-none last:pb-0 space-y-1.5 text-xs text-left">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-700">{rev.customer}</span>
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-slate-500 italic">"{rev.review}"</p>
                <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                  <span>{rev.date}</span>
                  <span className={`uppercase font-bold ${rev.status === 'Approved' ? 'text-teal-600' : 'text-amber-600'}`}>{rev.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Tickets Overview */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-sky-600" /> Support Desk
            </h3>
            <button 
              onClick={() => setActiveTab('support tickets')}
              className="text-xs text-[#0B4F8C] font-bold hover:underline cursor-pointer"
            >
              Reply
            </button>
          </div>
          <div className="space-y-3">
            {tickets.length > 0 ? (
              tickets.slice(0, 3).map((t) => (
                <div key={t.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
                  <div className="space-y-0.5 text-left">
                    <p className="font-bold text-slate-700 truncate max-w-[150px]">{t.subject}</p>
                    <p className="text-[9px] text-slate-400 font-bold">By {t.customer}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-0.5 text-[9px] font-bold rounded-full uppercase border ${
                      t.priority === 'High' 
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : t.priority === 'Medium'
                        ? 'bg-amber-50 text-amber-600 border-amber-200'
                        : 'bg-slate-100 text-slate-550 border-slate-200'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-5 text-center text-slate-400">
                <MessageSquare className="h-6 w-6 mb-2 opacity-20" />
                <p className="text-[10px] font-semibold">No pending support tickets.</p>
              </div>
            )}
          </div>
        </div>

        {/* Teleconsultation Summary List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-650" /> Live Diagnostics
            </h3>
            <button 
              onClick={() => setActiveTab('teleconsultation')}
              className="text-xs text-[#0B4F8C] font-bold hover:underline cursor-pointer"
            >
              Consult
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400">
               <Activity className="h-8 w-8 mb-2 opacity-20" />
               <p className="text-xs font-semibold">No active live diagnostics right now.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
