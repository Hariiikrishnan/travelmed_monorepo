'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Package, Layers, Pill, Users, Video, 
  Ticket, MessageSquare, BarChart3, Globe, Image as ImageIcon, Bell, 
  Settings, Lock, Clock, LogOut, ChevronLeft, ChevronRight, ChevronDown, Search, 
  ShieldCheck, AlertTriangle, ArrowUpRight, ShieldAlert, Mail, Eye, EyeOff
} from 'lucide-react';

// Modular view imports
import DashboardView from '@/features/admin/components/DashboardView';
import ProductsView from '@/features/admin/components/ProductsView';
import MedicinesView from '@/features/admin/components/MedicinesView';
import OrdersView from '@/features/admin/components/OrdersView';
import TeleconsultationView from '@/features/admin/components/TeleconsultationView';
import AnalyticsView from '@/features/admin/components/AnalyticsView';
import OtherViews from '@/features/admin/components/OtherViews';

export default function AdminDashboardPage() {
  const [token, setToken] = useState<string | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [adminName, setAdminName] = useState('System Admin');
  
  // Track the expanded group in the sidebar
  const [expandedGroup, setExpandedGroup] = useState<string | null>('CORE');

  // ── CENTRALIZED STATE DATABASE ──
  const [medicines, setMedicines] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Initialize token and load data
  useEffect(() => {
    const savedToken = localStorage.getItem('travelmed_admin_token');
    const savedName = localStorage.getItem('travelmed_admin_name');
    if (savedToken) {
      setToken(savedToken);
      if (savedName) setAdminName(savedName);
    }
  }, []);

  const loadDashboardData = async (authToken: string) => {
    try {
      // 1. Fetch Medicines
      const medRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/medicines`);
      const medBody = await medRes.json();
      if (medRes.ok) setMedicines(medBody.data);

      // 2. Fetch Doctors
      const docRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/doctors`);
      const docBody = await docRes.json();
      if (docRes.ok) setDoctors(docBody.data);

      // 3. Fetch Testimonials (Reviews)
      const revRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/testimonials`);
      if (revRes.ok) {
        const revBody = await revRes.json();
        setReviews(revBody.data);
      } else {
        setReviews([]);
      }

      // 4. Fetch Orders
      const ordRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const ordBody = await ordRes.json();
      if (ordRes.ok) {
        const formattedOrders = ordBody.data.map((o: any) => ({
          id: o.orderId,
          customer: o.shippingFullName,
          email: o.shippingEmail || 'customer@travelmed.com',
          phone: o.shippingPhone || 'N/A',
          country: o.shippingCountry,
          payment: 'Razorpay',
          shipping: 'Standard',
          status: o.status,
          tracking: o.trackingNumber,
          amount: o.total,
          medicines: o.items.map((item: any) => ({
            name: item.name,
            qty: item.quantity,
            price: item.price
          }))
        }));
        setOrders(formattedOrders);
      }

      // 5. Fetch Coupons
      const coupRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/coupons`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (coupRes.ok) {
        const coupBody = await coupRes.json();
        setCoupons(coupBody.data);
      } else {
        setCoupons([]);
      }

      // 6. Fetch Tickets
      const tickRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/tickets`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (tickRes.ok) {
        const tickBody = await tickRes.json();
        setTickets(tickBody.data);
      } else {
        setTickets([]);
      }

      setBookings([]); // Scrubbed Mock Bookings

      // Fetches for Admins have been removed per request.

      // 8. Fetch Logs
      const logRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/logs`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (logRes.ok) {
        const logBody = await logRes.json();
        const formattedLogs = logBody.data.map((l: any) => ({
          id: l.id,
          user: l.user,
          action: l.action,
          changes: l.changes,
          timestamp: new Date(l.createdAt).toLocaleString()
        }));
        setActivityLogs(formattedLogs);
      } else {
        setActivityLogs([]);
      }
    } catch (err) {
      console.error('Failed to load database records:', err);
    }
  };

  useEffect(() => {
    if (token) {
      loadDashboardData(token);
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.message || 'Authentication failed. Please check your credentials.');
      }
      localStorage.setItem('travelmed_admin_token', body.data.token);
      localStorage.setItem('travelmed_admin_name', body.data.user.name);
      setToken(body.data.token);
      setAdminName(body.data.user.name);
    } catch (err: any) {
      setLoginError(err.message || 'Unable to connect to the backend server.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('travelmed_admin_token');
    localStorage.removeItem('travelmed_admin_name');
    setToken(null);
  };

  // ── HELPER FUNCTIONS ──
  const addActivityLog = async (action: string, changes: string) => {
    // DB Persistence
    try {
      const storedToken = token || localStorage.getItem('travelmed_admin_token');
      if (!storedToken) return;
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${storedToken}` },
        body: JSON.stringify({ action, changes })
      });
      
      // Load latest dashboard data to sync logs
      loadDashboardData(storedToken);
    } catch(err) {
      console.error(err);
    }
  };

  // Synchronize stats based on datasets
  const stats = {
    revenueToday: orders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + o.amount, 0),
    ordersCount: orders.length,
    pendingOrders: orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length,
    medicinesSold: medicines.reduce((sum, m) => sum + (m.stock < 100 ? (100 - m.stock) : 0), 24),
    activeConsultations: bookings.filter(b => b.status === 'Today').length,
    visitorsToday: 2418,
    conversionRate: 4.8,
    avgOrderValue: Math.round(orders.reduce((sum, o) => sum + o.amount, 0) / orders.length) || 0
  };

  const menuGroups = [
    {
      title: 'CORE',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 }
      ]
    },
    {
      title: 'CATALOG & STOCK',
      items: [
        { id: 'products', label: 'Products', icon: Package },
        { id: 'medicines', label: 'Medicines', icon: Pill }
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'teleconsultation', label: 'Telehealth', icon: Video },
        { id: 'coupons', label: 'Campaigns', icon: Ticket }
      ]
    },
    {
      title: 'CUSTOMERS & DESK',
      items: [
        { id: 'reviews', label: 'Reviews Mod', icon: MessageSquare },
        { id: 'support tickets', label: 'Support Desk', icon: MessageSquare }
      ]
    },
    {
      title: 'SYSTEM CONTROL',
      items: [
        { id: 'activity logs', label: 'Security Audit', icon: Clock }
      ]
    }
  ];

  // Automatically expand the parent menu group when the active tab shifts
  useEffect(() => {
    const groupToExpand = menuGroups.find(group => 
      group.items.some(item => item.id === activeTab)
    );
    if (groupToExpand) {
      setExpandedGroup(groupToExpand.title);
    }
  }, [activeTab]);

  if (!token) {
    return (
      <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans justify-center items-center p-6 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-50/50 rounded-full blur-3xl" />

        <div className="max-w-md w-full relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-block bg-blue-50 border border-blue-100 text-blue-600 font-bold py-1 px-3 rounded-full text-xs">
              System Control Portal
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              TravelMed Administrator
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Authorized personnel only. Audit logs are active.
            </p>
          </div>

          <div className="p-8 bg-white border border-slate-200 shadow-xl rounded-3xl space-y-5">
            <form onSubmit={handleLogin} className="space-y-5">
              {loginError && (
                <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 flex items-start gap-2.5 font-semibold">
                  <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-slate-450 uppercase tracking-wider block">
                  Administrator Username / Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@travelmed.com"
                    className="w-full px-4 py-2.5 pl-9 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition font-medium text-slate-800"
                  />
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-450" />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black text-slate-450 uppercase tracking-wider block">
                  Security Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 pl-9 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition font-medium text-slate-800"
                  />
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-450" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-450 hover:text-slate-650 cursor-pointer focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/10 transition-all flex justify-center items-center gap-2 cursor-pointer"
              >
                {loginLoading ? (
                  'Verifying Authority...'
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Authenticate Securely</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] font-sans">
      
      {/* ── SIDEBAR NAVIGATION ── */}
      <aside 
        className={`bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        
        {/* Brand Header */}
        <div className="h-[68px] px-6 border-b border-slate-100 flex items-center justify-between">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2.5 text-left">
              <div className="h-8 w-8 bg-[#0B4F8C] text-white rounded-xl flex items-center justify-center font-black shadow-[0_4px_12px_rgba(11,79,140,0.2)]">
                TM
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-heading font-extrabold text-[#172B4D] text-base tracking-tight">
                  Travel<span className="text-[#14B8A6]">Med</span>
                </span>
                <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">
                  ADMIN CONSOLE
                </span>
              </div>
            </div>
          ) : (
            <div className="h-8 w-8 bg-[#0B4F8C] text-white rounded-xl flex items-center justify-center font-black mx-auto">
              T
            </div>
          )}

          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 cursor-pointer hidden md:block"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Scrollable menu links */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-3 space-y-4">
          {menuGroups.map((group, gIdx) => {
            const isExpanded = expandedGroup === group.title;
            
            return (
              <div key={gIdx} className="space-y-1">
                {!sidebarCollapsed ? (
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedGroup(prev => prev === group.title ? null : group.title);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left group/hdr cursor-pointer"
                  >
                    <span className="text-[11px] font-extrabold text-slate-400 group-hover/hdr:text-slate-800 uppercase tracking-wider">
                      {group.title}
                    </span>
                    <ChevronDown 
                      className={`h-3.5 w-3.5 text-slate-400 group-hover/hdr:text-slate-800 transition-transform duration-200 ${
                        isExpanded ? 'rotate-0' : '-rotate-90'
                      }`} 
                    />
                  </button>
                ) : null}

                {/* Sub-items container */}
                <div 
                  className={`space-y-0.5 transition-all duration-300 overflow-hidden ${
                    sidebarCollapsed || isExpanded 
                      ? 'max-h-[350px] opacity-100' 
                      : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (item.id === 'orders') setSelectedOrder(null);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer relative group ${
                        activeTab === item.id 
                          ? 'bg-[#0B4F8C] text-white shadow-[0_4px_12px_rgba(11,79,140,0.15)] font-bold' 
                          : 'text-slate-550 hover:text-slate-950 hover:bg-slate-50'
                      } ${sidebarCollapsed ? 'justify-center' : 'justify-start'}`}
                    >
                      {/* Left side active hover indicator */}
                      {activeTab !== item.id && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#14B8A6] rounded-r transition-all duration-300 group-hover:h-5" />
                      )}
                      
                      <item.icon className={`h-4.5 w-4.5 shrink-0 transition-transform duration-300 ${
                        activeTab === item.id 
                          ? 'text-white' 
                          : 'text-slate-400 group-hover:text-slate-800 group-hover:scale-110'
                      }`} />
                      
                      {!sidebarCollapsed && (
                        <span className="transition-all duration-200 group-hover:translate-x-0.5">{item.label}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* User profile section */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 text-left">
              <div className="h-9 w-9 rounded-xl bg-[#EEF6FF] border border-blue-100 flex items-center justify-center font-bold text-[#0B4F8C] shrink-0">
                VS
              </div>
              {!sidebarCollapsed && (
                <div className="leading-tight min-w-0">
                  <p className="text-sm font-extrabold text-[#172B4D] truncate">{adminName}</p>
                  <p className="text-[10px] font-bold text-slate-400 capitalize truncate">Super Admin Profile</p>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button 
                onClick={handleLogout}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            )}
          </div>
        </div>

      </aside>

      {/* ── MAIN WORKSPACE CONTAINER ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* TOP BAR */}
        <header className="h-[68px] bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 z-20">
          
          {/* Breadcrumbs path */}
          <div className="flex items-center gap-2 text-sm font-bold text-slate-400 text-left">
            <span className="hover:text-slate-600 transition-colors">Travel Med Admin</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-slate-800 capitalize font-extrabold">{activeTab}</span>
          </div>

          {/* Controls bar */}
          <div className="flex items-center gap-4 relative">
            
            {/* System Status Pill */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3.5 py-1.5 text-xs font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-slate-500">Operations Shield Active</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 hover:bg-slate-50 rounded-xl border border-slate-200 text-slate-455 hover:text-slate-850 cursor-pointer relative transition"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              </button>

              {/* Notification dropdown menu */}
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 text-xs text-left">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-150 flex justify-between items-center font-bold">
                      <span className="text-slate-800">Recent Alert Feeds</span>
                      <span className="text-[10px] text-[#0B4F8C] uppercase">Real-Time</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      <div className="p-4 hover:bg-slate-50/50 transition cursor-pointer" onClick={() => { setActiveTab('orders'); setNotificationsOpen(false); }}>
                        <p className="font-bold text-slate-700">New COD Order #1089 received</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Order event · 3m ago</p>
                      </div>
                      <div className="p-4 hover:bg-slate-50/50 transition cursor-pointer" onClick={() => { setActiveTab('inventory'); setNotificationsOpen(false); }}>
                        <p className="font-bold text-rose-600 flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Low Stock Alert: Ibuprofen</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Stock event · 1h ago</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

        </header>

        {/* VIEW SCROLLER */}
        <main className="flex-1 overflow-y-auto px-6 py-6 min-w-0 bg-[#F8FAFC]">
          
          {activeTab === 'dashboard' && (
            <DashboardView 
              stats={stats} 
              orders={orders} 
              medicines={medicines}
              reviews={reviews}
              tickets={tickets}
              setActiveTab={setActiveTab}
              setSelectedOrder={setSelectedOrder}
            />
          )}

          {activeTab === 'products' && (
            <ProductsView 
              products={products} 
              setProducts={setProducts} 
              addActivityLog={addActivityLog}
            />
          )}

          {activeTab === 'medicines' && (
            <MedicinesView 
              medicines={medicines}
              setMedicines={setMedicines}
              addActivityLog={addActivityLog}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersView 
              orders={orders} 
              setOrders={setOrders} 
              addActivityLog={addActivityLog}
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
            />
          )}

          {activeTab === 'teleconsultation' && (
            <TeleconsultationView 
              bookings={bookings} 
              setBookings={setBookings}
              doctors={doctors}
              setDoctors={setDoctors}
              addActivityLog={addActivityLog}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView stats={stats} />
          )}

          {/* Aggregated settings & details views */}
          {[
            'inventory', 'categories', 'customers', 'coupons', 
            'reviews', 'content', 'media library', 'notifications', 
            'support tickets', 'settings', 'admins', 'activity logs'
          ].includes(activeTab) && (
            <OtherViews 
              view={activeTab}
              orders={orders}
              medicines={medicines}
              setMedicines={setMedicines}
              reviews={reviews}
              setReviews={setReviews}
              tickets={tickets}
              setTickets={setTickets}
              coupons={coupons}
              setCoupons={setCoupons}
              activityLogs={activityLogs}
              addActivityLog={addActivityLog}
            />
          )}

        </main>

      </div>

    </div>
  );
}
