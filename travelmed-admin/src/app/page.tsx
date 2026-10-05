'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Package, Layers, Pill, Users, Video, 
  Ticket, MessageSquare, BarChart3, Globe, Image as ImageIcon, Bell, 
  Settings, Lock, Clock, LogOut, ChevronLeft, ChevronRight, ChevronDown, Search, 
  AlertTriangle, Stethoscope
} from 'lucide-react';

// Modular view imports
import DashboardView from '@/features/admin/components/DashboardView';
import ProductsView, { toProductView } from '@/features/admin/components/ProductsView';
import MedicinesView from '@/features/admin/components/MedicinesView';
import OrdersView, { toOrderView } from '@/features/admin/components/OrdersView';
import type { AdminStats } from '@/features/admin/components/DashboardView';
import TeleconsultationView from '@/features/admin/components/TeleconsultationView';
import AnalyticsView from '@/features/admin/components/AnalyticsView';
import OtherViews from '@/features/admin/components/OtherViews';
import LoginView from '@/features/admin/components/LoginView';
import CategoriesView from '@/features/admin/components/CategoriesView';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const timeAgo = (iso: string) => {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  return hrs < 24 ? `${hrs}h ago` : `${Math.round(hrs / 24)}d ago`;
};

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
  const [medicineCategories, setMedicineCategories] = useState<any[]>([]);
  const [kitTypes, setKitTypes] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loadedAt, setLoadedAt] = useState(0);

  // Initialize token and load data
  useEffect(() => {
    const savedToken = localStorage.getItem('travelmed_admin_token');
    const savedName = localStorage.getItem('travelmed_admin_name');
    if (savedToken) {
      setToken(savedToken);
      if (savedName) setAdminName(savedName);
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('travelmed_admin_token');
    localStorage.removeItem('travelmed_admin_name');
    setToken(null);
  }, []);

  const loadDashboardData = useCallback(async (authToken: string) => {
    const auth = { headers: { Authorization: `Bearer ${authToken}` } };
    const get = async (path: string, withAuth = true) => {
      const res = await fetch(`${API_URL}${path}`, withAuth ? auth : undefined);
      if (res.status === 401) throw new Error('UNAUTHORIZED');
      if (!res.ok) return null;
      const body = await res.json().catch(() => null);
      return body?.data ?? null;
    };

    try {
      // Validate the session first so an expired token logs out cleanly.
      const me = await get('/api/auth/me');
      if (me?.user?.name) setAdminName(me.user.name);

      const [med, prod, ord, cons, docs, revs, coup, tick, logs, medCats, kTypes] = await Promise.all([
        get('/api/medicines', false),
        get('/api/products/admin/all'),
        get('/api/orders'),
        get('/api/consultations'),
        get('/api/doctors/admin/all'),
        get('/api/testimonials/admin/all'),
        get('/api/coupons'),
        get('/api/tickets'),
        get('/api/logs'),
        get('/api/medicine-categories/admin/all'),
        get('/api/kit-types/admin/all'),
      ]);

      setLoadedAt(Date.now());
      setMedicines(med ?? []);
      setProducts((prod ?? []).map(toProductView));
      setMedicineCategories(medCats ?? []);
      setKitTypes(kTypes ?? []);
      setOrders((ord ?? []).map(toOrderView));
      setBookings(cons ?? []);
      setDoctors(docs ?? []);
      setReviews(revs ?? []);
      setCoupons(coup ?? []);
      setTickets(tick ?? []);
      setActivityLogs(
        (logs ?? []).map((l: any) => ({
          id: l.id,
          user: l.user,
          action: l.action,
          changes: l.changes,
          timestamp: new Date(l.createdAt).toLocaleString(),
        }))
      );
    } catch (err) {
      if (err instanceof Error && err.message === 'UNAUTHORIZED') return handleLogout();
      console.error('Failed to load database records:', err);
    }
  }, [handleLogout]);

  useEffect(() => {
    if (token) {
      loadDashboardData(token);
    }
  }, [token, loadDashboardData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
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

  // ── HELPER FUNCTIONS ──
  const addActivityLog = async (action: string, changes: string) => {
    // DB Persistence
    try {
      const storedToken = token || localStorage.getItem('travelmed_admin_token');
      if (!storedToken) return;
      await fetch(`${API_URL}/api/logs`, {
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

  // ── REAL STATS (only paid orders count as sales) ──
  const stats: AdminStats = useMemo(() => {
    const paid = orders.filter((o) => o.paymentStatus === 'Paid');
    const earning = paid.filter((o) => o.status !== 'Cancelled' && o.status !== 'Refunded');
    const today = new Date().toDateString();
    const paidToday = earning.filter((o) => o.createdAt && new Date(o.createdAt).toDateString() === today);
    const revenueTotal = earning.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
    return {
      revenueToday: paidToday.reduce((sum, o) => sum + (Number(o.amount) || 0), 0),
      revenueTotal,
      paidOrdersToday: paidToday.length,
      paidOrders: paid.length,
      pendingOrders: paid.filter((o) => o.status === 'Pending' || o.status === 'Processing').length,
      unpaidCheckouts: orders.length - paid.length,
      kitsSold: earning.reduce((sum, o) => sum + o.medicines.reduce((q: number, m: any) => q + (Number(m.qty) || 0), 0), 0),
      openConsultations: bookings.filter((b) => b.status === 'New' || b.status === 'Contacted').length,
      openTickets: tickets.filter((t) => t.status === 'Open').length,
      avgOrderValue: earning.length ? Math.round(revenueTotal / earning.length) : 0,
    };
  }, [orders, bookings, tickets]);

  // ── REAL NOTIFICATIONS ──
  const notifications = useMemo(() => {
    const dayAgo = loadedAt - 24 * 60 * 60 * 1000;
    const items: { key: string; title: string; meta: string; tab: string; tone: 'info' | 'alert'; order?: any }[] = [];
    for (const o of orders) {
      if (o.paymentStatus === 'Paid' && o.createdAt && new Date(o.createdAt).getTime() >= dayAgo) {
        items.push({ key: `o-${o.id}`, title: `New paid order ${o.id} · ₹${Math.round(o.amount).toLocaleString('en-IN')}`, meta: `${o.customer} · ${timeAgo(o.createdAt)}`, tab: 'orders', tone: 'info', order: o });
      }
    }
    for (const b of bookings) {
      if (b.status === 'New') items.push({ key: `b-${b.id}`, title: `Consultation request for ${b.orderId}`, meta: `${b.symptom} · ${timeAgo(b.createdAt)}`, tab: 'teleconsultation', tone: 'info' });
    }
    for (const t of tickets) {
      if (t.status === 'Open') items.push({ key: `t-${t.id}`, title: `Open ticket: ${t.subject}`, meta: `${t.user} · ${timeAgo(t.createdAt)}`, tab: 'support tickets', tone: 'info' });
    }
    for (const p of products) {
      if (Number(p.stock) <= 10) items.push({ key: `p-${p.id}`, title: `Low stock: ${p.name} (${p.stock} left)`, meta: 'Product stock', tab: 'products', tone: 'alert' });
    }
    return items;
  }, [orders, bookings, tickets, products, loadedAt]);

  const initials = adminName.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || 'A';

  const openOrderById = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    setSelectedOrder(order ?? null);
    setActiveTab('orders');
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
        { id: 'products', label: 'Kits', icon: Package },
        { id: 'medicines', label: 'Medicines', icon: Pill },
        { id: 'categories', label: 'Categories', icon: Layers }
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
      <LoginView
        email={loginEmail}
        setEmail={setLoginEmail}
        password={loginPassword}
        setPassword={setLoginPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        loading={loginLoading}
        error={loginError}
        onSubmit={handleLogin}
      />
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
                {initials}
              </div>
              {!sidebarCollapsed && (
                <div className="leading-tight min-w-0">
                  <p className="text-sm font-extrabold text-[#172B4D] truncate">{adminName}</p>
                  <p className="text-[10px] font-bold text-slate-400 capitalize truncate">Administrator</p>
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
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-slate-500">Connected to database</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 hover:bg-slate-50 rounded-xl border border-slate-200 text-slate-455 hover:text-slate-850 cursor-pointer relative transition"
              >
                <Bell className="h-4.5 w-4.5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                )}
              </button>

              {/* Notification dropdown menu */}
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 text-xs text-left">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-150 flex justify-between items-center font-bold">
                      <span className="text-slate-800">Notifications</span>
                      <span className="text-[10px] text-[#0B4F8C] uppercase">Last 24h &amp; open items</span>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                      {notifications.map((n) => (
                        <button
                          key={n.key}
                          type="button"
                          onClick={() => {
                            if (n.order) setSelectedOrder(n.order);
                            setActiveTab(n.tab);
                            setNotificationsOpen(false);
                          }}
                          className="block w-full p-4 text-left hover:bg-slate-50/50 transition cursor-pointer"
                        >
                          <p className={`font-bold flex items-center gap-1 ${n.tone === 'alert' ? 'text-rose-600' : 'text-slate-700'}`}>
                            {n.tone === 'alert' && <AlertTriangle className="h-3.5 w-3.5 shrink-0" />}
                            {n.tab === 'teleconsultation' && <Stethoscope className="h-3.5 w-3.5 shrink-0 text-teal-600" />}
                            {n.title}
                          </p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{n.meta}</p>
                        </button>
                      ))}
                      {notifications.length === 0 && <p className="p-6 text-center font-semibold text-slate-400">You&apos;re all caught up.</p>}
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
              products={products}
              bookings={bookings}
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
              medicines={medicines}
              medicineCategories={medicineCategories}
              kitTypes={kitTypes}
            />
          )}

          {activeTab === 'medicines' && (
            <MedicinesView 
              medicines={medicines}
              setMedicines={setMedicines}
              addActivityLog={addActivityLog}
              medicineCategories={medicineCategories}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersView 
              orders={orders} 
              setOrders={setOrders} 
              addActivityLog={addActivityLog}
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
              bookings={bookings}
            />
          )}

          {activeTab === 'teleconsultation' && (
            <TeleconsultationView 
              bookings={bookings} 
              setBookings={setBookings}
              doctors={doctors}
              setDoctors={setDoctors}
              addActivityLog={addActivityLog}
              onOpenOrder={openOrderById}
              onRefresh={() => token && loadDashboardData(token)}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesView
              kitTypes={kitTypes}
              setKitTypes={setKitTypes}
              medicineCategories={medicineCategories}
              setMedicineCategories={setMedicineCategories}
              addActivityLog={addActivityLog}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView stats={stats} orders={orders} coupons={coupons} />
          )}

          {/* Aggregated settings & details views */}
          {[
            'inventory', 'customers', 'coupons', 
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
