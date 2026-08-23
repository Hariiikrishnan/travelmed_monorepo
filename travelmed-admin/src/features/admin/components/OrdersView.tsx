import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingCart, Search, Printer, X, MapPin, User, FileText, Truck, 
  CreditCard, Clock, CheckCircle2, Filter, ClipboardCheck, Copy, Check
} from 'lucide-react';

interface OrdersViewProps {
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  addActivityLog: (action: string, changes: string) => void;
  selectedOrder: any;
  setSelectedOrder: (order: any) => void;
}

export default function OrdersView({
  orders,
  setOrders,
  addActivityLog,
  selectedOrder,
  setSelectedOrder,
}: OrdersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  
  // Transition and Copy confirmation states
  const [animateIn, setAnimateIn] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (selectedOrder) {
      const timer = setTimeout(() => setAnimateIn(true), 50);
      return () => clearTimeout(timer);
    } else {
      setAnimateIn(false);
    }
  }, [selectedOrder]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Slide Over Drawer Details
  const isDrawerOpen = !!selectedOrder;

  const customerEmail = selectedOrder
    ? selectedOrder.email || `${selectedOrder.customer.toLowerCase().replace(/[^a-z]/g, '')}@gmail.com`
    : '';

  const customerInitials = selectedOrder
    ? selectedOrder.customer.split(' ').map((n: string) => n[0]).join('')
    : '';

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.id.includes(searchTerm) || 
                            o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            o.phone.includes(searchTerm) ||
                            o.country.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                            (statusFilter === 'Pending' && o.status === 'Pending') ||
                            (statusFilter === 'Delivered' && o.status === 'Delivered') ||
                            (statusFilter === 'Cancelled' && o.status === 'Cancelled') ||
                            (statusFilter === 'Refunded' && o.status === 'Refunded');
      
      const matchesPayment = paymentFilter === 'all' || 
                             (paymentFilter === 'COD' && o.payment === 'COD') ||
                             (paymentFilter === 'Online' && o.payment.startsWith('Razorpay')) ||
                             (paymentFilter === 'International' && o.shipping === 'Express DHL Global');

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    addActivityLog('Order Status Updated', `Updated order #${id} status to ${newStatus}`);

    const token = localStorage.getItem('travelmed_admin_token');
    if (token) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        });
        if (!response.ok) {
          const body = await response.json();
          console.error('Failed to update order status in database:', body.message);
        }
      } catch (err) {
        console.error('Failed to connect to backend for order status update:', err);
      }
    }
  };

  const handleRefund = async (id: string, amount: number) => {
    if (confirm(`Process full refund of ₹${amount.toLocaleString()} for order #${id}?`)) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Refunded' } : o));
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status: 'Refunded' });
      }
      addActivityLog('Refund Issued', `Issued refund of ₹${amount} for order #${id}`);
      
      const token = localStorage.getItem('travelmed_admin_token');
      if (token) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/orders/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status: 'Refunded' })
          });
        } catch(err) {
          console.error(err);
        }
      }
      
      alert(`Refund of ₹${amount.toLocaleString()} processed successfully.`);
    }
  };

  const mockPrint = (type: string, id: string) => {
    alert(`Mocking Print: Generating and opening print dialog for ${type} (Order #${id}).`);
  };

  return (
    <div className="space-y-6 relative text-slate-650">
      
      {/* HEADER ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div className="text-left">
          <h2 className="text-xl font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-teal-650" /> Dispatch & Order Registry
          </h2>
          <p className="text-xs text-slate-400 mt-1">Audit customer purchase logs, verify packaging checklists, and generate invoices.</p>
        </div>
      </div>

      {/* FILTER GRID */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between text-xs">
        <div className="flex-1 max-w-sm relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-450">
            <Search className="h-4 w-4" />
          </span>
          <input 
            type="text" 
            placeholder="Search order #, customer name, phone, destination..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0B4F8C]"
          />
        </div>
        
        <div className="flex flex-wrap gap-3 items-center font-bold">
          
          {/* Status Select */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-600 focus:outline-none border-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending Fulfillment</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          {/* Payment / Route filter */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            <CreditCard className="h-3.5 w-3.5 text-slate-400" />
            <select 
              value={paymentFilter}
              onChange={e => setPaymentFilter(e.target.value)}
              className="bg-transparent text-slate-600 focus:outline-none border-none cursor-pointer"
            >
              <option value="all">All Payment Routes</option>
              <option value="COD">COD (Cash on Delivery)</option>
              <option value="Online">Online Payments (UPI/Card)</option>
              <option value="International">International Shipping</option>
            </select>
          </div>

        </div>
      </div>

      {/* TABLE DISPLAY */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-5">Order #</th>
                <th className="py-4 px-5">Customer</th>
                <th className="py-4 px-5">Phone</th>
                <th className="py-4 px-5">Country</th>
                <th className="py-4 px-5">Payment Method</th>
                <th className="py-4 px-5">Shipping Route</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Invoice Total</th>
                <th className="py-4 px-5 text-center">Fulfill</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
              {filteredOrders.map(order => (
                <tr 
                  key={order.id} 
                  className={`hover:bg-slate-50/50 transition cursor-pointer ${
                    selectedOrder && selectedOrder.id === order.id ? 'bg-[#EEF6FF] border-l-2 border-[#0B4F8C]' : ''
                  }`}
                >
                  <td 
                    onClick={() => setSelectedOrder(order)}
                    className="py-4.5 px-5 font-mono font-bold text-[#0B4F8C]"
                  >
                    #{order.id}
                  </td>
                  <td 
                    onClick={() => setSelectedOrder(order)}
                    className="py-4.5 px-5 font-extrabold text-[#172B4D]"
                  >
                    {order.customer}
                  </td>
                  <td 
                    onClick={() => setSelectedOrder(order)}
                    className="py-4.5 px-5 text-slate-500 font-mono"
                  >
                    {order.phone}
                  </td>
                  <td 
                    onClick={() => setSelectedOrder(order)}
                    className="py-4.5 px-5 text-slate-700"
                  >
                    {order.country}
                  </td>
                  <td 
                    onClick={() => setSelectedOrder(order)}
                    className="py-4.5 px-5 text-slate-500"
                  >
                    {order.payment}
                  </td>
                  <td 
                    onClick={() => setSelectedOrder(order)}
                    className="py-4.5 px-5 text-slate-500"
                  >
                    {order.shipping}
                  </td>
                  <td 
                    onClick={() => setSelectedOrder(order)}
                    className="py-4.5 px-5"
                  >
                    <span className={`inline-flex px-2.5 py-0.5 text-[9px] font-bold rounded-full border uppercase tracking-wider ${
                      order.status === 'Delivered' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : order.status === 'Pending'
                        ? 'bg-amber-50 text-amber-600 border-amber-200 animate-pulse'
                        : order.status === 'Refunded'
                        ? 'bg-rose-50 text-rose-650 border-rose-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td 
                    onClick={() => setSelectedOrder(order)}
                    className="py-4.5 px-5 text-right font-black text-slate-800"
                  >
                    ₹{order.amount.toLocaleString()}
                  </td>
                  <td className="py-4.5 px-5 text-center">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-55 text-[10px] font-bold rounded-lg text-slate-600 transition cursor-pointer"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400 font-medium">
                    No orders matching selected criteria found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
            {/* ── SLIDE OVER DETAILS DRAWER ── */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden text-xs">
          
          {/* Backdrop */}
          <div 
            onClick={() => setSelectedOrder(null)}
            className={`absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 ${
              animateIn ? 'opacity-100' : 'opacity-0'
            }`} 
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className={`w-screen max-w-md bg-white border-l border-slate-200 text-slate-700 flex flex-col justify-between shadow-2xl relative transition-transform duration-300 ease-out transform ${
              animateIn ? 'translate-x-0' : 'translate-x-full'
            }`}>
              
              {/* Drawer Header */}
              <div className="px-6 py-5 bg-white border-b border-slate-100 flex justify-between items-center shrink-0">
                <div className="text-left space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-[#172B4D]">Order #{selectedOrder.id}</span>
                    <span className={`inline-flex px-2.5 py-0.5 text-[9px] font-bold rounded-full border uppercase tracking-wider ${
                      selectedOrder.status === 'Delivered' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : selectedOrder.status === 'Pending'
                        ? 'bg-amber-55/60 text-amber-600 border-amber-200 animate-pulse'
                        : selectedOrder.status === 'Refunded'
                        ? 'bg-rose-50 text-rose-650 border-rose-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-semibold">Fulfillment & Shipping Audit</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="text-slate-455 hover:text-slate-900 p-1.5 hover:bg-slate-50 rounded-full transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                
                {/* Status Toggles Premium Segmented Selector */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider text-left">Fulfillment Status Toggles</span>
                  <div className="bg-slate-200/50 border border-slate-300/40 p-1 rounded-xl flex gap-1 text-[11px] font-bold">
                    {[
                      { key: 'Pending', label: 'Pending', color: 'bg-amber-500 text-slate-950 font-extrabold shadow-sm' },
                      { key: 'Delivered', label: 'Delivered', color: 'bg-emerald-500 text-white font-extrabold shadow-sm' },
                      { key: 'Cancelled', label: 'Cancelled', color: 'bg-slate-600 text-white font-extrabold shadow-sm' }
                    ].map(statusOption => (
                      <button 
                        key={statusOption.key}
                        type="button"
                        onClick={() => handleUpdateStatus(selectedOrder.id, statusOption.key)}
                        className={`flex-1 py-2 text-center rounded-lg transition-all duration-200 cursor-pointer ${
                          selectedOrder.status === statusOption.key 
                            ? statusOption.color 
                            : 'text-slate-500 hover:text-slate-950 bg-transparent hover:bg-slate-100/50'
                        }`}
                      >
                        {statusOption.label}
                      </button>
                    ))}
                  </div>
                  {selectedOrder.status !== 'Refunded' ? (
                    <button 
                      type="button"
                      onClick={() => handleRefund(selectedOrder.id, selectedOrder.amount)}
                      className="w-full py-2 bg-rose-50 border border-rose-200 hover:bg-rose-500 hover:text-white rounded-xl text-[11px] text-rose-650 font-bold transition duration-200 cursor-pointer"
                    >
                      Issue Full Refund (₹{selectedOrder.amount.toLocaleString()})
                    </button>
                  ) : (
                    <div className="w-full py-2 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-600 text-center font-bold">
                      Refund Completed
                    </div>
                  )}
                </div>

                {/* Shipping & Customer Grid */}
                <div className="grid grid-cols-1 gap-4 font-semibold text-slate-600">
                  
                  {/* Customer Card */}
                  <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-4 text-left space-y-3.5">
                    <div className="flex gap-2.5 items-center text-[#172B4D] font-bold border-b border-slate-150 pb-2.5">
                      <User className="h-4 w-4 text-teal-650" />
                      <span className="text-[10px] uppercase tracking-wider">Customer Profile</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[#0B4F8C] flex items-center justify-center font-extrabold text-sm border border-blue-100 shrink-0 shadow-sm">
                        {customerInitials}
                      </div>
                      <div className="text-left leading-tight min-w-0">
                        <p className="text-sm font-extrabold text-slate-800 truncate">{selectedOrder.customer}</p>
                        <p className="text-xs text-slate-400 font-bold font-mono truncate">{customerEmail}</p>
                      </div>
                    </div>
                    <div className="pt-1.5 space-y-1.5 text-xs font-semibold text-slate-500">
                      <p className="flex justify-between">
                        <span>Mobile Phone:</span>
                        <span className="text-slate-800 font-mono">{selectedOrder.phone}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Shipment Destination:</span>
                        <span className="text-slate-850">{selectedOrder.country}</span>
                      </p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-4 text-left space-y-3">
                    <div className="flex gap-2.5 items-center text-[#172B4D] font-bold border-b border-slate-150 pb-2">
                      <MapPin className="h-4 w-4 text-sky-655" />
                      <span className="text-[10px] uppercase tracking-wider">Shipping Coordinates</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-bold text-[11px]">
                      {selectedOrder.shippingAddress || '102, Green Glen Layout, Outer Ring Road, Bellandur, Bengaluru, Karnataka, 560103'}
                    </p>
                  </div>

                </div>

                {/* Items & Fulfillment Checklist */}
                <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-4 text-left space-y-3.5 font-semibold">
                  <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                    <div className="flex gap-2.5 items-center text-[#172B4D] font-bold">
                      <FileText className="h-4 w-4 text-indigo-650" />
                      <span className="text-[10px] uppercase tracking-wider">Package Contents</span>
                    </div>
                    <span className="text-[9px] font-bold text-[#14B8A6] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                      Packing Checklist
                    </span>
                  </div>
                  <div className="space-y-2">
                    {selectedOrder.medicines && selectedOrder.medicines.map((m: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center py-2.5 px-3 bg-white border border-slate-200 rounded-xl hover:border-slate-350 transition duration-150">
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            defaultChecked={selectedOrder.status === 'Delivered'}
                            className="h-4.5 w-4.5 rounded border-slate-350 text-teal-650 focus:ring-teal-500 cursor-pointer" 
                          />
                          <span className="text-slate-750 font-bold text-[11px]">{m.name} <span className="text-slate-400 font-extrabold text-xs ml-1">x{m.qty}</span></span>
                        </label>
                        <span className="font-mono text-slate-800 font-extrabold">₹{(m.price * m.qty).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-150 pt-3 flex justify-between items-center font-bold text-slate-850">
                      <span>Total Invoice Value:</span>
                      <span className="text-base text-[#0B4F8C] font-black">₹{selectedOrder.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery and Courier Logistics */}
                <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-4 text-left space-y-3.5">
                  <div className="flex gap-2.5 items-center text-[#172B4D] font-bold border-b border-slate-150 pb-2">
                    <Truck className="h-4 w-4 text-teal-655" />
                    <span className="text-[10px] uppercase tracking-wider">Courier & Logistics</span>
                  </div>
                  <div className="space-y-3 font-semibold">
                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
                      <div>
                        <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Courier Agency</span>
                        <span className="text-slate-800 font-extrabold block mt-0.5">{selectedOrder.shipping.split(' ')[2] || 'Delhivery India'}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Shipment Mode</span>
                        <span className="text-slate-800 font-extrabold block mt-0.5">{selectedOrder.shipping}</span>
                      </div>
                    </div>
                    <div className="space-y-1 pt-1">
                      <label className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Tracking ID Code</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={selectedOrder.tracking}
                          readOnly
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-mono text-xs focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedOrder.tracking)}
                          className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900 rounded-xl transition cursor-pointer flex items-center justify-center min-w-[38px]"
                          title="Copy Code"
                        >
                          {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipment Timeline Steps */}
                <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-4 text-left space-y-4 font-semibold">
                  <div className="flex gap-2.5 items-center text-[#172B4D] font-bold border-b border-slate-150 pb-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span className="text-[10px] uppercase tracking-wider">Operations Timeline</span>
                  </div>
                  <div className="space-y-4 relative pl-5 border-l-2 border-slate-200">
                    <div className="relative">
                      <div className="absolute -left-[27px] top-0.5 bg-slate-900 text-[#F8FAFC] p-0.5 rounded-full"><CheckCircle2 className="h-3.5 w-3.5 fill-current text-emerald-500 bg-white" /></div>
                      <p className="text-slate-750 font-extrabold text-[11px]">Order Placed & Validated</p>
                      <p className="text-[10px] text-slate-400 font-semibold">Day 1, 09:30 AM</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[27px] top-0.5 bg-white rounded-full"><CheckCircle2 className={`h-3.5 w-3.5 ${selectedOrder.status !== 'Pending' ? 'text-emerald-555 fill-current' : 'text-slate-300'}`} /></div>
                      <p className="text-slate-700 font-bold text-[11px]">Pouch Packaging Finalized</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{selectedOrder.status !== 'Pending' ? 'Day 1, 02:40 PM' : 'Fulfillment pending check'}</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[27px] top-0.5 bg-white rounded-full"><CheckCircle2 className={`h-3.5 w-3.5 ${selectedOrder.status === 'Delivered' ? 'text-emerald-555 fill-current' : 'text-slate-300'}`} /></div>
                      <p className="text-slate-700 font-bold text-[11px]">Handed to Courier Partner</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{selectedOrder.status === 'Delivered' ? 'Day 2, 10:15 AM' : 'Pending dispatch'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Actions Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-3.5 font-bold">
                <button 
                  onClick={() => mockPrint('Invoice', selectedOrder.id)}
                  className="flex-1 flex justify-center items-center gap-1.5 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-[10px] text-slate-700 rounded-xl transition cursor-pointer"
                >
                  Print Invoice
                </button>
                <button 
                  onClick={() => mockPrint('Label', selectedOrder.id)}
                  className="flex-1 flex justify-center items-center gap-1.5 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-[10px] text-slate-700 rounded-xl transition cursor-pointer"
                >
                  Print Label
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
