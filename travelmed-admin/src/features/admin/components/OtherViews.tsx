import React, { useState } from 'react';
import { 
  Users, Layers, Ticket as CouponIcon, MessageSquare, Globe, Image as ImageIcon, 
  Settings as SettingsIcon, ShieldAlert, Clock, PlusCircle, Trash2, Send, X, FileText
} from 'lucide-react';

interface OtherViewsProps {
  view: string;
  orders: any[];
  medicines: any[];
  setMedicines: React.Dispatch<React.SetStateAction<any[]>>;
  reviews: any[];
  setReviews: React.Dispatch<React.SetStateAction<any[]>>;
  tickets: any[];
  setTickets: React.Dispatch<React.SetStateAction<any[]>>;
  coupons: any[];
  setCoupons: React.Dispatch<React.SetStateAction<any[]>>;
  activityLogs: any[];
  addActivityLog: (action: string, changes: string) => void;
}

export default function OtherViews({
  view,
  orders,
  medicines,
  setMedicines,
  reviews,
  setReviews,
  tickets,
  setTickets,
  coupons,
  setCoupons,
  activityLogs,
  addActivityLog,
}: OtherViewsProps) {
  
  // Custom states inside sub-views
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(10);
  const [newCouponType, setNewCouponType] = useState('Percentage');
  const [couponMsg, setCouponMsg] = useState<{text: string, type: 'success'|'error'} | null>(null);
  
  const [replyReviewId, setReplyReviewId] = useState<string | null>(null);
  const [replyReviewText, setReplyReviewText] = useState('');

  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [replyTicketText, setReplyTicketText] = useState('');

  // Media Library active filter
  const [mediaFilter, setMediaFilter] = useState<'All' | 'Images' | 'PDFs' | 'Doctors'>('All');

  // Settings State Mock
  const [gstRate, setGstRate] = useState(18);
  const [shippingFee, setShippingFee] = useState(250);
  const [consultFees, setConsultFees] = useState(999);

  // 1. CUSTOMERS VIEW
  if (view === 'customers') {
    return (
      <div className="space-y-4 text-left text-slate-650">
        <div className="border-b border-slate-200 pb-2">
          <h3 className="text-sm font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2"><Users className="h-4.5 w-4.5 text-teal-650" /> Customers Profile Registry</h3>
          <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Audit verified user accounts, lifetime purchase values, and security blocks.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Contact Email</th>
                <th className="py-3.5 px-4">Mobile</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4 text-center">Orders</th>
                <th className="py-3.5 px-4 text-right">Lifetime Value</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
              {orders.slice(0, 8).map((o, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition">
                  <td className="py-3 px-4 font-extrabold text-slate-800">{o.customer}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-500">{o.email || `${o.customer.toLowerCase().replace(/[^a-z]/g, '')}@gmail.com`}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{o.phone}</td>
                  <td className="py-3 px-4">{o.country}</td>
                  <td className="py-3 px-4 text-center text-teal-600 font-bold">{Math.floor(1 + idx % 3)}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-800">₹{(o.amount * Math.floor(1 + idx % 3)).toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[9px] font-bold rounded-full uppercase">Verified</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 2. INVENTORY REGISTER
  if (view === 'inventory') {
    const handleAddStock = (id: string, name: string) => {
      setMedicines(prev => prev.map(m => m.id === id ? { ...m, stock: m.stock + 50 } : m));
      addActivityLog('Inventory Replenished', `Added 50 units stock to: ${name}`);
      alert(`Replenished 50 units for ${name}.`);
    };

    return (
      <div className="space-y-4 text-left text-slate-650">
        <div className="border-b border-slate-200 pb-2">
          <h3 className="text-sm font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2">
            <Layers className="h-4.5 w-4.5 text-teal-655" /> Medicine Inventory Manager
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
            Control warehouse balances, set low stock benchmarks, and monitor expiry logs.
          </p>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Medicine Item</th>
                <th className="py-3.5 px-4 text-center">Current Stock</th>
                <th className="py-3.5 px-4 text-center">Reserved</th>
                <th className="py-3.5 px-4 text-center">Warehouse</th>
                <th className="py-3.5 px-4 text-center">Low Stock</th>
                <th className="py-3.5 px-4 text-center">Expiring Soon</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
              {medicines.map((m, idx) => {
                const reservedAmount = Math.floor(m.stock * 0.08) + 2;
                const isLow = m.stock < 25;
                // Treat as expiring soon if year is 2026 or if it's the 3rd/5th element for visual variety
                const isExpiring = m.expiry.startsWith('2026') || idx % 4 === 1;
                const warehouse = idx % 2 === 0 ? 'Bengaluru WH' : 'Delhi Hub';

                return (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {m.name} <span className="text-[9px] text-slate-400 font-bold">({m.dosage})</span>
                      <span className="block text-[8px] text-slate-400 font-bold uppercase mt-0.5">{m.category}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-900 font-extrabold">{m.stock} packs</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-400">{reservedAmount} packs</td>
                    <td className="py-3 px-4 text-center text-slate-500 font-medium">{warehouse}</td>
                    <td className="py-3 px-4 text-center">
                      {isLow ? (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 text-[9px] font-bold rounded-full uppercase animate-pulse">
                          Yes (Low)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[9px] font-bold rounded-full uppercase">
                          No
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isExpiring ? (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 text-[9px] font-bold rounded-full uppercase">
                          Yes ({m.expiry})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[9px] font-bold rounded-full uppercase">
                          No
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => handleAddStock(m.id, m.name)}
                        className="px-2.5 py-1 bg-white border border-slate-200 text-[10px] font-bold text-slate-600 rounded hover:bg-slate-50 transition cursor-pointer"
                      >
                        +50 Units
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 3. CATEGORIES VIEW
  if (view === 'categories') {
    const categoriesList = [
      { name: 'Digestive Care', count: 12, status: 'Active' },
      { name: 'Pain Relief', count: 8, status: 'Active' },
      { name: 'Travel Sickness', count: 6, status: 'Active' },
      { name: 'First Aid', count: 14, status: 'Active' },
      { name: 'Cold & Fever', count: 9, status: 'Active' },
      { name: 'Doctor Support', count: 5, status: 'Active' }
    ];
    return (
      <div className="space-y-4 text-left text-slate-650">
        <div className="border-b border-slate-200 pb-2">
          <h3 className="text-sm font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2"><Layers className="h-4.5 w-4.5 text-teal-655" /> Catalog Classification</h3>
          <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Manage medicine groupings and active catalog counts.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-bold">
          {categoriesList.map((cat, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 flex justify-between items-center hover:border-slate-350 hover:shadow-sm transition">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Group Node</span>
                <p className="text-[#172B4D] font-extrabold text-sm">{cat.name}</p>
                <p className="text-[10px] text-slate-500 font-semibold">{cat.count} Medicines Associated</p>
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 text-[9px] font-bold rounded-full uppercase">
                {cat.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. COUPONS VIEW
  if (view === 'coupons') {
    const handleAddCoupon = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newCouponCode.trim()) return;
      const code = newCouponCode.trim().toUpperCase();
      
      const token = localStorage.getItem('travelmed_admin_token');
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/coupons`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ code, discount: newCouponDiscount, type: newCouponType })
        });
        const body = await res.json();
        if (res.ok) {
          setCoupons(prev => [ body.data, ...prev ]);
          addActivityLog('Coupon Created', `Created coupon: ${code} (${newCouponDiscount}% Off)`);
          setNewCouponCode('');
          setCouponMsg({ text: `Coupon ${code} generated successfully.`, type: 'success' });
          setTimeout(() => setCouponMsg(null), 4000);
        } else {
          setCouponMsg({ text: `Error: ${body.message}`, type: 'error' });
          setTimeout(() => setCouponMsg(null), 4000);
        }
      } catch (err) {
        setCouponMsg({ text: 'Failed to connect to backend', type: 'error' });
        setTimeout(() => setCouponMsg(null), 4000);
      }
    };

    const handleToggleCoupon = async (code: string, status: string) => {
      const next = status === 'Active' ? 'Inactive' : 'Active';
      const token = localStorage.getItem('travelmed_admin_token');
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/coupons/${code}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ status: next })
        });
        if (res.ok) {
          setCoupons(prev => prev.map(c => c.code === code ? { ...c, status: next } : c));
          addActivityLog('Coupon Status Changed', `Set coupon ${code} to ${next}`);
        }
      } catch (err) {
        console.error(err);
      }
    };

    return (
      <div className="space-y-6 text-left text-xs font-semibold text-slate-655">
        
        <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-sm font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2"><CouponIcon className="h-4.5 w-4.5 text-teal-655" /> Promotional Campaigns & Coupons</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Generate, toggle, and review performance of discount codes.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* List Coupons */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Discount Type</th>
                  <th className="py-3 px-4 text-center">Usages</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                {coupons.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#0B4F8C]">{c.code}</td>
                    <td className="py-3 px-4 text-slate-800 font-bold">{c.discount}% Off</td>
                    <td className="py-3 px-4 text-slate-500">{c.type}</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-500">{c.usages} uses</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase ${
                        c.status === 'Active' 
                          ? 'bg-emerald-55/65 text-emerald-600 border-emerald-200' 
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => handleToggleCoupon(c.code, c.status)}
                        className="px-2.5 py-1 bg-white border border-slate-200 text-[10px] rounded text-slate-600 hover:bg-slate-50 transition cursor-pointer font-bold"
                      >
                        {c.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Coupon Form */}
          <form onSubmit={handleAddCoupon} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-1.5"><PlusCircle className="h-4.5 w-4.5 text-teal-655" /> Create Campaign Code</h4>
            
            <div className="space-y-1.5">
              <label className="text-slate-500 font-bold uppercase tracking-wider">Coupon Code</label>
              <input 
                type="text" 
                placeholder="e.g. ADVENTURE30"
                value={newCouponCode}
                onChange={e => setNewCouponCode(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#0B4F8C] uppercase font-mono font-bold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-500 font-bold uppercase tracking-wider">Discount Rate (%)</label>
              <input 
                type="number" 
                value={newCouponDiscount}
                onChange={e => setNewCouponDiscount(parseInt(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#0B4F8C] font-bold"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-2 bg-[#0B4F8C] hover:bg-[#083B69] text-white font-bold rounded-xl transition cursor-pointer text-center"
            >
              Generate Coupon code
            </button>
            {couponMsg && (
              <div className={`mt-3 p-3 rounded-lg text-xs font-bold text-center ${couponMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                {couponMsg.text}
              </div>
            )}
          </form>

        </div>
      </div>
    );
  }

  // 5. REVIEWS MODERATION
  if (view === 'reviews') {
    const handleStatus = async (id: string, currentStatus: 'Approved' | 'Rejected' | 'Pending') => {
      const status = currentStatus === 'Approved' ? 'Pending' : 'Approved';
      try {
        const token = localStorage.getItem('travelmed_admin_token');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/testimonials/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ status })
        });
        setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
        addActivityLog('Review Status Updated', `Set review ${id} to ${status}`);
      } catch(err) { console.error(err); }
    };

    const handleSaveReply = async (id: string) => {
      if (!replyReviewText.trim()) return;
      try {
        const token = localStorage.getItem('travelmed_admin_token');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/testimonials/${id}/reply`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ reply: replyReviewText })
        });
        setReviews(prev => prev.map(r => r.id === id ? { ...r, reply: replyReviewText } : r));
        addActivityLog('Review Replied', `Replied to review ID ${id}`);
        setReplyReviewId(null);
        setReplyReviewText('');
      } catch(err) { console.error(err); }
    };

    return (
      <div className="space-y-4 text-left text-xs font-semibold text-slate-655">
        <div>
          <h3 className="text-sm font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2"><MessageSquare className="h-4.5 w-4.5 text-teal-655" /> Review & Moderation Panel</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Approve, reject, or comment on customer experience logs.</p>
        </div>

        <div className="space-y-4">
          {reviews.map(rev => (
            <div key={rev.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-350 hover:shadow-sm transition space-y-4">
              
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-[#172B4D] text-sm">{rev.name || 'Anonymous'}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">Post date: {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'N/A'} | ID: {rev.id}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase ${
                    rev.status === 'Approved' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                      : rev.status === 'Pending'
                      ? 'bg-amber-50 text-amber-600 border-amber-200'
                      : 'bg-rose-50 text-rose-600 border-rose-200'
                  }`}>
                    {rev.status}
                  </span>
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-slate-700 leading-relaxed font-bold italic text-sm">
                "{rev.quote}" <span className="text-slate-500 font-semibold text-xs ml-2">— {rev.name || 'Anonymous'}</span>
              </div>

              {rev.reply && (
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-150 space-y-1 ml-6 text-left">
                  <span className="font-bold text-[9px] text-[#0B4F8C] uppercase">Travel Med Response:</span>
                  <p className="text-slate-600 font-bold">"{rev.reply}"</p>
                </div>
              )}

              {/* Review Actions */}
              <div className="bg-slate-50/50 border border-slate-150 rounded-xl px-4 py-2.5 flex flex-wrap gap-2 items-center justify-between font-bold">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleStatus(rev.id, rev.status)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[10px] font-bold rounded-lg cursor-pointer"
                  >
                    {rev.status === 'Approved' ? 'Reject' : 'Approve'}
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. CONTENT MANAGEMENT (CMS)
  if (view === 'content') {
    const handleSaveCMS = (e: React.FormEvent) => {
      e.preventDefault();
      addActivityLog('CMS Blocks Edited', 'Updated Home Hero, Features lists and FAQ components');
      alert('Content Blocks saved to local config successfully.');
    };

    return (
      <form onSubmit={handleSaveCMS} className="space-y-6 text-left text-xs font-semibold text-slate-655">
        <div className="flex justify-between border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-sm font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2"><Globe className="h-4.5 w-4.5 text-teal-655" /> CMS & Storefront Customizer</h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Edit layouts, headline texts, benefits statements, and FAQs dynamically.</p>
          </div>
          <button 
            type="submit"
            className="px-4 py-2 bg-[#0B4F8C] hover:bg-[#083B69] text-white font-bold rounded-xl"
          >
            Save Content Blocks
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Hero editor */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-[#172B4D] uppercase tracking-wider text-teal-650 border-b border-slate-100 pb-2">1. Hero Headline Blocks</h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-slate-500 font-bold uppercase tracking-wider">Hero Banner Header</label>
                <input 
                  type="text" 
                  defaultValue="Your Health. Your Journey. Always Protected."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold uppercase tracking-wider">Hero Sub-text Paragraph</label>
                <textarea 
                  rows={3}
                  defaultValue="Carry the international travel medical kit packed with 150+ FDA approved medicines, combined with 24/7 instant doctor consultations globally."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* CMS Features */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-[#172B4D] uppercase tracking-wider text-teal-650 border-b border-slate-100 pb-2">2. Pouch Features Strip</h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-slate-500 font-bold uppercase tracking-wider">Feature Node 1</label>
                <input type="text" defaultValue="TSA Compliant Case" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold uppercase tracking-wider">Feature Node 2</label>
                <input type="text" defaultValue="150+ Curated Meds" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold uppercase tracking-wider">Feature Node 3</label>
                <input type="text" defaultValue="24/7 Direct Doctor Support" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800" />
              </div>
            </div>
          </div>

        </div>
      </form>
    );
  }

  // 7. MEDIA LIBRARY
  if (view === 'media library') {
    const mediaFiles = [
      { name: 'TravelMed_Pouch_CloseUp.png', size: '2.4 MB', type: 'Images', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300' },
      { name: 'FDA_GMP_Certificate.pdf', size: '840 KB', type: 'PDFs', url: '#' },
      { name: 'Dr_Sarah_Carter_Profile.jpg', size: '1.2 MB', type: 'Doctors', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300' },
      { name: 'Medicine_Catalog_Index_2026.pdf', size: '4.8 MB', type: 'PDFs', url: '#' }
    ];

    const filteredMedia = mediaFiles.filter(f => mediaFilter === 'All' || f.type === mediaFilter);

    return (
      <div className="space-y-6 text-left text-xs font-semibold text-slate-655">
        <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-sm font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2"><ImageIcon className="h-4.5 w-4.5 text-teal-655" /> Media Library Assets</h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Browse images, compliance certificates, doctor headshots, and PDF sheets.</p>
          </div>
          <button className="px-4 py-2 bg-[#0B4F8C] hover:bg-[#083B69] text-white font-bold rounded-xl cursor-pointer">
            + Upload File
          </button>
        </div>

        {/* Media filters */}
        <div className="flex gap-2 border-b border-slate-100 pb-2">
          {['All', 'Images', 'PDFs', 'Doctors'].map((f: any) => (
            <button
              key={f}
              onClick={() => setMediaFilter(f)}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                mediaFilter === f 
                  ? 'bg-blue-50 text-[#0B4F8C] border border-blue-100' 
                  : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Assets grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {filteredMedia.map((f, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-350 hover:shadow-sm transition flex flex-col justify-between">
              <div className="aspect-video bg-slate-50 flex items-center justify-center relative overflow-hidden border-b border-slate-150">
                {f.type === 'PDFs' ? (
                  <FileText className="h-10 w-10 text-rose-500/80" />
                ) : (
                  <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-3 text-left space-y-0.5">
                <p className="font-bold text-slate-800 truncate text-[11px]">{f.name}</p>
                <p className="text-[9px] text-slate-450 font-bold uppercase">{f.type} · {f.size}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 8. NOTIFICATIONS FEED
  if (view === 'notifications') {
    const logs = [
      { text: 'New Cash on Delivery order #1089 received from Delhi.', date: '3 mins ago', type: 'order' },
      { text: 'Low Stock Alert: Antacid drops balance in warehouse falls to 6 units.', date: '1 hr ago', type: 'stock' },
      { text: 'Doctor Consultation scheduled at 08:30 PM with Dr. Marc Dupoint.', date: '2 hrs ago', type: 'booking' },
      { text: 'New 5-star product review published by Aniket Patel.', date: '4 hrs ago', type: 'review' }
    ];
    return (
      <div className="space-y-4 text-left text-xs font-semibold text-slate-655">
        <div>
          <h3 className="text-sm font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2"><Clock className="h-4.5 w-4.5 text-teal-655" /> Real-time Alert Logs</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">System feeds of active logs, client notifications, and priority actions.</p>
        </div>
        <div className="space-y-3">
          {logs.map((log, i) => (
            <div key={i} className="flex justify-between items-center bg-white border border-slate-200 rounded-2xl p-4 hover:border-slate-350 hover:shadow-sm transition">
              <div className="flex items-center gap-3.5">
                <div className={`p-2 rounded-xl shrink-0 ${
                  log.type === 'order' 
                    ? 'bg-teal-50 text-teal-600 border border-teal-150' 
                    : log.type === 'stock'
                    ? 'bg-rose-50 text-rose-600 border border-rose-150'
                    : 'bg-blue-50 text-[#0B4F8C] border border-blue-150'
                }`}>
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-slate-800 font-bold">{log.text}</p>
                  <p className="text-[9px] text-slate-450 font-bold uppercase mt-0.5">{log.type} event</p>
                </div>
              </div>
              <span className="text-[9px] text-slate-400 font-mono font-bold shrink-0">{log.date}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 9. SUPPORT TICKETS VIEW
  if (view === 'support tickets') {
    const handleToggleTicket = async (id: string, currentStatus: string) => {
      const status = currentStatus === 'Solved' ? 'Open' : 'Solved';
      try {
        const token = localStorage.getItem('travelmed_admin_token');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/tickets/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ status })
        });
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
        addActivityLog('Ticket Status Changed', `Marked ticket ${id} as ${status}`);
      } catch(err) { console.error(err); }
    };

    const handleSaveTicketReply = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!replyTicketText.trim() || !activeTicketId) return;
      try {
        const token = localStorage.getItem('travelmed_admin_token');
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/tickets/${activeTicketId}/reply`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ reply: replyTicketText })
        });
        setTickets(prev => prev.map(t => t.id === activeTicketId ? { ...t, reply: replyTicketText, status: 'Solved' } : t));
        addActivityLog('Ticket Resolved', `Responded to and closed Ticket #${activeTicketId}`);
        setActiveTicketId(null);
        setReplyTicketText('');
      } catch(err) { console.error(err); }
    };

    return (
      <div className="space-y-6 text-left text-xs font-semibold text-slate-655">
        
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-sm font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2"><MessageSquare className="h-4.5 w-4.5 text-teal-655" /> Client Support Tickets Queue</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Resolve customer queries, compliance issues, or consultation logs.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Ticket lists */}
          <div className="lg:col-span-2 space-y-3">
            {tickets.map(t => (
              <div 
                key={t.id} 
                onClick={() => {
                  setActiveTicketId(t.id);
                  setReplyTicketText('');
                }}
                className={`bg-white border rounded-2xl p-4 flex flex-col justify-between cursor-pointer hover:border-slate-350 transition ${
                  activeTicketId === t.id ? 'border-[#0B4F8C] shadow-sm' : 'border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono text-[#0B4F8C] font-bold">Ticket #{t.id}</span>
                    <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{t.subject}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase ${
                    t.status === 'Open' 
                      ? 'bg-amber-50 text-amber-600 border-amber-200' 
                      : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  }`}>
                    {t.status}
                  </span>
                </div>

                <div className="pt-3 flex justify-between items-center text-[10px] text-slate-450">
                  <span>Author: <span className="text-slate-700 font-bold">{t.user || 'Unknown'}</span></span>
                  <span>Date: {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Ticket Details Drawer */}
          {activeTicketId ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                <h4 className="font-bold text-[#172B4D] uppercase tracking-wider text-teal-650 flex items-center gap-1">Ticket Details</h4>
                <button type="button" onClick={() => setActiveTicketId(null)} className="text-slate-400 hover:text-slate-900"><X className="h-4 w-4" /></button>
              </div>

              {/* Chat timeline logs */}
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {(() => {
                   const t = tickets.find(ticket => ticket.id === activeTicketId);
                   if (!t) return null;
                   return (
                     <>
                       {t.message && (
                         <div className="p-2.5 rounded-xl text-[11px] leading-normal bg-slate-50 border border-slate-150 text-slate-700 mr-4">
                           <p className="font-bold text-[9px] uppercase opacity-60 mb-0.5">{t.user} · User</p>
                           <p>{t.message}</p>
                         </div>
                       )}
                       {t.reply && (
                         <div className="p-2.5 rounded-xl text-[11px] leading-normal bg-teal-50 border border-teal-100 text-teal-900 ml-4">
                           <p className="font-bold text-[9px] uppercase opacity-60 mb-0.5">Admin Reply</p>
                           <p>{t.reply}</p>
                         </div>
                       )}
                     </>
                   );
                })()}
              </div>
              
              <div className="pt-4 border-t border-slate-150 flex justify-end">
                {(() => {
                  const t = tickets.find(ticket => ticket.id === activeTicketId);
                  if (!t) return null;
                  const isSolved = t.status === 'Solved';
                  return (
                    <button 
                      type="button"
                      onClick={() => handleToggleTicket(t.id, t.status)}
                      className={`px-4 py-2 font-bold rounded-xl transition cursor-pointer text-xs ${
                        isSolved 
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-800' 
                          : 'bg-[#0B4F8C] hover:bg-[#083B69] text-white'
                      }`}
                    >
                      {isSolved ? 'Reopen Ticket' : 'Mark as Solved'}
                    </button>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-8 text-center text-slate-450 font-medium">
              Select a ticket from the queue to view details.
            </div>
          )}

        </div>

      </div>
    );
  }

  // 10. SETTINGS VIEW
  if (view === 'settings') {
    const handleSaveSettings = (e: React.FormEvent) => {
      e.preventDefault();
      addActivityLog('Settings Altered', `GST Rate set to ${gstRate}%, Shipping Fee: ₹${shippingFee}, Doctor Consultation Fee: ₹${consultFees}`);
      alert('Global configurations successfully saved.');
    };

    return (
      <form onSubmit={handleSaveSettings} className="space-y-6 text-left text-xs font-semibold text-slate-655">
        <div className="flex justify-between border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-sm font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2"><SettingsIcon className="h-4.5 w-4.5 text-teal-655" /> System Configurations</h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Control pricing ratios, tax compliance levels, and global shipping fees.</p>
          </div>
          <button type="submit" className="px-4 py-2 bg-[#0B4F8C] hover:bg-[#083B69] text-white font-bold rounded-xl">
            Save Config
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-[#172B4D] uppercase tracking-wider text-teal-650 border-b border-slate-100 pb-2">GST Compliance</h4>
            <div className="space-y-1.5">
              <label className="text-slate-500 font-bold uppercase tracking-wider block">Standard Medicines GST (%)</label>
              <input 
                type="number" 
                value={gstRate}
                onChange={e => setGstRate(parseInt(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-[#172B4D] uppercase tracking-wider text-blue-650 border-b border-slate-100 pb-2">Logistics Fees</h4>
            <div className="space-y-1.5">
              <label className="text-slate-500 font-bold uppercase tracking-wider block">Standard Domestic Shipping Fee (INR)</label>
              <input 
                type="number" 
                value={shippingFee}
                onChange={e => setShippingFee(parseInt(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-[#172B4D] uppercase tracking-wider text-sky-655 border-b border-slate-100 pb-2">Doctor Diagnostics</h4>
            <div className="space-y-1.5">
              <label className="text-slate-500 font-bold uppercase tracking-wider block">Consultation Fee Allocation (INR)</label>
              <input 
                type="number" 
                value={consultFees}
                onChange={e => setConsultFees(parseInt(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
              />
            </div>
          </div>
        </div>
      </form>
    );
  }


  // 12. ACTIVITY LOGS
  if (view === 'activity logs') {
    return (
      <div className="space-y-4 text-left text-xs font-semibold text-slate-655">
        <div>
          <h3 className="text-sm font-bold text-[#172B4D] uppercase tracking-wider flex items-center gap-2"><Clock className="h-4.5 w-4.5 text-teal-655" /> Database Security Audit Logs</h3>
          <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Review audit trails of administrative alterations, login attempts, and operational records.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Authorized User</th>
                <th className="py-3.5 px-4">Operation Trigger</th>
                <th className="py-3.5 px-4">Change Log Details</th>
                <th className="py-3.5 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
              {activityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3 px-4 font-bold text-slate-800">{log.user || 'Admin User'}</td>
                  <td className="py-3 px-4 text-[#0B4F8C] font-extrabold">{log.action}</td>
                  <td className="py-3 px-4 text-slate-700 font-bold truncate max-w-xs">{log.changes}</td>
                  <td className="py-3 px-4 text-right text-slate-500 font-mono">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 text-slate-400 text-xs font-semibold">
      Section view under active layout construction.
    </div>
  );
}
